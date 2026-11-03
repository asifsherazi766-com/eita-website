import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ArrowLeft,
  Users,
  Video,
  Coins,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Ban,
  Trash2,
  Edit2,
  Plus,
  RefreshCw,
  Clock,
  Sparkles,
  Save,
  DollarSign
} from 'lucide-react';
import { AppTheme, Post, User, Gift, WithdrawalRequest } from '../types';
import { api } from '../services/api';
import { THEMES_LIST } from './ThemeSelectorModal';

interface AdminPanelProps {
  onClose: () => void;
  onRefreshAll: () => void;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onClose,
  onRefreshAll,
  currentTheme,
  onSelectTheme
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'content' | 'gifts' | 'coinrate' | 'withdrawals' | 'themes'>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [postsList, setPostsList] = useState<Post[]>([]);
  const [giftsList, setGiftsList] = useState<Gift[]>([]);
  const [withdrawalsList, setWithdrawalsList] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Coin Rate Edit Form
  const [ratePkgPrice, setRatePkgPrice] = useState(157);
  const [ratePkgCoins, setRatePkgCoins] = useState(250000);
  const [rateHostPayout, setRateHostPayout] = useState(100);
  const [rateSavedMsg, setRateSavedMsg] = useState(false);

  // Manual Coin Add modal state
  const [adjustUserId, setAdjustUserId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(50000);
  const [adjustReason, setAdjustReason] = useState('Creator bonus reward');

  // Withdrawal Reject Modal
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Invalid phone number or account mismatch');

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [s, u, p, g, w] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getPosts('foryou'),
        api.getGifts(),
        api.getAdminWithdrawals()
      ]);
      setStats(s);
      setUsersList(u);
      setPostsList(p);
      setGiftsList(g);
      setWithdrawalsList(w);

      if (s.coinRateConfig) {
        setRatePkgPrice(s.coinRateConfig.package1PriceRs);
        setRatePkgCoins(s.coinRateConfig.package1Coins);
        setRateHostPayout(s.coinRateConfig.hostPayoutRateRsPer250k);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (user: User) => {
    await api.banUser(user.id, !user.isBanned);
    loadAllAdminData();
    onRefreshAll();
  };

  const handleToggleVerify = async (user: User) => {
    await api.verifyUser(user.id, !user.isVerified);
    loadAllAdminData();
    onRefreshAll();
  };

  const handleAdjustCoins = async () => {
    if (!adjustUserId) return;
    await api.adjustUserCoins(adjustUserId, adjustAmount, adjustReason);
    setAdjustUserId(null);
    loadAllAdminData();
    onRefreshAll();
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm('Are you sure you want to moderate and delete this post?')) {
      await api.deletePost(postId);
      loadAllAdminData();
      onRefreshAll();
    }
  };

  const handleApproveWithdrawal = async (id: string) => {
    await api.approveWithdrawal(id);
    loadAllAdminData();
    onRefreshAll();
  };

  const handleRejectWithdrawal = async () => {
    if (!rejectId) return;
    await api.rejectWithdrawal(rejectId, rejectReason);
    setRejectId(null);
    loadAllAdminData();
    onRefreshAll();
  };

  const handleSaveCoinRate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.updateCoinRate({
      package1PriceRs: Number(ratePkgPrice),
      package1Coins: Number(ratePkgCoins),
      hostPayoutRateRsPer250k: Number(rateHostPayout)
    });
    setRateSavedMsg(true);
    setTimeout(() => setRateSavedMsg(false), 2500);
    loadAllAdminData();
    onRefreshAll();
  };

  const handleUpdateGiftPrice = async (giftId: string, coins: number) => {
    await api.updateGift(giftId, { coins });
    loadAllAdminData();
    onRefreshAll();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950 text-white overflow-hidden">
      {/* Top Admin Navbar */}
      <div className="px-4 py-3 bg-neutral-900 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight">EITA Master Admin Panel</h1>
              <span className="text-[10px] text-amber-400/90 font-mono">/admin_secret_eita</span>
            </div>
          </div>
        </div>

        <button
          onClick={loadAllAdminData}
          className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-1 px-4 py-2 bg-neutral-900/60 border-b border-white/5 overflow-x-auto no-scrollbar shrink-0">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'users', label: `Users (${usersList.length})` },
          { id: 'content', label: `Content Moderation (${postsList.length})` },
          { id: 'withdrawals', label: `Withdrawals (${withdrawalsList.filter(w => w.status === 'pending').length} Pending)` },
          { id: 'coinrate', label: 'Coin Rate Manager' },
          { id: 'gifts', label: 'Gift Manager' },
          { id: 'themes', label: '🎨 Theme Manager' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[var(--color-primary)] text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full space-y-4 no-scrollbar">
        {/* ================= 1. DASHBOARD OVERVIEW ================= */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Platform Overview & Business Metrics
            </h2>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10">
                <div className="flex items-center justify-between text-neutral-400 mb-1">
                  <span className="text-[11px] font-bold">Total Users</span>
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-2xl font-black text-white font-mono">
                  {stats.totalUsers}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10">
                <div className="flex items-center justify-between text-neutral-400 mb-1">
                  <span className="text-[11px] font-bold">Total Posts</span>
                  <Video className="w-4 h-4 text-pink-400" />
                </div>
                <span className="text-2xl font-black text-white font-mono">
                  {stats.totalPosts}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10">
                <div className="flex items-center justify-between text-neutral-400 mb-1">
                  <span className="text-[11px] font-bold">Coins Sold</span>
                  <Coins className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-xl font-black text-amber-300 font-mono">
                  {stats.totalCoinsSold.toLocaleString()}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10">
                <div className="flex items-center justify-between text-neutral-400 mb-1">
                  <span className="text-[11px] font-bold">Gross Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  Rs. {stats.totalRevenueRs.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Economics & Profit Card */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">EITA Platform Economics</h3>
              </div>
              <p className="text-xs text-neutral-300 mb-3">
                Calculated based on core rule: <strong>Package 1 = Rs. 157 for 250,000 Coins</strong>. Creator cashout payout is <strong>Rs. 100 per 250,000 Coins</strong>.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                  <span className="text-[10px] text-neutral-400 block">Your Net Profit Per 157 Pkg:</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">Rs. 57 (36.3% Margin)</span>
                </div>
                <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                  <span className="text-[10px] text-neutral-400 block">Estimated Platform Profit:</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">Rs. {stats.platformProfitRs.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                  <span className="text-[10px] text-neutral-400 block">Pending Withdrawals:</span>
                  <span className="text-lg font-black text-amber-400 font-mono">{stats.pendingWithdrawalsCount}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. USER MANAGER ================= */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Registered Users & Creator Accounts
            </h2>

            <div className="space-y-2">
              {usersList.map((user) => (
                <div
                  key={user.id}
                  className="p-3 rounded-2xl bg-neutral-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{user.displayName}</span>
                        {user.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                        )}
                        {user.isBanned && (
                          <span className="px-1.5 py-0.2 bg-rose-600 text-white rounded text-[9px] font-black uppercase">
                            Banned
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-400 block">
                        @{user.username} · Role: {user.role}
                      </span>
                      <div className="flex items-center gap-3 text-[10px] text-neutral-400 mt-1">
                        <span>🪙 {user.walletBalance.toLocaleString()} Coins</span>
                        <span>🎁 {user.totalEarnings.toLocaleString()} Earned</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => handleToggleVerify(user)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        user.isVerified
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {user.isVerified ? 'Blue Tick ✓' : '+ Give Blue Tick'}
                    </button>

                    <button
                      onClick={() => setAdjustUserId(user.id)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 cursor-pointer"
                    >
                      + Add Coins
                    </button>

                    <button
                      onClick={() => handleToggleBan(user)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        user.isBanned
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/40 hover:bg-rose-900'
                      }`}
                    >
                      {user.isBanned ? 'Unban' : 'Ban'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 3. CONTENT MODERATION ================= */}
        {activeTab === 'content' && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              All Videos & Photo Carousels ({postsList.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {postsList.map((post) => (
                <div
                  key={post.id}
                  className="p-3 rounded-2xl bg-neutral-900 border border-white/10 flex items-start gap-3 relative"
                >
                  <img
                    src={post.thumbnailUrl}
                    alt={post.caption}
                    className="w-18 h-24 rounded-xl object-cover shrink-0 border border-white/10"
                  />
                  <div className="flex-1 min-w-0 pr-8">
                    <span className="text-xs font-bold text-white block truncate">
                      @{post.author.username}
                    </span>
                    <p className="text-[11px] text-neutral-300 line-clamp-2 mt-0.5">
                      {post.caption}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-neutral-400 mt-2 font-mono">
                      <span>❤️ {post.likesCount}</span>
                      <span>💬 {post.commentsCount}</span>
                      <span>Format: {post.type}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-rose-950 text-rose-400 hover:bg-rose-900 transition-colors cursor-pointer"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. WITHDRAWAL APPROVAL ================= */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Host Cashout & Withdrawal Requests ({withdrawalsList.length})
            </h2>

            <div className="space-y-2.5">
              {withdrawalsList.map((wd) => (
                <div
                  key={wd.id}
                  className="p-4 rounded-2xl bg-neutral-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{wd.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          wd.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : wd.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {wd.status}
                      </span>
                      <span className="text-[10px] text-neutral-400">· {wd.createdAt}</span>
                    </div>

                    <div className="mt-1 text-xs text-neutral-200">
                      <strong>{wd.host.displayName}</strong> (@{wd.host.username})
                    </div>
                    <div className="text-xs text-neutral-400 mt-0.5 font-mono">
                      Method: <span className="text-white font-bold">{wd.method}</span> · Account:{' '}
                      <span className="text-white font-bold">{wd.accountNumber}</span> ({wd.accountTitle})
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-sm font-black text-emerald-400 font-mono block">
                        Rs. {wd.amountRs.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {wd.amountCoins.toLocaleString()} Coins
                      </span>
                    </div>

                    {wd.status === 'pending' && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleApproveWithdrawal(wd.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => setRejectId(wd.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-950 text-rose-400 hover:bg-rose-900 border border-rose-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 5. COIN RATE MANAGER ================= */}
        {activeTab === 'coinrate' && (
          <div className="p-5 rounded-3xl bg-neutral-900 border border-white/10 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white">Coin Rate & Economics Manager</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Change the pricing anytime: Package 1 (Rs. 157 = 250,000 Coins) and Creator Payout rate.
              </p>
            </div>

            <form onSubmit={handleSaveCoinRate} className="space-y-4 max-w-md">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Package 1 Price (Pakistani Rupees Rs.)
                </label>
                <input
                  type="number"
                  value={ratePkgPrice}
                  onChange={(e) => setRatePkgPrice(Number(e.target.value))}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Package 1 EITA Coins Delivered
                </label>
                <input
                  type="number"
                  value={ratePkgCoins}
                  onChange={(e) => setRatePkgCoins(Number(e.target.value))}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Host Payout Cash (Rs. received per 250,000 Coins)
                </label>
                <input
                  type="number"
                  value={rateHostPayout}
                  onChange={(e) => setRateHostPayout(Number(e.target.value))}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                  required
                />
              </div>

              <div className="p-3 bg-neutral-800 rounded-xl text-xs text-emerald-400 font-bold flex justify-between">
                <span>Resulting Platform Profit Margin:</span>
                <span className="font-mono">Rs. {ratePkgPrice - rateHostPayout} per package</span>
              </div>

              {rateSavedMsg && (
                <div className="p-2.5 bg-emerald-950 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold">
                  ✓ Coin Rate Updated Successfully! All client views synced.
                </div>
              )}

              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Coin Rate Settings</span>
              </button>
            </form>
          </div>
        )}

        {/* ================= 6. GIFT MANAGER ================= */}
        {activeTab === 'gifts' && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Manage Gift Store & Coin Prices
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {giftsList.map((gift) => (
                <div
                  key={gift.id}
                  className="p-4 rounded-2xl bg-neutral-900 border border-white/10 flex flex-col items-center text-center space-y-2"
                >
                  <span className="text-5xl">{gift.icon}</span>
                  <span className="text-sm font-bold text-white">{gift.name}</span>
                  <p className="text-[11px] text-neutral-400">{gift.description}</p>

                  <div className="flex items-center gap-2 pt-2 w-full">
                    <span className="text-xs text-neutral-400">Coins:</span>
                    <input
                      type="number"
                      defaultValue={gift.coins}
                      onBlur={(e) => handleUpdateGiftPrice(gift.id, Number(e.target.value))}
                      className="flex-1 bg-neutral-800 border border-white/10 rounded-lg px-2 py-1 text-xs text-amber-300 font-mono font-bold text-right"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 7. THEME MANAGER ================= */}
        {activeTab === 'themes' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white">Platform Theme & Branding Manager</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Select and configure the active visual theme across EITA.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {THEMES_LIST.map((theme) => {
                const isSelected = currentTheme === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => onSelectTheme(theme.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-white bg-white/10 shadow-xl ring-2 ring-white/30'
                        : 'border-white/10 bg-neutral-900 hover:border-white/30 hover:bg-neutral-850'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className="w-8 h-8 rounded-full border border-white/20 shadow-md flex items-center justify-center font-bold text-xs"
                          style={{ backgroundColor: theme.colorHex, color: theme.isDark ? '#fff' : '#000' }}
                        >
                          {theme.id === 'white' ? 'W' : theme.id === 'light-grey' ? 'G' : '★'}
                        </div>
                        {isSelected ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-black text-black uppercase">
                            Active Theme
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-400">Click to Activate</span>
                        )}
                      </div>

                      <h3 className="text-xs font-bold text-white">{theme.name}</h3>
                      <p className="text-[11px] text-neutral-400 mt-1">{theme.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400">Accent: <code className="text-neutral-200 font-mono">{theme.colorHex}</code></span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTheme(theme.id);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-white text-black'
                            : 'bg-neutral-800 text-neutral-300 hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Applied' : 'Select'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Manual Coin Adjust Modal */}
      {adjustUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-3">Add Coins to User</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Coins Amount</label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Reason / Note</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustUserId(null)}
                  className="flex-1 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAdjustCoins}
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold"
                >
                  Credit Coins
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Withdrawal Modal */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-rose-400 mb-2">Reject Withdrawal Request</h3>
            <p className="text-xs text-neutral-400 mb-3">
              Coins will be refunded to host earnings.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-neutral-800 border border-white/10 rounded-xl p-3 text-xs text-white mb-3"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRejectId(null)}
                className="flex-1 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectWithdrawal}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
