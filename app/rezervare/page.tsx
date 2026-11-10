import { redirect } from 'next/navigation';
import { getLang } from '../lang';
import BookingSuccess from './BookingSuccess';

export default async function Rezervare({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const [{ sent }, lang] = await Promise.all([searchParams, getLang()]);
  if (sent !== '1') redirect('/oferta');
  return <BookingSuccess initialLang={lang} />;
}
