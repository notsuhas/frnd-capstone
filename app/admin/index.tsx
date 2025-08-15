import { Button } from '@/components/ui/Button';
import { theme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { DollarSign, Settings, Shield, TrendingUp, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface RewardPolicyState {
  starterCoinsAmount: number;
  starterCoinsValidityDays: number;
  coinsPerAd: number;
  dailyAdCap: number;
  streakCoinTable: Record<number, number>;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'moderation' | 'users'>('overview');
  const [rewardPolicy, setRewardPolicy] = useState<RewardPolicyState>({
    starterCoinsAmount: 100,
    starterCoinsValidityDays: 7,
    coinsPerAd: 5,
    dailyAdCap: 10,
    streakCoinTable: {
      1: 5, 2: 10, 3: 15, 4: 20, 5: 25, 6: 30, 7: 50
    },
  });

  const mockStats = {
    totalUsers: 12543,
    activeUsers: 3421,
    totalCalls: 8765,
    totalRevenue: 45678,
    d1Retention: 68,
    d7Retention: 42,
    avgSessionTime: 12.5,
    harassmentReports: 23,
  };

  const mockPendingIntros = [
    { id: '1', userName: 'Priya S.', type: 'audio', duration: 12, uploadedAt: '2 hours ago' },
    { id: '2', userName: 'Arjun K.', type: 'video', duration: 15, uploadedAt: '4 hours ago' },
    { id: '3', userName: 'Sneha M.', type: 'audio', duration: 10, uploadedAt: '6 hours ago' },
  ];

  const handleSaveRewardPolicy = () => {
    console.log('Saving reward policy:', rewardPolicy);
    // In production, save to backend
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Dashboard Overview</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Users size={24} color={theme.colors.primary} />
          <Text style={styles.statValue}>{mockStats.totalUsers.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        
        <View style={styles.statCard}>
          <TrendingUp size={24} color={theme.colors.success} />
          <Text style={styles.statValue}>{mockStats.activeUsers.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Active Users</Text>
        </View>
        
        <View style={styles.statCard}>
          <DollarSign size={24} color={theme.colors.secondary} />
          <Text style={styles.statValue}>₹{mockStats.totalRevenue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
        
        <View style={styles.statCard}>
          <Shield size={24} color={theme.colors.error} />
          <Text style={styles.statValue}>{mockStats.harassmentReports}</Text>
          <Text style={styles.statLabel}>Reports</Text>
        </View>
      </View>

      <View style={styles.retentionSection}>
        <Text style={styles.sectionTitle}>Retention Metrics</Text>
        <View style={styles.retentionGrid}>
          <View style={styles.retentionCard}>
            <Text style={styles.retentionValue}>{mockStats.d1Retention}%</Text>
            <Text style={styles.retentionLabel}>D1 Retention</Text>
          </View>
          <View style={styles.retentionCard}>
            <Text style={styles.retentionValue}>{mockStats.d7Retention}%</Text>
            <Text style={styles.retentionLabel}>D7 Retention</Text>
          </View>
          <View style={styles.retentionCard}>
            <Text style={styles.retentionValue}>{mockStats.avgSessionTime}m</Text>
            <Text style={styles.retentionLabel}>Avg Session</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderRewards = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Reward Policy Settings</Text>
      
      <View style={styles.policySection}>
        <Text style={styles.sectionTitle}>Starter Coins</Text>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Amount:</Text>
          <TextInput
            style={styles.input}
            value={rewardPolicy.starterCoinsAmount.toString()}
            onChangeText={(text) => setRewardPolicy(prev => ({ ...prev, starterCoinsAmount: parseInt(text) || 0 }))}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Validity (days):</Text>
          <TextInput
            style={styles.input}
            value={rewardPolicy.starterCoinsValidityDays.toString()}
            onChangeText={(text) => setRewardPolicy(prev => ({ ...prev, starterCoinsValidityDays: parseInt(text) || 0 }))}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.policySection}>
        <Text style={styles.sectionTitle}>Ad Rewards</Text>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Coins per ad:</Text>
          <TextInput
            style={styles.input}
            value={rewardPolicy.coinsPerAd.toString()}
            onChangeText={(text) => setRewardPolicy(prev => ({ ...prev, coinsPerAd: parseInt(text) || 0 }))}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Daily cap:</Text>
          <TextInput
            style={styles.input}
            value={rewardPolicy.dailyAdCap.toString()}
            onChangeText={(text) => setRewardPolicy(prev => ({ ...prev, dailyAdCap: parseInt(text) || 0 }))}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.policySection}>
        <Text style={styles.sectionTitle}>Streak Rewards</Text>
        {Object.entries(rewardPolicy.streakCoinTable).map(([day, coins]) => (
          <View key={day} style={styles.inputRow}>
            <Text style={styles.inputLabel}>Day {day}:</Text>
            <TextInput
              style={styles.input}
              value={coins.toString()}
              onChangeText={(text) => setRewardPolicy(prev => ({
                ...prev,
                streakCoinTable: { ...prev.streakCoinTable, [parseInt(day)]: parseInt(text) || 0 }
              }))}
              keyboardType="numeric"
            />
          </View>
        ))}
      </View>

      <Button
        title="Save Policy"
        onPress={handleSaveRewardPolicy}
        gradient
        style={styles.saveButton}
      />
    </View>
  );

  const renderModeration = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Content Moderation</Text>
      
      <View style={styles.moderationSection}>
        <Text style={styles.sectionTitle}>Pending Intro Reviews ({mockPendingIntros.length})</Text>
        
        {mockPendingIntros.map((intro) => (
          <View key={intro.id} style={styles.introCard}>
            <View style={styles.introInfo}>
              <Text style={styles.introUser}>{intro.userName}</Text>
              <Text style={styles.introDetails}>
                {intro.type === 'audio' ? '🎵' : '🎥'} {intro.type} • {intro.duration}s • {intro.uploadedAt}
              </Text>
            </View>
            <View style={styles.introActions}>
              <TouchableOpacity style={styles.approveButton}>
                <Text style={styles.approveText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton}>
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderUsers = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>User Management</Text>
      <Text style={styles.comingSoon}>User management features coming soon...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradient.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage your social discovery platform</Text>
      </LinearGradient>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <TrendingUp size={20} color={activeTab === 'overview' ? theme.colors.primary : theme.colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'rewards' && styles.activeTab]}
          onPress={() => setActiveTab('rewards')}
        >
          <Settings size={20} color={activeTab === 'rewards' ? theme.colors.primary : theme.colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'rewards' && styles.activeTabText]}>Rewards</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'moderation' && styles.activeTab]}
          onPress={() => setActiveTab('moderation')}
        >
          <Shield size={20} color={activeTab === 'moderation' ? theme.colors.primary : theme.colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'moderation' && styles.activeTabText]}>Moderation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Users size={20} color={activeTab === 'users' ? theme.colors.primary : theme.colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>Users</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'rewards' && renderRewards()}
        {activeTab === 'moderation' && renderModeration()}
        {activeTab === 'users' && renderUsers()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: theme.fontSize.md,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: theme.spacing.xs,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  activeTabText: {
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: theme.spacing.lg,
  },
  tabTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
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
  retentionSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  retentionGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  retentionCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  retentionValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
  },
  retentionLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  policySection: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    fontSize: theme.fontSize.md,
  },
  saveButton: {
    marginTop: theme.spacing.lg,
  },
  moderationSection: {
    marginBottom: theme.spacing.lg,
  },
  introCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  introInfo: {
    flex: 1,
  },
  introUser: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  introDetails: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  introActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  approveButton: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  approveText: {
    color: '#fff',
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  rejectButton: {
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  rejectText: {
    color: '#fff',
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  comingSoon: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xxl,
  },
});