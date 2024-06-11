class ElectrsClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getTxStatus(txid: string) {
    const response = await fetch(`${this.baseUrl}/tx/${txid}/status`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    return response.json();
  }

  async getLatestBlock() {
    const response = await fetch(`${this.baseUrl}/blocks/tip/height`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    return await response.text();
  }
}

export const electrsClient = new ElectrsClient('/btc-api');
