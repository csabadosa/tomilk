'use client';

import { COPY, type Lang } from '../content';
import { useLang } from '../useLang';
import DrivingScene from '@/components/DrivingScene';
import Nav from '@/components/Nav';
import { Footer } from '@/components/Sections';

export default function BookingSuccess({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useLang(initialLang);
  const t = COPY[lang];

  return <>
    <DrivingScene lang={lang} />
    <Nav t={t} lang={lang} onLang={setLang} />
    <main className="booking-success-page">
      <section className="wrap booking-success">
        <span className="booking-success-mark" aria-hidden="true">✓</span>
        <h1>{lang === 'hu' ? 'Sikeresen rögzítettük a foglalását!' : 'Am înregistrat cu succes rezervarea!'}</h1>
        <p>{lang === 'hu' ? 'Hamarosan jelentkezünk.' : 'Vă vom contacta în curând.'}</p>
      </section>
    </main>
    <Footer t={t} />
  </>;
}
