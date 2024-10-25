'use client';

import { CurrencyAmount } from '@gobob/currency';
import { Optional, usePrices } from '@gobob/react-query';
import { BtcAddressType, useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import { BITCOIN } from '@gobob/tokens';
import { Alert, Avatar, Flex, Input, Item, P, Select, TokenInput, useForm } from '@gobob/ui';
import { useAccount, useIsContract } from '@gobob/wagmi';
import { mergeProps } from '@react-aria/utils';
import { useDebounceValue } from 'usehooks-ts';
import Big from 'big.js';
import { useEffect, useMemo } from 'react';
import { Address } from 'viem';
import { PellNetwork } from '@gobob/icons/src/PellNetwork';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { GatewayGasSwitch } from '../../../components/GatewayGasSwitch';
import { useGateway } from '../../../hooks';

import { StrategyData } from './StakeForm';

import { AuthButton } from '@/connect-ui';
import {
  STAKE_AMOUNT,
  STAKE_BTC_WALLET,
  STAKE_RECIPIENT,
  STAKE_STRATEGY,
  StakeFormValidationParams,
  StakeFormValues,
  stakeSchema
} from '@/lib/form/stake';
import { isFormDisabled } from '@/lib/form/utils';
import { GatewayData } from '@/types';
import { GatewayTransactionDetails } from '@/components';

type BtcBridgeFormProps = {
  strategy: StrategyData;
  strategies: StrategyData[];
  onStrategyChange: (strategy: string) => void;
  onStart: (data: Optional<GatewayData, 'amount'>) => void;
  onSuccess: (data: GatewayData) => void;
  onError: () => void;
};

const gasEstimatePlaceholder = CurrencyAmount.fromRawAmount(BITCOIN, 0n);

const BtcStakeForm = ({
  strategy,
  strategies,
  onStrategyChange,
  onStart,
  onSuccess,
  onError
}: BtcBridgeFormProps): JSX.Element => {
  const { i18n } = useLingui();

  const { address: evmAddress } = useAccount();

  const { isContract: isSmartAccount } = useIsContract({ address: evmAddress });

  const { address: btcAddress, addressType: btcAddressType } = useSatsAccount();

  const { getPrice } = usePrices({ baseUrl: process.env.NEXT_PUBLIC_MARKET_DATA_API });

  const [amount, setAmount] = useDebounceValue('', 300);

  const { balance, fee, isTopUpEnabled, liquidity, minAmount, mutation, quote, setTopUpEnabled } = useGateway({
    amount,
    toChain: strategy.raw.chain.chainId,
    toToken: strategy.raw.inputToken.address,
    strategyAddress: strategy.raw.address,
    onError,
    onMutate: onStart,
    onSuccess
  });

  useEffect(() => {
    if (!fee.amount || !form.values[STAKE_AMOUNT]) return;

    form.validateField(STAKE_AMOUNT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const params: StakeFormValidationParams = {
    [STAKE_AMOUNT]: {
      minAmount: new Big(minAmount.toExact()),
      maxAmount: new Big(balance.toExact())
    },
    [STAKE_RECIPIENT]: !!isSmartAccount,
    [STAKE_BTC_WALLET]: btcAddress
  };

  const initialValues = {
    [STAKE_AMOUNT]: '',
    [STAKE_STRATEGY]: strategy?.raw.integration.slug,
    [STAKE_RECIPIENT]: ''
  };

  const handleSubmit = async (data: StakeFormValues) => {
    if (!quote || !evmAddress) return;

    mutation.mutate({
      evmAddress: (data[STAKE_RECIPIENT] as Address) || evmAddress
    });
  };

  const form = useForm<StakeFormValues>({
    initialValues,
    validationSchema: stakeSchema(params),
    onSubmit: handleSubmit,
    hideErrors: 'untouched'
  });

  const btcPrice = getPrice('BTC');

  const valueUSD = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => (!isNaN(amount as any) ? new Big(amount || 0).mul(btcPrice || 0).toNumber() : 0),
    [amount, btcPrice]
  );

  const isSubmitDisabled = isFormDisabled(form);

  const isTapRootAddress = btcAddressType === BtcAddressType.p2tr;

  const isDisabled =
    isSubmitDisabled ||
    !quote ||
    !!quote.error ||
    isTapRootAddress ||
    liquidity.isLoading ||
    !liquidity.data?.hasLiquidity ||
    fee.isLoading;

  const isLoading = !isSubmitDisabled && (mutation.isPending || quote.isPending);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Flex direction='column' elementType='form' gap='xl' marginTop='md' onSubmit={form.handleSubmit as any}>
      <TokenInput
        balance={balance.toExact()}
        balanceHelper={t(
          i18n
        )`Your available balance may differ from your wallet balance due to network fees and available liquidity`}
        currency={BITCOIN}
        label={t(i18n)`Amount`}
        logoUrl='https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png'
        valueUSD={valueUSD}
        {...mergeProps(form.getTokenFieldProps(STAKE_AMOUNT), {
          onValueChange: (value: string) => setAmount(value)
        })}
      />
      <Select<StrategyData>
        items={strategies}
        label={t(i18n)`Stake with`}
        modalProps={{ title: <Trans>Select Strategy</Trans>, size: 'xs' }}
        size='lg'
        type='modal'
        {...mergeProps(form.getSelectFieldProps(STAKE_STRATEGY), {
          onSelectionChange: (value: string) => onStrategyChange(value)
        })}
      >
        {(data) => (
          <Item key={data.raw.integration.slug} textValue={data.raw.integration.name}>
            <Flex alignItems='center' gap='s'>
              {data.raw.integration.logo ? <Avatar size='2xl' src={data.raw.integration.logo} /> : <PellNetwork />}
              <P style={{ color: 'inherit' }}>{data.raw.integration.name}</P>
            </Flex>
          </Item>
        )}
      </Select>
      <GatewayGasSwitch isSelected={isTopUpEnabled} onChange={(e) => setTopUpEnabled(e.target.checked)} />
      {isSmartAccount && (
        <Input
          label={<Trans>Recipient</Trans>}
          placeholder={t(i18n)`Enter destination address`}
          {...form.getFieldProps(STAKE_RECIPIENT)}
        />
      )}
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
      {!!quote.error && (
        <Alert status='warning'>
          <P size='s'>
            <Trans>
              BTC bridge is currently unavailable. This may be due to: {quote.error.message}. Please try again later.
            </Trans>
          </P>
        </Alert>
      )}
      {!liquidity.data?.hasLiquidity && !liquidity.isLoading && strategies.length > 0 && (
        <Alert status='warning'>
          <P size='s'>
            <Trans>Cannot stake into {strategy?.raw.integration.name} due to insufficient liquidity.</Trans>
          </P>
        </Alert>
      )}
      <GatewayTransactionDetails
        feeRate={fee.rate}
        feeRateData={fee.rateData}
        gatewayFee={quote?.data?.protocolFee || gasEstimatePlaceholder}
        isLoadingFeeRate={fee.isLoading}
        networkFee={fee.amount || gasEstimatePlaceholder}
        selectedFee={fee.selectedFee}
        onChangeFee={fee.setSelectedFee}
      />
      <AuthButton isBtcAuthRequired color='primary' disabled={isDisabled} loading={isLoading} size='xl' type='submit'>
        <Trans>Stake</Trans>
      </AuthButton>
    </Flex>
  );
};

export { BtcStakeForm };
