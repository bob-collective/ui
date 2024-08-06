import { useCurrencyFormatter } from '../../hooks';
import { Flex } from '../Flex';

import {
  StyledListItemLabel,
  StyledListItemTokenImg,
  StyledListItemUsd,
  StyledListTokenWrapper
} from './TokenInput.style';
import { TokenSelectItemProps } from './TokenSelect';

type TokenListItemProps = TokenSelectItemProps;

const TokenListItem = ({ balance, balanceUSD, currency, logoUrl }: TokenListItemProps): JSX.Element => {
  const format = useCurrencyFormatter();

  return (
    <>
      <StyledListTokenWrapper alignItems='center' flex='1' gap='md'>
        <StyledListItemTokenImg alt={currency.symbol} src={logoUrl} />
        <StyledListItemLabel>{currency.symbol}</StyledListItemLabel>
      </StyledListTokenWrapper>
      <Flex alignItems='flex-end' direction='column' flex='0' gap='xs'>
        <StyledListItemLabel>{balance}</StyledListItemLabel>
        <StyledListItemUsd>{format(balanceUSD)}</StyledListItemUsd>
      </Flex>
    </>
  );
};

export { TokenListItem };
export type { TokenListItemProps };
