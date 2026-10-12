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
  nav: { routes: string; schedule: string; fares: string; contact: string; call: string; private: string };
  hero: {
    kicker: string;
    h1a: string;
    h1b: string;
    lead: string;
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
    roundTrip: string;
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
  contact: { title: string; lead: string; callLabel: string; area: string; areaNote: string; hours: string; hoursNote: string };
  footer: { company: string; built: string; source: string };
  railLabel: string;
};

export const COPY: Record<Lang, Copy> = {
  ro: {
    nav: { routes: 'Linii', schedule: 'Orar', fares: 'Prețuri', contact: 'Contact', call: 'Sună', private: 'Transport privat' },
    hero: {
      kicker: 'Transport regulat prin bazinul Ciucului',
      h1a: 'Drumul spre casă,',
      h1b: 'în fiecare zi.',
      lead: 'Curse zilnice care leagă satele din Ciuc de Miercurea Ciuc. Urcă în Sprinter — de condus ne ocupăm noi.',
      seeSchedule: 'Vezi orarul',
      callNow: 'Sună acum',
      privateCta: 'Cerere transport privat',
      scrollHint: 'Pornim la drum',
    },
    stats: { departures: 'curse zilnice', towns: 'localități pe traseu', lines: 'linii regulate', from: 'bilet de la', fromUnit: 'RON' },
    routes: {
      title: 'Liniile noastre',
      lead: 'Două trasee regulate, dus-întors, în tot bazinul Ciucului.',
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
      roundTrip: 'Dus-întors',
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
    },
    footer: {
      company: 'Tomilk Prod S.R.L., transport regulat de persoane în Harghita',
      built: 'Pagină de prezentare',
      source: 'Orar oficial',
    },
    railLabel: 'Traseul tău',
  },
  hu: {
    nav: { routes: 'Járatok', schedule: 'Menetrend', fares: 'Árak', contact: 'Kapcsolat', call: 'Hívás', private: 'Különjárat' },
    hero: {
      kicker: 'Menetrend szerinti személyszállítás a Csíki-medencében',
      h1a: 'Az út hazafelé,',
      h1b: 'minden nap.',
      lead: 'Napi járatok, amelyek a csíki falvakat Csíkszeredával kötik össze. Szálljon fel a Sprinterre — a vezetést bízza ránk.',
      seeSchedule: 'Menetrend',
      callNow: 'Hívjon most',
      privateCta: 'Különjárat igénylése',
      scrollHint: 'Induljunk',
    },
    stats: { departures: 'napi járat', towns: 'település az útvonalon', lines: 'rendszeres járat', from: 'jegy már', fromUnit: 'lej-től' },
    routes: {
      title: 'Járataink',
      lead: 'Két rendszeres útvonal, oda-vissza, a Csíki-medencében.',
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
      roundTrip: 'Oda-vissza',
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
      title: 'Szálljon fel',
      lead: 'Kérdése van a járatokról, megállókról vagy időpontokról? Hívjon.',
      callLabel: 'Hívjon információért',
      area: 'Kiszolgált térség',
      areaNote: 'Balánbánya · Csíkszentdomokos · Csíkdánfalva · Csíkrákos · Nádasszék · Csíkszereda',
      hours: 'Járatok ideje',
      hoursNote: 'Hétfő–Vasárnap, első indulás 05:00',
    },
    footer: {
      company: 'Tomilk Prod S.R.L., menetrend szerinti személyszállítás Hargitában',
      built: 'Bemutatkozó oldal',
      source: 'Hivatalos menetrend',
    },
    railLabel: 'Az Ön útvonala',
  },
};
