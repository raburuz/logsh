// scripts/watch-sw.js
import watcher from '@parcel/watcher';

import { dirname, resolve } from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

// ✅ Replace __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let rootDir = process.cwd(); // fallback
const sourceDir = resolve(__dirname);
const sourcePath = resolve(sourceDir, 'sw.ts');
const outputPath = resolve(rootDir, 'public', 'sw.js');

const copyFile = () => {

  if (!existsSync(sourcePath)) {
    console.warn('⚠️  sw.ts not found in push package: ', sourcePath);
    return;
  }

  // 1. Transpile sw.ts to sw.js using tsc
  try {
    // Ensure public dir exists
    mkdirSync(resolve(rootDir, 'public'), { recursive: true });
    // Compile sw.ts -> public/sw.js directly
    execSync(`pnpm dlx esbuild ${sourcePath} --bundle --target=es2020 --format=esm --minify --outfile=${outputPath}`, {
      stdio: 'inherit',
    });
  } catch (err) {
    console.error('❌ Failed to compile sw.ts');
    return;
  }

  if (!existsSync(outputPath)) {
    console.error('❌ public/sw.js not created');
    return;
  }

  // 2. Read compiled JS, prepend comment, copy to public/
  const jsContent = readFileSync(outputPath, 'utf-8');
  const banner = `// This file is auto-generated. Do not edit manually.\n`;
  const finalContent = banner + jsContent;

  writeFileSync(outputPath, finalContent, 'utf-8');

}

// Initial copy on script start
copyFile();

// Watch con @parcel/watcher
const startWatcher = async () => {
  console.log('👀 Watching service worker with @parcel/watcher...');
  
  const subscription = await watcher.subscribe(
    sourceDir,
    (err, events) => {
      if (err) {
        console.error('Watcher error:', err);
        return;
      }

      // Filtra solo cambios en sw.ts
      const swChanged = events.some(
        event => event.path === sourcePath && event.type === 'update'
      );

      if (swChanged) {
        console.log('🔄 SW changed, copying...');
        copyFile();
      }
    }
  );

  // Cleanup on exit
  process.on('SIGINT', async () => {
    await subscription.unsubscribe();
    process.exit(0);
  });
};

if (process.env.NODE_ENV !== 'production') {
  startWatcher();
}