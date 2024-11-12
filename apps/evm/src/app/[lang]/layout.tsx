import { Metadata } from 'next';
import { headers } from 'next/headers';
import { Inter, Chakra_Petch } from 'next/font/google';
import { PropsWithChildren } from 'react';
import { t } from '@lingui/macro';
import { userAgentFromString } from 'next/server';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

import linguiConfig from '../../../lingui.config';

import './index.css';
import { Providers } from './providers';

import { allMessages, getI18nInstance } from '@/i18n/appRouterI18n';
import { LinguiClientProvider } from '@/i18n/provider';
import { PageLangParam, withLinguiLayout } from '@/i18n/withLigui';
import { UserAgentProvider } from '@/user-agent/provider';

const chakraPetch = Chakra_Petch({ subsets: ['latin'], display: 'swap', weight: '700' });
const inter = Inter({ subsets: ['latin'], display: 'swap' });

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

  return (
    <html className={`${chakraPetch.className} ${inter.className}`} lang={lang}>
      <GoogleTagManager gtmId='GTM-NSJLJ9D5' />
      <GoogleAnalytics gaId='G-VX9XQWCCC5' />
      <body>
        <div id='root'>
          <LinguiClientProvider initialLocale={lang} initialMessages={allMessages[lang]!}>
            <UserAgentProvider userAgent={userAgent}>
              <Providers>{children}</Providers>
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
