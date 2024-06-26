import { ChainId } from '@gobob/chains';
import { TBTC } from '@gobob/tokens';
import { ArrowRight, Divider, Flex, InformationCircle, P, RadioGroup } from '@gobob/ui';
import { Key, useCallback, useMemo, useState } from 'react';

import { L1_CHAIN, L2_CHAIN } from '../../../../constants';
import { FeatureFlags, useFeatureFlag, useTokens } from '../../../../hooks';
import { BridgeOrigin } from '../../Bridge';
import { StyledCard } from '../../Bridge.style';
import { useGetTransactions } from '../../hooks';
import { L2BridgeData, OnRampData } from '../../types';
import { ChainSelect } from '../ChainSelect';
import { ExternalBridgeForm } from '../ExternalBridgeForm';
import { BridgeTransactionModal, OnRampTransactionModal } from '../TransactionModal';

import { BobBridgeForm } from './BobBridgeForm';
import { StyledRadio } from './BridgeForm.style';
import { BtcBridgeForm } from './BtcBridgeForm';

type TransactionModalState = {
  isOpen: boolean;
  step: 'approval' | 'confirmation' | 'submitted';
  data?: L2BridgeData;
};

type OnRampTransactionModalState = {
  isOpen: boolean;
  step: 'confirmation' | 'submitted';
  data?: OnRampData;
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
  ChainId.MOONBEAM
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
  const isBtcOnRampEnabled = useFeatureFlag(FeatureFlags.BTC_ONRAMP);

  const { refetchBridgeTxs } = useGetTransactions();

  const [bridgeModalState, setBridgeModalState] = useState<TransactionModalState>({
    isOpen: false,
    step: 'confirmation'
  });
  const [onRampModalState, setOnRampModalState] = useState<OnRampTransactionModalState>({
    isOpen: false,
    step: 'confirmation'
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

  const handleStartOnRamp = (data: OnRampData) => {
    setOnRampModalState({ isOpen: true, step: 'confirmation', data });
  };

  const handleOnRampSuccess = (data: OnRampData) => {
    setOnRampModalState({ isOpen: true, step: 'submitted', data });
  };

  const handleCloseOnRampModal = () => {
    setOnRampModalState((s) => ({ ...s, isOpen: false }));
  };

  const handleChangeNetwork = useCallback(
    (network: Key) => {
      const parsedNetwork = network === 'BTC' ? network : (Number(network) as ChainId);

      onChangeChain?.(parsedNetwork);

      onChangeNetwork?.(parsedNetwork);
    },
    [onChangeNetwork, onChangeChain]
  );

  const { data: tokens } = useTokens(L2_CHAIN);

  const btcTokens = useMemo(
    () =>
      tokens?.filter(
        (token) => token.currency.symbol === TBTC[L2_CHAIN].symbol || token.currency.symbol === WBTC[L2_CHAIN].symbol
      ),
    [tokens]
  );

  const availableNetworks = useMemo(() => {
    const isBtcNetworkAvailable = isBtcOnRampEnabled && type === 'deposit' && !!btcTokens?.length;

    if (!isBtcNetworkAvailable) {
      return allNetworks.filter((network) => network !== 'BTC');
    }

    return allNetworks;
  }, [btcTokens?.length, isBtcOnRampEnabled, type]);

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
        <Flex alignItems='center' gap={{ base: 'md', md: '2xl' }}>
          <ChainSelect chainId={type === 'deposit' ? chain : L2_CHAIN} selectProps={fromChainSelectProps} />
          <ArrowRight size='xs' />
          <ChainSelect chainId={type === 'withdraw' ? chain : L2_CHAIN} selectProps={toChainSelectProps} />
        </Flex>
        <Divider marginY='xl' />
        <RadioGroup
          aria-label='bridge network'
          gap='md'
          orientation='horizontal'
          value={bridgeOrigin}
          onValueChange={(value) => onChangeOrigin?.(value as BridgeOrigin)}
        >
          <StyledRadio
            $isSelected={bridgeOrigin === BridgeOrigin.INTERNAL}
            isDisabled={isBobBridgeDisabled}
            value={BridgeOrigin.INTERNAL}
          >
            BOB Bridge
          </StyledRadio>
          <StyledRadio
            $isSelected={bridgeOrigin === BridgeOrigin.EXTERNAL}
            isDisabled={isExternalBridgeDisabled}
            value={BridgeOrigin.EXTERNAL}
          >
            3rd Party
          </StyledRadio>
        </RadioGroup>
        {type === 'withdraw' && bridgeOrigin === BridgeOrigin.INTERNAL && (
          <StyledCard alignItems='center' direction='row' gap='md' marginTop='2xl'>
            <InformationCircle />
            <P size='s' weight='semibold'>
              Using the official bridge usually takes 7 days. For faster withdrawals we recommend using a 3rd Party
              bridge.
            </P>
          </StyledCard>
        )}
        {bridgeOrigin === BridgeOrigin.INTERNAL ? (
          chain === 'BTC' && btcTokens?.length ? (
            <BtcBridgeForm
              availableTokens={btcTokens}
              type={type}
              onFailOnRamp={handleCloseOnRampModal}
              onOnRampSuccess={handleOnRampSuccess}
              onStartOnRamp={handleStartOnRamp}
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
          <ExternalBridgeForm type={type} />
        )}
      </Flex>
      <BridgeTransactionModal
        {...(bridgeModalState.data as Required<L2BridgeData>)}
        isOpen={bridgeModalState.isOpen}
        step={bridgeModalState.step}
        onClose={handleCloseModal}
      />
      <OnRampTransactionModal
        {...(onRampModalState.data as Required<OnRampData>)}
        isOpen={onRampModalState.isOpen}
        onClose={handleCloseOnRampModal}
      />
    </>
  );
};

export { BridgeForm };
