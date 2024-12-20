/* eslint-disable no-console */

const SENTRY_HOST = 'o4504853415329792.ingest.us.sentry.io';
const SENTRY_PROJECT_IDS = ['4507407322316800'];

async function extractBody(request: Request) {
  const dec = new TextDecoder();
  const reader = request.body?.getReader();

  if (!reader) return '';

  let body = '';

  while (true) {
    const { done, value } = await reader.read();

    if (done) return body;

    body = body + dec.decode(value);
  }
}

export async function POST(request: Request) {
  try {
    const envelope = await extractBody(request);
    const piece = envelope.split('\n')[0];

    if (!piece) {
      throw new Error('Empty envelope or invalid format');
    }

    const header = JSON.parse(piece);
    const dsn = new URL(header['dsn']);
    const project_id = dsn.pathname?.replace('/', '');

    if (dsn.hostname !== SENTRY_HOST) {
      throw new Error(`Invalid sentry hostname: ${dsn.hostname}`);
    }

    if (!project_id || !SENTRY_PROJECT_IDS.includes(project_id)) {
      throw new Error(`Invalid sentry project id: ${project_id}`);
    }

    const upstream_sentry_url = `https://${SENTRY_HOST}/api/${project_id}/envelope/`;

    await fetch(upstream_sentry_url, { method: 'POST', body: envelope });

    return new Response(null, { status: 200 });
  } catch (e) {
    console.error('error tunneling to sentry', e); // eslint-disable-line no-console

    return new Response('error tunneling to sentry', { status: 500 });
  }
}
