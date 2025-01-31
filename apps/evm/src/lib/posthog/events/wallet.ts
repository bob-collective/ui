import posthog from 'posthog-js';

const walletEvents = {
  evm: {
    connect: (properties: { evm_address: string; wallet_name: string }) =>
      posthog.capture('evm_connect_wallet', properties, { $set: properties }),
    disconnect: () => posthog.capture('evm_disconnect_wallet')
  },
  btc: {
    connect: (properties: { btc_address: string; wallet_name: string }) =>
      posthog.capture('btc_connect_wallet', properties, { $set: properties }),
    disconnect: () => posthog.capture('btc_disconnect_wallet')
  },
  drawer: {
    buy: () => posthog.capture('wallet_drawer_buy')
  }
};

export { walletEvents };
