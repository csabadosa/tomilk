import type { Metadata } from 'next';
import { getLang } from '../lang';
import RolunkClient from './RolunkClient';

export const metadata: Metadata = {
  title: 'Rólunk — Tomilk Prod',
  description: 'Ismerje meg a Tomilk Prod családi vállalkozást, amely 1997 óta szállítja utasait.',
};

export default async function Rolunk() {
  const lang = await getLang();
  return <RolunkClient initialLang={lang} />;
}
