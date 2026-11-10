import type { Metadata } from 'next';
import { getLang } from '../lang';
import OfertaClient from './OfertaClient';

export const metadata: Metadata = {
  title: 'Ofertă transport privat — Tomilk Prod',
  description:
    'Calculator de ofertă orientativă pentru transport privat cu autocarul, pornind din Miercurea Ciuc, în țară și în Europa.',
};

export default async function Oferta() {
  const lang = await getLang();
  return <OfertaClient initialLang={lang} />;
}
