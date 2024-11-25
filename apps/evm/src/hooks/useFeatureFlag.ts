import { useMemo } from 'react';

enum FeatureFlags {
  // TODO: replace with real feature flag
  EMPTY
}

const featureFlags: Record<FeatureFlags, string | undefined> = {
  [FeatureFlags.EMPTY]: process.env.NEXT_PUBLIC_FEATURE_FLAG_EMPTY
};

const useFeatureFlag = (feature: FeatureFlags): boolean =>
  useMemo(() => featureFlags[feature] === 'enabled', [feature]);

export { FeatureFlags, useFeatureFlag };
