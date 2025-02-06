import { Flex, FlexProps } from '../Flex';
import { Icon } from '../Icon';
import { Span } from '../Text';

import { StyledTokenImg } from './TokenInput.style';

type Props = {
  symbol: string;
  logoUrl: string;
  icon?: typeof Icon;
};

type NativeAttrs = Omit<FlexProps, keyof Props>;

type TokenProps = Props & NativeAttrs;

const Token = ({ symbol, logoUrl, icon: Icon, ...props }: TokenProps): JSX.Element => (
  <Flex {...props} alignItems='center' elementType='span' gap='s'>
    {Icon ? <Icon /> : <StyledTokenImg alt={symbol} src={logoUrl} />}
    <Span size='inherit'>{symbol}</Span>
  </Flex>
);

export { Token };
