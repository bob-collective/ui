import { Address } from 'viem';

import { validateAndParseAddress } from './utils';
import { Token } from './token';

export class ERC20Token extends Token {
  public constructor(
    chainId: number,
    address: Address,
    decimals: number,
    symbol: string,
    name?: string,
    projectLink?: string
  ) {
    super(chainId, validateAndParseAddress(address), decimals, symbol, name, projectLink);
  }
}
