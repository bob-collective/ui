'use client';

import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import { useForm } from '@gobob/ui';
import Big from 'big.js';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

import { UseGatewayQueryDataReturnType } from './useGateway';

import { useIsContract } from '@/hooks';
import {
  BRIDGE_AMOUNT,
  BRIDGE_ASSET,
  BRIDGE_BTC_WALLET,
  BRIDGE_EVM_WALLET,
  BRIDGE_RECIPIENT,
  BridgeFormValidationParams,
  BridgeFormValues,
  bridgeSchema
} from '@/lib/form/bridge';
import { isFormDisabled } from '@/lib/form/utils';
import { GatewayTransactionType } from '@/types';

type UseGatewayFormProps = {
  type: GatewayTransactionType;
  query: UseGatewayQueryDataReturnType;
  defaultAsset?: string;
  onSubmit: (data: BridgeFormValues) => void;
};

const useGatewayForm = ({ type, query, defaultAsset, onSubmit }: UseGatewayFormProps) => {
  const { address: evmAddress } = useAccount();

  const { isContract: isSmartAccount } = useIsContract({ address: evmAddress });

  const { address: btcAddress } = useSatsAccount();

  useEffect(() => {
    if (!query.fee.estimate.data || !form.values[BRIDGE_AMOUNT]) return;

    form.validateField(BRIDGE_AMOUNT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.fee.rates.data]);

  const params: BridgeFormValidationParams = {
    [BRIDGE_AMOUNT]: {
      minAmount: new Big(query.minAmount.toExact()),
      maxAmount: new Big(query.balance.data.toExact())
    },
    [BRIDGE_RECIPIENT]: !!isSmartAccount,
    [BRIDGE_BTC_WALLET]: btcAddress,
    [BRIDGE_EVM_WALLET]: evmAddress
  };

  const initialValues = {
    [BRIDGE_AMOUNT]: '',
    [BRIDGE_ASSET]: defaultAsset,
    [BRIDGE_RECIPIENT]: ''
  };

  const form = useForm<BridgeFormValues>({
    initialValues,
    validationSchema: bridgeSchema(type, params),
    onSubmit,
    hideErrors: 'untouched'
  });

  useEffect(() => {
    form.setFieldValue(BRIDGE_ASSET, defaultAsset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAsset]);

  return {
    isDisabled: isFormDisabled(form),
    form,
    fields: {
      recipient: isSmartAccount ? form.getFieldProps(BRIDGE_RECIPIENT) : undefined,
      amount: form.getTokenFieldProps(BRIDGE_AMOUNT),
      asset: form.getSelectFieldProps(BRIDGE_ASSET)
    }
  };
};

export { useGatewayForm };
