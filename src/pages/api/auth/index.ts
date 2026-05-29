export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ redirect }) => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const site = import.meta.env.SITE_URL ?? 'https://collabria-astro.vercel.app';
  const callbackUrl = `${site}/api/auth/callback`;

  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', callbackUrl);
  url.searchParams.set('scope', 'repo');

  return redirect(url.toString());
};
