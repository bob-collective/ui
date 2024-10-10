import { Currency, CurrencyAmount } from '@gobob/currency';
import Big from 'big.js';

const calculateAmountUSD = (amount: CurrencyAmount<Currency>, price: number) =>
  new Big(amount.toExact()).mul(price || 0).toNumber() || 0;

export { calculateAmountUSD };
