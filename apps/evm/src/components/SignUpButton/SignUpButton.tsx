import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Button, ButtonProps } from '@gobob/ui';
import { mergeProps } from '@react-aria/utils';
import { useState } from 'react';
import { useAccount, useAccountEffect } from 'wagmi';

import { useSignUp } from '@/hooks';

type SignUpButtonProps = ButtonProps;

const SignUpButton = (props: SignUpButtonProps): JSX.Element => {
  const { address } = useAccount();

  const { setShowAuthFlow, setSelectedTabIndex } = useDynamicContext();

  const [isConnecting, setConnecting] = useState(false);

  const { mutate: signUp, isPending: isSigningUp } = useSignUp();

  useAccountEffect({
    onConnect: () => {
      if (isConnecting && address) {
        signUp(address);

        setConnecting(false);
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

    return signUp(address);
  };

  return <Button loading={isSigningUp} {...mergeProps(props, { onPress: handlePress })} />;
};

export { SignUpButton };
