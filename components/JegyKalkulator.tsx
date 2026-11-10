'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { COPY } from '@/app/content';
import { ROUTES, TICKET_TYPES, type RouteId, type TicketTypeId } from '@/data/tarifak';
import { szamitJegyar, type JegyarResult } from '@/lib/jegyar';

type T = (typeof COPY)['hu'];

/** Jegy- és bérletár-kalkulátor. A számítás a tiszta lib-ben történik;
    itt csak a kiválasztás állapota és a megjelenítés van. */
export default function JegyKalkulator({ t }: { t: T }) {
  const c = t.jegyCalc;
  const [route, setRoute] = useState<RouteId>('balan');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [type, setType] = useState<TicketTypeId>('jegy');

  const stops = ROUTES[route].stops;

  // Járatváltáskor a nem létező megállókat elvetjük (a prototípus is így tesz).
  const changeRoute = (r: RouteId) => {
    const next = ROUTES[r].stops;
    setRoute(r);
    setFrom(prev => (next.includes(prev) ? prev : ''));
    setTo(prev => (next.includes(prev) ? prev : ''));
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const result: JegyarResult = useMemo(
    () => szamitJegyar({ route, from, to, type }),
    [route, from, to, type]
  );

  const typeLabel = c.types[type];
  const routeLabel = from && to ? `${from} → ${to}` : '';
  const isNeutral = result.kind === 'error' && result.reason === 'missingStops';

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

        <div className="bk-form">
          <label className="field field-full">
            <span>{c.route}</span>
            <select
              className="calc-select"
              value={route}
              onChange={e => changeRoute(e.target.value as RouteId)}
            >
              {(Object.keys(ROUTES) as RouteId[]).map(id => (
                <option key={id} value={id}>
                  {ROUTES[id].name}
                </option>
              ))}
            </select>
          </label>

          <div className="jk-pair">
            <label className="field">
              <span>{c.from}</span>
              <select
                className="calc-select"
                value={from}
                onChange={e => setFrom(e.target.value)}
              >
                <option value="">{c.selectStop}</option>
                {stops.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <button type="button" className="jk-swap" onClick={swap} aria-label={c.swap} title={c.swapTitle}>
              ⇄
            </button>

            <label className="field">
              <span>{c.to}</span>
              <select className="calc-select" value={to} onChange={e => setTo(e.target.value)}>
                <option value="">{c.selectStop}</option>
                {stops.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field field-full">
            <span>{c.type}</span>
            <select
              className="calc-select"
              value={type}
              onChange={e => setType(e.target.value as TicketTypeId)}
            >
              {TICKET_TYPES.map(tt => (
                <option key={tt.id} value={tt.id}>
                  {c.types[tt.id]}
                </option>
              ))}
            </select>
          </label>

          <div className="calc-ticket" aria-live="polite">
            {result.kind === 'price' ? (
              <>
                <div className="calc-ticket-info">
                  <div className="calc-ticket-route">{routeLabel}</div>
                  <div className="calc-ticket-type">{typeLabel}</div>
                  {result.note && <span className="calc-badge">{c.badge[result.note]}</span>}
                </div>
                <div className="calc-ticket-stub">
                  <div className="calc-ticket-price">{result.price}</div>
                  <div className="calc-ticket-cur">{c.currency}</div>
                </div>
              </>
            ) : (
              <p
                className={`calc-msg${isNeutral ? ' is-neutral' : ''}`}
                role={isNeutral ? undefined : 'alert'}
              >
                {c.err[result.reason]}
              </p>
            )}
          </div>

          <p className="calc-note">{c.note}</p>
        </div>
      </div>
    </section>
  );
}
