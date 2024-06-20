export const config = {
  runtime: 'edge'
};

export default async (request) => {
  const url = 'https://api.coingecko.com/api/v3/simple/price?' + new URLSearchParams(request.query)
  const response = await fetch(url, { headers: { "accept": "application/json" } })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data)
  }

  return response
    .status(200)
    .setHeader("content-type", "application/json")
    .setHeader("cache-control", "public, max-age=120, s-maxage=120, stale-while-revalidate=300, stale-if-error=300")
    .json(resp)
};
