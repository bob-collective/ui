import { Address } from 'viem';
import { SiweMessage } from 'siwe';

export enum QuestRefCodes {
  GALXE = 'itxc9y',
  INTRACT = '6y2pac'
}

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
  prizePoints: number;
}

// Define the interface for a category
interface ResultProjectCategory {
  id: number;
  name: string;
  projects: ResultProject[];
}

// Define the main type for the object
interface ResultProjectVotingInfo {
  categories: ResultProjectCategory[];
}

interface PartnersS3Response {
  totalPartners: number;
  partners: PartnerS3[];
}

export interface PartnerS3 {
  name: string;
  ref_code: string;
  live?: boolean;
  project_url: string;
  description: string;
  show_on_app_store: boolean;
  discord_id: any;
  twitter_id: any;
  categories: string[];
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
}

export interface QuestS3Response {
  questBreakdown: QuestBreakdown[];
}

export interface QuestBreakdown {
  quest_id: string;
  total_received_xp: string;
  available_xp: string;
  total_received_spice: string;
  available_spice: string;
  quest_name: string;
  quest_completed: boolean;
  url: string;
  description: string;
  is_featured: boolean;
  start_date: string;
  end_date: string;
  questing_platform_referral_code: string;
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

  async getLastVotingResults(): Promise<ResultProjectVotingInfo> {
    const response = await fetch(`${this.baseUrl}/finalized-voting-round/latest/results`);

    return await response.json();
  }

  async getLeaderboardSeason3(limit: number, offset: number): Promise<LeaderboardS3Response> {
    const response = await fetch(`${this.baseUrl}/leaderboards-s3?limit=${limit}&offset=${offset}`);

    return await response.json();
  }

  async getQuestsS3(): Promise<QuestS3Response> {
    const response = await fetch(`${this.baseUrl}/get-quests-s3`);

    return await response.json();
  }

  async getTokenInfo(): Promise<TokenInfo[]> {
    const response = await fetch(`${this.baseUrl}/get-token-info`);

    return await response.json();
  }

  async getLevelData(): Promise<{
    currentTvl: string;
    tvlGoal: string;
    multiplier: string;
    levelNumber: string;
    levelName: string;
    levelDescription: string;
  }> {
    const response = await fetch(`${this.baseUrl}/get-leveldata`);

    return await response.json();
  }
}

export const apiClient = new ApiClient('/api');
