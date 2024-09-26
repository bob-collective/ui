import { kv } from "@vercel/kv";

export const config = {
  runtime: 'edge'
};

const headers = {
  "content-type": "application/json",
  "cache-control": "public, max-age=120, s-maxage=120, stale-while-revalidate=300, stale-if-error=300"
}

export default async (request) => {
  const cache_key = "cg_" + new URL(request.url).searchParams
  const cached = await kv.get(cache_key)
  if (cached) {
    return new Response(JSON.stringify(cached), {
      status: 200,
      headers
    })
  }

  const url = 'https://api.coingecko.com/api/v3/simple/price?' + new URL(request.url).searchParams
  const cgResp = await fetch(url, { headers: { "accept": "application/json" } })
  if (!cgResp.ok) {
    const errMsg = await cgResp.text()
    throw new Error(errMsg)
  }

  const data = await cgResp.json()

  // cache the data for 120 seconds
  kv.set(cache_key, data, { ex: 120 })
    .catch(err => console.error('Unable to cache data', err))

  return new Response(JSON.stringify(data), {
    status: 200,
    headers
  })
};
