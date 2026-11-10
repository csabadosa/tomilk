'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { COPY } from '@/app/content';
import { KULONJARAT_CONFIG } from '@/data/tarifak';
import {
  inputFromRoute,
  szamitKulonjarat,
  type KulonjaratResult,
  type RouteResponse,
} from '@/lib/kulonjarat';

type T = (typeof COPY)['hu'];

type Out = {
  res: KulonjaratResult;
  route: RouteResponse;
  pax: number;
  round: boolean;
  days: number;
};

const MS_PER_DAY = 86_400_000;

export default function KulonjaratKalkulator({ t }: { t: T }) {
  const c = t.kulonCalc;

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [depart, setDepart] = useState('');
  const [ret, setRet] = useState('');
  const [pax, setPax] = useState('');
  const [round, setRound] = useState(true);
  // „Ha ismeri a pontos távolságot” mezők:
  const [mkm, setMkm] = useState('');
  const [mfk, setMfk] = useState('');
  const [mka, setMka] = useState('');
  const [mkb, setMkb] = useState('');

  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<Out | null>(null);

  // Ezres csoportositas normal szokozzel (a hu-HU nem toro szokozeit csereljuk).
  const fmt = (n: number) =>
    Math.round(n)
      .toLocaleString('hu-HU')
      .replace(/[\u00a0\u202f]/g, ' ');

  // Indulásváltáskor a visszaút igazodik (nem lehet korábbi).
  const onDepart = (v: string) => {
    setDepart(v);
    if (!ret || ret < v) setRet(v);
  };

  /** Kézi távolság → RouteResponse (a km-mezők kitöltésekor). */
  const manualRoute = (): RouteResponse => {
    const km = Math.max(parseFloat(mkm) || 0, 0);
    const f = Math.min(Math.max(parseFloat(mfk) || 0, 0), km);
    const a = Math.max(parseFloat(mka) || 0, 0);
    const b = mkb === '' ? km : Math.max(parseFloat(mkb) || 0, 0);
    const home = KULONJARAT_CONFIG.homeCountry;
    const mainCountries =
      f > 0
        ? [{ name: home, km: km - f }, { name: 'Külföld', km: f }]
        : [{ name: home, km }];
    return {
      from,
      to,
      main: { km, countries: mainCountries },
      base_to_from: { km: a, countries: a > 0 ? [{ name: home, km: a }] : [] },
      to_to_base: { km: b, countries: b > 0 ? [{ name: home, km: b }] : [] },
    };
  };

  const fetchRoute = async (): Promise<RouteResponse> => {
    const res = await fetch(
      `/api/route?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
    );
    const data: unknown = await res.json();
    if (!res.ok) {
      const msg =
        typeof data === 'object' && data && 'error' in data
          ? String((data as { error: unknown }).error)
          : c.err.generic;
      throw new Error(msg);
    }
    return data as RouteResponse;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');

    const paxNum = parseInt(pax, 10);
    const hasManual = (parseFloat(mkm) || 0) > 0;

    if (!hasManual && (!from.trim() || !to.trim())) return setErr(c.err.route);
    if (!depart) return setErr(c.err.date);
    if (!(paxNum >= 1)) return setErr(c.err.pax);
    if (round && !ret) return setErr(c.err.ret);
    if (round && ret < depart) return setErr(c.err.retBefore);

    const days = round ? Math.round((+new Date(ret) - +new Date(depart)) / MS_PER_DAY) + 1 : 1;

    setBusy(true);
    try {
      const route = hasManual ? manualRoute() : await fetchRoute();
      const res = szamitKulonjarat(
        inputFromRoute(route, { pax: paxNum, roundTrip: round, days }),
        KULONJARAT_CONFIG
      );
      setOut({ res, route, pax: paxNum, round, days });
    } catch (e2) {
      setOut(null);
      setErr(e2 instanceof Error ? e2.message : c.err.generic);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="block booking-sec">
      <div className="wrap booking-wrap">
        <Link className="booking-back" href="/#top">
          {t.calcBack}
        </Link>
        <header className="sec-head">
          <h2>{c.title}</h2>
          <p>{c.lead}</p>
        </header>

        <form className="bk-form" onSubmit={submit} noValidate>
          <div className="bk-grid">
            <label className="field">
              <span>{c.from}</span>
              <input
                type="text"
                placeholder={c.fromPh}
                value={from}
                onChange={e => setFrom(e.target.value)}
                autoComplete="off"
              />
            </label>
            <label className="field">
              <span>{c.to}</span>
              <input
                type="text"
                placeholder={c.toPh}
                value={to}
                onChange={e => setTo(e.target.value)}
                autoComplete="off"
              />
            </label>
            <label className="field">
              <span>{c.departDate}</span>
              <input type="date" value={depart} onChange={e => onDepart(e.target.value)} />
            </label>
            <label className="field">
              <span>{c.pax}</span>
              <input
                type="number"
                min={1}
                max={500}
                inputMode="numeric"
                placeholder={c.paxPh}
                value={pax}
                onChange={e => setPax(e.target.value)}
              />
            </label>
          </div>

          <div className="bk-trip" style={{ marginTop: '1.1rem' }}>
            <span className="field-legend" id="kulon-trip">
              {c.tripType}
            </span>
            <div className="seg" role="group" aria-labelledby="kulon-trip">
              <button
                type="button"
                className={`seg-btn${!round ? ' is-on' : ''}`}
                aria-pressed={!round}
                onClick={() => setRound(false)}
              >
                {c.oneWay}
              </button>
              <button
                type="button"
                className={`seg-btn${round ? ' is-on' : ''}`}
                aria-pressed={round}
                onClick={() => setRound(true)}
              >
                {c.round}
              </button>
            </div>
          </div>

          {round && (
            <label className="field" style={{ marginTop: '1.1rem', maxWidth: 320 }}>
              <span>{c.returnDate}</span>
              <input
                type="date"
                value={ret}
                min={depart || undefined}
                onChange={e => setRet(e.target.value)}
              />
            </label>
          )}

          <details className="calc-advanced">
            <summary>{c.advanced}</summary>
            <div className="bk-grid" style={{ marginTop: '0.9rem' }}>
              <label className="field">
                <span>{c.mkm}</span>
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={mkm}
                  onChange={e => setMkm(e.target.value)}
                />
              </label>
              <label className="field">
                <span>{c.mfk}</span>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={mfk}
                  onChange={e => setMfk(e.target.value)}
                />
              </label>
              <label className="field">
                <span>{c.mka}</span>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={mka}
                  onChange={e => setMka(e.target.value)}
                />
              </label>
              <label className="field">
                <span>{c.mkb}</span>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder={c.mkbPh}
                  value={mkb}
                  onChange={e => setMkb(e.target.value)}
                />
              </label>
            </div>
          </details>

          <div className="bk-submit">
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? c.submitBusy : c.submit}
            </button>
          </div>

          {err && (
            <p className="bk-err" role="alert">
              {err}
            </p>
          )}
        </form>

        <div aria-live="polite">
          {out && <QuoteResult c={c} out={out} fmt={fmt} />}
        </div>

        <p className="calc-note">{c.note}</p>
      </div>
    </section>
  );
}

function QuoteResult({
  c,
  out,
  fmt,
}: {
  c: T['kulonCalc'];
  out: Out;
  fmt: (n: number) => string;
}) {
  const { res, route, pax, round, days } = out;
  const title = !route.from && !route.to ? c.givenDistance : `${route.from} → ${route.to}`;
  const meta = `${pax} ${c.paxUnit} · ${round ? c.round : c.oneWay} · ${days} ${c.dayUnit} · ${fmt(
    route.main.km
  )} ${c.perTrip}`;

  const rows: [string, string][] = [[c.rows.loadedKm, `${fmt(res.loadedKm)} km`]];
  if (res.emptyKm) rows.push([c.rows.emptyKm, `${fmt(res.emptyKm)} km`]);
  rows.push([c.rows.buses, `${res.busCount} ${c.busUnit} (${res.buses.join(' + ')} ${c.paxUnit})`]);
  rows.push([c.rows.loadedFee, `${fmt(res.loadedRon)} ${c.currency}`]);
  if (res.emptyRon) rows.push([c.rows.emptyFee, `${fmt(res.emptyRon)} ${c.currency}`]);
  if (res.tollRon) rows.push([c.rows.toll, `${fmt(res.tollRon)} ${c.currency}`]);
  if (res.extraRon) {
    const label =
      res.extraMode === 'empty' ? c.rows.emptyHome : c.rows.driver.replace('{days}', String(res.driverDays));
    rows.push([label, `${fmt(res.extraRon)} ${c.currency}`]);
  }
  rows.push([c.rows.midpoint, `${fmt(res.midpoint)} ${c.currency}`]);

  return (
    <div className="calc-quote">
      <div className="calc-quote-head">
        <div className="calc-quote-route">{title}</div>
        <div className="calc-quote-meta">{meta}</div>
      </div>
      <div className="calc-quote-stub">
        <div className="calc-quote-range">
          {fmt(res.low)} – {fmt(res.high)} {c.currency}
        </div>
        <div className="calc-quote-vat">{c.vat}</div>
      </div>
      <table className="calc-quote-rows">
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={i}>
              <td className="calc-quote-l">{label}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
