export type AppTheme = 'green' | 'red' | 'blue' | 'white' | 'light-grey';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  colorHex: string;
  badge: string;
  description: string;
  isDark: boolean;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  link: string;
  isVerified: boolean;
  isBanned: boolean;
  walletBalance: number; // EITA Coins
  totalEarnings: number; // Coins earned from gifts
  followersCount: number;
  followingCount: number;
  likesCount: number;
  phone?: string;
  email?: string;
  role: 'user' | 'creator' | 'admin';
  joinedAt: string;
}

export interface Sound {
  id: string;
  title: string;
  author: string;
  cover: string;
  audioUrl: string;
  duration: number;
}

export interface Post {
  id: string;
  type: 'video' | 'photo';
  userId: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
  };
  videoUrl?: string;
  photoUrls?: string[];
  thumbnailUrl: string;
  caption: string;
  hashtags: string[];
  sound: Sound;
  location: string;
  duration: number; // In seconds
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  duetFrom?: {
    postId: string;
    authorName: string;
    videoUrl: string;
  };
  stitchFrom?: {
    postId: string;
    authorName: string;
    videoUrl: string;
    startTime: number;
  };
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
  };
  text: string;
  likesCount: number;
  isLiked?: boolean;
  replyToCommentId?: string;
  replies?: Comment[];
  createdAt: string;
}

export type GiftType = 'rose' | 'love' | 'perfume' | 'car' | 'jet' | 'universe';

export interface Gift {
  id: string;
  name: string;
  coins: number;
  icon: string;
  type: GiftType;
  description: string;
}

export interface CoinPackage {
  id: string;
  priceRs: number;
  coins: number;
  isPopular?: boolean;
  badge?: string;
}

export type PaymentMethod = 'JazzCash' | 'Easypaisa' | 'Card';

export interface Transaction {
  id: string;
  userId: string;
  type: 'recharge' | 'gift_sent' | 'gift_received' | 'withdrawal' | 'admin_adjust';
  amountCoins: number;
  amountRs?: number;
  paymentMethod?: PaymentMethod;
  status: 'completed' | 'pending' | 'rejected';
  reference: string;
  targetUser?: string;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  hostId: string;
  host: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  amountCoins: number;
  amountRs: number;
  method: 'JazzCash' | 'Easypaisa';
  accountNumber: string;
  accountTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  processedAt?: string;
}

export interface VoiceSeat {
  seatIndex: number; // 0 is Host, 1-11 are Speakers
  isLocked: boolean;
  isMuted: boolean;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
  } | null;
  isSpeaking?: boolean;
}

export interface LiveRoom {
  id: string;
  type: 'video' | 'voice';
  title: string;
  hostId: string;
  host: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
  };
  cover: string;
  viewerCount: number;
  totalCoinsReceived: number;
  tags: string[];
  // Video room specifics:
  videoStreamUrl?: string;
  isPKBattle?: boolean;
  pkChallenger?: {
    host: {
      id: string;
      username: string;
      displayName: string;
      avatar: string;
      isVerified: boolean;
    };
    score: number;
    videoStreamUrl: string;
  };
  pkHostScore?: number;
  pkTimeRemaining?: number;
  // Voice room specifics:
  seats?: VoiceSeat[];
  backgroundTheme?: 'neon' | 'party' | 'royal' | 'galaxy' | 'luxury';
  announcement?: string;
}

export interface LiveChatMessage {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  isVerified?: boolean;
  text: string;
  type: 'chat' | 'gift' | 'system' | 'join';
  giftName?: string;
  giftIcon?: string;
  giftCount?: number;
  timestamp: string;
}
