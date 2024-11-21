import { Currency, CurrencyAmount, Token } from '@gobob/currency';
import { useAccount, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from '@gobob/wagmi';
import { USDT_ETH, ethereumTokens, sepoliaTokens } from '@gobob/tokens';
import { useCallback, useEffect, useMemo } from 'react';
import { Address, erc20Abi, isAddressEqual } from 'viem';

import { useTokenAllowance } from './useTokenAlowance';
import { USDTAbi } from './abis/USDT.abi';

const UINT_256_MAX = BigInt(2 ** 256) - BigInt(1);

export const useGetApprovalData = (amount: CurrencyAmount<Token> | undefined, address?: Address, spender?: Address) => {
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

type UseApprovalProps = {
  amount: CurrencyAmount<Currency> | undefined;
  spender?: Address;
  onApprovalSuccess?: () => void;
};

const useApproval = ({ amount, spender, onApprovalSuccess }: UseApprovalProps) => {
  const { address } = useAccount();

  const tokenAmount = (amount?.currency?.isToken ? amount : undefined) as CurrencyAmount<Token> | undefined;

  const {
    isRevokeRequired,
    isApproveRequired,
    allowance,
    refetch,
    isPending: isAllowancePending,
    isLoading: isAllowanceLoading
  } = useGetApprovalData(tokenAmount, address, spender);

  const abi = useMemo(
    () => (tokenAmount?.currency.symbol === USDT_ETH?.symbol ? USDTAbi : erc20Abi) as typeof erc20Abi,
    [tokenAmount]
  );

  const { data: approveSimulate } = useSimulateContract({
    query: {
      enabled: Boolean(address && tokenAmount && spender && !isRevokeRequired && isApproveRequired)
    },
    address: tokenAmount?.currency.address,
    abi,
    functionName: 'approve',
    args: [spender!, UINT_256_MAX]
  });

  const {
    data: approveResult,
    writeContractAsync: approveFnAsync,
    writeContract: approveFn,
    isPending: isSigningApprove
  } = useWriteContract();

  const approve = useCallback(() => {
    if (approveSimulate?.request) {
      return approveFn(approveSimulate.request);
    } else {
      throw new Error('Approve simulation failed');
    }
  }, [approveSimulate, approveFn]);

  const approveAsync = useCallback(() => {
    if (approveSimulate?.request) {
      return approveFnAsync(approveSimulate.request);
    } else {
      throw new Error('Approve simulation failed');
    }
  }, [approveSimulate?.request, approveFnAsync]);

  const { isLoading: isApproving, isSuccess: isApproveSuccessful } = useWaitForTransactionReceipt({
    hash: approveResult ? approveResult : undefined
  });

  useEffect(() => {
    if (isApproveSuccessful) {
      onApprovalSuccess?.();
      refetch();
    }
  }, [isApproveSuccessful, onApprovalSuccess, refetch]);

  const { data: revokeSimulate } = useSimulateContract({
    query: {
      enabled: Boolean(address && spender && tokenAmount && isRevokeRequired)
    },
    address: tokenAmount?.currency.address,
    abi,
    functionName: 'approve',
    args: [spender!, 0n]
  });

  const {
    data: revokeResult,
    writeContractAsync: revokeFnAsync,
    writeContract: revokeFn,
    isPending: isSigningRevoke
  } = useWriteContract();

  const revoke = useCallback(() => {
    if (revokeSimulate?.request) {
      return revokeFn(revokeSimulate.request);
    } else {
      throw new Error('Revoke simulation failed');
    }
  }, [revokeSimulate, revokeFn]);

  const revokeAsync = useCallback(() => {
    if (revokeSimulate?.request) {
      return revokeFnAsync(revokeSimulate.request);
    } else {
      throw new Error('Revoke simulation failed');
    }
  }, [revokeSimulate?.request, revokeFnAsync]);

  const { isLoading: isRevoking, isSuccess: isRevokeSuccessful } = useWaitForTransactionReceipt({
    hash: revokeResult ? revokeResult : undefined
  });

  useEffect(() => {
    if (isRevokeSuccessful) {
      onApprovalSuccess?.();
      refetch();
    }
  }, [isRevokeSuccessful, onApprovalSuccess, refetch]);

  return {
    refetch,
    isRevokeRequired,
    isApproveRequired,
    isSigningApprove,
    isSigningRevoke,
    isApproving: isApproving || isSigningApprove,
    isRevoking: isRevoking || isSigningRevoke,
    isAllowancePending,
    isAllowanceLoading,
    allowance,
    approveAsync,
    approve,
    revokeAsync,
    revoke
  };
};

export { useApproval, UINT_256_MAX };
export type { UseApprovalProps };
