import { createContext, useContext, useEffect, useState } from 'react';
import { content, ui } from './content';

const SiteContext = createContext(null);

function readStored(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function store(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable: keep in memory only */
  }
}

export function SiteProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const browser = (navigator.language || 'fr').slice(0, 2);
    return readStored('lang', browser === 'fr' ? 'fr' : 'en');
  });
  const [theme, setTheme] = useState(() => readStored('theme', 'dark'));

  useEffect(() => {
    document.documentElement.lang = lang;
    store('lang', lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    store('theme', theme);
  }, [theme]);

  const value = {
    lang,
    setLang,
    theme,
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    t: content[lang],
    u: ui[lang],
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}

// Sets the browser tab title for the current page.
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Barsbold Myanganbaatar` : 'Barsbold Myanganbaatar · Développeur web full-stack';
  }, [title]);
}
