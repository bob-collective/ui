export const config = {
  runtime: 'edge'
};

export default async (request) => {
  const url = 'https://api.coingecko.com/api/v3/simple/price?' + new URL(request.url).searchParams
  const cgResp = await fetch(url, { headers: { "accept": "application/json" } })
  if (!cgResp.ok) {
    const errMsg = await cgResp.text()
    throw new Error(errMsg)
  }

  const data = await cgResp.json()
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=120, s-maxage=120, stale-while-revalidate=300, stale-if-error=300"
    }
  })
};
