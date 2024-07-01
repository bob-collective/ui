'use client';
import { truncateEthAddress } from '@gobob/utils';
import { Flex, FlexProps, Span } from '@gobob/ui';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

type Props = { address: string };

type InheritAttrs = Omit<FlexProps, keyof Props>;

type EvmAddressLabelProps = Props & InheritAttrs;

const EvmAddressLabel = ({
  address,
  alignItems = 'center',
  gap = 's',
  ...props
}: EvmAddressLabelProps): JSX.Element => (
  <Flex alignItems={alignItems} gap={gap} {...props}>
    <Jazzicon diameter={20} seed={jsNumberForAddress(address)} />
    <Span size='s'>{truncateEthAddress(address)}</Span>
  </Flex>
);

export { EvmAddressLabel };
export type { EvmAddressLabelProps };
