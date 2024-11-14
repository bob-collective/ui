import { useMemo } from 'react';

enum FeatureFlags {
  PLACEHOLDER_FLAG
}

const featureFlags: Record<FeatureFlags, string | undefined> = {
  [FeatureFlags.PLACEHOLDER_FLAG]: process.env.NEXT_PUBLIC_FEATURE_FLAG_WALLET
};

const useFeatureFlag = (feature: FeatureFlags): boolean =>
  useMemo(() => featureFlags[feature] === 'enabled', [feature]);

export { FeatureFlags, useFeatureFlag };
