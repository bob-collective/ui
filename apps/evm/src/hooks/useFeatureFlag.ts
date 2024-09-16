import { useMemo } from 'react';

enum FeatureFlags {
  BTC_GATEWAY
}

const featureFlags: Record<FeatureFlags, string | undefined> = {
  [FeatureFlags.BTC_GATEWAY]: import.meta.env.VITE_FEATURE_FLAG_BTC_GATEWAY
};

const useFeatureFlag = (feature: FeatureFlags): boolean =>
  useMemo(() => featureFlags[feature] === 'enabled', [feature]);

export { FeatureFlags, useFeatureFlag };
