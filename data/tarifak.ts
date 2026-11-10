/* ------------------------------------------------------------------
   Tomilk Prod — ÁRTÁBLÁZATOK (típusos konstansok)
   ==================================================================
   Minden ár innen szerkeszthető. Forrás:
   „Menetrend_Arak_Csikszereda_Balanbanya_Lovesz_HU.xlsx”.

   A megállónevek magyarul a hiteles adat (a jegyár-mátrixok ezekre a
   kulcsokra épülnek). Később román megjelenített nevek egy külön
   leképezéssel hozzáadhatók (ld. app/content.ts STOP_HU mintájára),
   a számítási logika érintése nélkül.

   ⚠ A cégnek ellenőriznie kell (a forrás több helyen „fényképről
   leolvasva”, kézzel írt):
   - A „Jegyek és bérletek” lapon a Csíkszereda→Csíkszenttamás JEGY 11,
     míg a jegyár-mátrixban 12. Itt a mátrix (12) a használt érték.
   - Két különleges bérletnél az eredetin 180 / 130 alternatív érték is
     szerepel (Csíkkarcfalva–Csíkszenttamás, Csíkszenttamás–Csíkmadaras).
   ------------------------------------------------------------------ */

/** A két menetrend szerinti járat azonosítója. */
export type RouteId = 'balan' | 'lovesz';

/** Jegy / bérlet típusok. `passIdx` a PASSES-tömb oszlopa (jegynél null). */
export type TicketTypeId = 'jegy' | 'b1' | 'b3' | 'b2';

export type RouteDef = {
  /** Magyar járatnév (megjelenítéshez). */
  readonly name: string;
  /** Megállók a járat útvonalának sorrendjében. A mátrix-indexek ezekre mutatnak. */
  readonly stops: readonly string[];
};

export type TicketTypeDef = {
  readonly id: TicketTypeId;
  /** A PASSES-sor oszlopindexe: [1 havi, 3 heti, 2 heti]; jegynél null. */
  readonly passIdx: 0 | 1 | 2 | null;
};

/* A csíkszeredai csomópont — a bérletárak erre/erről hivatalosak. */
export const HOME = 'Csíkszereda';

/* ---- Járatok és megállók (sorrend = a járat útvonala) ---- */
export const ROUTES: Record<RouteId, RouteDef> = {
  balan: {
    name: 'Csíkszereda – Balánbánya',
    stops: [
      'Csíkszereda',
      'Csíkcsicsó',
      'Madéfalva',
      'Csíkrákos',
      'Csíkmadaras',
      'Csíkdánfalva',
      'Csíkkarcfalva',
      'Csíkjenőfalva',
      'Csíkszenttamás',
      'Csíkszentdomokos',
      'Balánbánya',
    ],
  },
  lovesz: {
    name: 'Csíkszereda – Lóvész',
    stops: [
      'Csíkszereda',
      'Csíkcsicsó',
      'Madéfalva',
      'Csíkrákos',
      'Göröcsfalva',
      'Vacsárcsi',
      'Csíkszentmihály',
      'Ajnád',
      'Lóvész',
    ],
  },
};

/* ---- Jegyár-mátrixok (RON), érvényes 2025. augusztus 1-től ----
   Minden sor/oszlop a ROUTES[route].stops sorrendjében; az átló null.
   A mátrix szimmetrikus (bármelyik irányban ugyanaz az ár).            */
