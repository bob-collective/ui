/* eslint-disable no-invalid-this */
import Big from 'big.js';
import * as yup from 'yup';
import { AnyObject, Maybe } from 'yup/lib/types';
import { isValidBTCAddress, BitcoinNetwork } from '@gobob/utils';
import { isAddress } from 'viem';

yup.addMethod<yup.StringSchema>(yup.string, 'requiredAmount', function (action: string, customMessage?: string) {
  return this.transform((value) => (isNaN(value) ? undefined : value)).test('requiredAmount', (value, ctx) => {
    if (value === undefined) {
      const message = customMessage || `Please enter the amount to ${action}`;

      return ctx.createError({ message });
    }

    return true;
  });
});

type MaxAmountValidationParams = {
  maxAmount: Big;
};

yup.addMethod<yup.StringSchema>(
  yup.string,
  'maxAmount',
  function ({ maxAmount }: MaxAmountValidationParams, action?: string, customMessage?: string) {
    return this.test('maxAmount', (value, ctx) => {
      if (value === undefined) return true;

      const amount = new Big(value);

      if (amount.gt(maxAmount)) {
        const message = customMessage || `Amount to ${action} must be at most ${maxAmount.toFixed()}`;

        return ctx.createError({ message });
      }

      return true;
    });
  }
);

type MinAmountValidationParams = {
  minAmount?: Big;
};

yup.addMethod<yup.StringSchema>(
  yup.string,
  'minAmount',
  function ({ minAmount }: MinAmountValidationParams = {}, action: string, customMessage?: string) {
    return this.test('balance', (value, ctx) => {
      if (value === undefined) return true;

      const amount = new Big(value);

      if (!minAmount && !amount.gt(0)) {
        const message = customMessage || `Amount to ${action} must be greater than 0`;

        return ctx.createError({ message });
      }

      if (minAmount && amount.lt(minAmount)) {
        const message = customMessage || `Amount to ${action} must be at least ${minAmount.toFixed()}`;

        return ctx.createError({ message });
      }

      return true;
    });
  }
);

yup.addMethod<yup.StringSchema>(
  yup.string,
  'btcWalletConnected',
  function (btcAddress: string, customMessage?: string) {
    return this.test('btcWalletConnected', (_, ctx) => {
      if (!btcAddress) {
        const message = customMessage || 'Bitcoin wallet not connected';

        return ctx.createError({ message });
      }

      return true;
    });
  }
);

yup.addMethod<yup.StringSchema>(yup.string, 'btcAddress', function (network: BitcoinNetwork, customMessage?: string) {
  return this.test('btcAddress', (value, ctx) => {
    if (!value || !isValidBTCAddress(value, network)) {
      const message = customMessage || 'Please enter a valid address';

      return ctx.createError({ message });
    }

    return true;
  });
});

yup.addMethod<yup.StringSchema>(yup.string, 'evmAddress', function (customMessage?: string) {
  return this.test('evmAddress', (value, ctx) => {
    if (!value || !isAddress(value)) {
      const message = customMessage || 'Please enter a valid address';

      return ctx.createError({ message });
    }

    return true;
  });
});

declare module 'yup' {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    requiredAmount(action?: string, customMessage?: string): StringSchema<TType, TContext>;
    maxAmount(
      params: MaxAmountValidationParams,
      action?: string,
      customMessage?: string
    ): StringSchema<TType, TContext>;
    minAmount(
      params: MinAmountValidationParams,
      action?: string,
      customMessage?: string
    ): StringSchema<TType, TContext>;
    btcWalletConnected(address?: string, customMessage?: string): StringSchema<TType, TContext>;
    btcAddress(network: BitcoinNetwork, customMessage?: string): StringSchema<TType, TContext>;
    evmAddress(customMessage?: string): StringSchema<TType, TContext>;
  }
}

export default yup;
export type { MaxAmountValidationParams, MinAmountValidationParams };
