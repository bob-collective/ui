'use client';
import { useQuery } from '@gobob/react-query';
import { getAddressInfo } from 'bitcoin-address-validation';
import { useEffect } from 'react';

import { useSatsWagmi } from '../provider';
import { SatsConnector } from '../connectors';

type UseAccountProps = {
  onConnect?: ({ address, connector }: { address?: string | undefined; connector?: SatsConnector | undefined }) => void;
};

const useAccount = ({ onConnect }: UseAccountProps = {}) => {
  const { connector } = useSatsWagmi();

  const { data, error, isError, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ['sats-account', connector],
    queryFn: () => {
      if (!connector) return undefined;

      const address = connector?.getAccount();

      onConnect?.({ address, connector });

      const addressType = address ? getAddressInfo(address).type : undefined;

      return { address, type: addressType };
    },
    enabled: !!connector
  });

  useEffect(() => {
    if (!connector) return;

    connector.on(() => refetch());

    return () => {
      connector.removeListener(() => refetch());
    };
  }, [connector, refetch]);

  return {
    connector,
    address: data?.address,
    addressType: data?.type,
    error,
    isError,
    isLoading,
    isSuccess,
    refetch
  };
};

export { useAccount };
