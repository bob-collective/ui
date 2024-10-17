import { useMemo } from 'react';

enum FeatureFlags {
  BTC_GATEWAY,
  WALLET
}

const featureFlags: Record<FeatureFlags, string | undefined> = {
  [FeatureFlags.BTC_GATEWAY]: process.env.NEXT_PUBLIC_FEATURE_FLAG_BTC_GATEWAY,
  [FeatureFlags.WALLET]: process.env.NEXT_PUBLIC_FEATURE_FLAG_WALLET
};

const useFeatureFlag = (feature: FeatureFlags): boolean =>
  useMemo(() => featureFlags[feature] === 'enabled', [feature]);

export { FeatureFlags, useFeatureFlag };
