// Crops the devotional pictures out of the mandir's three new posters:
//   public/hinglaj-poster.jpg        → public/hinglaj/mata.jpg    (हिंगलाज माता)
//   public/samagri-bahar-poster.jpg  → public/samagri/bahar.jpg   (samagri photo)
//   public/samagri-mandir-poster.jpg → public/samagri/mandir.jpg  (samagri thali)
// Run:  npm run crop:posters
// Crop windows are fractions of the poster size, so any resolution works.
// A missing poster is skipped with a hint instead of failing the run.

import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pub = (...p) => path.join(root, 'public', ...p);

// poster → { out, crop: [left, top, width, height] as fractions }
const JOBS = [
  {
    poster: 'hinglaj-poster.jpg',
    out: pub('hinglaj', 'mata.jpg'),
    label: 'हिंगलाज माता (deity, right side)',
    crop: [0.52, 0.22, 0.45, 0.44],
  },
  {
    poster: 'samagri-bahar-poster.jpg',
    out: pub('samagri', 'bahar.jpg'),
    label: 'samagri photo (milk, misri, kapur — bottom left)',
    crop: [0.01, 0.5, 0.45, 0.31],
  },
  {
    poster: 'samagri-mandir-poster.jpg',
    out: pub('samagri', 'mandir.jpg'),
    label: 'samagri thali (bottom centre)',
    crop: [0.37, 0.62, 0.52, 0.26],
  },
];

let done = 0;
for (const { poster, out, label, crop } of JOBS) {
  const src = pub(poster);
  if (!existsSync(src)) {
    console.log(`↷ skipped ${poster} — save the poster photo as public/${poster} first.`);
    continue;
  }
  mkdirSync(path.dirname(out), { recursive: true });
  const { width: W, height: H } = await sharp(src).metadata();
  const [l, t, w, h] = crop;
  await sharp(src)
    .extract({
      left: Math.round(l * W),
      top: Math.round(t * H),
      width: Math.round(w * W),
      height: Math.round(h * H),
    })
    .jpeg({ quality: 88 })
    .toFile(out);
  console.log('✓', path.relative(root, out).replace(/\\/g, '/'), '—', label);
  done++;
}
console.log(
  done === JOBS.length
    ? 'Done — all three pages will now show their pictures.'
    : `Done — ${done}/${JOBS.length} cropped. Pages without a picture simply hide it until the file exists.`
);
