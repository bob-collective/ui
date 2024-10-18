import { Currency, CurrencyAmount } from '@gobob/currency';
import { Card, Dd, Dl, DlProps, Flex, Span, Spinner } from '@gobob/ui';
import { Trans } from '@lingui/macro';

import { AmountLabel } from '../AmountLabel';

import { StyledDlGroup, StyledDt } from './GatewayTransactionDetails.style';

type Props = {
  gatewayFee?: CurrencyAmount<Currency>;
  gatewayFeePlaceholder?: CurrencyAmount<Currency>;
  isLoadingGatewayFee?: boolean;
  networkFee?: CurrencyAmount<Currency>;
  networkFeePlaceholder?: CurrencyAmount<Currency>;
  isLoadingFeeEstimate?: boolean;
  feeRate?: number;
  feeRatePlaceholder?: number;
  isLoadingFeeRate?: boolean;
  amount?: CurrencyAmount<Currency> | CurrencyAmount<Currency>[];
  amountPlaceholder?: CurrencyAmount<Currency> | CurrencyAmount<Currency>[];
  currencyOnly?: boolean;
};

type InheritAttrs = Omit<DlProps, keyof Props>;

type GatewayTransactionDetailsProps = Props & InheritAttrs;

const GatewayTransactionDetails = ({
  amount: amountProp,
  amountPlaceholder,
  networkFee: networkFeeProp,
  networkFeePlaceholder,
  gatewayFeePlaceholder,
  gatewayFee: gatewayFeeProp,
  isLoadingGatewayFee,
  isLoadingFeeEstimate,
  isLoadingFeeRate,
  feeRate: feeRateProp,
  feeRatePlaceholder,
  currencyOnly = false,
  ...props
}: GatewayTransactionDetailsProps): JSX.Element => {
  const amount = amountProp || amountPlaceholder;
  const gatewayFee = gatewayFeeProp || gatewayFeePlaceholder;
  const networkFee = networkFeeProp || networkFeePlaceholder;
  const feeRate = feeRateProp || feeRatePlaceholder;

  return (
    <Card background='grey-600' rounded='md'>
      <Dl direction='column' gap='none' {...props}>
        {amount && (
          <StyledDlGroup wrap alignItems='flex-start' gap='xs' justifyContent='space-between'>
            <StyledDt $hasExtendedHeight={false} color='grey-50' size='xs'>
              <Trans>You will receive</Trans>
            </StyledDt>
            <Dd>
              {Array.isArray(amount) ? (
                <Flex alignItems='flex-end' direction='column' elementType='span' gap='xxs'>
                  {amount.map((asset) => (
                    <Span key={asset.currency.symbol} size='xs'>
                      <AmountLabel amount={asset} currencyOnly={currencyOnly} />
                    </Span>
                  ))}
                </Flex>
              ) : (
                <Span size='xs'>
                  <AmountLabel amount={amount} currencyOnly={currencyOnly} />
                </Span>
              )}
            </Dd>
          </StyledDlGroup>
        )}
        {gatewayFee && (
          <StyledDlGroup wrap gap='xs' justifyContent='space-between'>
            <StyledDt color='grey-50' size='xs'>
              Gateway Fee
            </StyledDt>
            <Dd size='xs'>
              <Flex alignItems='center' elementType='span' gap='s'>
                {isLoadingGatewayFee && <Spinner size='12' thickness={2} />}
                <AmountLabel amount={gatewayFee} />
              </Flex>
            </Dd>
          </StyledDlGroup>
        )}
        {networkFee && (
          <StyledDlGroup wrap gap='xs' justifyContent='space-between'>
            <StyledDt color='grey-50' size='xs'>
              Network Fee
            </StyledDt>
            <Dd size='xs'>
              <Flex alignItems='center' elementType='span' gap='s'>
                {isLoadingFeeEstimate && <Spinner size='12' thickness={2} />}
                <AmountLabel amount={networkFee} />
              </Flex>
            </Dd>
          </StyledDlGroup>
        )}
        {feeRate && (
          <StyledDlGroup wrap gap='xs' justifyContent='space-between'>
            <StyledDt color='grey-50' size='xs'>
              Network Fee Rate
            </StyledDt>
            <Dd size='xs'>
              <Flex alignItems='center' elementType='span' gap='s'>
                {isLoadingFeeRate && <Spinner size='12' thickness={2} />}
                {feeRate} sat/vB
              </Flex>
            </Dd>
          </StyledDlGroup>
        )}
      </Dl>
    </Card>
  );
};

export { GatewayTransactionDetails };
