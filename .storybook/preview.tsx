import type { Preview } from '@storybook/react';

import React from 'react';

import { CSSReset, BOBUIProvider, bobTheme } from '../packages/ui/src';
import { WagmiProvider } from '../packages/wagmi/src';
import { SatsWagmiConfig } from '../packages/sats-wagmi/src';
import './style.css';
import { QueryClient, QueryClientProvider } from '../packages/react-query/src';

const queryClient = new QueryClient();

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: bobTheme.color('dark')
        },
        {
          name: 'light',
          value: bobTheme.color('light')
        }
      ]
    }
  },
  decorators: [
    (Story, { globals: { locale } }) => {
      const direction =
        // @ts-ignore
        locale && new Intl.Locale(locale)?.textInfo?.direction === 'rtl' ? 'rtl' : undefined;

      return (
        <QueryClientProvider client={queryClient}>
          <WagmiProvider>
            <SatsWagmiConfig network='testnet'>
              <BOBUIProvider locale={locale}>
                <CSSReset />
                <div dir={direction} lang={locale}>
                  <Story />
                </div>
              </BOBUIProvider>
            </SatsWagmiConfig>
          </WagmiProvider>
        </QueryClientProvider>
      );
    }
  ]
};

export default preview;
