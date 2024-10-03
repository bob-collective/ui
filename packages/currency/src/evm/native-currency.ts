import { EvmCurrency } from './currency';

/**
 * Represents the native currency of the chain on which it resides, e.g.
 */
export abstract class NativeCurrency extends EvmCurrency {
  public readonly isNative = true as const;

  public readonly isToken = false as const;

  public readonly address: `0x${string}`;

  public constructor(
    chainId: number,
    decimals: number,
    symbol: string,
    address: `0x${string}` = '0x0000000000000000000000000000000000000000',
    name?: string
  ) {
    super(chainId, decimals, symbol, name);
    this.address = address;
  }
}
