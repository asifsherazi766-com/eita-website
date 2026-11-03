import React, { useState, useEffect } from 'react';
import { User, Post, Comment, Gift, LiveRoom, GiftType, AppTheme } from './types';
import { api } from './services/api';
import { Navigation, TabType } from './components/Navigation';
import { HeaderTabs } from './components/HeaderTabs';
import { VideoFeed } from './components/VideoFeed';
import { CommentsModal } from './components/CommentsModal';
import { ShareModal } from './components/ShareModal';
import { GiftStoreModal } from './components/GiftStoreModal';
import { GiftAnimationOverlay } from './components/GiftAnimationOverlay';
import { CreateModal } from './components/CreateModal';
import { LiveRoomsView } from './components/LiveRoomsView';
import { WalletPage } from './components/WalletPage';
import { WithdrawalPage } from './components/WithdrawalPage';
import { ProfileView } from './components/ProfileView';
import { ExploreView } from './components/ExploreView';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { ThemeSelectorModal, THEMES_LIST } from './components/ThemeSelectorModal';
import { Smartphone, Monitor, Palette } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [liveRooms, setLiveRooms] = useState<LiveRoom[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);

  // Theme State: green | red | blue | white | light-grey
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('eita_theme') as AppTheme) || 'red';
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Navigation & Tab States
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [currentFeed, setCurrentFeed] = useState<'foryou' | 'following'>('foryou');
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);

  // Modals & Sheets
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [activeCommentsPost, setActiveCommentsPost] = useState<Post | null>(null);
  const [activeCommentsList, setActiveCommentsList] = useState<Comment[]>([]);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeSharePost, setActiveSharePost] = useState<Post | null>(null);

  const [isGiftStoreOpen, setIsGiftStoreOpen] = useState(false);
  const [giftRecipientId, setGiftRecipientId] = useState<string | null>(null);
  const [activeGiftAnimation, setActiveGiftAnimation] = useState<{
    type: GiftType;
    name: string;
    sender: string;
  } | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [duetTarget, setDuetTarget] = useState<Post | null>(null);
  const [stitchTarget, setStitchTarget] = useState<Post | null>(null);

  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Sync theme with body class and storage
  useEffect(() => {
    document.body.className = `theme-${currentTheme}`;
    localStorage.setItem('eita_theme', currentTheme);
  }, [currentTheme]);

  const handleSelectTheme = (theme: AppTheme) => {
    setCurrentTheme(theme);
    localStorage.setItem('eita_theme', theme);
  };

  // Initial load & URL routing check
  useEffect(() => {
    if (window.location.pathname.includes('admin_secret_eita') || window.location.hash.includes('admin_secret_eita')) {
      setIsAdminOpen(true);
    }
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const [me, users, postList, rooms, giftList] = await Promise.all([
        api.getMe(),
        api.getUsers(),
        api.getPosts(currentFeed),
        api.getRooms(),
        api.getGifts()
      ]);
      setCurrentUser(me);
      setAllUsers(users);
      setPosts(postList);
      setLiveRooms(rooms);
      setGifts(giftList);
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  const handleFeedChange = async (feed: 'foryou' | 'following') => {
    setCurrentFeed(feed);
    try {
      const updated = await api.getPosts(feed);
      setPosts(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikePost = async (postId: string) => {
    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: p.likesCount + (isLiked ? 1 : -1)
          };
        }
        return p;
      })
    );
    try {
      await api.likePost(postId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePost = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isSaved = !p.isSaved;
          return {
            ...p,
            isSaved,
            savesCount: p.savesCount + (isSaved ? 1 : -1)
          };
        }
        return p;
      })
    );
    try {
      await api.savePost(postId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenComments = async (post: Post) => {
    setActiveCommentsPost(post);
    setIsCommentsOpen(true);
    try {
      const c = await api.getComments(post.id);
      setActiveCommentsList(c);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (text: string, replyToId?: string) => {
    if (!activeCommentsPost) return;
    const res = await api.addComment(activeCommentsPost.id, text, replyToId);
    if (res.success) {
      const c = await api.getComments(activeCommentsPost.id);
      setActiveCommentsList(c);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === activeCommentsPost.id ? { ...p, commentsCount: p.commentsCount + 1 } : p
        )
      );
    }
  };

  const handleOpenShare = (post: Post) => {
    setActiveSharePost(post);
    setIsShareOpen(true);
  };

  const handleDuet = (post: Post) => {
    setDuetTarget(post);
    setStitchTarget(null);
    setIsCreateOpen(true);
  };

  const handleStitch = (post: Post) => {
    setStitchTarget(post);
    setDuetTarget(null);
    setIsCreateOpen(true);
  };

  const handleReportPost = async (postId: string, reason: string) => {
    await api.reportPost(postId, reason);
  };

  const handleOpenGiftStore = (targetId?: string) => {
    setGiftRecipientId(targetId || null);
    setIsGiftStoreOpen(true);
  };

  const handleSendGift = async (gift: Gift, count: number) => {
    const roomId = liveRooms[0]?.id || 'room_video_1';
    const res = await api.sendRoomGift(roomId, gift.id, count, giftRecipientId || undefined);

    // Trigger big full-screen overlay animation!
    setActiveGiftAnimation({
      type: gift.type,
      name: `${count > 1 ? `${count}x ` : ''}${gift.name}`,
      sender: currentUser?.displayName || 'VIP Fan'
    });

    // Refresh wallet and room state
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        walletBalance: res.senderBalance
      });
    }
    const updatedRooms = await api.getRooms();
    setLiveRooms(updatedRooms);
  };

  const handleSeatAction = async (
    roomId: string,
    action: 'take_seat' | 'leave_seat' | 'toggle_mute' | 'toggle_lock' | 'kick',
    seatIndex: number
  ) => {
    const res = await api.voiceSeatAction(roomId, action, seatIndex);
    if (res.success) {
      setLiveRooms((prev) =>
        prev.map((r) => (r.id === roomId ? { ...r, seats: res.seats } : r))
      );
    }
  };

  const handleThemeChange = async (roomId: string, theme: string) => {
    await api.updateRoomTheme(roomId, theme);
    const updatedRooms = await api.getRooms();
    setLiveRooms(updatedRooms);
  };

  const handleFollowUser = async (userId: string) => {
    await api.followUser(userId);
    refreshData();
  };

  const handleCreatePost = async (payload: Partial<Post>) => {
    await api.createPost(payload);
    setDuetTarget(null);
    setStitchTarget(null);
    setCurrentTab('home');
    refreshData();
  };

  if (!currentUser) {
    return (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-rose-500 to-pink-500 flex items-center justify-center text-2xl font-black mb-3 animate-pulse">
          E
        </div>
        <h2 className="text-lg font-bold tracking-tight">Starting EITA Platform...</h2>
        <p className="text-xs text-neutral-400 mt-1">Connecting to TikTok backend API</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-neutral-950 flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Top Desktop Controls Toolbar */}
      <div className="hidden lg:flex items-center gap-3 fixed top-3 left-6 z-40 bg-neutral-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-semibold text-neutral-300 shadow-xl">
        <span className="flex items-center gap-1.5 text-white font-bold">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: THEMES_LIST.find(t => t.id === currentTheme)?.colorHex }} />
          EITA Clone
        </span>

        <div className="h-3 w-px bg-white/20" />

        {/* Quick 5-Theme Switcher (Green, Red, Blue, White, Light Grey) */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mr-0.5">
            Themes:
          </span>
          {THEMES_LIST.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleSelectTheme(theme.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black shadow-md scale-105'
                    : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-750'
                }`}
                title={`Select ${theme.name} Theme`}
              >
                <span
                  className="w-2 h-2 rounded-full border border-black/30 inline-block"
                  style={{ backgroundColor: theme.colorHex }}
                />
                <span className="capitalize">{theme.id.replace('-', ' ')}</span>
              </button>
            );
          })}
        </div>

        <div className="h-3 w-px bg-white/20" />

        <button
          onClick={() => setDeviceFrameMode(!deviceFrameMode)}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
        >
          {deviceFrameMode ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          <span>{deviceFrameMode ? 'Desktop' : 'Phone'}</span>
        </button>

        <div className="h-3 w-px bg-white/20" />

        <button
          onClick={() => setIsAdminOpen(true)}
          className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
        >
          Admin Panel
        </button>
      </div>

      {/* Main Responsive App Frame with Active Theme */}
      <main
        className={`theme-${currentTheme} relative h-full w-full shadow-2xl overflow-hidden flex flex-col transition-colors duration-200 ${
          deviceFrameMode
            ? 'max-w-[420px] max-h-[92vh] sm:rounded-[40px] sm:border-[8px] sm:border-neutral-800'
            : 'max-w-md'
        }`}
        style={{
          backgroundColor: 'var(--app-bg)',
          color: 'var(--text-main)'
        }}
      >
        {/* Phone Speaker Notch Bar for Smartphone Bezel */}
        {deviceFrameMode && (
          <div className="hidden sm:flex absolute top-1.5 left-1/2 -translate-x-1/2 z-50 w-24 h-4 bg-neutral-800 rounded-full items-center justify-center pointer-events-none">
            <div className="w-10 h-1 bg-neutral-700 rounded-full" />
            <div className="w-2.5 h-2.5 ml-2 rounded-full bg-neutral-900 border border-neutral-700" />
          </div>
        )}

        {/* Mobile Quick 5-Theme Switcher Strip */}
        <div
          className="flex lg:hidden items-center justify-between px-2.5 py-1 z-30 shrink-0 transition-colors"
          style={{
            backgroundColor: 'var(--surface-bg)',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <span className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>
            Theme:
          </span>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {THEMES_LIST.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all shrink-0 ${
                    isSelected
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full inline-block border border-black/20"
                    style={{ backgroundColor: theme.colorHex }}
                  />
                  <span className="capitalize">{theme.id.replace('-', ' ')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Top Header Tabs (Only on Home Feed) */}
        {currentTab === 'home' && !isWalletOpen && !isWithdrawalOpen && (
          <HeaderTabs
            currentFeed={currentFeed}
            onFeedChange={handleFeedChange}
            onLiveClick={() => setCurrentTab('live')}
            onSearchClick={() => setCurrentTab('explore')}
            onAdminClick={() => setIsAdminOpen(true)}
            onThemeClick={() => setIsThemeModalOpen(true)}
          />
        )}

        {/* Active Tab View Body */}
        <div className="flex-1 relative w-full h-full overflow-hidden">
          {/* TAB 1: HOME VIDEO / PHOTO FEED */}
          {currentTab === 'home' && !isWalletOpen && !isWithdrawalOpen && (
            <VideoFeed
              posts={posts}
              currentUser={currentUser}
              onLike={handleLikePost}
              onSave={handleSavePost}
              onOpenComments={handleOpenComments}
              onOpenShare={handleOpenShare}
              onOpenGiftStore={(post) => handleOpenGiftStore(post.author.id)}
              onFollow={handleFollowUser}
              onProfileClick={(userId) => {
                const target = allUsers.find((u) => u.id === userId);
                if (target) {
                  setCurrentTab('profile');
                }
              }}
            />
          )}

          {/* TAB 2: EXPLORE / SEARCH */}
          {currentTab === 'explore' && (
            <ExploreView
              posts={posts}
              users={allUsers}
              onSelectPost={(post) => {
                setCurrentTab('home');
              }}
              onSelectUser={(userId) => {
                setCurrentTab('profile');
              }}
            />
          )}

          {/* TAB 3: LIVE ROOMS (VIDEO PK + 12-SEAT VOICE) */}
          {currentTab === 'live' && (
            <LiveRoomsView
              rooms={liveRooms}
              currentUser={currentUser}
              onOpenGiftStore={handleOpenGiftStore}
              onSeatAction={handleSeatAction}
              onThemeChange={handleThemeChange}
            />
          )}

          {/* TAB 4: PROFILE */}
          {currentTab === 'profile' && !isWalletOpen && !isWithdrawalOpen && (
            <ProfileView
              currentUser={currentUser}
              allUsers={allUsers}
              posts={posts}
              currentTheme={currentTheme}
              onOpenWallet={() => setIsWalletOpen(true)}
              onOpenWithdrawal={() => setIsWithdrawalOpen(true)}
              onOpenAdmin={() => setIsAdminOpen(true)}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenThemeSelector={() => setIsThemeModalOpen(true)}
              onSelectPost={(post) => setCurrentTab('home')}
              onRefreshUser={refreshData}
            />
          )}

          {/* SUB-PAGE: WALLET RECHARGE & TRANSACTIONS */}
          {isWalletOpen && (
            <WalletPage
              currentUser={currentUser}
              onRefreshUser={refreshData}
              onNavigateToWithdrawal={() => {
                setIsWalletOpen(false);
                setIsWithdrawalOpen(true);
              }}
            />
          )}

          {/* SUB-PAGE: WITHDRAWAL REQUESTS */}
          {isWithdrawalOpen && (
            <WithdrawalPage
              currentUser={currentUser}
              onBack={() => setIsWithdrawalOpen(false)}
              onRefreshUser={refreshData}
            />
          )}
        </div>

        {/* Bottom Navigation Bar */}
        <Navigation
          currentTab={currentTab}
          onTabChange={(tab) => {
            setIsWalletOpen(false);
            setIsWithdrawalOpen(false);
            setCurrentTab(tab);
          }}
          onCreateClick={() => {
            setDuetTarget(null);
            setStitchTarget(null);
            setIsCreateOpen(true);
          }}
        />
      </main>

      {/* ================= MODALS & OVERLAYS ================= */}

      {/* Theme Selector Modal (Green, Red, Blue, White, Light Grey) */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
      />

      {/* Full-Screen Gift Animation Overlay */}
      <GiftAnimationOverlay
        giftType={activeGiftAnimation?.type || null}
        giftName={activeGiftAnimation?.name}
        senderName={activeGiftAnimation?.sender}
        onComplete={() => setActiveGiftAnimation(null)}
      />

      {/* Gift Store Drawer */}
      <GiftStoreModal
        isOpen={isGiftStoreOpen}
        onClose={() => setIsGiftStoreOpen(false)}
        currentUser={currentUser}
        gifts={gifts}
        onSendGift={handleSendGift}
        onOpenRecharge={() => {
          setIsGiftStoreOpen(false);
          setIsWalletOpen(true);
        }}
      />

      {/* Comments Sliding Sheet */}
      <CommentsModal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        comments={activeCommentsList}
        currentUser={currentUser}
        onAddComment={handleAddComment}
      />

      {/* Share Drawer (WhatsApp, Duet, Stitch, Report) */}
      {activeSharePost && (
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          post={activeSharePost}
          onDuet={handleDuet}
          onStitch={handleStitch}
          onReport={handleReportPost}
        />
      )}

      {/* Create Video / Photo / Duet / Stitch Modal */}
      <CreateModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setDuetTarget(null);
          setStitchTarget(null);
        }}
        currentUser={currentUser}
        onCreatePost={handleCreatePost}
        duetTarget={duetTarget}
        stitchTarget={stitchTarget}
      />

      {/* Master Admin Panel Modal (/admin_secret_eita) */}
      {isAdminOpen && (
        <AdminPanel
          onClose={() => setIsAdminOpen(false)}
          onRefreshAll={refreshData}
          currentTheme={currentTheme}
          onSelectTheme={handleSelectTheme}
        />
      )}

      {/* Auth Modal (Phone OTP + Google + Password) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={refreshData}
      />
    </div>
  );
}
