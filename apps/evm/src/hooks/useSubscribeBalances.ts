import { watchContractEvent } from '@wagmi/core';
import { useEffect, useRef } from 'react';
import { Address, erc20Abi } from 'viem';
import { useAccount } from 'wagmi';
import { ChainId } from '@gobob/chains';

import { INTERVAL, isProd } from '@/constants';
import { getConfig } from '@/lib/wagmi';

const useSubscribeBalances = (
  tokens: ({ address: string; chainId: ChainId } | undefined | null)[],
  onUpdate?: () => void
) => {
  const { address } = useAccount();

  const shouldRefetchRef = useRef(false);

  useEffect(() => {
    const unwatchers = tokens.map((token) =>
      token
        ? watchContractEvent(getConfig({ isProd }), {
            address: token.address as Address,
            chainId: token.chainId,
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
        : () => {}
    );

    const intervalId = setInterval(() => {
      if (shouldRefetchRef.current) {
        shouldRefetchRef.current = false;
        onUpdate?.();
      }
    }, INTERVAL.SECONDS_30);

    return () => {
      clearInterval(intervalId);
      if (shouldRefetchRef.current) {
        shouldRefetchRef.current = false;
        onUpdate?.();
      }
      unwatchers?.forEach((unwatch) => unwatch());
    };
  }, [address, onUpdate, tokens]);
};

export { useSubscribeBalances };
