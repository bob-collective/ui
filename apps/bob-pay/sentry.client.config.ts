// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_URL || process.env.NEXT_PUBLIC_SENTRY_URL;

Sentry.init({
  dsn: SENTRY_DSN,
  ignoreErrors: [
    'User rejected the request',
    'Talisman extension has not been configured yet',
    '"MetaMask" does not support programmatic chain switching',
    'Failed to fetch dynamically imported module',
    // Sentry recommend filtering out the following
    // https://blog.sentry.io/making-your-javascript-projects-less-noisy/
    "Failed to execute 'removeChild' on 'Node'"
  ],
  tunnel: '/api/tunnel',
  integrations: [
    // nextjs integration is deprecated in favour of browser integration
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      // Additional SDK configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true
    }),
    Sentry.thirdPartyErrorFilterIntegration({
      // Specify the application keys that you specified in the Sentry bundler plugin
      filterKeys: ['bob-ui-application-key'],

      // Defines how to handle errors that contain third party stack frames.
      // Possible values are:
      // - 'drop-error-if-contains-third-party-frames'
      // - 'drop-error-if-exclusively-contains-third-party-frames'
      // - 'apply-tag-if-contains-third-party-frames'
      // - 'apply-tag-if-exclusively-contains-third-party-frames'
      behaviour: 'drop-error-if-contains-third-party-frames'
    })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  tracesSampleRate: Number(process.env.NEXT_PUBLIC_TRACES_SAMPLE_RATE) || 0.5,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [/^\//, /^https:\/\/gobob\.xyz/],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0
});