export const TICKETS: Record<RouteId, readonly (readonly (number | null)[])[]> = {
  balan: [
    [null, 8, 8, 9, 10, 11, 11, 12, 12, 15, 17],
    [8, null, 6, 7, 8, 9, 10, 10, 11, 12, 15],
    [8, 6, null, 6, 7, 8, 9, 9, 10, 12, 15],
    [9, 7, 6, null, 6, 7, 8, 9, 9, 11, 13],
    [10, 8, 7, 6, null, 6, 7, 8, 8, 10, 12],
    [11, 9, 8, 7, 6, null, 5, 7, 7, 9, 12],
    [11, 10, 9, 8, 7, 5, null, 4, 7, 9, 11],
    [12, 10, 9, 9, 8, 7, 4, null, 6, 8, 11],
    [12, 11, 10, 9, 8, 7, 7, 6, null, 7, 10],
    [15, 12, 12, 11, 10, 9, 9, 8, 7, null, 8],
    [17, 15, 15, 13, 12, 12, 11, 11, 10, 8, null],
  ],
  lovesz: [
    [null, 8, 8, 9, 9, 10, 10, 11, 12],
    [8, null, 6, 7, 7, 8, 8, 9, 10],
    [8, 6, null, 6, 6, 7, 7, 8, 9],
    [9, 7, 6, null, 4, 5, 6, 7, 8],
    [9, 7, 6, 4, null, 4, 5, 6, 7],
    [10, 8, 7, 5, 4, null, 4, 5, 7],
    [10, 8, 7, 6, 5, 4, null, 4, 6],
    [11, 9, 8, 7, 6, 5, 4, null, 5],
    [12, 10, 9, 8, 7, 7, 6, 5, null],
  ],
};

/* ---- Bérletárak Csíkszeredából (RON), érvényes 2026. szeptember 7-től ----
   Kulcs: a másik megálló neve. Érték: [1 havi, 3 heti, 2 heti].
   Csíkszeredából induló VAGY oda érkező útra mindhárom típus hivatalos. */
export const PASSES: Record<string, readonly [number, number, number]> = {
  // Csíkszereda – Lóvész ág
  Csíkcsicsó: [271, 210, 150],
  Madéfalva: [271, 210, 150],
  Csíkrákos: [304, 235, 170],
  Göröcsfalva: [304, 235, 170],
  Vacsárcsi: [337, 260, 185],
  Csíkszentmihály: [337, 260, 185],
  Ajnád: [370, 294, 207],
  Lóvész: [405, 320, 218],
  // Csíkszereda – Balánbánya ág
  Csíkmadaras: [337, 250, 185],
  Csíkdánfalva: [370, 284, 207],
  Csíkkarcfalva: [370, 284, 207],
  Csíkjenőfalva: [405, 320, 218],
  Csíkszenttamás: [405, 320, 218],
  Csíkszentdomokos: [470, 370, 260],
  Balánbánya: [535, 420, 295],
};

/* ---- Különleges HAVI bérletek más megállók között (RON) ----
   [honnan, hová, havi ár]. A keresés iránytól független.
   ⚠ fényképről leolvasva — a cégnek ellenőriznie kell. */
export const SPECIAL_PASSES: readonly (readonly [string, string, number])[] = [
  ['Csíkcsicsó', 'Csíkdánfalva', 304],
  ['Csíkcsicsó', 'Csíkszenttamás', 337],
  ['Madéfalva', 'Csíkszentdomokos', 337],
  ['Madéfalva', 'Csíkdánfalva', 271],
  ['Csíkrákos', 'Csíkszentdomokos', 337],
  ['Csíkrákos', 'Csíkdánfalva', 271],
  ['Csíkrákos', 'Csíkjenőfalva', 271],
  ['Csíkmadaras', 'Csíkcsicsó', 304],
  ['Csíkkarcfalva', 'Csíkszenttamás', 231], // eredetin még: 180 / 130
  ['Csíkszenttamás', 'Csíkmadaras', 231], // eredetin még: 180 / 130
  ['Csíkszentdomokos', 'Csíkkarcfalva', 271],
  ['Csíkszentdomokos', 'Csíkdánfalva', 264],
  ['Csíkszentdomokos', 'Csíkmadaras', 304],
  ['Balánbánya', 'Csíkcsicsó', 370],
  ['Balánbánya', 'Csíkkarcfalva', 304],
  ['Balánbánya', 'Csíkdánfalva', 337],
  ['Balánbánya', 'Csíkmadaras', 337],
];

