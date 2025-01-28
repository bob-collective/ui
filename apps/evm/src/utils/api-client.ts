/* eslint-disable @typescript-eslint/no-explicit-any */
import { SiweMessage } from 'siwe';
import { Address } from 'viem';

import { FetchError } from '@/types/fetch';

export enum QuestRefCodes {
  GALXE = 'itxc9y',
  INTRACT = '6y2pac'
}

interface PostResponse {
  ok: boolean;
}

type Logos = { default?: string };

interface DepositStat {
  token_address: string;
  token_name: string;
  total_amount: string;
  total_usd: string;
}

interface S3LeaderboardData {
  global_rank: string;
  group_rank: string;
  quest_rank: string;
  total_points: number;
  username: string;
  referral_code: string;
  evm_address: string;
  tvl_points: string;
  received_pts: string;
  distributed_pts: string;
  quest_points: string;
  quests_breakdown: any;
  is_partner: boolean;
  ref_points: any;
}

interface OneDayLeaderboardEntry {
  global_rank: string;
  group_rank: string;
  quest_rank: string;
  total_points: number;
  username: string;
  referral_code: string;
  evm_address: string;
  tvl_points: string;
  received_pts: string;
  distributed_pts: string;
  quest_points: string;
  quests_breakdown: any;
  is_partner: boolean;
  ref_points: number;
  global_rank_diff: any;
  group_rank_diff: any;
  quest_rank_diff: any;
  voting_round_prizes: string;
  referred_by: string;
}

interface SevenDayLeaderboardEntry {
  global_rank: string;
  group_rank: string;
  quest_rank: string;
  total_points: number;
  username: string;
  referral_code: string;
  evm_address: string;
  tvl_points: string;
  received_pts: string;
  distributed_pts: string;
  quest_points: string;
  quests_breakdown: any;
  is_partner: boolean;
  ref_points: number;
  global_rank_diff: any;
  group_rank_diff: any;
  quest_rank_diff: any;
  voting_round_prizes: string;
  referred_by: string;
}

interface RefPointsBreakdown {
  referral_code: string;
  username: string;
  referred_by: string;
  direct_referral: boolean;
  ref_points: number;
}

