const path = require('node:path');
const fs = require('node:fs');
const express = require('express');
const compression = require('compression');

const app = express();
const PORT = Number(process.env.PORT);
if (!Number.isInteger(PORT) || PORT <= 0) {
  console.error('PORT environment variable is required (set it in .env)');
  process.exit(1);
}
const PUBLIC_DIR = path.join(__dirname, '..', 'client');

app.set('trust proxy', true);
app.set('x-powered-by', false);
app.disable('etag');

app.use(compression());

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=(self)');
  if (req.secure) {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  next();
});

app.use((req, res, next) => {
  const host = req.headers.host || '';
  const hostname = host.split(':')[0].toLowerCase();
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  const isOnRender = hostname.endsWith('.onrender.com');
  if (isLocal || isOnRender) return next();

  if (!req.secure) {
    return res.redirect(301, `https://${host}${req.originalUrl}`);
  }
  if (!hostname.startsWith('www.')) {
    return res.redirect(301, `https://www.${host}${req.originalUrl}`);
  }
  next();
});

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  if (req.path === '/404.html') return next();
  if (!req.path.endsWith('.html')) return next();

  const cleanPath = req.path.slice(0, -'.html'.length);
  const query = req.url.slice(req.path.length);
  res.redirect(301, (cleanPath || '/') + query);
});

app.use((req, res, next) => {
  if (req.path.split('/').some((s) => s.startsWith('.'))) {
    return res.status(403).type('text/plain').send('Forbidden');
  }
  next();
});

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  if (req.path === '/' || path.extname(req.path)) return next();

  const candidate = path.join(PUBLIC_DIR, req.path + '.html');
  const resolved = path.resolve(candidate);
  if (!resolved.startsWith(path.resolve(PUBLIC_DIR))) return next();

  fs.stat(resolved, (err, stat) => {
    if (!err && stat.isFile()) {
      req.url = req.path + '.html' + req.url.slice(req.path.length);
    }
    next();
  });
});

const ASSET_RE = /\.(css|js|webp|jpe?g|png|gif|svg|ico|woff2?|ttf|otf|eot|mp4|webm|avif)$/i;
const SHORT_CACHE_RE = /\.(xml|json|webmanifest|txt)$/i;
const CORS_RE = /\.(ttf|ttc|otf|eot|woff2?|css|js|webp)$/i;

app.use(
  express.static(PUBLIC_DIR, {
    index: ['index.html'],
    extensions: ['html'],
    dotfiles: 'deny',
    etag: false,
    lastModified: true,
    setHeaders(res, filePath) {
      if (/\.html?$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      } else if (ASSET_RE.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (SHORT_CACHE_RE.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
      if (CORS_RE.test(filePath)) {
        res.setHeader('Access-Control-Allow-Origin', '*');
      }
    },
  })
);

app.use((req, res) => {
  res.status(404);
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  res.sendFile(path.join(PUBLIC_DIR, '404.html'));
});

app.listen(PORT, () => {
  console.log(`Power Fast Runner listening on :${PORT}`);
});
