import { NextResponse } from 'next/server';

type ReqBody = {
  game?: string;
  username?: string | null;
  userId: string;
  zoneId?: string | null;
  packageLabel?: string;
  paymentMethod?: string;
  priceUsd?: number | null;
  priceKhqr?: number | null;
};

export async function POST(request: Request) {
  try {
    const body: ReqBody = await request.json();
  const { game = 'Unknown', username = null, userId, zoneId = null, packageLabel = '', paymentMethod = '', priceUsd = null, priceKhqr = null } = body as any;

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Build HTML message for Telegram (escape user-provided values)
    const esc = (s: any) => (s == null ? '' : String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));

    const diamondEmoji = '💎';
  const priceLine = priceUsd != null ? `<b>Price:</b> $${Number(priceUsd).toFixed(2)}` : '';
  const khqrLine = priceKhqr != null ? `<b>KHQR:</b> ៛${Math.round(Number(priceKhqr))}` : '';

  const html = `
<b>New Order - ${esc(game)}</b>
\n
<b>Username:</b> ${esc(username) || 'Unknown'}
<b>User ID:</b> ${esc(userId)}
${zoneId ? `<b>Zone ID:</b> ${esc(zoneId)}` : ''}
${packageLabel ? `<b>Package:</b> ${esc(packageLabel)} ${packageLabel && packageLabel.toLowerCase().includes('diamond') ? diamondEmoji : ''}` : ''}
${priceLine}
${khqrLine}
${paymentMethod ? `<b>Payment:</b> ${esc(paymentMethod)}` : ''}
`.trim();

    if (!botToken || !chatId) {
      // Return success but include warning if Telegram is not configured
      return NextResponse.json({ ok: true, warning: 'TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured', html, priceUsd, priceKhqr });
    }

    // Optional game image mapping (useful to match the screenshot)
    const gameImages: Record<string, string> = {
      'Mobile Legends: Bang Bang': 'https://ext.same-assets.com/1882033060/2768638069.png',
      'MLBB': 'https://ext.same-assets.com/1882033060/2768638069.png',
      'Mobile Legends': 'https://ext.same-assets.com/1882033060/2768638069.png',
    };
    const photoUrl = gameImages[game] || null;

    try {
      if (photoUrl) {
        // sendPhoto with caption to include the image like the screenshot
        const tgUrlPhoto = `https://api.telegram.org/bot${botToken}/sendPhoto`;
        const res = await fetch(tgUrlPhoto, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, photo: photoUrl, caption: html, parse_mode: 'HTML' }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          return NextResponse.json({ error: 'Failed to send photo to Telegram', details: data }, { status: 502 });
        }
        return NextResponse.json({ ok: true, result: data });
      } else {
        const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const res = await fetch(tgUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: html, parse_mode: 'HTML' }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          return NextResponse.json({ error: 'Failed to send to Telegram', details: data }, { status: 502 });
        }
        return NextResponse.json({ ok: true, result: data });
      }
    } catch (err: any) {
      return NextResponse.json({ error: err?.message || 'Network error' }, { status: 502 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
