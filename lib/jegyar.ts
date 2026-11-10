/* ------------------------------------------------------------------
   Tomilk Prod — jegy- és bérletár számítás (tiszta függvény).
   Nincs React, nincs mellékhatás. A függvény nem tartalmaz megjelenített
   szöveget: hiba/jelölés helyett KÓDOKAT ad vissza, amelyeket a
   komponens fordít le a felhasználó nyelvére (RO később bővíthető).
   ------------------------------------------------------------------ */

import {
  HOME,
  KM_BANDS,
  PASSES,
  ROUTES,
  SPECIAL_PASSES,
  TICKETS,
  TICKET_TYPES,
  type RouteId,
  type TicketTypeId,
} from '@/data/tarifak';

/** Az eredményen megjelenő jelölés (badge) oka. */
export type JegyarNote = 'special' | 'kmTable';

/** Hibakódok (a komponens fordítja magyar/román üzenetre). */
export type JegyarError = 'missingStops' | 'sameStop' | 'unknownStop' | 'noPassData';

export type JegyarInput = {
  readonly route: RouteId;
  readonly from: string;
  readonly to: string;
  readonly type: TicketTypeId;
};

export type JegyarResult =
  | { readonly kind: 'price'; readonly price: number; readonly note?: JegyarNote }
  | { readonly kind: 'error'; readonly reason: JegyarError };

/** Különleges havi bérlet keresése iránytól függetlenül. */
function findSpecialPass(from: string, to: string): number | null {
  for (const [a, b, price] of SPECIAL_PASSES) {
    if ((a === from && b === to) || (a === to && b === from)) return price;
  }
  return null;
}

/** Km-tábla: az első sor, ahol a jegyár <= küszöb (a magasabb sávot adja). */
function kmBandPass(ticketPrice: number): number | null {
  for (const [threshold, pass] of KM_BANDS) {
    if (ticketPrice <= threshold) return pass;
  }
  return null;
}

/**
 * Jegy- vagy bérletár egy adott járat két megállója között.
 *
 * Szabályok (a prototípusból, pontosan):
 * 1. Jegy: a mátrixból, bármelyik irányban.
 * 2. Bérlet, ha Csíkszereda az egyik végpont: hivatalos ár mindhárom típusra.
 * 3. Havi bérlet más megállók között: előbb a különleges lista, különben a
 *    km-tábla a jegyár alapján.
 * 4. 3/2 heti bérlet más megállók között: nincs adat.
 */
export function szamitJegyar(input: JegyarInput): JegyarResult {
  const { route, from, to, type } = input;

  if (!from || !to) return { kind: 'error', reason: 'missingStops' };
  if (from === to) return { kind: 'error', reason: 'sameStop' };

  const stops = ROUTES[route].stops;
  const fromIdx = stops.indexOf(from);
  const toIdx = stops.indexOf(to);
  if (fromIdx === -1 || toIdx === -1) return { kind: 'error', reason: 'unknownStop' };

  const typeDef = TICKET_TYPES.find(t => t.id === type);
  if (!typeDef) return { kind: 'error', reason: 'noPassData' };

  // 1) Jegy — a mátrixból.
  if (typeDef.passIdx === null) {
    const price = TICKETS[route][fromIdx][toIdx];
    if (price == null) return { kind: 'error', reason: 'sameStop' };
    return { kind: 'price', price };
  }

  // 2) Bérlet Csíkszeredából / oda — hivatalos ár.
  const other = from === HOME ? to : to === HOME ? from : null;
  if (other !== null) {
    const pass = PASSES[other];
    if (pass) return { kind: 'price', price: pass[typeDef.passIdx] };
  }

  // 3) Havi bérlet más megállók között.
  if (type === 'b1') {
    const special = findSpecialPass(from, to);
    if (special !== null) return { kind: 'price', price: special, note: 'special' };

    const ticketPrice = TICKETS[route][fromIdx][toIdx];
    if (ticketPrice != null) {
      const pass = kmBandPass(ticketPrice);
      if (pass !== null) return { kind: 'price', price: pass, note: 'kmTable' };
    }
  }

  // 4) 3/2 heti bérlet más megállók között — nincs adat.
  return { kind: 'error', reason: 'noPassData' };
}
