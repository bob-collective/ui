import { useMemo } from 'react';

enum FeatureFlags {
  TOP_100_SPICE_USERS
}

const featureFlags: Record<FeatureFlags, string | undefined> = {
  [FeatureFlags.TOP_100_SPICE_USERS]: process.env.NEXT_PUBLIC_FEATURE_FLAG_TOP_100_SPICE_USERS
};

const useFeatureFlag = (feature: FeatureFlags): boolean =>
  useMemo(() => featureFlags[feature] === 'enabled', [feature]);

export { FeatureFlags, useFeatureFlag };
