const fs = require('fs');
const path = require('path');

// Simple base64 for a small transparent PNG
const transparentPNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

const screenshotsDir = path.join(__dirname, 'public', 'screenshots');

// Create placeholder screenshots
const screenshots = [
  { name: 'desktop-home.png', width: 1280, height: 720 },
  { name: 'mobile-home.png', width: 375, height: 667 }
];

// Create basic placeholder PNGs
const basicPNG = Buffer.from(transparentPNG, 'base64');

screenshots.forEach(screenshot => {
  fs.writeFileSync(path.join(screenshotsDir, screenshot.name), basicPNG);
  console.log(`Generated ${screenshot.name}`);
});

console.log('Screenshot placeholders created!');
