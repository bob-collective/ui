import { ChainId } from '@gobob/chains';
import { Token } from '@gobob/currency';
import { INTERVAL, useQuery } from '@gobob/react-query';
import { Alert, Flex } from '@gobob/ui';
import { Key, useState } from 'react';
import { useChainId } from '@gobob/wagmi';

import { FeatureFlags, TokenData, useFeatureFlag } from '../../../../hooks';
import { gatewaySDK } from '../../../../lib/bob-sdk';
import { bridgeKeys } from '../../../../lib/react-query';
import { StakeOrigin } from '../../Stake';
import { useGetTransactions } from '../../hooks';
import { GatewayData, L2BridgeData } from '../../types';
import { UnstakeForm } from '../UnstakeForm';
import { StakeTransactionModal, GatewayTransactionModal } from '../TransactionModal';

import { BobStakeForm } from './BobStakeForm';
import { BtcStakeForm } from './BtcStakeForm';

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
  type: 'stake' | 'unstake';
  ticker?: string;
  stakeOrigin?: StakeOrigin;
  onChangeNetwork?: (network: Key) => void;
  onChangeOrigin?: (origin: StakeOrigin) => void;
  onChangeChain?: (chain: ChainId | 'BTC') => void;
};

const StakingForm = ({ type = 'stake', stakeOrigin: bridgeOrigin, ticker, chain }: BridgeFormProps): JSX.Element => {
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
      const strategies = await gatewaySDK.getStrategies();

      return strategies.reduce<TokenData[]>((acc, strategy) => {
        const token = strategy.outputToken;

        if (token !== null) {
          acc.push({
            raw: {
              chainId,
              address: token.address as `0x${string}`,
              name: token.symbol,
              symbol: token.symbol,
              decimals: token.decimals,
              logoUrl: token.logo,
              apiId: ''
            },
            currency: new Token(ChainId.BOB, token.address as `0x${string}`, token.decimals, token.symbol, token.symbol)
          });
        }

        return acc;
      }, []);
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

  return (
    <>
      <Flex direction='column' marginTop='2xl'>
        {type === 'unstake' && bridgeOrigin === StakeOrigin.INTERNAL && (
          <Alert marginBottom='s' marginTop='xl' status='info' variant='outlined'>
            Using the official bridge usually takes 7 days. For faster withdrawals we recommend using a 3rd Party
            bridge.
          </Alert>
        )}
        {bridgeOrigin === StakeOrigin.INTERNAL ? (
          btcTokens?.length ? (
            <BtcStakeForm
              availableTokens={btcTokens}
              type={type}
              onFailGateway={handleCloseGatewayModal}
              onGatewaySuccess={handleGatewaySuccess}
              onStartGateway={handleStartGateway}
            />
          ) : (
            <BobStakeForm
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
          <UnstakeForm chain={chain} type={type} />
        )}
      </Flex>
      <StakeTransactionModal
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

export { StakingForm };
