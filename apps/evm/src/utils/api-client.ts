import { Address } from 'viem';
import { SiweMessage } from 'siwe';

export enum QuestRefCodes {
  GALXE = 'itxc9y',
  INTRACT = '6y2pac'
}

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
  leaderboardRank: { user_address: string; total_reward_points: number; total_quest_points: number; rank: number };
  depositStats: any[];
  totalUsdDeposited: number;
  withdrawStats: any[];
  harvested: { partner_name: string; partner_refcode: string; total_points: 'string' }[];
  quests_breakdown: Record<string, number>;
  total_quest_points: string;
};

type LeaderboardResponse = {
  total: number;
  leaderboard: LeaderboardItem[];
};

export type PartnersResponse = {
  partners: Partner[];
  total_partners: number;
};

export type Partner = {
  category: string;
  current_points: string;
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
  total_quest_points: string;
  username: string;
  referred_by?: string;
  quests_breakdown?: Record<string, number>;
  points_breakdown?: Record<string, number>;
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

// Define the interface for a project
export interface Project {
  name: string;
  weight: number;
  rank: number;
  refCode: string;
  userHasVotedFor: boolean;
  isPreviousRoundWinner: boolean;
}

// Define the interface for a category
export interface ProjectCategory {
  id: number;
  name: string;
  projects: Project[];
}

// Define the main type for the object
export interface ProjectVotingInfo {
  categories: ProjectCategory[];
  votesRemaining: number;
  roundEndsAt: string; // ISO 8601 date string
}

export interface PartnersS3Response {
  totalPartners: number;
  partners: PartnerS3[];
}

export interface PartnerS3 {
  name: string;
  ref_code: string;
  category: string;
  live?: boolean;
  project_url: string;
  show_on_app_store: boolean;
  discord_id: any;
  twitter_id: any;
  categories: any;
  total_distributed_points: string;
  total_points: number;
  total_tvl_points: string;
  total_received_points_through_partner: string;
  total_quest_points: string;
  total_referral_points?: number;
  points_distributed_per_hour: string;
  total_points_distributed_in_time_window: any;
  max_multiplier: string;
  min_multiplier: string;
  points_distributed_per_hour_rank: string;
}

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

  async getQuestLeaderboard(limit: number, offset: number): Promise<LeaderboardResponse> {
    const response = await fetch(`${this.baseUrl}/quest-leaderboard?limit=${limit}&offset=${offset}`);

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

  // SEASON 3

  async getVotes(): Promise<ProjectVotingInfo> {
    const response = await fetch(`${this.baseUrl}/votes`);

    return await response.json();
  }

  async getSeason3Partners(): Promise<PartnersS3Response> {
    const response = await fetch(`${this.baseUrl}/partners-s3`);

    return await response.json();
  }

  async vote(refCode: string): Promise<ProjectVotingInfo> {
    const response = await fetch(`${this.baseUrl}/me/vote`, {
      method: 'POST',
      body: JSON.stringify({ projectRefcode: refCode }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.json();
  }

  async retractVote(refCode: string): Promise<ProjectVotingInfo> {
    const response = await fetch(`${this.baseUrl}/me/retract-vote`, {
      method: 'POST',
      body: JSON.stringify({ projectRefcode: refCode }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.json();
  }
}

export const apiClient = new ApiClient('/api');
