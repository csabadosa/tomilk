'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { COPY, Lang } from '@/app/content';
import { ROUTES, TICKET_TYPES, type RouteId, type TicketTypeId } from '@/data/tarifak';
import { szamitJegyar, type JegyarResult } from '@/lib/jegyar';

type T = (typeof COPY)['hu'];

/** Jegy- és bérletár-kalkulátor. A számítás a tiszta lib-ben történik;
    itt csak a kiválasztás állapota és a megjelenítés van. */
const STOP_RO: Record<string, string> = {
  'Csíkszereda': 'Miercurea Ciuc', 'Csíkcsicsó': 'Ciceu', 'Madéfalva': 'Siculeni',
  'Csíkrákos': 'Racu', 'Csíkmadaras': 'Mădăraș', 'Csíkdánfalva': 'Dănești',
  'Csíkkarcfalva': 'Cârța', 'Csíkjenőfalva': 'Ineu', 'Csíkszenttamás': 'Tomești',
  'Csíkszentdomokos': 'Sândominic', 'Balánbánya': 'Bălan', 'Göröcsfalva': 'Grădiștea',
  'Vacsárcsi': 'Văcărești', 'Csíkszentmihály': 'Mihăileni', 'Ajnád': 'Nădejdea', 'Lóvész': 'Livezi',
};

export default function JegyKalkulator({ t, lang }: { t: T; lang: Lang }) {
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
  const displayStop = (stop: string) => lang === 'ro' ? STOP_RO[stop] ?? stop : stop;
  const displayRoute = (id: RouteId) => {
    const routeStops = ROUTES[id].stops;
    return `${displayStop(routeStops[0])} – ${displayStop(routeStops[routeStops.length - 1])}`;
  };
  const routeLabel = from && to ? `${displayStop(from)} → ${displayStop(to)}` : '';
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

        <div className="jk-layout">
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
                  {lang === 'ro' ? displayRoute(id) : ROUTES[id].name}
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
                    {displayStop(s)}
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
                    {displayStop(s)}
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

          </div>
          <aside className="calc-info">
            <span className="calc-info-icon" aria-hidden="true">!</span>
            <div>
              <p>{lang === 'hu' ? 'A jegyek a buszon válthatók ki készpénzes fizetés ellenében.' : 'Biletele se pot cumpăra în autobuz, cu plata în numerar.'}</p>
              <p>{lang === 'hu' ? 'A bérletek a cég székhelyén vásárolhatók meg.' : 'Abonamentele se pot cumpăra de la sediul firmei.'}</p>
              <p>{lang === 'hu' ? 'Az árak tartalmazzák az ÁFÁ-t.' : 'Prețurile includ TVA.'}</p>
              <p>{lang === 'hu' ? 'Az itt feltüntetett árak kizárólag tájékoztató jellegűek.' : 'Prețurile afișate aici au doar caracter informativ.'}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
