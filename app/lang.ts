import { cookies } from 'next/headers';
import { LANG_COOKIE, type Lang } from './content';

/* Server-side read of the saved language cookie so pages render in the
   correct language on first paint (no Romanian→Hungarian flash). */
export async function getLang(): Promise<Lang> {
  const value = (await cookies()).get(LANG_COOKIE)?.value;
  return value === 'hu' ? 'hu' : 'ro';
}
