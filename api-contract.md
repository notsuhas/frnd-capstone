# API Contracts & Data Models

## Base URL
```
https://api.socialapp.com/v1
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All responses follow this structure:
```json
{
  "success": boolean,
  "data": any,
  "error": {
    "code": string,
    "message": string
  },
  "meta": {
    "timestamp": string,
    "requestId": string
  }
}
```

## Error Codes
- `AUTH_REQUIRED` - Authentication required
- `AUTH_INVALID` - Invalid or expired token
- `VALIDATION_ERROR` - Request validation failed
- `NOT_FOUND` - Resource not found
- `RATE_LIMITED` - Too many requests
- `INSUFFICIENT_COINS` - Not enough coins for operation
- `USER_BANNED` - User account is banned
- `CONTENT_REJECTED` - Content failed moderation

---

## Authentication Endpoints

### POST /auth/signup
Register a new user account.

**Request:**
```json
{
  "name": "string",
  "age": number,
  "gender": "male" | "female" | "other",
  "tierCity": "string",
  "intents": ["friendship" | "dating" | "casual"],
  "topics": ["string"],
  "languages": ["string"],
  "deviceFingerprint": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": User,
    "wallet": Wallet,
    "token": "string",
    "refreshToken": "string"
  }
}
```

### POST /auth/login
Authenticate existing user.

**Request:**
```json
{
  "phone": "string",
  "otp": "string",
  "deviceFingerprint": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": User,
    "wallet": Wallet,
    "dailyStreak": DailyStreak,
    "token": "string",
    "refreshToken": "string"
  }
}
```

---

## Profile Endpoints

### GET /profile/:userId
Get user profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": User,
    "profileIntro": ProfileIntro | null,
    "isBlocked": boolean,
    "canCall": boolean
  }
}
```

### POST /profile/intro
Upload profile intro (audio/video).

**Request (multipart/form-data):**
```
file: File (audio/video)
type: "audio" | "video"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "intro": ProfileIntro
  }
}
```

### PUT /profile
Update user profile.

**Request:**
```json
{
  "name": "string",
  "topics": ["string"],
  "intents": ["friendship" | "dating" | "casual"],
  "languages": ["string"]
}
```

---

## Discovery Endpoints

### GET /match
Get discovery matches based on preferences.

**Query Parameters:**
- `intent`: friendship | dating | casual
- `topic`: string
- `language`: string
- `safeStart`: boolean
- `limit`: number (default: 20)
- `offset`: number (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "user": User,
        "profileIntro": ProfileIntro,
        "distance": number,
        "perMinuteRate": number,
        "compatibility": number
      }
    ],
    "hasMore": boolean
  }
}
```

---

## Call Endpoints

### POST /call/initiate
Initiate a call with another user.

**Request:**
```json
{
  "calleeId": "string",
  "type": "voice" | "video"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "string",
    "agoraToken": "string",
    "channelName": "string",
    "perMinuteRate": number,
    "estimatedCost": number
  }
}
```

### POST /call/end
End an active call session.

**Request:**
```json
{
  "sessionId": "string",
  "duration": number,
  "rating": number,
  "feedback": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session": CallSession,
    "coinsDebited": number,
    "remainingBalance": number
  }
}
```

### GET /call/history
Get user's call history.

**Query Parameters:**
- `limit`: number (default: 20)
- `offset`: number (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "calls": [CallSession],
    "hasMore": boolean
  }
}
```

---

## Wallet Endpoints

### GET /wallet
Get wallet information.

**Response:**
```json
{
  "success": true,
  "data": {
    "wallet": Wallet,
    "transactions": [Transaction]
  }
}
```

### POST /wallet/purchase
Purchase coins with real money.

**Request:**
```json
{
  "packageId": "string",
  "paymentMethod": "razorpay" | "upi" | "card",
  "idempotencyKey": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "string",
    "paymentUrl": "string",
    "amount": number,
    "coins": number
  }
}
```

---

## Rewards Endpoints

### POST /rewards/starter/claim
Claim starter coins (one-time).

**Response:**
```json
{
  "success": true,
  "data": {
    "coinsAwarded": number,
    "expiryDate": "string",
    "newBalance": number
  }
}
```

### POST /rewards/streak/claim
Claim daily streak reward.

**Response:**
```json
{
  "success": true,
  "data": {
    "day": number,
    "coinsAwarded": number,
    "newStreak": DailyStreak,
    "newBalance": number
  }
}
```

### POST /rewards/ad/verify
Verify ad completion and award coins.

**Request:**
```json
{
  "adNetwork": "admob" | "ironsource",
  "adUnitId": "string",
  "impressionId": "string",
  "rewardAmount": number,
  "signature": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "verified": boolean,
    "coinsAwarded": number,
    "dailyAdsRemaining": number,
    "newBalance": number
  }
}
```

---

## Safety Endpoints

### POST /report
Report a user or content.

**Request:**
```json
{
  "targetUserId": "string",
  "sessionId": "string",
  "reason": "harassment" | "inappropriate" | "spam" | "fake",
  "description": "string",
  "evidenceUrl": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reportId": "string",
    "status": "submitted"
  }
}
```

### POST /block
Block a user.

**Request:**
```json
{
  "targetUserId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "blocked": true
  }
}
```

