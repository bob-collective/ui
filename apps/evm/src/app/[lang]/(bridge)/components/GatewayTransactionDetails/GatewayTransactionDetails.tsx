import { Currency, CurrencyAmount } from '@gobob/currency';
import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import { BITCOIN } from '@gobob/tokens';
import {
  Alert,
  Card,
  Cog,
  Dd,
  Dl,
  Flex,
  InformationCircle,
  P,
  Skeleton,
  Span,
  Tooltip,
  UnstyledButton,
  Warning
} from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ReactNode, useState } from 'react';

import { UseGatewayReturnType } from '../../hooks';
import { isHighFeeRate, isLowFeeRate } from '../../utils';

import { GatewayFeeSettingsModal } from './GatewayFeeSettingsModal';
import { StyledDlGroup, StyledDt } from './GatewayTransactionDetails.style';

import { AmountLabel } from '@/components';
import { GatewayTransactionType } from '@/types';

type GatewayTransactionDetailsProps = {
  assetName?: string;
  amountLabel?: ReactNode;
  amountTooltipLabel?: ReactNode;
  hideAmountPrice?: boolean;
  amountPlaceholder?: CurrencyAmount<Currency>;
  gateway: UseGatewayReturnType;
};

const bitcoinPlaceholder = CurrencyAmount.fromRawAmount(BITCOIN, 0n);

const GatewayTransactionDetails = ({
  assetName,
  gateway,
  hideAmountPrice,
  amountLabel,
  amountTooltipLabel,
  amountPlaceholder
}: GatewayTransactionDetailsProps): JSX.Element => {
  const { i18n } = useLingui();

  const { address: btcAddress } = useSatsAccount();

  const [isOpen, setOpen] = useState(false);

  const { query, settings, type, isTapRootAddress } = gateway;

  const amount = query.quote.data?.amount || amountPlaceholder;

  const protocolFee = query.quote.data?.protocolFee || bitcoinPlaceholder;

  const estimateFee = query.fee.estimate.data || bitcoinPlaceholder;

  const shouldShowLowFeeRateWarning =
    settings.fee.rate && query.fee.rates.data && isLowFeeRate(settings.fee.rate, query.fee.rates.data);

  const shouldShowHighFeeRateWarning =
    settings.fee.rate && query.fee.rates.data && isHighFeeRate(settings.fee.rate, query.fee.rates.data);

  return (
    <Flex direction='column' gap='xl'>
      {isTapRootAddress && (
        <Alert status='warning'>
          <P size='s'>
            <Trans>
              Unfortunately, Taproot (P2TR) addresses are not supported at this time. Please use a different address
              type.
            </Trans>
          </P>
        </Alert>
      )}
      {!!query.quote.error && (
        <Alert status='warning'>
          <P size='s'>
            <Trans>
              BTC bridge is currently unavailable. This may be due to: {query.quote.error.message}. Please try again
              later.
            </Trans>
          </P>
        </Alert>
      )}
      {!query.liquidity.isPending && query.liquidity.data && !query.liquidity.data.hasLiquidity && (
        <Alert status='warning'>
          <P size='s'>
            {type === 'stake' ? (
              <Trans>Cannot stake into {assetName} due to insufficient liquidity.</Trans>
            ) : (
              <Trans>There is currently no available liquidity to onramp BTC into {assetName}.</Trans>
            )}
          </P>
        </Alert>
      )}
      <Card background='grey-600' rounded='md'>
        <Dl direction='column' gap='none'>
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
            <Dd size='xs'>
              <Flex alignItems='center' elementType='span' gap='s'>
                {gateway.type === GatewayTransactionType.BRIDGE ? (
                  <AmountLabel amount={amount} hidePrice={hideAmountPrice} />
                ) : (
                  assetName || <Skeleton width='6xl' />
                )}
              </Flex>
            </Dd>
          </StyledDlGroup>
          {protocolFee && (
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
                  <AmountLabel amount={protocolFee} />
                </Flex>
              </Dd>
            </StyledDlGroup>
          )}
          {estimateFee && (
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
                  <AmountLabel amount={estimateFee} />
                </Flex>
              </Dd>
            </StyledDlGroup>
          )}
          {(settings.fee.rate || query.fee.rates.isPending) && (
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
                          )`The specified fee rate is very low and may significantly delay the confirmation of your transaction. If the fee is too low (e.g., 1 sat/vB), your transaction could get stuck in the mempool for an extended period. For faster confirmation, consider increasing the fee rate.`
                        : t(
                            i18n
                          )`The specified fee rate is higher than necessary and may result in overpaying. A lower fee rate could
                  still confirm your transaction within a reasonable time.`
                    }
                  >
                    <Warning color='yellow-500' size='s' />
                  </Tooltip>
                )}
                {query.fee.rates.isPending || !settings.fee.rate ? (
                  <Span size='xs'>
                    <Skeleton width='6xl' />
                  </Span>
                ) : (
                  <Tooltip isDisabled={!!btcAddress} label={t(i18n)`Connect BTC wallet to access fee rate settings.`}>
                    <UnstyledButton disabled={!btcAddress} onPress={() => setOpen(true)}>
                      <Flex alignItems='center' gap='xs'>
                        <Span size='xs'>{Math.ceil(settings.fee.rate)} sat/vB</Span>
                        <Cog color='grey-50' size='s' />
                      </Flex>
                    </UnstyledButton>
                  </Tooltip>
                )}
              </Flex>
            </StyledDlGroup>
          )}
        </Dl>
        {query.fee.rates.data && (
          <GatewayFeeSettingsModal
            feeRateData={query.fee.rates.data}
            isOpen={isOpen}
            selectedFee={settings.fee.selected}
            onChangeFee={settings.fee.setFee}
            onClose={() => setOpen(false)}
          />
        )}
      </Card>
    </Flex>
  );
};

export { GatewayTransactionDetails };
