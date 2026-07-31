'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import InstallPrompt from '@/components/InstallPrompt';
import { useLanguage } from '@/lib/LanguageContext';
import { content, featureOrder, ui } from '@/lib/content';
import { templeHistory, varunDevtaBiography } from '@/lib/history';

// Home page — every feature is one tap away, exactly as elders need.
export default function Home() {
  const { lang } = useLanguage();

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <p className="trust-banner">
            ✦ {ui.trustName[lang]} ✦
            <span className="trust-place">{ui.trustPlace[lang]}</span>
          </p>
          <div className="deity-frame">
            {/* Replace /public/jhulelal.jpg with the mandir's own photo */}
            <img src="/jhulelal.jpg" alt="भगवान झूलेलाल" />
          </div>
          <p className="jai-line">{ui.tagline[lang]}</p>
          <p className="welcome-line">{ui.welcome[lang]}</p>
        </section>

        <nav className="grid" aria-label="Features">
          <Link href={`/${templeHistory.id}`} className="feature-card feature-card-history" lang="hi">
            <span className="icon" aria-hidden="true">{templeHistory.icon}</span>
            <span className="label">
              {templeHistory.title}
              <span className="label-sub">{templeHistory.subtitle}</span>
            </span>
            <span className="history-card-arrow" aria-hidden="true">→</span>
          </Link>
          <Link href={`/${varunDevtaBiography.id}`} className="feature-card feature-card-history" lang="hi">
            <span className="icon" aria-hidden="true">{varunDevtaBiography.icon}</span>
            <span className="label">
              {varunDevtaBiography.title}
              <span className="label-sub">{varunDevtaBiography.subtitle}</span>
            </span>
            <span className="history-card-arrow" aria-hidden="true">→</span>
          </Link>
          {featureOrder.map((key) => {
            const item = content[key];
            return (
              <Link key={key} href={`/${item.id}`} className="feature-card">
                <span className="icon" aria-hidden="true">{item.icon}</span>
                <span className="label">
                  {item.title[lang]}
                  <span className="label-sub">{item.subtitle[lang]}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        <footer className="footer">{ui.footer[lang]}</footer>
      </main>
      <InstallPrompt />
    </>
  );
}
