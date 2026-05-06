import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const ROOT = 'src/assets';

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) files.push(...await getFiles(full));
    else files.push(full);
  }
  return files;
}

async function convert(input, output, { maxDim, quality }) {
  let pipeline = sharp(input);
  if (maxDim) {
    pipeline = pipeline.resize({ width: maxDim, height: maxDim, fit: 'inside', withoutEnlargement: true });
  }
  await pipeline.webp({ quality }).toFile(output);
  const [origStat, newStat] = await Promise.all([stat(input), stat(output)]);
  const saved = ((1 - newStat.size / origStat.size) * 100).toFixed(0);
  console.log(`  ${basename(input)} (${(origStat.size/1024).toFixed(0)}KB) -> ${basename(output)} (${(newStat.size/1024).toFixed(0)}KB) [${saved}% smaller]`);
}

async function run() {
  // 1. images/ PNGs -> WebP q80
  console.log('\n=== Converting images/ PNGs to WebP ===');
  const imagesDir = join(ROOT, 'images');
  const imageFiles = await getFiles(imagesDir);
  for (const f of imageFiles) {
    if (extname(f).toLowerCase() !== '.png') continue;
    const out = f.replace(/\.png$/i, '.webp');
    await convert(f, out, { maxDim: null, quality: 80 });
  }

  // Resize logo to 512x512
  console.log('\n=== Resizing logo to 512x512 ===');
  const logoIn = join(imagesDir, 'logo.png');
  const logoOut = join(imagesDir, 'logo.webp');
  await sharp(logoIn).resize(512, 512).webp({ quality: 85 }).toFile(logoOut);

  // Resize abouutSmall to 1024 max
  console.log('=== Resizing abouutSmall to 1024px max ===');
  const abIn = join(imagesDir, 'abouutSmall.png');
  const abOut = join(imagesDir, 'abouutSmall.webp');
  await sharp(abIn).resize({ width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(abOut);

  // 2. digital-art/ full images -> WebP q80, 1600px max
  console.log('\n=== Converting digital-art/ full images to WebP (1600px max) ===');
  const artDir = join(ROOT, 'digital-art');
  const artFiles = (await readdir(artDir)).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  for (const f of artFiles) {
    const input = join(artDir, f);
    const out = join(artDir, f.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    await convert(input, out, { maxDim: 1600, quality: 80 });
  }

  // 3. digital-art/thumbs -> WebP q80
  console.log('\n=== Converting digital-art/thumbs to WebP ===');
  const thumbDir = join(artDir, 'thumbs');
  const thumbFiles = (await readdir(thumbDir)).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  for (const f of thumbFiles) {
    const input = join(thumbDir, f);
    const out = join(thumbDir, f.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    await convert(input, out, { maxDim: null, quality: 80 });
  }

  console.log('\nDone!');
}

run().catch(e => { console.error(e); process.exit(1); });
