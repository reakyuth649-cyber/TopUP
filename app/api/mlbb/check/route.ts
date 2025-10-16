import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

type ReqBody = {
  userId?: string;
  zoneId?: string;
};

function parseObject(str: string) {
  const fil = str.split("\n");
  const data: Record<string, string> = {};
  fil.forEach((element) => {
    const [key, ...rest] = element.split(":");
    if (!key) return;
    const value = rest.join(":") || "";
    data[key.trim().toLowerCase().replace(/ /gi, "-")] = value.trim();
  });
  return data;
}

// Load country list at runtime from the workspace to avoid bundler resolution issues
let countryList: any[] = [];
try {
  const dataPath = path.join(process.cwd(), 'app', 'mlbb-checkid', 'check-id-mlbb-main', 'utils', 'data.json');
  const raw = fs.readFileSync(dataPath, 'utf8');
  countryList = JSON.parse(raw);
} catch (err) {
  console.error('Failed to load country data.json:', err);
  countryList = [];
}

export async function POST(request: Request) {
  try {
    const body: ReqBody = await request.json();
    const { userId, zoneId } = body;

    if (!userId || !zoneId) {
      return NextResponse.json({ error: 'Missing userId or zoneId' }, { status: 400 });
    }

    // Mirror original implementation: POST form to moogold endpoint
    try {
      const form = new URLSearchParams({
        "attribute_amount": "Weekly Pass",
        "text-5f6f144f8ffee": userId,
        "text-1601115253775": zoneId,
        "quantity": '1',
        "add-to-cart": '15145',
        "product_id": '15145',
        "variation_id": '4690783'
      });

      const res = await fetch("https://moogold.com/wp-content/plugins/id-validation-new/id-validation-ajax.php", {
        method: 'POST',
        body: form,
        headers: {
          'Referer': 'https://moogold.com/product/mobile-legends/',
          'Origin': 'https://moogold.com',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const json = await res.json();
      const { message } = json;
      if (!message) {
        return NextResponse.json({ error: 'Invalid ID Player or Server ID' }, { status: 400 });
      }

      const parsed = parseObject(message);
      const nickname = parsed['in-game-nickname'] || parsed['nickname'] || '';
      const countryShort = parsed['country'] || parsed['country-code'] || '';
      const country = (countryList.find((a: any) => a.countryShortCode == countryShort)?.countryName) || 'Unknown';

      return NextResponse.json({
        name: nickname,
        id: userId,
        zone: zoneId,
        country
      });
    } catch (e: any) {
      // If external lookup fails (network, remote blocked, etc.), return a safe mock
      console.error('mlbb check external error:', e);
      return NextResponse.json({
        name: `Player_${userId}`,
        id: userId,
        zone: zoneId,
        country: 'Unknown',
        _warning: 'external_lookup_failed'
      });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
