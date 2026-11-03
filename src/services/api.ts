import { User, Post, Comment, Gift, CoinPackage, LiveRoom, Transaction, WithdrawalRequest } from '../types';

export const api = {
  // Auth
  async getMe(): Promise<User> {
    const res = await fetch('/api/auth/me');
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  async login(payload: {
    method: 'otp' | 'google' | 'password';
    identifier?: string;
    password?: string;
    phone?: string;
    googleEmail?: string;
    displayName?: string;
  }): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async switchUser(userId: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/switch-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch('/api/users');
    return res.json();
  },

  async followUser(userId: string): Promise<{ success: boolean; followersCount: number }> {
    const res = await fetch(`/api/users/${userId}/follow`, { method: 'POST' });
    return res.json();
  },

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Posts & Feeds
  async getPosts(feed: 'foryou' | 'following' = 'foryou', userId?: string): Promise<Post[]> {
    const url = userId ? `/api/posts?userId=${userId}` : `/api/posts?feed=${feed}`;
    const res = await fetch(url);
    return res.json();
  },

  async createPost(payload: Partial<Post>): Promise<{ success: boolean; post: Post }> {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async deletePost(postId: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    return res.json();
  },

  async likePost(postId: string): Promise<{ success: boolean; isLiked: boolean; likesCount: number }> {
    const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    return res.json();
  },

  async savePost(postId: string): Promise<{ success: boolean; isSaved: boolean; savesCount: number }> {
    const res = await fetch(`/api/posts/${postId}/save`, { method: 'POST' });
    return res.json();
  },

  async sharePost(postId: string): Promise<{ success: boolean; sharesCount: number }> {
    const res = await fetch(`/api/posts/${postId}/share`, { method: 'POST' });
    return res.json();
  },

  async reportPost(postId: string, reason: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/posts/${postId}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    return res.json();
  },

  // Comments
  async getComments(postId: string): Promise<Comment[]> {
    const res = await fetch(`/api/posts/${postId}/comments`);
    return res.json();
  },

  async addComment(postId: string, text: string, replyToCommentId?: string): Promise<{ success: boolean; comment: Comment }> {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, replyToCommentId })
    });
    return res.json();
  },

  // Live Rooms & Gifting
  async getRooms(): Promise<LiveRoom[]> {
    const res = await fetch('/api/rooms');
    return res.json();
  },

  async getRoom(id: string): Promise<LiveRoom> {
    const res = await fetch(`/api/rooms/${id}`);
    return res.json();
  },

  async sendRoomGift(roomId: string, giftId: string, count: number = 1, recipientId?: string) {
    const res = await fetch(`/api/rooms/${roomId}/gift`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ giftId, count, recipientId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send gift');
    return data;
  },

  async voiceSeatAction(roomId: string, action: 'take_seat' | 'leave_seat' | 'toggle_mute' | 'toggle_lock' | 'kick', seatIndex: number) {
    const res = await fetch(`/api/rooms/${roomId}/seat-action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, seatIndex })
    });
    return res.json();
  },

  async updateRoomTheme(roomId: string, theme: string) {
    const res = await fetch(`/api/rooms/${roomId}/theme`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme })
    });
    return res.json();
  },

  // Wallet, Coin Packages & Gateway
  async getPackages(): Promise<{ packages: CoinPackage[]; config: any }> {
    const res = await fetch('/api/packages');
    return res.json();
  },

  async getGifts(): Promise<Gift[]> {
    const res = await fetch('/api/gifts');
    return res.json();
  },

  async getTransactions(): Promise<Transaction[]> {
    const res = await fetch('/api/wallet/transactions');
    return res.json();
  },

  async rechargeCoins(payload: {
    packageId: string;
    method: 'JazzCash' | 'Easypaisa' | 'Card';
    accountNumber: string;
    mpin?: string;
  }) {
    const res = await fetch('/api/wallet/recharge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Recharge failed');
    return data;
  },

  async requestWithdrawal(payload: {
    amountCoins: number;
    method: 'JazzCash' | 'Easypaisa';
    accountNumber: string;
    accountTitle: string;
  }): Promise<{ success: boolean; message: string; withdrawal: WithdrawalRequest }> {
    const res = await fetch('/api/wallet/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Withdrawal failed');
    return data;
  },

  // Admin Panel (/admin_secret_eita)
  async getAdminStats() {
    const res = await fetch('/api/admin/stats');
    return res.json();
  },

  async getAdminUsers(): Promise<User[]> {
    const res = await fetch('/api/admin/users');
    return res.json();
  },

  async banUser(userId: string, isBanned: boolean) {
    const res = await fetch(`/api/admin/users/${userId}/ban`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBanned })
    });
    return res.json();
  },

  async verifyUser(userId: string, isVerified: boolean) {
    const res = await fetch(`/api/admin/users/${userId}/verify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVerified })
    });
    return res.json();
  },

  async adjustUserCoins(userId: string, amount: number, reason: string) {
    const res = await fetch(`/api/admin/users/${userId}/coins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, reason })
    });
    return res.json();
  },

  async getAdminWithdrawals(): Promise<WithdrawalRequest[]> {
    const res = await fetch('/api/admin/withdrawals');
    return res.json();
  },

  async approveWithdrawal(id: string) {
    const res = await fetch(`/api/admin/withdrawals/${id}/approve`, { method: 'PUT' });
    return res.json();
  },

  async rejectWithdrawal(id: string, reason: string) {
    const res = await fetch(`/api/admin/withdrawals/${id}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    return res.json();
  },

  async updateCoinRate(config: { package1PriceRs: number; package1Coins: number; hostPayoutRateRsPer250k: number }) {
    const res = await fetch('/api/admin/coin-rate', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return res.json();
  },

  async updateGift(giftId: string, data: Partial<Gift>) {
    const res = await fetch(`/api/admin/gifts/${giftId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
