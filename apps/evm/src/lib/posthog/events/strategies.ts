import posthog from 'posthog-js';

type StrategyProperties = { amount: string; asset_name: string };

const strategiesEvents = {
  strategy: {
    interacted: (type: 'deposit', properties: Pick<StrategyProperties, 'asset_name'>) =>
      posthog.capture(`strategy_${type}_interacted`, properties),
    initiated: (type: 'deposit', properties: StrategyProperties) =>
      posthog.capture(`strategy_${type}_initiated`, properties),
    completed: (type: 'deposit') => posthog.capture(`strategy_${type}_completed`),
    failed: (type: 'deposit') => posthog.capture(`strategy_${type}_failed`),
    externalWithdraw: (properties: Pick<StrategyProperties, 'asset_name'>) =>
      posthog.capture(`strategy_withdraw_external`, properties)
  }
};

export { strategiesEvents };
