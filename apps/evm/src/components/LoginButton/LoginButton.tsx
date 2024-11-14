import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Button, ButtonProps } from '@gobob/ui';
import { mergeProps } from '@react-aria/utils';
import { useState } from 'react';
import { useAccount, useAccountEffect } from 'wagmi';

import { useGetUser, useLogin } from '@/hooks';

type LoginButtonProps = ButtonProps;

const LoginButton = (props: LoginButtonProps): JSX.Element => {
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

  const { mutate: login, isPending: isLoadingLogin } = useLogin();

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
