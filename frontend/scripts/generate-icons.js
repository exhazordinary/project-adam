import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, '../public/icons');

// SVG template with coral gradient background and sparkles
const generateSVG = (size, isMaskable = false) => {
  const padding = isMaskable ? size * 0.1 : 0;
  const viewBox = isMaskable ? `${-padding} ${-padding} ${size + padding * 2} ${size + padding * 2}` : `0 0 ${size} ${size}`;
  const scale = size / 512;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${Math.round(110 * scale)}" fill="url(#gradient)"/>
  <defs>
    <linearGradient id="gradient" x1="0" y1="0" x2="${size}" y2="${size}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF9B7F"/>
      <stop offset="100%" stop-color="#FF6B52"/>
    </linearGradient>
  </defs>
  <g transform="translate(${size / 2}, ${size / 2}) scale(${scale})">
    <path d="M 0,-100 L 10,-10 L 100,0 L 10,10 L 0,100 L -10,10 L -100,0 L -10,-10 Z" fill="white" opacity="0.95"/>
    <path d="M 60,-60 L 65,-40 L 85,-35 L 65,-30 L 60,-10 L 55,-30 L 35,-35 L 55,-40 Z" fill="white" opacity="0.9"/>
    <path d="M -60,60 L -55,40 L -35,35 L -55,30 L -60,10 L -65,30 L -85,35 L -65,40 Z" fill="white" opacity="0.9"/>
    <circle cx="-80" cy="-50" r="8" fill="white" opacity="0.7"/>
    <circle cx="75" cy="45" r="6" fill="white" opacity="0.7"/>
    <circle cx="-40" cy="-80" r="5" fill="white" opacity="0.6"/>
    <circle cx="50" cy="75" r="7" fill="white" opacity="0.6"/>
  </g>
</svg>`;
};

// Ensure icons directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

console.log('Generating PWA icons...\n');

// Generate regular icons as SVG
sizes.forEach(size => {
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconDir, filename);
  const svg = generateSVG(size);
  fs.writeFileSync(filepath, svg);
  console.log(`✓ Generated ${filename}`);
});

// Generate maskable icons (192 and 512)
[192, 512].forEach(size => {
  const filename = `icon-${size}x${size}-maskable.svg`;
  const filepath = path.join(iconDir, filename);
  const svg = generateSVG(size, true);
  fs.writeFileSync(filepath, svg);
  console.log(`✓ Generated ${filename}`);
});

console.log('\n✨ All icons generated successfully!');
console.log('\nNote: SVG icons are generated. For PNG icons:');
console.log('1. Open public/icons/generate-icons.html in a browser');
console.log('2. Click "Generate All Icons"');
console.log('3. Download and save each PNG icon to public/icons/');
