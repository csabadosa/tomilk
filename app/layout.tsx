import type { Metadata } from 'next';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import { getLang } from './lang';
import './globals.css';

const grotesk = Space_Grotesk({
  variable: '--font-grotesk',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

const mono = Space_Mono({
  variable: '--font-mono',
  weight: ['400', '700'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tomilk Prod — Curse regulate prin Ciuc',
  description:
    'Transport regulat de persoane în bazinul Ciucului: Bălan, Dănești, Racu și Miercurea Ciuc. Curse zilnice, flotă Mercedes Sprinter, bilete de la 5 RON.',
  icons: { icon: '/assets/tomilk_logo_transparent.png' },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const lang = await getLang();
  return (
    <html lang={lang}>
      <body className={`${grotesk.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
