import React, { useEffect, useState } from 'react';
import { GiftType } from '../types';

interface GiftAnimationOverlayProps {
  giftType: GiftType | null;
  giftName?: string;
  senderName?: string;
  onComplete: () => void;
}

export const GiftAnimationOverlay: React.FC<GiftAnimationOverlayProps> = ({
  giftType,
  giftName,
  senderName,
  onComplete
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (giftType) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [giftType, onComplete]);

  if (!visible || !giftType) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
      {/* Banner announcement */}
      <div className="absolute top-24 px-6 py-2 bg-gradient-to-r from-amber-500/90 via-pink-600/90 to-purple-600/90 backdrop-blur-md rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
        <span className="text-xl">🎁</span>
        <div className="text-white text-sm font-bold">
          <span className="text-yellow-200">{senderName || 'VIP Fan'}</span> sent{' '}
          <span className="text-white underline decoration-yellow-400 font-extrabold">{giftName}</span>!
        </div>
      </div>

      {/* Animation based on Gift Type */}
      {giftType === 'rose' && (
        <div className="relative w-full h-full">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-fall"
              style={{
                left: `${(i * 4) + Math.random() * 5}%`,
                top: `-10%`,
                animation: `roseFall ${2 + Math.random() * 1.5}s ease-in forwards`,
                animationDelay: `${Math.random() * 0.8}s`
              }}
            >
              🌹
            </div>
          ))}
          <style>{`
            @keyframes roseFall {
              0% { transform: translateY(0) rotate(0deg) scale(0.6); opacity: 0; }
              20% { opacity: 1; }
              100% { transform: translateY(110vh) rotate(360deg) scale(1.3); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {giftType === 'love' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="animate-ping absolute text-9xl">💖</div>
          <div className="animate-pulse text-8xl drop-shadow-[0_0_35px_rgba(255,105,180,0.9)]">
            ❤️‍🔥
          </div>
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-3xl"
              style={{
                transform: `rotate(${i * 20}deg) translate(${80 + (i % 3) * 30}px) rotate(-${i * 20}deg)`,
                animation: 'pulse 1s infinite alternate'
              }}
            >
              💕
            </div>
          ))}
        </div>
      )}

      {giftType === 'perfume' && (
        <div className="flex flex-col items-center justify-center animate-pulse">
          <div className="text-9xl filter drop-shadow-[0_0_40px_rgba(168,85,247,0.9)] animate-bounce">
            🧴
          </div>
          <div className="mt-4 px-6 py-1 bg-purple-900/80 border border-purple-400/50 rounded-full text-purple-200 text-xs font-bold tracking-widest uppercase">
            Luxury Fragrance Mist ✨
          </div>
          <div className="absolute inset-0 bg-purple-600/10 backdrop-blur-[2px] animate-pulse" />
        </div>
      )}

      {giftType === 'car' && (
        <div className="w-full relative h-48 flex items-center">
          <div
            className="absolute whitespace-nowrap text-8xl flex items-center gap-2 drop-shadow-[0_0_30px_rgba(239,68,68,0.9)]"
            style={{
              animation: 'carDrive 3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards'
            }}
          >
            <span>🏎️💨</span>
            <div className="flex flex-col">
              <span className="text-2xl font-black italic text-red-500 bg-black/80 px-4 py-1 rounded-lg border border-red-500">
                EITA SPEED RACER
              </span>
            </div>
          </div>
          <style>{`
            @keyframes carDrive {
              0% { transform: translateX(110vw); }
              30% { transform: translateX(10vw); }
              70% { transform: translateX(0vw); }
              100% { transform: translateX(-120vw); }
            }
          `}</style>
        </div>
      )}

      {giftType === 'jet' && (
        <div className="w-full relative h-64 flex items-center">
          <div
            className="absolute whitespace-nowrap text-9xl flex items-center"
            style={{
              animation: 'jetFly 3.2s ease-in-out forwards'
            }}
          >
            <span>✈️</span>
            <div className="h-4 w-72 bg-gradient-to-r from-transparent via-cyan-400 to-white blur-[2px] -ml-6 rounded-full" />
          </div>
          <style>{`
            @keyframes jetFly {
              0% { transform: translate(-100vw, 60vh) rotate(-25deg) scale(0.6); }
              50% { transform: translate(30vw, -10vh) rotate(-15deg) scale(1.2); }
              100% { transform: translate(120vw, -80vh) rotate(-10deg) scale(1.5); }
            }
          `}</style>
        </div>
      )}

      {giftType === 'universe' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-sm animate-pulse" />
          <div
            className="text-9xl z-10 drop-shadow-[0_0_60px_rgba(124,58,237,1)]"
            style={{
              animation: 'spin 10s linear infinite'
            }}
          >
            🌌
          </div>
          <div className="mt-6 z-10 px-8 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 rounded-full text-white font-extrabold text-xl shadow-[0_0_40px_rgba(236,72,153,0.8)] animate-pulse tracking-wider">
            ✨ COSMIC UNIVERSE EXPLOSION ✨
          </div>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-ping"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${15 + Math.random() * 70}%`,
                animationDuration: `${0.8 + Math.random() * 1.5}s`
              }}
            >
              ⭐
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
