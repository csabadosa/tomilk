import { getLang } from '../lang';
import RezervareClient from './RezervareClient';

export default async function Rezervare() {
  const lang = await getLang();
  return <RezervareClient initialLang={lang} />;
}
