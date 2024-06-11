import { EvmCurrency } from './currency';

/**
 * Represents the native currency of the chain on which it resides, e.g.
 */
export abstract class NativeCurrency extends EvmCurrency {
  public readonly isNative = true as const;

  public readonly isToken = false as const;
}
