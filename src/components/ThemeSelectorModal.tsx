import React from 'react';
import { X, Check, Palette, Sparkles, Sun, Moon } from 'lucide-react';
import { AppTheme, ThemeConfig } from '../types';

export const THEMES_LIST: ThemeConfig[] = [
  {
    id: 'green',
    name: 'Green (Emerald)',
    colorHex: '#10B981',
    badge: 'Fresh & Vibrant',
    description: 'Emerald green accents on deep forest dark canvas.',
    isDark: true
  },
  {
    id: 'red',
    name: 'Red (TikTok Signature)',
    colorHex: '#FE2C55',
    badge: 'Original EITA',
    description: 'Signature TikTok crimson red on obsidian black.',
    isDark: true
  },
  {
    id: 'blue',
    name: 'Blue (Electric Cyan)',
    colorHex: '#0284C7',
    badge: 'Cool & Modern',
    description: 'Royal blue & cyan accents with night sky canvas.',
    isDark: true
  },
  {
    id: 'white',
    name: 'White (Light Mode)',
    colorHex: '#FFFFFF',
    badge: 'Pure Clean',
    description: 'Bright pure white background with bold high contrast.',
    isDark: false
  },
  {
    id: 'light-grey',
    name: 'Light Grey (Platinum)',
    colorHex: '#E5E7EB',
    badge: 'Minimal Slate',
    description: 'Sleek platinum grey with soft neutral elevations.',
    isDark: false
  }
];

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-3xl p-5 shadow-2xl relative text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-rose-500" />
            <div>
              <h2 className="text-sm font-extrabold tracking-tight">Select Theme</h2>
              <span className="text-[10px] text-neutral-400">Choose from 5 custom styles</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Themes List */}
        <div className="space-y-2.5 py-4">
          {THEMES_LIST.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  onSelectTheme(theme.id);
                  onClose();
                }}
                className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'border-white/40 bg-white/10 shadow-lg scale-[1.01]'
                    : 'border-white/5 bg-neutral-800/60 hover:bg-neutral-800 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Color Circle Preview */}
                  <div
                    className="w-9 h-9 rounded-full border-2 border-white/30 flex items-center justify-center shadow-md relative"
                    style={{ backgroundColor: theme.colorHex }}
                  >
                    {theme.id === 'white' && (
                      <span className="text-[10px] text-black font-black">W</span>
                    )}
                    {theme.id === 'light-grey' && (
                      <span className="text-[10px] text-neutral-800 font-black">G</span>
                    )}
                    {theme.isDark ? (
                      <Moon className="w-3.5 h-3.5 text-white drop-shadow" />
                    ) : (
                      <Sun className="w-3.5 h-3.5 text-neutral-800" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{theme.name}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[9px] text-neutral-300 font-medium">
                        {theme.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                      {theme.description}
                    </p>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-white/20 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-2 text-center text-[11px] text-neutral-400">
          Theme changes apply immediately across feed, live rooms, wallet, and admin panel.
        </div>
      </div>
    </div>
  );
};
