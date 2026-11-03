import React, { useState } from 'react';
import { X, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { Gift, GiftType, User } from '../types';

interface GiftStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  gifts: Gift[];
  onSendGift: (gift: Gift, count: number) => Promise<void>;
  onOpenRecharge: () => void;
}

export const GiftStoreModal: React.FC<GiftStoreModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  gifts,
  onSendGift,
  onOpenRecharge
}) => {
  const [selectedGiftId, setSelectedGiftId] = useState<string>(gifts[0]?.id || 'gift_1');
  const [giftCount, setGiftCount] = useState<number>(1);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedGift = gifts.find((g) => g.id === selectedGiftId) || gifts[0];
  const totalCost = selectedGift ? selectedGift.coins * giftCount : 0;
  const hasEnoughCoins = currentUser.walletBalance >= totalCost;

  const handleSend = async () => {
    if (!selectedGift) return;
    if (!hasEnoughCoins) {
      setErrorMsg(`Insufficient coins! Recharge now to send ${selectedGift.name}.`);
      return;
    }
    setErrorMsg(null);
    setSending(true);
    try {
      await onSendGift(selectedGift, giftCount);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send gift');
    } finally {
      setSending(false);
    }
  };

  const countPills = [1, 5, 10, 99];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-neutral-900 border-t border-white/10 rounded-t-3xl shadow-2xl p-4 flex flex-col max-h-[75vh]">
        {/* Top Bar: Title & Balance */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-white text-sm font-bold">EITA Gift Store</h3>
          </div>

          {/* User Coins & Recharge Trigger */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full">
              <span className="text-amber-400 text-xs font-bold">🪙</span>
              <span className="text-amber-300 text-xs font-black font-mono tabular-nums">
                {currentUser.walletBalance.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenRecharge();
              }}
              className="flex items-center gap-1 px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-bold transition-transform active:scale-95 cursor-pointer shadow-sm"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
              <span>Recharge</span>
            </button>

            <button onClick={onClose} className="text-neutral-400 hover:text-white ml-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error notice if insufficient balance */}
        {errorMsg && (
          <div className="mt-2.5 p-2 bg-rose-950/80 border border-rose-500/40 rounded-xl flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenRecharge();
              }}
              className="font-bold underline text-white ml-2 shrink-0"
            >
              Recharge Now
            </button>
          </div>
        )}

        {/* Gifts Grid */}
        <div className="grid grid-cols-3 gap-2.5 py-4 overflow-y-auto no-scrollbar">
          {gifts.map((gift) => {
            const isSelected = gift.id === selectedGiftId;
            return (
              <button
                key={gift.id}
                onClick={() => {
                  setSelectedGiftId(gift.id);
                  setErrorMsg(null);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-rose-500/15 border-rose-500 shadow-[0_0_15px_rgba(254,44,85,0.3)] scale-[1.02]'
                    : 'bg-neutral-800/60 border-white/5 hover:border-white/20 hover:bg-neutral-800'
                }`}
              >
                {/* Big Gift Emoji Icon */}
                <span className="text-4xl filter drop-shadow-md transform transition-transform group-hover:scale-110">
                  {gift.icon}
                </span>

                <span className="text-xs font-bold text-white mt-1.5">{gift.name}</span>

                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-amber-400 text-[10px]">🪙</span>
                  <span className="text-[11px] font-bold text-amber-300 font-mono">
                    {gift.coins.toLocaleString()}
                  </span>
                </div>

                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-neutral-900" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Actions: Multiplier Pills & Send Button */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
          {/* Quantity selector */}
          <div className="flex items-center gap-1.5 bg-neutral-800/80 p-1 rounded-xl border border-white/10">
            {countPills.map((count) => (
              <button
                key={count}
                onClick={() => setGiftCount(count)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  giftCount === count
                    ? 'bg-rose-500 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {count}x
              </button>
            ))}
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={sending}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-lg ${
              hasEnoughCoins
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-rose-500/25'
                : 'bg-neutral-800 border border-amber-500/30 text-amber-300 hover:bg-neutral-750'
            }`}
          >
            {sending ? (
              <span>Sending...</span>
            ) : hasEnoughCoins ? (
              <>
                <span>Send {giftCount > 1 ? `${giftCount}x ` : ''}{selectedGift?.name}</span>
                <span className="text-white/80 font-mono text-[11px]">
                  ({totalCost.toLocaleString()} 🪙)
                </span>
              </>
            ) : (
              <span>Recharge Coins to Send</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
