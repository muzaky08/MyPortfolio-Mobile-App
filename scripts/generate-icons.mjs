/**
 * Generate app icon & Android adaptive icon with safe-zone padding.
 * Android adaptive icons crop ~17% from each edge — logo must be smaller & centered.
 */
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const source = path.join(root, 'assets', 'MYP.png');

const SIZE = 1024;
/** ~58% — keeps logo inside Android 66% safe zone */
const LOGO_RATIO = 0.58;
const BG_COLOR = '#003366';

const logoSize = Math.round(SIZE * LOGO_RATIO);

const resizedLogo = await sharp(source)
  .resize(logoSize, logoSize, { fit: 'contain' })
  .png()
  .toBuffer();

// Adaptive icon foreground (transparent canvas + centered logo)
await sharp({
  create: {
    width: SIZE,
    height: SIZE,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([{ input: resizedLogo, gravity: 'center' }])
  .png()
  .toFile(path.join(root, 'assets', 'adaptive-icon.png'));

// Full app icon (solid background + centered logo)
await sharp({
  create: {
    width: SIZE,
    height: SIZE,
    channels: 3,
    background: BG_COLOR,
  },
})
  .composite([{ input: resizedLogo, gravity: 'center' }])
  .png()
  .toFile(path.join(root, 'assets', 'icon.png'));

console.log('Generated assets/icon.png and assets/adaptive-icon.png');
