/* ------------------------------------------------------------------
   Tomilk Prod — real operating data + bilingual (RO / HU) copy.
   Routes, stops, fares and timetable taken from the operator's
   public page on autogari.ro (tomilkprod.autogari.ro).
   ------------------------------------------------------------------ */

export type Lang = 'ro' | 'hu';

export const PHONES = ['+40 753118537'] as const;
export const AUTOGARI_URL = 'https://tomilkprod.autogari.ro/curse';
/* WhatsApp number for private-ride requests (digits only, no +/spaces). */
export const WHATSAPP = '40753118537';
/* Language preference cookie name (shared by server + client). */
export const LANG_COOKIE = 'tomilk-lang';

/* Each line, both directions, with the real departure times. */
export const LINES = [
  {
    code: '075',
    stops: [
      'Bălan',
      'Sândominic',
      'Tomești',
      'Ineu',
      'Cârța',
      'Dănești',
      'Mădăraș',
      'Racu',
      'Siculeni',
      'Ciceu',
      'Toplița Ciuc',
      'Miercurea Ciuc',
    ],
    dirs: [
      {
        from: 'Bălan',
        to: 'Miercurea Ciuc',
        times: ['05:00', '05:10', '06:00', '07:00', '08:15', '10:00', '12:45', '14:00', '15:00', '17:00', '21:00'],
      },
      {
        from: 'Miercurea Ciuc',
        to: 'Bălan',
        times: ['06:40', '07:30', '10:00', '11:00', '12:00', '14:30', '15:30', '17:00', '20:00', '23:25'],
      },
    ],
    fare: { min: 8, max: 17 },
  },
  {
    code: '016',
    stops: [
      'Miercurea Ciuc',
      'Toplița Ciuc',
      'Ciceu',
      'Siculeni',
      'Racu',
      'Satu Nou',
      'Văcărești',
      'Mihăileni',
      'Nădejdea',
    ],
    dirs: [
      {
        from: 'Miercurea Ciuc',
        to: 'Nădejdea',
        times: ['06:05', '07:30', '07:40', '12:00', '14:20', '15:30', '16:00', '18:30', '21:00', '23:25'],
      },
      {
        from: 'Nădejdea',
        to: 'Miercurea Ciuc',
        times: ['06:45', '08:20', '13:00', '16:30'],
      },
    ],
    fare: { min: 5, max: 11 },
  },
] as const;

/* Hungarian names for every stop, keyed by the Romanian name stored in LINES.
   ⚠ A couple are best-guess (marked below) — have the client confirm. */
export const STOP_HU: Record<string, string> = {
  'Bălan': 'Balánbánya',
  'Sândominic': 'Csíkszentdomokos',
  'Tomești': 'Csíkszenttamás',
  'Ineu': 'Csíkjenőfalva',
  'Cârța': 'Csíkkarcfalva',
  'Dănești': 'Csíkdánfalva',
  'Mădăraș': 'Csíkmadaras',
  'Racu': 'Csíkrákos',
  'Siculeni': 'Madéfalva',
  'Ciceu': 'Csíkcsicsó',
  'Toplița Ciuc': 'Csíktaploca',
  'Miercurea Ciuc': 'Csíkszereda',
  'Satu Nou': 'Újfalu', // ⚠ verify
  'Văcărești': 'Csíkvacsárcsi', // ⚠ verify
  'Mihăileni': 'Csíkszentmihály',
  'Nădejdea': 'Ajnád',
};

/* Localised stop name: RO stays as stored, HU comes from the map (falls back to RO). */
export const stopName = (ro: string, lang: Lang) =>
  lang === 'hu' ? STOP_HU[ro] ?? ro : ro;

/* The Csíkszereda / Miercurea Ciuc hub always leads a route's end-to-end label. */
const HUB = 'Miercurea Ciuc';
export const routeEnds = (a: string, b: string): [string, string] =>
  b === HUB ? [b, a] : [a, b];

/* Stops that mark progress on the foreground route-rail (west → east spine). */
export const RAIL_STOPS = [
  'Bălan',
  'Sândominic',
  'Dănești',
  'Racu',
  'Siculeni',
  'Miercurea Ciuc',
] as const;

