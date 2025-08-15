import { Button } from '@/components/ui/Button';
import { CoinDisplay } from '@/components/ui/CoinDisplay';
import { theme } from '@/constants/theme';
import { useAppStore } from '@/store/app-store';
import { LinearGradient } from 'expo-linear-gradient';
import { Edit, HelpCircle, LogOut, Settings, Shield, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user, wallet, logout } = useAppStore();
  const [recordingIntro, setRecordingIntro] = useState(false);

  const handleRecordIntro = (type: 'audio' | 'video') => {
    setRecordingIntro(true);
    
    // Simulate recording
    setTimeout(() => {
      setRecordingIntro(false);
      Alert.alert(
        'Intro Recorded!',
        `Your ${type} intro has been submitted for review. It will be live once approved.`,
        [{ text: 'Great!', style: 'default' }]
      );
    }, 3000);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  if (!user || !wallet) {
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
        colors={theme.colors.gradient.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{user.name}, {user.age}</Text>
          <Text style={styles.location}>{user.tierCity}</Text>
          <View style={styles.rating}>
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>{user.rating.toFixed(1)} ({user.totalCalls} calls)</Text>
          </View>
        </View>
        
        <CoinDisplay amount={wallet.balanceCoins} gradient size="lg" />
      </LinearGradient>

      {/* Profile Intro Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Intro</Text>
        
        {user.profileIntro ? (
          <View style={styles.introCard}>
            <View style={styles.introHeader}>
              <Text style={styles.introType}>
                {user.profileIntro.type === 'audio' ? '🎵 Audio' : '🎥 Video'} Intro
              </Text>
              <Text style={styles.introStatus}>
                {user.profileIntro.status === 'approved' ? '✅ Approved' : 
                 user.profileIntro.status === 'pending' ? '⏳ Under Review' : '❌ Rejected'}
              </Text>
            </View>
            <Text style={styles.introDuration}>{user.profileIntro.durationSec} seconds</Text>
            <Button
              title="Re-record Intro"
              variant="outline"
              onPress={() => handleRecordIntro(user.profileIntro!.type)}
              style={styles.rerecordButton}
            />
          </View>
        ) : (
          <View style={styles.noIntroCard}>
            <Text style={styles.noIntroText}>
              Record a short intro to help others get to know you better!
            </Text>
            <View style={styles.introButtons}>
              <Button
                title="Audio Intro"
                onPress={() => handleRecordIntro('audio')}
                loading={recordingIntro}
                style={styles.introButton}
              />
              <Button
                title="Video Intro"
                onPress={() => handleRecordIntro('video')}
                loading={recordingIntro}
                gradient
                style={styles.introButton}
              />
            </View>
          </View>
        )}
      </View>

      {/* Topics & Interests */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Topics & Interests</Text>
          <TouchableOpacity>
            <Edit size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.topicsContainer}>
          {user.topics.map((topic, index) => (
            <View key={index} style={styles.topicChip}>
              <Text style={styles.topicText}>{topic}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.languagesContainer}>
          <Text style={styles.languagesLabel}>Languages:</Text>
          <Text style={styles.languagesText}>{user.languages.join(', ')}</Text>
        </View>
      </View>

      {/* Wallet Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallet Summary</Text>
        
        <View style={styles.walletGrid}>
          <View style={styles.walletCard}>
            <Text style={styles.walletValue}>{wallet.balanceCoins}</Text>
            <Text style={styles.walletLabel}>Current Balance</Text>
          </View>
          
          <View style={styles.walletCard}>
            <Text style={styles.walletValue}>{wallet.totalEarned}</Text>
            <Text style={styles.walletLabel}>Total Earned</Text>
          </View>
          
          <View style={styles.walletCard}>
            <Text style={styles.walletValue}>{wallet.totalSpent}</Text>
            <Text style={styles.walletLabel}>Total Spent</Text>
          </View>
          
          {wallet.starterCoins > 0 && (
            <View style={styles.walletCard}>
              <Text style={styles.walletValue}>{wallet.starterCoins}</Text>
              <Text style={styles.walletLabel}>Starter Coins</Text>
            </View>
          )}
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.section}>
        <View style={styles.menuList}>
          <TouchableOpacity style={styles.menuItem}>
            <Settings size={20} color={theme.colors.textSecondary} />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Shield size={20} color={theme.colors.textSecondary} />
            <Text style={styles.menuText}>Safety & Privacy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <HelpCircle size={20} color={theme.colors.textSecondary} />
            <Text style={styles.menuText}>Help & Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <LogOut size={20} color={theme.colors.error} />
            <Text style={[styles.menuText, { color: theme.colors.error }]}>Logout</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  profileInfo: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
  name: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
  location: {
    fontSize: theme.fontSize.md,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  ratingText: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: theme.fontWeight.medium,
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  introCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  introHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  introType: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  introStatus: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  introDuration: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  rerecordButton: {
    marginTop: theme.spacing.sm,
  },
  noIntroCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  noIntroText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  introButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  introButton: {
    flex: 1,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  topicChip: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  topicText: {
    fontSize: theme.fontSize.sm,
    color: '#fff',
    fontWeight: theme.fontWeight.medium,
  },
  languagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  languagesLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  languagesText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  walletGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  walletCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  walletValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  walletLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  menuList: {
    gap: theme.spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.md,
  },
  menuText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },
});