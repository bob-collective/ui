'use client';

import { Flex } from '@gobob/ui';
import { useState } from 'react';

import { GatewayTransactionModal } from '../../../components';
import { StrategyData } from '../../hooks';
import { Unstake } from '../Unstake';

import { BtcStakeForm } from './BtcStakeForm';

import { InitGatewayTransaction, TransactionDirection } from '@/types';

type GatewayTransactionModalState = {
  isOpen: boolean;
  data?: InitGatewayTransaction;
};

type BridgeFormProps = {
  direction: TransactionDirection;
  strategies: StrategyData[] | undefined;
  onStakeSuccess?: () => void;
};

const StakingForm = ({ direction, strategies = [], onStakeSuccess }: BridgeFormProps): JSX.Element => {
  const [gatewayModalState, setGatewayModalState] = useState<GatewayTransactionModalState>({
    isOpen: false
  });

  const handleStartGateway = (data: InitGatewayTransaction) => {
    setGatewayModalState({ isOpen: true, data });
  };

  const handleGatewaySuccess = (data: InitGatewayTransaction) => {
    onStakeSuccess?.();
    setGatewayModalState({ isOpen: true, data });
  };

  const handleCloseGatewayModal = () => {
    setGatewayModalState((s) => ({ ...s, isOpen: false }));
  };

  return (
    <>
      <Flex direction='column' marginTop='2xl'>
        {direction === TransactionDirection.L1_TO_L2 ? (
          <BtcStakeForm
            strategies={strategies}
            onError={handleCloseGatewayModal}
            onStart={handleStartGateway}
            onSuccess={handleGatewaySuccess}
          />
        ) : (
          <Unstake />
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
