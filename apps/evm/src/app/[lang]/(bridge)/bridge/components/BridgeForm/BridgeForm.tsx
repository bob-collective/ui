'use client';

import { ChainId } from '@gobob/chains';
import { Token } from '@gobob/currency';
import { Alert, ArrowRight, Divider, Flex, RadioGroup } from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useQuery } from '@tanstack/react-query';
import { Key, useCallback, useMemo, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { sendGAEvent } from '@next/third-parties/google';
import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';

import { BridgeTransactionModal, GatewayTransactionModal } from '../../../components';
import { BridgeOrigin } from '../../Bridge';
import { ChainSelect } from '../ChainSelect';
import { ExternalBridgeForm } from '../ExternalBridgeForm';

import { BobBridgeForm } from './BobBridgeForm';
import { StyledChainsGrid, StyledRadio } from './BridgeForm.style';
import { BtcBridgeForm } from './BtcBridgeForm';

import { INTERVAL, L1_CHAIN, L2_CHAIN } from '@/constants';
import { TokenData, useGetBridgeTransactions, useGetGatewayTransactions } from '@/hooks';
import { gatewaySDK } from '@/lib/bob-sdk';
import { bridgeKeys } from '@/lib/react-query';
import { BridgeTransaction, InitBridgeTransaction, InitGatewayTransaction, TransactionDirection } from '@/types';
import { gaEvents } from '@/lib/third-parties';
import { posthogEvents } from '@/lib/posthog';

type TransactionModalState = {
  isOpen: boolean;
} & (
  | { step: 'approval' | 'confirmation'; data?: InitBridgeTransaction }
  | { step: 'submitted'; data?: BridgeTransaction }
);

type GatewayTransactionModalState = {
  isOpen: boolean;
  data?: InitGatewayTransaction;
};

type BridgeFormProps = {
  chain: ChainId | 'BTC';
  direction: TransactionDirection;
  symbol?: string;
  bridgeOrigin?: BridgeOrigin;
  isBobBridgeDisabled?: boolean;
  isExternalBridgeDisabled?: boolean;
  onChangeSymbol: (symbol: string) => void;
  onChangeOrigin?: (origin: BridgeOrigin) => void;
  onChangeChain?: (chain: ChainId | 'BTC') => void;
};

const allNetworks = [
  'BTC',
  L1_CHAIN,
  ChainId.ARBITRUM_ONE,
  ChainId.BASE,
  ChainId.OP,
  ChainId.POLYGON,
  ChainId.POLYGON_ZKEVM,
  ChainId.BSC,
  ChainId.OPBNB,
  ChainId.MOONBEAM,
  ChainId.BITLAYER,
  ChainId.MERLIN
] as const;

const BridgeForm = ({
  direction = TransactionDirection.L1_TO_L2,
  bridgeOrigin,
  isBobBridgeDisabled,
  isExternalBridgeDisabled,
  chain,
  symbol,
  onChangeSymbol,
  onChangeOrigin,
  onChangeChain
}: BridgeFormProps): JSX.Element => {
  const { i18n } = useLingui();
  const { connector: satsConnector, address: btcAddress } = useSatsAccount();
  const { connector, address } = useAccount();

  const evmBridgePosthogEvents = direction === TransactionDirection.L1_TO_L2 ? 'deposit' : 'withdraw';

  const { refetch: refetchBridgeTransactions, addPlaceholderTransaction: addBridgePlaceholderTransaction } =
    useGetBridgeTransactions();
  const { refetch: refetchGatewayTransactions } = useGetGatewayTransactions();

  const [bridgeModalState, setBridgeModalState] = useState<TransactionModalState>({
    isOpen: false,
    step: 'confirmation'
  });
  const [gatewayModalState, setGatewayModalState] = useState<GatewayTransactionModalState>({
    isOpen: false
  });

  const chainId = useChainId();

  const { data: btcTokens } = useQuery({
    queryKey: bridgeKeys.btcTokens(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: INTERVAL.HOUR,
    queryFn: async (): Promise<TokenData[]> => {
      const tokens = await gatewaySDK.getTokens(false);

      return tokens.map((token) => ({
        raw: {
          chainId,
          address: token.address as `0x${string}`,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          logoUrl: token.logoURI,
          apiId: ''
        },
        currency: new Token(ChainId.BOB, token.address as `0x${string}`, token.decimals, token.symbol, token.name)
      }));
    }
  });

  const handleStartBridge = (data: InitBridgeTransaction) => {
    setBridgeModalState({ isOpen: true, data, step: 'confirmation' });

    posthogEvents.bridge.evm.initiated(evmBridgePosthogEvents, {
      ticker: data.amount.currency.symbol,
      amount: data.amount.toExact()
    });
  };

  const handleSuccessfulBridge = (data: BridgeTransaction) => {
    addBridgePlaceholderTransaction(data);

    refetchBridgeTransactions();

    setBridgeModalState({ isOpen: true, data, step: 'submitted' });

    sendGAEvent('event', gaEvents.evmBridge, {
      l1Token: data.l1Token,
      amount: data.amount?.toExact(),
      tx_id: JSON.stringify(data.transactionHash),
      evm_wallet: connector?.name
    });

    posthogEvents.bridge.evm.completed(evmBridgePosthogEvents);
  };

  const handleStartBridgeApproval = (data: InitBridgeTransaction) => {
    setBridgeModalState({ isOpen: true, data, step: 'approval' });

    posthogEvents.bridge.evm.approval(evmBridgePosthogEvents, {
      ticker: data.amount.currency.symbol,
      amount: data.amount.toExact()
    });
  };

  const handleCloseBridgeModal = () => {
    setBridgeModalState((s) => ({ ...s, isOpen: false }));
  };

  const handleFailedBridge = () => {
    handleCloseBridgeModal();

    posthogEvents.bridge.evm.failed(evmBridgePosthogEvents);
  };

  const handleStartGateway = (data: InitGatewayTransaction) => {
    setGatewayModalState({ isOpen: true, data });

    posthogEvents.bridge.btc.initiated('deposit', {
      ticker: data.amount?.currency.symbol as string,
      amount: data.amount?.toExact() as string
    });
  };

  const handleSuccessfulGateway = (data: InitGatewayTransaction) => {
    refetchGatewayTransactions();

    setGatewayModalState({ isOpen: true, data });

    sendGAEvent('event', gaEvents.btcBridge, {
      asset: data.assetName,
      amount: data.amount?.toExact(),
      tx_id: data.txId,
      evm_address: JSON.stringify(address),
      btc_address: btcAddress,
      btc_wallet: satsConnector?.name,
      evm_wallet: connector?.name
    });

    posthogEvents.bridge.btc.completed('deposit');
  };

  const handleCloseGatewayModal = () => {
    setGatewayModalState((s) => ({ ...s, isOpen: false }));
  };

  const handleFailedGateway = () => {
    handleCloseGatewayModal();

    posthogEvents.bridge.btc.failed('deposit');
  };

  const handleChangeChain = useCallback(
    (network: Key) => {
      const parsedNetwork = network === 'BTC' ? network : (Number(network) as ChainId);

      onChangeChain?.(parsedNetwork);
    },
    [onChangeChain]
  );

  const availableNetworks = useMemo(() => {
    const isBtcNetworkAvailable = direction === TransactionDirection.L1_TO_L2;

    if (!isBtcNetworkAvailable) {
      return allNetworks.filter((network) => network !== 'BTC');
    }

    return allNetworks;
  }, [direction]);

  const fromChainSelectProps =
    direction === TransactionDirection.L1_TO_L2
      ? {
          value: chain.toString(),
          items: availableNetworks.map((chainId) => ({ id: chainId })),
          onSelectionChange: handleChangeChain,
          ['aria-label']: t(i18n)`select network to bridge from`
        }
      : undefined;

  const toChainSelectProps =
    direction === TransactionDirection.L2_TO_L1
      ? {
          value: chain.toString(),
          items: availableNetworks.map((chainId) => ({ id: chainId })),
          onSelectionChange: handleChangeChain,
          ['aria-label']: t(i18n)`select network to bridge to`
        }
      : undefined;

  return (
    <>
      <Flex direction='column' marginTop='2xl'>
        <StyledChainsGrid alignItems='center' gap={{ base: 'md', md: '2xl' }}>
          <ChainSelect
            chainId={direction === TransactionDirection.L1_TO_L2 ? chain : L2_CHAIN}
            selectProps={fromChainSelectProps}
          />
          <ArrowRight size='xs' />
          <ChainSelect
            chainId={direction === TransactionDirection.L2_TO_L1 ? chain : L2_CHAIN}
            selectProps={toChainSelectProps}
          />
        </StyledChainsGrid>
        <Divider marginY='xl' />
        <RadioGroup
          aria-label={t(i18n)`bridge network`}
          gap='md'
          orientation='horizontal'
          value={bridgeOrigin}
          onValueChange={(value) => onChangeOrigin?.(value as BridgeOrigin)}
        >
          <StyledRadio isDisabled={isBobBridgeDisabled} value={BridgeOrigin.Internal}>
            <Trans>BOB Bridge</Trans>
          </StyledRadio>
          <StyledRadio isDisabled={isExternalBridgeDisabled} value={BridgeOrigin.External}>
            <Trans>3rd Party</Trans>
          </StyledRadio>
        </RadioGroup>
        {direction === TransactionDirection.L2_TO_L1 && bridgeOrigin === BridgeOrigin.Internal && (
          <Alert marginBottom='s' marginTop='xl' status='info' variant='outlined'>
            <Trans>
              Using the official bridge usually takes 7 days. For faster withdrawals we recommend using a 3rd party
              bridge for supported tokens (ETH, WBTC, USDT, USDC).
            </Trans>
          </Alert>
        )}
        {bridgeOrigin === BridgeOrigin.Internal ? (
          chain === 'BTC' ? (
            <BtcBridgeForm
              key={btcTokens?.length}
              availableTokens={btcTokens}
              symbol={symbol}
              onChangeSymbol={onChangeSymbol}
              onError={handleFailedGateway}
              onStart={handleStartGateway}
              onSuccess={handleSuccessfulGateway}
            />
          ) : (
            <BobBridgeForm
              direction={direction}
              symbol={symbol}
              onBridgeSuccess={handleSuccessfulBridge}
              onChangeSymbol={onChangeSymbol}
              onFailBridge={handleFailedBridge}
              onStartApproval={handleStartBridgeApproval}
              onStartBridge={handleStartBridge}
            />
          )
        ) : (
          <ExternalBridgeForm chain={chain} direction={direction} />
        )}
      </Flex>
      {bridgeModalState.data && (
        <BridgeTransactionModal
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={bridgeModalState.data as any}
          isOpen={bridgeModalState.isOpen}
          step={bridgeModalState.step}
          onClose={handleCloseBridgeModal}
        />
      )}
      {gatewayModalState.data && (
        <GatewayTransactionModal
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={gatewayModalState.data as any}
          isOpen={gatewayModalState.isOpen}
          onClose={handleCloseGatewayModal}
        />
      )}
    </>
  );
};

export { BridgeForm };
