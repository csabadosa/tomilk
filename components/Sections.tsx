'use client';

import { useState } from 'react';
import { COPY, LINES, PHONES, AUTOGARI_URL, stopName, routeEnds, type Lang } from '@/app/content';
import { Wordmark } from './Nav';

type T = (typeof COPY)['ro'];
const telHref = (p: string) => `tel:${p.replace(/[^+\d]/g, '')}`;

/* ------------------------------- HERO ------------------------------- */
export function Hero({ t }: { t: T }) {
  return (
    <section id="top" className="hero">
      <div className="wrap hero-inner">
        <h1 className="hero-title">
          <span>{t.hero.h1a}</span>
          <span className="hero-title-2">{t.hero.h1b}</span>
        </h1>
        <p className="hero-services">
          <span>{t.hero.serviceA}</span>
          <span>{t.hero.serviceB}</span>
        </p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="/oferta">
            {t.hero.privateCta}
          </a>
          <a className="btn btn-ghost" href="#schedule">
            {t.hero.seeSchedule}
          </a>
          <a className="btn btn-ghost" href={telHref(PHONES[0])}>
            {t.hero.callNow}
          </a>
        </div>
      </div>
      <div className="scroll-hint wrap" aria-hidden>
        <span>{t.hero.scrollHint}</span>
        <i />
      </div>
    </section>
  );
}

