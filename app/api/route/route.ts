/* ------------------------------------------------------------------
   GET /api/route?from=...&to=...
   Szerveroldali távolság-végpont a különjárat-kalkulátorhoz.

   Válasz (JSON):
     { from, to, main, base_to_from, to_to_base }
   ahol Leg = { km: number, countries: { name: string; km: number }[] }.
     - main:         indulás → cél (egy út)
     - base_to_from: Csíkszereda → indulás
     - to_to_base:   cél → Csíkszereda
   Ha két végpont ugyanaz, km = 0.

   Szolgáltató: OpenRouteService (geokódolás + irányítás, profil:
   driving-hgv — a buszhoz a tehergépjármű-profil áll legközelebb).

   ORSZÁGONKÉNTI KM — választott megoldás és indoklás:
   Az ORS directions `extra_info=countryinfo` lehetősége numerikus,
   ORS-verziótól függő ország-azonosítókat ad vissza, amelyeket névre
   leképezni nem megbízható (téves azonosító → téves útdíj). Ezért a
   végpontok geokódolt országát (ISO-3) használjuk a szakasz
   besorolására: belföldi szakasz (mindkét vég Románia) → nincs útdíj;
   határon átnyúló szakasz → a külföldi végpont országára becsüljük
   (konzervatív becslés egy nem kötelező ajánlathoz). A pontos külföldi
   km-hez a kalkulátor „Ha ismeri a pontos távolságot” szekciója adható
   meg kézzel — az felülírja ezt a becslést.
   ------------------------------------------------------------------ */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { Leg, RouteResponse } from '@/lib/kulonjarat';

/* A csíkszeredai (Miercurea Ciuc) bázis fix koordinátája [lon, lat].
   A hub állandó, ezért nem geokódoljuk minden kérésnél. */
const BASE: Coord = { lon: 25.8019, lat: 46.3597, iso: 'ROU' };

const ORS = 'https://api.openrouteservice.org';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 perc
const RATE_LIMIT = { windowMs: 60 * 1000, max: 30 }; // 30 kérés / perc / IP
const SAME_POINT_DEG = 0.02; // ~2 km: ennyinél közelebbi végpontok = azonos hely

type Coord = { lon: number; lat: number; iso: string };

/* ISO-3 országkód → magyar név. A nem felsoroltak „egyéb külföld”. */
const ISO_HU: Record<string, string> = {
  ROU: 'Románia',
  HUN: 'Magyarország',
  AUT: 'Ausztria',
  DEU: 'Németország',
  SVK: 'Szlovákia',
  CZE: 'Csehország',
  POL: 'Lengyelország',
  UKR: 'Ukrajna',
  MDA: 'Moldova',
  BGR: 'Bulgária',
  SRB: 'Szerbia',
  HRV: 'Horvátország',
  SVN: 'Szlovénia',
  ITA: 'Olaszország',
  FRA: 'Franciaország',
  CHE: 'Svájc',
  NLD: 'Hollandia',
  BEL: 'Belgium',
  ESP: 'Spanyolország',
  GRC: 'Görögország',
};
const isoToHu = (iso: string | undefined): string =>
  (iso && ISO_HU[iso]) || 'Egyéb (külföld)';

