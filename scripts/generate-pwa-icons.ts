import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const publicDir = path.resolve(__dirname, "../public");
const iconsDir = path.join(publicDir, "icons");

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG with dark squircle background and green KUBIKA logo (perfect for app icon / maskable / apple)
const appIconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#16a34a" />
      <stop offset="100%" stop-color="#15803d" />
    </linearGradient>
    <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22c55e" />
      <stop offset="100%" stop-color="#16a34a" />
    </linearGradient>
    <mask id="tagmask">
      <rect width="100" height="100" fill="white" />
      <circle cx="68" cy="67" r="4.2" fill="black" />
    </mask>
  </defs>

  <!-- Dark base for standalone app icon -->
  <rect width="512" height="512" fill="#0B0B0D" />

  <!-- Inner safe-zone KUBIKA Symbol -->
  <g transform="translate(102, 102) scale(3.08)">
    <rect x="15" y="12" width="22" height="76" rx="10" fill="url(#g1)" />
    <path d="M 42 49 L 69 16 C 71.5 13 75.5 12 79 13.5 C 82.5 15 84.5 18.5 83.5 22 L 57 56 Z" fill="url(#g1)" />
    <path d="M 45 46 L 59 34 L 84 62 C 86 64.5 87 67.5 87 71 C 87 77.5 81.5 83 75 83 C 71.5 83 68.5 81.5 66 79 L 45 46 Z" fill="url(#g2)" mask="url(#tagmask)" />
  </g>
</svg>
`;

// Transparent SVG for standard icon
const transparentIconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#16a34a" />
      <stop offset="100%" stop-color="#15803d" />
    </linearGradient>
    <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22c55e" />
      <stop offset="100%" stop-color="#16a34a" />
    </linearGradient>
    <mask id="tagmask">
      <rect width="100" height="100" fill="white" />
      <circle cx="68" cy="67" r="4.2" fill="black" />
    </mask>
  </defs>

  <g transform="translate(56, 56) scale(4)">
    <rect x="15" y="12" width="22" height="76" rx="10" fill="url(#g1)" />
    <path d="M 42 49 L 69 16 C 71.5 13 75.5 12 79 13.5 C 82.5 15 84.5 18.5 83.5 22 L 57 56 Z" fill="url(#g1)" />
    <path d="M 45 46 L 59 34 L 84 62 C 86 64.5 87 67.5 87 71 C 87 77.5 81.5 83 75 83 C 71.5 83 68.5 81.5 66 79 L 45 46 Z" fill="url(#g2)" mask="url(#tagmask)" />
  </g>
</svg>
`;

async function generate() {
  console.log("Generating PWA PNG icons...");

  // 1. icon-512x512.png (solid dark background)
  await sharp(Buffer.from(appIconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, "icon-512x512.png"));

  // 2. icon-192x192.png
  await sharp(Buffer.from(appIconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, "icon-192x192.png"));

  // 3. icon-maskable-512x512.png (maskable safe area with background)
  await sharp(Buffer.from(appIconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, "icon-maskable-512x512.png"));

  // 4. apple-touch-icon.png (180x180)
  await sharp(Buffer.from(appIconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(iconsDir, "apple-touch-icon.png"));

  // 5. favicon-32x32.png
  await sharp(Buffer.from(appIconSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(iconsDir, "favicon-32x32.png"));

  // 6. favicon-16x16.png
  await sharp(Buffer.from(appIconSvg))
    .resize(16, 16)
    .png()
    .toFile(path.join(iconsDir, "favicon-16x16.png"));

  // Also write apple-touch-icon in public root for crawlers/iOS
  await sharp(Buffer.from(appIconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, "apple-touch-icon.png"));

  console.log("All PWA PNG icons generated successfully!");
}

generate().catch(console.error);
