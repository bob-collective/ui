import { useMemo } from 'react';

enum FeatureFlags {
  // TODO: replace with real feature flag
  EMPTY,
  TOP_100_SPICE_USERS,
  OP_SUPERUSER
}

const featureFlags: Record<FeatureFlags, string | undefined> = {
  [FeatureFlags.EMPTY]: process.env.NEXT_PUBLIC_FEATURE_FLAG_EMPTY,
  [FeatureFlags.TOP_100_SPICE_USERS]: process.env.NEXT_PUBLIC_FEATURE_FLAG_TOP_100_SPICE_USERS,
  [FeatureFlags.OP_SUPERUSER]: process.env.NEXT_PUBLIC_FEATURE_FLAG_OP_SUPERUSER
};

const useFeatureFlag = (feature: FeatureFlags): boolean =>
  useMemo(() => featureFlags[feature] === 'enabled', [feature]);

export { FeatureFlags, useFeatureFlag };
