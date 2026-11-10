import { describe, expect, it } from 'vitest';
import { KULONJARAT_CONFIG } from '@/data/tarifak';
import { szamitKulonjarat, type Leg } from './kulonjarat';

/** Üres (útdíj nélküli, belföldi) szakasz adott km-rel. */
const leg = (km: number): Leg => ({ km, countries: km > 0 ? [{ name: 'Románia', km }] : [] });

const cfg = KULONJARAT_CONFIG;

describe('szamitKulonjarat (árfolyam 5,35; útdíj nélkül)', () => {
  it('45 fő, oda-vissza, 1 nap, 100 km (a=0, b=100): középérték 1391, sáv 1250–1500', () => {
    const r = szamitKulonjarat(
      { main: leg(100), baseToFrom: leg(0), toToBase: leg(100), pax: 45, roundTrip: true, days: 1 },
      cfg
    );
    expect(r.buses).toEqual([45]);
    expect(r.extraMode).toBe('none');
    expect(Math.round(r.midpoint)).toBe(1391);
    expect(r.low).toBe(1250);
    expect(r.high).toBe(1500);
  });

  it('100 fő, csak oda, 100 km (a=0, b=100): 2 busz (70+30), középérték 2354, sáv 2150–2550', () => {
    const r = szamitKulonjarat(
      { main: leg(100), baseToFrom: leg(0), toToBase: leg(100), pax: 100, roundTrip: false, days: 1 },
      cfg
    );
    expect(r.buses).toEqual([70, 30]);
    expect(r.busCount).toBe(2);
    expect(Math.round(r.midpoint)).toBe(2354);
    expect(r.low).toBe(2150);
    expect(r.high).toBe(2550);
  });

  it('20 fő, oda-vissza, 8 nap, 300 km (a=0, b=300): sofőr napidíj marad, középérték 4960, sáv 4600–5350', () => {
    const r = szamitKulonjarat(
      { main: leg(300), baseToFrom: leg(0), toToBase: leg(300), pax: 20, roundTrip: true, days: 8 },
      cfg
    );
    expect(r.extraMode).toBe('driver');
    expect(r.extraRon).toBe(1750);
    expect(Math.round(r.midpoint)).toBe(4960);
    expect(r.low).toBe(4600);
    expect(r.high).toBe(5350);
  });

  it('20 fő, oda-vissza, 8 nap, 60 km (a=0, b=60): üres hazautazás olcsóbb, középérték 1156, sáv 1050–1250', () => {
    const r = szamitKulonjarat(
      { main: leg(60), baseToFrom: leg(0), toToBase: leg(60), pax: 20, roundTrip: true, days: 8 },
      cfg
    );
    expect(r.extraMode).toBe('empty');
    expect(Math.round(r.midpoint)).toBe(1156);
    expect(r.low).toBe(1050);
    expect(r.high).toBe(1250);
  });
});

describe('szamitKulonjarat — útdíj', () => {
  it('a külföldi szakaszokra becsült útdíjat számol (Magyarország 0,15 €/km)', () => {
    const noToll = szamitKulonjarat(
      { main: leg(100), baseToFrom: leg(0), toToBase: leg(100), pax: 10, roundTrip: false, days: 1 },
      cfg
    );
    const withToll = szamitKulonjarat(
      {
        main: { km: 100, countries: [{ name: 'Magyarország', km: 100 }] },
        baseToFrom: leg(0),
        toToBase: leg(100),
        pax: 10,
        roundTrip: false,
        days: 1,
      },
      cfg
    );
    expect(noToll.tollRon).toBe(0);
    // 100 km * 0.15 €/km * 1 busz * 5.35 lej/€ = 80.25 lej
    expect(withToll.tollRon).toBeCloseTo(80.25, 2);
  });
});
