#!/usr/bin/env node
/* Tiny static server for local work: `npm run dev`, then open http://localhost:8000
   Try http://localhost:8000/?lang=ar to check a right-to-left language. */

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// Serves the repo root by default; ROOT=dist checks the pre-rendered build.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', process.env.ROOT || '.');
const port = Number(process.env.PORT) || 8000;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  // A directory URL means its index.html — /tr/ is a real page in the pre-rendered build.
  const rel = normalize(path.endsWith('/') ? path + 'index.html' : path).replace(/^(\.\.[/\\])+/, '');
  const file = join(root, rel);
  if (!file.startsWith(root)) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  try {
    const body = await readFile(file);
    const type = TYPES[extname(file)] || 'application/octet-stream';
    const headers = { 'content-type': type };
    // Match what a real static host does, so local Lighthouse numbers mean something.
    headers['cache-control'] = extname(file) === '.html' ? 'no-cache' : 'public, max-age=31536000';
    const compressible = /^(text|application\/(javascript|json|xml))/.test(type);
    if (compressible && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
      const zipped = gzipSync(body);
      res.writeHead(200, { ...headers, 'content-encoding': 'gzip', 'content-length': zipped.length });
      res.end(zipped);
      return;
    }
    res.writeHead(200, headers);
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Not found');
  }
}).listen(port, () => console.log(`HXI site on http://localhost:${port}`));
