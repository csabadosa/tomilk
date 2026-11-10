'use client';

import Link from 'next/link';
import { COPY, PHONES, type Lang } from '@/app/content';

const telHref = (p: string) => `tel:${p.replace(/[^+\d]/g, '')}`;

export function Wordmark() {
  return (
    <span className="wordmark" aria-label="Tomilk Prod">
      <span className="wm-top">TOMILK</span>
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
        <Link href="/#top" className="nav-brand" aria-label="Tomilk Prod">
          <Wordmark />
        </Link>

        <nav className="nav-links" aria-label="Secțiuni">
          <Link href="/#routes">{t.nav.routes}</Link>
          <Link href="/#schedule">{t.nav.schedule}</Link>
          <Link href="/tarife">{lang === 'hu' ? 'Áraink' : 'Prețuri'}</Link>
          <Link href="/flotta">{lang === 'hu' ? 'Flotta' : 'Flotă'}</Link>
          <Link href="/#contact">{t.nav.contact}</Link>
          <Link href="/oferta" className="nav-np">{lang === 'hu' ? 'Különjárat / ajánlatkérés' : 'Transport privat / ofertă'}</Link>
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
