import { Currency, CurrencyAmount } from '@gobob/currency';
import { Avatar, Card, Dd, Dl, DlProps, Flex, SelectProps, Span, Spinner, TokenData } from '@gobob/ui';
import { ReactNode } from 'react';
import { ChainId } from '@gobob/chains';

import { AmountLabel } from '../AmountLabel';

import { StyledDlGroup, StyledDt } from './TransactionDetails.style';

type Props = {
  chainId: ChainId;
  gasEstimate?: CurrencyAmount<Currency>;
  gasEstimatePlaceholder?: CurrencyAmount<Currency>;
  isLoadingGasEstimate?: boolean;
  tokenUrl?: string;
  amount?: CurrencyAmount<Currency>;
  amountPlaceholder?: CurrencyAmount<Currency>;
  onChangeGasTicker?: (ticker: string) => void;
  selectProps?: Omit<SelectProps<TokenData>, 'children'>;
  duration?: ReactNode;
  gasLabel?: ReactNode;
};

type InheritAttrs = Omit<DlProps, keyof Props>;

type TransactionDetailsProps = Props & InheritAttrs;

const TransactionDetails = ({
  chainId,
  onChangeGasTicker,
  amount: amountProp,
  amountPlaceholder,
  gasEstimate: gasEstimateProp,
  gasEstimatePlaceholder,
  isLoadingGasEstimate,
  duration,
  selectProps,
  gasLabel = 'Estimated Gas',
  tokenUrl,
  ...props
}: TransactionDetailsProps): JSX.Element => {
  const amount = amountProp || amountPlaceholder;
  const gasEstimate = gasEstimateProp || gasEstimatePlaceholder;

  return (
    <Card background='grey-700'>
      <Dl direction='column' gap='none' {...props}>
        {amount && (
          <StyledDlGroup wrap alignItems='center' gap='xs' justifyContent='space-between'>
            <StyledDt size='xs'>Sending</StyledDt>
            <Dd>
              <Flex alignItems='center' gap='s'>
                {tokenUrl && <Avatar alt={amount.currency.symbol} size='xl' src={tokenUrl} />}
                <Span size='xs'>
                  <AmountLabel amount={amount} />
                </Span>
              </Flex>
            </Dd>
          </StyledDlGroup>
        )}
        {duration && (
          <StyledDlGroup justifyContent='space-between'>
            <StyledDt size='xs'>Transfer time</StyledDt>
            <Dd size='xs'>{duration}</Dd>
          </StyledDlGroup>
        )}
        {gasEstimate && (
          <StyledDlGroup wrap alignItems='center' gap='xs' justifyContent='space-between'>
            <StyledDt size='xs'>{gasLabel}</StyledDt>
            <Dd size='xs'>
              <Flex alignItems='center' elementType='span' gap='s'>
                {isLoadingGasEstimate && <Spinner size='12' thickness={2} />}
                {tokenUrl && <Avatar alt={gasEstimate.currency.symbol} size='xl' src={tokenUrl} />}
                <AmountLabel amount={gasEstimate} />
              </Flex>
            </Dd>
          </StyledDlGroup>
        )}
      </Dl>
    </Card>
  );
};

export { TransactionDetails };
