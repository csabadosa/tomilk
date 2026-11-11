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
    lead: 'O flotă de 15 vehicule Mercedes-Benz și Iveco, potrivită pentru orice călătorie și orice număr de pasageri.',
    count: 'vehicule Mercedes-Benz și Iveco în flotă', known: 'Modele din flotă',
    details: 'Pentru disponibilitate și rezervări, vă rugăm să ne contactați.',
    seats: 'Locuri', year: 'An fabricație', ac: 'Aer condiționat', tv: 'Televizor', category: 'MICROBUZ PREMIUM', bus: 'AUTOCAR', premium: 'MICROBUZ PREMIUM',
    vclass: 'Mercedes-Benz V-Class', intouro: 'Mercedes-Benz Intouro', crossway: 'Iveco Crossway', sprinter: 'Mercedes-Benz Sprinter', trailer: 'Remorcă cu prelată',
    vclassText: 'Microbuz premium pentru călătorii confortabile.', intouroText: 'Autocar pentru grupuri mari și curse regulate.', crosswayText: 'Autocar pentru curse regulate și călătorii în grup.', sprinterText: 'Microbuz premium cu aer condiționat, disponibil în două configurații.',
    acYes: 'Da', illustration: 'Imagine ilustrativă — Mercedes-Benz Sprinter', trailerText: 'Remorcă cu două axe și prelată detașabilă.', payload: 'Capacitate de încărcare', axles: 'Axe', cover: 'Prelată detașabilă',
  },
  hu: {
    eyebrow: 'TOMILK PROD · JÁRMŰPARK', title: '15 jármű, útra készen.',
    lead: 'A 15 járműves flottát Mercedes-Benz és Iveco autóbuszok alkotják. Bármilyen utazáshoz és bármilyen utaslétszámhoz megfelelő járművet kínálunk.',
    count: 'Mercedes-Benz és Iveco jármű a flottában', known: 'A flottában használt típusok',
    details: 'Elérhetőségről és foglalásról kérjük, érdeklődjön nálunk.',
    seats: 'Ülőhely', year: 'Évjárat', ac: 'Légkondicionáló', tv: 'Televízió', category: 'PRÉMIUM MIKROBUSZ', bus: 'AUTÓBUSZ', premium: 'PRÉMIUM MIKROBUSZ',
    vclass: 'Mercedes-Benz V-Class', intouro: 'Mercedes-Benz Intouro', crossway: 'Iveco Crossway', sprinter: 'Mercedes-Benz Sprinter', trailer: 'Ponyvás remorka',
    vclassText: 'Prémium mikrobusz a kényelmes utazáshoz.', intouroText: 'Autóbusz nagyobb csoportoknak és menetrend szerinti járatokhoz.', crosswayText: 'Autóbusz menetrend szerinti járatokhoz és csoportos utazáshoz.', sprinterText: 'Légkondicionált prémium mikrobusz, kétféle üléselrendezéssel.',
    acYes: 'Van', illustration: 'Illusztráció — Mercedes-Benz Sprinter', trailerText: 'Kéttengelyes, leszerelhető ponyvával felszerelt remorka.', payload: 'Teherbírás', axles: 'Tengelyek száma', cover: 'Leszerelhető ponyva',
  },
} as const;

type Vehicle = { name: string; text: string; image?: string; year: string; seats?: string; ac?: string; tv?: string; payload?: string; axles?: string; cover?: string; category: string };

export default function FlottaClient({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useLang(initialLang);
  const t = COPY[lang];
  const c = copy[lang];
  const vehicles: Vehicle[] = [
    { name: c.vclass, text: c.vclassText, image: '/images/Mrcedes-benz V class 2023.png', year: '2023', seats: '6', ac: '—', category: c.premium },
    { name: c.sprinter, text: c.sprinterText, image: '/assets/mercedes_sprinter.png', year: '2023', seats: lang === 'hu' ? '19 vagy 20' : '19 sau 20', ac: c.acYes, category: c.premium },
    { name: c.intouro, text: c.intouroText, image: '/images/Mercedes-Benz inturo 2007.png', year: '2007', seats: '70', ac: c.acYes, category: c.bus },
    { name: c.crossway, text: c.crosswayText, image: '/images/Iveco Crossway 2024.png', year: '2024', seats: lang === 'hu' ? '44 vagy 50' : '44 sau 50', ac: c.acYes, tv: c.acYes, category: c.bus },
    { name: c.trailer, text: c.trailerText, year: '2026', payload: lang === 'hu' ? '2 tonna' : '2 tone', axles: '2', cover: c.acYes, category: lang === 'hu' ? 'REMORKA' : 'REMORCĂ' },
  ];

  return <>
    <DrivingScene lang={lang} />
    <Nav t={t} lang={lang} onLang={setLang} />
    <main className="fleet-page">
      <section className="fleet-hero wrap">
        <div className="fleet-hero-copy">
          <p className="fleet-eyebrow">{c.eyebrow}</p>
          <h1>{c.title}</h1>
          <p className="fleet-lead fleet-lead-highlight">{c.lead}</p>
        </div>
        <figure className="fleet-hero-image">
          <Image src="/assets/mercedes_sprinter.png" alt={c.illustration} width={1200} height={800} priority />
          <figcaption>{c.illustration}</figcaption>
        </figure>
      </section>
      <section className="fleet-section wrap">
        <p className="fleet-eyebrow">{c.known}</p>
        <div className="fleet-grid">
          {vehicles.map((vehicle, index) => <article className="fleet-card" key={`${vehicle.name}-${vehicle.seats}`}>
            {vehicle.image && <div className="fleet-card-image"><Image src={vehicle.image} alt={vehicle.name} width={1200} height={800} /></div>}
            <div className="fleet-card-top"><span>{String(index + 1).padStart(2, '0')}</span><span>{vehicle.category}</span></div>
            <h2>{vehicle.name}</h2><p>{vehicle.text}</p>
            <dl>
              {vehicle.seats && <div><dt>{c.seats}</dt><dd>{vehicle.seats}</dd></div>}
              {vehicle.ac && <div><dt>{c.ac}</dt><dd>{vehicle.ac}</dd></div>}
              {vehicle.tv && <div><dt>{c.tv}</dt><dd>{vehicle.tv}</dd></div>}
              {vehicle.payload && <div><dt>{c.payload}</dt><dd>{vehicle.payload}</dd></div>}
              {vehicle.axles && <div><dt>{c.axles}</dt><dd>{vehicle.axles}</dd></div>}
              {vehicle.cover && <div><dt>{c.cover}</dt><dd>{vehicle.cover}</dd></div>}
              <div><dt>{c.year}</dt><dd>{vehicle.year}</dd></div>
            </dl>
          </article>)}
        </div>
        <p className="fleet-note">{c.details}</p>
      </section>
    </main>
    <Footer t={t} />
  </>;
}
