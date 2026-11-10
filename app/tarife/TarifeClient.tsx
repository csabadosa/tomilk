'use client';

import { COPY, type Lang } from '../content';
import { useLang } from '../useLang';
import DrivingScene from '@/components/DrivingScene';
import Nav from '@/components/Nav';
import { Footer } from '@/components/Sections';
import JegyKalkulator from '@/components/JegyKalkulator';

export default function TarifeClient({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useLang(initialLang);
  const t = COPY[lang];

  return (
    <>
      <DrivingScene lang={lang} />
      <Nav t={t} lang={lang} onLang={setLang} />
      <main>
        <JegyKalkulator t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
