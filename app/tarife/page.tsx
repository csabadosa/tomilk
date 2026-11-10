import type { Metadata } from 'next';
import { getLang } from '../lang';
import TarifeClient from './TarifeClient';

export const metadata: Metadata = {
  title: 'Prețuri bilete și abonamente — Tomilk Prod',
  description:
    'Calculator de prețuri pentru bilete și abonamente pe liniile Miercurea Ciuc – Bălan și Miercurea Ciuc – Nădejdea.',
};

export default async function Tarife() {
  const lang = await getLang();
  return <TarifeClient initialLang={lang} />;
}
