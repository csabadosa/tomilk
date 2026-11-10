/* ------------------------------------------------------------------
   Tomilk Prod — különjárat árajánlat számítás (tiszta függvény).
   Nincs React, nincs mellékhatás; a konfiguráció paraméterként jön,
   így könnyen tesztelhető és a díjak egy helyen szerkeszthetők
   (ld. data/tarifak.ts KULONJARAT_CONFIG).
   ------------------------------------------------------------------ */

import type { KulonjaratConfig } from '@/data/tarifak';

/** Egy útszakasz: hossz + az érintett országok km-ei. */
export type Leg = {
  readonly km: number;
  readonly countries: readonly { readonly name: string; readonly km: number }[];
};

/** A /api/route végpont válasza (a kliens ezt adja a számításnak). */
export type RouteResponse = {
  readonly from: string;
  readonly to: string;
  /** Főszakasz: indulás → cél (egy út). */
  readonly main: Leg;
  /** Csíkszereda → indulás (üresjárat az utasokért). */
  readonly base_to_from: Leg;
  /** Cél → Csíkszereda (üres hazaút). */
  readonly to_to_base: Leg;
};

export type KulonjaratInput = {
  readonly main: Leg;
  readonly baseToFrom: Leg;
  readonly toToBase: Leg;
  /** Utasok száma (>= 1). */
  readonly pax: number;
  readonly roundTrip: boolean;
  /** Napok száma (oda-vissza: visszaút − indulás + 1; csak oda: 1). */
  readonly days: number;
};

/** A 2. naptól számított többletköltség forrása. */
export type ExtraMode = 'none' | 'driver' | 'empty';

export type KulonjaratResult = {
  /** Utassal megtett km (oda-vissza esetén a főszakasz kétszerese). */
  readonly loadedKm: number;
  /** Üresjárat km Csíkszeredával (buszonként). */
  readonly emptyKm: number;
  /** Buszok létszámai (pl. [70, 30]). */
  readonly buses: readonly number[];
  readonly busCount: number;
  /** Kilométerdíj lejben (összes busz, utassal). */
  readonly loadedRon: number;
  /** Üresjárat díja lejben (összes busz). */
  readonly emptyRon: number;
  /** Külföldi útdíj lejben (becsült, összes busz). */
  readonly tollRon: number;
  /** Többletköltség a 2. naptól (sofőr napidíj vagy üres hazautazás), lejben. */
  readonly extraRon: number;
  readonly extraMode: ExtraMode;
  /** Figyelembe vett sofőr-napok (napidíjas napok = napok − 1). */
  readonly driverDays: number;
  /** Középérték lejben (kerekítetlen). */
  readonly midpoint: number;
  /** Ársáv alsó határa (roundTo-ra lefelé kerekítve). */
  readonly low: number;
  /** Ársáv felső határa (roundTo-ra felfelé kerekítve). */
  readonly high: number;
};

/** A létszámhoz tartozó €/km a sávokból (az utolsó sáv a tartalék). */
function rateFor(pax: number, config: KulonjaratConfig): number {
  for (const band of config.rateBands) {
    if (pax <= band.maxPax) return band.eurPerKm;
  }
  return config.rateBands[config.rateBands.length - 1].eurPerKm;
}

/** Egy szakasz becsült útdíja (€), csak a bázisországon kívüli km-ekre. */
function tollOf(leg: Leg, config: KulonjaratConfig): number {
  let eur = 0;
  for (const c of leg.countries) {
    if (c.name === config.homeCountry) continue;
    const rate = config.tollEurPerKm[c.name] ?? config.tollDefaultEurPerKm;
    eur += c.km * rate;
  }
  return eur;
}

/** Buszok felosztása: teljes busMax-os buszok + a maradék egy buszban. */
function splitBuses(pax: number, busMax: number): number[] {
  const buses: number[] = [];
  for (let i = 0; i < Math.floor(pax / busMax); i++) buses.push(busMax);
  const rest = pax % busMax;
  if (rest > 0) buses.push(rest);
  return buses;
}

/**
 * Különjárat tájékoztató ár számítása.
 * A logika pontosan a prototípusból (kulonjarat-arajanlat.html) származik.
 */
export function szamitKulonjarat(
  input: KulonjaratInput,
  config: KulonjaratConfig
): KulonjaratResult {
  const { main, baseToFrom, toToBase, pax, roundTrip, days } = input;
  const { eurRon, busMax, driverDayRon, emptyEurPerKm, emptyMargin } = config;

  // Utassal megtett km: oda-vissza esetén a főszakasz kétszerese.
  const loadedKm = main.km * (roundTrip ? 2 : 1);

  // Üresjárat Csíkszeredával: oda-vissza → 2 × (Csíkszereda → indulás);
  // csak oda → (Csíkszereda → indulás) + (cél → Csíkszereda).
  const emptyKm = roundTrip ? 2 * baseToFrom.km : baseToFrom.km + toToBase.km;

  const buses = splitBuses(pax, busMax);
  const busCount = buses.length;

  // Kilométerdíj (euró): buszonként a saját díjszabásával.
  let loadedEur = 0;
  for (const p of buses) loadedEur += rateFor(p, config) * loadedKm;

  // Üresjárat díja (euró), minden buszra.
  const emptyEur = emptyKm * emptyEurPerKm * busCount;

  // Külföldi útdíj (euró), minden buszra; az üresjáratokra is.
  const mainToll = tollOf(main, config) * (roundTrip ? 2 : 1);
  const emptyToll = roundTrip
    ? 2 * tollOf(baseToFrom, config)
    : tollOf(baseToFrom, config) + tollOf(toToBase, config);
  const tollEur = busCount * (mainToll + emptyToll);

  // Többletköltség a 2. naptól.
  const driverDays = Math.max(0, days - 1);
  let extraRon = driverDays * driverDayRon * busCount;
  let extraMode: ExtraMode = extraRon > 0 ? 'driver' : 'none';

  // Több napos oda-vissza: üres hazautazás (cél → Csíkszereda és vissza)
  // vs. sofőr napidíj — ha legalább emptyMargin-nel olcsóbb, azt vesszük.
  if (roundTrip && days >= 2) {
    const emptyHomeRon =
      busCount * 2 * (toToBase.km * emptyEurPerKm + tollOf(toToBase, config)) * eurRon;
    if (emptyHomeRon < extraRon * (1 - emptyMargin)) {
      extraRon = emptyHomeRon;
      extraMode = 'empty';
    }
  }

  const loadedRon = loadedEur * eurRon;
  const emptyRon = emptyEur * eurRon;
  const tollRon = tollEur * eurRon;
  const midpoint = loadedRon + emptyRon + tollRon + extraRon;

  const { rangeLow, rangeHigh, roundTo } = config;
  const low = Math.floor((midpoint * rangeLow) / roundTo) * roundTo;
  const high = Math.ceil((midpoint * rangeHigh) / roundTo) * roundTo;

  return {
    loadedKm,
    emptyKm,
    buses,
    busCount,
    loadedRon,
    emptyRon,
    tollRon,
    extraRon,
    extraMode,
    driverDays,
    midpoint,
    low,
    high,
  };
}

/** Segéd: RouteResponse → KulonjaratInput a számításhoz. */
export function inputFromRoute(
  route: RouteResponse,
  params: { pax: number; roundTrip: boolean; days: number }
): KulonjaratInput {
  return {
    main: route.main,
    baseToFrom: route.base_to_from,
    toToBase: route.to_to_base,
    pax: params.pax,
    roundTrip: params.roundTrip,
    days: params.days,
  };
}
