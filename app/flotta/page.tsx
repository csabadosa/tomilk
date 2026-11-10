import type { Metadata } from 'next';
import { getLang } from '../lang';
import FlottaClient from './FlottaClient';

export const metadata: Metadata = {
  title: 'Flotta — Tomilk Prod',
  description: 'Cele 15 vehicule din flota Tomilk Prod: microbuze și autobuze pentru curse regulate și transport privat.',
};

export default async function Flotta() {
  const lang = await getLang();
  return <FlottaClient initialLang={lang} />;
}
