import { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { Syne, Inter } from 'next/font/google';

import { Providers } from './providers';
import './index.css';

const syne = Syne({ subsets: ['latin'], display: 'swap' });
const inter = Inter({ subsets: ['latin'], display: 'swap' });

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

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en'>
      <head>
        <link href='https://fonts.googleapis.com' rel='preconnect' />
        <link crossOrigin='anonymous' href='https://fonts.gstatic.com' rel='preconnect' />
      </head>
      <body className={`${syne.className} ${inter.className}`}>
        <div id='root'>
          <Providers>{children}</Providers>
        </div>
        {/* <!-- Fathom - beautiful, simple website analytics --> */}
        <script defer data-site='EFSKBSSL' src='https://cdn.usefathom.com/script.js' />
        {/* <!-- / Fathom --> */}
      </body>
    </html>
  );
}
