import { describe, expect, it } from 'vitest';
import { szamitJegyar } from './jegyar';

describe('szamitJegyar — jegy', () => {
  it('Csíkszereda → Balánbánya, jegy = 17', () => {
    const r = szamitJegyar({ route: 'balan', from: 'Csíkszereda', to: 'Balánbánya', type: 'jegy' });
    expect(r).toEqual({ kind: 'price', price: 17 });
  });

  it('Madéfalva → Csíkrákos, jegy = 6', () => {
    const r = szamitJegyar({ route: 'balan', from: 'Madéfalva', to: 'Csíkrákos', type: 'jegy' });
    expect(r).toEqual({ kind: 'price', price: 6 });
  });

  it('a jegyár irányfüggetlen', () => {
    const ab = szamitJegyar({ route: 'balan', from: 'Csíkszereda', to: 'Balánbánya', type: 'jegy' });
    const ba = szamitJegyar({ route: 'balan', from: 'Balánbánya', to: 'Csíkszereda', type: 'jegy' });
    expect(ab).toEqual(ba);
  });
});

describe('szamitJegyar — bérlet', () => {
  it('Csíkszereda → Lóvész, 1 havi = 405', () => {
    const r = szamitJegyar({ route: 'lovesz', from: 'Csíkszereda', to: 'Lóvész', type: 'b1' });
    expect(r).toEqual({ kind: 'price', price: 405 });
  });

  it('Csíkszeredába érkező bérlet is hivatalos áron', () => {
    const r = szamitJegyar({ route: 'lovesz', from: 'Lóvész', to: 'Csíkszereda', type: 'b2' });
    expect(r).toEqual({ kind: 'price', price: 218 });
  });

  it('Madéfalva → Csíkdánfalva, 1 havi = 271 (különleges bérlet)', () => {
    const r = szamitJegyar({ route: 'balan', from: 'Madéfalva', to: 'Csíkdánfalva', type: 'b1' });
    expect(r).toEqual({ kind: 'price', price: 271, note: 'special' });
  });

  it('a különleges bérlet irányfüggetlen', () => {
    const r = szamitJegyar({ route: 'balan', from: 'Csíkdánfalva', to: 'Madéfalva', type: 'b1' });
    expect(r).toEqual({ kind: 'price', price: 271, note: 'special' });
  });

  it('Csíkrákos → Csíkmadaras, 1 havi = 231 (km-tábla, jegyár 6)', () => {
    const r = szamitJegyar({ route: 'balan', from: 'Csíkrákos', to: 'Csíkmadaras', type: 'b1' });
    expect(r).toEqual({ kind: 'price', price: 231, note: 'kmTable' });
  });

  it('Csíkrákos → Csíkmadaras, 3 heti = nincs adat', () => {
    const r = szamitJegyar({ route: 'balan', from: 'Csíkrákos', to: 'Csíkmadaras', type: 'b3' });
    expect(r).toEqual({ kind: 'error', reason: 'noPassData' });
  });

  it('Csíkrákos → Csíkmadaras, 2 heti = nincs adat', () => {
    const r = szamitJegyar({ route: 'balan', from: 'Csíkrákos', to: 'Csíkmadaras', type: 'b2' });
    expect(r).toEqual({ kind: 'error', reason: 'noPassData' });
  });
});

describe('szamitJegyar — hibák', () => {
  it('hiányzó megálló', () => {
    expect(szamitJegyar({ route: 'balan', from: '', to: 'Balánbánya', type: 'jegy' })).toEqual({
      kind: 'error',
      reason: 'missingStops',
    });
  });

  it('azonos megálló', () => {
    expect(
      szamitJegyar({ route: 'balan', from: 'Madéfalva', to: 'Madéfalva', type: 'jegy' })
    ).toEqual({ kind: 'error', reason: 'sameStop' });
  });
});
