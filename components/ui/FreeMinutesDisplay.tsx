import { theme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FreeMinutesDisplayProps {
  minutes: number;
  daysRemaining: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  gradient?: boolean;
}

export function FreeMinutesDisplay({ 
  minutes, 
  daysRemaining, 
  size = 'md', 
  showIcon = true, 
  gradient = false 
}: FreeMinutesDisplayProps) {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  const fontSize = size === 'sm' ? theme.fontSize.sm : size === 'md' ? theme.fontSize.md : theme.fontSize.lg;

  const content = (
    <View style={styles.container}>
      {showIcon && <Clock size={iconSize} color={gradient ? '#fff' : theme.colors.primary} />}
      <View style={styles.textContainer}>
        <Text style={[styles.minutesText, { fontSize, color: gradient ? '#fff' : theme.colors.primary }]}>
          {minutes} min free
        </Text>
        {daysRemaining > 0 && (
          <Text style={[styles.daysText, { color: gradient ? 'rgba(255,255,255,0.8)' : theme.colors.textSecondary }]}>
            {daysRemaining} days left
          </Text>
        )}
      </View>
    </View>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={['#10B981', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <>{content}</>
      </LinearGradient>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  minutesText: {
    fontWeight: theme.fontWeight.semibold,
  },
  daysText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
  },
  gradient: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
});