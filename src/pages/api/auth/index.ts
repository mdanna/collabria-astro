export const prerender = false;

import type { APIRoute } from 'astro';
import { env } from 'node:process';

export const GET: APIRoute = ({ redirect }) => {
  const clientId = env.GITHUB_CLIENT_ID ?? import.meta.env.GITHUB_CLIENT_ID ?? '';
  const site = env.SITE_URL ?? import.meta.env.SITE_URL ?? 'https://collabria-astro.vercel.app';
  const callbackUrl = `${site}/api/auth/callback`;

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', callbackUrl);
  authUrl.searchParams.set('scope', 'repo');

  return redirect(authUrl.toString());
};
