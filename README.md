# 🙏 GratiLog - Gratitude Journaling on Internet Computer

GratiLog is a modern, production-ready gratitude journaling application built on the Internet Computer blockchain. It combines personal reflection with community connection, allowing users to maintain private gratitude journals while optionally sharing entries with a supportive community.

## ✨ Features

### 🔒 **Personal & Private**
- **Secure Personal Journaling**: Write private gratitude entries with Internet Identity authentication
- **Streak Tracking**: Monitor your daily gratitude practice with current and longest streak tracking
- **Mood Analytics**: Track your emotional well-being with 5-point mood ratings
- **Category Organization**: Organize entries by Family, Health, Work, Friends, Nature, Achievement, Experience, and more

### 🌐 **Community Connection**
- **Public Sharing**: Choose to share your gratitude with the community
- **Appreciation System**: Show support for others' gratitude entries with appreciation reactions
- **Community Feed**: Discover and be inspired by others' gratitude stories

### 📊 **Analytics & Insights**
- **Personal Stats Dashboard**: View your gratitude journey with beautiful charts and metrics
- **Category Distribution**: See which areas of life you're most grateful for
- **Mood Trends**: Track your emotional patterns over time
- **System-wide Statistics**: View community engagement metrics

### 💻 **Modern UI/UX**
- **Beautiful Design**: Calming gradients and modern interface designed for mindfulness
- **Responsive Layout**: Works perfectly on desktop and mobile devices
- **Smooth Animations**: Framer Motion animations for delightful user experience
- **Accessible**: Built with accessibility standards in mind

## 🚀 Technology Stack

### Backend
- **Motoko**: ICP-native smart contract language for the backend canister
- **Internet Computer**: Decentralized blockchain platform ensuring data ownership
- **Stable Storage**: Persistent data storage across canister upgrades

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development for better code quality
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Beautiful charts for analytics visualization
- **Internet Identity**: Secure, anonymous authentication

### Development Tools
- **DFX**: DFINITY SDK for Internet Computer development
- **Vite**: Fast build tool for modern web development
- **PostCSS**: CSS processing with Tailwind integration

## 🛠️ Installation & Setup

### Prerequisites
- [DFX](https://internetcomputer.org/docs/current/developer-docs/setup/install/) (DFINITY SDK)
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GratiLog
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd src/GratiLog_frontend
   npm install
   cd ../..
   ```

3. **Start the local Internet Computer replica**
   ```bash
   dfx start --background
   ```

4. **Deploy Internet Identity (first time only)**
   ```bash
   dfx deploy internet_identity
   ```

5. **Deploy the application**
   ```bash
   dfx deploy
   ```

6. **Start the frontend development server**
   ```bash
   cd src/GratiLog_frontend
   npm start
   ```

Your application will be available at `http://localhost:3000`

## 📱 Usage Guide

### Getting Started
1. **Connect Your Wallet**: Click "Connect Wallet" to authenticate with Internet Identity
2. **Create Your First Entry**: Click "New Entry" to write your first gratitude entry
3. **Choose Privacy**: Decide whether to keep your entry private or share with the community
4. **Track Your Journey**: View your analytics in the Stats tab

### Writing Entries
- **Title**: Give your gratitude entry a meaningful title
- **Content**: Write about what you're grateful for and why
- **Category**: Select the most relevant category (Family, Health, Work, etc.)
- **Mood Rating**: Rate your current mood on a 1-5 scale
- **Public/Private**: Choose whether to share with the community

### Community Features
- **Browse Public Entries**: View gratitude entries shared by the community
- **Appreciate Others**: Show support by clicking the "Appreciate" button
- **Be Inspired**: Read others' gratitude stories for inspiration

### Analytics
- **Personal Dashboard**: View your total entries, streaks, and mood trends
- **Category Insights**: See which areas of life you focus on most
- **Mood Analytics**: Track your emotional well-being over time

## 🏗️ Architecture

### Backend Canister (`main.mo`)
```motoko
// Core data structures
type GratitudeEntry = {
  id: Nat;
  author: Principal;
  title: Text;
  content: Text;
  category: GratitudeCategory;
  mood_rating: Nat;
  is_public: Bool;
  created_at: Int;
  appreciations: Nat;
};

// Key functions
public func createEntry(input: EntryInput): async Result<GratitudeEntry>
public func getMyEntries(): async Result<[GratitudeEntry]>
public func getPublicEntries(): async Result<[GratitudeEntry]>
public func appreciateEntry(entryId: Nat): async Result<()>
public func getMyStats(): async Result<UserStats>
```

### Frontend Architecture
```
src/
├── components/           # React components
│   ├── Header.tsx       # Navigation header
│   ├── Navigation.tsx   # Tab navigation
│   ├── EntryCard.tsx    # Individual entry display
│   ├── CreateEntryModal.tsx  # Entry creation form
│   ├── StatsView.tsx    # Analytics dashboard
│   └── EmptyState.tsx   # Empty state components
├── contexts/
│   └── AuthContext.tsx  # Authentication state management
├── types/
│   └── index.ts         # TypeScript type definitions
├── utils/
│   ├── backend.ts       # Backend integration
│   └── constants.ts     # App constants and helpers
└── App.tsx              # Main application component
```

## 🔐 Security & Privacy

### Data Ownership
- **Your Data, Your Control**: All entries are stored on the Internet Computer under your Principal ID
- **Decentralized Storage**: No central authority controls your data
- **Immutable Records**: Entries are stored on the blockchain with full auditability

### Privacy Features
- **Anonymous Authentication**: Internet Identity provides anonymous yet secure authentication
- **Private by Default**: All entries are private unless explicitly shared
- **Secure Communication**: All data transmission is encrypted

### Security Measures
- **Principal-based Access**: Only you can access your private entries
- **Input Validation**: All user inputs are validated and sanitized
- **Error Handling**: Comprehensive error handling to prevent data loss

## 🎯 Business Model & Vision

### Mission
To create a positive, supportive community focused on gratitude and mental well-being while maintaining user privacy and data ownership.

### Core Values
- **Privacy First**: Your personal reflections remain private
- **Community Support**: Building connections through shared gratitude
- **Mental Health**: Promoting positive mental health through gratitude practice
- **Data Ownership**: Users maintain full control over their data

### Future Features
- **Premium Analytics**: Advanced mood tracking and insights
- **Gratitude Challenges**: Community challenges and goals
- **Export Functionality**: Export your gratitude journal
- **Meditation Integration**: Guided gratitude meditations
- **Social Features**: Follow favorite gratitude writers

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on how to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Internet Computer Community**: For building the decentralized web
- **DFINITY Foundation**: For the Internet Computer platform
- **TipJournal**: Reference project inspiration
- **Open Source Community**: For the amazing tools and libraries

## 📞 Support

If you encounter any issues or have questions:
- Create an issue on GitHub
- Join our community discussions
- Check our documentation

---

**Start your gratitude journey today with GratiLog!** 🌟

Built with ❤️ on the Internet Computer blockchain.