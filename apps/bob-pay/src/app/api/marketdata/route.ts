/* eslint-disable no-console */
import { kv } from '@/lib/vercel/kv';

const headers = {
  'content-type': 'application/json',
  'cache-control': 'public, max-age=120, s-maxage=120, stale-while-revalidate=300, stale-if-error=300'
};

function coingecko(searchString: string) {
  const url = new URL('https://api.coingecko.com/api/v3/simple/price?' + searchString);
  const reqHeaders: Record<string, string> = { accept: 'application/json' };

  if (process.env.NEXT_COINGECKO_API_KEY) {
    url.hostname = 'pro-api.coingecko.com';
    reqHeaders['x-cg-pro-api-key'] = process.env.NEXT_COINGECKO_API_KEY;
  }

  return fetch(url, { headers: reqHeaders });
}

export async function GET(request: Request) {
  const cache_key = new URL(request.url).searchParams.toString();
  const cached = await kv.get(cache_key);

  if (cached) {
    return Response.json(cached, {
      status: 200,
      headers
    });
  }

  const cgResp = await coingecko(cache_key);

  if (!cgResp.ok) {
    const errMsg = await cgResp.text();

    throw new Error(errMsg);
  }

  const data = await cgResp.json();

  // cache the data for 120 seconds
  kv.set(cache_key, data, { ex: 120 }).catch((err: Error) => console.error('Unable to cache data', err));

  return Response.json(data, {
    status: 200,
    headers
  });
}
