import { Flex, FlexProps } from '../Flex';
import { Span } from '../Text';

import { StyledTokenImg } from './TokenInput.style';

type Props = {
  symbol: string;
  logoUrl: string;
};

type NativeAttrs = Omit<FlexProps, keyof Props>;

type TokenProps = Props & NativeAttrs;

const Token = ({ symbol, logoUrl, ...props }: TokenProps): JSX.Element => (
  <Flex {...props} alignItems='center' elementType='span' gap='s'>
    <StyledTokenImg alt={symbol} src={logoUrl} />
    <Span size='inherit'>{symbol}</Span>
  </Flex>
);

export { Token };
