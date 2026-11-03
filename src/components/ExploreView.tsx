import React, { useState } from 'react';
import { Search, Flame, Music, Play, CheckCircle2, TrendingUp } from 'lucide-react';
import { Post, User } from '../types';

interface ExploreViewProps {
  posts: Post[];
  users: User[];
  onSelectPost: (post: Post) => void;
  onSelectUser: (userId: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  posts,
  users,
  onSelectPost,
  onSelectUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const trendingTags = [
    { tag: 'PKBattle', count: '1.4M views' },
    { tag: 'NorthernPakistan', count: '890k views' },
    { tag: 'PhotoMode', count: '2.1M views' },
    { tag: 'KarachiStreetFood', count: '650k views' },
    { tag: 'PoppoVoiceRooms', count: '430k views' },
    { tag: 'DuetChallenge', count: '1.1M views' }
  ];

  const filteredPosts = posts.filter(
    (p) =>
      p.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.hashtags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.author.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-black text-white overflow-y-auto no-scrollbar pb-16">
      {/* Search Header */}
      <div className="p-3 bg-neutral-950 border-b border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-2 bg-neutral-900 border border-white/10 rounded-full px-3.5 py-2">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search videos, creators, or #hashtags..."
            className="flex-1 bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="p-3 space-y-4">
        {/* Trending Tags Carousel */}
        {!searchTerm && (
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300">
                Trending on EITA
              </h2>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {trendingTags.map((item) => (
                <button
                  key={item.tag}
                  onClick={() => setSearchTerm(item.tag)}
                  className="px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-xs font-bold text-neutral-200 hover:text-white flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                >
                  <span className="text-rose-500">#</span>
                  <span>{item.tag}</span>
                  <span className="text-[10px] text-neutral-500 font-normal">· {item.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Matched Creators (if searching) */}
        {searchTerm && filteredUsers.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-neutral-400 mb-2">Creators</h3>
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onSelectUser(user.id)}
                  className="w-full p-2.5 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-between text-left cursor-pointer hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white">{user.displayName}</span>
                        {user.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-400">@{user.username}</span>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">
                    {user.followersCount.toLocaleString()} followers
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Videos Grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              {searchTerm ? `Search Results (${filteredPosts.length})` : 'Popular Discoveries'}
            </h3>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-xs">
              No matching content found for "{searchTerm}"
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {filteredPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 relative aspect-[3/4] group text-left cursor-pointer"
                >
                  <img
                    src={post.thumbnailUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {post.type === 'photo' && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-pink-300">
                      Photo
                    </span>
                  )}

                  <div className="absolute bottom-2 inset-x-2 pointer-events-none">
                    <p className="text-[11px] font-medium text-white line-clamp-2 leading-tight">
                      {post.caption}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-300">
                      <span className="truncate">@{post.author.username}</span>
                      <span className="flex items-center gap-0.5 font-mono">
                        <Play className="w-2.5 h-2.5 fill-white" />
                        {post.likesCount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
