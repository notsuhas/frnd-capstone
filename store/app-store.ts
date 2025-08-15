import { DailyStreak, FreeMinutes, RewardPolicy, User, Wallet } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface AppState {
  // User & Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Wallet & Rewards
  wallet: Wallet | null;
  dailyStreak: DailyStreak | null;
  freeMinutes: FreeMinutes | null;
  rewardPolicy: RewardPolicy;
  
  // App State
  isLoading: boolean;
  hasSeenOnboarding: boolean;
  
  // Feature Flags
  featureFlags: {
    enableSafeStart: boolean;
    enableStarterCoins: boolean;
    enableAdForCoins: boolean;
    enableStreaks: boolean;
    enableIntros: boolean;
  };
  
  // Actions
  setUser: (user: User | null) => void;
  setWallet: (wallet: Wallet) => void;
  setDailyStreak: (streak: DailyStreak) => void;
  setFreeMinutes: (freeMinutes: FreeMinutes) => void;
  updateCoins: (amount: number) => void;
  useFreeMinutes: (minutes: number) => void;
  resetDailyFreeMinutes: () => void;
  setLoading: (loading: boolean) => void;
  setHasSeenOnboarding: (seen: boolean) => void;
  logout: () => void;
  
  // Persistence
  loadPersistedState: () => Promise<void>;
  persistState: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  wallet: null,
  dailyStreak: null,
  freeMinutes: null,
  rewardPolicy: {
    starterCoinsAmount: 100,
    starterCoinsValidityDays: 7,
    coinsPerAd: 5,
    dailyAdCap: 10,
    streakCoinTable: {
      1: 5, 2: 10, 3: 15, 4: 20, 5: 25, 6: 30, 7: 50
    },
    dynamicPricingEnabled: true,
    freeMinutesPerDay: 5,
    freeMinutesValidityDays: 7,
  },
  isLoading: false,
  hasSeenOnboarding: false,
  featureFlags: {
    enableSafeStart: true,
    enableStarterCoins: true,
    enableAdForCoins: true,
    enableStreaks: true,
    enableIntros: true,
  },
  
  // Actions
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
    get().persistState();
  },
  
  setWallet: (wallet) => {
    set({ wallet });
    get().persistState();
  },
  
  setDailyStreak: (dailyStreak) => {
    set({ dailyStreak });
    get().persistState();
  },
  
  setFreeMinutes: (freeMinutes) => {
    set({ freeMinutes });
    get().persistState();
  },
  
  useFreeMinutes: (minutes) => {
    const { freeMinutes } = get();
    if (freeMinutes && freeMinutes.freeMinutesRemaining >= minutes) {
      const updatedFreeMinutes = {
        ...freeMinutes,
        freeMinutesRemaining: freeMinutes.freeMinutesRemaining - minutes,
      };
      set({ freeMinutes: updatedFreeMinutes });
      get().persistState();
    }
  },
  
  resetDailyFreeMinutes: () => {
    const { freeMinutes, rewardPolicy } = get();
    if (freeMinutes && freeMinutes.freeMinutesDaysRemaining > 0) {
      const today = new Date().toDateString();
      const lastReset = new Date(freeMinutes.lastResetDate).toDateString();
      
      if (today !== lastReset) {
        const updatedFreeMinutes = {
          ...freeMinutes,
          freeMinutesRemaining: rewardPolicy.freeMinutesPerDay,
          freeMinutesDaysRemaining: freeMinutes.freeMinutesDaysRemaining - 1,
          lastResetDate: new Date().toISOString(),
        };
        set({ freeMinutes: updatedFreeMinutes });
        get().persistState();
      }
    }
  },
  
  updateCoins: (amount) => {
    const { wallet } = get();
    if (wallet) {
      const updatedWallet = {
        ...wallet,
        balanceCoins: Math.max(0, wallet.balanceCoins + amount),
        totalEarned: amount > 0 ? wallet.totalEarned + amount : wallet.totalEarned,
        totalSpent: amount < 0 ? wallet.totalSpent + Math.abs(amount) : wallet.totalSpent,
      };
      set({ wallet: updatedWallet });
      get().persistState();
    }
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setHasSeenOnboarding: (hasSeenOnboarding) => {
    set({ hasSeenOnboarding });
    get().persistState();
  },
  
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      wallet: null,
      dailyStreak: null,
      freeMinutes: null,
    });
    AsyncStorage.multiRemove(['user', 'wallet', 'dailyStreak', 'freeMinutes', 'hasSeenOnboarding']);
  },
  
  // Persistence
  loadPersistedState: async () => {
    try {
      const [userData, walletData, streakData, freeMinutesData, onboardingData] = await AsyncStorage.multiGet([
        'user', 'wallet', 'dailyStreak', 'freeMinutes', 'hasSeenOnboarding'
      ]);
      
      const user = userData[1] ? JSON.parse(userData[1]) : null;
      const wallet = walletData[1] ? JSON.parse(walletData[1]) : null;
      const dailyStreak = streakData[1] ? JSON.parse(streakData[1]) : null;
      const freeMinutes = freeMinutesData[1] ? JSON.parse(freeMinutesData[1]) : null;
      const hasSeenOnboarding = onboardingData[1] === 'true';
      
      set({
        user,
        wallet,
        dailyStreak,
        freeMinutes,
        hasSeenOnboarding,
        isAuthenticated: !!user,
      });
    } catch (error) {
      console.error('Failed to load persisted state:', error);
    }
  },
  
  persistState: async () => {
    try {
      const { user, wallet, dailyStreak, freeMinutes, hasSeenOnboarding } = get();
      await AsyncStorage.multiSet([
        ['user', JSON.stringify(user)],
        ['wallet', JSON.stringify(wallet)],
        ['dailyStreak', JSON.stringify(dailyStreak)],
        ['freeMinutes', JSON.stringify(freeMinutes)],
        ['hasSeenOnboarding', hasSeenOnboarding.toString()],
      ]);
    } catch (error) {
      console.error('Failed to persist state:', error);
    }
  },
}));