import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  CheckCircle2,
  Plus,
  Music,
  MapPin,
  Play,
  Layers,
  ChevronUp,
  ChevronDown,
  Gift
} from 'lucide-react';
import { Post, User } from '../types';
import { PhotoModePlayer } from './PhotoModePlayer';

interface VideoFeedProps {
  posts: Post[];
  currentUser: User;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onOpenComments: (post: Post) => void;
  onOpenShare: (post: Post) => void;
  onOpenGiftStore: (post: Post) => void;
  onFollow: (userId: string) => void;
  onProfileClick: (userId: string) => void;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({
  posts,
  currentUser,
  onLike,
  onSave,
  onOpenComments,
  onOpenShare,
  onOpenGiftStore,
  onFollow,
  onProfileClick
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [followedUsers, setFollowedUsers] = useState<Record<string, boolean>>({});
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [expandedCaption, setExpandedCaption] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPost = posts[activeIndex];

  // Auto-play / pause when active post changes
  useEffect(() => {
    setIsPlaying(true);
    setExpandedCaption(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, [activeIndex]);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        goToNext();
      } else if (e.key === 'ArrowUp') {
        goToPrev();
      } else if (e.key === ' ') {
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, posts.length]);

  const goToNext = () => {
    if (activeIndex < posts.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    if (!currentPost) return;

    // Trigger like if not already liked
    if (!currentPost.isLiked) {
      onLike(currentPost.id);
    }

    // Add heart burst at coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart: FloatingHeart = {
      id: Date.now() + Math.random(),
      x,
      y
    };

    setFloatingHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1000);
  };

  const handleFollowClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    setFollowedUsers((prev) => ({ ...prev, [userId]: true }));
    onFollow(userId);
  };

