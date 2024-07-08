import { Address } from 'viem';

type WalletData = {
  user: {
    id: string;
    projectEnvironmentId: string;
    verifiedCredentials: Array<{
      address: Address;
      wallet_name: 'zerodev' | 'turnkeyhd';
      wallet_provider: 'smartContractWallet' | 'embeddedWallet';
    }>;
  };
};

class DynamicApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async createEmbeddedWallet(email: string): Promise<WalletData> {
    const response = await fetch(
      `${this.baseUrl}/environments/${import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID}/embeddedWallets`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_DYNAMIC_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'email', identifier: email, chain: 'EVM', socialProvider: 'emailOnly' })
      }
    );

    return response.json();
  }
}

export const dynamicApiClient = new DynamicApiClient('/dynamic-api');
