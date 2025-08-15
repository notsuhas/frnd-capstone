import { Button } from '@/components/ui/Button';
import { CoinDisplay } from '@/components/ui/CoinDisplay';
import { theme } from '@/constants/theme';
import { analytics } from '@/services/analytics';
import { useAppStore } from '@/store/app-store';
import { LinearGradient } from 'expo-linear-gradient';
import { Award, Clock, Gift, Play, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EarnScreen() {
  const { user, wallet, rewardPolicy, updateCoins } = useAppStore();
  const [adsWatchedToday, setAdsWatchedToday] = useState(0);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adCooldown, setAdCooldown] = useState(0);

  useEffect(() => {
    // Cooldown timer
    if (adCooldown > 0) {
      const timer = setTimeout(() => setAdCooldown(adCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [adCooldown]);

  const canWatchAd = adsWatchedToday < rewardPolicy.dailyAdCap && adCooldown === 0;

  const handleWatchAd = async () => {
    if (!canWatchAd || !user) return;

    setIsWatchingAd(true);
    analytics.trackAdRewardStarted(user.id);

    // Simulate ad watching
    setTimeout(() => {
      const coinsEarned = rewardPolicy.coinsPerAd;
      updateCoins(coinsEarned);
      setAdsWatchedToday(prev => prev + 1);
      setAdCooldown(30); // 30 second cooldown
      setIsWatchingAd(false);

      analytics.trackAdRewardCompleted(coinsEarned, user.id);

      Alert.alert(
        '🎉 Reward Earned!',
        `You earned ${coinsEarned} coins for watching the ad!`,
        [{ text: 'Awesome!', style: 'default' }]
      );
    }, 3000); // Simulate 3 second ad
  };

  const handleInviteFriends = () => {
    Alert.alert('Coming Soon', 'Invite friends feature will be available soon!');
  };

  const handleDailyTasks = () => {
    Alert.alert('Coming Soon', 'Daily tasks feature will be available soon!');
  };

  if (!wallet) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={theme.colors.gradient.coin}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Earn Coins</Text>
          <Text style={styles.headerSubtitle}>Watch ads, complete tasks, and earn rewards!</Text>
          <CoinDisplay amount={wallet.balanceCoins} gradient size="lg" />
        </View>
      </LinearGradient>

      {/* Watch Ads Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Watch Ads for Coins</Text>
        
        <View style={styles.adCard}>
          <LinearGradient
            colors={canWatchAd ? theme.colors.gradient.primary : ['#F3F4F6', '#E5E7EB'] as const}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.adGradient}
          >
            <Play size={32} color={canWatchAd ? '#fff' : theme.colors.textLight} />
            <View style={styles.adContent}>
              <Text style={[styles.adTitle, canWatchAd && styles.adTitleActive]}>
                Rewarded Video
              </Text>
              <Text style={[styles.adDescription, canWatchAd && styles.adDescriptionActive]}>
                Watch a short video and earn {rewardPolicy.coinsPerAd} coins
              </Text>
              <View style={styles.adProgress}>
                <Text style={[styles.progressText, canWatchAd && styles.progressTextActive]}>
                  {adsWatchedToday}/{rewardPolicy.dailyAdCap} ads watched today
                </Text>
                {adCooldown > 0 && (
                  <Text style={[styles.cooldownText, canWatchAd && styles.cooldownTextActive]}>
                    Next ad in {adCooldown}s
                  </Text>
                )}
              </View>
            </View>
          </LinearGradient>
          
          <Button
            title={isWatchingAd ? "Watching Ad..." : "Watch Ad"}
            onPress={handleWatchAd}
            disabled={!canWatchAd}
            loading={isWatchingAd}
            gradient={canWatchAd}
            style={styles.adButton}
          />
        </View>
      </View>

      {/* Other Earning Methods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More Ways to Earn</Text>
        
        <View style={styles.methodsList}>
          <TouchableOpacity style={styles.methodCard} onPress={handleInviteFriends}>
            <View style={styles.methodIcon}>
              <Gift size={24} color={theme.colors.success} />
            </View>
            <View style={styles.methodContent}>
              <Text style={styles.methodTitle}>Invite Friends</Text>
              <Text style={styles.methodDescription}>Get 50 coins for each friend who joins</Text>
              <CoinDisplay amount={50} size="sm" />
            </View>
            <Text style={styles.comingSoon}>Soon</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.methodCard} onPress={handleDailyTasks}>
            <View style={styles.methodIcon}>
              <Award size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.methodContent}>
              <Text style={styles.methodTitle}>Daily Tasks</Text>
              <Text style={styles.methodDescription}>Complete simple tasks for bonus coins</Text>
              <CoinDisplay amount={25} size="sm" />
            </View>
            <Text style={styles.comingSoon}>Soon</Text>
          </TouchableOpacity>

          <View style={styles.methodCard}>
            <View style={styles.methodIcon}>
              <TrendingUp size={24} color={theme.colors.secondary} />
            </View>
            <View style={styles.methodContent}>
              <Text style={styles.methodTitle}>Creator Earnings</Text>
              <Text style={styles.methodDescription}>Earn coins when others call you</Text>
              <Text style={styles.methodNote}>Available for verified creators</Text>
            </View>
            <Text style={styles.activeText}>Active</Text>
          </View>
        </View>
      </View>

      {/* Earnings Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Earnings</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <TrendingUp size={20} color={theme.colors.success} />
            <Text style={styles.statValue}>{wallet.totalEarned}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
          
          <View style={styles.statCard}>
            <Clock size={20} color={theme.colors.primary} />
            <Text style={styles.statValue}>{adsWatchedToday}</Text>
            <Text style={styles.statLabel}>Ads Today</Text>
          </View>
          
          <View style={styles.statCard}>
            <Gift size={20} color={theme.colors.secondary} />
            <Text style={styles.statValue}>{wallet.starterCoins}</Text>
            <Text style={styles.statLabel}>Starter Coins</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
  },
  header: {
    paddingTop: 60,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: theme.fontSize.md,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  adCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  adGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  adContent: {
    flex: 1,
  },
  adTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
  },
  adTitleActive: {
    color: '#fff',
  },
  adDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  adDescriptionActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  adProgress: {
    marginTop: theme.spacing.sm,
  },
  progressText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  progressTextActive: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  cooldownText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  cooldownTextActive: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  adButton: {
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  methodsList: {
    gap: theme.spacing.md,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.md,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  methodTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  methodDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  methodNote: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    fontStyle: 'italic',
  },
  comingSoon: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    fontWeight: theme.fontWeight.medium,
  },
  activeText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.success,
    fontWeight: theme.fontWeight.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});