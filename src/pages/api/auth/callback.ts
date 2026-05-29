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
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await tokenRes.json() as { access_token?: string; error?: string };

  if (data.error || !data.access_token) {
    return new Response(`GitHub OAuth error: ${data.error ?? 'no token returned'}`, { status: 400 });
  }

  const token = data.access_token;

  // Decap CMS expects a two-step postMessage handshake:
  // 1. Popup sends "authorizing:github" to announce itself
  // 2. Opener replies with its origin
  // 3. Popup sends the token to that exact origin
  const content = `<!DOCTYPE html>
<html>
<body>
<script>
  (function () {
    var provider = 'github';
    var data = ${JSON.stringify({ token, provider })};
    var msg = 'authorization:' + provider + ':success:' + JSON.stringify(data);

    function send(origin) {
      window.opener.postMessage(msg, origin);
    }

    if (window.opener) {
      // Step 1: announce
      window.opener.postMessage('authorizing:' + provider, '*');

      // Step 2: wait for opener to reply with its origin, then send token
      window.addEventListener('message', function (e) {
        if (e.data === 'authorizing:' + provider) {
          send(e.origin);
        } else {
          // Some Decap versions just need the direct send
          send('*');
        }
        setTimeout(function () { window.close(); }, 500);
      }, { once: true });

      // Fallback: send directly after a short wait in case no reply comes
      setTimeout(function () {
        send('*');
        setTimeout(function () { window.close(); }, 500);
      }, 2000);
    } else {
      document.body.innerText = 'Authentication complete. You can close this window.';
    }
  })();
</script>
</body>
</html>`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
