import { Metadata } from 'next';
import { headers } from 'next/headers';
import { Inter } from 'next/font/google';
import { PropsWithChildren } from 'react';
import { t } from '@lingui/macro';
import { userAgentFromString } from 'next/server';

import linguiConfig from '../../../lingui.config';

import './index.css';
import { Providers } from './providers';

import { allMessages, getI18nInstance } from '@/i18n/appRouterI18n';
import { LinguiClientProvider } from '@/i18n/provider';
import { PageLangParam, withLinguiLayout } from '@/i18n/withLigui';
import { UserAgentProvider } from '@/user-agent/provider';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: PageLangParam): Metadata {
  const i18n = getI18nInstance(params.lang);

  return {
    title: 'BOB',
    description: t(i18n)``,
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
}

export default withLinguiLayout(function LangLayout({ children, params: { lang } }: PropsWithChildren<PageLangParam>) {
  const userAgent: ReturnType<typeof userAgentFromString> = userAgentFromString(headers().get('user-agent') ?? '');

  return (
    <html className={inter.className} lang={lang}>
      <body>
        <div id='root'>
          <LinguiClientProvider initialLocale={lang} initialMessages={allMessages[lang]!}>
            <UserAgentProvider userAgent={userAgent}>
              <Providers>{children}</Providers>
            </UserAgentProvider>
          </LinguiClientProvider>
        </div>
        {/* <!-- Fathom - beautiful, simple website analytics --> */}
        <script defer data-site='EFSKBSSL' src='https://cdn.usefathom.com/script.js' />
        {/* <!-- / Fathom --> */}
      </body>
    </html>
  );
});