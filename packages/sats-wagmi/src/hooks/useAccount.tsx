import { useQuery } from '@gobob/react-query';

import { useSatsWagmi } from '../provider';
import { SatsConnector } from '../connectors';

type UseAccountProps = {
  onConnect?: ({ address, connector }: { address?: string | undefined; connector?: SatsConnector | undefined }) => void;
};

const useAccount = ({ onConnect }: UseAccountProps = {}) => {
  const { connector } = useSatsWagmi();

  const {
    data: address,
    error,
    isError,
    isLoading,
    isSuccess,
    refetch
  } = useQuery({
    queryKey: ['account', connector],
    queryFn: () => {
      if (!connector) return undefined;

      const address = connector?.getAccount();

      onConnect?.({ address, connector });

      return address;
    },
    enabled: !!connector
  });

  return {
    connector,
    address,
    error,
    isError,
    isLoading,
    isSuccess,
    refetch
  };
};

export { useAccount };
