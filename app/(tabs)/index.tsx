import { useAppStore } from '@/store/app-store';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Flame, Gift, Phone, Wallet } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { SafetyPrompt } from '@/components/ui/SafetyPrompt';
import { theme } from '@/constants/theme';
import { analytics } from '@/services/analytics';

export default function HomeScreen() {
  const { user, wallet, dailyStreak, freeMinutes, updateCoins, setDailyStreak, resetDailyFreeMinutes } = useAppStore();
  const [showSafetyPrompt, setShowSafetyPrompt] = useState(false);
  const [streakClaimable, setStreakClaimable] = useState(false);

  useEffect(() => {
    // Check if streak is claimable
    if (dailyStreak) {
      const today = new Date().toDateString();
      const lastClaimed = new Date(dailyStreak.lastClaimedDate).toDateString();
      setStreakClaimable(today !== lastClaimed);
    }
    
    // Reset daily free minutes if needed
    resetDailyFreeMinutes();
  }, [dailyStreak, resetDailyFreeMinutes]);

  const handleClaimStreak = () => {
    if (!dailyStreak || !streakClaimable) return;

    const nextDay = dailyStreak.currentStreak + 1;
    const coinsToAward = getStreakCoins(nextDay);
    
    updateCoins(coinsToAward);
    
    const updatedStreak = {
      ...dailyStreak,
      currentStreak: nextDay,
      longestStreak: Math.max(dailyStreak.longestStreak, nextDay),
      lastClaimedDate: new Date().toISOString(),
    };
    
    setDailyStreak(updatedStreak);
    setStreakClaimable(false);
    
    analytics.trackStreakClaimed(nextDay, coinsToAward, user?.id || '');
    
    Alert.alert(
      '🔥 Streak Claimed!',
      `Day ${nextDay} complete! You earned ${coinsToAward} coins.`,
      [{ text: 'Awesome!', style: 'default' }]
    );
  };

  const getStreakCoins = (day: number): number => {
    const streakTable = { 1: 5, 2: 10, 3: 15, 4: 20, 5: 25, 6: 30, 7: 50 };
    return streakTable[day as keyof typeof streakTable] || 10;
  };

  const handleStartCall = (type: 'voice' | 'video') => {
    setShowSafetyPrompt(true);
  };

  const handleSafetyAccept = () => {
    setShowSafetyPrompt(false);
    // Navigate to discovery/matching screen
    Alert.alert('Feature Coming Soon', 'Call matching will be available soon!');
  };

  if (!user || !wallet) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.topBar} testID="home-topbar">
        <View style={styles.profileRow}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&crop=faces&auto=format' }}
            style={styles.avatar}
          />
          <View style={styles.walletPill}>
            <Wallet size={16} color={theme.colors.text} />
            <Text style={styles.walletText}>₹{wallet.balanceCoins}</Text>
          </View>
        </View>
      </View>

      <View style={styles.featuresWrapper} testID="home-feature-cards">
        {freeMinutes && freeMinutes.freeMinutesDaysRemaining > 0 && (
          <View style={[styles.featureCard, styles.featureGreen]}>
            <View style={styles.featureIconWrap}>
              <Clock size={20} color="#047857" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>You have {freeMinutes.freeMinutesRemaining} minutes free today</Text>
              <Text style={styles.featureSubtitle}>Make your first call now! {freeMinutes.freeMinutesDaysRemaining} days remaining</Text>
            </View>
          </View>
        )}

        {wallet.starterCoins > 0 && (
          <View style={[styles.featureCard, styles.featureYellow]}>
            <View style={styles.featureIconWrap}>
              <Gift size={20} color="#B45309" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitleDark}>Starter Coins</Text>
              <Text style={styles.featureSubtitleDark}>{wallet.starterCoins} free coins remaining</Text>
            </View>
          </View>
        )}

        {dailyStreak && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={streakClaimable ? handleClaimStreak : undefined}
            disabled={!streakClaimable}
            style={styles.streakTouchable}
            testID="daily-streak-card"
          >
            <LinearGradient
              colors={streakClaimable ? ['#FB923C', '#F97316'] : ['#F3F4F6', '#E5E7EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.featureCard, styles.streakGradientCard]}
            >
              <Flame size={24} color={streakClaimable ? '#fff' : theme.colors.textLight} />
              <View style={styles.featureContent}>
                <Text style={[styles.streakTitleText, { color: streakClaimable ? '#fff' : theme.colors.text } ]}>Daily Streak</Text>
                <Text style={[styles.streakSubText, { color: streakClaimable ? 'rgba(255,255,255,0.9)' : theme.colors.textSecondary }]}>Day {dailyStreak.currentStreak} • {getStreakCoins(dailyStreak.currentStreak + 1)} coins</Text>
              </View>
              {streakClaimable && (
                <View style={styles.claimChip}><Text style={styles.claimChipText}>CLAIM</Text></View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Private Training</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          <View style={[styles.roomCard, styles.roomCardGreen]} testID="room-create">
            <Text style={styles.roomTitle}>Train Boys</Text>
            <Text style={styles.roomMeta}>2864 FRNDs Online</Text>
            <View style={styles.createPill}><Text style={styles.createPillText}>+ Create</Text></View>
          </View>
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={`trainer-${i}`} style={styles.personCard}>
              <View style={styles.personAvatar} />
              <Text style={styles.personName}>janvi pandey</Text>
              <TouchableOpacity style={styles.joinBtn} onPress={() => handleStartCall('voice')} testID={`join-${i}`}>
                <Phone size={16} color="#fff" />
                <Text style={styles.joinText}>Join</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>All Room Types</Text>
        <View style={styles.roomTypeGrid}>
          {['Loveschool by frnd','Private Training Rooms','FRND Making Rooms'].map((label, idx) => (
            <View key={`type-${idx}`} style={[styles.roomTypeCard, idx===0?styles.typePurple:idx===1?styles.typePink:styles.typeViolet]}>
              <Text style={styles.roomTypeText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      <SafetyPrompt
        visible={showSafetyPrompt}
        onAccept={handleSafetyAccept}
        onCancel={() => setShowSafetyPrompt(false)}
        type="call"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  walletText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  featuresWrapper: {
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 8,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  featureGreen: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  featureYellow: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },
  featureSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#065F46',
  },
  featureTitleDark: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  featureSubtitleDark: {
    marginTop: 4,
    fontSize: 12,
    color: '#B45309',
  },
  streakTouchable: {
    borderRadius: 16,
  },
  streakGradientCard: {
    alignItems: 'center',
  },
  streakTitleText: {
    fontSize: 16,
    fontWeight: '700',
  },
  streakSubText: {
    fontSize: 12,
    marginTop: 4,
  },
  claimChip: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  claimChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionHeading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  horizontalList: {
    gap: 12,
    paddingRight: 16,
  },
  roomCard: {
    width: 160,
    height: 200,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
  },
  roomCardGreen: {
    backgroundColor: '#34D399',
  },
  roomTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  roomMeta: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
  },
  createPill: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 999,
  },
  createPillText: {
    color: '#065F46',
    fontWeight: '700',
  },
  personCard: {
    width: 160,
    height: 200,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  personAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5E7EB',
  },
  personName: {
    fontSize: 14,
    color: '#111827',
  },
  joinBtn: {
    marginTop: 'auto',
    width: '100%',
    backgroundColor: '#0EA5E9',
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  joinText: {
    color: '#fff',
    fontWeight: '700',
  },
  roomTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  roomTypeCard: {
    width: '31%',
    aspectRatio: 0.75,
    borderRadius: 18,
    padding: 12,
    justifyContent: 'flex-end',
  },
  roomTypeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  typePurple: { backgroundColor: '#7C3AED' },
  typePink: { backgroundColor: '#EC4899' },
  typeViolet: { backgroundColor: '#8B5CF6' },
});