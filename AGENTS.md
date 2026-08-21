# collabria-astro

Sito vetrina di Collabria (consulenza organizzativa), costruito con Astro 5 in output statico e deployato su Vercel. Include un pannello CMS (Decap CMS) per l'editing dei contenuti da parte del cliente.

## Comandi

Package manager: **npm** (unico lockfile presente: `package-lock.json`). Richiede **Node 24.x** (`engines.node` in `package.json`; ambiente locale già su v24.19.0).

- `npm run dev` — server di sviluppo
- `npm run build` — build di produzione (Astro + adapter Vercel)
- `npm run preview` — anteprima locale della build

Nessun lint/typecheck/test configurato negli scripts: niente ESLint/Prettier né file di test nel repo.

## Architettura

- **Routing a file** in `src/pages/`: `index.astro`, `about.astro`, `cases.astro`, `clients.astro`, `privacy-policy.astro`, più la dinamica `stories/[slug].astro` per i singoli case study.
- **Content collection** `cases` (`src/content/cases/*.md`, schema in `src/content/config.ts`: client, title, logo, challenge, tags[], body) — 12 case study, resi da `stories/[slug].astro` via `getCollection`/`getStaticPaths`.
- **Dati strutturati** in `src/data/`: `clients.json`, `hero-quotes.json`, `services.json` (usati da `index.astro`) e `cases-preview.js` (lista per le card di `cases.astro`/`index.astro`, duplica a mano slug/client/logo/title già presenti nel frontmatter delle cases).
- **Layout/componenti**: `src/layouts/Base.astro` (head, `Nav`, `Footer`, toggle menu mobile) + `src/components/Nav.astro`, `Footer.astro`. CSS globale in `src/styles/global.css` con custom properties di tema (`--espresso`, `--brown-mid`, ecc.); ogni pagina aggiunge poi il proprio `<style>` scoped.
- **CMS**: `src/pages/admin/index.astro` carica Decap CMS da CDN (unpkg) con backend GitHub (`repo: mdanna/collabria-astro`). Config gemella in `public/admin/config.yml`. OAuth GitHub scritto a mano in `src/pages/api/auth/index.ts` + `callback.ts` — uniche route con `prerender = false`, quindi le uniche funzioni server-side del sito; richiedono a runtime `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `SITE_URL` (nessun `.env.example` nel repo).
- **Deploy**: `astro.config.mjs` → `output: 'static'` + `@astrojs/vercel`; cartella `.vercel/` presente (progetto già collegato).

## Convenzioni

- Pagine/componenti in `.astro`; TypeScript solo per le API routes (`src/pages/api/**/*.ts`).
- Stile via custom properties condivise in `global.css`, nessuna libreria CSS/utility: ogni pagina definisce classi proprie in un blocco `<style>` dedicato.
- Commit atomici e descrittivi, spesso su un singolo componente/sezione (es. "Services: fix divider alignment"), in inglese.

## Trappole note

- **Node runtime su Vercel**: alzare solo `engines.node` non basta — `@astrojs/vercel` risolve la versione della function a build time da una mappa interna e la scrive in `.vc-config.json`, sovrascrivendo l'impostazione da dashboard. Serve un adapter che supporti la versione target (Node 24 richiede `@astrojs/vercel` v9+, che a sua volta richiede Astro 5). Dettagli nel commit `2235488`.
- **File dati orfani**: `src/data/services.js` e `src/data/hero-quotes.js` non sono importati da nessuna parte; solo le versioni `.json` omonime sono usate. Modificare i `.js` non ha alcun effetto.
