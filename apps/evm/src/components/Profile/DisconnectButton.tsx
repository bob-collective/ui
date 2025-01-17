'use client';

import { Button, Flex, Power, Span } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useEffect, useRef, useState } from 'react';

type DisconnectButtonProps = {
  onConfirmPress: () => void;
};

const DisconnectButton = ({ onConfirmPress }: DisconnectButtonProps): JSX.Element => {
  const [isFocused, setFocused] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setFocused(false);
      timeoutRef.current = undefined;
    }, 500);
  };

  const handlePress = () => {
    if (!isFocused) {
      return setFocused(true);
    }
    onConfirmPress();
  };

  const handleMouseEnter = () => {
    if (isFocused && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  const handleBlur = () => setFocused(false);

  return (
    <Button
      size='s'
      variant='ghost'
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPress={handlePress}
    >
      <Power size='s' />
      <Flex
        alignItems='center'
        elementType='span'
        style={{
          display: 'grid',
          gridTemplateColumns: isFocused ? '1fr' : '0fr',
          transition: 'all 200ms ease 0ms'
        }}
      >
        <Span size='s' style={{ overflow: 'hidden', marginLeft: isFocused ? 4 : 0 }}>
          <Trans>Disconnect</Trans>
        </Span>
      </Flex>
    </Button>
  );
};

export { DisconnectButton };
