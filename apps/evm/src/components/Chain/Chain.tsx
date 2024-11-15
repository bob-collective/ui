import { ChainId, getCapitalizedChainName } from '@gobob/chains';
import { FlexProps, IconProps, TextProps } from '@gobob/ui';

import { ChainLogo } from '../ChainLogo';

import { StyledFlex, StyledSpan } from './Chain.style';

type Props = {
  chainId: ChainId | 'BTC';
  labelProps?: TextProps;
  iconProps?: IconProps;
  label?: boolean;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type ChainProps = Props & InheritAttrs;

const Chain = ({ chainId, iconProps, labelProps, label = true, ...props }: ChainProps) => (
  <StyledFlex alignItems='center' direction='row' gap='s' {...props}>
    <ChainLogo chainId={chainId} {...iconProps} />
    {label && (
      <StyledSpan {...labelProps}>{chainId === 'BTC' ? 'Bitcoin' : getCapitalizedChainName(chainId)}</StyledSpan>
    )}
  </StyledFlex>
);

export { Chain };