### GET /safety/prompts
Get localized safety prompts.

**Query Parameters:**
- `language`: string (default: "en")
- `type`: "call" | "general"

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "string",
    "message": "string",
    "rules": ["string"],
    "acceptText": "string",
    "cancelText": "string"
  }
}
```

---

## Admin Endpoints

### GET /admin/metrics
Get dashboard metrics (admin only).

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": number,
      "active": number,
      "new": number
    },
    "calls": {
      "total": number,
      "today": number,
      "avgDuration": number
    },
    "revenue": {
      "total": number,
      "today": number,
      "arppu": number
    },
    "retention": {
      "d1": number,
      "d7": number,
      "d30": number
    },
    "safety": {
      "reports": number,
      "bans": number,
      "pendingReviews": number
    }
  }
}
```

### GET /admin/reward-policy
Get current reward policy.

**Response:**
```json
{
  "success": true,
  "data": {
    "policy": RewardPolicy
  }
}
```

### PUT /admin/reward-policy
Update reward policy (admin only).

**Request:**
```json
{
  "starterCoinsAmount": number,
  "starterCoinsValidityDays": number,
  "coinsPerAd": number,
  "dailyAdCap": number,
  "streakCoinTable": {
    "1": number,
    "2": number,
    "3": number,
    "4": number,
    "5": number,
    "6": number,
    "7": number
  },
  "dynamicPricingEnabled": boolean
}
```

### GET /admin/moderation/queue
Get content moderation queue.

**Query Parameters:**
- `type`: "intro" | "report" | "all"
- `status`: "pending" | "approved" | "rejected"
- `limit`: number (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "type": "intro" | "report",
        "userId": "string",
        "userName": "string",
        "content": any,
        "status": "pending" | "approved" | "rejected",
        "createdAt": "string",
        "priority": "low" | "medium" | "high"
      }
    ],
    "hasMore": boolean
  }
}
```

### POST /admin/moderation/action
Take moderation action.

**Request:**
```json
{
  "itemId": "string",
  "action": "approve" | "reject" | "ban",
  "reason": "string",
  "notes": "string"
}
```

---

## Data Models

### User
```typescript
interface User {
  id: string;
  role: 'user' | 'creator' | 'moderator' | 'admin';
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  tierCity: string;
  intents: ('friendship' | 'dating' | 'casual')[];
  topics: string[];
  languages: string[];
  kycStatus: 'pending' | 'verified' | 'rejected';
  deviceFingerprint: string;
  profileIntro?: ProfileIntro;
  isOnline: boolean;
  rating: number;
  totalCalls: number;
  createdAt: string;
  lastActiveAt: string;
  banStatus?: {
    isBanned: boolean;
    banReason: string;
    banExpiresAt: string;
  };
}
```

### ProfileIntro
```typescript
interface ProfileIntro {
  id: string;
  userId: string;
  type: 'audio' | 'video';
  url: string;
  thumbnailUrl?: string;
  durationSec: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}
```

### Wallet
```typescript
interface Wallet {
  userId: string;
  balanceCoins: number;
  starterCoins: number;
  starterCoinsExpiryAt: string;
  lastClaimedAt?: string;
  totalEarned: number;
  totalSpent: number;
  totalPurchased: number;
}
```

### DailyStreak
```typescript
interface DailyStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastClaimedDate: string;
  streakStartDate: string;
  totalCoinsEarned: number;
}
```

### CallSession
```typescript
interface CallSession {
  id: string;
  callerId: string;
  calleeId: string;
  type: 'voice' | 'video';
  startAt: string;
  endAt?: string;
  durationSec: number;
  perMinuteRate: number;
  coinsDebited: number;
  ratingCaller?: number;
  ratingCallee?: number;
  feedbackCaller?: string;
  feedbackCallee?: string;
  flags: string[];
  status: 'initiated' | 'connected' | 'ended' | 'failed';
  agoraChannelName: string;
}
```

### Transaction
```typescript
interface Transaction {
  id: string;
  userId: string;
  type: 'purchase' | 'earn' | 'spend' | 'refund';
  amount: number;
  description: string;
  metadata: Record<string, any>;
  createdAt: string;
  status: 'pending' | 'completed' | 'failed';
}
```

### RewardPolicy
```typescript
interface RewardPolicy {
  starterCoinsAmount: number;
  starterCoinsValidityDays: number;
  coinsPerAd: number;
  dailyAdCap: number;
  adCooldownSec: number;
  streakCoinTable: Record<number, number>;
  dynamicPricingEnabled: boolean;
  maxDailyEarnings: number;
  fraudScoreThreshold: number;
}
```

---

## Rate Limits

- **Authentication**: 5 requests per minute per IP
- **Profile Updates**: 10 requests per hour per user
- **Call Initiation**: 20 requests per hour per user
- **Ad Verification**: 50 requests per hour per user
- **General API**: 1000 requests per hour per user

## Webhooks

### Ad Network Verification
```
POST /webhooks/ad-verification
```

### Payment Confirmation
```
POST /webhooks/payment-confirmation
```

### Content Moderation
```
POST /webhooks/moderation-result
```

---

This API contract provides a comprehensive foundation for building the social discovery app with proper error handling, security, and scalability considerations.