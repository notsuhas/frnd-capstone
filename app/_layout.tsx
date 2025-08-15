import { useAppStore } from "@/store/app-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="call" options={{ headerShown: false, presentation: "fullScreenModal" }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const { loadPersistedState, setUser, setWallet, setDailyStreak, setFreeMinutes, resetDailyFreeMinutes } = useAppStore();

  useEffect(() => {
    const initializeApp = async () => {
      await loadPersistedState();
      
      // Mock user data for demo
      const mockUser = {
        id: 'user123',
        role: 'user' as const,
        name: 'Alex',
        age: 25,
        gender: 'male' as const,
        tierCity: 'Mumbai',
        intents: ['friendship', 'casual'] as ('friendship' | 'dating' | 'casual')[],
        topics: ['Music', 'Travel', 'Tech', 'Movies'],
        languages: ['English', 'Hindi'],
        kycStatus: 'verified' as const,
        deviceFingerprint: 'device123',
        isOnline: true,
        rating: 4.7,
        totalCalls: 42,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };

      const mockWallet = {
        userId: 'user123',
        balanceCoins: 150,
        starterCoins: 75,
        starterCoinsExpiryAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        lastClaimedAt: new Date().toISOString(),
        totalEarned: 200,
        totalSpent: 50,
      };

      const mockStreak = {
        userId: 'user123',
        currentStreak: 3,
        longestStreak: 7,
        lastClaimedDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
        streakStartDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const mockFreeMinutes = {
        userId: 'user123',
        freeMinutesRemaining: 5,
        freeMinutesDaysRemaining: 6, // 6 days remaining out of 7
        lastResetDate: new Date().toISOString(),
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Created yesterday
        expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // Expires in 6 days
      };

      setUser(mockUser);
      setWallet(mockWallet);
      setDailyStreak(mockStreak);
      setFreeMinutes(mockFreeMinutes);
      
      // Reset daily free minutes if needed
      resetDailyFreeMinutes();
      
      SplashScreen.hideAsync();
    };

    initializeApp();
  }, [loadPersistedState, setUser, setWallet, setDailyStreak, setFreeMinutes, resetDailyFreeMinutes]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}