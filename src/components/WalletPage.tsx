import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  History,
  Coins,
  ChevronRight,
  Lock
} from 'lucide-react';
import { CoinPackage, Transaction, User } from '../types';
import { api } from '../services/api';

interface WalletPageProps {
  currentUser: User;
  onRefreshUser: () => void;
  onNavigateToWithdrawal: () => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({
  currentUser,
  onRefreshUser,
  onNavigateToWithdrawal
}) => {
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<CoinPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'JazzCash' | 'Easypaisa' | 'Card'>('JazzCash');
  const [accountNumber, setAccountNumber] = useState('03001234567');
  const [mpin, setMpin] = useState('1234');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<{
    txId: string;
    coinsAdded: number;
    amountRs: number;
    method: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'recharge' | 'history'>('recharge');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const pkgData = await api.getPackages();
      setPackages(pkgData.packages);
      setSelectedPackage(pkgData.packages[0]); // Default to popular package 1

      const txs = await api.getTransactions();
      setTransactions(txs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRechargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await api.rechargeCoins({
        packageId: selectedPackage.id,
        method: paymentMethod,
        accountNumber,
        mpin
      });

      setSuccessReceipt({
        txId: res.transactionId,
        coinsAdded: res.coinsAdded,
        amountRs: selectedPackage.priceRs,
        method: paymentMethod
      });

      onRefreshUser();
      const updatedTxs = await api.getTransactions();
      setTransactions(updatedTxs);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment failed. Please check details and retry.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-black text-white overflow-y-auto no-scrollbar pb-16">
      {/* Wallet Balance Hero Card */}
      <div className="p-4 bg-gradient-to-b from-neutral-900 to-black border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-extrabold tracking-tight">EITA Wallet</h1>
          </div>
          <button
            onClick={onNavigateToWithdrawal}
            className="flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <span>Host Earnings & Withdraw</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Display */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-600/30 via-yellow-700/20 to-neutral-900 border border-amber-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-amber-300/80 uppercase tracking-wider block">
                Total Coins Balance
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-white font-mono tabular-nums">
                  {currentUser.walletBalance.toLocaleString()}
                </span>
                <span className="text-amber-400 font-extrabold text-sm">Coins</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow-inner">
              🪙
            </div>
          </div>

          {/* Earnings snippet */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Gift Earnings Received:</span>
            <span className="font-mono font-bold text-emerald-400">
              {currentUser.totalEarnings.toLocaleString()} 🪙 (≈ Rs. {Math.floor((currentUser.totalEarnings / 250000) * 100).toLocaleString()})
            </span>
          </div>
        </div>

        {/* Tab switch: Recharge vs History */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-neutral-900 rounded-xl">
          <button
            onClick={() => setActiveTab('recharge')}
            className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'recharge'
                ? 'bg-rose-500 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Recharge Coins
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'bg-rose-500 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Transaction History
          </button>
        </div>
      </div>

      {/* TAB 1: RECHARGE PACKAGES & MOCK GATEWAY */}
      {activeTab === 'recharge' && (
        <div className="p-4 space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
            Select EITA Coins Package
          </h2>

          {/* Packages Grid */}
          <div className="grid grid-cols-2 gap-3">
            {packages.map((pkg) => {
              const isSelected = selectedPackage?.id === pkg.id;
              return (
                <button
                  key={pkg.id}
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setSuccessReceipt(null);
                    setErrorMessage(null);
                  }}
                  className={`p-3.5 rounded-2xl border flex flex-col text-left transition-all relative cursor-pointer ${
                    isSelected
                      ? 'border-rose-500 bg-rose-500/15 shadow-[0_0_20px_rgba(254,44,85,0.25)] scale-[1.02]'
                      : 'border-white/10 bg-neutral-900/80 hover:border-white/20'
                  }`}
                >
                  {pkg.badge && (
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-[9px] font-black text-white shadow-md">
                      {pkg.badge}
                    </span>
                  )}

                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-lg">🪙</span>
                    <span className="text-base font-black text-white font-mono">
                      {pkg.coins.toLocaleString()}
                    </span>
                  </div>

                  <span className="text-xs text-neutral-400 font-medium">EITA Coins</span>

                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-amber-300">
                      Rs. {pkg.priceRs}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-rose-500 fill-rose-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* PAYMENT GATEWAY CHECKOUT SECTION */}
          {selectedPackage && (
            <div className="mt-5 p-4 rounded-3xl bg-neutral-900/90 border border-white/10 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Secure Checkout: Rs. {selectedPackage.priceRs}
                </h3>
              </div>

              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { id: 'JazzCash', label: 'JazzCash', icon: '📱', color: 'border-red-500/40' },
                  { id: 'Easypaisa', label: 'Easypaisa', icon: '🟢', color: 'border-emerald-500/40' },
                  { id: 'Card', label: 'Debit / Card', icon: '💳', color: 'border-blue-500/40' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === m.id
                        ? 'border-rose-500 bg-rose-500/20 text-white shadow-sm'
                        : 'border-white/10 bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Payment Input Form */}
              <form onSubmit={handleRechargeSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                    {paymentMethod === 'Card' ? 'Card Number' : `${paymentMethod} Mobile Number`}
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder={paymentMethod === 'Card' ? '4111 2222 3333 4444' : '0300 1234567'}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-300 block mb-1 flex items-center justify-between">
                    <span>{paymentMethod === 'Card' ? 'CVV Code' : '4-Digit MPIN / OTP'}</span>
                    <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> 256-bit Encrypted
                    </span>
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={mpin}
                    onChange={(e) => setMpin(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 font-mono tracking-widest focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="p-2.5 bg-rose-950/80 border border-rose-500/40 rounded-xl flex items-center gap-2 text-xs text-rose-300">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30 active:scale-95 transition-transform cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Contacting {paymentMethod} Gateway...</span>
                  ) : (
                    <span>
                      Pay Rs. {selectedPackage.priceRs} & Get {selectedPackage.coins.toLocaleString()} Coins
                    </span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Success Payment Receipt Modal */}
          {successReceipt && (
            <div className="p-4 rounded-3xl bg-emerald-950/80 border border-emerald-500/40 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <h4 className="text-sm font-bold">Payment Verified & Coins Credited!</h4>
              </div>
              <p className="text-xs text-neutral-300 mb-3">
                Your account was credited with <strong>{successReceipt.coinsAdded.toLocaleString()} EITA Coins</strong>.
              </p>
              <div className="bg-black/50 p-3 rounded-xl border border-white/10 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Transaction ID:</span>
                  <span className="text-white font-bold">{successReceipt.txId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Amount Paid:</span>
                  <span className="text-amber-400 font-bold">Rs. {successReceipt.amountRs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Gateway:</span>
                  <span className="text-white">{successReceipt.method}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TRANSACTION HISTORY */}
      {activeTab === 'history' && (
        <div className="p-4 space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
            Recent Wallet Transactions
          </h2>

          {transactions.length === 0 ? (
            <div className="py-12 text-center text-neutral-500">
              <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        tx.type === 'recharge'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : tx.type === 'withdrawal'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {tx.type === 'recharge' ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : tx.type === 'withdrawal' ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <Sparkles className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block capitalize">
                        {tx.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {tx.id} · {tx.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-black font-mono block ${
                        tx.type === 'recharge'
                          ? 'text-emerald-400'
                          : tx.type === 'withdrawal'
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {tx.type === 'recharge' ? '+' : '-'}
                      {tx.amountCoins.toLocaleString()} 🪙
                    </span>
                    {tx.amountRs && (
                      <span className="text-[10px] text-neutral-400">Rs. {tx.amountRs}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
