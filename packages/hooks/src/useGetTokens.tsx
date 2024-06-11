import { useQuery } from '@gobob/react-query';
import { useCallback } from 'react';

type TokenData = {
  chainId: number;
  address: `0x${string}`;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  extensions: {
    optimismBridgeAddress: `0x${string}`;
    opListId: string;
    opTokenId: string;
  };
};

// TODO: we need an alternative
const useGetTokens = () => {
  const result = useQuery<TokenData[]>({
    queryKey: ['token'],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await fetch(
        'https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.tokenlist.json'
      );

      const { tokens } = await response.json();

      return tokens;
    }
  });

  const getToken = useCallback(
    (chainId: number, symbol: string) =>
      result.data?.find((item) => item.chainId === chainId && item.symbol === symbol),
    [result.data]
  );

  const getTokenLogo = useCallback(
    (symbol: string, chainId?: number) =>
      result.data?.find((item) => (item.symbol === symbol && chainId ? item.chainId === chainId : true)),
    [result.data]
  );

  return {
    ...result,
    getToken,
    getTokenLogo
  };
};

export { useGetTokens };
export type { TokenData };
