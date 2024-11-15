import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Button, ButtonProps, toast } from '@gobob/ui';
import { useAccount, useAccountEffect } from '@gobob/wagmi';
import { Trans } from '@lingui/macro';
import { mergeProps } from '@react-aria/utils';
import { useState } from 'react';

import { useGetUser, useLogin } from '@/hooks';

type LoginButtonProps = ButtonProps;

const LoginButton = (props: LoginButtonProps): JSX.Element => {
  const { refetch: refetchUser } = useGetUser({ retry: 5, retryDelay: 1000 });
  const { address } = useAccount();

  const { setShowAuthFlow, setSelectedTabIndex } = useDynamicContext();

  const [isConnecting, setConnecting] = useState(false);

  useAccountEffect({
    onConnect: (data) => {
      if (isConnecting) {
        login(data.address);

        setConnecting(false);
      }
    }
  });

  const { mutate: login, isPending: isLoadingLogin } = useLogin({
    onSuccess: async () => {
      refetchUser();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => {
      if (e.code === 4001) {
        toast.error(<Trans>User rejected the request</Trans>);
      } else {
        toast.error(e.message || <Trans>Something went wrong. Please try again later.</Trans>);
      }
    }
  });

  const handlePress = async () => {
    if (!address) {
      setSelectedTabIndex(1);
      setShowAuthFlow(true);

      setConnecting(true);

      return;
    }

    return login(address);
  };

  return <Button loading={isLoadingLogin} {...mergeProps(props, { onPress: handlePress })} />;
};

export { LoginButton };
