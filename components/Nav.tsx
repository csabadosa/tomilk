'use client';

import { COPY, PHONES, type Lang } from '@/app/content';

const telHref = (p: string) => `tel:${p.replace(/[^+\d]/g, '')}`;

export function Wordmark() {
  return (
    <span className="wordmark" aria-label="Tomilk Prod">
      <span className="wm-top">
        TOMILK
        <svg className="wm-swoosh" viewBox="0 0 120 14" aria-hidden>
          <path
            d="M2 11 C 34 1, 74 1, 118 9"
            fill="none"
            stroke="var(--signal)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="wm-sub">PROD</span>
    </span>
  );
}

export default function Nav({
  t,
  lang,
  onLang,
}: {
  t: (typeof COPY)['ro'];
  lang: Lang;
  onLang: (l: Lang) => void;
}) {
  return (
    <header className="nav">
      <div className="nav-inner wrap">
        <a href="/#top" className="nav-brand" aria-label="Tomilk Prod">
          <Wordmark />
        </a>

        <nav className="nav-links" aria-label="Secțiuni">
          <a href="/#routes">{t.nav.routes}</a>
          <a href="/#schedule">{t.nav.schedule}</a>
          <a href="/#fares">{t.nav.fares}</a>
          <a href="/#contact">{t.nav.contact}</a>
          <a href="/rezervare" className="nav-np">{t.nav.private}</a>
        </nav>

        <div className="nav-actions">
          <div className="lang" role="group" aria-label="Limbă / Nyelv">
            <button
              className={lang === 'ro' ? 'is-on' : ''}
              aria-pressed={lang === 'ro'}
              onClick={() => onLang('ro')}
            >
              RO
            </button>
            <span aria-hidden>/</span>
            <button
              className={lang === 'hu' ? 'is-on' : ''}
              aria-pressed={lang === 'hu'}
              onClick={() => onLang('hu')}
            >
              HU
            </button>
          </div>
          <a className="btn btn-call" href={telHref(PHONES[0])}>
            <PhoneGlyph />
            <span>{t.nav.call}</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function PhoneGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 3.5h3l1.5 4.2-2 1.4a12 12 0 0 0 5.4 5.4l1.4-2 4.2 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5z"
        fill="currentColor"
      />
    </svg>
  );
}
