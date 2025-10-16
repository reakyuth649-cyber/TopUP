import { NextResponse } from 'next/server';

type ReqBody = { userId?: string };

export async function POST(request: Request) {
  try {
    const body: ReqBody = await request.json();
    const { userId } = body;
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    try {
      const commonHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://shop.garena.sg/',
        'Origin': 'https://shop.garena.sg',
        'X-Requested-With': 'XMLHttpRequest',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty'
      };

      // Try to get cookies and possible CSRF token from homepage
      let cookieHeader = '';
      let csrfToken: string | null = null;
      try {
        const home = await fetch('https://shop.garena.sg/', { headers: { 'User-Agent': commonHeaders['User-Agent'], 'Accept': 'text/html' } });
        const html = await home.text().catch(() => '');
        // Extract set-cookie header if present
        const setCookie = home.headers.get('set-cookie');
        if (setCookie) cookieHeader = setCookie.split(',').map(s => s.split(';')[0]).join('; ');
        // Look for csrf token in meta or scripts
        const metaMatch = html.match(/<meta[^>]*name=["']csrf-token["'][^>]*content=["']([^"']+)["'][^>]*>/i);
        if (metaMatch) csrfToken = metaMatch[1];
        if (!csrfToken) {
          const scriptMatch = html.match(/csrfToken\s*[:=]\s*["']([^"']+)["']/i);
          if (scriptMatch) csrfToken = scriptMatch[1];
        }
      } catch (e) {
        console.warn('Failed to fetch homepage or parse CSRF', e);
      }

      // Candidate endpoints and app_ids to try
      const endpoints = [
        'https://shop.garena.sg/api/auth/player_id_login',
        'https://shop.garena.sg/api/auth/login_by_player_id',
        'https://shop.garena.sg/api/auth/player-id-login'
      ];
      const appIds = [100067, 100068, 1, 0];

      const tryRequest = async (url: string, asForm: boolean, appId: number) => {
        const headers: Record<string, string> = { ...commonHeaders };
        if (cookieHeader) headers['Cookie'] = cookieHeader;
        if (csrfToken) headers['X-CSRF-Token'] = csrfToken;
        headers['Content-Type'] = asForm ? 'application/x-www-form-urlencoded' : 'application/json';

        const body = asForm ? new URLSearchParams({ account_id: String(userId), app_id: String(appId) }).toString() : JSON.stringify({ account_id: userId, app_id: appId });
        const res = await fetch(url, { method: 'POST', headers, body });
        const textBody = await res.clone().text().catch(() => null);
        let jsonBody = null;
        try { jsonBody = await res.clone().json(); } catch (e) { jsonBody = null; }
        return { res, textBody, jsonBody };
      };

      // Iterate endpoints and appIds with JSON then form-encoded
      const attempts: Array<any> = [];
      for (const url of endpoints) {
        for (const aid of appIds) {
          // JSON
          try {
            const out = await tryRequest(url, false, aid);
            attempts.push({ url, appId: aid, asForm: false, status: out.res.status, json: out.jsonBody, text: out.textBody });
            if (out.res.ok && out.jsonBody && out.jsonBody.nickname) {
              return NextResponse.json({ nickname: out.jsonBody.nickname, region: out.jsonBody.region || null });
            }
            // If error_params, try form next
            if (out.jsonBody && out.jsonBody.error === 'error_params') {
              const out2 = await tryRequest(url, true, aid);
              attempts.push({ url, appId: aid, asForm: true, status: out2.res.status, json: out2.jsonBody, text: out2.textBody });
              if (out2.res.ok && out2.jsonBody && out2.jsonBody.nickname) {
                return NextResponse.json({ nickname: out2.jsonBody.nickname, region: out2.jsonBody.region || null });
              }
            }
          } catch (e) {
            attempts.push({ url, appId: aid, asForm: false, error: String(e) });
          }
        }
      }

      // If none worked, return detailed debug info
      console.error('Garena check attempts', attempts.slice(0, 6));
      return NextResponse.json({ error: 'Invalid UID or API Error', attempts: attempts.slice(0, 6) }, { status: 400 });
    } catch (err: any) {
      console.error('Garena check network error', err);
      return NextResponse.json({ error: err?.message || 'Network error' }, { status: 502 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
