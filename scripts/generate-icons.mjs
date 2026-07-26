// Generates the PWA icons and a placeholder deity image.
// Run:  npm run icons
// It creates a warm saffron 🪔-style icon set. Once the mandir's real
// photo (public/jhulelal.jpg) is added, re-run to build icons from it:
//   npm run icons -- --from-photo

import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const iconsDir = path.join(root, 'public', 'icons');
const photo = path.join(root, 'public', 'jhulelal.jpg');
mkdirSync(iconsDir, { recursive: true });

const usePhoto = process.argv.includes('--from-photo') && existsSync(photo);

// A diya (lamp) on saffron — simple, recognisable at small sizes.
const svg = (size, pad = 0) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#E8590C"/>
      <stop offset="1" stop-color="#B3541E"/>
    </linearGradient>
    <radialGradient id="flame" cx="0.5" cy="0.35" r="0.65">
      <stop offset="0" stop-color="#FFF6C9"/>
      <stop offset="0.55" stop-color="#F2B705"/>
      <stop offset="1" stop-color="#E8590C"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="${pad ? 0 : 96}" fill="url(#bg)"/>
  <ellipse cx="256" cy="368" rx="150" ry="46" fill="#7A3814"/>
  <path d="M106 368 Q256 452 406 368 Q396 420 256 430 Q116 420 106 368 Z" fill="#5C2A0E"/>
  <path d="M256 160 Q306 240 286 296 Q276 330 256 336 Q236 330 226 296 Q206 240 256 160 Z" fill="url(#flame)"/>
  <circle cx="256" cy="304" r="14" fill="#FFF6C9"/>
  <ellipse cx="256" cy="368" rx="118" ry="30" fill="#8B4513" opacity="0.55"/>
</svg>`;

async function make(name, size, { maskable = false } = {}) {
  const out = path.join(iconsDir, name);
  if (usePhoto) {
    // Photo centered on saffron, with safe-zone padding when maskable.
    const inner = Math.round(size * (maskable ? 0.66 : 0.86));
    const img = await sharp(photo)
      .resize(inner, inner, { fit: 'cover' })
      .composite([
        {
          input: Buffer.from(
            `<svg width="${inner}" height="${inner}"><circle cx="${inner / 2}" cy="${inner / 2}" r="${inner / 2}" fill="#fff"/></svg>`
          ),
          blend: 'dest-in',
        },
      ])
      .png()
      .toBuffer();
    await sharp(Buffer.from(svg(size, maskable ? 1 : 0)))
      .resize(size, size)
      .composite([{ input: img, gravity: 'center' }])
      .png()
      .toFile(out);
  } else {
    await sharp(Buffer.from(svg(size, maskable ? 1 : 0)))
      .resize(size, size)
      .png()
      .toFile(out);
  }
  console.log('✓', name);
}

await make('icon-192.png', 192);
await make('icon-512.png', 512);
await make('icon-maskable-512.png', 512, { maskable: true });

// Placeholder deity image so the homepage never shows a broken frame.
if (!existsSync(photo)) {
  await sharp(Buffer.from(svg(512, 1))).jpeg({ quality: 90 }).toFile(photo);
  console.log('✓ jhulelal.jpg (placeholder — replace with the real photo)');
}
console.log('Done.');
