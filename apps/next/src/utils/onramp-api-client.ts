import { Address } from 'viem';

type OnRampQuote = {
  onramp_address: Address;
  dust_threshold: number;
  satoshis: number;
  fee: number;
  gratuity: string;
  bitcoin_address: string;
  tx_proof_difficulty_factor: number;
};

type OnRampOrderResponse = {
  onramp_address: Address;
  token_address: Address;
  txid: string;
  status: boolean;
  timestamp: number;
  tokens: string;
  satoshis: number;
  fee: number;
  tx_proof_difficulty_factor: number;
};

class OnRampApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getQuote(address: string, atomicAmount: number | string): Promise<OnRampQuote> {
    const response = await fetch(`${this.baseUrl}/quote/${address}/${atomicAmount}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    return await response.json();
  }

  // TODO: add error handling
  async createOrder(contractAddress: string, userAddress: Address, atomicAmount: number | string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ onramp_address: contractAddress, user_address: userAddress, satoshis: atomicAmount })
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return await response.json();
  }

  async updateOrder(id: string, tx: string) {
    const response = await fetch(`${this.baseUrl}/order/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ bitcoin_tx: tx })
    });

    if (!response.ok) {
      throw new Error('Failed to update order');
    }
  }

  async getOrders(userAddress: Address): Promise<OnRampOrderResponse[]> {
    const response = await fetch(`${this.baseUrl}/orders/${userAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    return response.json();
  }

  async getTotalLiquidity(assetAddress: Address): Promise<string> {
    const response = await fetch(`${this.baseUrl}/total/${assetAddress.toLowerCase()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    return response.json();
  }
}

export const onRampApiClient = new OnRampApiClient('/onramp-api');
