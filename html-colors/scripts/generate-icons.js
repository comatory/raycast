const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const ASSETS_DIR = path.join(__dirname, '../assets');

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR);
}

// Generate color preview icons
function generateColorPreviewIcon(isDark) {
  const canvas = createCanvas(16, 16);
  const ctx = canvas.getContext('2d');

  // Draw a colored rectangle
  ctx.fillStyle = isDark ? '#FFFFFF' : '#000000';
  ctx.fillRect(0, 0, 16, 16);

  // Draw a border
  ctx.strokeStyle = isDark ? '#000000' : '#FFFFFF';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, 16, 16);

  return canvas;
}

// Generate category icons
function generateCategoryIcon(isBasic, isDark) {
  const canvas = createCanvas(16, 16);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = isDark ? '#333333' : '#CCCCCC';
  ctx.fillRect(0, 0, 16, 16);

  // Draw text
  ctx.fillStyle = isDark ? '#FFFFFF' : '#000000';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(isBasic ? 'B' : 'E', 8, 8);

  return canvas;
}

// Generate and save icons
const icons = [
  { name: 'color-preview-light', generator: () => generateColorPreviewIcon(false) },
  { name: 'color-preview-dark', generator: () => generateColorPreviewIcon(true) },
  { name: 'basic-icon-light', generator: () => generateCategoryIcon(true, false) },
  { name: 'basic-icon-dark', generator: () => generateCategoryIcon(true, true) },
  { name: 'extended-icon-light', generator: () => generateCategoryIcon(false, false) },
  { name: 'extended-icon-dark', generator: () => generateCategoryIcon(false, true) },
];

icons.forEach(({ name, generator }) => {
  const canvas = generator();
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(ASSETS_DIR, `${name}.png`), buffer);
});

console.log('Icons generated successfully!'); 