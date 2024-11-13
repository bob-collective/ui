import { Metadata } from 'next';
import { Inter, Chakra_Petch } from 'next/font/google';
import { PropsWithChildren } from 'react';
import { t } from '@lingui/macro';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

import linguiConfig from '../../../lingui.config';

import './index.css';
import { Providers } from './providers';

import { allMessages, getI18nInstance } from '@/i18n/appRouterI18n';
import { LinguiClientProvider } from '@/i18n/provider';
import { PageLangParam, withLinguiLayout } from '@/i18n/withLigui';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const chakraPetch = Chakra_Petch({ subsets: ['latin'], display: 'swap', weight: '700' });

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
  return (
    <html className={`${inter.className} ${chakraPetch.className}`} lang={lang}>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      <body>
        <div id='root'>
          <LinguiClientProvider initialLocale={lang} initialMessages={allMessages[lang]!}>
            <Providers>{children}</Providers>
          </LinguiClientProvider>
        </div>
        {/* <!-- Fathom - beautiful, simple website analytics --> */}
        <script defer data-site='EFSKBSSL' src='https://cdn.usefathom.com/script.js' />
        {/* <!-- / Fathom --> */}
      </body>
    </html>
  );
});
