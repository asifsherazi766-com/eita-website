import React, { useState } from 'react';
import { X, Copy, MessageCircle, Share2, Layers, Scissors, Flag, Check } from 'lucide-react';
import { Post } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  onDuet: (post: Post) => void;
  onStitch: (post: Post) => void;
  onReport: (postId: string, reason: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  post,
  onDuet,
  onStitch,
  onReport
}) => {
  const [copied, setCopied] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reported, setReported] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin + `?post=${post.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendReport = (reason: string) => {
    onReport(post.id, reason);
    setReported(true);
    setTimeout(() => {
      setReported(false);
      setShowReportDialog(false);
      onClose();
    }, 1500);
  };

  const reportOptions = [
    'Inappropriate Content or Nudity',
    'Hate Speech or Harassment',
    'Dangerous Acts or Self-Harm',
    'Frauds and Scams',
    'Copyright Infringement',
    'Spam or Misleading Information'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-neutral-900 border-t border-white/10 rounded-t-2xl shadow-2xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span className="text-sm font-bold text-white">Share to</span>
          <button onClick={onClose} className="text-neutral-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Share Grid */}
        {!showReportDialog ? (
          <div className="space-y-5 pt-4">
            {/* Social Share Apps */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <button
                onClick={handleCopyLink}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-white group-hover:bg-neutral-700 transition-colors">
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </div>
                <span className="text-[11px] font-medium text-neutral-300">
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>

              <button
                onClick={() => {
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this video on EITA: ${window.location.href}`)}`, '_blank');
                  onClose();
                }}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-600/90 flex items-center justify-center text-white group-hover:bg-emerald-500 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-neutral-300">WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                  onClose();
                }}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600/90 flex items-center justify-center text-white group-hover:bg-blue-500 transition-colors">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-neutral-300">Facebook</span>
              </button>

              <button
                onClick={() => setShowReportDialog(true)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:bg-rose-900 transition-colors">
                  <Flag className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-rose-300">Report</span>
              </button>
            </div>

            {/* Creator Collab Tools: Duet & Stitch */}
            <div className="pt-2 border-t border-white/10">
              <span className="text-xs font-semibold text-neutral-400 block mb-3">Collab Features</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onDuet(post);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-cyan-500/30 text-left transition-colors cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Duet</span>
                    <span className="text-[10px] text-neutral-400">Side-by-side reaction</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onStitch(post);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-pink-500/30 text-left transition-colors cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Stitch</span>
                    <span className="text-[10px] text-neutral-400">Clip & reply video</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Report Drawer */
          <div className="pt-3 space-y-2">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold text-rose-400">Select Report Reason</span>
              <button
                onClick={() => setShowReportDialog(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Back
              </button>
            </div>

            {reported ? (
              <div className="py-8 text-center text-emerald-400">
                <Check className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-bold">Report Submitted</p>
                <p className="text-xs text-neutral-400 mt-1">Thank you for keeping EITA safe.</p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {reportOptions.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => handleSendReport(reason)}
                    className="w-full p-2.5 text-left text-xs text-neutral-200 bg-neutral-800/70 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>{reason}</span>
                    <Flag className="w-3.5 h-3.5 text-neutral-500" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
