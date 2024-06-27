import { Address } from 'viem';
import { SiweMessage } from 'siwe';

export type UserResponse = {
  id: number;
  username: string;
  discord_id: string;
  twitter_id: string;
  avatar: string;
  referral_code: string;
  referred_by: string;
  evm_address: Address;
  partner: any;
  data: any;
  created_at: Date;
  updated_at: Date;
  leaderboardRank: { user_address: string; total_reward_points: number; rank: number };
  depositStats: any[];
  totalUsdDeposited: number;
  withdrawStats: any[];
  harvested: { partner_name: string; partner_refcode: string; total_points: 'string' }[];
};

type LeaderboardResponse = {
  total: number;
  leaderboard: LeaderboardItem[];
};

type PartnersResponse = {
  partners: Partner[];
  total_partners: number;
};

type Partner = {
  category: string;
  current_points: string;
  is_quest: boolean;
  live: boolean;
  name: string;
  points_distributed_per_hour: string;
  project_url: string;
  ref_code: string;
  show_on_app_store: boolean;
  total_deposit_points: string;
  total_distributed_points: string;
  total_points: string;
  total_points_distributed_in_time_window: string;
  total_referral_points: string;
};

type LeaderboardItem = {
  rank: string;
  deposit_owner: Address;
  total_points: string;
  username: string;
  referred_by?: string;
};

type TVLStats = {
  totalTvlUsd: number;
  totalParticipants: number;
  tokens: Array<{
    token_address: Address;
    token_name: string;
    total_amount: string;
    total_usd: string;
  }>;
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getNonce() {
    const response = await fetch(`${this.baseUrl}/nonce`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    return (await response.json()).nonce;
  }

  async verify(message: SiweMessage, signature: Address) {
    const response = await fetch(`${this.baseUrl}/verify`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ message, signature })
    });

    return response.json();
  }

  async signUp(message: SiweMessage, signature: Address) {
    const response = await fetch(`${this.baseUrl}/sign-up`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, signature })
    });

    return response.json();
  }

  async getMe(): Promise<UserResponse> {
    const response = await fetch(`${this.baseUrl}/me`, {
      credentials: 'include',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });

    return (await response.json()).data || null;
  }

  async getPartners(): Promise<PartnersResponse> {
    const response = await fetch(`${this.baseUrl}/partners`, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });

    return response.json();
  }

  async getOnboarding() {
    const response = await fetch(`${this.baseUrl}/onboarding`, {
      credentials: 'include'
    });

    return response.json();
  }

  async logout() {
    fetch(`${this.baseUrl}/logout`, {
      credentials: 'include'
    });

    return;
  }

  async postReferralCode(code: string) {
    const response = await fetch(`${this.baseUrl}/init`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ referral_code: code })
    });

    if (!response.ok) {
      throw new Error('Invalid referral code');
    }

    return code;
  }

  async getLeaderboard(limit: number, offset: number): Promise<LeaderboardResponse> {
    const response = await fetch(`${this.baseUrl}/leaderboard?limit=${limit}&offset=${offset}`);

    return await response.json();
  }

  async getTvlStats(): Promise<TVLStats> {
    const response = await fetch(`${this.baseUrl}/tvlStats`);

    return await response.json();
  }

  async isFusionUser(address: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/user/${address}`);

    return response.ok;
  }
}

export const apiClient = new ApiClient('/api');
