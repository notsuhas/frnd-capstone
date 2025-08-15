# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# FRND-Style Social Discovery App

A production-ready, safety-first audio/video social discovery app built with React Native and Expo, featuring week-1 retention mechanics and comprehensive admin tools.

## 🎯 Key Features

### Core Retention Features
1. **Earn Coins by Watching Ads** - Rewarded video integration with daily caps and fraud protection
2. **Daily Login Rewards & Streaks** - Progressive coin rewards for consecutive daily logins
3. **First 7 Days Free Coins** - Starter coins that expire after 7 days to drive early engagement
4. **Short Audio/Video Profile Intros** - 10-15 second profile previews with moderation queue

### Safety & Trust
- Pre-call safety prompts on all platforms
- In-call controls (mute, end, block, report)
- Content moderation for profile intros
- Strike-based enforcement system
- Device fingerprinting for ban evasion prevention

### Discovery & Matching
- Topic-based filtering and matching
- Intent-based discovery (friendship, dating, casual)
- Language and location preferences
- Real-time online status
- Creator rating system

### Monetization
- Coin-based economy with per-minute call rates
- In-app purchases for coin packs
- Creator earnings and payout system
- Dynamic pricing capabilities

## 🏗️ Architecture

### Frontend (React Native + Expo)
- **State Management**: Zustand for global state
- **Navigation**: Expo Router with file-based routing
- **UI Components**: Custom component library with theme system
- **Analytics**: Integrated event tracking system
- **Persistence**: AsyncStorage for offline state

### Backend APIs (Contracts Defined)
- RESTful API design with proper error handling
- Authentication and user management
- Real-time call session management
- Reward policy configuration
- Content moderation workflows

### Admin Dashboard
- Web-based admin interface
- Reward policy management
- Content moderation queue
- User analytics and retention metrics
- Creator payout management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd social-discovery-app
npm install
```

2. **Start the development server**
```bash
npm start
```

3. **Run on different platforms**
```bash
# iOS Simulator
npm run ios

# Android Emulator  
npm run android

# Web browser
npm run web
```

### Environment Setup

Create a `.env.example` file:
```env
# API Configuration
API_BASE_URL=https://api.yourapp.com
API_KEY=your_api_key

# Analytics
MIXPANEL_TOKEN=your_mixpanel_token
AMPLITUDE_API_KEY=your_amplitude_key

# Ad Networks
ADMOB_APP_ID=your_admob_app_id
ADMOB_REWARDED_AD_UNIT_ID=your_rewarded_ad_unit

# Call Services
AGORA_APP_ID=your_agora_app_id
TWILIO_ACCOUNT_SID=your_twilio_sid

# Push Notifications
FCM_SERVER_KEY=your_fcm_server_key

# Feature Flags
ENABLE_SAFE_START=true
ENABLE_STARTER_COINS=true
ENABLE_AD_FOR_COINS=true
ENABLE_STREAKS=true
ENABLE_INTROS=true
```

## 📱 App Structure

```
app/
├── (tabs)/                 # Main tab navigation
│   ├── index.tsx          # Home screen with streaks & quick actions
│   ├── discover.tsx       # User discovery and matching
│   ├── earn.tsx           # Ad rewards and earning methods
│   └── profile.tsx        # User profile and settings
├── admin/                 # Admin dashboard
│   └── index.tsx          # Admin interface
├── onboarding/            # User onboarding flow
├── call/                  # Call interface screens
└── _layout.tsx            # Root navigation setup

components/
├── ui/                    # Reusable UI components
│   ├── Button.tsx
│   ├── CoinDisplay.tsx
│   └── SafetyPrompt.tsx
└── ...

store/
├── app-store.ts           # Global app state (Zustand)
└── ...

services/
├── analytics.ts           # Event tracking service
├── api.ts                 # API client
└── ...

types/
├── user.ts                # User and app type definitions
└── ...
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient (#8B5CF6 → #EC4899) - Social/dating feel
- **Secondary**: Gold (#F59E0B) - Coins and rewards
- **Success**: Green (#10B981) - Verification and positive actions
- **Error**: Red (#EF4444) - Reports and warnings

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Medium weight for readability
- **UI Elements**: Semibold for buttons and labels

### Components
- Gradient buttons for primary actions
- Card-based layouts with subtle shadows
- Smooth animations for rewards and interactions
- Consistent spacing and border radius

## 📊 Analytics Events

### User Journey
- `user_signup`, `user_login`
- `intro_uploaded`, `intro_approved`, `intro_rejected`
- `call_initiated`, `first_call_success`
- `d1_retained`, `d7_retained`

### Monetization
- `ad_reward_started`, `ad_reward_completed`
- `coins_spent`, `coins_purchased`
- `streak_day_awarded`, `streak_reset`
- `starter_coins_granted`, `starter_coins_expired`

### Safety
- `safety_prompt_shown`, `user_reported`, `user_blocked`
- `call_ended_early`, `harassment_detected`

## 🔧 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Profile & Discovery
- `GET /profile/:id` - Get user profile
- `POST /profile/intro` - Upload profile intro
- `GET /match` - Get discovery matches

### Calls & Sessions
- `POST /call/initiate` - Start a call session
- `POST /call/end` - End call and process billing
- `GET /call/history` - Get call history

### Wallet & Rewards
- `GET /wallet` - Get wallet balance
- `POST /wallet/purchase` - Purchase coins
- `POST /rewards/ad/verify` - Verify ad completion
- `POST /rewards/streak/claim` - Claim daily streak

### Admin
- `GET /admin/metrics` - Dashboard metrics
- `PUT /admin/reward-policy` - Update reward settings
- `GET /admin/moderation/queue` - Pending content
- `POST /admin/moderation/action` - Approve/reject content

## 🛡️ Safety Features

### Pre-Call Safety
- Mandatory safety prompt before first call
- Localized safety guidelines
- Clear reporting mechanisms

### In-Call Protection
- Real-time audio content filtering
- Easy access to mute, end, block controls
- Post-call rating system

### Content Moderation
- ML + human review for profile intros
- Automated NSFW detection
- Strike-based enforcement

### Privacy Protection
- Pseudonymous profiles by default
- No personal information sharing
- Secure payment processing

## 📈 Retention Strategy

### Week 1 Focus
1. **Day 0**: Starter coins + safety onboarding
2. **Day 1-3**: Daily streak building + ad rewards
3. **Day 4-7**: Profile intro completion + first calls
4. **Day 7+**: Social features + creator earnings

### Engagement Mechanics
- **Immediate Gratification**: Instant coin rewards
- **Progress Tracking**: Visible streak counters
- **Social Proof**: Ratings and verification badges
- **FOMO**: Expiring starter coins

### A/B Testing
- Reward amounts and timing
- Safety prompt messaging
- Discovery algorithm parameters
- UI/UX variations

## 🚀 Deployment

### Mobile Apps
1. Build with EAS Build
2. Submit to App Store and Google Play
3. Configure push notifications
4. Set up crash reporting

### Admin Dashboard
1. Deploy to Vercel/Netlify
2. Configure environment variables
3. Set up authentication
4. Enable SSL/HTTPS

### Backend Services
1. Deploy API to cloud provider
2. Set up database (PostgreSQL recommended)
3. Configure Redis for caching
4. Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

---

Built with ❤️ using React Native, Expo, and modern mobile development practices.