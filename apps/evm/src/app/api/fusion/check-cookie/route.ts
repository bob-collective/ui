export async function GET(request: Request) {
  return Response.json(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { ok: !!(request as any).cookies._parsed.get('session') },
    {
      status: 200,
      headers: {
        'content-type': 'application/json'
      }
    }
  );
}
