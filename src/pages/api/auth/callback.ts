export const prerender = false;

import type { APIRoute } from 'astro';
import { env } from 'node:process';

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing OAuth code', { status: 400 });
  }

  const clientId = env.GITHUB_CLIENT_ID ?? import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET ?? import.meta.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response('OAuth credentials not configured', { status: 500 });
  }

  let token: string;

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });

    const data = await tokenRes.json() as { access_token?: string; error?: string; error_description?: string };

    if (data.error || !data.access_token) {
      return new Response(`GitHub OAuth error: ${data.error} — ${data.error_description ?? ''}`, { status: 400 });
    }

    token = data.access_token;
  } catch (err) {
    return new Response(`Token exchange failed: ${String(err)}`, { status: 500 });
  }

  // Decap CMS postMessage handshake:
  // 1. Popup sends "authorizing:github" to announce itself
  // 2. Opener replies with its origin
  // 3. Popup sends token to that exact origin (fallback: '*' after 2s)
  const content = `<!DOCTYPE html>
<html>
<body>
<script>
  (function () {
    var provider = 'github';
    var msg = 'authorization:' + provider + ':success:' + JSON.stringify(${JSON.stringify({ token, provider: 'github' })});

    function send(origin) {
      if (window.opener) window.opener.postMessage(msg, origin);
    }

    if (window.opener) {
      window.opener.postMessage('authorizing:' + provider, '*');

      window.addEventListener('message', function (e) {
        if (e.data === 'authorizing:' + provider) send(e.origin);
        else send('*');
        setTimeout(function () { window.close(); }, 200);
      }, { once: true });

      // Fallback if no reply arrives
      setTimeout(function () { send('*'); setTimeout(function () { window.close(); }, 200); }, 2000);
    } else {
      document.body.innerText = 'Authentication complete — you may close this window.';
    }
  })();
</script>
</body>
</html>`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
