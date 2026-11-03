import React from 'react';
import { Radio, Search, ShieldAlert } from 'lucide-react';

interface HeaderTabsProps {
  currentFeed: 'foryou' | 'following';
  onFeedChange: (feed: 'foryou' | 'following') => void;
  onLiveClick: () => void;
  onSearchClick: () => void;
  onAdminClick: () => void;
  onThemeClick: () => void;
}

export const HeaderTabs: React.FC<HeaderTabsProps> = ({
  currentFeed,
  onFeedChange,
  onLiveClick,
  onSearchClick,
  onAdminClick,
  onThemeClick
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 pt-3 pb-2 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
      {/* Left: LIVE Button */}
      <button
        onClick={onLiveClick}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 hover:text-white transition-all text-xs font-bold active:scale-95 cursor-pointer shadow-sm"
      >
        <Radio className="w-3.5 h-3.5 text-[var(--color-primary)] animate-pulse" />
        <span>LIVE</span>
      </button>

      {/* Center: Following | For You */}
      <div className="flex items-center gap-5 text-[15px] font-bold tracking-tight">
        <button
          onClick={() => onFeedChange('following')}
          className={`relative pb-1 cursor-pointer transition-colors ${
            currentFeed === 'following'
              ? 'text-white'
              : 'text-white/60 hover:text-white/90 font-medium'
          }`}
        >
          Following
          {currentFeed === 'following' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-0.75 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          )}
        </button>

        <button
          onClick={() => onFeedChange('foryou')}
          className={`relative pb-1 cursor-pointer transition-colors ${
            currentFeed === 'foryou'
              ? 'text-white'
              : 'text-white/60 hover:text-white/90 font-medium'
          }`}
        >
          For You
          {currentFeed === 'foryou' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-0.75 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          )}
        </button>
      </div>

      {/* Right: Theme, Admin, & Search */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onThemeClick}
          title="Select Theme (Green, Red, Blue, White, Light Grey)"
          className="p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 hover:text-[var(--color-accent)] transition-transform active:scale-90 cursor-pointer"
        >
          <span className="text-xs">🎨</span>
        </button>
        <button
          onClick={onAdminClick}
          title="Secret Admin Panel (/admin_secret_eita)"
          className="p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-amber-500/30 text-amber-400 hover:text-amber-300 transition-transform active:scale-90 cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>
        <button
          onClick={onSearchClick}
          className="p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 hover:text-white transition-transform active:scale-90 cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
