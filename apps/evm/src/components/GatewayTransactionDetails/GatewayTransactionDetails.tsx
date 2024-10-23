import { Currency, CurrencyAmount } from '@gobob/currency';
import {
  Card,
  Cog,
  Dd,
  Dl,
  DlProps,
  Flex,
  InformationCircle,
  Skeleton,
  Span,
  Spinner,
  Tooltip,
  UnstyledButton,
  Warning
} from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ReactNode, useState } from 'react';
import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';

import { AmountLabel } from '../AmountLabel';

import { GatewayFeeSettingsModal } from './GatewayFeeSettingsModal';
import { StyledDlGroup, StyledDt } from './GatewayTransactionDetails.style';

import { GatewayTransactionFee, GatewayTransactionSpeedData } from '@/types';
import { isHighFeeRate, isLowFeeRate } from '@/utils/gateway';

type Props = {
  gatewayFee?: CurrencyAmount<Currency>;
  isLoadingGatewayFee?: boolean;
  networkFee?: CurrencyAmount<Currency>;
  isLoadingFeeEstimate?: boolean;
  feeRateData?: GatewayTransactionSpeedData;
  feeRate?: number;
  selectedFee: GatewayTransactionFee;
  isLoadingFeeRate?: boolean;
  amount?: CurrencyAmount<Currency> | CurrencyAmount<Currency>[];
  amountPlaceholder?: CurrencyAmount<Currency> | CurrencyAmount<Currency>[];
  onChangeFee?: (feeRate: GatewayTransactionFee) => void;
  amountLabel?: ReactNode;
  amountTooltipLabel?: ReactNode;
  hideAmountPrice?: boolean;
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
  hideAmountPrice,
  selectedFee,
  onChangeFee,
  amountLabel,
  amountTooltipLabel,
  ...props
}: GatewayTransactionDetailsProps): JSX.Element => {
  const { address: btcAddress } = useSatsAccount();

  const { i18n } = useLingui();

  const [isOpen, setOpen] = useState(false);

  const amount = amountProp || amountPlaceholder;

  const shouldShowLowFeeRateWarning = feeRate && feeRateData && isLowFeeRate(feeRate, feeRateData);

  const shouldShowHighFeeRateWarning = feeRate && feeRateData && isHighFeeRate(feeRate, feeRateData);

  return (
    <Card background='grey-600' rounded='md'>
      <Dl direction='column' gap='none' {...props}>
        {amount && (
          <StyledDlGroup wrap gap='xs' justifyContent='space-between'>
            <Flex alignItems='center' gap='xs'>
              <StyledDt color='grey-50' size='xs'>
                {amountLabel}
              </StyledDt>
              {amountTooltipLabel && (
                <Tooltip color='primary' label={amountTooltipLabel}>
                  <InformationCircle color='grey-50' size='xs' />
                </Tooltip>
              )}
            </Flex>
            <Flex alignItems='center' elementType='dd'>
              {Array.isArray(amount) ? (
                <Flex alignItems='flex-end' direction='column' elementType='span' gap='xxs'>
                  {amount.map((asset) => (
                    <Span key={asset.currency.symbol} size='xs'>
                      <AmountLabel amount={asset} hidePrice={hideAmountPrice} />
                    </Span>
                  ))}
                </Flex>
              ) : (
                <Span size='xs'>
                  <AmountLabel amount={amount} hidePrice={hideAmountPrice} />
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
                )`The Network Fee is paid to Bitcoin miners for including your transaction in a block and confirming it on the blockchain. A higher fee increases the chances of faster confirmation, while a lower fee may delay or even prevent timely inclusion.`}
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
        {(feeRate || isLoadingFeeRate) && (
          <StyledDlGroup wrap gap='xs' justifyContent='space-between'>
            <Flex alignItems='center' gap='xs'>
              <StyledDt color='grey-50' size='xs'>
                <Trans>Network Fee Rate</Trans>
              </StyledDt>
            </Flex>
            <Flex alignItems='center' elementType='dd' gap='s'>
              {(shouldShowLowFeeRateWarning || shouldShowHighFeeRateWarning) && (
                <Tooltip
                  color='primary'
                  label={
                    shouldShowLowFeeRateWarning
                      ? t(
                          i18n
                        )`The specified fee rate may delay the confirmation of your transaction, possibly taking longer than 1
                hour to receive your funds. For faster confirmation, consider increasing the fee rate.`
                      : t(
                          i18n
                        )`The specified fee rate is higher than necessary and may result in overpaying. A lower fee rate could
                still confirm your transaction within a reasonable time.`
                  }
                >
                  <Warning color='yellow-500' size='s' />
                </Tooltip>
              )}
              {isLoadingFeeRate || !feeRate ? (
                <Skeleton width='6xl' />
              ) : (
                <Tooltip isDisabled={!!btcAddress} label={t(i18n)`Connect BTC wallet to access fee rate settings.`}>
                  <UnstyledButton disabled={!btcAddress} onPress={() => setOpen(true)}>
                    <Flex alignItems='center' gap='xs'>
                      <Span size='xs'>{Math.ceil(feeRate)} sat/vB</Span>
                      <Cog color='grey-50' size='s' />
                    </Flex>
                  </UnstyledButton>
                </Tooltip>
              )}
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
