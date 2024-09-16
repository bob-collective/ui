import { GatewayStrategyContract } from '@gobob/bob-sdk';
import { ChainId } from '@gobob/chains';
import { ERC20Token, Ether, Token } from '@gobob/currency';
import { INTERVAL, useQuery } from '@gobob/react-query';
import { Flex } from '@gobob/ui';
import { useState } from 'react';

import { FeatureFlags, useFeatureFlag } from '../../../../hooks';
import { gatewaySDK } from '../../../../lib/bob-sdk';
import { bridgeKeys } from '../../../../lib/react-query';
import { GatewayData, L2BridgeData } from '../../../../types';
import { GatewayTransactionModal, StakeTransactionModal } from '../TransactionModal';
import { UnstakeForm } from '../UnstakeForm';

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
};

const StakingForm = ({ type = 'stake' }: BridgeFormProps): JSX.Element => {
  const isBtcGatewayEnabled = useFeatureFlag(FeatureFlags.BTC_GATEWAY);

  const [bridgeModalState, setBridgeModalState] = useState<TransactionModalState>({
    isOpen: false,
    step: 'confirmation'
  });
  const [gatewayModalState, setGatewayModalState] = useState<GatewayTransactionModalState>({
    isOpen: false,
    step: 'confirmation'
  });

  const { data: strategies = [] } = useQuery({
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
        {type === 'stake' ? (
          <BtcStakeForm
            // NOTE: no fallback if strategies are empty
            // key will indicate to react to rerender once strategies fetched
            key={strategies.length}
            strategies={strategies}
            type={type}
            onFailGateway={handleCloseGatewayModal}
            onGatewaySuccess={handleGatewaySuccess}
            onStartGateway={handleStartGateway}
          />
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

export { StakingForm, type StrategyData };
