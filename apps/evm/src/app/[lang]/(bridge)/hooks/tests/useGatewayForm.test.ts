import { act, renderHook } from '@testing-library/react-hooks';
import { Mock, vi } from 'vitest';
import { useAccount } from 'wagmi';

import { useGatewayForm } from '../useGatewayForm';

import { useBtcAccount, useIsContract } from '@/hooks';
import { BRIDGE_AMOUNT, BRIDGE_ASSET, BRIDGE_RECIPIENT } from '@/lib/form/bridge';

vi.mock(import('wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAccount: vi.fn()
  };
});

vi.mock(import('@/hooks'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useIsContract: vi.fn()
  };
});

vi.mock(import('@/hooks'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useBtcAccount: vi.fn()
  };
});

describe.skip('useGatewayForm', () => {
  const mockQuery = {
    minAmount: { toExact: () => '0.01' },
    balance: { toExact: () => '1.0' },
    fee: {
      estimate: { data: {} },
      rates: { data: {} }
    }
  } as unknown as Parameters<typeof useGatewayForm>['0']['query'];

  beforeEach(() => {
    (useAccount as Mock).mockReturnValue({ address: '0x123' });
    (useIsContract as Mock).mockReturnValue({ isContract: false });
    (useBtcAccount as Mock).mockReturnValue({ address: 'bc1qaddress' });
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() =>
      useGatewayForm({
        query: mockQuery,
        defaultAsset: 'BTC',
        onSubmit: vi.fn()
      })
    );

    expect(result.current.form.values[BRIDGE_AMOUNT]).toBe('');
    expect(result.current.form.values[BRIDGE_ASSET]).toBe('BTC');
    expect(result.current.form.values[BRIDGE_RECIPIENT]).toBe('');
  });

  it('should validate BRIDGE_AMOUNT field when min and max amounts are defined', async () => {
    const { result } = renderHook(() =>
      useGatewayForm({
        query: mockQuery,
        defaultAsset: 'BTC',
        onSubmit: vi.fn()
      })
    );

    act(() => {
      result.current.form.setFieldValue(BRIDGE_AMOUNT, '0.02');
    });

    await result.current.form.validateField(BRIDGE_AMOUNT);

    expect(result.current.form.errors[BRIDGE_AMOUNT]).toBeUndefined();
  });

  it('should disable the form when required fields are not filled', () => {
    const { result } = renderHook(() =>
      useGatewayForm({
        query: mockQuery,
        defaultAsset: 'BTC',
        onSubmit: vi.fn()
      })
    );

    expect(result.current.isDisabled).toBe(true);

    act(() => {
      result.current.form.setFieldValue(BRIDGE_AMOUNT, '0.1');
    });

    expect(result.current.isDisabled).toBe(false);
  });

  it('should update recipient field if user is a smart account', () => {
    (useIsContract as Mock).mockReturnValue({ isContract: true });

    const { result } = renderHook(() =>
      useGatewayForm({
        query: mockQuery,
        defaultAsset: 'BTC',
        onSubmit: vi.fn()
      })
    );

    expect(result.current.fields.recipient).toBeDefined();
  });

  it('should not show recipient field if user is not a smart account', () => {
    (useIsContract as Mock).mockReturnValue({ isContract: false });

    const { result } = renderHook(() =>
      useGatewayForm({
        query: mockQuery,
        defaultAsset: 'BTC',
        onSubmit: vi.fn()
      })
    );

    expect(result.current.fields.recipient).toBeUndefined();
  });

  it('should call onSubmit with form values on submit', async () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() =>
      useGatewayForm({
        query: mockQuery,
        defaultAsset: 'BTC',
        onSubmit
      })
    );

    act(() => {
      result.current.form.setFieldValue(BRIDGE_AMOUNT, '0.1');
    });

    await result.current.form.submitForm();

    expect(onSubmit).toHaveBeenCalledWith(
      {
        [BRIDGE_AMOUNT]: '0.1',
        [BRIDGE_ASSET]: 'BTC',
        [BRIDGE_RECIPIENT]: ''
      },
      expect.anything()
    );
  });
});