interface Season3Data {
  usedProjects: any[];
  s3LeaderboardData: S3LeaderboardData[];
  oneDayLeaderboardEntry: OneDayLeaderboardEntry[];
  sevenDayLeaderboardEntry: SevenDayLeaderboardEntry[];
  harvestedPointsS3: Array<{
    partner_name: string;
    partner_refcode: string;
    total_points: string;
  }>;
  refPointsBreakdown: RefPointsBreakdown[];
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
  partner: boolean;
  data: any;
  created_at: Date;
  updated_at: Date;
  is_fusion_top_user: boolean;
  leaderboardRank?: {
    user_address: string;
    total_points: number;
    total_reward_points: number;
    total_quest_points: number;
    rank: number;
  };
  depositStats: DepositStat[];
  totalUsdDeposited: number;
  withdrawStats: any[];
  harvested: { partner_name: string; partner_refcode: string; total_points: 'string' }[];
  tvlPoints: {
    spice: string;
  };
  quests_breakdown: Record<string, number>;
  total_quest_points: string;
  season3Data: Season3Data;
  notices: {
    showIsFusionTopUser: boolean;
    showIsOpUser: boolean; // will be set to false once dismissed
    isOpUser: boolean; // stable
  };
  baby: {
    total: number;
    daily: number;
  };
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
  logos: Logos;
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

export interface ResultProject {
  name: string;
  weight: number;
  rank: number;
  refCode: string;
  userHasVotedFor: boolean;
  logos: Logos;
}

// Define the interface for a category
export interface ResultProjectCategory {
  id: number;
  name: string;
  projects: ResultProject[];
}

// Define the main type for the object
export interface ResultProjectVotingInfo {
  categories: ResultProjectCategory[];
}

interface PartnersS3Response {
  totalPartners: number;
  partners: PartnerS3[];
}

export interface PartnerS3 {
  name: string;
  ref_code: string;
  category: string;
  incentives: string[];
  project_url: string;
  logos: Logos;
  total_distributed_points: string;
  total_deposit_points: string;
  total_referral_points: string;
  total_tvl_points: string;
  total_gas_points: string;
  total_points: string;
  current_points: string;
  live: boolean;
  points_distributed_per_hour: string;
  total_points_distributed_in_time_window: string;
  show_on_app_store: boolean;
  is_quest: boolean;
  categories: string[];
  description: string;
  discord_id: string;
  max_multiplier: string;
  min_multiplier: string;
  points_distributed_per_hour_rank: string;
  total_quest_points: string;
  total_received_points: string;
  total_voting_points: string;
  current_voting_points: string;
  twitter_id: string;
}

interface LeaderboardS3Response {
  leaderboardData: LeaderboardData;
  totalDistributedPoints: S3TotalDistributedPoint[];
}

interface LeaderboardData {
  s3_leaderboard: S3Leaderboard[];
  s3_one_day_change: S3OneDayChange[];
  s3_seven_day_change: S3SevenDayChange[];
  s3_quest_leaderboard: S3QuestLeaderboard[];
}

interface S3Leaderboard {
  global_rank: string;
  group_rank: string;
  quest_rank: string;
  total_points: number;
  username: string;
  referral_code: string;
  evm_address?: string;
  tvl_points: string;
  received_pts: string;
  referred_by: string;
  distributed_pts: string;
  quest_points: string;
  quests_breakdown: any;
  is_partner: boolean;
  ref_points?: number;
  ts: string;
}

interface S3OneDayChange {
  global_rank: string;
  group_rank: string;
  quest_rank: string;
  total_points: number;
  username: string;
  referral_code: string;
  evm_address: string;
  tvl_points: string;
  received_pts: string;
  distributed_pts: string;
  quest_points: string;
  quests_breakdown: any;
  referred_by: string;
  is_partner: boolean;
  ref_points: number;
  global_rank_diff: any;
  group_rank_diff: any;
  quest_rank_diff: any;
}

interface S3SevenDayChange {
  global_rank: string;
  group_rank: string;
  quest_rank: string;
  total_points: number;
  username: string;
  referral_code: string;
  evm_address: string;
  tvl_points: string;
  referred_by: string;
  received_pts: string;
  distributed_pts: string;
  quest_points: string;
  quests_breakdown: any;
  is_partner: boolean;
  ref_points: number;
  global_rank_diff: any;
  group_rank_diff: any;
  quest_rank_diff: any;
}

interface S3QuestLeaderboard {
  global_rank: string;
  group_rank: string;
  quest_rank: string;
  total_points: number;
  username: string;
  referral_code: string;
  evm_address?: string;
  tvl_points: string;
  referred_by: string;
  received_pts: string;
  distributed_pts: string;
  quest_points: string;
  quests_breakdown: any;
  is_partner: boolean;
  ref_points?: number;
  ts: string;
}

interface S3TotalDistributedPoint {
  sum: string;
}

export interface TokenInfo {
  symbol: string;
  decimals: number;
  l2_address: string;
  multiplier: string;
  latest_price_in_usd: string;
  logos: string[];
  incentives: string[];
}

interface TotalHarvesters {
  count: number;
}

export interface LotteryStats {
  rollsRemaining: number;
  votesRemaining: number;
  running: boolean;
  pointsMissing: number;
  minPointsToRoll: number;
}

export interface LotteryRoll {
  rollsRemaining: number;
  votesRemaining: number;
  running: boolean;
  pointsMissing: number;
  winningPackageId: number | null;
  prize: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const responseText = await response.text();

      throw new FetchError(`Error ${response.status}: ${response.statusText}`, response.status, responseText);
    }

