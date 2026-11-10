'use client';

import { COPY, type Lang } from './content';
import { useLang } from './useLang';
import DrivingScene from '@/components/DrivingScene';
import Nav from '@/components/Nav';
import { Hero, Stats, Routes, Timetable, Fares, Why, PrivatePromo, Contact, Footer } from '@/components/Sections';

export default function HomeClient({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useLang(initialLang);
  const t = COPY[lang];

  return (
    <>
      <DrivingScene lang={lang} />
      <Nav t={t} lang={lang} onLang={setLang} />
      <main>
        <Hero t={t} />
        <Stats t={t} />
        <Routes t={t} lang={lang} />
        <Timetable t={t} lang={lang} />
        <Fares t={t} />
        <Why t={t} />
        <PrivatePromo t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
