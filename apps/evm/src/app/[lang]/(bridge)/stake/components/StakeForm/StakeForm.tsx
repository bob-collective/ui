'use client';

import { Flex } from '@gobob/ui';
import { useState } from 'react';

import { GatewayTransactionModal } from '../../../components';
import { Type } from '../../Stake';
import { StrategyData } from '../../hooks';
import { Unstake } from '../Unstake';

import { BtcStakeForm } from './BtcStakeForm';

import { GatewayData } from '@/types';
type GatewayTransactionModalState = {
  isOpen: boolean;
  data?: GatewayData;
};

type BridgeFormProps = {
  type: Type;
  strategies: StrategyData[] | undefined;
};

const StakingForm = ({ type = Type.Stake, strategies = [] }: BridgeFormProps): JSX.Element => {
  const [gatewayModalState, setGatewayModalState] = useState<GatewayTransactionModalState>({
    isOpen: false
  });

  const handleStartGateway = (data: GatewayData) => {
    setGatewayModalState({ isOpen: true, data });
  };

  const handleGatewaySuccess = (data: GatewayData) => {
    setGatewayModalState({ isOpen: true, data });
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
            onError={handleCloseGatewayModal}
            onStart={handleStartGateway}
            onSuccess={handleGatewaySuccess}
          />
        ) : (
          <Unstake type={type} />
        )}
      </Flex>
      {gatewayModalState.data && (
        <GatewayTransactionModal
          data={gatewayModalState.data}
          isOpen={gatewayModalState.isOpen}
          onClose={handleCloseGatewayModal}
        />
      )}
    </>
  );
};

export { StakingForm, type StrategyData };
