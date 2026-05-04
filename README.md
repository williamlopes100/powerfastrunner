# Power Fast Runner

Site institucional do método **Power Fast Runner**, do Prof. Ms. Fabiano Peres.

> Domínio: <https://www.powerfastrunner.com.br/>

Stack: Node.js + Express servindo um front-end estático.

---

## Estrutura

```
.
├── client/                         ← tudo que vai pro navegador
│   ├── index.html
│   ├── 404.html
│   ├── 360/index.html              # sub-página /360 (aula gratuita)
│   ├── assets/
│   │   ├── css/styles.css
│   │   ├── js/main.js
│   │   └── images/*.webp
│   ├── manifest.webmanifest        # PWA
│   ├── sitemap.xml                 # SEO
│   ├── robots.txt
│   ├── humans.txt
│   └── security.txt                # RFC 9116
│
├── server/
│   └── index.js                    # Express app
│
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

**Cliente** é tudo em `client/` — o único diretório exposto via `express.static`.
**Servidor** é `server/index.js` — fora do docroot, nunca alcançável por URL.

---

## Rodando local

```bash
npm install
npm start            # node server/index.js → http://localhost:3000
npm run dev          # node --watch (auto-reload em mudanças)
```

A porta vem de `PORT` (default 3000).

---

## O que o Express faz

- Compressão gzip
- Headers de segurança: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS (só em HTTPS)
- Redirect HTTP → HTTPS e apex → www (pulado em `localhost` e `*.onrender.com`)
- Strip de `.html` (`/foo.html` → `301 /foo`)
- Rewrite de URL limpa pra arquivo (`/foo` serve `client/foo.html` se existir)
- Cache: 1 ano `immutable` pra assets, `no-cache` pra HTML, 1h pra xml/json/manifest
- CORS `*` em fontes/CSS/JS/webp
- 403 em dotfiles
- Fallback 404 → `client/404.html`

---

## Variáveis de ambiente

`.env.example` lista IDs de pixel, links de checkout, preços. Hoje os valores estão hardcoded no `index.html` — o `.env` serve como fonte única de verdade pra valores duplicados em vários lugares e pra um eventual build step (Vite, Astro, etc.).

```bash
cp .env.example .env
```

`.env` está no `.gitignore`. Nunca comite.

---

## SEO já implementado

- `<title>` + meta description otimizados
- Canonical + hreflang
- Open Graph + Twitter Card
- JSON-LD: Organization, Person, WebSite, Product (com Offer), Course, BreadcrumbList
- `robots.txt` com permissões pra GPTBot, ClaudeBot, Google-Extended
- `sitemap.xml` com `<image:image>`
- `manifest.webmanifest` (PWA)
- `security.txt` (RFC 9116)
- `404.html` com design próprio
- Headers de segurança (HSTS, CSP-style)
- Performance: gzip, cache 1 ano em assets, `preconnect`/`preload`

### Validar pós-deploy

| Ferramenta | URL |
|---|---|
| Google Rich Results | <https://search.google.com/test/rich-results> |
| PageSpeed Insights | <https://pagespeed.web.dev/> |
| Mobile-Friendly | <https://search.google.com/test/mobile-friendly> |
| OG Debugger | <https://developers.facebook.com/tools/debug/> |
| Search Console | <https://search.google.com/search-console> |
| securityheaders.com | <https://securityheaders.com/> |

---

## TODO

- [ ] Páginas reais pra `/termos`, `/privacidade`, `/cookies` (hoje só linkadas no rodapé)
- [ ] Favicon completo (`favicon.ico`, `apple-touch-icon-180`, `icon-192`, `icon-512`)
- [ ] Submeter `sitemap.xml` no Search Console
- [ ] Configurar GA4 (`GA4_ID`) ou GTM
- [ ] Trocar IDs de Pixel/Clarity de produção (atuais parecem placeholders)
- [ ] Imagens OG dedicadas 1200×630 (em vez de reaproveitar `hero-bg.webp`)
