'use client';

import Link from 'next/link';
import { useState } from 'react';
import { COPY, WHATSAPP, type Lang } from '../content';
import { useLang } from '../useLang';
import DrivingScene from '@/components/DrivingScene';
import Nav from '@/components/Nav';
import { Footer } from '@/components/Sections';

type Form = {
  people: string;
  from: string;
  to: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  notes: string;
  roundTrip: boolean;
  returnDate: string;
};

const EMPTY: Form = {
  people: '',
  from: '',
  to: '',
  date: '',
  time: '',
  name: '',
  phone: '',
  notes: '',
  roundTrip: false,
  returnDate: '',
};

export default function RezervareClient({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useLang(initialLang);
  const [f, setF] = useState<Form>(EMPTY);
  const [err, setErr] = useState(false);
  const t = COPY[lang];
  const b = t.booking;

  const set = (k: keyof Form, v: string | boolean) => setF((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !f.people.trim() ||
      !f.from.trim() ||
      !f.to.trim() ||
      !f.name.trim() ||
      !f.phone.trim() ||
      (f.roundTrip && !f.returnDate)
    ) {
      setErr(true);
      return;
    }
    setErr(false);

    const when = [f.date, f.time].filter(Boolean).join(' ');
    const lines = [
      b.waIntro,
      '',
      `${b.people}: ${f.people}`,
      `${b.from}: ${f.from}`,
      `${b.to}: ${f.to}`,
      `${b.tripType}: ${f.roundTrip ? b.roundTrip : b.oneWay}`,
      when ? `${b.date}: ${when}` : '',
      f.roundTrip && f.returnDate ? `${b.returnDate}: ${f.returnDate}` : '',
      `${b.name}: ${f.name}`,
      `${b.phone}: ${f.phone}`,
      f.notes.trim() ? `${b.notes}: ${f.notes}` : '',
    ].filter(Boolean);

    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) window.location.href = url;
  };

  return (
    <>
      <DrivingScene lang={lang} />
      <Nav t={t} lang={lang} onLang={setLang} />
      <main>
        <section className="block booking-sec">
          <div className="wrap booking-wrap">
            <Link className="booking-back" href="/#top">
              {b.back}
            </Link>
            <header className="sec-head">
              <h2>{b.title}</h2>
              <p>{b.lead}</p>
            </header>

            <form className="bk-form" onSubmit={submit} noValidate>
              <div className="bk-trip">
                <div className="seg" role="group" aria-label={b.tripType}>
                  <button
                    type="button"
                    className={`seg-btn${!f.roundTrip ? ' is-on' : ''}`}
                    aria-pressed={!f.roundTrip}
                    onClick={() => {
                      set('roundTrip', false);
                      set('returnDate', '');
                    }}
                  >
                    {b.oneWay}
                  </button>
                  <button
                    type="button"
                    className={`seg-btn${f.roundTrip ? ' is-on' : ''}`}
                    aria-pressed={f.roundTrip}
                    onClick={() => set('roundTrip', true)}
                  >
                    {b.roundTrip}
                  </button>
                </div>
              </div>

              <div className="bk-grid">
                <label className="field field-full">
                  <span>{b.people} *</span>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    inputMode="numeric"
                    placeholder={b.peoplePh}
                    value={f.people}
                    onChange={(e) => set('people', e.target.value)}
                    required
                  />
                </label>
                <label className="field">
                  <span>{b.from} *</span>
                  <input
                    type="text"
                    placeholder={b.fromPh}
                    value={f.from}
                    onChange={(e) => set('from', e.target.value)}
                    required
                  />
                </label>
                <label className="field">
                  <span>{b.to} *</span>
                  <input
                    type="text"
                    placeholder={b.toPh}
                    value={f.to}
                    onChange={(e) => set('to', e.target.value)}
                    required
                  />
                </label>
                <label className="field">
                  <span>{b.date}</span>
                  <input type="date" value={f.date} onChange={(e) => set('date', e.target.value)} />
                </label>
                {f.roundTrip && (
                  <label className="field">
                    <span>{b.returnDate} *</span>
                    <input
                      type="date"
                      value={f.returnDate}
                      min={f.date || undefined}
                      onChange={(e) => set('returnDate', e.target.value)}
                      required
                    />
                  </label>
                )}
                <label className="field">
                  <span>{b.time}</span>
                  <input type="time" value={f.time} onChange={(e) => set('time', e.target.value)} />
                </label>
                <label className="field">
                  <span>{b.name} *</span>
                  <input
                    type="text"
                    placeholder={b.namePh}
                    value={f.name}
                    onChange={(e) => set('name', e.target.value)}
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="field">
                  <span>{b.phone} *</span>
                  <input
                    type="tel"
                    placeholder={b.phonePh}
                    value={f.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    autoComplete="tel"
                    required
                  />
                </label>
                <label className="field field-full">
                  <span>{b.notes}</span>
                  <textarea
                    rows={3}
                    placeholder={b.notesPh}
                    value={f.notes}
                    onChange={(e) => set('notes', e.target.value)}
                  />
                </label>
              </div>

              {err && (
                <p className="bk-err" role="alert">
                  {b.required}
                </p>
              )}

              <div className="bk-submit">
                <button type="submit" className="btn btn-primary btn-wa">
                  <WaGlyph />
                  {b.submit}
                </button>
                <p className="bk-how">{b.how}</p>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer t={t} />
    </>
  );
}

function WaGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.5 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.3-.9-2.7-1.2-4.4-4-4.6-4.2-.1-.2-1-1.4-1-2.6s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6c-.2.2-.3.4-.1.6.1.3.7 1.1 1.4 1.7.9.8 1.7 1.1 1.9 1.2.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.2.1.8-.1 1.4z" />
    </svg>
  );
}
