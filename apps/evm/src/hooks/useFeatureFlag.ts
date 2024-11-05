import { useMemo } from 'react';

enum FeatureFlags {
  WALLET
}

const featureFlags: Record<FeatureFlags, string | undefined> = {
  [FeatureFlags.WALLET]: process.env.NEXT_PUBLIC_FEATURE_FLAG_WALLET
};

const useFeatureFlag = (feature: FeatureFlags): boolean =>
  useMemo(() => featureFlags[feature] === 'enabled', [feature]);

export { FeatureFlags, useFeatureFlag };
