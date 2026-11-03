import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Coins,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { User, WithdrawalRequest } from '../types';
import { api } from '../services/api';

interface WithdrawalPageProps {
  currentUser: User;
  onBack: () => void;
  onRefreshUser: () => void;
}

export const WithdrawalPage: React.FC<WithdrawalPageProps> = ({
  currentUser,
  onBack,
  onRefreshUser
}) => {
  const [method, setMethod] = useState<'JazzCash' | 'Easypaisa'>('JazzCash');
  const [accountNumber, setAccountNumber] = useState(currentUser.phone?.replace(/[^0-9]/g, '') || '03001234567');
  const [accountTitle, setAccountTitle] = useState(currentUser.displayName.replace(/[^\w\s]/gi, '').trim() || 'Ali Khan');
  const [amountCoins, setAmountCoins] = useState<number>(1250000); // 1.25M coins = Rs 500 minimum
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [myWithdrawals, setMyWithdrawals] = useState<WithdrawalRequest[]>([]);

  // Economics: 250,000 Coins = Rs. 100 Host payout
  const coinsPerRs100 = 250000;
  const calculatedRs = Math.floor((amountCoins / coinsPerRs100) * 100);
  const minCoins = 1250000; // Rs 500 minimum

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const loadWithdrawals = async () => {
    try {
      const allWds = await api.getAdminWithdrawals();
      setMyWithdrawals(allWds.filter((w) => w.hostId === currentUser.id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (calculatedRs < 500) {
      setMessage({ type: 'error', text: 'Minimum withdrawal amount is Rs. 500 (1,250,000 Coins).' });
      return;
    }
    if (currentUser.totalEarnings < amountCoins) {
      setMessage({ type: 'error', text: `Insufficient gift earnings. You have ${currentUser.totalEarnings.toLocaleString()} Coins.` });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await api.requestWithdrawal({
        amountCoins,
        method,
        accountNumber,
        accountTitle
      });

      setMessage({ type: 'success', text: res.message });
      onRefreshUser();
      loadWithdrawals();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Withdrawal request failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-black text-white overflow-y-auto no-scrollbar pb-16">
      {/* Header */}
      <div className="p-4 bg-neutral-950 border-b border-white/10 flex items-center gap-3">
        <button onClick={onBack} className="p-1 rounded-full text-neutral-400 hover:text-white cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold tracking-tight">Host Earnings Withdrawal</h1>
          <span className="text-[11px] text-neutral-400">Withdraw your live stream & post gift coins</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Earnings Metric Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-rose-950/40 border border-white/10 shadow-xl">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            Available Creator Gift Earnings
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-amber-400 font-mono tabular-nums">
              {currentUser.totalEarnings.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-neutral-400">Coins</span>
          </div>

          {/* Conversion explanation box */}
          <div className="mt-3 p-3 rounded-2xl bg-black/50 border border-white/5 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Official Conversion Rate:</span>
              <span className="font-bold text-white font-mono">250,000 Coins = Rs. 100</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Your Withdrawable Cash:</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">
                ≈ Rs. {Math.floor((currentUser.totalEarnings / coinsPerRs100) * 100).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-white/5 text-[11px] text-neutral-400">
              <span>Minimum Payout:</span>
              <span className="text-amber-300 font-bold">Rs. 500 (1,250,000 Coins)</span>
            </div>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="p-4 rounded-3xl bg-neutral-900/90 border border-white/10 shadow-xl">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            Submit Cashout Request
          </h2>

          <form onSubmit={handleWithdrawSubmit} className="space-y-3.5">
            {/* Method Picker */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                Select Payout Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('JazzCash')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                    method === 'JazzCash'
                      ? 'border-red-500 bg-red-500/20 text-white'
                      : 'border-white/10 bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>📱</span>
                  <span>JazzCash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('Easypaisa')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                    method === 'Easypaisa'
                      ? 'border-emerald-500 bg-emerald-500/20 text-white'
                      : 'border-white/10 bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>🟢</span>
                  <span>Easypaisa</span>
                </button>
              </div>
            </div>

            {/* Account Title */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Account Title (Full Name on {method})
              </label>
              <input
                type="text"
                value={accountTitle}
                onChange={(e) => setAccountTitle(e.target.value)}
                placeholder="e.g. Ali Raza Khan"
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                {method} Mobile / Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="0300 1234567"
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            {/* Amount Coins & Calculated Rs */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-300 mb-1">
                <span>Coins to Withdraw</span>
                <span className="text-emerald-400 font-bold font-mono">
                  You Receive: Rs. {calculatedRs.toLocaleString()}
                </span>
              </div>
              <input
                type="number"
                step={250000}
                min={minCoins}
                max={currentUser.totalEarnings || minCoins}
                value={amountCoins}
                onChange={(e) => setAmountCoins(Number(e.target.value))}
                className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                required
              />

              {/* Quick Select Pill Presets */}
              <div className="flex gap-2 mt-2">
                {[
                  { label: 'Rs. 500 (1.25M)', coins: 1250000 },
                  { label: 'Rs. 1,000 (2.5M)', coins: 2500000 },
                  { label: 'All Coins', coins: currentUser.totalEarnings }
                ].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAmountCoins(p.coins)}
                    className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-[10px] font-bold text-neutral-300 border border-white/5 cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {message && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  message.type === 'success'
                    ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/80 border border-rose-500/40 text-rose-300'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || currentUser.totalEarnings < minCoins}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform cursor-pointer disabled:opacity-40"
            >
              {submitting ? (
                <span>Submitting Request...</span>
              ) : (
                <>
                  <span>Request Cashout (Rs. {calculatedRs.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Withdrawal Status History */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Your Withdrawal Requests & Status
          </h3>

          {myWithdrawals.length === 0 ? (
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 text-center text-xs text-neutral-500">
              No previous withdrawal requests found.
            </div>
          ) : (
            myWithdrawals.map((wd) => (
              <div
                key={wd.id}
                className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{wd.id}</span>
                    <span className="text-[10px] text-neutral-400">· {wd.createdAt}</span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                      wd.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : wd.status === 'rejected'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                    }`}
                  >
                    {wd.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                    {wd.status === 'rejected' && <XCircle className="w-3 h-3" />}
                    {wd.status === 'pending' && <Clock className="w-3 h-3" />}
                    <span>{wd.status}</span>
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-neutral-400">{wd.method}: </span>
                    <span className="text-white font-mono">{wd.accountTitle} ({wd.accountNumber})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400 font-mono">Rs. {wd.amountRs}</span>
                    <span className="text-[10px] text-neutral-500 block">({wd.amountCoins.toLocaleString()} 🪙)</span>
                  </div>
                </div>

                {wd.rejectionReason && (
                  <div className="p-2 bg-rose-950/40 rounded-lg text-[11px] text-rose-300">
                    Reason: {wd.rejectionReason}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
