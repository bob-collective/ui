import { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { Providers } from './providers';
import './index.css';
import './global.css';

export const metadata: Metadata = {
  title: 'BOB',
  manifest: '/site.webmanifest',
  icons: [
    {
      sizes: '16x16',
      url: '/favicon-16x16.png'
    },
    {
      sizes: '32x32',
      url: '/favicon-32x32.png'
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/apple-touch-icon.png'
    }
  ]
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale();

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link href='https://fonts.googleapis.com' rel='preconnect' />
        <link crossOrigin='anonymous' href='https://fonts.gstatic.com' rel='preconnect' />
      </head>
      <body>
        <div id='root'>
          <NextIntlClientProvider messages={messages}>
            <Providers>{children}</Providers>
          </NextIntlClientProvider>
        </div>
        {/* <!-- Fathom - beautiful, simple website analytics --> */}
        <script defer data-site='EFSKBSSL' src='https://cdn.usefathom.com/script.js' />
        {/* <!-- / Fathom --> */}
      </body>
    </html>
  );
}
