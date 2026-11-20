import { defineConfig } from 'astro/config';

// Pure static site, served by Caddy on the OVH web VPS (deploy/). The CMS login
// (/api/auth*) is not part of this build: Caddy sends it to the shared decap-oauth service.
export default defineConfig({
  output: 'static',
});
