import { Currency, CurrencyAmount } from '@gobob/currency';
import { Card, Dd, Dl, DlProps, Flex, PencilSquare, Span, Spinner, UnstyledButton } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { FeeRateReturnType } from '@gobob/sats-wagmi';
import { useState } from 'react';

import { AmountLabel } from '../AmountLabel';

import { StyledDlGroup, StyledDt } from './GatewayTransactionDetails.style';
import { GatewatFeeRateModal } from './GatewayFeeRateModal';

import { GatewayFeeRate } from '@/types';

type Props = {
  gatewayFee?: CurrencyAmount<Currency>;
  isLoadingGatewayFee?: boolean;
  networkFee?: CurrencyAmount<Currency>;
  isLoadingFeeEstimate?: boolean;

  feeRateData?: FeeRateReturnType;
  feeRateValue?: number;
  selectedFeeRate: GatewayFeeRate;

  isLoadingFeeRate?: boolean;
  amount?: CurrencyAmount<Currency> | CurrencyAmount<Currency>[];
  amountPlaceholder?: CurrencyAmount<Currency> | CurrencyAmount<Currency>[];
  currencyOnly?: boolean;
  onChangeFeeRate?: (feeRate: GatewayFeeRate) => void;
};

type InheritAttrs = Omit<DlProps, keyof Props>;

type GatewayTransactionDetailsProps = Props & InheritAttrs;

const GatewayTransactionDetails = ({
  amount: amountProp,
  amountPlaceholder,
  networkFee,
  gatewayFee,
  isLoadingGatewayFee,
  isLoadingFeeEstimate,
  isLoadingFeeRate,
  feeRateValue,
  feeRateData,
  currencyOnly = false,
  selectedFeeRate,
  onChangeFeeRate,
  ...props
}: GatewayTransactionDetailsProps): JSX.Element => {
  const [isOpen, setOpen] = useState(false);

  const amount = amountProp || amountPlaceholder;

  return (
    <Card background='grey-600' rounded='md'>
      <Dl direction='column' gap='none' {...props}>
        {amount && (
          <StyledDlGroup wrap gap='xs' justifyContent='space-between'>
            <StyledDt color='grey-50' size='xs'>
              <Trans>You will receive</Trans>
            </StyledDt>
            <Flex alignItems='center' elementType='dd'>
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
            </Flex>
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
        {feeRateValue && (
          <StyledDlGroup wrap gap='xs' justifyContent='space-between'>
            <StyledDt color='grey-50' size='xs'>
              Network Fee Rate
            </StyledDt>
            <Dd size='xs'>
              <Flex alignItems='center' elementType='span' gap='s'>
                {isLoadingFeeRate && <Spinner size='12' thickness={2} />}
                <UnstyledButton asChild onPress={() => setOpen(true)}>
                  <Flex alignItems='center'>
                    <PencilSquare size='xs' />
                    {feeRateValue} sat/vB
                  </Flex>
                </UnstyledButton>
              </Flex>
            </Dd>
          </StyledDlGroup>
        )}
      </Dl>
      {feeRateData && (
        <GatewatFeeRateModal
          feeRateData={feeRateData}
          isOpen={isOpen}
          selectedFeeRate={selectedFeeRate}
          onChangeFeeRate={onChangeFeeRate}
          onClose={() => setOpen(false)}
        />
      )}
    </Card>
  );
};

export { GatewayTransactionDetails };
