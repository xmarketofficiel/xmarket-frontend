const fs = require('fs');
const path = require('path');

// Simple SVG icon template
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#3b82f6" rx="${size * 0.1}"/>
  <text x="50%" y="55%" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif" font-weight="bold" font-size="${size * 0.3}">XM</text>
</svg>
`;

// Create icons directory
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes needed
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Generate SVG icons (browsers can handle SVG icons for PWA)
sizes.forEach(size => {
  const svg = createIconSVG(size);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svg);
  console.log(`Generated icon-${size}x${size}.svg`);
});

console.log('Icons generated successfully!');
