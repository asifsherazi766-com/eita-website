import { User, Post, Sound, Gift, CoinPackage, LiveRoom, Transaction, WithdrawalRequest, Comment } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_1',
    username: 'alikhan_official',
    displayName: 'Ali Khan 🔥',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: 'Digital Creator & Traveler 🇵🇰 | Join my daily Live 9PM | DM for Collabs 📩',
    link: 'https://instagram.com/alikhan',
    isVerified: true,
    isBanned: false,
    walletBalance: 650000, // 650k coins
    totalEarnings: 1850000, // 1.85M coins received
    followersCount: 142000,
    followingCount: 312,
    likesCount: 1890000,
    phone: '+92 300 1234567',
    email: 'ali@eita.app',
    role: 'creator',
    joinedAt: '2025-01-15'
  },
  {
    id: 'user_2',
    username: 'zara_vibes',
    displayName: 'Zara Sheikh ✨',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Singer & Songwriter 🎤 | New song out now! 🎶 Listen below',
    link: 'https://spotify.com/zara',
    isVerified: true,
    isBanned: false,
    walletBalance: 1200000,
    totalEarnings: 4200000,
    followersCount: 489000,
    followingCount: 180,
    likesCount: 5200000,
    phone: '+92 321 9876543',
    email: 'zara@eita.app',
    role: 'creator',
    joinedAt: '2024-11-20'
  },
  {
    id: 'user_3',
    username: 'bilal_foodie',
    displayName: 'Bilal Street Food 🍔',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    bio: 'Exploring Pakistan street food 🥘 Lahore, Karachi, Peshawar vibes! 🤤',
    link: 'https://youtube.com/@bilalfoodie',
    isVerified: true,
    isBanned: false,
    walletBalance: 300000,
    totalEarnings: 950000,
    followersCount: 94000,
    followingCount: 420,
    likesCount: 880000,
    phone: '+92 333 4567890',
    email: 'bilal@eita.app',
    role: 'creator',
    joinedAt: '2025-03-01'
  },
  {
    id: 'user_admin',
    username: 'admin_eita',
    displayName: 'EITA Official Admin 🛡️',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    bio: 'Official EITA Platform Moderation & Operations Account.',
    link: 'https://eita.app',
    isVerified: true,
    isBanned: false,
    walletBalance: 99999999,
    totalEarnings: 0,
    followersCount: 1500000,
    followingCount: 1,
    likesCount: 10000000,
    email: 'admin@eita.app',
    role: 'admin',
    joinedAt: '2024-01-01'
  }
];

