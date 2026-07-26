// Crops the two pictures out of the mandir's "साईं की अरदास" poster:
//   public/vidhi-poster.jpg  →  public/vidhi/patila.jpg  (gujji deh photo)
//                            →  public/vidhi/sai.jpg     (Sai on the throne)
// Run:  npm run crop
// Crop windows are fractions of the poster size, so any resolution works.

import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const poster = path.join(root, 'public', 'vidhi-poster.jpg');
const outDir = path.join(root, 'public', 'vidhi');

if (!existsSync(poster)) {
  console.error('✗ public/vidhi-poster.jpg not found — save the poster photo there first.');
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const { width: W, height: H } = await sharp(poster).metadata();

// fractions: [left, top, width, height]
const CROPS = {
  'patila.jpg': [0.06, 0.225, 0.43, 0.40], // golden frame, left side
  'sai.jpg': [0.585, 0.035, 0.345, 0.33], // deity on throne, top right
};

for (const [name, [l, t, w, h]] of Object.entries(CROPS)) {
  await sharp(poster)
    .extract({
      left: Math.round(l * W),
      top: Math.round(t * H),
      width: Math.round(w * W),
      height: Math.round(h * H),
    })
    .jpeg({ quality: 88 })
    .toFile(path.join(outDir, name));
  console.log('✓', `public/vidhi/${name}`);
}
console.log('Done — the vidhi page will now show both pictures.');
