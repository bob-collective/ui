import { renderHook } from '@testing-library/react-hooks';
import { describe, expect, it, vi } from 'vitest';

describe('useFeatureFlag', () => {
  beforeEach(vi.resetModules);

  it('should return true when WALLET feature flag is enabled', async () => {
    vi.stubEnv('NEXT_PUBLIC_FEATURE_FLAG_WALLET', 'enabled');

    const { FeatureFlags, useFeatureFlag } = await import('../useFeatureFlag');

    const { result } = renderHook(() => useFeatureFlag(FeatureFlags.WALLET));

    expect(result.current).toBeTruthy();
  });

  it('should return false when WALLET feature flag is disabled', async () => {
    vi.stubEnv('NEXT_PUBLIC_FEATURE_FLAG_WALLET', 'disabled');

    const { FeatureFlags, useFeatureFlag } = await import('../useFeatureFlag');

    const { result } = renderHook(() => useFeatureFlag(FeatureFlags.WALLET));

    expect(result.current).toBeFalsy();
  });

  it('should return false when WALLET feature flag is undefined', async () => {
    vi.stubEnv('NEXT_PUBLIC_FEATURE_FLAG_WALLET', undefined);

    const { FeatureFlags, useFeatureFlag } = await import('../useFeatureFlag');

    const { result } = renderHook(() => useFeatureFlag(FeatureFlags.WALLET));

    expect(result.current).toBeFalsy();
  });
});
