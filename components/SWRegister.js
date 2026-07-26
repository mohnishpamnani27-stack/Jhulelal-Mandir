'use client';

import { useEffect } from 'react';

// Registers the service worker that makes the app work offline.
// PRODUCTION ONLY: in `npm run dev` Next.js serves unhashed JS chunks,
// so a cache-first service worker would keep serving stale code and
// hide new changes. In dev we actively unregister + clear old caches.
export default function SWRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister());
      });
      if ('caches' in window) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
      }
      return;
    }

    navigator.serviceWorker.register('/sw.js').catch(() => {
      // offline support is a bonus — never break the app over it
    });
  }, []);
  return null;
}
