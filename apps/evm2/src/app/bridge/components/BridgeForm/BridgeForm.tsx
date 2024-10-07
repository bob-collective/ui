'use client';

import { ChainId } from '@gobob/chains';
import { Alert, ArrowRight, Divider, Flex, RadioGroup } from '@gobob/ui';
import { Key, useCallback, useMemo, useState } from 'react';
import { INTERVAL, useQuery } from '@gobob/react-query';
import { Token } from '@gobob/currency';
import { useChainId } from '@gobob/wagmi';

import { BridgeOrigin, Type } from '../../Bridge';
import { ChainSelect } from '../ChainSelect';
import { ExternalBridgeForm } from '../ExternalBridgeForm';

import { StyledChainsGrid, StyledRadio } from './BridgeForm.style';
import { BtcBridgeForm } from './BtcBridgeForm';
import { BobBridgeForm } from './BobBridgeForm';

import { L1_CHAIN, L2_CHAIN } from '@/constants';
import { FeatureFlags, TokenData, useFeatureFlag } from '@/hooks';
import { useGetTransactions } from '@/hooks';
import { L2BridgeData, GatewayData } from '@/types';
import { BridgeTransactionModal, GatewayTransactionModal } from '@/components';
import { gatewaySDK } from '@/lib/bob-sdk';
import { bridgeKeys } from '@/lib/react-query';

type TransactionModalState = {
  isOpen: boolean;
  step: 'approval' | 'confirmation' | 'submitted';
  data?: L2BridgeData;
};

type GatewayTransactionModalState = {
  isOpen: boolean;
  step: 'confirmation' | 'submitted';
  data?: GatewayData;
};

type BridgeFormProps = {
  chain: ChainId | 'BTC';
  type: Type;
  ticker?: string;
  bridgeOrigin?: BridgeOrigin;
  onChangeNetwork?: (network: Key) => void;
  onChangeOrigin?: (origin: BridgeOrigin) => void;
  onChangeChain?: (chain: ChainId | 'BTC') => void;
};

