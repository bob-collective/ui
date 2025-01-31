import posthog from 'posthog-js';

import { bridgeEvents } from './bridge';
import { strategiesEvents } from './strategies';
import { walletEvents } from './wallet';

const posthogEvents = {
  bridge: bridgeEvents,
  strategies: strategiesEvents,
  fusion: {
    signUp: () => posthog.capture('fusion_sign_up', {}, { $set_once: { fusion_user: true } }),
    login: () => posthog.capture('fusion_login', {}, { $set_once: { fusion_user: true } })
  },
  wallet: walletEvents
};

export { posthogEvents };
