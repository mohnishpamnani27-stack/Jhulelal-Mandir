'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { ui } from '@/lib/content';

// Sticky saffron header. showBack=true on scripture pages gives elders a
// large, obvious way home; the language pill and A−/A+ are always present.
export default function Header({ title, subtitle, showBack = false }) {
  const { lang, toggleLang, bigger, smaller } = useLanguage();

  return (
    <header className="header">
      {showBack && (
        <Link href="/" className="back-btn" aria-label={ui.back[lang]}>
          ←
        </Link>
      )}
      <h1>
        {title || ui.appName[lang]}
        {subtitle && <span className="header-sub">{subtitle}</span>}
      </h1>
      <div className="font-controls" aria-label="Text size">
        <button className="pill-btn" onClick={smaller} aria-label="छोटा अक्षर">
          A−
        </button>
        <button className="pill-btn" onClick={bigger} aria-label="बड़ा अक्षर">
          A+
        </button>
      </div>
      <button className="pill-btn" onClick={toggleLang}>
        {ui.langButton[lang]}
      </button>
    </header>
  );
}
