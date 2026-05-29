export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing OAuth code', { status: 400 });
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: import.meta.env.GITHUB_CLIENT_ID,
      client_secret: import.meta.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await tokenRes.json() as { access_token?: string; error?: string };

  if (data.error || !data.access_token) {
    return new Response(`GitHub OAuth error: ${data.error}`, { status: 400 });
  }

  const token = data.access_token;
  const content = `
<!DOCTYPE html>
<html>
<body>
<script>
  (function () {
    const msg = JSON.stringify({ token: '${token}', provider: 'github' });
    if (window.opener) {
      window.opener.postMessage('authorization:github:success:' + msg, '*');
    }
    window.close();
  })();
</script>
</body>
</html>`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
