import React from 'react';
import { Home, Compass, Radio, MessageSquare, User as UserIcon } from 'lucide-react';

export type TabType = 'home' | 'explore' | 'live' | 'inbox' | 'profile';

interface NavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onCreateClick: () => void;
  unreadCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  onCreateClick,
  unreadCount = 2
}) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md px-2 py-1 max-w-md mx-auto transition-colors duration-200"
      style={{
        backgroundColor: 'var(--nav-bg)',
        borderTop: '1px solid var(--border-subtle)'
      }}
    >
      <div className="flex items-center justify-around h-13">
        {/* Home */}
        <button
          onClick={() => onTabChange('home')}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 cursor-pointer"
          style={{
            color: currentTab === 'home' ? 'var(--color-primary)' : 'var(--text-muted)'
          }}
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Home</span>
        </button>

        {/* Explore / Friends */}
        <button
          onClick={() => onTabChange('explore')}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 cursor-pointer"
          style={{
            color: currentTab === 'explore' ? 'var(--color-primary)' : 'var(--text-muted)'
          }}
        >
          <Compass className={`w-5 h-5 ${currentTab === 'explore' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Explore</span>
        </button>

        {/* Create [+] Button (Dynamic Theme Plus Wings) */}
        <div className="flex items-center justify-center flex-1">
          <button
            onClick={onCreateClick}
            className="tiktok-plus-btn active:scale-95 transition-transform cursor-pointer shadow-lg"
            title="Create Video, Photo Carousel, Duet or Stitch"
          >
            <span className="text-xl font-black leading-none pb-0.5">+</span>
          </button>
        </div>

        {/* Live System (Video PK + Voice Rooms) */}
        <button
          onClick={() => onTabChange('live')}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 relative cursor-pointer"
          style={{
            color: currentTab === 'live' ? 'var(--color-primary)' : 'var(--text-muted)'
          }}
        >
          <Radio className={`w-5 h-5 ${currentTab === 'live' ? 'stroke-[2.5] animate-pulse' : 'stroke-2'}`} />
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight flex items-center gap-1">
            LIVE
            <span
              className="w-1.5 h-1.5 rounded-full animate-ping inline-block"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
          </span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onTabChange('profile')}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 cursor-pointer"
          style={{
            color: currentTab === 'profile' ? 'var(--color-primary)' : 'var(--text-muted)'
          }}
        >
          <UserIcon className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
};
