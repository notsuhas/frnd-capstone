import { theme } from '@/constants/theme';
import { useAppStore } from '@/store/app-store';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Coins, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CallTimerProps {
  callId: string;
  calleeId: string;
  perMinuteRate: number;
  onEndCall: (duration: number, freeMinutesUsed: number, coinsUsed: number) => void;
  onSwitchToPaid?: () => void;
}

export function CallTimer({ 
  callId, 
  calleeId, 
  perMinuteRate, 
  onEndCall, 
  onSwitchToPaid 
}: CallTimerProps) {
  const { freeMinutes, wallet } = useAppStore();
  const [seconds, setSeconds] = useState(0);
  const [isUsingFreeMinutes, setIsUsingFreeMinutes] = useState(true);
  const [freeMinutesUsed, setFreeMinutesUsed] = useState(0);
  const [coinsUsed, setCoinsUsed] = useState(0);
  const [showSwitchPrompt, setShowSwitchPrompt] = useState(false);

  const minutes = Math.floor(seconds / 60);
  const hasFreeMinutes = freeMinutes && freeMinutes.freeMinutesRemaining > 0 && freeMinutes.freeMinutesDaysRemaining > 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEndCall = React.useCallback(() => {
    onEndCall(seconds, freeMinutesUsed, coinsUsed);
  }, [seconds, freeMinutesUsed, coinsUsed, onEndCall]);

  // Handle minute-based billing logic
  useEffect(() => {
    if (minutes === 0) return;
    
    // Check if we should switch from free minutes to paid
    if (isUsingFreeMinutes && hasFreeMinutes) {
      const minutesToDeduct = minutes - freeMinutesUsed;
      
      if (minutesToDeduct > 0) {
        const availableFreeMinutes = freeMinutes!.freeMinutesRemaining;
        const canUseFreeMinutes = Math.min(minutesToDeduct, availableFreeMinutes);
        
        if (canUseFreeMinutes > 0) {
          setFreeMinutesUsed(prev => prev + canUseFreeMinutes);
          // We'll handle the actual deduction in a separate effect
        }
        
        // If we've used all free minutes, show switch prompt
        if (canUseFreeMinutes < minutesToDeduct && !showSwitchPrompt) {
          setShowSwitchPrompt(true);
        }
      }
    }
    
    // Handle paid minutes
    if (!isUsingFreeMinutes || (hasFreeMinutes && freeMinutes!.freeMinutesRemaining === 0)) {
      const paidMinutes = minutes - freeMinutesUsed;
      if (paidMinutes > 0) {
        const coinsNeeded = paidMinutes * perMinuteRate;
        if (wallet && wallet.balanceCoins >= coinsNeeded) {
          const newCoinsUsed = coinsNeeded - coinsUsed;
          if (newCoinsUsed > 0) {
            setCoinsUsed(coinsNeeded);
            // We'll handle the actual coin deduction in a separate effect
          }
        } else {
          // Insufficient coins - end call
          handleEndCall();
          Alert.alert(
            'Insufficient Coins',
            'Your call has ended due to insufficient coins. Please add more coins to continue calling.',
            [{ text: 'OK', style: 'default' }]
          );
        }
      }
    }
  }, [minutes, isUsingFreeMinutes, hasFreeMinutes, freeMinutes, wallet, perMinuteRate, freeMinutesUsed, coinsUsed, showSwitchPrompt, handleEndCall]);

  // Simplified billing logic - just track usage, actual deduction happens on call end
  // This avoids the React hooks issue while maintaining the UI functionality

  const handleSwitchToPaid = () => {
    setIsUsingFreeMinutes(false);
    setShowSwitchPrompt(false);
    onSwitchToPaid?.();
  };



  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFreeMinutesRemaining = () => {
    if (!hasFreeMinutes) return 0;
    return Math.max(0, freeMinutes!.freeMinutesRemaining - (minutes - freeMinutesUsed));
  };

  return (
    <View style={styles.container}>
      {/* Timer Display */}
      <LinearGradient
        colors={isUsingFreeMinutes && hasFreeMinutes ? ['#10B981', '#059669'] : ['#8B5CF6', '#7C3AED']}
        style={styles.timerContainer}
      >
        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
        <View style={styles.statusContainer}>
          {isUsingFreeMinutes && hasFreeMinutes ? (
            <View style={styles.statusRow}>
              <Clock size={16} color="#fff" />
              <Text style={styles.statusText}>
                {getFreeMinutesRemaining()} free min left
              </Text>
            </View>
          ) : (
            <View style={styles.statusRow}>
              <Coins size={16} color="#fff" />
              <Text style={styles.statusText}>
                {perMinuteRate} coins/min
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* End Call Button */}
      <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
        <X size={24} color="#fff" />
      </TouchableOpacity>

      {/* Switch to Paid Prompt */}
      {showSwitchPrompt && (
        <View style={styles.promptOverlay}>
          <View style={styles.promptContainer}>
            <Text style={styles.promptTitle}>Your free minutes are over</Text>
            <Text style={styles.promptText}>
              Continue with {perMinuteRate} coins per minute?
            </Text>
            <View style={styles.promptButtons}>
              <TouchableOpacity 
                style={[styles.promptButton, styles.promptButtonSecondary]} 
                onPress={handleEndCall}
              >
                <Text style={styles.promptButtonTextSecondary}>End Call</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.promptButton, styles.promptButtonPrimary]} 
                onPress={handleSwitchToPaid}
              >
                <Text style={styles.promptButtonTextPrimary}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    zIndex: 1000,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  timerText: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statusText: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: theme.fontWeight.medium,
  },
  endCallButton: {
    backgroundColor: theme.colors.error,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: theme.colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  promptOverlay: {
    position: 'absolute',
    top: 0,
    left: -theme.spacing.lg,
    right: -theme.spacing.lg,
    bottom: -200,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
  },
  promptContainer: {
    backgroundColor: '#fff',
    margin: theme.spacing.lg,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    maxWidth: 300,
  },
  promptTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  promptText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  promptButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  promptButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    minWidth: 100,
    alignItems: 'center',
  },
  promptButtonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  promptButtonSecondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  promptButtonTextPrimary: {
    color: '#fff',
    fontWeight: theme.fontWeight.semibold,
    fontSize: theme.fontSize.md,
  },
  promptButtonTextSecondary: {
    color: theme.colors.text,
    fontWeight: theme.fontWeight.semibold,
    fontSize: theme.fontSize.md,
  },
});