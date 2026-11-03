import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import {
  INITIAL_USERS,
  INITIAL_POSTS,
  INITIAL_COMMENTS,
  INITIAL_GIFTS,
  INITIAL_COIN_PACKAGES,
  INITIAL_LIVE_ROOMS,
  INITIAL_TRANSACTIONS,
  INITIAL_WITHDRAWALS,
  INITIAL_SOUNDS
} from './src/mock/initialData.ts';
import { User, Post, Comment, Gift, CoinPackage, LiveRoom, Transaction, WithdrawalRequest } from './src/types/index.ts';

// In-Memory Database State
let users: User[] = JSON.parse(JSON.stringify(INITIAL_USERS));
let posts: Post[] = JSON.parse(JSON.stringify(INITIAL_POSTS));
let comments: Record<string, Comment[]> = JSON.parse(JSON.stringify(INITIAL_COMMENTS));
let gifts: Gift[] = JSON.parse(JSON.stringify(INITIAL_GIFTS));
let coinPackages: CoinPackage[] = JSON.parse(JSON.stringify(INITIAL_COIN_PACKAGES));
let liveRooms: LiveRoom[] = JSON.parse(JSON.stringify(INITIAL_LIVE_ROOMS));
let transactions: Transaction[] = JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS));
let withdrawals: WithdrawalRequest[] = JSON.parse(JSON.stringify(INITIAL_WITHDRAWALS));

let currentUserId = 'user_1'; // Active session

// Platform Coin Economics
let coinRateConfig = {
  package1PriceRs: 157,
  package1Coins: 250000,
  hostPayoutRateRsPer250k: 100, // Host gets Rs 100 per 250k coins
  platformProfitPer157: 57,      // EITA platform profit
  minWithdrawalRs: 500
};

