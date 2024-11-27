'use client';

import { ChainId } from '@gobob/chains';
import { Token } from '@gobob/currency';
import { INTERVAL, useQuery } from '@gobob/react-query';
import { Alert, ArrowRight, Divider, Flex, RadioGroup } from '@gobob/ui';
import { useChainId } from '@gobob/wagmi';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Key, useCallback, useMemo, useState } from 'react';

import { BridgeTransactionModal, GatewayTransactionModal } from '../../../components';
import { BridgeOrigin } from '../../Bridge';
import { useGetTransactions } from '../../hooks';
import { ChainSelect } from '../ChainSelect';
import { ExternalBridgeForm } from '../ExternalBridgeForm';

import { BobBridgeForm } from './BobBridgeForm';
import { StyledChainsGrid, StyledRadio } from './BridgeForm.style';
import { BtcBridgeForm } from './BtcBridgeForm';

import { L1_CHAIN, L2_CHAIN } from '@/constants';
import { TokenData } from '@/hooks';
import { gatewaySDK } from '@/lib/bob-sdk';
import { bridgeKeys } from '@/lib/react-query';
import { BridgeTransaction, InitBridgeTransaction, InitGatewayTransaction, TransactionDirection } from '@/types';

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
  ticker?: string;
  bridgeOrigin?: BridgeOrigin;
  onChangeNetwork?: (network: Key) => void;
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
  ticker,
  chain,
  onChangeNetwork,
  onChangeOrigin,
  onChangeChain
}: BridgeFormProps): JSX.Element => {
  const { i18n } = useLingui();

  const { refetch: refetchTransactions, addPlaceholderTransaction } = useGetTransactions();

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
  };

  const handleBridgeSuccess = (data: BridgeTransaction) => {
    addPlaceholderTransaction.bridge(data);

    refetchTransactions.bridge();

    setBridgeModalState({ isOpen: true, data, step: 'submitted' });
  };

  const handleStartApproval = (data: InitBridgeTransaction) => {
    setBridgeModalState({ isOpen: true, data, step: 'approval' });
  };

  const handleCloseBridgeModal = () => {
    setBridgeModalState((s) => ({ ...s, isOpen: false }));
  };

  const handleStartGateway = (data: InitGatewayTransaction) => {
    setGatewayModalState({ isOpen: true, data });
  };

  const handleGatewaySuccess = (data: InitGatewayTransaction) => {
    refetchTransactions.gateway();

    setGatewayModalState({ isOpen: true, data });
  };

  const handleCloseGatewayModal = () => {
    setGatewayModalState((s) => ({ ...s, isOpen: false }));
  };

  const handleChangeNetwork = useCallback(
    (network: Key) => {
      const parsedNetwork = network === 'BTC' ? network : (Number(network) as ChainId);

      onChangeChain?.(parsedNetwork);

      onChangeNetwork?.(parsedNetwork);
    },
    [onChangeNetwork, onChangeChain]
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
          onSelectionChange: handleChangeNetwork,
          ['aria-label']: t(i18n)`select network to bridge from`
        }
      : undefined;

  const toChainSelectProps =
    direction === TransactionDirection.L2_TO_L1
      ? {
          value: chain.toString(),
          items: availableNetworks.map((chainId) => ({ id: chainId })),
          onSelectionChange: handleChangeNetwork,
          ['aria-label']: t(i18n)`select network to bridge to`
        }
      : undefined;

  const isBobBridgeDisabled =
    (direction === TransactionDirection.L1_TO_L2 && chain !== L1_CHAIN && chain !== 'BTC') ||
    (direction === TransactionDirection.L2_TO_L1 && chain !== L1_CHAIN);

  const isExternalBridgeDisabled = chain === 'BTC';

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
              Using the official bridge usually takes 7 days. For faster withdrawals we recommend using a 3rd Party
              bridge.
            </Trans>
          </Alert>
        )}
        {bridgeOrigin === BridgeOrigin.Internal ? (
          chain === 'BTC' ? (
            <BtcBridgeForm
              key={btcTokens?.length}
              availableTokens={btcTokens}
              onError={handleCloseGatewayModal}
              onStart={handleStartGateway}
              onSuccess={handleGatewaySuccess}
            />
          ) : (
            <BobBridgeForm
              direction={direction}
              ticker={ticker}
              onBridgeSuccess={handleBridgeSuccess}
              onFailBridge={handleCloseBridgeModal}
              onStartApproval={handleStartApproval}
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
