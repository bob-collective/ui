import { GatewayStrategyContract } from '@gobob/bob-sdk';
import { ChainId } from '@gobob/chains';
import { ERC20Token, Ether, Token } from '@gobob/currency';
import { INTERVAL, useQuery } from '@gobob/react-query';
import { Alert, Flex } from '@gobob/ui';
import { Key, useState } from 'react';

import { FeatureFlags, useFeatureFlag } from '../../../../hooks';
import { gatewaySDK } from '../../../../lib/bob-sdk';
import { bridgeKeys } from '../../../../lib/react-query';
import { StakeOrigin } from '../../Stake';
import { useGetTransactions } from '../../hooks';
import { GatewayData, L2BridgeData } from '../../types';
import { GatewayTransactionModal, StakeTransactionModal } from '../TransactionModal';
import { UnstakeForm } from '../UnstakeForm';

import { BobStakeForm } from './BobStakeForm';
import { BtcStakeForm } from './BtcStakeForm';

type StrategyData = {
  raw: GatewayStrategyContract;
  currency: Ether | ERC20Token;
};

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
  type: 'stake' | 'unstake';
  ticker?: string;
  stakeOrigin?: StakeOrigin;
  onChangeNetwork?: (network: Key) => void;
  onChangeOrigin?: (origin: StakeOrigin) => void;
  onChangeChain?: (chain: ChainId | 'BTC') => void;
};

const StakingForm = ({ type = 'stake', stakeOrigin, ticker }: BridgeFormProps): JSX.Element => {
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

  const { data: strategies } = useQuery({
    enabled: isBtcGatewayEnabled,
    queryKey: bridgeKeys.strategies(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: INTERVAL.HOUR,
    queryFn: async (): Promise<StrategyData[]> => {
      const strategies = await gatewaySDK.getStrategies();

      return strategies.reduce<StrategyData[]>((acc, strategy) => {
        const token = strategy.outputToken;

        if (token !== null) {
          acc.push({
            raw: strategy,
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
        {type === 'unstake' && stakeOrigin === StakeOrigin.INTERNAL && (
          <Alert marginBottom='s' marginTop='xl' status='info' variant='outlined'>
            Using the official bridge usually takes 7 days. For faster withdrawals we recommend using a 3rd Party
            bridge.
          </Alert>
        )}
        {stakeOrigin === StakeOrigin.INTERNAL ? (
          strategies?.length ? (
            <BtcStakeForm
              strategies={strategies}
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
          <UnstakeForm type={type} />
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
export { type StrategyData };
