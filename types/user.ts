export interface User {
  id: string;
  role: 'user' | 'creator' | 'moderator' | 'admin';
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  tierCity: string;
  intents: ('friendship' | 'dating' | 'casual')[];
  topics: string[];
  languages: string[];
  kycStatus: 'pending' | 'verified' | 'rejected';
  deviceFingerprint: string;
  profileIntro?: ProfileIntro;
  isOnline: boolean;
  rating: number;
  totalCalls: number;
  createdAt: string;
  lastActiveAt: string;
}

export interface ProfileIntro {
  id: string;
  userId: string;
  type: 'audio' | 'video';
  url: string;
  thumbnailUrl?: string;
  durationSec: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface Wallet {
  userId: string;
  balanceCoins: number;
  starterCoins: number;
  starterCoinsExpiryAt: string;
  lastClaimedAt?: string;
  totalEarned: number;
  totalSpent: number;
}

export interface FreeMinutes {
  userId: string;
  freeMinutesRemaining: number;
  freeMinutesDaysRemaining: number;
  lastResetDate: string;
  createdAt: string;
  expiresAt: string;
}

export interface RewardPolicy {
  starterCoinsAmount: number;
  starterCoinsValidityDays: number;
  coinsPerAd: number;
  dailyAdCap: number;
  streakCoinTable: Record<number, number>; // day -> coins
  dynamicPricingEnabled: boolean;
  freeMinutesPerDay: number;
  freeMinutesValidityDays: number;
}

export interface CallSession {
  id: string;
  callerId: string;
  calleeId: string;
  type: 'voice' | 'video';
  startAt: string;
  endAt?: string;
  perMinuteRate: number;
  coinsDebited: number;
  freeMinutesUsed: number;
  ratingCaller?: number;
  ratingCallee?: number;
  flags: string[];
  status: 'initiated' | 'connected' | 'ended' | 'failed';
}

export interface AdImpression {
  id: string;
  userId: string;
  adNetwork: string;
  requestId: string;
  status: 'started' | 'completed' | 'failed';
  verified: boolean;
  coinsAwarded: number;
  createdAt: string;
}

export interface DailyStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastClaimedDate: string;
  streakStartDate: string;
}