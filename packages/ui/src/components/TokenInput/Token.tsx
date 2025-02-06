import { Flex, FlexProps } from '../Flex';
import { Icon } from '../Icon';
import { Span } from '../Text';

import { StyledTokenImg } from './TokenInput.style';

type Props = {
  symbol: string;
  icon: typeof Icon | string;
};

type NativeAttrs = Omit<FlexProps, keyof Props>;

type TokenProps = Props & NativeAttrs;

const Token = ({ symbol, icon: Icon, ...props }: TokenProps): JSX.Element => (
  <Flex {...props} alignItems='center' elementType='span' gap='s'>
    {typeof Icon === 'string' ? <StyledTokenImg alt={symbol} src={Icon} /> : <Icon />}
    <Span size='inherit'>{symbol}</Span>
  </Flex>
);

export { Token };
