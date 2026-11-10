'use client';

import { useState } from 'react';
import { COPY, WHATSAPP, type Lang } from '@/app/content';
import { KULONJARAT_CONFIG } from '@/data/tarifak';
import {
  inputFromRoute,
  szamitKulonjarat,
  type KulonjaratResult,
  type RouteResponse,
} from '@/lib/kulonjarat';

type T = (typeof COPY)['hu'];

type Out = {
  res: KulonjaratResult;
  route: RouteResponse;
  pax: number;
  round: boolean;
  days: number;
};

const MS_PER_DAY = 86_400_000;

export default function KulonjaratKalkulator({ t, lang }: { t: T; lang: Lang }) {
  const c = t.kulonCalc;
  const dateParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Bucharest', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const year = Number(dateParts.find(p => p.type === 'year')?.value);
  const month = Number(dateParts.find(p => p.type === 'month')?.value);
  const day = Number(dateParts.find(p => p.type === 'day')?.value);
  const earliestDepart = new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [depart, setDepart] = useState('');
  const [ret, setRet] = useState('');
  const [pax, setPax] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [round, setRound] = useState(true);
  // „Ha ismeri a pontos távolságot” mezők:
  const [mkm, setMkm] = useState('');
  const [mfk, setMfk] = useState('');
  const [mka, setMka] = useState('');
  const [mkb, setMkb] = useState('');

  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<Out | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSent, setBookingSent] = useState(false);
  const [bookingChannel, setBookingChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [bookingSending, setBookingSending] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [whatsappAwaitingConfirmation, setWhatsappAwaitingConfirmation] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  // Ezres csoportositas normal szokozzel (a hu-HU nem toro szokozeit csereljuk).
  const fmt = (n: number) =>
    Math.round(n)
      .toLocaleString('hu-HU')
      .replace(/[\u00a0\u202f]/g, ' ');

  // Indulásváltáskor a visszaút igazodik (nem lehet korábbi).
  const onDepart = (v: string) => {
    setDepart(v);
    if (!ret || ret < v) setRet(v);
  };

  /** Kézi távolság → RouteResponse (a km-mezők kitöltésekor). */
  const manualRoute = (): RouteResponse => {
    const km = Math.max(parseFloat(mkm) || 0, 0);
    const f = Math.min(Math.max(parseFloat(mfk) || 0, 0), km);
    const a = Math.max(parseFloat(mka) || 0, 0);
    const b = mkb === '' ? km : Math.max(parseFloat(mkb) || 0, 0);
    const home = KULONJARAT_CONFIG.homeCountry;
    const mainCountries =
      f > 0
        ? [{ name: home, km: km - f }, { name: 'Külföld', km: f }]
        : [{ name: home, km }];
    return {
      from,
      to,
      main: { km, countries: mainCountries },
      base_to_from: { km: a, countries: a > 0 ? [{ name: home, km: a }] : [] },
      to_to_base: { km: b, countries: b > 0 ? [{ name: home, km: b }] : [] },
    };
  };

  const fetchRoute = async (): Promise<RouteResponse> => {
    const res = await fetch(
      `/api/route?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
    );
    const data: unknown = await res.json();
    if (!res.ok) {
      const msg =
        typeof data === 'object' && data && 'error' in data
          ? String((data as { error: unknown }).error)
          : c.err.generic;
      throw new Error(msg);
    }
    return data as RouteResponse;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');

    const paxNum = parseInt(pax, 10);
    const hasManual = (parseFloat(mkm) || 0) > 0;

    if (!hasManual && (!from.trim() || !to.trim())) return setErr(c.err.route);
    if (!depart || depart < earliestDepart) {
      return setErr(lang === 'hu' ? 'Válasszon holnapi vagy későbbi indulási dátumot.' : 'Alegeți o dată de plecare de mâine sau ulterioară.');
    }
    if (!(paxNum >= 1)) return setErr(c.err.pax);
    if (!name.trim() || !phone.trim()) return setErr(lang === 'hu' ? 'Adja meg a nevét és telefonszámát.' : 'Introdu numele și numărul de telefon.');
    if (round && !ret) return setErr(c.err.ret);
    if (round && ret < depart) return setErr(c.err.retBefore);

    const days = round ? Math.round((+new Date(ret) - +new Date(depart)) / MS_PER_DAY) + 1 : 1;

    setBusy(true);
    try {
      const route = hasManual ? manualRoute() : await fetchRoute();
      const res = szamitKulonjarat(
        inputFromRoute(route, { pax: paxNum, roundTrip: round, days }),
        KULONJARAT_CONFIG
      );
      setOut({ res, route, pax: paxNum, round, days });
      setBookingOpen(false);
      setBookingSent(false);
    } catch (e2) {
      setOut(null);
      setErr(e2 instanceof Error ? e2.message : c.err.generic);
    } finally {
      setBusy(false);
    }
  };

  const submitBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBookingError('');
    setBookingSending(true);
    const when = [depart, time].filter(Boolean).join(' ');
    const message = [
      lang === 'hu' ? 'Foglalási kérelem — elfogadott előzetes ajánlat' : 'Cerere de rezervare — estimare acceptată', '',
      `${c.from}: ${from}`, `${c.to}: ${to}`, `${c.pax}: ${pax}`,
      `${lang === 'hu' ? 'Az út hossza' : 'Lungimea traseului'}: ${fmt(out!.route.main.km)} km`,
      `${c.tripType}: ${round ? c.round : c.oneWay}`, `${c.departDate}: ${when}`,
      round && ret ? `${c.returnDate}: ${ret}` : '',
      `${lang === 'hu' ? 'Név' : 'Nume'}: ${name}`, `${lang === 'hu' ? 'Telefon' : 'Telefon'}: ${phone}`,
      `${lang === 'hu' ? 'Becsült ár' : 'Estimare'}: ${fmt(out!.res.low)}–${fmt(out!.res.high)} ${c.currency}`,
      notes.trim() ? `${lang === 'hu' ? 'Megjegyzés' : 'Observații'}: ${notes}` : '',
    ].filter(Boolean).join('\n');

    try {
      if (bookingChannel === 'email') {
        const response = await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, language: lang }),
        });
        if (!response.ok) {
          throw new Error(response.status === 503 ? 'email_not_configured' : 'email_delivery_failed');
        }
      } else {
        const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
        const win = window.open(url, '_blank');
        if (win) win.opener = null;
        setWhatsappUrl(url);
        setWhatsappAwaitingConfirmation(true);
        setBookingOpen(false);
        return;
      }
      setBookingSent(true);
    } catch (error) {
      const code = error instanceof Error ? error.message : 'email_delivery_failed';
      setBookingError(lang === 'hu'
        ? code === 'email_not_configured' ? 'Az e-mailes küldés még nincs beállítva. Kérjük, válassza a WhatsAppot.' : 'Az e-mail küldése nem sikerült. Próbálja újra, vagy válassza a WhatsAppot.'
        : code === 'email_not_configured' ? 'Trimiterea e-mailului nu este configurată. Selectați WhatsApp.' : 'E-mailul nu a putut fi trimis. Încercați din nou sau selectați WhatsApp.');
    } finally {
      setBookingSending(false);
    }
  };

  return (
    <section className="block booking-sec kulonjarat-page">
      <div className="wrap booking-wrap">
        <header className="sec-head">
          <h2>{lang === 'hu' ? 'Különjárat — ajánlatkérés és foglalás' : 'Transport privat — ofertă și rezervare'}</h2>
          <p>{lang === 'hu' ? 'Kérjen ajánlatot és foglaljon egyszerűen, néhány kattintással.' : 'Solicitați o ofertă și rezervați simplu, în doar câteva clicuri.'}</p>
        </header>

        <form className="bk-form" onSubmit={submit} noValidate>
          <div className="bk-grid">
            <label className="field">
              <span>{c.from}</span>
              <input
                type="text"
                placeholder={c.fromPh}
                value={from}
                onChange={e => setFrom(e.target.value)}
                autoComplete="off"
              />
            </label>
            <label className="field">
              <span>{c.to}</span>
              <input
                type="text"
                placeholder={c.toPh}
                value={to}
                onChange={e => setTo(e.target.value)}
                autoComplete="off"
              />
            </label>
          </div>

          <div className="kulon-or" aria-hidden="true">{lang === 'hu' ? 'VAGY' : 'SAU'}</div>
          <label className="field kulon-distance">
            <span>{lang === 'hu' ? 'Az utazás hossza kilométerben' : 'Lungimea călătoriei în kilometri'}</span>
            <input
              type="number"
              min={1}
              inputMode="numeric"
              value={mkm}
              onChange={e => setMkm(e.target.value)}
            />
          </label>

          <div className="bk-grid" style={{ marginTop: '1.1rem' }}>
            <label className="field">
              <span>{c.departDate}</span>
              <input type="date" min={earliestDepart} value={depart} onChange={e => onDepart(e.target.value)} />
            </label>
            <label className="field">
              <span>{c.pax}</span>
              <input
                type="number"
                min={1}
                max={500}
                inputMode="numeric"
                placeholder={c.paxPh}
                value={pax}
                onChange={e => setPax(e.target.value)}
              />
            </label>
            <label className="field">
              <span>{lang === 'hu' ? 'Név *' : 'Nume *'}</span>
              <input type="text" autoComplete="name" value={name} onChange={e => setName(e.target.value)} required />
            </label>
            <label className="field">
              <span>{lang === 'hu' ? 'Telefonszám *' : 'Număr de telefon *'}</span>
              <input type="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
            </label>
          </div>

          <div className="bk-trip" style={{ marginTop: '1.1rem' }}>
            <span className="field-legend" id="kulon-trip">
              {c.tripType}
            </span>
            <div className="seg" role="group" aria-labelledby="kulon-trip">
              <button
                type="button"
                className={`seg-btn${!round ? ' is-on' : ''}`}
                aria-pressed={!round}
                onClick={() => setRound(false)}
              >
                {c.oneWay}
              </button>
              <button
                type="button"
                className={`seg-btn${round ? ' is-on' : ''}`}
                aria-pressed={round}
                onClick={() => setRound(true)}
              >
                {c.round}
              </button>
            </div>
          </div>

          {round && (
            <label className="field" style={{ marginTop: '1.1rem', maxWidth: 320 }}>
              <span>{c.returnDate}</span>
              <input
                type="date"
                value={ret}
                min={depart || undefined}
                onChange={e => setRet(e.target.value)}
              />
            </label>
          )}

          <div className="bk-submit">
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? c.submitBusy : c.submit}
            </button>
          </div>

          {err && (
            <p className="bk-err" role="alert">
              {err}
            </p>
          )}
        </form>

        <div aria-live="polite">
          {out && <>
            <QuoteResult c={c} out={out} fmt={fmt} />
            {!bookingOpen && !bookingSent && !whatsappAwaitingConfirmation && <div className="bk-submit fleet-book-cta">
              <button type="button" className="btn btn-primary" onClick={() => setBookingOpen(true)}>
                {lang === 'hu' ? 'Tovább a foglalásra' : 'Continuați la rezervare'}
                <span aria-hidden="true">→</span>
              </button>
            </div>}
            {bookingOpen && <form className="bk-form fleet-booking-form" onSubmit={submitBooking}>
              <h3>{lang === 'hu' ? 'További információk' : 'Informații suplimentare'}</h3>
              <div className="bk-trip booking-channel">
                <span className="field-legend">{lang === 'hu' ? 'Küldés módja' : 'Metoda de trimitere'}</span>
                <div className="seg" role="group" aria-label={lang === 'hu' ? 'Küldés módja' : 'Metoda de trimitere'}>
                  <button type="button" className={`seg-btn${bookingChannel === 'whatsapp' ? ' is-on' : ''}`} aria-pressed={bookingChannel === 'whatsapp'} onClick={() => setBookingChannel('whatsapp')}>WhatsApp</button>
                  <button type="button" className={`seg-btn${bookingChannel === 'email' ? ' is-on' : ''}`} aria-pressed={bookingChannel === 'email'} onClick={() => setBookingChannel('email')}>E-mail</button>
                </div>
              </div>
              <div className="bk-grid">
                <label className="field"><span>{lang === 'hu' ? 'Indulás pontos órája *' : 'Ora exactă de plecare *'}</span><input type="time" value={time} onChange={e => setTime(e.target.value)} required /></label>
                <label className="field field-full"><span>{lang === 'hu' ? 'Megjegyzés' : 'Observații'}</span><textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} /></label>
              </div>
              {bookingError && <p className="bk-err" role="alert">{bookingError}</p>}
              <div className="bk-submit"><button type="submit" className="btn btn-primary" disabled={bookingSending}>{bookingSending ? (lang === 'hu' ? 'Küldés…' : 'Se trimite…') : (lang === 'hu' ? 'Foglalási kérelem elküldése' : 'Trimite cererea de rezervare')}</button></div>
            </form>}
            {whatsappAwaitingConfirmation && !bookingSent && <div className="fleet-book-success" role="status">
              <p>{lang === 'hu' ? 'Miután elküldte a foglalási kérelmet WhatsAppon, térjen vissza ide, és erősítse meg az elküldést.' : 'După ce trimiteți cererea pe WhatsApp, reveniți aici și confirmați trimiterea.'}</p>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">
                {lang === 'hu' ? 'WhatsApp megnyitása' : 'Deschide WhatsApp'}
              </a>
              <button type="button" className="btn btn-primary" onClick={() => { window.location.href = '/rezervare?sent=1'; }}>
                {lang === 'hu' ? 'Elküldtem a WhatsApp-kérelmet' : 'Am trimis cererea pe WhatsApp'}
              </button>
            </div>}
            {bookingSent && <p className="fleet-book-success" role="status">{lang === 'hu' ? 'Foglalási kérelmét elküldtük. Munkatársunk hamarosan visszajelez a megadott telefonszámon.' : 'Cererea de rezervare a fost trimisă. Vă vom contacta în cel mai scurt timp la numărul de telefon indicat.'}</p>}
          </>}
        </div>

        <p className="calc-note">{c.note}</p>
      </div>
    </section>
  );
}

function QuoteResult({
  c,
  out,
  fmt,
}: {
  c: T['kulonCalc'];
  out: Out;
  fmt: (n: number) => string;
}) {
  const { res, route, pax, round, days } = out;
  const title = !route.from && !route.to ? c.givenDistance : `${route.from} → ${route.to}`;
  const meta = `${pax} ${c.paxUnit} · ${round ? c.round : c.oneWay} · ${days} ${c.dayUnit} · ${fmt(
    route.main.km
  )} ${c.perTrip}`;

  const rows: [string, string][] = [[c.rows.loadedKm, `${fmt(res.loadedKm)} km`]];
  if (res.emptyKm) rows.push([c.rows.emptyKm, `${fmt(res.emptyKm)} km`]);
  rows.push([c.rows.buses, `${res.busCount} ${c.busUnit} (${res.buses.join(' + ')} ${c.paxUnit})`]);
  rows.push([c.rows.loadedFee, `${fmt(res.loadedRon)} ${c.currency}`]);
  if (res.emptyRon) rows.push([c.rows.emptyFee, `${fmt(res.emptyRon)} ${c.currency}`]);
  if (res.tollRon) rows.push([c.rows.toll, `${fmt(res.tollRon)} ${c.currency}`]);
  if (res.extraRon) {
    const label =
      res.extraMode === 'empty' ? c.rows.emptyHome : c.rows.driver.replace('{days}', String(res.driverDays));
    rows.push([label, `${fmt(res.extraRon)} ${c.currency}`]);
  }
  rows.push([c.rows.midpoint, `${fmt(res.midpoint)} ${c.currency}`]);

  return (
    <div className="calc-quote">
      <div className="calc-quote-head">
        <div className="calc-quote-route">{title}</div>
        <div className="calc-quote-meta">{meta}</div>
      </div>
      <div className="calc-quote-stub">
        <div className="calc-quote-range">
          {fmt(res.low)} – {fmt(res.high)} {c.currency}
        </div>
        <div className="calc-quote-vat">{c.vat}</div>
      </div>
      <table className="calc-quote-rows">
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={i}>
              <td className="calc-quote-l">{label}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
