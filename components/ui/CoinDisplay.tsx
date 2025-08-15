import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Coins } from 'lucide-react-native';
import { theme } from '@/constants/theme';

interface CoinDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  gradient?: boolean;
}

export function CoinDisplay({ amount, size = 'md', showIcon = true, gradient = false }: CoinDisplayProps) {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  const fontSize = size === 'sm' ? theme.fontSize.sm : size === 'md' ? theme.fontSize.md : theme.fontSize.lg;

  const content = (
    <View style={styles.container}>
      {showIcon && <Coins size={iconSize} color={gradient ? '#fff' : theme.colors.coin} />}
      <Text style={[styles.text, { fontSize, color: gradient ? '#fff' : theme.colors.coin }]}>
        {amount.toLocaleString()}
      </Text>
    </View>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={theme.colors.gradient.coin}
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
  text: {
    fontWeight: theme.fontWeight.semibold,
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