export const INITIAL_SOUNDS: Sound[] = [
  {
    id: 'sound_1',
    title: 'Pasoori Vibes - Original Mix',
    author: 'Ali Sethi & Shae Gill',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=80',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    duration: 60
  },
  {
    id: 'sound_2',
    title: 'Neon Drift - Bass Boosted',
    author: 'Phonk Master',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&auto=format&fit=crop&q=80',
    audioUrl: 'https://actions.google.com/sounds/v1/water/creek_water_lapping.ogg',
    duration: 45
  },
  {
    id: 'sound_3',
    title: 'Sunset Acoustic Romance',
    author: 'Zara Sheikh',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&auto=format&fit=crop&q=80',
    audioUrl: 'https://actions.google.com/sounds/v1/weather/light_rain.ogg',
    duration: 90
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    type: 'video',
    userId: 'user_1',
    author: {
      id: 'user_1',
      username: 'alikhan_official',
      displayName: 'Ali Khan 🔥',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isVerified: true
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
    caption: 'Sunset in northern Pakistan hits completely different! Tag someone you want to travel here with 🏔️✨',
    hashtags: ['northernpakistan', 'travelvlog', 'eita', 'naturevibes', 'foryou'],
    sound: INITIAL_SOUNDS[0],
    location: 'Hunza Valley, Gilgit-Baltistan',
    duration: 30,
    likesCount: 48200,
    commentsCount: 1420,
    sharesCount: 3890,
    savesCount: 12400,
    isLiked: false,
    isSaved: false,
    createdAt: '2 hours ago'
  },
  {
    id: 'post_2',
    type: 'photo',
    userId: 'user_2',
    author: {
      id: 'user_2',
      username: 'zara_vibes',
      displayName: 'Zara Sheikh ✨',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      isVerified: true
    },
    photoUrls: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&auto=format&fit=crop&q=80'
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    caption: 'TikTok Photo Mode is finally here on EITA! 📸 Swipe through my golden hour photo dump 1-4. Which outfit is your fav? 💖',
    hashtags: ['photomode', 'ootd', 'aesthetic', 'goldenhour', 'girlspower'],
    sound: INITIAL_SOUNDS[2],
    location: 'Islamabad, Pakistan',
    duration: 15,
    likesCount: 92400,
    commentsCount: 3100,
    sharesCount: 7800,
    savesCount: 24500,
    isLiked: true,
    isSaved: true,
    createdAt: '4 hours ago'
  },
  {
    id: 'post_3',
    type: 'video',
    userId: 'user_3',
    author: {
      id: 'user_3',
      username: 'bilal_foodie',
      displayName: 'Bilal Street Food 🍔',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      isVerified: true
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    caption: 'Crispiest Biryani & Cheesy Bun Kabab at Burns Road Karachi! Rate this out of 10! 🤤🔥',
    hashtags: ['streetfood', 'karachi', 'foodtiktok', 'biryani', 'desifood'],
    sound: INITIAL_SOUNDS[1],
    location: 'Burns Road, Karachi',
    duration: 45,
    likesCount: 74200,
    commentsCount: 2280,
    sharesCount: 5120,
    savesCount: 16700,
    isLiked: false,
    isSaved: false,
    createdAt: '1 day ago'
  },
  {
    id: 'post_4',
    type: 'video',
    userId: 'user_1',
    author: {
      id: 'user_1',
      username: 'alikhan_official',
      displayName: 'Ali Khan 🔥',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isVerified: true
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    caption: '#DUET with @zara_vibes Trying out the new duet feature! Side by side vocals test 🎤🔥 Let me know what you think!',
    hashtags: ['duet', 'singing', 'musicduet', 'collab', 'eita'],
    sound: INITIAL_SOUNDS[2],
    location: 'Lahore, Pakistan',
    duration: 25,
    likesCount: 61500,
    commentsCount: 1890,
    sharesCount: 4210,
    savesCount: 9300,
    duetFrom: {
      postId: 'post_2',
      authorName: 'zara_vibes',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    },
    isLiked: false,
    isSaved: false,
    createdAt: '2 days ago'
  }
];

export const INITIAL_COMMENTS: Record<string, Comment[]> = {
  post_1: [
    {
      id: 'c_1',
      postId: 'post_1',
      userId: 'user_2',
      author: {
        id: 'user_2',
        username: 'zara_vibes',
        displayName: 'Zara Sheikh ✨',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        isVerified: true
      },
      text: 'Breathtaking scenery! Truly heaven on earth 🏔️❤️',
      likesCount: 342,
      isLiked: true,
      createdAt: '1h ago',
      replies: [
        {
          id: 'c_1_r1',
          postId: 'post_1',
          userId: 'user_1',
          author: {
            id: 'user_1',
            username: 'alikhan_official',
            displayName: 'Ali Khan 🔥',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            isVerified: true
          },
          text: '@zara_vibes You must visit this summer! It is unbelievable in person 🙌',
          likesCount: 88,
          createdAt: '45m ago'
        }
      ]
    },
    {
      id: 'c_2',
      postId: 'post_1',
      userId: 'user_3',
      author: {
        id: 'user_3',
        username: 'bilal_foodie',
        displayName: 'Bilal Street Food 🍔',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        isVerified: true
      },
      text: 'Next time try the local walnut cake in Hunza! Unmatched taste bro 🍰',
      likesCount: 156,
      createdAt: '30m ago'
    }
  ]
};

export const INITIAL_GIFTS: Gift[] = [
  {
    id: 'gift_1',
    name: 'Rose',
    coins: 1000,
    icon: '🌹',
    type: 'rose',
    description: 'Shower your favorite host with romantic red roses!'
  },
  {
    id: 'gift_2',
    name: 'Love',
    coins: 5000,
    icon: '💖',
    type: 'love',
    description: 'Send a sparkling heart surge across the whole screen!'
  },
  {
    id: 'gift_3',
    name: 'Perfume',
    coins: 10000,
    icon: '🧴',
    type: 'perfume',
    description: 'Luxury fragrance mist with golden sparklers!'
  },
  {
    id: 'gift_4',
    name: 'Sports Car',
    coins: 50000,
    icon: '🏎️',
    type: 'car',
    description: 'A roaring red supercar zooms across the entire screen!'
  },
  {
    id: 'gift_5',
    name: 'Private Jet',
    coins: 100000,
    icon: '✈️',
    type: 'jet',
    description: 'VIP supersonic jet flies over the room leaving rainbow smoke!'
  },
  {
    id: 'gift_6',
    name: 'Universe',
    coins: 250000,
    icon: '🌌',
    type: 'universe',
    description: 'The ultimate royal cosmos explosion covering the entire arena!'
  }
];

export const INITIAL_COIN_PACKAGES: CoinPackage[] = [
  {
    id: 'pkg_1',
    priceRs: 157,
    coins: 250000,
    isPopular: true,
    badge: 'BEST VALUE 🔥'
  },
  {
    id: 'pkg_2',
    priceRs: 350,
    coins: 600000
  },
  {
    id: 'pkg_3',
    priceRs: 700,
    coins: 1300000
  },
  {
    id: 'pkg_4',
    priceRs: 1500,
    coins: 3000000
  }
];

export const INITIAL_LIVE_ROOMS: LiveRoom[] = [
  {
    id: 'room_video_1',
    type: 'video',
    title: '🔥 PK BATTLE GRAND FINALE: Ali Khan vs Hamza Rajput! Send Gifts to Win 🏆',
    hostId: 'user_1',
    host: {
      id: 'user_1',
      username: 'alikhan_official',
      displayName: 'Ali Khan 🔥',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isVerified: true
    },
    cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    viewerCount: 4280,
    totalCoinsReceived: 890000,
    tags: ['PK Battle', 'Trending', 'Collab'],
    videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    isPKBattle: true,
    pkHostScore: 420000,
    pkTimeRemaining: 180,
    pkChallenger: {
      host: {
        id: 'user_chal_1',
        username: 'hamza_pk_king',
        displayName: 'Hamza Rajput 👑',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        isVerified: true
      },
      score: 380000,
      videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
    }
  },
  {
    id: 'room_voice_1',
    type: 'voice',
    title: '🎙️ POPPO/NITO CLUB 12-SEAT: Late Night Shayari & Acoustic Music 🎶',
    hostId: 'user_2',
    host: {
      id: 'user_2',
      username: 'zara_vibes',
      displayName: 'Zara Sheikh ✨',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      isVerified: true
    },
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    viewerCount: 1890,
    totalCoinsReceived: 450000,
    tags: ['Poppo Style', 'Music', '12 Seats', 'Talk Show'],
    backgroundTheme: 'luxury',
    announcement: 'Welcome to EITA Voice Arena! Mic rules: Respect everyone. Send gifts to level up!',
    seats: [
      {
        seatIndex: 0,
        isLocked: false,
        isMuted: false,
        isSpeaking: true,
        user: {
          id: 'user_2',
          username: 'zara_vibes',
          displayName: 'Zara Sheikh ✨',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          isVerified: true
        }
      },
      {
        seatIndex: 1,
        isLocked: false,
        isMuted: false,
        isSpeaking: false,
        user: {
          id: 'user_1',
          username: 'alikhan_official',
          displayName: 'Ali Khan 🔥',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          isVerified: true
        }
      },
      {
        seatIndex: 2,
        isLocked: false,
        isMuted: false,
        isSpeaking: true,
        user: {
          id: 'user_3',
          username: 'bilal_foodie',
          displayName: 'Bilal Street Food 🍔',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
          isVerified: true
        }
      },
      {
        seatIndex: 3,
        isLocked: false,
        isMuted: true,
        isSpeaking: false,
        user: {
          id: 'seat_u4',
          username: 'sami_rock',
          displayName: 'Sami Guitarist 🎸',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          isVerified: false
        }
      },
      { seatIndex: 4, isLocked: false, isMuted: false, user: null },
      { seatIndex: 5, isLocked: false, isMuted: false, user: null },
      { seatIndex: 6, isLocked: true, isMuted: false, user: null },
      { seatIndex: 7, isLocked: false, isMuted: false, user: null },
      { seatIndex: 8, isLocked: false, isMuted: false, user: null },
      { seatIndex: 9, isLocked: false, isMuted: false, user: null },
      { seatIndex: 10, isLocked: false, isMuted: false, user: null },
      { seatIndex: 11, isLocked: false, isMuted: false, user: null }
    ]
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'JC-982314',
    userId: 'user_1',
    type: 'recharge',
    amountCoins: 250000,
    amountRs: 157,
    paymentMethod: 'JazzCash',
    status: 'completed',
    reference: '03001234567',
    createdAt: '2026-11-01 18:32'
  },
  {
    id: 'EP-551928',
    userId: 'user_1',
    type: 'recharge',
    amountCoins: 600000,
    amountRs: 350,
    paymentMethod: 'Easypaisa',
    status: 'completed',
    reference: '03219876543',
    createdAt: '2026-10-30 14:15'
  },
  {
    id: 'GIFT-11294',
    userId: 'user_1',
    type: 'gift_sent',
    amountCoins: 100000,
    status: 'completed',
    reference: 'Private Jet to Zara Sheikh',
    targetUser: 'Zara Sheikh',
    createdAt: '2026-11-02 12:40'
  }
];

export const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'WD-10492',
    hostId: 'user_1',
    host: {
      id: 'user_1',
      username: 'alikhan_official',
      displayName: 'Ali Khan 🔥',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    },
    amountCoins: 1250000,
    amountRs: 500, // 250k coins = Rs 100, so 1.25M coins = Rs 500
    method: 'JazzCash',
    accountNumber: '03001234567',
    accountTitle: 'Ali Raza Khan',
    status: 'pending',
    createdAt: '2026-11-02 19:45'
  },
  {
    id: 'WD-09821',
    hostId: 'user_2',
    host: {
      id: 'user_2',
      username: 'zara_vibes',
      displayName: 'Zara Sheikh ✨',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    amountCoins: 2500000,
    amountRs: 1000,
    method: 'Easypaisa',
    accountNumber: '03219876543',
    accountTitle: 'Zara Sheikh',
    status: 'approved',
    createdAt: '2026-10-28 11:20',
    processedAt: '2026-10-28 14:05'
  }
];
