import { useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_URL,
  ignoreErrors: [
    'User rejected the request',
    'Talisman extension has not been configured yet',
    '"MetaMask" does not support programmatic chain switching',
    'Failed to fetch dynamically imported module',
    // Sentry recommend filtering out the following
    // https://blog.sentry.io/making-your-javascript-projects-less-noisy/
    "Failed to execute 'removeChild' on 'Node'"
  ],
  tunnel: '/tunnel',
  integrations: [
    // See docs for support of different versions of variation of react router
    // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes
    }),
    Sentry.replayIntegration(),
    Sentry.thirdPartyErrorFilterIntegration({
      // Specify the application keys that you specified in the Sentry bundler plugin
      filterKeys: ['bob-ui-application-key'],

      // Defines how to handle errors that contain third party stack frames.
      // Possible values are:
      // - 'drop-error-if-contains-third-party-frames'
      // - 'drop-error-if-exclusively-contains-third-party-frames'
      // - 'apply-tag-if-contains-third-party-frames'
      // - 'apply-tag-if-exclusively-contains-third-party-frames'
      behaviour: 'apply-tag-if-contains-third-party-frames'
    })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  tracesSampleRate: import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || '0.5',

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [/^\//, /^https:\/\/gobob\.xyz/],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});
