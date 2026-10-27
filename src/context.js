import { createContext, useContext, useEffect, useState } from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';
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
  // Visitors can pause every animation (RGAA 13.8). Starts paused when the
  // system asks for reduced motion.
  const [motionOn, setMotionOn] = useState(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return readStored('motion', reduce ? 'off' : 'on') === 'on';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    store('lang', lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    store('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.motion = motionOn ? 'on' : 'off';
    store('motion', motionOn ? 'on' : 'off');
  }, [motionOn]);

  const value = {
    lang,
    setLang,
    theme,
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    motionOn,
    toggleMotion: () => setMotionOn((m) => !m),
    t: content[lang],
    u: ui[lang],
  };

  return (
    <SiteContext.Provider value={value}>
      <MotionConfig reducedMotion={motionOn ? 'user' : 'always'}>{children}</MotionConfig>
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}

// True when animations should not play: system setting or the site's pause button.
export function useStill() {
  const system = useReducedMotion();
  const { motionOn } = useSite();
  return system || !motionOn;
}

// Sets the browser tab title for the current page.
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Barsbold Myanganbaatar` : 'Barsbold Myanganbaatar · Développeur web full-stack';
  }, [title]);
}