type Copy = {
  nav: {
    routes: string;
    schedule: string;
    fares: string;
    contact: string;
    call: string;
    private: string;
    fareCalc: string;
    quote: string;
  };
  hero: {
    serviceA: string;
    serviceB: string;
    h1a: string;
    h1b: string;
    seeSchedule: string;
    callNow: string;
    privateCta: string;
    scrollHint: string;
  };
  stats: { departures: string; towns: string; lines: string; from: string; fromUnit: string };
  routes: { title: string; lead: string; stopsLabel: string; viewTimes: string; perDay: string };
  schedule: {
    title: string;
    lead: string;
    direction: string;
    liveNote: string;
    liveLink: string;
    departuresLabel: string;
  };
  fares: {
    title: string;
    lead: string;
    onboard: string;
    onboardNote: string;
    cash: string;
    cashNote: string;
    daily: string;
    dailyNote: string;
  };
  why: { title: string; lead: string; items: { t: string; d: string }[]; fleet: string; fleetNote: string };
  privatePromo: { title: string; lead: string; points: string[]; cta: string; note: string };
  booking: {
    title: string;
    lead: string;
    back: string;
    people: string;
    from: string;
    to: string;
    date: string;
    time: string;
    name: string;
    phone: string;
    notes: string;
    tripType: string;
    oneWay: string;
    roundTrip: string;
    returnDate: string;
    peoplePh: string;
    fromPh: string;
    toPh: string;
    namePh: string;
    phonePh: string;
    notesPh: string;
    submit: string;
    how: string;
    required: string;
    waIntro: string;
    yes: string;
    no: string;
  };
  contact: { title: string; lead: string; callLabel: string; area: string; areaNote: string; hours: string; hoursNote: string; company: string; email: string; cui: string; address: string };
  footer: { company: string; built: string; source: string };
  railLabel: string;
  /* Jegy- és bérletár-kalkulátor. */
  jegyCalc: {
    title: string;
    lead: string;
    route: string;
    from: string;
    to: string;
    type: string;
    swap: string; // aria-label
    swapTitle: string;
    selectStop: string;
    currency: string; // RON
    types: { jegy: string; b1: string; b3: string; b2: string };
    badge: { special: string; kmTable: string };
    err: { missingStops: string; sameStop: string; unknownStop: string; noPassData: string };
    note: string;
  };
  /* Különjárat árajánlat-kalkulátor. */
  kulonCalc: {
    title: string;
    lead: string;
    from: string;
    fromPh: string;
    to: string;
    toPh: string;
    departDate: string;
    pax: string;
    paxPh: string;
    tripType: string;
    oneWay: string;
    round: string;
    returnDate: string;
    advanced: string;
    mkm: string;
    mfk: string;
    mka: string;
    mkb: string;
    mkbPh: string;
    submit: string;
    submitBusy: string;
    givenDistance: string; // eredmény cím, ha kézi távolság
    vat: string; // + ÁFA
    currency: string; // lej
    paxUnit: string; // fő
    dayUnit: string; // nap
    perTrip: string; // km / út
    busUnit: string; // db
    rows: {
      loadedKm: string;
      emptyKm: string;
      buses: string;
      loadedFee: string;
      emptyFee: string;
      toll: string;
      driver: string; // {days} helyőrzővel
      emptyHome: string;
      midpoint: string;
    };
    err: { route: string; date: string; pax: string; ret: string; retBefore: string; generic: string };
    note: string;
  };
  /* Kalkulátor-oldalak közös vissza-linkje. */
  calcBack: string;
};

