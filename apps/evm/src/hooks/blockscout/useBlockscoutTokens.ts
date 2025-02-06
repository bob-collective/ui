import { ERC20Token } from '@gobob/currency';
import { useCallback } from 'react';
import { ChainId } from '@gobob/chains';
import { Address, getAddress } from 'viem';

import { TokenData } from '../useTokens';

import { useBlockscoutAddressTokens } from './useBlockscoutAddressTokens';

import { RawToken, bobAssets } from '@/constants';
import { BlockscoutTokenInfo } from '@/utils';

const addressToBobAssetsMapping = bobAssets.reduce(
  (acc, cur) => {
    acc[getAddress(cur.address)] = cur;

    return acc;
  },
  {} as Record<Address, RawToken>
);

const useBlockscoutTokens = () => {
  const blockscoutTokensSelector = useCallback((data: BlockscoutTokenInfo[]): TokenData[] => {
    return (
      data
        // exclude known tokens
        .filter((token) => !addressToBobAssetsMapping[getAddress(token.token.address)])
        .map((blockscoutToken) => ({
          raw: {
            ...blockscoutToken.token,
            decimals: Number(blockscoutToken.token.decimals),
            chainId: ChainId.BOB,
            icon: '',
            apiId: ''
          },
          currency: new ERC20Token(
            ChainId.BOB,
            blockscoutToken.token.address,
            Number(blockscoutToken.token.decimals),
            blockscoutToken.token.symbol,
            blockscoutToken.token.name
          )
        }))
    );
  }, []);

  return useBlockscoutAddressTokens({
    select: blockscoutTokensSelector
  });
};

export { useBlockscoutTokens };
