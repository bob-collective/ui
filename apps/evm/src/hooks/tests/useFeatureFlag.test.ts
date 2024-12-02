import { renderHook } from '@testing-library/react-hooks';
import { describe, expect, it, vi } from 'vitest';

describe('useFeatureFlag', () => {
  beforeEach(vi.resetModules);

  it('should return true when EMPTY feature flag is enabled', async () => {
    vi.stubEnv('NEXT_PUBLIC_FEATURE_FLAG_EMPTY', 'enabled');

    const { FeatureFlags, useFeatureFlag } = await import('../useFeatureFlag');

    const { result } = renderHook(() => useFeatureFlag(FeatureFlags.EMPTY));

    expect(result.current).toBeTruthy();
  });

  it('should return false when EMPTY feature flag is disabled', async () => {
    vi.stubEnv('NEXT_PUBLIC_FEATURE_FLAG_EMPTY', 'disabled');

    const { FeatureFlags, useFeatureFlag } = await import('../useFeatureFlag');

    const { result } = renderHook(() => useFeatureFlag(FeatureFlags.EMPTY));

    expect(result.current).toBeFalsy();
  });

  it('should return false when EMPTY feature flag is undefined', async () => {
    vi.stubEnv('NEXT_PUBLIC_FEATURE_FLAG_EMPTY', undefined);

    const { FeatureFlags, useFeatureFlag } = await import('../useFeatureFlag');

    const { result } = renderHook(() => useFeatureFlag(FeatureFlags.EMPTY));

    expect(result.current).toBeFalsy();
  });
});
