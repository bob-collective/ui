import { CurrencyAmount, Token } from '@gobob/currency';
import { ethereumTokens, sepoliaTokens } from '@gobob/tokens';
import { useMemo } from 'react';
import { Address, isAddressEqual } from 'viem';

import { useTokenAllowance } from './useTokenAlowance';

const useGetApprovalData = (amount: CurrencyAmount<Token> | undefined, address?: Address, spender?: Address) => {
  const { allowance, isPending, refetch, isLoading } = useTokenAllowance({
    token: amount?.currency,
    owner: address,
    spender
  });

  const isRevokeRequired = useMemo((): boolean => {
    if (!amount) return false;

    const isMainnetUSDT =
      amount?.currency?.chainId === ethereumTokens.usdt?.chainId &&
      isAddressEqual(amount.currency.address, ethereumTokens.usdt.address);

    const isSepoliaUSDT =
      amount?.currency?.chainId === sepoliaTokens.usdt?.chainId &&
      isAddressEqual(amount.currency.address, sepoliaTokens.usdt.address);

    if (!isMainnetUSDT && !isSepoliaUSDT) return false;

    return !!allowance && allowance.greaterThan(0) && allowance.lessThan(amount);
  }, [allowance, amount]);

  const isApproveRequired = useMemo((): boolean => {
    return !!amount && !!allowance && allowance.lessThan(amount);
  }, [allowance, amount]);

  return {
    isApproveRequired,
    isRevokeRequired,
    allowance,
    isLoading,
    isPending,
    refetch
  };
};

export { useGetApprovalData };
