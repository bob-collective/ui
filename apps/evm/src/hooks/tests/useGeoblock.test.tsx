import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useGeoblocking } from '../useGeoblock';

describe('useGeoblocking', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    window.location = {
      ...window.location,
      replace: vi.fn()
    };
  });

  afterEach(() => {
    vi.resetAllMocks();

    window.location = originalLocation;
  });

  it('should redirect to /geoblock if fetch returns 403 and geoblock is enabled', async () => {
    vi.stubEnv('NEXT_PUBLIC_GEOBLOCK_ENABLED', 'true');
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(new Response(null, { status: 403 }));

    renderHook(() => useGeoblocking());

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/check_access');
    });
    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledWith('/geoblock');
    });
  });

  it('should not redirect if fetch returns 200 and geoblock is enabled', async () => {
    vi.stubEnv('NEXT_PUBLIC_GEOBLOCK_ENABLED', 'true');
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(new Response(null, { status: 200 }));

    renderHook(() => useGeoblocking());

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/check_access');
    });
    await waitFor(() => {
      expect(window.location.replace).not.toHaveBeenCalled();
    });
  });

  it('should not check country if geoblock is disabled', async () => {
    vi.stubEnv('NEXT_PUBLIC_GEOBLOCK_ENABLED', 'false');

    renderHook(() => useGeoblocking());

    expect(fetch).not.toHaveBeenCalled();
    expect(window.location.replace).not.toHaveBeenCalled();
  });

  it('should log a warning if fetch fails', async () => {
    vi.stubEnv('NEXT_PUBLIC_GEOBLOCK_ENABLED', 'true');
    const consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(() => ({}));

    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    renderHook(() => useGeoblocking());

    await waitFor(() => {
      expect(consoleWarnMock).toHaveBeenCalledWith(new Error('Network error'));
    });
    await waitFor(() => {
      expect(window.location.replace).not.toHaveBeenCalled();
    });

    consoleWarnMock.mockRestore();
  });
});