/* ---- Km-tábla (RON) ----
   Más megállópárok HAVI bérletét a jegyárból becsüljük.
   [jegyár-küszöb, havi bérlet]. Ha a jegyár két sor közé esik, a
   KÖVETKEZŐ (magasabb küszöbű) sort kell használni → ezért az első
   olyan sort választjuk, ahol jegyár <= küszöb.
   (Forrás „Árak km szerint” lap: 1-5→6/231, 6-10→8/281, 11-15→9/304,
    16-20→10/297, 21-25→11/337, 26-30→12/405, 31-40→15/470, 41-45→17/535.) */
export const KM_BANDS: readonly (readonly [number, number])[] = [
  [6, 231],
  [8, 281],
  [9, 304],
  [10, 297],
  [11, 337],
  [12, 405],
  [15, 470],
  [17, 535],
];

/* ---- Jegy/bérlet típusok (sorrend = a legördülő sorrendje) ---- */
export const TICKET_TYPES: readonly TicketTypeDef[] = [
  { id: 'jegy', passIdx: null },
  { id: 'b1', passIdx: 0 },
  { id: 'b3', passIdx: 1 },
  { id: 'b2', passIdx: 2 },
];

/* ==================================================================
   KÜLÖNJÁRAT — szerkeszthető árazási beállítások
   ================================================================== */
export type KulonjaratConfig = {
  /** Euró árfolyam (lej / euró). */
  readonly eurRon: number;
  /** Egy busz maximális létszáma. */
  readonly busMax: number;
  /** Sofőr napidíja a 2. naptól (lej / nap / busz). */
  readonly driverDayRon: number;
  /** Üresjárat díja Csíkszeredával (€/km). */
  readonly emptyEurPerKm: number;
  /** Az üres hazautazást csak akkor választjuk, ha legalább ennyivel
      olcsóbb a sofőr napidíjánál (0.15 = 15%). */
  readonly emptyMargin: number;
  /** Az ársáv szélei a középértékhez képest. */
  readonly rangeLow: number;
  readonly rangeHigh: number;
  /** Az ársáv kerekítése (lej); az alsó lefelé, a felső felfelé. */
  readonly roundTo: number;
  /** A bázisország (ennek km-jére nincs útdíj). */
  readonly homeCountry: string;
  /** Becsült útdíj busznak a külföldi szakaszokra (€/km). */
  readonly tollEurPerKm: Readonly<Record<string, number>>;
  /** Alapértelmezett útdíj a felsoroltakon kívüli országokra (€/km). */
  readonly tollDefaultEurPerKm: number;
  /** Kilométerdíj-sávok az utassal megtett km-re (€/km), létszám szerint.
      Az első olyan sávot használjuk, ahol létszám <= maxPax. */
  readonly rateBands: readonly { readonly maxPax: number; readonly eurPerKm: number }[];
};

export const KULONJARAT_CONFIG: KulonjaratConfig = {
  eurRon: 5.35,
  busMax: 70,
  driverDayRon: 250,
  emptyEurPerKm: 0.8,
  emptyMargin: 0.15,
  rangeLow: 0.93,
  rangeHigh: 1.07,
  roundTo: 50,
  homeCountry: 'Románia',
  tollEurPerKm: {
    Magyarország: 0.15,
    Ausztria: 0.3,
    Németország: 0.15,
  },
  tollDefaultEurPerKm: 0.12,
  rateBands: [
    { maxPax: 20, eurPerKm: 1.0 },
    { maxPax: 50, eurPerKm: 1.3 },
    { maxPax: 70, eurPerKm: 1.5 },
  ],
};

/* Lábjegyzet-dátumok (a jegykalkulátor alatt jelennek meg). */
export const FARE_VALID_FROM = '2025. augusztus 1.';
export const PASS_VALID_FROM = '2026. szeptember 7.';
