'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useLanguage } from '@/lib/LanguageContext';
import { content, ui } from '@/lib/content';

// A framed devotional image that simply hides itself until the
// image file exists (e.g. before `npm run crop` has been run).
function HolyImage({ img, alt, caption }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <figure className="holy-figure">
      <div className="holy-frame">
        <img src={img} alt={alt || ''} loading="lazy" onError={() => setFailed(true)} />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

// Renders any scripture from lib/content.js as large, comfortable cards.
// Verse items can be:
//   'string'          → a verse card
//   { h: '...' }      → a section heading
//   { note: '...' }   → an instruction / refrain card (highlighted)
//   { img, alt, caption } → a golden-framed devotional image
export default function Reader({ id }) {
  const { lang } = useLanguage();
  const item = content[id];

  return (
    <>
      <Header title={item.title[lang]} showBack />
      <main className="reader">
        <h2 className="scripture-title">
          {item.icon} {item.title[lang]}
        </h2>
        <p className="scripture-deco">॰❁॰❁॰</p>
        {item.verses[lang].map((verse, i) => {
          if (typeof verse === 'object' && verse.img) {
            return <HolyImage key={i} img={verse.img} alt={verse.alt} caption={verse.caption} />;
          }
          if (typeof verse === 'object' && verse.h) {
            return (
              <h3 key={i} className="section-heading">
                {verse.h}
              </h3>
            );
          }
          if (typeof verse === 'object' && verse.note) {
            return (
              <article key={i} className="verse-card note">
                <p>{verse.note}</p>
              </article>
            );
          }
          return (
            <article key={i} className="verse-card">
              <p>{verse}</p>
            </article>
          );
        })}
        <p className="scripture-deco">॰❁॰❁॰</p>
        <p className="trust-credit">
          {ui.trustName[lang]}
          <span>{ui.trustPlace[lang]}</span>
        </p>
      </main>
    </>
  );
}