const allNetworks = [
  L1_CHAIN,
  'BTC',
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
  type = Type.Deposit,
  bridgeOrigin,
  ticker,
  chain,
  onChangeNetwork,
  onChangeOrigin,
  onChangeChain
}: BridgeFormProps): JSX.Element => {
  const isBtcGatewayEnabled = useFeatureFlag(FeatureFlags.BTC_GATEWAY);

  const { refetchBridgeTxs } = useGetTransactions();

  const [bridgeModalState, setBridgeModalState] = useState<TransactionModalState>({
    isOpen: false,
    step: 'confirmation'
  });
  const [gatewayModalState, setGatewayModalState] = useState<GatewayTransactionModalState>({
    isOpen: false,
    step: 'confirmation'
  });

  const chainId = useChainId();

  const { data: btcTokens } = useQuery({
    enabled: isBtcGatewayEnabled,
    queryKey: bridgeKeys.btcTokens(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: INTERVAL.HOUR,
    queryFn: async (): Promise<TokenData[]> => {
      const tokens = await gatewaySDK.getTokens();

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

  const handleStartBridge = (data: L2BridgeData) => {
    setBridgeModalState({ isOpen: true, data, step: 'confirmation' });
  };

  const handleBridgeSuccess = (data: L2BridgeData) => {
    refetchBridgeTxs();
    setBridgeModalState({ isOpen: true, data, step: 'submitted' });
  };

  const handleStartApproval = (data: L2BridgeData) => {
    setBridgeModalState({ isOpen: true, data, step: 'approval' });
  };

  const handleCloseModal = () => {
    setBridgeModalState((s) => ({ ...s, isOpen: false }));
  };

  const handleStartGateway = (data: GatewayData) => {
    setGatewayModalState({ isOpen: true, step: 'confirmation', data });
  };

  const handleGatewaySuccess = (data: GatewayData) => {
    setGatewayModalState({ isOpen: false, step: 'submitted', data });
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
    const isBtcNetworkAvailable = isBtcGatewayEnabled && type === Type.Deposit && !!btcTokens?.length;

    if (!isBtcNetworkAvailable) {
      return allNetworks.filter((network) => network !== 'BTC');
    }

    return allNetworks;
  }, [btcTokens?.length, isBtcGatewayEnabled, type]);

  const fromChainSelectProps =
    type === Type.Deposit
      ? {
          value: chain.toString(),
          items: availableNetworks.map((chainId) => ({ id: chainId })),
          onSelectionChange: handleChangeNetwork,
          ['aria-label']: 'select network to bridge from'
        }
      : undefined;

  const toChainSelectProps =
    type === Type.Withdraw
      ? {
          value: chain.toString(),
          items: availableNetworks.map((chainId) => ({ id: chainId })),
          onSelectionChange: handleChangeNetwork,
          ['aria-label']: 'select network to bridge to'
        }
      : undefined;

  const isBobBridgeDisabled =
    (type === Type.Deposit && chain !== L1_CHAIN && chain !== 'BTC') || (type === Type.Withdraw && chain !== L1_CHAIN);

  const isExternalBridgeDisabled = chain === 'BTC';

  return (
    <>
      <Flex direction='column' marginTop='2xl'>
        <StyledChainsGrid alignItems='center' gap={{ base: 'md', md: '2xl' }}>
          <ChainSelect chainId={type === Type.Deposit ? chain : L2_CHAIN} selectProps={fromChainSelectProps} />
          <ArrowRight size='xs' />
          <ChainSelect chainId={type === Type.Withdraw ? chain : L2_CHAIN} selectProps={toChainSelectProps} />
        </StyledChainsGrid>
        <Divider marginY='xl' />
        <RadioGroup
          aria-label='bridge network'
          gap='md'
          orientation='horizontal'
          value={bridgeOrigin}
          onValueChange={(value) => onChangeOrigin?.(value as BridgeOrigin)}
        >
          <StyledRadio isDisabled={isBobBridgeDisabled} value={BridgeOrigin.Internal}>
            BOB Bridge
          </StyledRadio>
          <StyledRadio isDisabled={isExternalBridgeDisabled} value={BridgeOrigin.External}>
            3rd Party
          </StyledRadio>
        </RadioGroup>
        {type === Type.Withdraw && bridgeOrigin === BridgeOrigin.Internal && (
          <Alert marginBottom='s' marginTop='xl' status='info' variant='outlined'>
            Using the official bridge usually takes 7 days. For faster withdrawals we recommend using a 3rd Party
            bridge.
          </Alert>
        )}
        {bridgeOrigin === BridgeOrigin.Internal ? (
          chain === 'BTC' && btcTokens?.length ? (
            <BtcBridgeForm
              key={btcTokens.length}
              availableTokens={btcTokens}
              type={type}
              onFailGateway={handleCloseGatewayModal}
              onGatewaySuccess={handleGatewaySuccess}
              onStartGateway={handleStartGateway}
            />
          ) : (
            <BobBridgeForm
              ticker={ticker}
              type={type}
              onBridgeSuccess={handleBridgeSuccess}
              // TODO: show error modal
              onFailBridge={handleCloseModal}
              onStartApproval={handleStartApproval}
              onStartBridge={handleStartBridge}
            />
          )
        ) : (
          <ExternalBridgeForm chain={chain} type={type} />
        )}
      </Flex>
      <BridgeTransactionModal
        {...(bridgeModalState.data as Required<L2BridgeData>)}
        isOpen={bridgeModalState.isOpen}
        step={bridgeModalState.step}
        onClose={handleCloseModal}
      />
      <GatewayTransactionModal
        {...(gatewayModalState.data as Required<GatewayData>)}
        isOpen={gatewayModalState.isOpen}
        onClose={handleCloseGatewayModal}
      />
    </>
  );
};

export { BridgeForm };
