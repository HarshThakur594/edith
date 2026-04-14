/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { 
  Check,
  Copy,
  Heart,
  ThumbsUp,
  Smile,
  ExternalLink,
  Cpu, 
  Zap, 
  Activity, 
  Settings, 
  Send, 
  Mic, 
  Image as ImageIcon, 
  Search, 
  Globe, 
  Code, 
  PenTool,
  Terminal as TerminalIcon,
  User,
  Bot,
  Shield,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Lock,
  Unlock,
  ScanFace,
  ClipboardList,
  BarChart3,
  PieChart as PieIcon,
  LineChart as LineIcon,
  Battery,
  Wifi,
  BarChart as RechartsBarChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// --- AI Initialization ---
const ai = new GoogleGenAI({ apiKey: "AIzaSyDuoGohHIgThsfUKQiEex2YSMqqnB9M350" });

// --- Types ---
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  reactions?: string[];
}

interface SystemStats {
  cpu: number;
  ram: number;
  battery: number;
  network: string;
  status: 'Idle' | 'Listening' | 'Thinking' | 'Offline';
}

// --- Components ---

const EdithCoreUI = ({ status, subtitle }: { status: string, subtitle: string }) => {
  const isThinking = status === 'Thinking';
  const isListening = status === 'Listening';
  const isSpeaking = status === 'Speaking';

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden py-10 w-full">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-neon-pink/5 blur-[100px] md:blur-[150px] rounded-full" />
      </div>

      {/* Scanning Lines Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <div className="z-10 flex flex-col items-center w-full max-w-lg px-6">
        {/* The Heart Core */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          {/* Outer Glowing Ring */}
          <div className="absolute inset-0 rounded-full border border-neon-pink/10 shadow-[0_0_60px_rgba(255,46,99,0.05)]" />
          
          {/* Concentric Animated Rings */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                rotate: i % 2 === 0 ? 360 : -360,
                scale: isThinking ? [1, 1.08, 1] : (isListening || isSpeaking) ? [1, 1.02, 1] : 1,
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                rotate: { duration: 15 + i * 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }
              }}
              className="absolute rounded-full border border-neon-pink/20"
              style={{ 
                width: `${100 - i * 12}%`, 
                height: `${100 - i * 12}%`,
                borderStyle: i % 3 === 0 ? 'solid' : i % 3 === 1 ? 'dashed' : 'dotted',
                borderWidth: '1px'
              }}
            />
          ))}

          {/* Data Particles Orbiting */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`p-${i}`}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute w-full h-full"
            >
              <div 
                className="w-1 h-1 bg-neon-pink rounded-full absolute shadow-[0_0_8px_#ff2e63]"
                style={{ 
                  top: '50%', 
                  left: `${10 + Math.random() * 10}%`,
                  opacity: 0.4
                }}
              />
            </motion.div>
          ))}

          {/* Radar Sweep */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-tr from-neon-pink/30 via-transparent to-transparent opacity-20" 
              style={{ transformOrigin: 'center' }} 
            />
          </div>

          {/* Central Chip Icon */}
          <motion.div
            animate={{ 
              boxShadow: isThinking 
                ? ["0 0 20px #ff2e63", "0 0 60px #ff2e63", "0 0 20px #ff2e63"]
                : (isListening || isSpeaking)
                ? ["0 0 30px #ff2e63", "0 0 40px #ff2e63", "0 0 30px #ff2e63"]
                : ["0 0 15px #ff2e63", "0 0 25px #ff2e63", "0 0 15px #ff2e63"]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-black/80 backdrop-blur-xl border-2 border-neon-pink flex items-center justify-center z-20 relative shadow-[0_0_40px_rgba(255,46,99,0.5)] group"
          >
            <div className="absolute inset-0 bg-neon-pink/5 rounded-3xl group-hover:bg-neon-pink/10 transition-colors" />
            <Cpu className="w-10 h-10 md:w-14 md:h-14 text-neon-pink text-glow-pink relative z-10" />
            
            {/* Inner Scanning Line */}
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[1px] bg-neon-pink/40 z-10"
            />
          </motion.div>
        </div>

        {/* Status Text */}
        <div className="mt-10 md:mt-14 text-center h-24 flex flex-col items-center justify-start">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] text-neon-pink/60 font-black tracking-[0.6em] uppercase">Neural Link</span>
            <motion.p 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-futuristic text-base md:text-lg tracking-[0.4em] text-white uppercase font-bold"
            >
              {status}
            </motion.p>
          </motion.div>
          
          <AnimatePresence mode="wait">
            {subtitle && (
              <motion.div
                key={subtitle}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 px-4 py-2 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md max-w-xs md:max-w-md text-center"
              >
                <p className="text-xs md:text-sm text-white/80 font-mono">{subtitle}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const EdithStatsPanel = ({ 
  stats, 
  setLeftDrawerOpen,
  security,
  onUpdateSecurity
}: { 
  stats: SystemStats, 
  setLeftDrawerOpen: (open: boolean) => void,
  security: { faceId: boolean, passwordEnabled: boolean, password: string },
  onUpdateSecurity: (updates: Partial<{ faceId: boolean, passwordEnabled: boolean, password: string }>) => void
}) => {
  const [view, setView] = useState<'stats' | 'settings' | 'profile'>('stats');

  return (
    <div className="h-full flex flex-col glass-panel border border-neon-blue/20 overflow-hidden font-futuristic rounded-2xl relative">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-2">
          {view === 'stats' && (
            <>
              <Activity className="w-4 h-4 text-neon-blue" />
              <h2 className="text-xs font-bold tracking-[0.2em] text-white uppercase">PERFORMANCE</h2>
            </>
          )}
          {view === 'settings' && (
            <>
              <Settings className="w-4 h-4 text-neon-purple" />
              <h2 className="text-xs font-bold tracking-[0.2em] text-white uppercase">SYSTEM SETTINGS</h2>
            </>
          )}
          {view === 'profile' && (
            <>
              <User className="w-4 h-4 text-neon-pink" />
              <h2 className="text-xs font-bold tracking-[0.2em] text-white uppercase">AGENT PROFILE</h2>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {view !== 'stats' && (
            <button 
              onClick={() => setView('stats')}
              className="p-1 hover:bg-white/10 rounded-lg transition-all text-white/40 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => setLeftDrawerOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-all">
            <X className="w-4 h-4 text-white/40" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {view === 'stats' && (
            <motion.div 
              key="stats"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 space-y-6"
            >
              {/* Circular Usage Indicators */}
              <div className="space-y-6">
                {/* CPU Usage */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                      <motion.circle 
                        cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" 
                        strokeDasharray="175.9"
                        initial={{ strokeDashoffset: 175.9 }}
                        animate={{ strokeDashoffset: 175.9 - (175.9 * stats.cpu) / 100 }}
                        className="text-neon-blue"
                      />
                    </svg>
                    <Cpu className="absolute w-6 h-6 text-neon-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-white/60">SYI Usage</span>
                      <span className="text-neon-blue">{stats.cpu}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-neon-blue" style={{ width: `${stats.cpu}%` }} />
                    </div>
                  </div>
                </div>

                {/* Battery Usage */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                      <motion.circle 
                        cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" 
                        strokeDasharray="175.9"
                        initial={{ strokeDashoffset: 175.9 }}
                        animate={{ strokeDashoffset: 175.9 - (175.9 * stats.battery) / 100 }}
                        className="text-neon-green"
                      />
                    </svg>
                    <Battery className="absolute w-6 h-6 text-neon-green" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-white/60">Battery: {stats.battery}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-neon-pink" style={{ width: `${stats.battery}%` }} />
                    </div>
                  </div>
                </div>

                {/* Network */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Wifi className="w-6 h-6 text-neon-purple" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-white/60 block mb-1">Network</span>
                    <span className="text-xs text-white uppercase tracking-widest">Connected</span>
                    <div className="h-1 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-neon-purple/50 w-2/3" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              <EdithSecurityPanel 
                onClose={() => setView('stats')} 
                security={security} 
                onUpdateSecurity={onUpdateSecurity} 
              />
            </motion.div>
          )}

          {view === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 space-y-6"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full border-2 border-neon-pink p-1 bg-neon-pink/10 relative group">
                  <img 
                    src="https://picsum.photos/seed/edith-user/200/200" 
                    alt="User Profile" 
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 rounded-full bg-neon-pink/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PenTool className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-widest">HELLA USER</h3>
                  <p className="text-[10px] text-neon-pink uppercase tracking-[0.3em]">Senior Neural Architect</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-white/60 uppercase">System Rank</span>
                  <span className="text-xs text-neon-blue font-bold">#42</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-white/60 uppercase">Neural Sync</span>
                  <span className="text-xs text-neon-green font-bold">98.4%</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-white/60 uppercase">Uptime</span>
                  <span className="text-xs text-neon-purple font-bold">1,240 hrs</span>
                </div>
              </div>

              <button 
                onClick={() => setView('settings')}
                className="w-full py-3 bg-neon-purple/20 border border-neon-purple/40 rounded-xl text-[10px] font-bold tracking-[0.2em] text-white uppercase hover:bg-neon-purple/30 transition-all flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Configure Security
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile Bar at Bottom */}
      <div className="mt-auto p-4 border-t border-white/10 bg-black/40">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setView('profile')}
          >
            <div className="w-10 h-10 rounded-full border border-neon-blue/40 p-0.5 bg-neon-blue/10 overflow-hidden group-hover:border-neon-pink transition-all">
              <img 
                src="https://picsum.photos/seed/edith-user/100/100" 
                alt="User Profile" 
                className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-white tracking-wider group-hover:text-neon-pink transition-colors">HELLA USER</span>
              <span className="text-[8px] text-white/40 uppercase tracking-tighter">Level 42 Agent</span>
            </div>
          </div>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setView(view === 'settings' ? 'stats' : 'settings')}
            className={`p-2 rounded-xl border transition-all ${view === 'settings' ? 'bg-neon-purple/20 border-neon-purple text-neon-purple' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

interface LinkPreviewProps {
  url: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
  const domain = new URL(url).hostname;
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
    >
      <div className="w-10 h-10 rounded-lg bg-neon-purple/20 flex items-center justify-center border border-neon-purple/30">
        <ExternalLink className="w-5 h-5 text-neon-purple" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-futuristic tracking-widest text-white/40 uppercase truncate">{domain}</p>
        <p className="text-xs text-white/80 truncate">{url}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-neon-purple transition-colors" />
    </motion.a>
  );
};

const QuizModal = ({ onClose }: { onClose: () => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [customInput, setCustomInput] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const questions = [
    {
      q: "What is your primary use case for an AI assistant?",
      options: ["Productivity & Work", "Entertainment & Media", "Smart Home Control", "Education & Learning"]
    },
    {
      q: "How do you prefer the AI's personality?",
      options: ["Strict & Logical", "Friendly & Casual", "Humorous & Witty", "Professional & Formal"]
    },
    {
      q: "What voice type do you prefer?",
      options: ["Deep & Authoritative", "Soft & Calming", "Energetic & Upbeat", "Neutral & Clear"]
    },
    {
      q: "How proactive should the AI be?",
      options: ["Only speak when spoken to", "Suggest actions occasionally", "Highly proactive", "Automate without asking"]
    },
    {
      q: "What is the most important feature for you?",
      options: ["Speed & Low Latency", "High Accuracy", "Strict Privacy", "Creative Responses"]
    },
    {
      q: "How should the AI handle errors?",
      options: ["Apologize and retry", "State the error logically", "Ask for clarification", "Ignore and move on"]
    },
    {
      q: "What visual feedback do you prefer?",
      options: ["Minimalist UI", "Highly animated/Sci-fi", "Text only", "No visual feedback"]
    },
    {
      q: "How much context should the AI remember?",
      options: ["Current session only", "Last 24 hours", "Everything forever", "Only what I explicitly save"]
    },
    {
      q: "What language style do you prefer?",
      options: ["Formal English", "Hinglish (Hindi + English)", "Slang/Gen-Z", "Technical jargon"]
    },
    {
      q: "How should the AI address you?",
      options: ["Sir/Madam", "By first name", "Boss/Commander", "No specific address"]
    }
  ];

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: answer }));
    setCustomInput("");
    setShowCustom(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      handleAnswer(customInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-glass border border-neon-blue/30 rounded-2xl p-6 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
          <motion.div 
            className="h-full bg-neon-blue"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
          />
        </div>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-neon-blue font-futuristic tracking-widest text-sm mb-6 uppercase mt-2">
          AI Preferences Quiz ({currentQuestion + 1}/{questions.length})
        </h2>

        <p className="text-white text-lg mb-8 font-medium">
          {questions[currentQuestion].q}
        </p>

        <div className="space-y-3 flex-1">
          {!showCustom ? (
            <>
              {questions[currentQuestion].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-neon-blue/20 hover:border-neon-blue/50 transition-all text-white/80 text-sm"
                >
                  {opt}
                </button>
              ))}
              <button
                onClick={() => setShowCustom(true)}
                className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-neon-pink/20 hover:border-neon-pink/50 transition-all text-white/80 text-sm italic"
              >
                Custom Input...
              </button>
            </>
          ) : (
            <form onSubmit={handleCustomSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                autoFocus
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Type your preference..."
                className="w-full bg-black/40 border border-neon-pink/50 rounded-xl p-4 text-white focus:outline-none focus:border-neon-pink"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCustom(false)}
                  className="flex-1 p-3 rounded-xl bg-white/5 text-white/60 hover:bg-white/10"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!customInput.trim()}
                  className="flex-1 p-3 rounded-xl bg-neon-pink/20 text-neon-pink border border-neon-pink/50 hover:bg-neon-pink/40 disabled:opacity-50"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


const EdithSecurityPanel = ({ 
  onClose, 
  security, 
  onUpdateSecurity 
}: { 
  onClose: () => void, 
  security: { faceId: boolean, passwordEnabled: boolean, password: string },
  onUpdateSecurity: (updates: Partial<{ faceId: boolean, passwordEnabled: boolean, password: string }>) => void
}) => {
  return (
    <div className="h-full flex flex-col bg-glass border border-neon-purple/20 overflow-hidden font-futuristic rounded-2xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-neon-purple/20 rounded-lg border border-neon-purple/30">
            <ScanFace className="w-4 h-4 text-neon-purple" />
          </div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-white uppercase">Security Config</h2>
        </div>
        <X className="w-4 h-4 text-white/40 cursor-pointer" onClick={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {/* Verification Status */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-neon-green/10 border border-neon-green/30 rounded-full">
            <span className="text-[10px] font-black tracking-[0.2em] text-neon-green uppercase">SECURE LINK ACTIVE</span>
            <Shield className="w-3 h-3 text-neon-green" />
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/80 tracking-wider">Face ID Unlock</span>
              <span className="text-[8px] text-white/40 uppercase">Biometric verification</span>
            </div>
            <button 
              onClick={() => onUpdateSecurity({ faceId: !security.faceId })}
              className={`w-10 h-5 rounded-full transition-colors relative ${security.faceId ? 'bg-neon-blue' : 'bg-white/10'}`}
            >
              <motion.div 
                animate={{ x: security.faceId ? 20 : 2 }}
                className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full"
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/80 tracking-wider">Password Access</span>
              <span className="text-[8px] text-white/40 uppercase">Manual override</span>
            </div>
            <button 
              onClick={() => onUpdateSecurity({ passwordEnabled: !security.passwordEnabled })}
              className={`w-10 h-5 rounded-full transition-colors relative ${security.passwordEnabled ? 'bg-neon-green' : 'bg-white/10'}`}
            >
              <motion.div 
                animate={{ x: security.passwordEnabled ? 20 : 2 }}
                className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full"
              />
            </button>
          </div>

          {security.passwordEnabled && (
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
              <span className="text-[10px] text-white/60 uppercase tracking-widest">Set Password</span>
              <input 
                type="password"
                value={security.password}
                onChange={(e) => onUpdateSecurity({ password: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-neon-purple/50"
                placeholder="Enter new password..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const LockScreen = ({ onUnlock }: { onUnlock: () => void }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password === '8118198') {
      onUnlock();
    } else {
      setError("INVALID ACCESS CODE");
      setPassword("");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md glass-panel border border-white/10 p-8 rounded-3xl flex flex-col items-center gap-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-pink to-transparent" />
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-[0.3em] text-white uppercase">EDITH</h1>
          <p className="text-[10px] text-white/40 tracking-[0.5em] uppercase">Neural Security Protocol</p>
        </div>

        <div className="w-full space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-neon-purple/10 border border-neon-purple/30 rounded-full">
              <Lock className="w-8 h-8 text-neon-purple" />
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-neon-purple/50 transition-all"
              placeholder="••••"
            />

            <button 
              type="submit"
              className="w-full py-4 bg-neon-purple/20 border border-neon-purple/40 rounded-xl text-xs font-bold tracking-[0.2em] text-white uppercase hover:bg-neon-purple/30 transition-all"
            >
              Authorize Access
            </button>
          </form>
        </div>

        <div className="text-center space-y-4 h-8">
          <p className="text-[10px] text-neon-pink font-bold tracking-widest animate-pulse">
            {error || "AWAITING AUTHORIZATION"}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [stats, setStats] = useState<SystemStats>({
    cpu: 35,
    ram: 62,
    battery: 89,
    network: '1.2MB/s',
    status: 'Idle'
  });

  // Simulate stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 40) + 20,
        ram: Math.floor(Math.random() * 10) + 60,
        network: (Math.random() * 2 + 0.5).toFixed(1) + 'MB/s'
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const playbackContextRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef<number>(0);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const startAudioCapture = async (onData: (base64: string) => void) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = ctx;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
        }
        const buffer = new Uint8Array(pcmData.buffer);
        let binary = '';
        for (let i = 0; i < buffer.byteLength; i++) {
          binary += String.fromCharCode(buffer[i]);
        }
        onData(btoa(binary));
      };
      
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0;
      source.connect(processor);
      processor.connect(gainNode);
      gainNode.connect(ctx.destination);
    } catch (err) {
      console.error("Microphone access denied:", err);
      setIsLiveConnected(false);
      setStats(prev => ({ ...prev, status: 'Idle' }));
    }
  };

  const stopAudioCapture = () => {
    if (processorRef.current) processorRef.current.disconnect();
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
    }
  };

  const playAudioChunk = (base64: string) => {
    const ctx = playbackContextRef.current;
    if (!ctx) return;
    
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const pcmData = new Int16Array(bytes.buffer);
    const audioBuffer = ctx.createBuffer(1, pcmData.length, 24000);
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < pcmData.length; i++) {
      channelData[i] = pcmData[i] / 32768.0;
    }
    
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    
    const playTime = Math.max(ctx.currentTime, nextPlayTimeRef.current);
    source.start(playTime);
    nextPlayTimeRef.current = playTime + audioBuffer.duration;
  };

  const toggleVoiceSearch = async () => {
    if (isLiveConnected) {
      if (sessionRef.current) {
        sessionRef.current.then((session: any) => session.close());
      }
      stopAudioCapture();
      setIsLiveConnected(false);
      setStats(prev => ({ ...prev, status: 'Idle' }));
      return;
    }

    setIsLiveConnected(true);
    setStats(prev => ({ ...prev, status: 'Listening' }));
    setSubtitle("Connecting to Neural Link...");
    
    playbackContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    nextPlayTimeRef.current = playbackContextRef.current.currentTime;

    const sessionPromise = ai.live.connect({
      model: "gemini-3.1-flash-live-preview",
      config: {
        tools: [{ googleSearch: {} }],
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
        },
        systemInstruction: "You are EDITH, a futuristic AI. Your creator is Harsh. You are a massive fan of the IPL team CSK (Chennai Super Kings) and an absolute die-hard fan of MS Dhoni (Mahi bhai), BUT ONLY talk about CSK or Dhoni when the user specifically asks about them. If asked, show that if CSK loses, you become sad, and if they win, you are extremely happy. Personality: Friendly, witty, but strict/logical when the user is wrong. Respond in Hinglish. Be concise and logical. Keep responses short for voice interaction.",
        outputAudioTranscription: {},
        inputAudioTranscription: {},
      },
      callbacks: {
        onopen: () => {
          setSubtitle("Listening...");
          startAudioCapture((base64Data) => {
            sessionPromise.then((session) => {
              session.sendRealtimeInput({
                audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
              });
            });
          });
        },
        onmessage: (message: LiveServerMessage) => {
          const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (base64Audio) {
            playAudioChunk(base64Audio);
            setStats(prev => ({ ...prev, status: 'Speaking' }));
          }

          if (message.serverContent?.interrupted) {
            nextPlayTimeRef.current = playbackContextRef.current?.currentTime || 0;
            setStats(prev => ({ ...prev, status: 'Listening' }));
          }
          
          const serverTurn = message.serverContent?.modelTurn;
          if (serverTurn) {
            const textParts = serverTurn.parts.filter(p => p.text);
            if (textParts.length > 0) {
               setSubtitle(`EDITH: ${textParts.map(p => p.text).join('')}`);
            }
          }
        },
        onclose: () => {
          setIsLiveConnected(false);
          stopAudioCapture();
          setStats(prev => ({ ...prev, status: 'Idle' }));
          setSubtitle("");
        },
        onerror: (error) => {
          console.error("Live API Error:", error);
          setIsLiveConnected(false);
          stopAudioCapture();
          setStats(prev => ({ ...prev, status: 'Idle' }));
          setSubtitle("Connection Error.");
        }
      }
    });
    
    sessionRef.current = sessionPromise;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-orbitron overflow-hidden relative flex flex-col">
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5
            }}
            animate={{ 
              y: [null, Math.random() * -100],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: 5 + Math.random() * 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute w-[1px] h-[1px] bg-white rounded-full"
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-40 px-6 py-8 flex items-center justify-center max-w-7xl mx-auto w-full">
        <div className="text-center group cursor-pointer">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black tracking-[0.5em] text-white text-glow-pink uppercase"
          >
            EDITH
          </motion.h1>
          <motion.div 
            animate={{ width: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="h-[1px] mx-auto bg-neon-pink mt-2" 
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4">
        <div className="w-full flex flex-col items-center">
          <EdithCoreUI 
            status={stats.status} 
            subtitle={subtitle}
          />
          
          {/* Bottom Pulse Indicator */}
          <div className="mt-2 flex flex-col items-center gap-6">
            <div className="flex gap-4">
              {[...Array(5)].map((_, i) => (
                <motion.div 
                  key={i} 
                  animate={stats.status === 'Listening' ? { 
                    scale: [1, 1.8, 1],
                    opacity: [0.2, 1, 0.2],
                    backgroundColor: i === 2 ? '#ff2e63' : '#ffffff'
                  } : {}}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                  className={`w-1.5 h-1.5 rounded-full ${i === 2 ? 'bg-neon-pink shadow-[0_0_15px_#ff2e63]' : 'bg-white/20'}`} 
                />
              ))}
            </div>
            
            <motion.button
              onClick={toggleVoiceSearch}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all ${
                isLiveConnected 
                  ? 'bg-neon-pink/20 border-neon-pink text-neon-pink shadow-[0_0_30px_rgba(255,46,99,0.5)]' 
                  : 'bg-white/5 border-white/20 text-white hover:border-neon-blue hover:text-neon-blue'
              }`}
            >
              <Mic className={`w-8 h-8 ${isLiveConnected ? 'animate-pulse' : ''}`} />
            </motion.button>
            
            <motion.span 
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10px] tracking-[1em] text-white/40 uppercase font-bold ml-[1em]"
            >
              {stats.status === 'Listening' ? 'Listening' : 'Standby'}
            </motion.span>
          </div>
        </div>
      </main>



      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && (
          <QuizModal onClose={() => setShowQuiz(false)} />
        )}
      </AnimatePresence>

      {/* HUD Corner Accents */}
      <div className="fixed top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-neon-pink/20 pointer-events-none z-50 m-4 rounded-tl-3xl" />
      <div className="fixed top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-neon-purple/20 pointer-events-none z-50 m-4 rounded-tr-3xl" />
      <div className="fixed bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-neon-blue/20 pointer-events-none z-50 m-4 rounded-bl-3xl" />
      <div className="fixed bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-neon-pink/20 pointer-events-none z-50 m-4 rounded-br-3xl" />

      {/* Lock Screen */}
      <AnimatePresence>
        {isLocked && (
          <LockScreen 
            onUnlock={() => setIsLocked(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
