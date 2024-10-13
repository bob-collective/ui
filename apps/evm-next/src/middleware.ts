/*
 * For more info see
 * https://nextjs.org/docs/app/building-your-application/routing/internationalization
 * */
import { MiddlewareConfig, type NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';

import linguiConfig from '../lingui.config';

const { locales } = linguiConfig;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getRequestLocale(request.headers);

  request.nextUrl.pathname = `/${locale}${pathname}`;

  // e.g. incoming request is /products
  // The new URL is now /en/products
  return NextResponse.redirect(request.nextUrl);
}

function getRequestLocale(requestHeaders: Headers): string {
  const langHeader = requestHeaders.get('accept-language') || undefined;
  const languages = new Negotiator({
    headers: { 'accept-language': langHeader }
  }).languages(locales.slice());

  const activeLocale = languages[0] || locales[0] || 'en';

  return activeLocale;
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};

// /*
//  * For more info see
//  * https://nextjs.org/docs/app/building-your-application/routing/internationalization
//  * */
// import { type NextRequest, NextResponse, userAgent } from 'next/server';
// import Negotiator from 'negotiator';

// import linguiConfig from '../lingui.config';

// const { locales } = linguiConfig;

// export function middleware(request: NextRequest) {
//   const { pathname, searchParams } = request.nextUrl;
//   // Mobile detect
//   const { device } = userAgent(request);
//   const viewport = device.type === 'mobile' ? 'mobile' : 'desktop';

//   searchParams.set('viewport', viewport);

//   const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

//   if (pathnameHasLocale) return;

//   // Redirect if there is no locale
//   const locale = getRequestLocale(request.headers);

//   request.nextUrl.pathname = `/${locale}${pathname}`;

//   // e.g. incoming request is /products
//   // The new URL is now /en/products
//   return NextResponse.redirect(request.nextUrl);
// }

// function getRequestLocale(requestHeaders: Headers): string {
//   const langHeader = requestHeaders.get('accept-language') || undefined;
//   const languages = new Negotiator({
//     headers: { 'accept-language': langHeader }
//   }).languages(locales.slice());

//   const activeLocale = languages[0] || locales[0] || 'en';

//   return activeLocale;
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
//      * Feel free to modify this pattern to include more paths.
//      */
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
//   ]
// };
