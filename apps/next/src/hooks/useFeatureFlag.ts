import { useMemo } from 'react';

enum FeatureFlags {
  BTC_ONRAMP
}

const featureFlags: Record<FeatureFlags, string | undefined> = {
  [FeatureFlags.BTC_ONRAMP]: process.env.NEXT_PUBLIC_FEATURE_FLAG_BTC_ONRAMP
};

const useFeatureFlag = (feature: FeatureFlags): boolean =>
  useMemo(() => featureFlags[feature] === 'enabled', [feature]);

export { FeatureFlags, useFeatureFlag };
