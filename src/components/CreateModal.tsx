import React, { useState } from 'react';
import {
  X,
  Video,
  Image as ImageIcon,
  Layers,
  Scissors,
  Music,
  MapPin,
  Sparkles,
  Upload,
  CheckCircle,
  Play
} from 'lucide-react';
import { Post, Sound, User } from '../types';
import { INITIAL_SOUNDS } from '../mock/initialData';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onCreatePost: (payload: Partial<Post>) => Promise<void>;
  duetTarget?: Post | null;
  stitchTarget?: Post | null;
}

export const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCreatePost,
  duetTarget,
  stitchTarget
}) => {
  const [contentType, setContentType] = useState<'video' | 'photo'>(
    duetTarget || stitchTarget ? 'video' : 'video'
  );
  const [duration, setDuration] = useState<number>(15); // 15, 60, 600 seconds
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>(['eita', 'foryou', 'trending']);
  const [newHashtagInput, setNewHashtagInput] = useState('');
  const [selectedSound, setSelectedSound] = useState<Sound>(INITIAL_SOUNDS[0]);
  const [location, setLocation] = useState('Lahore, Pakistan');
  const [submitting, setSubmitting] = useState(false);

  // Video preset samples or custom URL
  const [videoUrl, setVideoUrl] = useState(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );

  // Photo mode urls (1-10 photos)
  const [photoUrls, setPhotoUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80'
  ]);
  const [newPhotoInput, setNewPhotoInput] = useState('');

  if (!isOpen) return null;

  const handleAddHashtag = () => {
    const clean = newHashtagInput.replace('#', '').trim();
    if (clean && !hashtags.includes(clean)) {
      setHashtags([...hashtags, clean]);
      setNewHashtagInput('');
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const handleAddPhoto = () => {
    if (photoUrls.length >= 10) return;
    if (newPhotoInput.trim()) {
      setPhotoUrls([...photoUrls, newPhotoInput.trim()]);
      setNewPhotoInput('');
    } else {
      // Default stock image for quick adding
      const samplePhotos = [
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80'
      ];
      const randomPhoto = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
      setPhotoUrls([...photoUrls, randomPhoto]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    if (photoUrls.length <= 1) return;
    setPhotoUrls(photoUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreatePost({
        type: contentType,
        caption: caption.trim() || 'My latest post on EITA! 🚀✨',
        hashtags,
        sound: selectedSound,
        location,
        duration,
        videoUrl: contentType === 'video' ? videoUrl : undefined,
        photoUrls: contentType === 'photo' ? photoUrls : undefined,
        duetFrom: duetTarget
          ? {
              postId: duetTarget.id,
              authorName: duetTarget.author.username,
              videoUrl: duetTarget.videoUrl || ''
            }
          : undefined,
        stitchFrom: stitchTarget
          ? {
              postId: stitchTarget.id,
              authorName: stitchTarget.author.username,
              videoUrl: stitchTarget.videoUrl || '',
              startTime: 0
            }
          : undefined
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const videoPresets = [
    { name: 'Campfire', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { name: 'Joyful Drift', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4' },
    { name: 'Sci-Fi Action', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
    { name: 'Elephant Dream', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h2 className="text-white font-bold text-base">Create on EITA</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collab Indicator */}
        {duetTarget && (
          <div className="px-5 py-2 bg-cyan-950/80 border-b border-cyan-500/30 flex items-center gap-2 text-xs text-cyan-300">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>
              Duet Mode: Recording side-by-side with <strong>@{duetTarget.author.username}</strong>
            </span>
          </div>
        )}
        {stitchTarget && (
          <div className="px-5 py-2 bg-pink-950/80 border-b border-pink-500/30 flex items-center gap-2 text-xs text-pink-300">
            <Scissors className="w-4 h-4 text-pink-400" />
            <span>
              Stitch Mode: Stitching 5s clip from <strong>@{stitchTarget.author.username}</strong>
            </span>
          </div>
        )}

        {/* Scrollable Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          {/* Post Format Selector Tabs */}
          {!duetTarget && !stitchTarget && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-800 rounded-xl">
              <button
                type="button"
                onClick={() => setContentType('video')}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  contentType === 'video'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video Post</span>
              </button>

              <button
                type="button"
                onClick={() => setContentType('photo')}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  contentType === 'photo'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Photo Mode (1-10)</span>
              </button>
            </div>
          )}

          {/* Duration Selector for Video (15s to 10 min) */}
          {contentType === 'video' && (
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                Video Length
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '15s', sec: 15 },
                  { label: '60s', sec: 60 },
                  { label: '10 min', sec: 600 }
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setDuration(item.sec)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      duration === item.sec
                        ? 'border-rose-500 bg-rose-500/20 text-rose-300'
                        : 'border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Video preset picker */}
              <div className="mt-3">
                <span className="text-[11px] text-neutral-400 block mb-1">Select Video Sample:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {videoPresets.map((vp) => (
                    <button
                      key={vp.name}
                      type="button"
                      onClick={() => setVideoUrl(vp.url)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left flex items-center gap-1.5 cursor-pointer ${
                        videoUrl === vp.url
                          ? 'border-rose-500 bg-rose-500/15 text-white'
                          : 'border-white/5 bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Play className="w-3 h-3 text-rose-500 shrink-0" />
                      <span className="truncate">{vp.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Photo Mode Carousel Uploader / Manager (1-10 photos) */}
          {contentType === 'photo' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-300">
                  Photos in Carousel ({photoUrls.length}/10)
                </label>
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  disabled={photoUrls.length >= 10}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  + Add Photo
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {photoUrls.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-white/10">
                    <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute top-1 left-1 px-1.5 py-0.2 bg-black/70 text-[9px] rounded text-white font-bold">
                      {idx + 1}
                    </span>
                    {photoUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Caption Input */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Caption
            </label>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a catchy caption... Describe your video or photos"
              className="w-full bg-neutral-800 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Hashtags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {hashtags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-neutral-800 border border-white/10 rounded-full text-xs text-rose-400 font-semibold flex items-center gap-1"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveHashtag(tag)}
                    className="hover:text-white cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newHashtagInput}
                onChange={(e) => setNewHashtagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddHashtag();
                  }
                }}
                placeholder="Add tag (e.g. foodtiktok)"
                className="flex-1 bg-neutral-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
              />
              <button
                type="button"
                onClick={handleAddHashtag}
                className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-xs font-bold text-white cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Sound Picker */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-rose-400" />
              <span>Background Sound</span>
            </label>
            <div className="space-y-1.5">
              {INITIAL_SOUNDS.map((sound) => (
                <button
                  key={sound.id}
                  type="button"
                  onClick={() => setSelectedSound(sound)}
                  className={`w-full p-2.5 rounded-xl border flex items-center gap-3 text-left transition-colors cursor-pointer ${
                    selectedSound.id === sound.id
                      ? 'border-rose-500 bg-rose-500/10 text-white'
                      : 'border-white/5 bg-neutral-800 text-neutral-300 hover:bg-neutral-750'
                  }`}
                >
                  <img src={sound.cover} alt={sound.title} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold block truncate">{sound.title}</span>
                    <span className="text-[10px] text-neutral-400">{sound.author}</span>
                  </div>
                  {selectedSound.id === sound.id && (
                    <CheckCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Add Location</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g. Islamabad, Pakistan)"
              className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 active:scale-95 transition-transform cursor-pointer"
            >
              {submitting ? (
                <span>Publishing to EITA...</span>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Post Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
