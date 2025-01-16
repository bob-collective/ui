import type { NativeCurrency } from './evm/native-currency';
import type { Token } from './evm/token';

import { Bitcoin } from './bitcoin/currency';

export type EvmCurrencies = NativeCurrency | Token;

export type Currency = EvmCurrencies | Bitcoin;
