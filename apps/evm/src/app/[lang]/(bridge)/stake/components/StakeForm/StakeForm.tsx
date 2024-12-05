'use client';

import { useState } from 'react';

import { GatewayTransactionModal } from '../../../components';
import { StrategyData } from '../../hooks';

import { StyledFlex } from './StakeForm.style';
import { BtcStakeForm } from './BtcStakeForm';

import { InitGatewayTransaction } from '@/types';

type GatewayTransactionModalState = {
  isOpen: boolean;
  data?: InitGatewayTransaction;
};

type BridgeFormProps = {
  strategy: StrategyData;
  onStakeSuccess?: () => void;
};

const StakingForm = ({ strategy, onStakeSuccess }: BridgeFormProps): JSX.Element => {
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
      <StyledFlex direction='column'>
        <BtcStakeForm
          strategy={strategy}
          onError={handleCloseGatewayModal}
          onStart={handleStartGateway}
          onSuccess={handleGatewaySuccess}
        />
      </StyledFlex>
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
