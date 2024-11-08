import { createContext, FC, ReactNode, useEffect, useRef } from 'react';
import { erc20Abi, isAddressEqual, WatchContractEventReturnType } from 'viem';
import { useAccount, useAccountEffect, useChainId, useConfig, watchContractEvent } from '@gobob/wagmi';

import { useBalances, useGetTransactions, useTokens } from '../hooks';

const BalanceContext = createContext({});

type BalanceWalletContextProps = {
  children: ReactNode;
};

const BalanceProvider: FC<BalanceWalletContextProps> = ({ children }) => {
  const chainId = useChainId();
  const { data: tokens } = useTokens(chainId);
  const { refetch: refetchBalances } = useBalances(chainId);
  const { refetch: refetchTransactions } = useGetTransactions();
  const config = useConfig();
  const { address } = useAccount();
  const watchRefs = useRef<WatchContractEventReturnType[]>();

  useAccountEffect({
    onDisconnect: () => {
      watchRefs.current?.map((unwatch) => unwatch());
      watchRefs.current = undefined;
    }
  });

  useEffect(() => {
    if (!watchRefs.current && address) {
      watchRefs.current = tokens.map((token) => {
        if (token.currency.isNative) {
          return () => {};
        }

        return watchContractEvent(config, {
          abi: erc20Abi,
          address: token.currency.address,
          eventName: 'Transfer',
          onLogs(logs) {
            logs.forEach((log) => {
              if (log.args.to && address && isAddressEqual(log.args.to, address)) {
                refetchBalances();
                refetchTransactions();
              }
            });
          }
        });
      });
    }

    return () => {
      watchRefs.current?.map((unwatch) => unwatch());
      watchRefs.current = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);

  return <BalanceContext.Provider value={{}}>{children}</BalanceContext.Provider>;
};

export { BalanceProvider };
