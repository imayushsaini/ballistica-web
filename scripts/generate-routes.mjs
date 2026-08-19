import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const routesFilePath = path.join(rootDir, 'routes.txt');

const BASE_ROUTES = [
  '/home',
  '/mods',
  '/gallery',
  '/download',
  '/players',
  '/blog',
  '/blog/host-bombsquad-server-free',
  '/pluginmanager',
  '/free-server',
  '/support',
  '/baport',
];

const MODS_API_URL = 'https://mods.69420555.xyz/mods?size=20';

async function fetchLatestModRoutes() {
  const modRoutes = [];

  for (const apiUrl of [MODS_API_URL]) {
    try {
      console.log(`[generate-routes] Fetching latest mods for SEO prerendering from: ${apiUrl}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(apiUrl, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const modsList = Array.isArray(data) ? data : (data && Array.isArray(data.mods) ? data.mods : []);

        for (const mod of modsList) {
          const modId = mod.messageId || mod.id;
          if (modId) {
            modRoutes.push(`/mods/${modId}`);
          }
        }

        console.log(`[generate-routes] Successfully discovered ${modRoutes.length} mod pages to prerender.`);
        break;
      }
    } catch (err) {
      console.warn(`[generate-routes] Warning: Failed fetching mods from ${apiUrl}:`, err.message);
    }
  }

  return modRoutes;
}

async function main() {
  const modRoutes = await fetchLatestModRoutes();
  const allRoutes = Array.from(new Set([...BASE_ROUTES, ...modRoutes]));

  fs.writeFileSync(routesFilePath, allRoutes.join('\n') + '\n', 'utf8');
  console.log(`[generate-routes] Wrote ${allRoutes.length} routes to ${routesFilePath}`);
}

main().catch((err) => {
  console.error('[generate-routes] Error generating routes:', err);
  // Ensure fallback routes.txt exists so prerender doesn't fail
  fs.writeFileSync(routesFilePath, BASE_ROUTES.join('\n') + '\n', 'utf8');
  console.log(`[generate-routes] Wrote ${BASE_ROUTES.length} base fallback routes.`);
});
