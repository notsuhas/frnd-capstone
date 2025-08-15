import { Button } from '@/components/ui/Button';
import { CoinDisplay } from '@/components/ui/CoinDisplay';
import { SafetyPrompt } from '@/components/ui/SafetyPrompt';
import { theme } from '@/constants/theme';
import { User } from '@/types/user';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Play } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Mock data for discovery
const mockUsers: (User & { distance: number; perMinuteRate: number; introPreview: string })[] = [
  {
    id: '1',
    name: 'Priya',
    age: 24,
    gender: 'female',
    tierCity: 'Pune',
    intents: ['friendship', 'casual'],
    topics: ['Music', 'Travel', 'Food'],
    languages: ['Hindi', 'English'],
    kycStatus: 'verified',
    deviceFingerprint: '',
    isOnline: true,
    rating: 4.8,
    totalCalls: 156,
    createdAt: '',
    lastActiveAt: '',
    role: 'creator',
    distance: 2.5,
    perMinuteRate: 3,
    introPreview: 'Hi! I love music and traveling. Let\'s chat about life!',
    profileIntro: {
      id: '1',
      userId: '1',
      type: 'audio',
      url: 'https://example.com/audio1.mp3',
      durationSec: 12,
      status: 'approved',
      createdAt: '',
    }
  },
  {
    id: '2',
    name: 'Arjun',
    age: 28,
    gender: 'male',
    tierCity: 'Bangalore',
    intents: ['friendship'],
    topics: ['Tech', 'Gaming', 'Movies'],
    languages: ['English', 'Kannada'],
    kycStatus: 'verified',
    deviceFingerprint: '',
    isOnline: true,
    rating: 4.6,
    totalCalls: 89,
    createdAt: '',
    lastActiveAt: '',
    role: 'creator',
    distance: 5.2,
    perMinuteRate: 4,
    introPreview: 'Tech enthusiast who loves gaming and good conversations!',
    profileIntro: {
      id: '2',
      userId: '2',
      type: 'video',
      url: 'https://example.com/video2.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      durationSec: 15,
      status: 'approved',
      createdAt: '',
    }
  },
  {
    id: '3',
    name: 'Sneha',
    age: 22,
    gender: 'female',
    tierCity: 'Delhi',
    intents: ['dating', 'friendship'],
    topics: ['Art', 'Books', 'Photography'],
    languages: ['Hindi', 'English'],
    kycStatus: 'verified',
    deviceFingerprint: '',
    isOnline: false,
    rating: 4.9,
    totalCalls: 234,
    createdAt: '',
    lastActiveAt: '',
    role: 'creator',
    distance: 8.1,
    perMinuteRate: 5,
    introPreview: 'Artist and book lover. Let\'s share stories and dreams!',
    profileIntro: {
      id: '3',
      userId: '3',
      type: 'audio',
      url: 'https://example.com/audio3.mp3',
      durationSec: 14,
      status: 'approved',
      createdAt: '',
    }
  }
];

export default function DiscoverScreen() {
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [showSafetyPrompt, setShowSafetyPrompt] = useState(false);

  const handleConnect = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setShowSafetyPrompt(true);
  };

  const handleSafetyAccept = () => {
    setShowSafetyPrompt(false);
    if (selectedUser) {
      // Navigate to call screen or initiate call
      console.log('Starting call with:', selectedUser.name);
    }
  };

  const renderUserCard = (user: typeof mockUsers[0]) => (
    <View key={user.id} style={styles.userCard}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{user.name}, {user.age}</Text>
            {user.kycStatus === 'verified' && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          <View style={styles.locationRow}>
            <MapPin size={14} color={theme.colors.textSecondary} />
            <Text style={styles.locationText}>{user.tierCity} • {user.distance}km away</Text>
          </View>
        </View>
        <View style={[styles.onlineIndicator, { backgroundColor: user.isOnline ? theme.colors.success : theme.colors.textLight }]} />
      </View>

      <View style={styles.topicsContainer}>
        {user.topics.slice(0, 3).map((topic, index) => (
          <View key={index} style={styles.topicChip}>
            <Text style={styles.topicText}>{topic}</Text>
          </View>
        ))}
      </View>

      {user.profileIntro && (
        <View style={styles.introSection}>
          <View style={styles.introHeader}>
            <Play size={16} color={theme.colors.primary} />
            <Text style={styles.introLabel}>
              {user.profileIntro.type === 'audio' ? 'Audio' : 'Video'} Intro • {user.profileIntro.durationSec}s
            </Text>
          </View>
          
          {user.profileIntro.type === 'video' && user.profileIntro.thumbnailUrl && (
            <Image source={{ uri: user.profileIntro.thumbnailUrl }} style={styles.videoThumbnail} />
          )}
          
          <Text style={styles.introPreview}>{user.introPreview}</Text>
        </View>
      )}

      <View style={styles.cardFooter}>
        <View style={styles.rateInfo}>
          <CoinDisplay amount={user.perMinuteRate} size="sm" />
          <Text style={styles.rateText}>per minute</Text>
        </View>
        
        <View style={styles.rating}>
          <Text style={styles.ratingText}>⭐ {user.rating}</Text>
          <Text style={styles.callsText}>({user.totalCalls} calls)</Text>
        </View>
      </View>

      <Button
        title="Connect Now"
        onPress={() => handleConnect(user)}
        gradient
        style={styles.connectButton}
      />
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
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSubtitle}>Find amazing people to connect with</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
            <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
              <Text style={[styles.filterText, styles.filterTextActive]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>Online</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>Nearby</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>New</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.usersList}>
          {mockUsers.map(renderUserCard)}
        </View>
      </ScrollView>

      <SafetyPrompt
        visible={showSafetyPrompt}
        onAccept={handleSafetyAccept}
        onCancel={() => setShowSafetyPrompt(false)}
        type="call"
      />
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
  content: {
    flex: 1,
  },
  filtersContainer: {
    paddingVertical: theme.spacing.md,
  },
  filters: {
    paddingHorizontal: theme.spacing.lg,
  },
  filterChip: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  filterTextActive: {
    color: '#fff',
  },
  usersList: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  userCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  userName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  verifiedBadge: {
    backgroundColor: theme.colors.success,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: theme.fontWeight.bold,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  locationText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  topicChip: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  topicText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  introSection: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  introLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  videoThumbnail: {
    width: '100%',
    height: 120,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  introPreview: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  rateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  rateText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  rating: {
    alignItems: 'flex-end',
  },
  ratingText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  callsText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  connectButton: {
    marginTop: theme.spacing.sm,
  },
});