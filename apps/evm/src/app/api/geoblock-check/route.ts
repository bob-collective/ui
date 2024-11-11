import * as Sentry from '@sentry/nextjs';

const blockedCountries = [
  'AL',
  'BS',
  'BB',
  'BW',
  'KH',
  'KP',
  'GH',
  'JM',
  'MY',
  'MU',
  'MM',
  'NI',
  'ID',
  'IR',
  'AF',
  'PK',
  'CN',
  'PA',
  'AM',
  'GN',
  'IQ',
  'RW',
  'RS',
  'SY',
  'TH',
  'UG',
  'TZ',
  'US',
  'YE',
  'ZW',
  'RU',
  'CU',
  'SD',
  'VE'
];

export async function GET(request: Request) {
  // https://vercel.com/docs/concepts/edge-network/headers#x-vercel-ip-country
  const countryCode = request.headers.get('x-vercel-ip-country');

  if (!countryCode) {
    Sentry.captureException(new Error('Header x-vercel-ip-country is missing'));

    return new Response(null, { status: 403 });
  }

  const isGeoblocked = blockedCountries.includes(countryCode);

  return new Response(null, { status: isGeoblocked ? 403 : 200 });
}