  if (!currentPost) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white">
        <p className="text-neutral-400">No posts in feed yet</p>
      </div>
    );
  }

  const isUserFollowed = followedUsers[currentPost.userId] || currentPost.userId === currentUser.id;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black select-none overflow-hidden"
    >
      {/* Floating Hearts from double-tap */}
      {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute z-50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: heart.x, top: heart.y }}
        >
          <div className="text-rose-500 animate-heart-burst">
            <Heart className="w-20 h-20 fill-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]" />
          </div>
          <style>{`
            @keyframes heartBurst {
              0% { transform: scale(0.2) rotate(-15deg); opacity: 0.9; }
              50% { transform: scale(1.3) rotate(15deg); opacity: 1; }
              100% { transform: scale(1.6) translateY(-80px) rotate(0deg); opacity: 0; }
            }
            .animate-heart-burst {
              animation: heartBurst 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
        </div>
      ))}

      {/* Main Content: Video vs Photo Mode */}
      {currentPost.type === 'video' ? (
        <div
          className="relative w-full h-full flex items-center justify-center cursor-pointer"
          onClick={togglePlayPause}
          onDoubleClick={handleDoubleTap}
        >
          {/* Duet Split Screen if this is a Duet */}
          {currentPost.duetFrom ? (
            <div className="w-full h-full flex items-center justify-center">
              {/* Left: Original Video */}
              <div className="w-1/2 h-full relative border-r border-cyan-400/50">
                <video
                  src={currentPost.duetFrom.videoUrl}
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-16 left-3 px-2 py-0.5 rounded bg-black/60 text-[10px] text-cyan-300 font-bold">
                  @{currentPost.duetFrom.authorName}
                </div>
              </div>
              {/* Right: Duet Reaction Video */}
              <div className="w-1/2 h-full relative">
                <video
                  ref={videoRef}
                  src={currentPost.videoUrl}
                  loop
                  playsInline
                  autoPlay
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-16 right-3 px-2 py-0.5 rounded bg-black/60 text-[10px] text-pink-300 font-bold">
                  Duet Live
                </div>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              src={currentPost.videoUrl}
              loop
              playsInline
              autoPlay
              className="w-full h-full object-cover"
            />
          )}

          {/* Pause overlay icon */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90">
                <Play className="w-8 h-8 fill-white translate-x-0.5" />
              </div>
            </div>
          )}

          {/* Contrast Scrim Gradients */}
          <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        </div>
      ) : (
        <PhotoModePlayer
          photos={currentPost.photoUrls || [currentPost.thumbnailUrl]}
          caption={currentPost.caption}
          onDoubleTap={handleDoubleTap}
          onSingleTap={togglePlayPause}
        />
      )}

      {/* Up/Down Desktop Floating Navigation buttons */}
      <div className="hidden sm:flex flex-col gap-2 absolute right-3 top-1/2 -translate-y-1/2 z-30 pointer-events-auto">
        <button
          onClick={goToPrev}
          disabled={activeIndex === 0}
          className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer backdrop-blur-md border border-white/10"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <button
          onClick={goToNext}
          disabled={activeIndex === posts.length - 1}
          className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer backdrop-blur-md border border-white/10"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* RIGHT SIDE ACTION BAR (Authentic TikTok Design) */}
      <div className="video-overlay-content absolute right-2.5 bottom-20 z-30 flex flex-col items-center gap-4.5 pointer-events-auto">
        {/* Author Avatar + Follow Plus */}
        <div className="relative mb-1">
          <button
            onClick={() => onProfileClick(currentPost.author.id)}
            className="w-11 h-11 rounded-full border-2 border-white overflow-hidden active:scale-95 transition-transform cursor-pointer"
          >
            <img
              src={currentPost.author.avatar}
              alt={currentPost.author.username}
              className="w-full h-full object-cover"
            />
          </button>
          {!isUserFollowed && (
            <button
              onClick={(e) => handleFollowClick(e, currentPost.author.id)}
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          )}
        </div>

        {/* Heart / Like Button */}
        <button
          onClick={() => onLike(currentPost.id)}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-10 h-10 flex items-center justify-center transition-transform active:scale-125">
            <Heart
              className={`w-8 h-8 transition-colors drop-shadow-md ${
                currentPost.isLiked
                  ? 'fill-rose-500 text-rose-500'
                  : 'text-white fill-white/10 group-hover:text-rose-400'
              }`}
            />
          </div>
          <span className="text-[11px] font-bold text-white shadow-black drop-shadow font-mono tabular-nums">
            {currentPost.likesCount.toLocaleString()}
          </span>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => onOpenComments(currentPost)}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-10 h-10 flex items-center justify-center transition-transform active:scale-125">
            <MessageCircle className="w-8 h-8 text-white fill-white/10 drop-shadow-md group-hover:text-neutral-200" />
          </div>
          <span className="text-[11px] font-bold text-white shadow-black drop-shadow font-mono tabular-nums">
            {currentPost.commentsCount.toLocaleString()}
          </span>
        </button>

        {/* Bookmark / Save */}
        <button
          onClick={() => onSave(currentPost.id)}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-10 h-10 flex items-center justify-center transition-transform active:scale-125">
            <Bookmark
              className={`w-8 h-8 transition-colors drop-shadow-md ${
                currentPost.isSaved
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-white fill-white/10 group-hover:text-amber-300'
              }`}
            />
          </div>
          <span className="text-[11px] font-bold text-white shadow-black drop-shadow font-mono tabular-nums">
            {currentPost.savesCount.toLocaleString()}
          </span>
        </button>

        {/* Send Gift Button */}
        <button
          onClick={() => onOpenGiftStore(currentPost)}
          className="flex flex-col items-center group cursor-pointer"
          title="Send EITA Gift"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20 active:scale-110 transition-transform">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-bold text-amber-300 shadow-black drop-shadow mt-0.5">
            Gift
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => onOpenShare(currentPost)}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-10 h-10 flex items-center justify-center transition-transform active:scale-125">
            <Share2 className="w-7 h-7 text-white fill-white/10 drop-shadow-md group-hover:text-neutral-200" />
          </div>
          <span className="text-[11px] font-bold text-white shadow-black drop-shadow font-mono tabular-nums">
            {currentPost.sharesCount.toLocaleString()}
          </span>
        </button>

        {/* Vinyl Record Disc (Spinning Music Album) */}
        <div className="relative mt-1 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center overflow-hidden animate-spin-slow shadow-lg">
            <img
              src={currentPost.sound?.cover || currentPost.author.avatar}
              alt="Sound"
              className="w-6 h-6 rounded-full object-cover"
            />
          </div>
          {/* Floating Music Note animation */}
          <div className="absolute -top-2 -left-2 text-white/80 animate-note pointer-events-none">
            🎵
          </div>
        </div>
      </div>

      {/* BOTTOM POST INFO (Caption, Author, Audio, Location) */}
      <div className="video-overlay-content absolute left-3 bottom-16 right-18 z-20 pointer-events-auto text-white">
        {/* Author Line */}
        <div
          onClick={() => onProfileClick(currentPost.author.id)}
          className="flex items-center gap-1.5 cursor-pointer inline-flex group mb-1.5"
        >
          <span className="font-bold text-sm tracking-tight hover:underline">
            @{currentPost.author.username}
          </span>
          {currentPost.author.isVerified && (
            <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400 shrink-0" />
          )}
          <span className="text-[11px] text-white/60">· {currentPost.createdAt}</span>
        </div>

        {/* Duet / Stitch Tag banner */}
        {currentPost.duetFrom && (
          <div className="flex items-center gap-1 text-xs text-cyan-300 font-semibold mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Duet with @{currentPost.duetFrom.authorName}</span>
          </div>
        )}

        {/* Caption */}
        <p className="text-xs text-neutral-100 leading-snug break-words">
          {expandedCaption ? currentPost.caption : currentPost.caption.slice(0, 85)}
          {currentPost.caption.length > 85 && !expandedCaption && (
            <button
              onClick={() => setExpandedCaption(true)}
              className="text-white/70 hover:text-white font-bold ml-1 cursor-pointer"
            >
              ...more
            </button>
          )}
        </p>

        {/* Hashtags */}
        {currentPost.hashtags && currentPost.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1 text-[11px] font-bold text-white/90">
            {currentPost.hashtags.map((tag) => (
              <span key={tag} className="hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Location if tagged */}
        {currentPost.location && (
          <div className="flex items-center gap-1 text-[11px] text-neutral-300 mt-1.5">
            <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
            <span className="truncate">{currentPost.location}</span>
          </div>
        )}

        {/* Sound Bar with marquee */}
        <div className="flex items-center gap-2 mt-2 max-w-[260px] text-xs font-medium text-neutral-200">
          <Music className="w-3.5 h-3.5 shrink-0" />
          <div className="overflow-hidden whitespace-nowrap">
            <span className="inline-block animate-pulse">
              {currentPost.sound?.title || 'Original Sound'} - {currentPost.sound?.author || currentPost.author.displayName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