async function main() {
  const app = express();
  app.use(express.json({ limit: '20mb' }));

  // Helper to get active user
  const getCurrentUser = () => users.find(u => u.id === currentUserId) || users[0];

  // ===================== AUTH & USER APIS =====================
  app.get('/api/auth/me', (_req: Request, res: Response) => {
    res.json(getCurrentUser());
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { method, identifier, password, phone, googleEmail, displayName } = req.body;
    let user = users.find(u => u.username === identifier || u.email === identifier || u.phone === identifier);
    
    if (method === 'google' && googleEmail) {
      user = users.find(u => u.email === googleEmail);
      if (!user) {
        user = {
          id: `user_${Date.now()}`,
          username: googleEmail.split('@')[0],
          displayName: displayName || 'Google User',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          bio: 'Welcome to my EITA profile! 🎬',
          link: '',
          isVerified: false,
          isBanned: false,
          walletBalance: 250000, // Starter bonus!
          totalEarnings: 0,
          followersCount: 0,
          followingCount: 1,
          likesCount: 0,
          email: googleEmail,
          role: 'user',
          joinedAt: new Date().toISOString().split('T')[0]
        };
        users.push(user);
      }
    } else if (method === 'otp' && phone) {
      user = users.find(u => u.phone === phone);
      if (!user) {
        user = {
          id: `user_${Date.now()}`,
          username: `user_${phone.slice(-4)}`,
          displayName: `EITA User ${phone.slice(-4)}`,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          bio: 'Verified with Phone OTP 📱',
          link: '',
          isVerified: false,
          isBanned: false,
          walletBalance: 250000,
          totalEarnings: 0,
          followersCount: 0,
          followingCount: 1,
          likesCount: 0,
          phone: phone,
          role: 'user',
          joinedAt: new Date().toISOString().split('T')[0]
        };
        users.push(user);
      }
    } else if (!user) {
      // Create user if username / password
      user = {
        id: `user_${Date.now()}`,
        username: identifier || 'new_user',
        displayName: displayName || identifier || 'EITA User',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        bio: 'Just joined EITA! 🎵',
        link: '',
        isVerified: false,
        isBanned: false,
        walletBalance: 250000,
        totalEarnings: 0,
        followersCount: 0,
        followingCount: 1,
        likesCount: 0,
        role: 'user',
        joinedAt: new Date().toISOString().split('T')[0]
      };
      users.push(user);
    }

    if (user.isBanned) {
      return res.status(403).json({ error: 'This account has been suspended by EITA Moderation.' });
    }

    currentUserId = user.id;
    res.json({ success: true, user });
  });

  app.post('/api/auth/switch-user', (req: Request, res: Response) => {
    const { userId } = req.body;
    const target = users.find(u => u.id === userId);
    if (target) {
      currentUserId = target.id;
      return res.json({ success: true, user: target });
    }
    res.status(404).json({ error: 'User not found' });
  });

  app.get('/api/users', (_req: Request, res: Response) => {
    res.json(users);
  });

  app.get('/api/users/:id', (req: Request, res: Response) => {
    const user = users.find(u => u.id === req.params.id || u.username === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });

  app.put('/api/users/:id', (req: Request, res: Response) => {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'User not found' });
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
  });

  app.post('/api/users/:id/follow', (req: Request, res: Response) => {
    const target = users.find(u => u.id === req.params.id);
    const me = getCurrentUser();
    if (!target) return res.status(404).json({ error: 'User not found' });

    // Toggle follow count
    target.followersCount += 1;
    me.followingCount += 1;
    res.json({ success: true, followersCount: target.followersCount });
  });

  // ===================== CONTENT (VIDEOS, PHOTO CAROUSEL, DUET, STITCH) =====================
  app.get('/api/posts', (req: Request, res: Response) => {
    const { feed, userId } = req.query;
    let filtered = [...posts];

    if (userId) {
      filtered = filtered.filter(p => p.userId === userId);
    } else if (feed === 'following') {
      // Sample following feed
      filtered = filtered.filter((_, idx) => idx % 2 === 0);
    }

    res.json(filtered);
  });

  app.post('/api/posts', (req: Request, res: Response) => {
    const me = getCurrentUser();
    const {
      type,
      caption,
      hashtags,
      videoUrl,
      photoUrls,
      sound,
      location,
      duration,
      duetFrom,
      stitchFrom
    } = req.body;

    const newPost: Post = {
      id: `post_${Date.now()}`,
      type: type || 'video',
      userId: me.id,
      author: {
        id: me.id,
        username: me.username,
        displayName: me.displayName,
        avatar: me.avatar,
        isVerified: me.isVerified
      },
      videoUrl: videoUrl || (type === 'video' ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' : undefined),
      photoUrls: photoUrls || (type === 'photo' ? ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'] : undefined),
      thumbnailUrl: photoUrls?.[0] || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      caption: caption || 'Check out my new post on EITA!',
      hashtags: hashtags || ['eita', 'trending', 'foryou'],
      sound: sound || INITIAL_SOUNDS[0],
      location: location || 'Pakistan',
      duration: duration || 15,
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      isLiked: false,
      isSaved: false,
      duetFrom,
      stitchFrom,
      createdAt: 'Just now'
    };

    posts.unshift(newPost);
    comments[newPost.id] = [];
    res.json({ success: true, post: newPost });
  });

  app.delete('/api/posts/:id', (req: Request, res: Response) => {
    posts = posts.filter(p => p.id !== req.params.id);
    delete comments[req.params.id];
    res.json({ success: true, message: 'Post removed' });
  });

  app.post('/api/posts/:id/like', (req: Request, res: Response) => {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.isLiked = !post.isLiked;
    post.likesCount += post.isLiked ? 1 : -1;
    res.json({ success: true, isLiked: post.isLiked, likesCount: post.likesCount });
  });

  app.post('/api/posts/:id/save', (req: Request, res: Response) => {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.isSaved = !post.isSaved;
    post.savesCount += post.isSaved ? 1 : -1;
    res.json({ success: true, isSaved: post.isSaved, savesCount: post.savesCount });
  });

  app.post('/api/posts/:id/share', (req: Request, res: Response) => {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.sharesCount += 1;
    res.json({ success: true, sharesCount: post.sharesCount });
  });

  app.post('/api/posts/:id/report', (req: Request, res: Response) => {
    const { reason } = req.body;
    res.json({ success: true, message: `Report received for: ${reason || 'Inappropriate content'}. EITA moderation will review.` });
  });

  // ===================== COMMENTS =====================
  app.get('/api/posts/:id/comments', (req: Request, res: Response) => {
    res.json(comments[req.params.id] || []);
  });

  app.post('/api/posts/:id/comments', (req: Request, res: Response) => {
    const { text, replyToCommentId } = req.body;
    const me = getCurrentUser();
    const postId = req.params.id;

    if (!comments[postId]) comments[postId] = [];

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      postId,
      userId: me.id,
      author: {
        id: me.id,
        username: me.username,
        displayName: me.displayName,
        avatar: me.avatar,
        isVerified: me.isVerified
      },
      text: text || '',
      likesCount: 0,
      isLiked: false,
      replyToCommentId,
      createdAt: 'Just now'
    };

    if (replyToCommentId) {
      const parent = comments[postId].find(c => c.id === replyToCommentId);
      if (parent) {
        if (!parent.replies) parent.replies = [];
        parent.replies.push(newComment);
      } else {
        comments[postId].unshift(newComment);
      }
    } else {
      comments[postId].unshift(newComment);
    }

    const post = posts.find(p => p.id === postId);
    if (post) post.commentsCount += 1;

    res.json({ success: true, comment: newComment });
  });

  // ===================== LIVE ROOMS (VIDEO PK + 12-SEAT VOICE) =====================
  app.get('/api/rooms', (_req: Request, res: Response) => {
    res.json(liveRooms);
  });

  app.get('/api/rooms/:id', (req: Request, res: Response) => {
    const room = liveRooms.find(r => r.id === req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  });

  // Send Gift inside Live Room
  app.post('/api/rooms/:id/gift', (req: Request, res: Response) => {
    const { giftId, count = 1, recipientId } = req.body;
    const room = liveRooms.find(r => r.id === req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const gift = gifts.find(g => g.id === giftId);
    if (!gift) return res.status(404).json({ error: 'Gift not found' });

    const me = getCurrentUser();
    const totalCost = gift.coins * count;

    if (me.walletBalance < totalCost) {
      return res.status(400).json({
        error: `Insufficient EITA Coins! You have ${me.walletBalance.toLocaleString()} Coins, but need ${totalCost.toLocaleString()} Coins. Please recharge.`
      });
    }

    // Deduct coins from sender
    me.walletBalance -= totalCost;

    // Credit earnings to recipient host
    const targetUserId = recipientId || room.hostId;
    const recipient = users.find(u => u.id === targetUserId);
    if (recipient) {
      recipient.totalEarnings += totalCost;
    }

    // Update room totals
    room.totalCoinsReceived += totalCost;
    if (room.isPKBattle) {
      if (recipientId && recipientId === room.pkChallenger?.host.id) {
        if (room.pkChallenger) room.pkChallenger.score += totalCost;
      } else {
        room.pkHostScore = (room.pkHostScore || 0) + totalCost;
      }
    }

    // Record transaction
    const tx: Transaction = {
      id: `GIFT-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: me.id,
      type: 'gift_sent',
      amountCoins: totalCost,
      status: 'completed',
      reference: `${count}x ${gift.name} to ${recipient?.displayName || room.host.displayName}`,
      targetUser: recipient?.displayName || room.host.displayName,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    transactions.unshift(tx);

    res.json({
      success: true,
      senderBalance: me.walletBalance,
      roomTotal: room.totalCoinsReceived,
      gift,
      count,
      pkHostScore: room.pkHostScore,
      pkChallengerScore: room.pkChallenger?.score
    });
  });

  // Voice Room Seat Actions (Take Seat, Leave, Mute, Lock, Kick)
  app.post('/api/rooms/:id/seat-action', (req: Request, res: Response) => {
    const { action, seatIndex, targetUserId } = req.body;
    const room = liveRooms.find(r => r.id === req.params.id);
    if (!room || !room.seats) return res.status(404).json({ error: 'Voice room not found' });

    const me = getCurrentUser();
    const seat = room.seats[seatIndex];
    if (!seat) return res.status(400).json({ error: 'Invalid seat index' });

    if (action === 'take_seat') {
      if (seat.isLocked) return res.status(403).json({ error: 'Seat is locked by Host' });
      if (seat.user) return res.status(409).json({ error: 'Seat already occupied' });
      seat.user = {
        id: me.id,
        username: me.username,
        displayName: me.displayName,
        avatar: me.avatar,
        isVerified: me.isVerified
      };
      seat.isMuted = false;
    } else if (action === 'leave_seat') {
      seat.user = null;
      seat.isSpeaking = false;
    } else if (action === 'toggle_mute') {
      seat.isMuted = !seat.isMuted;
    } else if (action === 'toggle_lock') {
      seat.isLocked = !seat.isLocked;
      if (seat.isLocked) seat.user = null;
    } else if (action === 'kick') {
      seat.user = null;
      seat.isSpeaking = false;
    }

    res.json({ success: true, seats: room.seats });
  });

  // Voice Room Theme update
  app.post('/api/rooms/:id/theme', (req: Request, res: Response) => {
    const { theme } = req.body;
    const room = liveRooms.find(r => r.id === req.params.id);
    if (room) {
      room.backgroundTheme = theme;
      return res.json({ success: true, theme });
    }
    res.status(404).json({ error: 'Room not found' });
  });

  // ===================== WALLET & PAYMENT GATEWAY (RECHARGE & WITHDRAWAL) =====================
  app.get('/api/packages', (_req: Request, res: Response) => {
    res.json({ packages: coinPackages, config: coinRateConfig });
  });

  app.get('/api/gifts', (_req: Request, res: Response) => {
    res.json(gifts);
  });

  app.get('/api/wallet/transactions', (req: Request, res: Response) => {
    const me = getCurrentUser();
    const userTxs = transactions.filter(t => t.userId === me.id);
    res.json(userTxs);
  });

  // Mock Payment Gateway for JazzCash, Easypaisa, Card
  app.post('/api/wallet/recharge', (req: Request, res: Response) => {
    const { packageId, method, accountNumber, mpin } = req.body;
    const pkg = coinPackages.find(p => p.id === packageId);
    if (!pkg) return res.status(404).json({ error: 'Invalid recharge package selected' });

    if (!accountNumber || accountNumber.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid account or phone number (e.g. 03001234567)' });
    }

    const me = getCurrentUser();
    
    // Credit coins
    me.walletBalance += pkg.coins;

    // Generate transaction ID
    const prefix = method === 'JazzCash' ? 'JC' : method === 'Easypaisa' ? 'EP' : 'CARD';
    const fakeTxId = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

    const tx: Transaction = {
      id: fakeTxId,
      userId: me.id,
      type: 'recharge',
      amountCoins: pkg.coins,
      amountRs: pkg.priceRs,
      paymentMethod: method,
      status: 'completed',
      reference: accountNumber,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    transactions.unshift(tx);

    res.json({
      success: true,
      transactionId: fakeTxId,
      coinsAdded: pkg.coins,
      newBalance: me.walletBalance,
      message: `Recharge Successful! ${pkg.coins.toLocaleString()} EITA Coins credited via ${method}.`
    });
  });

  // Host Withdrawal Request API
  app.post('/api/wallet/withdraw', (req: Request, res: Response) => {
    const { amountCoins, method, accountNumber, accountTitle } = req.body;
    const me = getCurrentUser();

    if (!accountNumber || !accountTitle) {
      return res.status(400).json({ error: 'Account number and account title are required' });
    }

    // Conversion: 250,000 Coins = Rs. 100
    // Amount in Rs = (Coins / 250,000) * 100
    const calculatedRs = Math.floor((amountCoins / coinRateConfig.package1Coins) * coinRateConfig.hostPayoutRateRsPer250k);

    if (calculatedRs < coinRateConfig.minWithdrawalRs) {
      return res.status(400).json({
        error: `Minimum withdrawal is Rs. ${coinRateConfig.minWithdrawalRs} (requires ${(coinRateConfig.minWithdrawalRs / coinRateConfig.hostPayoutRateRsPer250k * coinRateConfig.package1Coins).toLocaleString()} Coins).`
      });
    }

    if (me.totalEarnings < amountCoins) {
      return res.status(400).json({
        error: `Insufficient gift earnings! You have ${me.totalEarnings.toLocaleString()} Coins available to withdraw.`
      });
    }

    // Deduct from totalEarnings
    me.totalEarnings -= amountCoins;

    const newWd: WithdrawalRequest = {
      id: `WD-${Math.floor(10000 + Math.random() * 90000)}`,
      hostId: me.id,
      host: {
        id: me.id,
        username: me.username,
        displayName: me.displayName,
        avatar: me.avatar
      },
      amountCoins,
      amountRs: calculatedRs,
      method,
      accountNumber,
      accountTitle,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    withdrawals.unshift(newWd);

    // Also track in transactions
    transactions.unshift({
      id: newWd.id,
      userId: me.id,
      type: 'withdrawal',
      amountCoins,
      amountRs: calculatedRs,
      paymentMethod: method,
      status: 'pending',
      reference: `${accountTitle} (${accountNumber})`,
      createdAt: newWd.createdAt
    });

    res.json({
      success: true,
      withdrawal: newWd,
      remainingEarnings: me.totalEarnings,
      message: `Withdrawal request for Rs. ${calculatedRs.toLocaleString()} submitted successfully. Admin will approve within 24 hours.`
    });
  });

  // ===================== ADMIN PANEL APIS (/admin_secret_eita) =====================
  app.get('/api/admin/stats', (_req: Request, res: Response) => {
    const totalUsers = users.length;
    const totalPosts = posts.length;
    const recharges = transactions.filter(t => t.type === 'recharge' && t.status === 'completed');
    const totalCoinsSold = recharges.reduce((acc, t) => acc + t.amountCoins, 0);
    const totalRevenueRs = recharges.reduce((acc, t) => acc + (t.amountRs || 0), 0);
    const pendingWithdrawalsCount = withdrawals.filter(w => w.status === 'pending').length;
    
    // Profit logic: Rs. 57 profit per Rs. 157 package (or margin)
    const platformProfitRs = Math.round(totalRevenueRs * (coinRateConfig.platformProfitPer157 / coinRateConfig.package1PriceRs));

    res.json({
      totalUsers,
      totalPosts,
      totalCoinsSold,
      totalRevenueRs,
      platformProfitRs,
      pendingWithdrawalsCount,
      coinRateConfig
    });
  });

  app.get('/api/admin/users', (_req: Request, res: Response) => {
    res.json(users);
  });

  app.put('/api/admin/users/:id/ban', (req: Request, res: Response) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.isBanned = req.body.isBanned !== undefined ? req.body.isBanned : !user.isBanned;
    res.json({ success: true, user });
  });

  app.put('/api/admin/users/:id/verify', (req: Request, res: Response) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : !user.isVerified;
    res.json({ success: true, user });
  });

  app.post('/api/admin/users/:id/coins', (req: Request, res: Response) => {
    const { amount, reason } = req.body;
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.walletBalance += Number(amount);
    
    transactions.unshift({
      id: `ADMIN-${Date.now().toString().slice(-6)}`,
      userId: user.id,
      type: 'admin_adjust',
      amountCoins: Number(amount),
      status: 'completed',
      reference: reason || 'Admin manual balance adjustment',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });

    res.json({ success: true, user });
  });

  app.get('/api/admin/withdrawals', (_req: Request, res: Response) => {
    res.json(withdrawals);
  });

  app.put('/api/admin/withdrawals/:id/approve', (req: Request, res: Response) => {
    const wd = withdrawals.find(w => w.id === req.params.id);
    if (!wd) return res.status(404).json({ error: 'Withdrawal not found' });
    wd.status = 'approved';
    wd.processedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const tx = transactions.find(t => t.id === wd.id);
    if (tx) tx.status = 'completed';

    res.json({ success: true, withdrawal: wd });
  });

  app.put('/api/admin/withdrawals/:id/reject', (req: Request, res: Response) => {
    const { reason } = req.body;
    const wd = withdrawals.find(w => w.id === req.params.id);
    if (!wd) return res.status(404).json({ error: 'Withdrawal not found' });
    wd.status = 'rejected';
    wd.rejectionReason = reason || 'Account verification issue or invalid details.';
    wd.processedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    // Refund coins to host
    const host = users.find(u => u.id === wd.hostId);
    if (host) {
      host.totalEarnings += wd.amountCoins;
    }

    const tx = transactions.find(t => t.id === wd.id);
    if (tx) tx.status = 'rejected';

    res.json({ success: true, withdrawal: wd });
  });

  // Coin Rate Manager
  app.put('/api/admin/coin-rate', (req: Request, res: Response) => {
    const { package1PriceRs, package1Coins, hostPayoutRateRsPer250k } = req.body;
    if (package1PriceRs) coinRateConfig.package1PriceRs = Number(package1PriceRs);
    if (package1Coins) coinRateConfig.package1Coins = Number(package1Coins);
    if (hostPayoutRateRsPer250k) coinRateConfig.hostPayoutRateRsPer250k = Number(hostPayoutRateRsPer250k);
    
    coinRateConfig.platformProfitPer157 = coinRateConfig.package1PriceRs - coinRateConfig.hostPayoutRateRsPer250k;
    
    // Update package 1
    if (coinPackages[0]) {
      coinPackages[0].priceRs = coinRateConfig.package1PriceRs;
      coinPackages[0].coins = coinRateConfig.package1Coins;
    }

    res.json({ success: true, coinRateConfig, coinPackages });
  });

  // Gift Manager
  app.put('/api/admin/gifts/:id', (req: Request, res: Response) => {
    const gift = gifts.find(g => g.id === req.params.id);
    if (!gift) return res.status(404).json({ error: 'Gift not found' });
    if (req.body.coins) gift.coins = Number(req.body.coins);
    if (req.body.name) gift.name = req.body.name;
    if (req.body.icon) gift.icon = req.body.icon;
    res.json({ success: true, gift });
  });

  // ===================== FRONTEND INTEGRATION =====================
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 EITA TikTok Clone Server running on http://0.0.0.0:${PORT}`);
  });
}

main().catch(err => {
  console.error('Fatal Server error:', err);
});
