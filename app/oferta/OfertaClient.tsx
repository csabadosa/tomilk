'use client';

import { COPY, type Lang } from '../content';
import { useLang } from '../useLang';
import DrivingScene from '@/components/DrivingScene';
import Nav from '@/components/Nav';
import { Footer } from '@/components/Sections';
import KulonjaratKalkulator from '@/components/KulonjaratKalkulator';

export default function OfertaClient({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useLang(initialLang);
  const t = COPY[lang];

  return (
    <>
      <DrivingScene lang={lang} />
      <Nav t={t} lang={lang} onLang={setLang} />
      <main>
        <KulonjaratKalkulator t={t} lang={lang} />
      </main>
      <Footer t={t} />
    </>
  );
}
