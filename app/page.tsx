import { getLang } from './lang';
import HomeClient from './HomeClient';

export default async function Home() {
  const lang = await getLang();
  return <HomeClient initialLang={lang} />;
}
