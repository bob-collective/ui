import { useEffect, useRef } from 'react';
import { ChainId } from '@gobob/chains';
import { watchContractEvent } from '@wagmi/core';
import { erc20Abi } from 'viem';
import { useAccount } from 'wagmi';

import { useBalances } from './useBalances';
import { useTokens } from './useTokens';

import { INTERVAL, isProd } from '@/constants';
import { getConfig } from '@/lib/wagmi';

const useSubscribeBalances = (chainId: ChainId) => {
  const { refetch } = useBalances(chainId);
  const { data: tokens } = useTokens(chainId);
  const { address } = useAccount();

  const shouldRefetchRef = useRef(false);

  useEffect(() => {
    const unwatchers = tokens?.map((token) =>
      watchContractEvent(getConfig({ isProd }), {
        address: token.raw.address,
        abi: erc20Abi,
        eventName: 'Transfer',
        batch: true,
        poll: true,
        pollingInterval: INTERVAL.SECONDS_15,
        onLogs(logs) {
          shouldRefetchRef.current = logs.reduce((acc, log) => {
            return acc || log.args.from === address || log.args.to === address;
          }, false);
        }
      })
    );

    const intervalId = setInterval(() => {
      if (shouldRefetchRef.current) {
        shouldRefetchRef.current = false;
        refetch();
      }
    }, INTERVAL.SECONDS_30);

    return () => {
      clearInterval(intervalId);
      if (shouldRefetchRef.current) {
        shouldRefetchRef.current = false;
        refetch();
      }
      unwatchers?.forEach((unwatch) => unwatch());
    };
  }, [address, refetch, tokens]);
};

export { useSubscribeBalances };
