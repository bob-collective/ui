import { ChainId } from '@gobob/chains';
import { Alert, ArrowRight, Divider, Flex, RadioGroup } from '@gobob/ui';
import { Key, useCallback, useMemo, useState } from 'react';
import { INTERVAL, useQuery } from '@gobob/react-query';
import { Address, isAddressEqual } from 'viem';

import { L1_CHAIN, L2_CHAIN } from '../../../../constants';
import { FeatureFlags, useFeatureFlag, useTokens } from '../../../../hooks';
import { BridgeOrigin } from '../../Bridge';
import { useGetTransactions } from '../../hooks';
import { L2BridgeData, GatewayData } from '../../types';
import { ChainSelect } from '../ChainSelect';
import { ExternalBridgeForm } from '../ExternalBridgeForm';
import { BridgeTransactionModal, GatewayTransactionModal } from '../TransactionModal';
import { gatewaySDK } from '../../../../lib/bob-sdk';
import { bridgeKeys } from '../../../../lib/react-query';

import { BobBridgeForm } from './BobBridgeForm';
import { StyledChainsGrid, StyledRadio } from './BridgeForm.style';
import { BtcBridgeForm } from './BtcBridgeForm';

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
  type: 'deposit' | 'withdraw';
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
  type = 'deposit',
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

  const { data: tokens } = useTokens(L2_CHAIN);

  const { data: btcTokens } = useQuery({
    enabled: Boolean(tokens && isBtcGatewayEnabled),
    queryKey: bridgeKeys.btcTokens(),
    refetchInterval: INTERVAL.MINUTE,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const btcTokens = await gatewaySDK.getTokens();

      return tokens?.filter((token) =>
        btcTokens.find((btcToken) => isAddressEqual(btcToken.address as Address, token.raw.address))
      );
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
    setGatewayModalState({ isOpen: true, step: 'submitted', data });
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
    const isBtcNetworkAvailable = isBtcGatewayEnabled && type === 'deposit' && !!btcTokens?.length;

    if (!isBtcNetworkAvailable) {
      return allNetworks.filter((network) => network !== 'BTC');
    }

    return allNetworks;
  }, [btcTokens?.length, isBtcGatewayEnabled, type]);

  const fromChainSelectProps =
    type === 'deposit'
      ? {
          value: chain.toString(),
          items: availableNetworks.map((chainId) => ({ id: chainId })),
          onSelectionChange: handleChangeNetwork,
          ['aria-label']: 'select network to bridge from'
        }
      : undefined;

  const toChainSelectProps =
    type === 'withdraw'
      ? {
          value: chain.toString(),
          items: availableNetworks.map((chainId) => ({ id: chainId })),
          onSelectionChange: handleChangeNetwork,
          ['aria-label']: 'select network to bridge to'
        }
      : undefined;

  const isBobBridgeDisabled =
    (type === 'deposit' && chain !== L1_CHAIN && chain !== 'BTC') || (type === 'withdraw' && chain !== L1_CHAIN);

  const isExternalBridgeDisabled = chain === 'BTC';

  return (
    <>
      <Flex direction='column' marginTop='2xl'>
        <StyledChainsGrid alignItems='center' gap={{ base: 'md', md: '2xl' }}>
          <ChainSelect chainId={type === 'deposit' ? chain : L2_CHAIN} selectProps={fromChainSelectProps} />
          <ArrowRight size='xs' />
          <ChainSelect chainId={type === 'withdraw' ? chain : L2_CHAIN} selectProps={toChainSelectProps} />
        </StyledChainsGrid>
        <Divider marginY='xl' />
        <RadioGroup
          aria-label='bridge network'
          gap='md'
          orientation='horizontal'
          value={bridgeOrigin}
          onValueChange={(value) => onChangeOrigin?.(value as BridgeOrigin)}
        >
          <StyledRadio isDisabled={isBobBridgeDisabled} value={BridgeOrigin.INTERNAL}>
            BOB Bridge
          </StyledRadio>
          <StyledRadio isDisabled={isExternalBridgeDisabled} value={BridgeOrigin.EXTERNAL}>
            3rd Party
          </StyledRadio>
        </RadioGroup>
        {type === 'withdraw' && bridgeOrigin === BridgeOrigin.INTERNAL && (
          <Alert marginBottom='s' marginTop='xl' status='info' variant='outlined'>
            Using the official bridge usually takes 7 days. For faster withdrawals we recommend using a 3rd Party
            bridge.
          </Alert>
        )}
        {bridgeOrigin === BridgeOrigin.INTERNAL ? (
          chain === 'BTC' && btcTokens?.length ? (
            <BtcBridgeForm
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
