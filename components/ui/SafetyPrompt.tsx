import { theme } from '@/constants/theme';
import { AlertTriangle, Shield } from 'lucide-react-native';
import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';

interface SafetyPromptProps {
  visible: boolean;
  onAccept: () => void;
  onCancel: () => void;
  type?: 'call' | 'general';
}

export function SafetyPrompt({ visible, onAccept, onCancel, type = 'call' }: SafetyPromptProps) {
  const isCall = type === 'call';
  
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Shield size={32} color={theme.colors.primary} />
            <Text style={styles.title}>Safety First</Text>
          </View>
          
          <View style={styles.content}>
            <View style={styles.warningBox}>
              <AlertTriangle size={20} color={theme.colors.warning} />
              <Text style={styles.warningText}>
                {isCall 
                  ? "You're about to start a call. Please remember:"
                  : "Welcome to our community. Please follow these guidelines:"
                }
              </Text>
            </View>
            
            <View style={styles.rules}>
              <Text style={styles.rule}>• No harassment or inappropriate behavior</Text>
              <Text style={styles.rule}>• No sharing of personal information</Text>
              <Text style={styles.rule}>• Respect others and be kind</Text>
              <Text style={styles.rule}>• Report any violations immediately</Text>
              {isCall && <Text style={styles.rule}>• You can end the call anytime</Text>}
            </View>
            
            <Text style={styles.footer}>
              Violations may result in account suspension or permanent ban.
            </Text>
          </View>
          
          <View style={styles.actions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={onCancel}
              style={styles.cancelButton}
            />
            <Button
              title={isCall ? "Start Call" : "I Understand"}
              onPress={onAccept}
              gradient
              style={styles.acceptButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  content: {
    marginBottom: theme.spacing.lg,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  warningText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: '#92400E',
    fontWeight: theme.fontWeight.medium,
  },
  rules: {
    marginBottom: theme.spacing.md,
  },
  rule: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  footer: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  acceptButton: {
    flex: 2,
  },
});