"use client"

export const dominantColorFromEmoji = (emoji:any, size = 256, lightenFactor = 0.7) => {
 
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if(!ctx) return;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${Math.floor(size * 0.8)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif`;
  ctx.clearRect(0, 0, size, size);
  ctx.fillText(emoji, size / 2, size / 2);

  
  const { data } = ctx.getImageData(0, 0, size, size);


  const hist = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];

    
    if (a < 32) continue;

    
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max; 
    if ((sat < 0.15 && max > 220) || (sat < 0.06)) continue;

    
    const rq = r >> 4, gq = g >> 4, bq = b >> 4;
    const key = (rq << 8) | (gq << 4) | bq;
    hist.set(key, (hist.get(key) || 0) + 1);
  }

  if (hist.size === 0) return null;

  
  let bestKey = 0, bestCount = -1;
  for (const [k, c] of hist) if (c > bestCount) { bestKey = k; bestCount = c; }

  
  const rq = (bestKey >> 8) & 0xF;
  const gq = (bestKey >> 4) & 0xF;
  const bq = bestKey & 0xF;
  let r = (rq << 4) | 0x08;
  let g = (gq << 4) | 0x08;
  let b = (bq << 4) | 0x08;

  r = Math.round(r + (255 - r) * lightenFactor);
  g = Math.round(g + (255 - g) * lightenFactor);
  b = Math.round(b + (255 - b) * lightenFactor);


  const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  return { r, g, b, hex };
}