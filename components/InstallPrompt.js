'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { ui } from '@/lib/content';

// Shows a friendly "install this app" banner when the browser fires
// beforeinstallprompt (Chrome/Edge/Android). On iOS Safari that event
// never fires, so we show a one-time hint about Share → Add to Home Screen.
export default function InstallPrompt() {
  const { lang } = useLanguage();
  const [deferred, setDeferred] = useState(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Dismissal only lasts 7 days, then the banner may show again.
    const dismissedAt = Number(localStorage.getItem('mandir-install-dismissed'));
    if (dismissedAt && Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return;

    const onPrompt = (e) => {
      e.preventDefault();
      setDeferred(e);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const inApp = window.matchMedia('(display-mode: standalone)').matches;
    if (isIos && !inApp) setShowIosHint(true);

    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem('mandir-install-dismissed', String(Date.now()));
  };

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  if (dismissed || (!deferred && !showIosHint)) return null;

  return (
    <div className="install-banner" role="dialog" aria-live="polite">
      <p>
        {deferred
          ? ui.install[lang]
          : lang === 'hi'
            ? 'iPhone पर: Share बटन दबाकर "Add to Home Screen" चुनें।'
            : 'iPhone ते: Share बटण दबाए "Add to Home Screen" चूंडयो।'}
      </p>
      {deferred && (
        <button className="pill-btn" onClick={install}>
          {ui.installBtn[lang]}
        </button>
      )}
      <button className="close-x" onClick={dismiss} aria-label="बंद करें">
        ✕
      </button>
    </div>
  );
}
