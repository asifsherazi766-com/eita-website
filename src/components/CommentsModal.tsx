import React, { useState } from 'react';
import { X, Heart, Send, CheckCircle2, CornerDownRight } from 'lucide-react';
import { Comment, User } from '../types';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  currentUser: User;
  onAddComment: (text: string, replyToId?: string) => Promise<void>;
  onLikeComment?: (commentId: string) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  comments,
  currentUser,
  onAddComment
}) => {
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [localLikedComments, setLocalLikedComments] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onAddComment(inputText.trim(), replyingTo?.id);
      setInputText('');
      setReplyingTo(null);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCommentLike = (id: string) => {
    setLocalLikedComments((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const quickEmojis = ['🔥', '❤️', '👏', '😂', '✨', '💯', '🇵🇰'];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-neutral-900 border-t border-white/10 rounded-t-2xl flex flex-col h-[65vh] max-h-[550px] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="w-6" /> {/* Placeholder for balance */}
          <div className="text-center">
            <h3 className="text-white text-sm font-bold">Comments</h3>
            <span className="text-[11px] text-neutral-400">
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments Scrollable List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 no-scrollbar">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400 py-10">
              <span className="text-4xl mb-2">💬</span>
              <p className="text-sm font-medium text-neutral-300">No comments yet</p>
              <p className="text-xs text-neutral-500 mt-1">Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => {
              const isLiked = localLikedComments[comment.id] || comment.isLiked;
              const likes = (comment.likesCount || 0) + (localLikedComments[comment.id] && !comment.isLiked ? 1 : 0);

              return (
                <div key={comment.id} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.username}
                      className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-neutral-200">
                          {comment.author.displayName}
                        </span>
                        {comment.author.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                        )}
                        <span className="text-[11px] text-neutral-400">· {comment.createdAt}</span>
                      </div>
                      <p className="text-sm text-neutral-100 mt-0.5 break-words leading-snug">
                        {comment.text}
                      </p>

                      <div className="flex items-center gap-4 mt-1.5">
                        <button
                          onClick={() => setReplyingTo(comment)}
                          className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        >
                          Reply
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCommentLike(comment.id)}
                      className="flex flex-col items-center justify-center shrink-0 cursor-pointer text-neutral-400 hover:text-rose-500 transition-colors pt-1"
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform active:scale-125 ${
                          isLiked ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                      {likes > 0 && (
                        <span className="text-[10px] font-medium mt-0.5 text-neutral-400">
                          {likes}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-12 space-y-2.5 pt-1">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-2.5">
                          <CornerDownRight className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-1" />
                          <img
                            src={reply.author.avatar}
                            alt={reply.author.username}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-white/10"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-neutral-200">
                                {reply.author.displayName}
                              </span>
                              {reply.author.isVerified && (
                                <CheckCircle2 className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                              )}
                              <span className="text-[10px] text-neutral-400">· {reply.createdAt}</span>
                            </div>
                            <p className="text-xs text-neutral-200 mt-0.5 leading-snug">
                              {reply.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Quick Emoji Bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-t border-white/5 bg-black/30 overflow-x-auto no-scrollbar">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setInputText((prev) => prev + emoji)}
              className="text-lg hover:scale-125 transition-transform active:scale-95 cursor-pointer px-1"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Replying Notice */}
        {replyingTo && (
          <div className="flex items-center justify-between px-4 py-1.5 bg-neutral-800 text-xs text-neutral-300">
            <span>
              Replying to <span className="font-bold text-white">@{replyingTo.author.username}</span>
            </span>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-3 bg-neutral-900 border-t border-white/10 flex items-center gap-2">
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/10"
          />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={replyingTo ? `Reply to @${replyingTo.author.username}...` : 'Add comment...'}
            className="flex-1 bg-neutral-800 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || submitting}
            className={`p-2 rounded-full transition-transform active:scale-95 cursor-pointer ${
              inputText.trim() && !submitting
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-neutral-800 text-neutral-600'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
