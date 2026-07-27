// Builds the PWA / home-screen icons from public/new-icon.png (the
// poster photo of the shrine artwork).
// Run:  npm run icons:poster
// 1. Crops the shrine artwork (lotus + fishes + drum + stuti band)
//    out of the poster photo, keeping the printed art intact — AI
//    background removal ghosts the translucent lotus petals, so the
//    crop is blended in instead of cut out.
// 2. Feathers the crop's edges and centers it LARGE on a matching
//    poster-style sunburst (icons can't be transparent — Android/iOS
//    would paint a black/white box behind them).
// Outputs: icon-192.png, icon-512.png, icon-maskable-512.png,
//          apple-touch-icon.png (180).

import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = path.join(root, 'public', 'new-icon.png');
const iconsDir = path.join(root, 'public', 'icons');
mkdirSync(iconsDir, { recursive: true });

// The shrine artwork region inside the 1200x1600 poster photo.
const CROP = { left: 295, top: 355, width: 640, height: 955 };

// Poster-style background: warm golden glow high up (behind the lotus)
// with saffron sun rays, matching the printed poster.
function bg(size) {
  const cx = size / 2;
  const cy = size * 0.3;
  const R = size * 1.8;
  const rays = [];
  const N = 12;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const w = ((Math.PI * 2) / N) * 0.5 * 0.55; // ray half-width
    const x1 = cx + R * Math.cos(a - w);
    const y1 = cy + R * Math.sin(a - w);
    const x2 = cx + R * Math.cos(a + w);
    const y2 = cy + R * Math.sin(a + w);
    rays.push(
      `<polygon points="${cx},${cy} ${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}" fill="#FFDF8E" opacity="0.45"/>`
    );
  }
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <defs>
    <radialGradient id="sun" cx="0.5" cy="0.3" r="0.95">
      <stop offset="0" stop-color="#FFEDB0"/>
      <stop offset="0.45" stop-color="#FFBE4D"/>
      <stop offset="1" stop-color="#F07C0D"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#sun)"/>
  ${rays.join('\n  ')}
</svg>`;
}

// The shrine sits behind a glass case, so the photo carries a whitish
// reflection haze. Lift saturation/contrast and sharpen to bring the
// printed colours back and keep the icon crisp when scaled down.
const cropped = await sharp(source)
  .extract(CROP)
  .modulate({ saturation: 1.35, brightness: 1.02 })
  .linear(1.18, -14) // contrast: cuts the milky glass veil
  .sharpen({ sigma: 1.2 })
  .png()
  .toBuffer();

// Soften the crop's rectangular edges so the printed poster background
// melts into the generated sunburst instead of showing a hard seam.
async function feather(buf, w, h, featherPx) {
  const mask = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="${featherPx / 2}"/>
    </filter>
  </defs>
  <rect x="${featherPx}" y="${featherPx}" width="${w - 2 * featherPx}" height="${h - 2 * featherPx}"
        rx="${featherPx * 1.5}" fill="#fff" filter="url(#soft)"/>
</svg>`;
  return sharp(buf)
    .composite([{ input: Buffer.from(mask), blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function make(name, size, { safe = 0.94 } = {}) {
  // Fit the crop inside `safe` × canvas, keeping aspect ratio.
  const inner = Math.round(size * safe);
  const { data: fitted, info } = await sharp(cropped)
    .resize(inner, inner, { fit: 'inside' })
    .png()
    .toBuffer({ resolveWithObject: true });
  const soft = await feather(fitted, info.width, info.height, Math.max(6, Math.round(size * 0.035)));
  await sharp(Buffer.from(bg(size)))
    .composite([{ input: soft, gravity: 'centre' }])
    .png()
    .toFile(path.join(iconsDir, name));
  console.log('✓', name);
}

// Regular icons: subject fills nearly the whole square.
await make('icon-192.png', 192);
await make('icon-512.png', 512);
// Maskable: OS crops a circle/squircle out of the full square, so the
// tall subject must fit inside the central safe circle (~80% diameter).
await make('icon-maskable-512.png', 512, { safe: 0.72 });
// iOS home-screen icon (no transparency, square — iOS rounds it itself).
await make('apple-touch-icon.png', 180, { safe: 0.92 });

console.log('Done.');
