# collabria-astro

Sito vetrina di Collabria (consulenza organizzativa), costruito con Astro 5 in output statico e servito da Caddy sulla VPS web di Mario su OVH (Strasburgo), www.collabriainc.com. Include un pannello CMS (Decap CMS) per l'editing dei contenuti da parte del cliente.

## Comandi

Package manager: **npm** (unico lockfile presente: `package-lock.json`). Richiede **Node 24.x** (`engines.node` in `package.json`; ambiente locale già su v24.19.0).

- `npm run dev` — server di sviluppo
- `npm run build` — build di produzione (statica, in `dist/`, nessun adapter)
- `./deploy/vps.sh` — deploy dal Mac (vedi Workflow); di norma lo fa la GitHub Action
- `npm run preview` — anteprima locale della build

Nessun lint/typecheck/test configurato negli scripts: niente ESLint/Prettier né file di test nel repo.

## Architettura

- **Routing a file** in `src/pages/`: `index.astro`, `about.astro`, `cases.astro`, `clients.astro`, `privacy-policy.astro`, più la dinamica `stories/[slug].astro` per i singoli case study.
- **Content collection** `cases` (`src/content/cases/*.md`, schema in `src/content/config.ts`: client, title, logo, challenge, tags[], body) — 12 case study, resi da `stories/[slug].astro` via `getCollection`/`getStaticPaths`.
- **Dati strutturati** in `src/data/`: `clients.json`, `hero-quotes.json`, `services.json` (usati da `index.astro`) e `cases-preview.js` (lista per le card di `cases.astro`/`index.astro`, duplica a mano slug/client/logo/title già presenti nel frontmatter delle cases).
- **Layout/componenti**: `src/layouts/Base.astro` (head, `Nav`, `Footer`, toggle menu mobile) + `src/components/Nav.astro`, `Footer.astro`. CSS globale in `src/styles/global.css` con custom properties di tema (`--espresso`, `--brown-mid`, ecc.); ogni pagina aggiunge poi il proprio `<style>` scoped.
- **CMS**: `src/pages/admin/index.astro` carica Decap CMS da CDN (unpkg) con backend GitHub (`repo: mdanna/collabria-astro`). Config gemella in `public/admin/config.yml`. Il login GitHub (`/api/auth`, `/api/auth/callback`) **non è in questo repo**: Caddy lo manda al servizio condiviso `decap-oauth` sulla VPS (sorgente in `~/projects/architecture/web-vps/decap-oauth/`, porta 127.0.0.1:8401), con `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` e `SITE_URL` in `/opt/web/decap-oauth/collabria.env` sulla VPS. Callback dell'OAuth App GitHub: `https://www.collabriainc.com/api/auth/callback`. Il sito non ha codice lato server e in locale non serve nessun `.env`.
- **Deploy**: `deploy/caddy.conf` (sito Caddy: www servito da `/srv/sites/collabria/current`, apex → www con 308, `/api/auth*` → decap-oauth), `deploy/vps.sh`, `.github/workflows/deploy.yml`. DNS su IONOS (account di Mario).

## Convenzioni

- Pagine/componenti in `.astro`; TypeScript solo per le API routes (`src/pages/api/**/*.ts`).
- Stile via custom properties condivise in `global.css`, nessuna libreria CSS/utility: ogni pagina definisce classi proprie in un blocco `<style>` dedicato.
- Commit atomici e descrittivi, spesso su un singolo componente/sezione (es. "Services: fix divider alignment"), in inglese.

## Workflow

- **Ogni push su `main` va online** in circa un minuto: la GitHub Action builda e manda `dist/` (come `public/`) all'utente `deploy` della VPS, che può solo lanciare `deploy-static` (secret `WEB_VPS_SSH_KEY`, variabile `WEB_VPS_KNOWN_HOSTS`). Vale anche per i commit che Decap CMS fa quando la cliente modifica i contenuti.
- `./deploy/vps.sh` (dal Mac, come `ubuntu`) serve per installare un `deploy/caddy.conf` cambiato (l'Action avvisa ma non può), per il primo deploy e per tornare a un commit precedente. Builda HEAD in un worktree temporaneo pulito.
- Sul server restano le ultime 5 release in `/srv/sites/collabria/releases/`.

## Trappole note

- **`/about` e `/about/`** rispondono entrambi (come su Vercel) grazie a `try_files {path} {path}/index.html` in `deploy/caddy.conf`: senza, Caddy farebbe redirect sulle URL senza slash.
- **Niente segreti nel repo**: è pubblico. Il client secret GitHub è stato in `lisa-setup-guide.txt` dal 6 giugno al 20 novembre 2026 ed è stato revocato.
- **File dati orfani**: `src/data/services.js` e `src/data/hero-quotes.js` non sono importati da nessuna parte; solo le versioni `.json` omonime sono usate. Modificare i `.js` non ha alcun effetto.
