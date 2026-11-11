'use client';

import { useLang } from '../useLang';
import type { Lang } from '../content';
import { COPY } from '../content';
import DrivingScene from '@/components/DrivingScene';
import Nav from '@/components/Nav';
import { Footer } from '@/components/Sections';

const aboutCopy = {
  hu: {
    eyebrow: 'TOMILK PROD · RÓLUNK', title: 'Családi vállalkozás, úton 1997 óta.',
    intro: 'A Tomilk Prod csíkszeredai családi vállalkozás. Teherszállítással kezdtük, majd 2020-ban a személyszállítás vált fő tevékenységünkké.',
    historyTitle: 'Történetünk', history: '1997 óta vagyunk jelen a piacon. Pályafutásunkat teherszállítással kezdtük, ezen a területen 2020-ig dolgoztunk. Azóta utasaink kényelmes és megbízható szállítására összpontosítunk.',
    offerTitle: 'Amit kínálunk', regular: 'Menetrend szerinti járatok Csíkszereda–Balánbánya és Csíkszereda–Ajnád útvonalon.', charter: 'Különjáratok kirándulásokra, rendezvényekre, esküvőkre és más alkalmakra.', truck: 'Autóbuszaink mellett egy teherautó is a vállalkozásunk tulajdonában van.',
    whyTitle: 'Miért utazzon velünk?', reasons: [
      ['Megbízhatóság', 'Pontosan és gondosan dolgozunk, hogy biztonságban célba érjen.'],
      ['Elérhető árak', 'Tisztességes, átlátható díjakkal dolgozunk.'],
      ['Tapasztalt csapat', 'Tíz sofőrünk áll készen arra, hogy útnak induljon.'],
      ['Családias vendégszeretet', 'Nálunk nem csak utas, hanem vendég.'],
      ['A főnök nem csak főnök', 'Ha kell, szerelő, ha kell, sofőr… sőt, ő rakja a legjobb zenét a buszban.'],
    ], closing: 'A Tomilk Prod családias, megbízható partner, akivel jó utazni.',
  },
  ro: {
    eyebrow: 'TOMILK PROD · DESPRE NOI', title: 'O afacere de familie, pe drum din 1997.',
    intro: 'Tomilk Prod este o afacere de familie din Miercurea Ciuc. Am început cu transportul de marfă, iar din 2020 activitatea noastră principală este transportul de persoane.',
    historyTitle: 'Povestea noastră', history: 'Suntem prezenți pe piață din 1997. Am început cu transportul de marfă și am activat în acest domeniu până în 2020. De atunci ne concentrăm pe transportul confortabil și de încredere al pasagerilor.',
    offerTitle: 'Ce oferim', regular: 'Curse regulate pe traseele Miercurea Ciuc–Bălan și Miercurea Ciuc–Ajnád.', charter: 'Curse speciale pentru excursii, evenimente, nunți și alte ocazii.', truck: 'Pe lângă autobuze, compania deține și un camion.',
    whyTitle: 'De ce să călătoriți cu noi?', reasons: [
      ['Seriozitate', 'Lucrăm cu grijă și punctualitate, pentru ca dumneavoastră să ajungeți în siguranță.'],
      ['Tarife accesibile', 'Oferim prețuri corecte și transparente.'],
      ['O echipă cu experiență', 'Cei zece șoferi ai noștri sunt pregătiți de drum.'],
      ['Atmosferă de familie', 'La noi sunteți mai mult decât pasageri: sunteți oaspeți.'],
      ['Șeful nu este doar șef', 'La nevoie, este mecanic, la nevoie, șofer… și tot el pune cea mai bună muzică în autobuz.'],
    ], closing: 'Tomilk Prod este un partener de familie, de încredere, alături de care călătoriți cu plăcere.',
  },
} as const;

export default function RolunkClient({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useLang(initialLang);
  const t = COPY[lang];
  const c = aboutCopy[lang];
  return <>
    <DrivingScene lang={lang} />
    <Nav t={t} lang={lang} onLang={setLang} />
    <main className="about-page wrap">
      <header className="about-hero">
        <p className="fleet-eyebrow">{c.eyebrow}</p>
        <h1>{c.title}</h1>
        <p className="fleet-lead fleet-lead-highlight">{c.intro}</p>
      </header>
      <section className="about-section">
        <h2>{c.historyTitle}</h2><p>{c.history}</p>
      </section>
      <section className="about-section">
        <h2>{c.offerTitle}</h2>
        <ul className="about-list"><li>{c.regular}</li><li>{c.charter}</li><li>{c.truck}</li></ul>
      </section>
      <section className="about-section">
        <h2>{c.whyTitle}</h2>
        <ul className="about-reasons">{c.reasons.map(([title, description]) => <li key={title}><strong>{title}</strong><span>{description}</span></li>)}</ul>
      </section>
      <p className="about-closing">{c.closing}</p>
    </main>
    <Footer t={t} />
  </>;
}
