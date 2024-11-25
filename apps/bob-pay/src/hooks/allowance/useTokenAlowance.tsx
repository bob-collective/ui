import { CurrencyAmount, Token } from '@gobob/currency';
import { USDT_ETH } from '@gobob/tokens';
import { useMemo } from 'react';
import { Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

import { USDTAbi } from '@/abis/USDT.abi';

type UseTokenAllowanceProps = {
  token?: Token;
  owner?: Address;
  spender?: Address;
};

const useTokenAllowance = ({ token, owner, spender }: UseTokenAllowanceProps) => {
  const inputs = useMemo(() => [owner, spender] as [Address, Address], [owner, spender]);

  const { data: allowance, ...rest } = useReadContract({
    query: {
      enabled: Boolean(spender && owner && token)
    },
    abi: (token?.symbol === USDT_ETH?.symbol ? USDTAbi : erc20Abi) as typeof erc20Abi,
    address: token?.address,
    functionName: 'allowance',
    args: inputs
  });

  return useMemo(
    () => ({
      allowance:
        token && typeof allowance !== 'undefined'
          ? CurrencyAmount.fromRawAmount(token, allowance.toString())
          : undefined,
      ...rest
    }),
    [token, rest, allowance]
  );
};

export { useTokenAllowance };
