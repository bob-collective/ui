'use client';

import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import { useForm } from '@gobob/ui';
import Big from 'big.js';
import { useState } from 'react';
import { useAccount } from 'wagmi';

import { UseGatewayQueryDataReturnType } from './useGateway';

import { useIsContract } from '@/hooks';
import {
  BRIDGE_AMOUNT,
  BRIDGE_ASSET,
  BRIDGE_BTC_WALLET,
  BRIDGE_RECIPIENT,
  BridgeFormValidationParams,
  BridgeFormValues,
  bridgeSchema
} from '@/lib/form/bridge';
import { isFormDisabled } from '@/lib/form/utils';

type UseGatewayFormProps = {
  query: UseGatewayQueryDataReturnType;
  defaultAsset?: string;
  onSubmit: (data: BridgeFormValues) => void;
};

const useGatewayForm = ({ query, defaultAsset, onSubmit }: UseGatewayFormProps) => {
  const { address: evmAddress } = useAccount();

  const { isContract: isSmartAccount } = useIsContract({ address: evmAddress });

  const { address: btcAddress } = useSatsAccount();

  const params: BridgeFormValidationParams = {
    [BRIDGE_AMOUNT]: {
      minAmount: new Big(query.minAmount.toExact()),
      maxAmount: new Big(query.balance.toExact())
    },
    [BRIDGE_RECIPIENT]: !!isSmartAccount,
    [BRIDGE_BTC_WALLET]: btcAddress
  };

  const initialValues = {
    [BRIDGE_AMOUNT]: '',
    [BRIDGE_ASSET]: defaultAsset,
    [BRIDGE_RECIPIENT]: ''
  };

  const form = useForm<BridgeFormValues>({
    initialValues,
    validationSchema: bridgeSchema('stake', params),
    onSubmit,
    hideErrors: 'untouched'
  });

  const [prevData, setPrevData] = useState(query.fee.rates.data);

  if (prevData !== query.fee.rates.data) {
    setPrevData(query.fee.rates.data);

    if (query.fee.estimate.data && form.values[BRIDGE_AMOUNT]) {
      form.validateField(BRIDGE_AMOUNT);
    }
  }

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
