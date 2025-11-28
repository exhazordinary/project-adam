import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconDir = path.join(__dirname, '../public/icons');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function convertSVGtoPNG() {
  console.log('Converting SVG icons to PNG...\n');

  // Convert regular icons
  for (const size of sizes) {
    const svgPath = path.join(iconDir, `icon-${size}x${size}.svg`);
    const pngPath = path.join(iconDir, `icon-${size}x${size}.png`);

    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(pngPath);
      console.log(`✓ Converted icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`✗ Failed to convert icon-${size}x${size}.png:`, error.message);
    }
  }

  // Convert maskable icons
  for (const size of [192, 512]) {
    const svgPath = path.join(iconDir, `icon-${size}x${size}-maskable.svg`);
    const pngPath = path.join(iconDir, `icon-${size}x${size}-maskable.png`);

    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(pngPath);
      console.log(`✓ Converted icon-${size}x${size}-maskable.png`);
    } catch (error) {
      console.error(`✗ Failed to convert icon-${size}x${size}-maskable.png:`, error.message);
    }
  }

  console.log('\n✨ All PNG icons generated successfully!');
}

convertSVGtoPNG().catch(console.error);
