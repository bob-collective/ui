import { useCurrencyFormatter } from '../../hooks';
import { Flex } from '../Flex';

import {
  StyledListItemTitle,
  StyledListItemSubtitle,
  StyledListItemTokenImg,
  StyledListItemUsd,
  StyledListTokenWrapper,
  StyledListItemAmount
} from './TokenInput.style';
import { TokenSelectItemProps } from './TokenSelect';

type TokenListItemProps = TokenSelectItemProps;

const TokenListItem = ({ balance, currency, logoUrl }: TokenListItemProps): JSX.Element => {
  const format = useCurrencyFormatter();

  const title = currency.name || currency.symbol;

  return (
    <Flex style={{ minHeight: 48 }}>
      <StyledListTokenWrapper alignItems='center' flex='1' gap='md'>
        <StyledListItemTokenImg alt={title} src={logoUrl} />
        <Flex direction='column' flex='1'>
          <StyledListItemTitle>{title}</StyledListItemTitle>
          <StyledListItemSubtitle>{currency.symbol}</StyledListItemSubtitle>
        </Flex>
      </StyledListTokenWrapper>
      {balance && (
        <Flex alignItems='flex-end' direction='column' flex='0' gap='xs'>
          <StyledListItemAmount>{balance.amount}</StyledListItemAmount>
          <StyledListItemUsd>{format(balance.usd)}</StyledListItemUsd>
        </Flex>
      )}
    </Flex>
  );
};

export { TokenListItem };
export type { TokenListItemProps };
