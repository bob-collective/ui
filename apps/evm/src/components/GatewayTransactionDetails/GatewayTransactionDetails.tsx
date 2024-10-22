import { Currency, CurrencyAmount } from '@gobob/currency';
import { FeeRateReturnType } from '@gobob/sats-wagmi';
import { Card, Cog, Dd, Dl, DlProps, Flex, InformationCircle, Span, Spinner, Tooltip, UnstyledButton } from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useState } from 'react';

import { AmountLabel } from '../AmountLabel';

import { GatewayFeeSettingsModal } from './GatewayFeeSettingsModal';
import { StyledDlGroup, StyledDt } from './GatewayTransactionDetails.style';

import { GatewayTransactionFee } from '@/types';

type Props = {
  gatewayFee?: CurrencyAmount<Currency>;
  isLoadingGatewayFee?: boolean;
  networkFee?: CurrencyAmount<Currency>;
  isLoadingFeeEstimate?: boolean;
  feeRateData?: FeeRateReturnType;
  feeRate?: number;
  selectedFee: GatewayTransactionFee;
  isLoadingFeeRate?: boolean;
  amount?: CurrencyAmount<Currency> | CurrencyAmount<Currency>[];
  amountPlaceholder?: CurrencyAmount<Currency> | CurrencyAmount<Currency>[];
  currencyOnly?: boolean;
  onChangeFee?: (feeRate: GatewayTransactionFee) => void;
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
  feeRate,
  feeRateData,
  currencyOnly = false,
  selectedFee,
  onChangeFee,
  ...props
}: GatewayTransactionDetailsProps): JSX.Element => {
  const { i18n } = useLingui();

  const [isOpen, setOpen] = useState(false);

  const amount = amountProp || amountPlaceholder;

  return (
    <Card background='grey-600' rounded='md'>
      <Dl direction='column' gap='none' {...props}>
        {amount && (
          <StyledDlGroup wrap gap='xs' justifyContent='space-between'>
            <Flex alignItems='center' gap='xs'>
              <StyledDt color='grey-50' size='xs'>
                <Trans>You will receive</Trans>
              </StyledDt>
              <Tooltip
                color='primary'
                label={t(
                  i18n
                )`This is the final amount you will receive after deducting the Protocol fees from your input amount.`}
              >
                <InformationCircle color='grey-50' size='xs' />
              </Tooltip>
            </Flex>
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
            <Flex alignItems='center' gap='xs'>
              <StyledDt color='grey-50' size='xs'>
                <Trans>Protocol Fee</Trans>
              </StyledDt>
              <Tooltip
                color='primary'
                label={t(
                  i18n
                )`The Protocol Fee is a charge for using Gateway, our product, to facilitate the transaction.`}
              >
                <InformationCircle color='grey-50' size='xs' />
              </Tooltip>
            </Flex>
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
            <Flex alignItems='center' gap='xs'>
              <StyledDt color='grey-50' size='xs'>
                <Trans>Network Fee</Trans>
              </StyledDt>
              <Tooltip
                color='primary'
                label={t(
                  i18n
                )`The Network Fee is a fee paid to Bitcoin miners for including your transaction in a block and confirming it on the blockchain.`}
              >
                <InformationCircle color='grey-50' size='xs' />
              </Tooltip>
            </Flex>
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
            <Flex alignItems='center' gap='xs'>
              <StyledDt color='grey-50' size='xs'>
                <Trans>Network Fee Rate</Trans>
              </StyledDt>
              <Tooltip
                color='primary'
                label={t(
                  i18n
                )`The Network Fee Rate is the amount you pay per byte of data in your Bitcoin transaction, measured in satoshis per byte (sat/vB). A higher fee rate can speed up transaction confirmation.`}
              >
                <InformationCircle color='grey-50' size='xs' />
              </Tooltip>
            </Flex>
            <Flex alignItems='center' elementType='dd' gap='s'>
              {isLoadingFeeRate && <Spinner size='12' thickness={2} />}
              <UnstyledButton onPress={() => setOpen(true)}>
                <Flex alignItems='center' gap='xs'>
                  <Span size='xs'>{Math.ceil(feeRate)} sat/vB</Span>
                  <Cog color='grey-50' size='s' />
                </Flex>
              </UnstyledButton>
            </Flex>
          </StyledDlGroup>
        )}
      </Dl>
      {feeRateData && (
        <GatewayFeeSettingsModal
          feeRateData={feeRateData}
          isOpen={isOpen}
          selectedFee={selectedFee}
          onChangeFee={onChangeFee}
          onClose={() => setOpen(false)}
        />
      )}
    </Card>
  );
};

export { GatewayTransactionDetails };
