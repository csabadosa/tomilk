'use client';

import Image from 'next/image';
import { useLang } from '../useLang';
import type { Lang } from '../content';
import { COPY } from '../content';
import DrivingScene from '@/components/DrivingScene';
import Nav from '@/components/Nav';
import { Footer } from '@/components/Sections';

const copy = {
  ro: {
    eyebrow: 'TOMILK PROD · PARCUL AUTO', title: '15 de vehicule, gata de drum.',
    lead: 'O flotă pentru cursele de zi cu zi și călătoriile în grup. Alegem vehiculul potrivit în funcție de traseu și numărul de pasageri.',
    count: 'vehicule în flotă', known: 'Modele din flotă',
    sprinter: 'Mercedes-Benz Sprinter', sprinterText: 'Microbuz compact pentru grupuri mici, transferuri și drumuri cu opriri dese. Numărul de locuri diferă în funcție de configurația vehiculului.',
    iveco: 'Iveco', ivecoText: 'Autobuze pentru curse regulate și grupuri mai mari, inclusiv pe traseele din zona Ciucului. Capacitatea exactă diferă de la un vehicul la altul.',
    details: 'Dotările și configurația diferă în funcție de vehicul. Pentru disponibilitate, numărul de locuri și aer condiționat, vă rugăm să ne contactați înainte de rezervare.',
    year: 'An fabricație', yearValue: 'Solicitați detalii', ac: 'Aer condiționat', acValue: 'Confirmați la rezervare', seats: 'Locuri', seatsValue: 'În funcție de vehicul', illustration: 'Imagine ilustrativă — Mercedes-Benz Sprinter',
  },
  hu: {
    eyebrow: 'TOMILK PROD · JÁRMŰPARK', title: '15 jármű, útra készen.',
    lead: 'Járműparkunk a mindennapi járatokhoz és csoportos utazásokhoz készült. Az útvonal és az utasok száma alapján választjuk ki a megfelelő járművet.',
    count: 'jármű a flottában', known: 'A flottában használt típusok',
    sprinter: 'Mercedes-Benz Sprinter', sprinterText: 'Kompakt kisbusz kisebb csoportoknak, transzferekhez és gyakori megállókkal közlekedő utakhoz. Az ülőhelyek száma a jármű kialakításától függ.',
    iveco: 'Iveco', ivecoText: 'Autóbuszok menetrend szerinti járatokhoz és nagyobb csoportoknak, többek között a csíki útvonalakon. A pontos férőhely járművenként eltér.',
    details: 'A felszereltség és a kialakítás járművenként változik. Elérhetőségről, férőhelyről és légkondicionálásról foglalás előtt érdeklődjön.',
    year: 'Évjárat', yearValue: 'Érdeklődjön', ac: 'Légkondicionáló', acValue: 'Foglaláskor egyeztetendő', seats: 'Férőhely', seatsValue: 'Járműtől függ', illustration: 'Illusztráció — Mercedes-Benz Sprinter',
  },
} as const;

export default function FlottaClient({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useLang(initialLang);
  const t = COPY[lang];
  const c = copy[lang];
  return <>
    <DrivingScene lang={lang} />
    <Nav t={t} lang={lang} onLang={setLang} />
    <main className="fleet-page">
      <section className="fleet-hero wrap">
        <div className="fleet-hero-copy">
          <p className="fleet-eyebrow">{c.eyebrow}</p>
          <h1>{c.title}</h1>
          <p className="fleet-lead">{c.lead}</p>
          <div className="fleet-count"><strong>15</strong><span>{c.count}</span></div>
        </div>
        <figure className="fleet-hero-image">
          <Image src="/assets/mercedes_sprinter.png" alt={c.illustration} width={1200} height={800} priority />
          <figcaption>{c.illustration}</figcaption>
        </figure>
      </section>
      <section className="fleet-section wrap">
        <p className="fleet-eyebrow">{c.known}</p>
        <div className="fleet-grid">
          <article className="fleet-card">
            <div className="fleet-card-top"><span>01</span><span>MINIBUS</span></div>
            <h2>{c.sprinter}</h2><p>{c.sprinterText}</p>
            <dl><div><dt>{c.seats}</dt><dd>{c.seatsValue}</dd></div><div><dt>{c.ac}</dt><dd>{c.acValue}</dd></div><div><dt>{c.year}</dt><dd>{c.yearValue}</dd></div></dl>
          </article>
          <article className="fleet-card">
            <div className="fleet-card-top"><span>02</span><span>AUTOBUZ</span></div>
            <h2>{c.iveco}</h2><p>{c.ivecoText}</p>
            <dl><div><dt>{c.seats}</dt><dd>{c.seatsValue}</dd></div><div><dt>{c.ac}</dt><dd>{c.acValue}</dd></div><div><dt>{c.year}</dt><dd>{c.yearValue}</dd></div></dl>
          </article>
        </div>
        <p className="fleet-note">{c.details}</p>
      </section>
    </main>
    <Footer t={t} />
  </>;
}
