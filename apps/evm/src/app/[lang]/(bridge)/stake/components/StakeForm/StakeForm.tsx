'use client';

import { useState } from 'react';
import { sendGAEvent } from '@next/third-parties/google';
import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';

import { GatewayTransactionModal } from '../../../components';
import { StrategyData } from '../../hooks';
import { StakingInfo } from '../../../utils/stakeData';

import { StyledFlex } from './StakeForm.style';
import { BtcStakeForm } from './BtcStakeForm';

import { InitGatewayTransaction } from '@/types';

type GatewayTransactionModalState = {
  isOpen: boolean;
  data?: InitGatewayTransaction;
};

type BridgeFormProps = {
  strategy: StrategyData;
  stakingInfo: StakingInfo;
  onStakeSuccess?: () => void;
};

const StakingForm = ({ strategy, stakingInfo, onStakeSuccess }: BridgeFormProps): JSX.Element => {
  const { connector } = useSatsAccount();
  const [gatewayModalState, setGatewayModalState] = useState<GatewayTransactionModalState>({
    isOpen: false
  });

  const handleStartGateway = (data: InitGatewayTransaction) => {
    setGatewayModalState({ isOpen: true, data });
  };

  const handleGatewaySuccess = (data: InitGatewayTransaction) => {
    onStakeSuccess?.();
    setGatewayModalState({ isOpen: true, data });
    sendGAEvent('event', 'btc_stake', {
      asset: data.assetName,
      amount: data.amount?.toExact(),
      tx_id: data.txId,
      wallet: connector?.name
    });
  };

  const handleCloseGatewayModal = () => {
    setGatewayModalState((s) => ({ ...s, isOpen: false }));
  };

  return (
    <>
      <StyledFlex direction='column' flex={1}>
        <BtcStakeForm
          stakingInfo={stakingInfo}
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
