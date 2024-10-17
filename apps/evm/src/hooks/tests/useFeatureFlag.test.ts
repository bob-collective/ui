import { renderHook } from '@testing-library/react-hooks';
import { describe, expect, it, vi } from 'vitest';

describe('useFeatureFlag', () => {
  beforeEach(vi.resetModules);

  it('should return true when BTC_GATEWAY feature flag is enabled', async () => {
    vi.stubEnv('NEXT_PUBLIC_FEATURE_FLAG_BTC_GATEWAY', 'enabled');

    const { FeatureFlags, useFeatureFlag } = await import('../useFeatureFlag');

    const { result } = renderHook(() => useFeatureFlag(FeatureFlags.BTC_GATEWAY));

    expect(result.current).toBeTruthy();
  });

  it('should return false when BTC_GATEWAY feature flag is disabled', async () => {
    vi.stubEnv('NEXT_PUBLIC_FEATURE_FLAG_BTC_GATEWAY', 'disabled');

    const { FeatureFlags, useFeatureFlag } = await import('../useFeatureFlag');

    const { result } = renderHook(() => useFeatureFlag(FeatureFlags.BTC_GATEWAY));

    expect(result.current).toBeFalsy();
  });

  it('should return false when BTC_GATEWAY feature flag is undefined', async () => {
    vi.stubEnv('NEXT_PUBLIC_FEATURE_FLAG_BTC_GATEWAY', undefined);

    const { FeatureFlags, useFeatureFlag } = await import('../useFeatureFlag');

    const { result } = renderHook(() => useFeatureFlag(FeatureFlags.BTC_GATEWAY));

    expect(result.current).toBeFalsy();
  });
});
