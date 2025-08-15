interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  
  track(event: string, properties?: Record<string, any>, userId?: string) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        timestamp: new Date().toISOString(),
        platform: 'mobile',
        ...properties,
      },
      userId,
    };
    
    this.events.push(analyticsEvent);
    console.log('📊 Analytics Event:', analyticsEvent);
    
    // In production, send to Mixpanel/Amplitude
    this.sendToProvider(analyticsEvent);
  }
  
  private async sendToProvider(event: AnalyticsEvent) {
    // Mock implementation - replace with actual analytics provider
    try {
      // await mixpanel.track(event.event, event.properties);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
  
  // Specific event methods
  trackSignup(method: string, userId: string) {
    this.track('user_signup', { method }, userId);
  }
  
  trackLogin(method: string, userId: string) {
    this.track('user_login', { method }, userId);
  }
  
  trackIntroUploaded(type: 'audio' | 'video', duration: number, userId: string) {
    this.track('intro_uploaded', { type, duration }, userId);
  }
  
  trackAdRewardStarted(userId: string) {
    this.track('ad_reward_started', {}, userId);
  }
  
  trackAdRewardCompleted(coinsEarned: number, userId: string) {
    this.track('ad_reward_completed', { coins_earned: coinsEarned }, userId);
  }
  
  trackCoinsSpent(amount: number, reason: string, userId: string) {
    this.track('coins_spent', { amount, reason }, userId);
  }
  
  trackStreakClaimed(day: number, coinsEarned: number, userId: string) {
    this.track('streak_day_awarded', { day, coins_earned: coinsEarned }, userId);
  }
  
  trackCallInitiated(calleeId: string, type: 'voice' | 'video', userId: string) {
    this.track('call_initiated', { callee_id: calleeId, call_type: type }, userId);
  }
  
  trackFirstCallSuccess(userId: string) {
    this.track('first_call_success', {}, userId);
  }
  
  trackRetention(day: number, userId: string) {
    this.track(`d${day}_retained`, {}, userId);
  }
  
  // Free Minutes Events
  trackFreeMinutesGranted(minutes: number, daysValid: number, userId: string) {
    this.track('free_minutes_granted', { minutes, days_valid: daysValid }, userId);
  }
  
  trackFreeMinutesUsed(minutesUsed: number, minutesRemaining: number, userId: string) {
    this.track('free_minutes_used', { minutes_used: minutesUsed, minutes_remaining: minutesRemaining }, userId);
  }
  
  trackFreeMinutesExpired(minutesUnused: number, userId: string) {
    this.track('free_minutes_expired', { minutes_unused: minutesUnused }, userId);
  }
  
  trackFreeMinutesToPaidSwitch(freeMinutesUsed: number, userId: string) {
    this.track('free_to_paid_switch', { free_minutes_used: freeMinutesUsed }, userId);
  }
  
  trackCallEndedFreeMinutes(duration: number, freeMinutesUsed: number, userId: string) {
    this.track('call_ended_free_minutes', { duration, free_minutes_used: freeMinutesUsed }, userId);
  }
}

export const analytics = new AnalyticsService();