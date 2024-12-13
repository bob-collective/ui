import { t } from '@lingui/macro';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { userAgentFromString } from 'next/server';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import { PropsWithChildren } from 'react';
import { cookieToInitialState } from 'wagmi';

import './index.css';
import { inter } from '../fonts';
import linguiConfig from '../../../lingui.config';

import { Providers } from './providers';

import { isProd } from '@/constants';
import { allMessages, getI18nInstance } from '@/i18n/appRouterI18n';
import { LinguiClientProvider } from '@/i18n/provider';
import { PageLangParam, withLinguiLayout } from '@/i18n/withLigui';
import { getConfig } from '@/lib/wagmi';

import { UserAgentProvider } from '@/user-agent/provider';

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: PageLangParam): Metadata {
  const i18n = getI18nInstance(params.lang);

  return {
    title: 'BOB | Build on Bitcoin',
    description: t(i18n)`BOB is a hybrid L2 that combines the security of Bitcoin with the versatility of Ethereum`,
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
    ],
    openGraph: {
      title: 'BOB | Build on Bitcoin',
      description: t(i18n)`BOB is a hybrid L2 that combines the security of Bitcoin with the versatility of Ethereum`,
      url: 'https://app.gobob.xyz',
      siteName: 'BOB',
      images: [
        {
          url: 'https://app.gobob.xyz/assets/app-preview.png', // Must be an absolute URL
          width: 1200,
          height: 360
        }
      ],
      type: 'website'
    }
  };
}

export default withLinguiLayout(function LangLayout({ children, params: { lang } }: PropsWithChildren<PageLangParam>) {
  const userAgent: ReturnType<typeof userAgentFromString> = userAgentFromString(headers().get('user-agent') ?? '');
  const initialState = cookieToInitialState(getConfig({ isProd }), headers().get('cookie'));

  return (
    <html className={inter.className} lang={lang}>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      <body>
        <div id='root'>
          <LinguiClientProvider initialLocale={lang} initialMessages={allMessages[lang]!}>
            <UserAgentProvider userAgent={userAgent}>
              <Providers initialState={initialState}>{children}</Providers>
            </UserAgentProvider>
          </LinguiClientProvider>
        </div>
        {/* <!-- Fathom - beautiful, simple website analytics --> */}
        <Script defer data-site='EFSKBSSL' src='https://cdn.usefathom.com/script.js' />
        {/* <!-- / Fathom --> */}
      </body>
    </html>
  );
});
