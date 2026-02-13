/**
 * Post-build script: Flatten Next.js 16 RSC payload directories.
 *
 * Next.js 16 generates RSC payloads in subdirectories like:
 *   out/terms/__next.terms/__PAGE__.txt
 * But the client requests them as dot-separated URLs:
 *   /terms/__next.terms.__PAGE__.txt
 *
 * This script copies each nested file to the dot-separated flat path.
 */
import { readdirSync, statSync, copyFileSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';

const outDir = join(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..', 'out');

function flattenDir(dir) {
  let count = 0;
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Check if this is a __next.xxx directory containing RSC payloads
      if (entry.startsWith('__next.')) {
        const subEntries = readdirSync(fullPath);
        for (const subFile of subEntries) {
          const subPath = join(fullPath, subFile);
          if (statSync(subPath).isFile()) {
            // __next.terms/__PAGE__.txt -> __next.terms.__PAGE__.txt
            const flatName = entry + '.' + subFile;
            const flatPath = join(dir, flatName);
            if (!existsSync(flatPath)) {
              copyFileSync(subPath, flatPath);
              count++;
            }
          }
        }
      }
      // Recurse into subdirectories
      count += flattenDir(fullPath);
    }
  }
  return count;
}

if (existsSync(outDir)) {
  const count = flattenDir(outDir);
  console.log(`Flattened ${count} RSC payload files.`);
} else {
  console.error('Output directory not found:', outDir);
  process.exit(1);
}
