import React, { useState, useEffect } from 'react';
import {
  Radio,
  Mic,
  MicOff,
  Lock,
  Unlock,
  UserX,
  Swords,
  Gift,
  Send,
  Users,
  Sparkles,
  Flame,
  Volume2,
  CheckCircle2,
  Palette,
  ChevronLeft
} from 'lucide-react';
import { LiveRoom, User, Gift as GiftModel, LiveChatMessage } from '../types';

interface LiveRoomsViewProps {
  rooms: LiveRoom[];
  currentUser: User;
  onOpenGiftStore: (targetId: string) => void;
  onSeatAction: (roomId: string, action: 'take_seat' | 'leave_seat' | 'toggle_mute' | 'toggle_lock' | 'kick', seatIndex: number) => Promise<void>;
  onThemeChange: (roomId: string, theme: string) => Promise<void>;
}

export const LiveRoomsView: React.FC<LiveRoomsViewProps> = ({
  rooms,
  currentUser,
  onOpenGiftStore,
  onSeatAction,
  onThemeChange
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(rooms[0]?.id || null);
  const [filterType, setFilterType] = useState<'all' | 'video' | 'voice'>('all');
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showThemePicker, setShowThemePicker] = useState(false);

  const activeRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  // Simulated live chat feed & viewers joining
  useEffect(() => {
    if (!activeRoom) return;

    // Seed initial messages
    setChatMessages([
      {
        id: 'msg_1',
        userId: 'u_fan1',
        username: 'lahore_boy',
        displayName: 'Hamad',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        text: 'Assalam o Alaikum host! Amazing energy tonight 🔥',
        type: 'chat',
        timestamp: 'Just now'
      },
      {
        id: 'msg_2',
        userId: 'u_fan2',
        username: 'sara_khan',
        displayName: 'Sara K',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        text: 'Team Blue lets win this PK Battle!! 💙🚀',
        type: 'chat',
        timestamp: 'Just now'
      }
    ]);

    // Interval simulating live audience incoming comments and gifts
    const interval = setInterval(() => {
      const fanNames = ['Ali', 'Zainab', 'Bilal', 'Ayesha', 'Usman', 'Farah', 'Tariq'];
      const randomName = fanNames[Math.floor(Math.random() * fanNames.length)];
      const randomComments = [
        'Sending love from Karachi! 🇵🇰❤️',
        'Drop the Universe gift guys! 🌌🔥',
        'Who is winning this PK battle??',
        'Host voice is so soothing ✨',
        'Seat 3 mic open hai please check',
        'Best live stream on EITA! 👏'
      ];
      const randomText = randomComments[Math.floor(Math.random() * randomComments.length)];

      const newMsg: LiveChatMessage = {
        id: `sim_${Date.now()}`,
        userId: `fan_${Date.now()}`,
        username: `${randomName.toLowerCase()}_${Math.floor(Math.random() * 900)}`,
        displayName: randomName,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=100&auto=format&fit=crop&q=80`,
        text: randomText,
        type: 'chat',
        timestamp: 'Now'
      };

      setChatMessages((prev) => [...prev.slice(-15), newMsg]);
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedRoomId]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: LiveChatMessage = {
      id: `my_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      isVerified: currentUser.isVerified,
      text: inputMessage.trim(),
      type: 'chat',
      timestamp: 'Now'
    };

    setChatMessages((prev) => [...prev.slice(-15), userMsg]);
    setInputMessage('');
  };

  const filteredRooms = rooms.filter((r) => {
    if (filterType === 'video') return r.type === 'video';
    if (filterType === 'voice') return r.type === 'voice';
    return true;
  });

  const themeGradients = {
    neon: 'from-fuchsia-950 via-purple-950 to-slate-950',
    party: 'from-pink-950 via-rose-950 to-neutral-950',
    royal: 'from-amber-950 via-yellow-950 to-slate-950',
    galaxy: 'from-indigo-950 via-blue-950 to-slate-950',
    luxury: 'from-neutral-900 via-neutral-950 to-black'
  };

  return (
    <div className="w-full h-full flex flex-col bg-black text-white overflow-hidden pb-14">
      {/* Top Header / Room Selector Strip */}
      <div className="p-3 bg-neutral-950 border-b border-white/10 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            <h1 className="text-sm font-bold tracking-tight">EITA Live Arena</h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Users className="w-3.5 h-3.5" />
            <span>{rooms.reduce((acc, r) => acc + r.viewerCount, 0).toLocaleString()} Watching</span>
          </div>
        </div>

        {/* Room Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              filterType === 'all'
                ? 'bg-rose-500 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            All Live ({rooms.length})
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0 ${
              filterType === 'video'
                ? 'bg-rose-500 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Swords className="w-3 h-3" />
            <span>Video PK Battle</span>
          </button>
          <button
            onClick={() => setFilterType('voice')}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0 ${
              filterType === 'voice'
                ? 'bg-rose-500 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Mic className="w-3 h-3" />
            <span>12-Seat Voice Room</span>
          </button>
        </div>
      </div>

      {/* Main Room Viewport */}
      {activeRoom ? (
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Room Header Info */}
          <div className="absolute top-2 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
            {/* Host Pill */}
            <div className="flex items-center gap-2 p-1 pr-3 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
              <img
                src={activeRoom.host.avatar}
                alt={activeRoom.host.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  {activeRoom.host.displayName}
                  {activeRoom.host.isVerified && (
                    <CheckCircle2 className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                  )}
                </span>
                <span className="text-[10px] text-amber-300 font-mono">
                  🪙 {activeRoom.totalCoinsReceived.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Room Viewer Counter & Switcher */}
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[11px] font-bold text-white/90 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                <span>{activeRoom.viewerCount.toLocaleString()}</span>
              </div>

              {/* Theme Picker for Voice Room */}
              {activeRoom.type === 'voice' && (
                <button
                  onClick={() => setShowThemePicker(!showThemePicker)}
                  className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-pink-400 transition-colors cursor-pointer"
                  title="Change Background Theme"
                >
                  <Palette className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Theme Selector Drawer */}
          {showThemePicker && (
            <div className="absolute top-14 right-3 z-40 bg-neutral-900 border border-white/10 rounded-2xl p-2.5 shadow-2xl flex flex-col gap-1.5 animate-in fade-in">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                Voice Room Theme
              </span>
              {(['luxury', 'neon', 'party', 'royal', 'galaxy'] as const).map((thm) => (
                <button
                  key={thm}
                  onClick={() => {
                    onThemeChange(activeRoom.id, thm);
                    setShowThemePicker(false);
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg text-left capitalize cursor-pointer ${
                    activeRoom.backgroundTheme === thm
                      ? 'bg-rose-500 text-white'
                      : 'hover:bg-neutral-800 text-neutral-300'
                  }`}
                >
                  {thm}
                </button>
              ))}
            </div>
          )}

          {/* ================= A) LIVE VIDEO ROOM (PK BATTLE) ================= */}
          {activeRoom.type === 'video' && (
            <div className="relative flex-1 flex flex-col bg-black">
              {/* PK Battle Score Progress Bar */}
              {activeRoom.isPKBattle && activeRoom.pkChallenger && (
                <div className="absolute top-14 inset-x-3 z-20 pointer-events-auto">
                  <div className="bg-black/70 backdrop-blur-md p-2 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between text-xs font-extrabold mb-1">
                      <span className="text-cyan-400">
                        {activeRoom.host.displayName} ({((activeRoom.pkHostScore || 0) / 1000).toFixed(0)}k)
                      </span>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500/40 text-rose-300 text-[10px]">
                        <Swords className="w-3 h-3 animate-bounce" />
                        <span>PK 02:45</span>
                      </div>
                      <span className="text-pink-400">
                        ({((activeRoom.pkChallenger.score || 0) / 1000).toFixed(0)}k) {activeRoom.pkChallenger.host.displayName}
                      </span>
                    </div>

                    {/* Dual Tug-of-War Bar */}
                    <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                        style={{
                          width: `${Math.max(
                            15,
                            Math.min(
                              85,
                              ((activeRoom.pkHostScore || 1) /
                                ((activeRoom.pkHostScore || 1) + (activeRoom.pkChallenger.score || 1))) *
                                100
                            )
                          )}%`
                        }}
                      />
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500 flex-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Split Screen Video Streams */}
              <div className="flex-1 flex w-full h-full pt-12 pb-24">
                {/* Host Stream (Left) */}
                <div className="w-1/2 h-full relative border-r border-white/10 overflow-hidden">
                  <video
                    src={activeRoom.videoStreamUrl}
                    loop
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-cyan-950/80 border border-cyan-500/40 rounded text-[10px] text-cyan-300 font-bold">
                    HOST 👑
                  </div>
                </div>

                {/* Challenger Stream (Right) */}
                {activeRoom.pkChallenger && (
                  <div className="w-1/2 h-full relative overflow-hidden">
                    <video
                      src={activeRoom.pkChallenger.videoStreamUrl}
                      loop
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-pink-950/80 border border-pink-500/40 rounded text-[10px] text-pink-300 font-bold">
                      CHALLENGER ⚔️
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= B) VOICE CHAT ROOM (12 SEATS POPPO / NITO STYLE) ================= */}
          {activeRoom.type === 'voice' && (
            <div
              className={`flex-1 flex flex-col bg-gradient-to-b ${
                themeGradients[activeRoom.backgroundTheme || 'luxury']
              } p-3 pt-14 pb-24 overflow-y-auto no-scrollbar`}
            >
              {/* Room Title & Notice */}
              <div className="text-center mb-3">
                <h2 className="text-xs font-bold text-white tracking-wide">
                  {activeRoom.title}
                </h2>
                {activeRoom.announcement && (
                  <p className="text-[10px] text-pink-300/80 mt-0.5 max-w-xs mx-auto truncate">
                    📢 {activeRoom.announcement}
                  </p>
                )}
              </div>

              {/* 12 SEATS GRID (Poppo / NITO Stage) */}
              <div className="grid grid-cols-4 gap-2.5 max-w-sm mx-auto w-full my-auto">
                {activeRoom.seats?.map((seat) => {
                  const isHostSeat = seat.seatIndex === 0;
                  const isMeOnSeat = seat.user?.id === currentUser.id;
                  const isRoomHost = activeRoom.hostId === currentUser.id;

                  return (
                    <div
                      key={seat.seatIndex}
                      className="flex flex-col items-center justify-center p-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all relative group"
                    >
                      {/* Seat Badge / Number */}
                      <span className="absolute top-1 left-2 text-[9px] font-bold text-white/50">
                        #{seat.seatIndex + 1}
                      </span>

                      {/* Microphone / Lock Indicators */}
                      <div className="absolute top-1 right-2 flex items-center gap-1">
                        {seat.isMuted && <MicOff className="w-3 h-3 text-rose-400" />}
                        {seat.isLocked && <Lock className="w-3 h-3 text-amber-400" />}
                      </div>

                      {/* Avatar or Empty Slot */}
                      {seat.user ? (
                        <div className="relative mt-2">
                          <img
                            src={seat.user.avatar}
                            alt={seat.user.username}
                            className={`w-11 h-11 rounded-full object-cover border-2 ${
                              seat.isSpeaking
                                ? 'border-emerald-400 ring-4 ring-emerald-500/40 animate-pulse'
                                : isHostSeat
                                ? 'border-amber-400'
                                : 'border-white/20'
                            }`}
                          />
                          {isHostSeat && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1 bg-amber-500 text-black text-[8px] font-black rounded-full uppercase">
                              Host
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => onSeatAction(activeRoom.id, 'take_seat', seat.seatIndex)}
                          disabled={seat.isLocked}
                          className="w-11 h-11 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-colors cursor-pointer mt-2 disabled:opacity-40"
                          title="Take Seat"
                        >
                          {seat.isLocked ? <Lock className="w-4 h-4 text-amber-400" /> : <Mic className="w-4 h-4" />}
                        </button>
                      )}

                      {/* Seat User Name */}
                      <span className="text-[10px] font-bold text-neutral-200 mt-1 max-w-[65px] truncate text-center">
                        {seat.user ? seat.user.displayName : seat.isLocked ? 'Locked' : 'Take Seat'}
                      </span>

                      {/* Interactive Seat Action Controls */}
                      <div className="flex items-center gap-1.5 mt-1">
                        {isMeOnSeat ? (
                          <>
                            <button
                              onClick={() => onSeatAction(activeRoom.id, 'toggle_mute', seat.seatIndex)}
                              className="p-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                              title={seat.isMuted ? 'Unmute' : 'Mute'}
                            >
                              {seat.isMuted ? <MicOff className="w-3 h-3 text-rose-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}
                            </button>
                            <button
                              onClick={() => onSeatAction(activeRoom.id, 'leave_seat', seat.seatIndex)}
                              className="px-1.5 py-0.5 rounded bg-rose-600/80 text-[9px] font-bold text-white hover:bg-rose-700 cursor-pointer"
                            >
                              Leave
                            </button>
                          </>
                        ) : isRoomHost ? (
                          <>
                            <button
                              onClick={() => onSeatAction(activeRoom.id, 'toggle_lock', seat.seatIndex)}
                              className="p-1 rounded bg-white/10 hover:bg-white/20 text-neutral-300 cursor-pointer"
                              title={seat.isLocked ? 'Unlock Seat' : 'Lock Seat'}
                            >
                              {seat.isLocked ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3" />}
                            </button>
                            {seat.user && (
                              <button
                                onClick={() => onSeatAction(activeRoom.id, 'kick', seat.seatIndex)}
                                className="p-1 rounded bg-rose-950 text-rose-400 hover:bg-rose-900 cursor-pointer"
                                title="Kick user from seat"
                              >
                                <UserX className="w-3 h-3" />
                              </button>
                            )}
                          </>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* OVERLAY CHAT & BOTTOM ACTION BAR */}
          <div className="absolute inset-x-0 bottom-0 z-30 p-3 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-auto">
            {/* Live Chat Stream (Scrolls Upwards) */}
            <div className="max-h-28 overflow-y-auto mb-2 space-y-1.5 no-scrollbar flex flex-col justify-end">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="inline-flex items-start gap-1.5 px-2.5 py-1 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-xs w-fit max-w-[85%]"
                >
                  <span className="font-bold text-pink-300 shrink-0">
                    {msg.displayName}:
                  </span>
                  <span className="text-white/95 break-words">{msg.text}</span>
                </div>
              ))}
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center gap-2">
              <form onSubmit={handleSendChat} className="flex-1 flex items-center gap-1.5">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Say something to host..."
                  className="flex-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-2 text-xs text-white placeholder-white/50 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white disabled:opacity-30 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Send Gift Button */}
              <button
                onClick={() => onOpenGiftStore(activeRoom.hostId)}
                className="px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-rose-500/30 active:scale-95 transition-transform cursor-pointer"
              >
                <Gift className="w-4 h-4" />
                <span>Gift</span>
              </button>

              {/* PK Boost button for challenger if in battle */}
              {activeRoom.isPKBattle && activeRoom.pkChallenger && (
                <button
                  onClick={() => onOpenGiftStore(activeRoom.pkChallenger!.host.id)}
                  className="px-2.5 py-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1 shadow-lg active:scale-95 transition-transform cursor-pointer"
                  title="Boost Challenger Team"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Boost PK</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-neutral-400">
          <p>No live rooms available right now.</p>
        </div>
      )}
    </div>
  );
};