/* Bemenet-ellenőrzés: ésszerű hossz és csak név-szerű karakterek. */
const placeSchema = z
  .string()
  .trim()
  .min(2, 'A település neve túl rövid.')
  .max(80, 'A település neve túl hosszú.')
  .regex(/^[\p{L}\p{M}0-9 .,'’\-/()]+$/u, 'A település neve érvénytelen karaktert tartalmaz.');

/* ---- egyszerű, instancián belüli gyorsítótár + rate limit ----
   (Fluid Compute mellett instancionként él; több instancia esetén
   legfeljebb enyhébb korlátot/kevesebb találatot jelent — nem kritikus.) */
const cache = new Map<string, { at: number; data: RouteResponse }>();
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter(t => now - t < RATE_LIMIT.windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > RATE_LIMIT.max;
}

class OrsError extends Error {}

async function geocode(text: string, apiKey: string): Promise<Coord> {
  const url = `${ORS}/geocode/search?api_key=${encodeURIComponent(apiKey)}&text=${encodeURIComponent(
    text
  )}&size=1`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new OrsError('geocode');
  const json = (await res.json()) as {
    features?: { geometry?: { coordinates?: [number, number] }; properties?: { country_a?: string } }[];
  };
  const f = json.features?.[0];
  const c = f?.geometry?.coordinates;
  if (!c) throw new UnknownPlaceError(text);
  return { lon: c[0], lat: c[1], iso: f?.properties?.country_a ?? '' };
}

class UnknownPlaceError extends Error {
  constructor(public place: string) {
    super('unknown-place');
  }
}

/** HGV-útvonal két pont közt; méter → km (egész). */
async function distanceKm(a: Coord, b: Coord, apiKey: string): Promise<number> {
  const res = await fetch(`${ORS}/v2/directions/driving-hgv`, {
    method: 'POST',
    headers: { Authorization: apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ coordinates: [[a.lon, a.lat], [b.lon, b.lat]] }),
  });
  if (!res.ok) throw new OrsError('directions');
  const json = (await res.json()) as { routes?: { summary?: { distance?: number } }[] };
  const meters = json.routes?.[0]?.summary?.distance;
  if (meters == null) throw new OrsError('directions');
  return Math.round(meters / 1000);
}

const samePoint = (a: Coord, b: Coord): boolean =>
  Math.abs(a.lon - b.lon) < SAME_POINT_DEG && Math.abs(a.lat - b.lat) < SAME_POINT_DEG;

/** Szakasz felépítése: km + becsült országonkénti bontás (ld. fenti indoklás). */
async function buildLeg(a: Coord, b: Coord, apiKey: string): Promise<Leg> {
  if (samePoint(a, b)) return { km: 0, countries: [] };
  const km = await distanceKm(a, b, apiKey);
  if (km === 0) return { km: 0, countries: [] };

  // Belföldi szakasz (mindkét vég Románia) → nincs útdíj.
  if (a.iso === 'ROU' && b.iso === 'ROU') {
    return { km, countries: [{ name: ISO_HU.ROU, km }] };
  }
  // Határon átnyúló szakasz → a külföldi végpont országára becsüljük.
  const foreign = a.iso !== 'ROU' ? a.iso : b.iso;
  return { km, countries: [{ name: isoToHu(foreign), km }] };
}

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return fwd?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

export async function GET(req: Request) {
  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'A távolság-szolgáltatás nincs beállítva. Kérjük, adja meg a km-t kézzel.' },
      { status: 503 }
    );
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: 'Túl sok kérés. Kérjük, próbálja újra egy perc múlva.' },
      { status: 429 }
    );
  }

  const url = new URL(req.url);
  const parsed = z
    .object({ from: placeSchema, to: placeSchema })
    .safeParse({ from: url.searchParams.get('from') ?? '', to: url.searchParams.get('to') ?? '' });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Érvénytelen bemenet.' },
      { status: 400 }
    );
  }
  const { from, to } = parsed.data;

  const key = `${from.toLowerCase()}|${to.toLowerCase()}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return NextResponse.json(cached.data);
  }

  try {
    const [fromCoord, toCoord] = await Promise.all([geocode(from, apiKey), geocode(to, apiKey)]);

    // A szakaszok sorban (az ORS ingyenes kvótát kímélve, nem párhuzamosan).
    const main = await buildLeg(fromCoord, toCoord, apiKey);
    const base_to_from = await buildLeg(BASE, fromCoord, apiKey);
    const to_to_base = await buildLeg(toCoord, BASE, apiKey);

    const data: RouteResponse = { from, to, main, base_to_from, to_to_base };
    cache.set(key, { at: Date.now(), data });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof UnknownPlaceError) {
      return NextResponse.json(
        { error: `Nem sikerült azonosítani: „${err.place}”. Kérjük, ellenőrizze a település nevét.` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        error:
          'A távolság kiszámítása jelenleg nem érhető el. Kérjük, próbálja újra, vagy adja meg a km-t kézzel.',
      },
      { status: 502 }
    );
  }
}
