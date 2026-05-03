# Power Fast Runner — Static Site

Site institucional do método **Power Fast Runner**, do Prof. Ms. Fabiano Peres.
Estrutura organizada em **client-side** (servido ao navegador) e **server-side** (configuração + helpers privados), com arquivos de SEO completos.

> Domínio: <https://www.powerfastrunner.com.br/>

---

## Estrutura de pastas

```
Public HTML/                        ← raiz do public_html (web root)
│
├── index.html                      # Página principal (cliente)
├── 404.html                        # Página de erro 404
│
├── assets/                         # CLIENT-SIDE — assets estáticos
│   ├── css/
│   │   └── styles.css              # CSS extraído (antes era inline)
│   ├── js/
│   │   └── main.js                 # JS extraído (antes era inline)
│   ├── images/
│   │   ├── hero-bg.webp
│   │   ├── logo.webp
│   │   ├── fotos1..5.webp
│   │   └── review1..3.webp
│   └── videos/
│
├── 360/                            # Sub-página /360 (aula gratuita)
│   └── index.html
│
├── sitemap.xml                     # SEO — sitemap XML para buscadores
├── robots.txt                      # SEO — regras para crawlers
├── manifest.webmanifest            # PWA / SEO — instalação e ícones
├── humans.txt                      # Créditos do site
├── security.txt                    # Contato para report de vulnerabilidades
│
├── .htaccess                       # Apache: HTTPS/www, cache, compressão, headers
│
├── server/                         # SERVER-SIDE — bloqueado via .htaccess
│   ├── .htaccess                   # Deny all
│   └── config/
│       ├── env.php                 # Loader do .env
│       └── site.php                # Config consolidada do site
│
├── .env                            # Variáveis locais (NÃO commitar)
├── .env.example                    # Template (commitar)
├── .gitignore
└── README.md                       # Este arquivo
```

---

## Client-side vs Server-side

| Camada | O que tem | Servido ao navegador? |
|---|---|---|
| **Client** | `index.html`, `404.html`, `/assets/**`, `/360`, `sitemap.xml`, `robots.txt`, `manifest.webmanifest` | ✅ Sim |
| **Server** | `/server/**`, `.env`, `.htaccess` | ❌ Bloqueado pelo `.htaccess` |

O `.htaccess` na raiz já bloqueia:
- Qualquer dotfile (`.env`, `.git`, …) via `RewriteRule "(^|/)\." - [F]`
- A pasta `/server` via `RedirectMatch 403 ^/server(/|$)`
- Arquivos como `README.md`, `composer.lock`, etc.

---

## SEO implementado

- **`<title>` + `meta description`** otimizados com palavras-chave
- **Canonical URL** + `hreflang`
- **Open Graph** (Facebook/WhatsApp/LinkedIn)
- **Twitter Card** (`summary_large_image`)
- **JSON-LD structured data** com 6 entidades:
  - `Organization` (Power Fast Runner)
  - `Person` (Fabiano Peres)
  - `WebSite`
  - `Product` (com Offer/preço)
  - `Course` (programa de treino)
  - `BreadcrumbList`
- **`robots.txt`** com permissões para AI bots (GPTBot, ClaudeBot, Google-Extended)
- **`sitemap.xml`** com `<image:image>` para indexar imagens
- **`manifest.webmanifest`** para PWA / Add-to-Homescreen
- **`security.txt`** (RFC 9116)
- **`humans.txt`**
- **`404.html`** com design e link de retorno
- **Headers de segurança**: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Performance**: Brotli/Gzip, cache de 1 ano para assets versionados, `preconnect`/`preload` para recursos críticos
- **Acessibilidade**: `aria-label` em botões do slider, `aria-hidden` em SVGs decorativos, `<main>` semântico

---

## Variáveis de ambiente (`.env`)

O site é estático (HTML), mas o `.env` centraliza valores configuráveis (preços, links de checkout, IDs de pixel) que podem ser:

1. **Lidos por PHP** (se você passar a renderizar via PHP) — use `server/config/site.php`.
2. **Injetados num build step** (caso adote Vite, Eleventy, Astro, etc. no futuro).
3. **Referência humana** — fonte única de verdade pra valores que aparecem em vários lugares.

Hoje, o `index.html` injeta `FB_PIXEL_ID` e `CLARITY_ID` via `window.PFR_CONFIG` — esses valores devem espelhar o `.env`.

### Como usar

```bash
cp .env.example .env       # criar .env local
# editar .env com os valores reais
```

> ⚠️ Nunca commite `.env`. Já está no `.gitignore`.

---

## Deploy (cPanel / hospedagem compartilhada)

A pasta `Public HTML/` **é** o seu `public_html`. Faça upload de tudo direto pra raiz do domínio. O `.htaccess` já cuida de:

- Redirecionar `http://` → `https://`
- Redirecionar `domínio.com.br` → `www.domínio.com.br`
- Servir `404.html` pra rotas inexistentes
- Bloquear `/server/`, `.env`, `.git/`

### Após o deploy, valide:

| Ferramenta | URL |
|---|---|
| Google Rich Results | <https://search.google.com/test/rich-results> |
| PageSpeed Insights  | <https://pagespeed.web.dev/> |
| Mobile-Friendly     | <https://search.google.com/test/mobile-friendly> |
| OG Debugger         | <https://developers.facebook.com/tools/debug/> |
| Sitemap submit      | <https://search.google.com/search-console> |
| `securityheaders.com` | <https://securityheaders.com/> |

---

## Desenvolvimento local

Como o site é estático, qualquer servidor HTTP funciona:

```bash
# Python
python3 -m http.server 8000

# Node (npx)
npx serve .

# PHP
php -S localhost:8000
```

Abra <http://localhost:8000>.

---

## Próximos passos sugeridos

- [ ] Adicionar páginas reais para `/termos.html`, `/privacidade.html`, `/cookies.html` (hoje só linkadas no rodapé)
- [ ] Gerar favicon completo (`favicon.ico`, `apple-touch-icon-180x180.png`, `icon-192.png`, `icon-512.png`)
- [ ] Configurar Google Search Console + enviar `sitemap.xml`
- [ ] Configurar GA4 (`GA4_ID` no `.env`) ou GTM
- [ ] Trocar Pixel/Clarity de produção no `.env` (os IDs atuais parecem placeholders)
- [ ] Adicionar imagens OG dedicadas (1200×630) em vez de reaproveitar `hero-bg.webp`
