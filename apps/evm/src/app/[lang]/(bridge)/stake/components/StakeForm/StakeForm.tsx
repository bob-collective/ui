'use client';

import { useState } from 'react';
import { sendGAEvent } from '@next/third-parties/google';
import { useUserWallets } from '@dynamic-labs/sdk-react-core';

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
  const userWallets = useUserWallets();

  const handleStartGateway = (data: InitGatewayTransaction) => {
    setGatewayModalState({ isOpen: true, data });
  };

  const handleGatewaySuccess = (data: InitGatewayTransaction) => {
    onStakeSuccess?.();
    setGatewayModalState({ isOpen: true, data });

    const btcWallet = userWallets.find((wallet) => wallet.chain === 'BTC');
    const evmWallet = userWallets.find((wallet) => wallet.chain === 'EVM');

    sendGAEvent('event', 'btc-stake', {
      payload: {
        // `_connector` is a circular structure -- has to be removed
        btcWallet: { ...btcWallet, _connector: undefined },
        evmWallet: { ...evmWallet, _connector: undefined },
        data
      }
    });
  };

  const handleCloseGatewayModal = () => {
    setGatewayModalState((s) => ({ ...s, isOpen: false }));
  };

  return (
    <>
      <StyledFlex direction='column' flex={1}>
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
