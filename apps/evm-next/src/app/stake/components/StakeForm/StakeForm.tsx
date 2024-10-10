'use client';

import { Flex } from '@gobob/ui';
import { useState } from 'react';
import { Optional } from '@gobob/react-query';

import { StrategyData } from '../../hooks';
import { Unstake } from '../Unstake';
import { Type } from '../../Stake';

import { BtcStakeForm } from './BtcStakeForm';

import { GatewayData, L2BridgeData } from '@/types';
import { GatewayTransactionModal, BridgeTransactionModal } from '@/components';

type TransactionModalState = {
  isOpen: boolean;
  step: 'approval' | 'confirmation' | 'submitted';
  data?: L2BridgeData;
};

type GatewayTransactionModalState = {
  isOpen: boolean;
  step: 'confirmation' | 'submitted';
  data?: Optional<GatewayData, 'amount'>;
};

type BridgeFormProps = {
  type: Type;
  strategies: StrategyData[] | undefined;
  strategy: StrategyData;
  onStrategyChange: (strategy: string) => void;
};

const StakingForm = ({
  type = Type.Stake,
  strategy,
  onStrategyChange,
  strategies = []
}: BridgeFormProps): JSX.Element => {
  const [bridgeModalState, setBridgeModalState] = useState<TransactionModalState>({
    isOpen: false,
    step: 'confirmation'
  });
  const [gatewayModalState, setGatewayModalState] = useState<GatewayTransactionModalState>({
    isOpen: false,
    step: 'confirmation'
  });

  const handleCloseModal = () => {
    setBridgeModalState((s) => ({ ...s, isOpen: false }));
  };

  const handleStartGateway = (data: Optional<GatewayData, 'amount'>) => {
    setGatewayModalState({ isOpen: true, step: 'confirmation', data });
  };

  const handleGatewaySuccess = (data: Optional<GatewayData, 'amount'>) => {
    setGatewayModalState({ isOpen: true, step: 'submitted', data });
  };

  const handleCloseGatewayModal = () => {
    setGatewayModalState((s) => ({ ...s, isOpen: false }));
  };

  return (
    <>
      <Flex direction='column' marginTop='2xl'>
        {type === Type.Stake ? (
          <BtcStakeForm
            strategies={strategies}
            strategy={strategy}
            type={type}
            onFailGateway={handleCloseGatewayModal}
            onGatewaySuccess={handleGatewaySuccess}
            onStartGateway={handleStartGateway}
            onStrategyChange={onStrategyChange}
          />
        ) : (
          <Unstake type={type} />
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

export { StakingForm, type StrategyData };
