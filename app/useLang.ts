'use client';

import { useState } from 'react';
import { LANG_COOKIE, type Lang } from './content';

/* Language preference seeded from the server (cookie) so the first
   paint is already in the right language — then persisted on change
   so it survives navigation between pages. */
export function useLang(initial: Lang): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>(initial);

  const set = (l: Lang) => {
    setLang(l);
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
  };

  return [lang, set];
}
