'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// lang: 'hi' (हिंदी) | 'sd' (सिंधी — Devanagari script so one font works
// everywhere and elders familiar with Hindi letters can read it too)
// scale: text-size multiplier controlled by the A− / A+ buttons.
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('hi');
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const savedLang = localStorage.getItem('mandir-lang');
    const savedScale = parseFloat(localStorage.getItem('mandir-scale'));
    if (savedLang === 'hi' || savedLang === 'sd') setLang(savedLang);
    if (savedScale >= 0.85 && savedScale <= 1.6) setScale(savedScale);
  }, []);

  useEffect(() => {
    localStorage.setItem('mandir-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('mandir-scale', String(scale));
    document.documentElement.style.setProperty('--scale', scale);
  }, [scale]);

  const toggleLang = () => setLang((l) => (l === 'hi' ? 'sd' : 'hi'));
  const bigger = () => setScale((s) => Math.min(1.6, +(s + 0.15).toFixed(2)));
  const smaller = () => setScale((s) => Math.max(0.85, +(s - 0.15).toFixed(2)));

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, scale, bigger, smaller }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
