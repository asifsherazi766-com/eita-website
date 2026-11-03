import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface PhotoModePlayerProps {
  photos: string[];
  caption: string;
  onDoubleTap: (e: React.MouseEvent) => void;
  onSingleTap: () => void;
}

export const PhotoModePlayer: React.FC<PhotoModePlayerProps> = ({
  photos,
  caption,
  onDoubleTap,
  onSingleTap
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = photos.length;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  };

  return (
    <div
      className="relative w-full h-full bg-black flex items-center justify-center select-none overflow-hidden"
      onDoubleClick={onDoubleTap}
      onClick={onSingleTap}
    >
      {/* Photo Mode Indicator (TikTok Style) */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold pointer-events-none">
        <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
        <span>Photo Mode</span>
        <span className="text-white/50">·</span>
        <span>{currentIndex + 1}/{total}</span>
      </div>

      {/* Main Photo Display */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={photos[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300 pointer-events-none"
        />

        {/* Ambient Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Left/Right Navigation Tap Zones & Arrows */}
      {total > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/75 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-14 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/75 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator at bottom */}
          <div className="absolute bottom-28 left-4 right-18 z-20 flex items-center justify-center gap-1.5 pointer-events-none">
            {photos.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  idx === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
