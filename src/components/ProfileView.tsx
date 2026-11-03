import React, { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Coins,
  ArrowUpRight,
  Edit3,
  Grid,
  Heart,
  Bookmark,
  LogOut,
  ShieldAlert,
  Play,
  Layers,
  Sparkles,
  Users
} from 'lucide-react';
import { AppTheme, Post, User } from '../types';
import { api } from '../services/api';

interface ProfileViewProps {
  currentUser: User;
  allUsers: User[];
  posts: Post[];
  currentTheme: AppTheme;
  onOpenWallet: () => void;
  onOpenWithdrawal: () => void;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  onOpenThemeSelector: () => void;
  onSelectPost: (post: Post) => void;
  onRefreshUser: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  allUsers,
  posts,
  currentTheme,
  onOpenWallet,
  onOpenWithdrawal,
  onOpenAdmin,
  onOpenAuth,
  onOpenThemeSelector,
  onSelectPost,
  onRefreshUser
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'liked' | 'saved'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [bio, setBio] = useState(currentUser.bio);
  const [link, setLink] = useState(currentUser.link);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [saving, setSaving] = useState(false);

  const myPosts = posts.filter((p) => p.userId === currentUser.id);
  const likedPosts = posts.filter((p) => p.isLiked);
  const savedPosts = posts.filter((p) => p.isSaved);

  const displayList = activeTab === 'posts' ? myPosts : activeTab === 'liked' ? likedPosts : savedPosts;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateUser(currentUser.id, {
        displayName,
        bio,
        link,
        avatar
      });
      setIsEditing(false);
      onRefreshUser();
    } finally {
      setSaving(false);
    }
  };

  const handleSwitchUser = async (userId: string) => {
    await api.switchUser(userId);
    onRefreshUser();
  };

  return (
    <div className="w-full h-full flex flex-col bg-black text-white overflow-y-auto no-scrollbar pb-16">
      {/* Top Header Bar */}
      <div className="p-4 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-black tracking-tight">{currentUser.displayName}</span>
          {currentUser.isVerified && (
            <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400" />
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Switch User Dropdown */}
          <div className="relative group">
            <button
              className="px-2.5 py-1 rounded-full bg-neutral-800 border border-white/10 text-[11px] font-bold text-neutral-300 hover:text-white flex items-center gap-1 cursor-pointer"
              title="Switch demo account"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Switch User</span>
            </button>
            <div className="absolute right-0 top-full mt-1 w-44 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl p-1 hidden group-hover:block z-50">
              <span className="text-[10px] text-neutral-400 font-bold px-2 py-1 block uppercase">
                Demo Accounts
              </span>
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleSwitchUser(u.id)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                    u.id === currentUser.id
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'hover:bg-neutral-800 text-neutral-200'
                  }`}
                >
                  <img src={u.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                  <span className="truncate">{u.displayName}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onOpenAuth}
            className="p-1.5 rounded-full bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white cursor-pointer"
            title="Login / Register"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Profile Info */}
      <div className="p-4 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-2">
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            className="w-22 h-22 rounded-full object-cover border-2 border-white/20 shadow-xl"
          />
          {currentUser.isVerified && (
            <div className="absolute bottom-0 right-0 p-1 bg-black rounded-full">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 fill-cyan-400" />
            </div>
          )}
        </div>

        {/* Username */}
        <h2 className="text-base font-extrabold text-white">@{currentUser.username}</h2>

        {/* Counts (Following, Followers, Likes) */}
        <div className="flex items-center gap-6 my-4">
          <div className="flex flex-col items-center">
            <span className="text-sm font-extrabold text-white font-mono">
              {currentUser.followingCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-neutral-400">Following</span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex flex-col items-center">
            <span className="text-sm font-extrabold text-white font-mono">
              {currentUser.followersCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-neutral-400">Followers</span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex flex-col items-center">
            <span className="text-sm font-extrabold text-white font-mono">
              {currentUser.likesCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-neutral-400">Likes</span>
          </div>
        </div>

        {/* Bio & Website Link */}
        {currentUser.bio && (
          <p className="text-xs text-neutral-200 max-w-xs leading-relaxed mb-2">
            {currentUser.bio}
          </p>
        )}
        {currentUser.link && (
          <a
            href={currentUser.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 mb-3"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{currentUser.link.replace(/^https?:\/\//, '')}</span>
          </a>
        )}

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 w-full max-w-sm justify-center mb-3">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={onOpenWallet}
            className="flex-1 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Wallet ({currentUser.walletBalance.toLocaleString()})</span>
          </button>

          <button
            onClick={onOpenThemeSelector}
            className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            title="Choose Theme: Green, Red, Blue, White, Light Grey"
          >
            <span className="text-sm">🎨</span>
            <span className="capitalize hidden sm:inline">{currentTheme}</span>
          </button>
        </div>

        {/* Creator Earnings & Cashout Banner */}
        <div className="w-full max-w-sm p-3 rounded-2xl bg-gradient-to-r from-rose-950/60 to-purple-950/60 border border-rose-500/30 flex items-center justify-between mb-2">
          <div className="text-left">
            <span className="text-[10px] font-bold text-rose-300 uppercase block">
              Creator Gift Earnings
            </span>
            <span className="text-xs font-black font-mono text-white">
              {currentUser.totalEarnings.toLocaleString()} Coins (≈ Rs. {Math.floor((currentUser.totalEarnings / 250000) * 100).toLocaleString()})
            </span>
          </div>
          <button
            onClick={onOpenWithdrawal}
            className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] hover:opacity-90 text-white text-xs font-black flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <span>Withdraw</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Secret Admin Button */}
        <button
          onClick={onOpenAdmin}
          className="mt-1 text-[11px] text-amber-400/80 hover:text-amber-300 flex items-center gap-1 font-bold underline cursor-pointer"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Access Admin Panel (/admin_secret_eita)</span>
        </button>
      </div>

      {/* Tabs Header (My Videos, Liked, Saved) */}
      <div className="flex border-t border-b border-white/10 shrink-0">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
            activeTab === 'posts' ? 'border-white text-white' : 'border-transparent text-neutral-500'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span className="text-xs font-bold">Videos ({myPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('liked')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
            activeTab === 'liked' ? 'border-white text-white' : 'border-transparent text-neutral-500'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span className="text-xs font-bold">Liked ({likedPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
            activeTab === 'saved' ? 'border-white text-white' : 'border-transparent text-neutral-500'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span className="text-xs font-bold">Saved ({savedPosts.length})</span>
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-0.5 p-0.5 flex-1">
        {displayList.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-neutral-500">
            <p className="text-xs">No posts to display in this tab</p>
          </div>
        ) : (
          displayList.map((post) => (
            <button
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="relative aspect-[3/4] bg-neutral-900 overflow-hidden group cursor-pointer"
            >
              <img
                src={post.thumbnailUrl}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

              {/* Type Badge */}
              {post.type === 'photo' && (
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-pink-300">
                  📸 Photo
                </span>
              )}
              {post.duetFrom && (
                <span className="absolute top-1.5 left-1.5 p-1 rounded bg-black/60 text-cyan-300">
                  <Layers className="w-3 h-3" />
                </span>
              )}

              {/* Likes counter */}
              <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[11px] font-bold text-white">
                <Play className="w-3 h-3 fill-white" />
                <span className="font-mono">{post.likesCount.toLocaleString()}</span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-3">Edit Profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Website / Social Link</label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