export const COPY: Record<Lang, Copy> = {
  ro: {
    nav: {
      routes: 'Linii',
      schedule: 'Orar',
      fares: 'Prețuri',
      contact: 'Contact',
      call: 'Sună',
      private: 'Transport privat',
      fareCalc: 'Calculator preț',
      quote: 'Ofertă',
    },
    hero: {
      serviceA: 'Curse regulate între satele din Ciucul de Sus și Miercurea Ciuc',
      serviceB: 'Curse private la cerere, în toată Europa',
      h1a: 'Tomilk Prod —',
      h1b: 'alegerea sigură, pentru orice călătorie.',
      seeSchedule: 'Vezi orarul',
      callNow: 'Sună acum',
      privateCta: 'Cerere transport privat',
      scrollHint: 'Pornim la drum',
    },
    stats: { departures: 'curse zilnice', towns: 'localități pe traseu', lines: 'linii regulate', from: 'bilet de la', fromUnit: 'RON' },
    routes: {
      title: 'Cursele noastre regulate',
      lead: '',
      stopsLabel: 'stații',
      viewTimes: 'Vezi plecările',
      perDay: 'plecări/zi',
    },
    schedule: {
      title: 'Orarul plecărilor',
      lead: 'Alege linia și sensul. Ora din stația de pornire.',
      direction: 'Sens',
      liveNote: 'Orele pot varia în sărbători. Verifică mereu orarul actualizat pe',
      liveLink: 'autogari.ro',
      departuresLabel: 'Plecări',
    },
    fares: {
      title: 'Bilete și prețuri',
      lead: 'Prețul depinde de distanță. Simplu, fără surprize.',
      onboard: 'La șofer',
      onboardNote: 'Cumperi biletul direct în autocar, la urcare.',
      cash: 'Numerar',
      cashNote: 'Plata se face cu bani cash, la bord.',
      daily: 'Navetiști',
      dailyNote: 'Curse dese dimineața și seara, pentru naveta zilnică.',
    },
    why: {
      title: 'De ce Tomilk',
      lead: 'Un operator local, pe drumurile Ciucului de ani de zile.',
      items: [
        { t: 'În fiecare zi', d: 'Curse de luni până duminică, cu plecări dese pe tot parcursul zilei.' },
        { t: 'Oameni din zonă', d: 'Șoferi care cunosc fiecare curbă și fiecare stație de pe traseu.' },
        { t: 'La timp', d: 'Orar respectat, ca naveta și legăturile tale să fie sigure.' },
      ],
      fleet: 'Flotă Mercedes Sprinter și Iveco',
      fleetNote: 'Microbuze Mercedes-Benz Sprinter pentru curse rapide și autocare Iveco pe linia Miercurea Ciuc–Bălan — întreținute și pregătite pentru drumurile de munte.',
    },
    privatePromo: {
      title: 'Transport privat la comandă',
      lead: 'Grup, eveniment sau transfer? Spune-ne câte persoane și traseul, iar noi pregătim mașina potrivită — de la microbuz la autocar Iveco.',
      points: ['Grupuri și excursii', 'Nunți și evenimente', 'Transfer aeroport', 'Trasee la cerere, oricând'],
      cta: 'Trimite o cerere',
      note: 'Răspundem rapid pe WhatsApp sau telefonic.',
    },
    booking: {
      title: 'Cerere transport privat',
      lead: 'Completează detaliile cursei. La trimitere se deschide WhatsApp cu mesajul pregătit — tu doar apeși trimite.',
      back: '← Înapoi la pagina principală',
      people: 'Număr de persoane',
      from: 'De unde',
      to: 'Până unde',
      date: 'Data',
      time: 'Ora',
      name: 'Nume',
      phone: 'Telefon',
      notes: 'Observații',
      tripType: 'Tip cursă',
      oneWay: 'Doar dus',
      roundTrip: 'Dus-întors',
      returnDate: 'Data de retur',
      peoplePh: 'ex. 8',
      fromPh: 'ex. Miercurea Ciuc',
      toPh: 'ex. Bălan',
      namePh: 'Numele tău',
      phonePh: '+40 ...',
      notesPh: 'Bagaje, ora de retur, alte detalii…',
      submit: 'Trimite pe WhatsApp',
      how: 'Cererea se trimite prin WhatsApp către Tomilk Prod. Nu se face nicio plată online.',
      required: 'Completează câmpurile obligatorii (persoane, traseu, nume și telefon).',
      waIntro: 'Bună ziua! Aș dori o ofertă pentru transport privat:',
      yes: 'Da',
      no: 'Nu',
    },
    contact: {
      title: 'Urcă la bord',
      lead: 'Întrebări despre curse, stații sau ore? Sună-ne.',
      callLabel: 'Sună pentru informații',
      area: 'Zona deservită',
      areaNote: 'Bălan · Sândominic · Dănești · Racu · Nădejdea · Miercurea Ciuc',
      hours: 'Program curse',
      hoursNote: 'Luni–Duminică, prima plecare 05:00',
      company: 'Denumirea companiei',
      email: 'Email',
      cui: 'CUI',
      address: 'Adres\u0103',
    },
    footer: {
      company: 'Tomilk Prod S.R.L., transport regulat de persoane în Harghita',
      built: 'Pagină de prezentare',
      source: 'Orar oficial',
    },
    railLabel: 'Traseul tău',
    jegyCalc: {
      title: 'Prețuri bilete și abonamente',
      lead: 'Alege linia, stațiile și tipul biletului.',
      route: 'Linie',
      from: 'De unde',
      to: 'Până unde',
      type: 'Tip',
      swap: 'Inversează stația de plecare și de sosire',
      swapTitle: 'Inversează',
      selectStop: 'Alege o stație…',
      currency: 'RON',
      types: {
        jegy: 'Bilet',
        b1: 'Abonament 1 lună',
        b3: 'Abonament 3 săptămâni',
        b2: 'Abonament 2 săptămâni',
      },
      badge: { special: 'abonament special', kmTable: 'calculat pe baza tabelului km' },
      err: {
        missingStops: 'Alege stația de plecare și de sosire.',
        sameStop: 'Cele două stații coincid. Alege două stații diferite.',
        unknownStop: 'Stația aleasă nu se află pe această linie.',
        noPassData:
          'Pentru acest traseu nu există preț de abonament. Abonamentele de 3 și 2 săptămâni sunt disponibile doar pe relații cu Miercurea Ciuc.',
      },
      note: 'Prețurile biletelor sunt valabile de la 1 august 2025. Prețurile abonamentelor sunt valabile de la 7 septembrie 2026. Prețurile sunt în lei (RON).',
    },
    kulonCalc: {
      title: 'Transport privat – ofertă orientativă',
      lead: 'Dă-ne traseul și detaliile călătoriei, iar sistemul calculează distanța și un preț estimativ.',
      from: 'De unde (localitate)',
      fromPh: 'ex. Miercurea Ciuc',
      to: 'Până unde (localitate)',
      toPh: 'ex. Budapesta',
      departDate: 'Data plecării',
      pax: 'Număr de persoane',
      paxPh: 'ex. 45',
      tripType: 'Tip cursă',
      oneWay: 'Doar dus',
      round: 'Dus-întors',
      returnDate: 'Data de retur',
      advanced: 'Dacă știi distanța exactă',
      mkm: 'Lungimea unei curse (km)',
      mfk: 'din care în străinătate (km)',
      mka: 'Miercurea Ciuc → plecare (km)',
      mkb: 'Destinație → Miercurea Ciuc (km)',
      mkbPh: 'gol: = lungimea cursei',
      submit: 'Cere ofertă',
      submitBusy: 'Se calculează…',
      givenDistance: 'Distanță introdusă',
      vat: '+ TVA',
      currency: 'lei',
      paxUnit: 'pers.',
      dayUnit: 'zile',
      perTrip: 'km / cursă',
      busUnit: 'buc.',
      rows: {
        loadedKm: 'Distanță cu pasageri',
        emptyKm: 'Curse goale cu Miercurea Ciuc',
        buses: 'Număr de autocare',
        loadedFee: 'Tarif pe kilometru (cu pasageri)',
        emptyFee: 'Cost curse goale',
        toll: 'Taxă drum (străinătate, estimat)',
        driver: 'Diurnă șofer ({days} zile)',
        emptyHome: 'Întoarcere goală și revenire',
        midpoint: 'Valoare medie',
      },
      err: {
        route: 'Introdu localitatea de plecare și de sosire.',
        date: 'Introdu data plecării.',
        pax: 'Introdu numărul de persoane.',
        ret: 'Introdu data de retur.',
        retBefore: 'Returul nu poate fi înainte de plecare.',
        generic: 'A apărut o eroare la calcul. Încearcă din nou.',
      },
      note: 'Prețul este orientativ, nu reprezintă o ofertă fermă. Numele și numărul de telefon vor fi folosite numai dacă confirmați rezervarea.',
    },
    calcBack: '← Înapoi la pagina principală',
  },
  hu: {
    nav: {
      routes: 'Járatok',
      schedule: 'Menetrend',
      fares: 'Árak',
      contact: 'Kapcsolat',
      call: 'Hívás',
      private: 'Különjárat',
      fareCalc: 'Árkalkulátor',
      quote: 'Árajánlat',
    },
    hero: {
      serviceA: 'Menetrend szerinti járatok a felcsíki falvak és Csíkszereda között',
      serviceB: 'Különjáratok igény szerint Európa-szerte',
      h1a: 'Tomilk Prod —',
      h1b: 'a biztos választás, minden utazásra.',
      seeSchedule: 'Menetrend',
      callNow: 'Hívjon most',
      privateCta: 'Különjárat igénylése',
      scrollHint: 'Induljunk',
    },
    stats: { departures: 'napi járat', towns: 'település az útvonalon', lines: 'rendszeres járat', from: 'Jegy már', fromUnit: 'RON-tól' },
    routes: {
      title: 'Menetrend szerinti járataink',
      lead: '',
      stopsLabel: 'megálló',
      viewTimes: 'Indulások',
      perDay: 'indulás/nap',
    },
    schedule: {
      title: 'Indulási menetrend',
      lead: 'Válassza ki a járatot és az irányt. A kezdő megállótól számított idő.',
      direction: 'Irány',
      liveNote: 'Ünnepnapokon az időpontok változhatnak. A frissített menetrendet itt ellenőrizze:',
      liveLink: 'autogari.ro',
      departuresLabel: 'Indulások',
    },
    fares: {
      title: 'Jegyek és árak',
      lead: 'Az ár a távolságtól függ. Egyszerűen, meglepetések nélkül.',
      onboard: 'A sofőrnél',
      onboardNote: 'A jegyet felszálláskor, közvetlenül a buszon váltja meg.',
      cash: 'Készpénz',
      cashNote: 'A fizetés készpénzzel történik a fedélzeten.',
      daily: 'Ingázóknak',
      dailyNote: 'Sűrű reggeli és esti járatok a napi ingázáshoz.',
    },
    why: {
      title: 'Miért Tomilk',
      lead: 'Helyi fuvarozó, évek óta a csíki utakon.',
      items: [
        { t: 'Minden nap', d: 'Hétfőtől vasárnapig, sűrű indulásokkal a nap folyamán.' },
        { t: 'Helyi emberek', d: 'Sofőrök, akik minden kanyart és megállót ismernek az úton.' },
        { t: 'Pontosan', d: 'Betartott menetrend, hogy az ingázás és a csatlakozások biztosak legyenek.' },
      ],
      fleet: 'Mercedes Sprinter és Iveco flotta',
      fleetNote: 'Mercedes-Benz Sprinter kisbuszok a gyors járatokhoz és Iveco autóbuszok a Csíkszereda–Balánbánya vonalon — karbantartva, a hegyi utakra felkészítve.',
    },
    privatePromo: {
      title: 'Különjárat igény szerint',
      lead: 'Csoport, rendezvény vagy transzfer? Mondja meg, hány fő és milyen útvonal, mi pedig előkészítjük a megfelelő járművet — kisbusztól az Iveco autóbuszig.',
      points: ['Csoportok és kirándulások', 'Esküvők és rendezvények', 'Reptéri transzfer', 'Útvonal igény szerint, bármikor'],
      cta: 'Igénylés küldése',
      note: 'Gyorsan válaszolunk WhatsAppon vagy telefonon.',
    },
    booking: {
      title: 'Különjárat igénylése',
      lead: 'Töltse ki az út adatait. Küldéskor megnyílik a WhatsApp a kész üzenettel — csak a küldést kell megnyomnia.',
      back: '← Vissza a főoldalra',
      people: 'Utasok száma',
      from: 'Honnan',
      to: 'Hová',
      date: 'Dátum',
      time: 'Idő',
      name: 'Név',
      phone: 'Telefon',
      notes: 'Megjegyzés',
      tripType: 'Út típusa',
      oneWay: 'Csak oda',
      roundTrip: 'Oda-vissza',
      returnDate: 'Visszaút dátuma',
      peoplePh: 'pl. 8',
      fromPh: 'pl. Csíkszereda',
      toPh: 'pl. Balánbánya',
      namePh: 'Az Ön neve',
      phonePh: '+40 ...',
      notesPh: 'Csomag, visszaút ideje, egyéb…',
      submit: 'Küldés WhatsAppon',
      how: 'Az igénylés WhatsAppon megy a Tomilk Prodnak. Online fizetés nincs.',
      required: 'Töltse ki a kötelező mezőket (utasok, útvonal, név és telefon).',
      waIntro: 'Jó napot! Szeretnék ajánlatot kérni különjáratra:',
      yes: 'Igen',
      no: 'Nem',
    },
    contact: {
      title: 'Szálljon be!',
      lead: 'Kérdése van a járatokról, megállókról vagy időpontokról? Hívjon.',
      callLabel: 'Hívjon információért',
      area: 'Kiszolgált térség',
      areaNote: 'Balánbánya · Csíkszentdomokos · Csíkdánfalva · Csíkrákos · Nádasszék · Csíkszereda',
      hours: 'Járatok ideje',
      hoursNote: 'Hétfő–Vasárnap, első indulás 05:00',
      company: 'C\u00e9gn\u00e9v',
      email: 'E-mail',
      cui: 'CUI',
      address: 'C\u00edm',
    },
    footer: {
      company: 'Tomilk Prod S.R.L., menetrend szerinti személyszállítás Hargitában',
      built: 'Bemutatkozó oldal',
      source: 'Hivatalos menetrend',
    },
    railLabel: 'Az Ön útvonala',
    jegyCalc: {
      title: 'Jegy- és bérletárak',
      lead: 'Válassza ki az útvonalat, a megállókat és a jegy típusát.',
      route: 'Járat',
      from: 'Honnan',
      to: 'Hová',
      type: 'Típus',
      swap: 'Kiindulási és célállomás felcserélése',
      swapTitle: 'Felcserélés',
      selectStop: 'Válasszon megállót…',
      currency: 'RON',
      types: {
        jegy: 'Jegy',
        b1: '1 havi bérlet',
        b3: '3 heti bérlet',
        b2: '2 heti bérlet',
      },
      badge: { special: 'különleges bérlet', kmTable: 'km-tábla alapján számítva' },
      err: {
        missingStops: 'Válassza ki a kiindulási és a célmegállót.',
        sameStop: 'A két megálló megegyezik. Válasszon két különböző megállót.',
        unknownStop: 'A választott megálló nem szerepel ezen a járaton.',
        noPassData:
          'Ehhez az útvonalhoz nincs bérletár megadva. A 3 és 2 heti bérlet csak Csíkszeredából induló vagy oda érkező viszonylatra van megadva.',
      },
      note: 'Jegyárak érvényesek 2025. augusztus 1-től. Bérletárak érvényesek 2026. szeptember 7-től. Az árak lejben (RON) értendők.',
    },
    kulonCalc: {
      title: 'Különjárat – tájékoztató árajánlat',
      lead: 'Adja meg az útvonalat és az utazás adatait, a rendszer kiszámolja a távolságot és egy becsült árat.',
      from: 'Honnan (település)',
      fromPh: 'pl. Csíkszereda',
      to: 'Hová (település)',
      toPh: 'pl. Budapest',
      departDate: 'Indulás napja',
      pax: 'Személyek száma',
      paxPh: 'pl. 45',
      tripType: 'Út típusa',
      oneWay: 'Csak oda',
      round: 'Oda-vissza',
      returnDate: 'Visszaút napja',
      advanced: 'Ha ismeri a pontos távolságot',
      mkm: 'Egy út hossza (km)',
      mfk: 'ebből külföldön (km)',
      mka: 'Csíkszereda → indulás (km)',
      mkb: 'Cél → Csíkszereda (km)',
      mkbPh: 'üresen: = az út hossza',
      submit: 'Árajánlat kérése',
      submitBusy: 'Számolás…',
      givenDistance: 'Megadott távolság',
      vat: '+ ÁFA',
      currency: 'lej',
      paxUnit: 'fő',
      dayUnit: 'nap',
      perTrip: 'km / út',
      busUnit: 'db',
      rows: {
        loadedKm: 'Távolság utassal',
        emptyKm: 'Üresjárat Csíkszeredával',
        buses: 'Autóbuszok száma',
        loadedFee: 'Kilométerdíj (utassal)',
        emptyFee: 'Üresjárat díja',
        toll: 'Útdíj (külföld, becsült)',
        driver: 'Sofőr napidíj ({days} nap)',
        emptyHome: 'Üres hazautazás és visszajövetel',
        midpoint: 'Középérték',
      },
      err: {
        route: 'Adja meg az indulási és a célállomás nevét.',
        date: 'Adja meg az indulás napját.',
        pax: 'Adja meg a személyek számát.',
        ret: 'Adja meg a visszaút napját.',
        retBefore: 'A visszaút nem lehet korábbi az indulásnál.',
        generic: 'Hiba történt a számítás során. Próbálja újra.',
      },
      note: 'Az ár tájékoztató jellegű, nem kötelező érvényű ajánlat. A nevét és telefonszámát csak a foglalás megerősítése esetén használjuk fel.',
    },
    calcBack: '← Vissza a főoldalra',
  },
};