/* ------------------------------ STATS ------------------------------- */
export function Stats({ t }: { t: T }) {
  const items = [
    { n: '2', l: t.stats.lines },
    { n: '30+', l: t.stats.departures },
    { n: '16', l: t.stats.towns },
  ];
  return (
    <section className="stats">
      <div className="wrap stats-inner">
        {items.map((it) => (
          <div className="stat" key={it.l}>
            <span className="stat-n data">{it.n}</span>
            <span className="stat-l">{it.l}</span>
          </div>
        ))}
        <div className="stat-fare">
          <div className="ticket">
            <div className="ticket-main">
              <span className="ticket-brand data">TOMILK PROD</span>
              <span className="ticket-from">{t.stats.from}</span>
              <span className="ticket-price data">5<em>{t.stats.fromUnit}</em></span>
              <span className="ticket-barcode" aria-hidden />
            </div>
            <div className="ticket-stub"><span className="data">016 · 075</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ ROUTES ------------------------------ */
export function Routes({ t, lang }: { t: T; lang: Lang }) {
  return (
    <section id="routes" className="block">
      <div className="wrap">
        <SectionHead title={t.routes.title} lead={t.routes.lead} className="routes-head" />
        <div className="routes">
          {LINES.map((line) => {
            const perDay = line.dirs.reduce((s, d) => s + d.times.length, 0);
            const [a, b] = routeEnds(line.stops[0], line.stops[line.stops.length - 1]);
            const routeStops = a === line.stops[0] ? line.stops : [...line.stops].reverse();
            return (
              <article className="route" key={line.code}>
                <header className="route-head">
                  <span className="route-code data">{line.code}</span>
                  <h3 className="route-name">
                    {stopName(a, lang)} <span className="route-arrow">⇄</span>{' '}
                    {stopName(b, lang)}
                  </h3>
                  <span className="route-meta data">
                    {perDay} {t.routes.perDay}
                  </span>
                </header>

                <div className="route-map" role="list" aria-label={`${routeStops.length} ${t.routes.stopsLabel}`}>
                  <span className="route-line" />
                  {routeStops.map((s, i) => {
                    const terminal = i === 0 || i === routeStops.length - 1;
                    return (
                      <span className={`route-stop${terminal ? ' is-term' : ''}`} role="listitem" key={s}>
                        <i />
                        <b>{stopName(s, lang)}</b>
                      </span>
                    );
                  })}
                </div>

                <footer className="route-foot">
                  <span className="route-fare data">
                    {line.fare.min}–{line.fare.max} RON
                  </span>
                  <a className="route-link" href="#schedule">
                    {t.routes.viewTimes} →
                  </a>
                </footer>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- TIMETABLE ----------------------------- */
export function Timetable({ t, lang }: { t: T; lang: Lang }) {
  const [li, setLi] = useState(0);
  const [di, setDi] = useState(0);
  const line = LINES[li];
  const dir = line.dirs[di];

  return (
    <section id="schedule" className="block">
      <div className="wrap">
        <SectionHead title={t.schedule.title} lead={t.schedule.lead} />

        <div className="board-controls">
          <div className="seg" role="group" aria-label="Linie">
            {LINES.map((l, i) => {
              const [a, b] = routeEnds(l.stops[0], l.stops[l.stops.length - 1]);
              return (
                <button
                  key={l.code}
                  className={`seg-btn${i === li ? ' is-on' : ''}`}
                  aria-pressed={i === li}
                  onClick={() => {
                    setLi(i);
                    setDi(0);
                  }}
                >
                  <span className="data">{l.code}</span>
                  {stopName(a, lang)}–{stopName(b, lang)}
                </button>
              );
            })}
          </div>

          <div className="seg seg-dir" role="group" aria-label={t.schedule.direction}>
            {line.dirs.map((d, i) => (
              <button
                key={d.to}
                className={`seg-btn${i === di ? ' is-on' : ''}`}
                aria-pressed={i === di}
                onClick={() => setDi(i)}
              >
                → {stopName(d.to, lang)}
              </button>
            ))}
          </div>
        </div>

        <div className="board" key={`${li}-${di}`}>
          <div className="board-top">
            <span className="board-route data">
              {stopName(dir.from, lang)} <span className="board-to">→ {stopName(dir.to, lang)}</span>
            </span>
            <span className="board-label data">
              {t.schedule.departuresLabel}
              <b>{dir.times.length}</b>
            </span>
          </div>
          <div className="board-grid">
            {dir.times.map((time, i) => (
              <span className="flap data" style={{ animationDelay: `${i * 45}ms` }} key={time + i}>
                {time}
              </span>
            ))}
          </div>
        </div>

        <p className="board-note">
          {t.schedule.liveNote}{' '}
          <a href={AUTOGARI_URL} target="_blank" rel="noopener noreferrer">
            {t.schedule.liveLink} ↗
          </a>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------ FARES ------------------------------- */
export function Fares({ t }: { t: T }) {
  return (
    <section id="fares" className="block">
      <div className="wrap">
        <SectionHead title={t.fares.title} lead={t.fares.lead} />
        <div className="fares">
          <div className="ticket">
            <div className="ticket-main">
              <span className="ticket-brand data">TOMILK PROD</span>
              <span className="ticket-from">{t.stats.from}</span>
              <span className="ticket-price data">
                5<em>RON</em>
              </span>
              <span className="ticket-barcode" aria-hidden />
            </div>
            <div className="ticket-stub">
              <span className="data">016 · 075</span>
            </div>
          </div>

          <ul className="fare-points">
            <li>
              <span className="fare-pt-t">{t.fares.onboard}</span>
              <span className="fare-pt-d">{t.fares.onboardNote}</span>
            </li>
            <li>
              <span className="fare-pt-t">{t.fares.cash}</span>
              <span className="fare-pt-d">{t.fares.cashNote}</span>
            </li>
            <li>
              <span className="fare-pt-t">{t.fares.daily}</span>
              <span className="fare-pt-d">{t.fares.dailyNote}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- WHY -------------------------------- */
export function Why({ t }: { t: T }) {
  return (
    <section className="block">
      <div className="wrap">
        <SectionHead title={t.why.title} lead={t.why.lead} />
        <div className="why">
          <ul className="why-list">
            {t.why.items.map((it) => (
              <li key={it.t}>
                <span className="why-t">{it.t}</span>
                <span className="why-d">{it.d}</span>
              </li>
            ))}
          </ul>
          <figure className="fleet">
            <img src="/assets/mercedes_sprinter.png" alt="Mercedes-Benz Sprinter Tomilk Prod" />
            <figcaption>
              <strong>{t.why.fleet}</strong>
              <span>{t.why.fleetNote}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- PRIVATE PROMO --------------------------- */
export function PrivatePromo({ t }: { t: T }) {
  return (
    <section id="private" className="block">
      <div className="wrap">
        <div className="promo">
          <div className="promo-body">
            <span className="promo-tag data">{t.nav.private}</span>
            <h2 className="promo-title">{t.privatePromo.title}</h2>
            <p className="promo-lead">{t.privatePromo.lead}</p>
            <ul className="promo-points">
              {t.privatePromo.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <div className="promo-cta">
              <a className="btn btn-primary" href="/oferta">
                {t.privatePromo.cta} →
              </a>
              <span className="promo-note">{t.privatePromo.note}</span>
            </div>
          </div>
          <div className="promo-aside" aria-hidden>
            <img src="/assets/mercedes_sprinter.png" alt="" draggable={false} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- CONTACT ------------------------------ */
export function Contact({ t }: { t: T }) {
  return (
    <section id="contact" className="block block-contact">
      <div className="wrap">
        <h2 className="contact-title">{t.contact.title}</h2>
        <p className="contact-lead">{t.contact.lead}</p>

        <div className="phones">
          {PHONES.map((p) => (
            <a className="phone" href={telHref(p)} key={p}>
              <span className="phone-label">{t.contact.callLabel}</span>
              <span className="phone-num data">{p}</span>
            </a>
          ))}
        </div>

        <div className="contact-meta company-meta">
          <div>
            <span className="cm-label">{t.contact.company}</span>
            <span className="cm-val">S.C. Tomilk-Prod S.R.L.</span>
          </div>
          <div>
            <span className="cm-label">{t.contact.email}</span>
            <a className="cm-val" href="mailto:tomilkprod@gmail.com">tomilkprod@gmail.com</a>
          </div>
          <div>
            <span className="cm-label">{t.contact.cui}</span>
            <span className="cm-val data">RO10059056</span>
          </div>
          <div>
            <span className="cm-label">{t.contact.address}</span>
            <span className="cm-val">Csíkszereda, Temesvári sugárút 26/21, Hargita megye, Románia</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ FOOTER ------------------------------ */
export function Footer({ t }: { t: T }) {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <span className="footer-logo-tile">
            <img src="/assets/tomilk_logo_transparent.png" alt="Tomilk Prod" />
          </span>
          <Wordmark />
        </div>
        <p className="footer-company">{t.footer.company}</p>
        <div className="footer-end">
          <a href={AUTOGARI_URL} target="_blank" rel="noopener noreferrer">
            {t.footer.source} ↗
          </a>
          <span>© 2026 Tomilk Prod S.R.L.</span>
        </div>
      </div>
    </footer>
  );
}

/* ----------------------------- shared ------------------------------- */
function SectionHead({ title, lead, className = '' }: { title: string; lead?: string; className?: string }) {
  return (
    <header className={`sec-head ${className}`}>
      <h2>{title}</h2>
      {lead ? <p>{lead}</p> : null}
    </header>
  );
}
