import { Address } from 'viem';

import { FetchError } from '@/types/fetch';

type TokenType = 'ERC-20' | 'ERC-712' | 'ERC-1155';

interface BlockscoutToken {
  address: Address;
  circulating_market_cap: null;
  decimals: `${number}`;
  exchange_rate: null;
  holders: `${number}`;
  icon_url: null;
  name: string;
  symbol: string;
  total_supply: `${number}`;
  type: TokenType;
  volume_24h: null;
}

export interface BlockscoutTokenInfo {
  token: BlockscoutToken;
  token_id: null;
  token_instance: null;
  value: `${number}`;
}

class BlockscoutClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getTokenBalances(address: Address) {
    const response = await fetch(`${this.baseUrl}/addresses/${address}/token-balances`);

    return this.handleResponse<BlockscoutTokenInfo[]>(response);
  }

  async getTokens(address: Address, types: TokenType[] = ['ERC-20']) {
    const searchParams = new URLSearchParams(types.map((type) => ['type', type]));

    const response = await fetch(`${this.baseUrl}/addresses/${address}/tokens?${searchParams}`, {
      headers: {
        accept: 'application/json'
      }
    });

    return (await this.handleResponse<{ items: BlockscoutTokenInfo[] }>(response)).items;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const responseText = await response.text();

      throw new FetchError(`Error ${response.status}: ${response.statusText}`, response.status, responseText);
    }

    return response.json();
  }
}

export const blockscoutClient = new BlockscoutClient('/blockscout-api');
