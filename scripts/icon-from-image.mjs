// Builds the PWA / home-screen icons from public/image.png.
// Run:  npm run icons:image
// 1. AI-removes the photo background (wall, glass case, carpet) so only
//    the shrine subject remains.
// 2. Trims the transparent edges and centers the subject on the app's
//    warm saffron gradient (icons can't be transparent — Android/iOS
//    would paint a black/white box behind them).
// Outputs: icon-192.png, icon-512.png, icon-maskable-512.png,
//          apple-touch-icon.png (180) and the raw cutout subject.png.

import { removeBackground } from '@imgly/background-removal-node';
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = path.join(root, 'public', 'image.png');
const iconsDir = path.join(root, 'public', 'icons');
mkdirSync(iconsDir, { recursive: true });

// Same saffron gradient as the original generated icon set.
const bg = (size, rounded) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#E8590C"/>
      <stop offset="1" stop-color="#B3541E"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.62">
      <stop offset="0" stop-color="#FFD98A" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#FFD98A" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${rounded ? Math.round(size * 0.1875) : 0}" fill="url(#bg)"/>
  <rect width="${size}" height="${size}" fill="url(#glow)"/>
</svg>`;

console.log('Removing background from image.png (AI model)…');
const blob = new Blob([readFileSync(source)], { type: 'image/png' });
const resultBlob = await removeBackground(blob);
const cutout = Buffer.from(await resultBlob.arrayBuffer());

// Trim fully-transparent edges so the subject fills its box.
const subject = await sharp(cutout).trim().png().toBuffer();
const subjectPath = path.join(iconsDir, 'subject.png');
await sharp(subject).toFile(subjectPath);
console.log('✓ subject.png (background removed)');

async function make(name, size, { safe = 0.84, rounded = false } = {}) {
  // Fit the subject inside `safe` × canvas, keeping aspect ratio.
  const inner = Math.round(size * safe);
  const fitted = await sharp(subject)
    .resize(inner, inner, { fit: 'inside' })
    .png()
    .toBuffer();
  await sharp(Buffer.from(bg(size, rounded)))
    .composite([{ input: fitted, gravity: 'centre' }])
    .png()
    .toFile(path.join(iconsDir, name));
  console.log('✓', name);
}

await make('icon-192.png', 192);
await make('icon-512.png', 512);
// Maskable: OS crops a circle/squircle out of the full square, so the
// subject must stay inside the central ~80% safe zone.
await make('icon-maskable-512.png', 512, { safe: 0.62 });
// iOS home-screen icon (no transparency, square — iOS rounds it itself).
await make('apple-touch-icon.png', 180, { safe: 0.86 });

console.log('Done.');