    return response.json();
  }

  async getNonce() {
    const response = await fetch(`${this.baseUrl}/nonce`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    const data = await this.handleResponse<{ nonce: string }>(response);

    return data.nonce;
  }

  async verify(message: SiweMessage, signature: Address) {
    const response = await fetch(`${this.baseUrl}/verify`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ message, signature })
    });

    return this.handleResponse(response);
  }

  async signUp(message: SiweMessage, turnstileToken: string, signature: Address) {
    const response = await fetch(`${this.baseUrl}/sign-up`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, signature, 'cf-turnstile-response': turnstileToken })
    });

    return this.handleResponse(response);
  }

  async getMe(): Promise<UserResponse> {
    const response = await fetch(`${this.baseUrl}/me`, {
      credentials: 'include',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });

    const res = await this.handleResponse<UserResponse>(response);

    return res.data || null;
  }

  async getPartners(): Promise<PartnersResponse> {
    const response = await fetch(`${this.baseUrl}/partners`, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });

    return this.handleResponse<PartnersResponse>(response);
  }

  async getOnboarding() {
    const response = await fetch(`${this.baseUrl}/onboarding`, {
      credentials: 'include'
    });

    return this.handleResponse(response);
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

    return this.handleResponse<LeaderboardResponse>(response);
  }

  async getQuestLeaderboard(limit: number, offset: number): Promise<LeaderboardResponse> {
    const response = await fetch(`${this.baseUrl}/quest-leaderboard?limit=${limit}&offset=${offset}`);

    return this.handleResponse<LeaderboardResponse>(response);
  }

  async getTvlStats(): Promise<TVLStats> {
    const response = await fetch(`${this.baseUrl}/tvlStats`);

    return this.handleResponse<TVLStats>(response);
  }

  async isFusionUser(address: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/user/${address}`);

    return response.ok;
  }

  // SEASON 3

  async getVotes(): Promise<ProjectVotingInfo> {
    const response = await fetch(`${this.baseUrl}/votes`);

    return this.handleResponse<ProjectVotingInfo>(response);
  }

  async getSeason3Partners(): Promise<PartnersS3Response> {
    const response = await fetch(`${this.baseUrl}/partners-s3`);

    return this.handleResponse<PartnersS3Response>(response);
  }

  async vote(refCode: string): Promise<ProjectVotingInfo> {
    const response = await fetch(`${this.baseUrl}/me/vote`, {
      method: 'POST',
      body: JSON.stringify({ projectRefcode: refCode }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return this.handleResponse<ProjectVotingInfo>(response);
  }

  async retractVote(refCode: string): Promise<ProjectVotingInfo> {
    const response = await fetch(`${this.baseUrl}/me/retract-vote`, {
      method: 'POST',
      body: JSON.stringify({ projectRefcode: refCode }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return this.handleResponse<ProjectVotingInfo>(response);
  }

  async dismissTopUserModal(): Promise<PostResponse> {
    const response = await fetch(`${this.baseUrl}/me/dismiss-fusion-top-user-notice`, {
      method: 'POST',
      credentials: 'include'
    });

    return this.handleResponse<PostResponse>(response);
  }

  async dismissOPUserModal(): Promise<PostResponse> {
    const response = await fetch(`${this.baseUrl}/me/dismiss-op-user-notice`, {
      method: 'POST',
      credentials: 'include'
    });

    return this.handleResponse<PostResponse>(response);
  }

  async getLastVotingResults(): Promise<ResultProjectVotingInfo> {
    const response = await fetch(`${this.baseUrl}/finalized-voting-round/latest/results`);

    return this.handleResponse<ResultProjectVotingInfo>(response);
  }

  async getLeaderboardSeason3(limit: number, offset: number): Promise<LeaderboardS3Response> {
    const response = await fetch(`${this.baseUrl}/leaderboards-s3?limit=${limit}&offset=${offset}`);

    return this.handleResponse<LeaderboardS3Response>(response);
  }

  async getTotalHarvesters(): Promise<TotalHarvesters> {
    const response = await fetch(`${this.baseUrl}/get-spice-harvesters-count`);

    return this.handleResponse<TotalHarvesters>(response);
  }

  async getTokenInfo(): Promise<TokenInfo[]> {
    const response = await fetch(`${this.baseUrl}/get-token-info`);

    return this.handleResponse<TokenInfo[]>(response);
  }

  async getLevelData() {
    const response = await fetch(`${this.baseUrl}/get-leveldata`);

    return this.handleResponse<{
      currentTvl: string;
      tvlGoal: string;
      multiplier: string;
      levelNumber: string;
      levelName: string;
      levelDescription: string;
      levelHelperText: string;
    }>(response);
  }

  async getLotteryStats(): Promise<LotteryStats> {
    const response = await fetch(`${this.baseUrl}/lottery/stats`);

    return this.handleResponse<LotteryStats>(response);
  }

  async lotteryRoll(): Promise<LotteryRoll> {
    const response = await fetch(`${this.baseUrl}/lottery/roll`, {
      method: 'POST'
    });

    return this.handleResponse<LotteryRoll>(response);
  }
}

export const apiClient = new ApiClient('/fusion-api');
