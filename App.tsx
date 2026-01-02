
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Flame, 
  Trophy, 
  Calendar,
  Zap,
  Target,
  Coffee,
  Heart,
  Dumbbell,
  Book,
  Code,
  Waves,
  Moon,
  TrendingUp,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Habit, Quote } from './types';
import { QUOTES, COLORS, ICONS } from './constants';
import { getTodayString, calculateStreak, getCompletedTodayCount } from './utils';

const ICON_MAP: Record<string, any> = {
  Zap, Target, Flame, Coffee, Heart, Dumbbell, Book, Code, Waves, Moon
};

const App: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('pro_habits');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedColor, setSelectedColor] = useState<keyof typeof COLORS>('purple');
  const [selectedIcon, setSelectedIcon] = useState('Target');
  const [quote, setQuote] = useState<Quote>(QUOTES[0]);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('pro_habits', JSON.stringify(habits));
  }, [habits]);

  // Random quote on mount
  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  const today = getTodayString();
  const completedToday = useMemo(() => getCompletedTodayCount(habits), [habits]);
  const totalHabits = habits.length;
  const progressPercent = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  const currentStreak = useMemo(() => {
    const streaks = habits.map(h => calculateStreak(h.completedDates));
    return streaks.length > 0 ? Math.max(...streaks) : 0;
  }, [habits]);

  const handleToggleHabit = (id: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const alreadyCompleted = habit.completedDates.includes(today);
        let newDates;
        if (alreadyCompleted) {
          newDates = habit.completedDates.filter(d => d !== today);
        } else {
          newDates = [...habit.completedDates, today];
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#A855F7', '#22D3EE', '#10B981']
          });
        }
        return { ...habit, completedDates: newDates };
      }
      return habit;
    }));
  };

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: newHabitName,
      icon: selectedIcon,
      color: selectedColor,
      createdAt: new Date().toISOString(),
      completedDates: []
    };
    setHabits([...habits, newHabit]);
    setNewHabitName('');
    setIsAddModalOpen(false);
  };

  const handleDeleteHabit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this habit?')) {
      setHabits(prev => prev.filter(h => h.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-float"></div>
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-cyan-600/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-24 left-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="mb-8 mt-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              ProHabit
            </h1>
            <div className="text-right">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Today</p>
              <p className="text-sm font-semibold text-slate-200">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div className="glass p-5 rounded-2xl border border-white/5 shadow-2xl mt-4">
            <p className="italic text-slate-300 text-base mb-1 leading-relaxed">
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className="text-xs font-bold text-slate-500 text-right">— {quote.author}</p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard 
            label="Streak" 
            value={currentStreak} 
            icon={<Flame className="w-4 h-4 text-orange-400" />}
            sub="Best Days"
          />
          <StatCard 
            label="Done" 
            value={`${completedToday}/${totalHabits}`} 
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            sub="Today's goal"
          />
          <StatCard 
            label="Level" 
            value={Math.floor(completedToday * 2.5 + habits.length * 5)} 
            icon={<Trophy className="w-4 h-4 text-amber-400" />}
            sub="XP Points"
          />
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Daily Completion</h2>
            <span className="text-xl font-black text-cyan-400">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500"
            />
          </div>
        </div>

        {/* Habit List */}
        <div className="space-y-4 mb-24">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg font-bold text-slate-300">Your Habits</h2>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add New
            </button>
          </div>
          
          <AnimatePresence mode="popLayout">
            {habits.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 glass rounded-3xl border border-dashed border-white/10"
              >
                <div className="bg-slate-900/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <Target className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-500 font-medium">No habits yet. Start small!</p>
              </motion.div>
            ) : (
              habits.map((habit) => (
                <HabitItem 
                  key={habit.id} 
                  habit={habit} 
                  onToggle={() => handleToggleHabit(habit.id)}
                  onDelete={(e) => handleDeleteHabit(e, habit.id)}
                  isCompleted={habit.completedDates.includes(today)}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Add Button Sticky Mobile */}
        <button 
          onClick={() => setIsAddsetIsAddModalOpenModalOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl shadow-[0_10px_40px_rgba(147,51,234,0.4)] flex items-center justify-center group hover:scale-110 active:scale-95 transition-all z-50 border border-white/20"
        >
          <Plus className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass w-full max-w-md p-8 rounded-[2rem] border border-white/10 shadow-3xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-white">New Habit</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Name</label>
                  <input 
                    autoFocus
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    placeholder="e.g. Read for 30 mins"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Icon</label>
                  <div className="grid grid-cols-5 gap-2">
                    {ICONS.map((iconName) => {
                      const IconComp = ICON_MAP[iconName];
                      return (
                        <button 
                          key={iconName}
                          onClick={() => setSelectedIcon(iconName)}
                          className={`p-3 rounded-xl flex items-center justify-center transition-all ${selectedIcon === iconName ? 'bg-white/10 border-white/30 text-white shadow-lg' : 'bg-transparent text-slate-500 border border-transparent'}`}
                        >
                          <IconComp className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Accent Color</label>
                  <div className="flex gap-3">
                    {Object.keys(COLORS).map((c) => (
                      <button 
                        key={c}
                        onClick={() => setSelectedColor(c as keyof typeof COLORS)}
                        className={`w-10 h-10 rounded-full bg-gradient-to-tr ${COLORS[c as keyof typeof COLORS]} transition-all ${selectedColor === c ? 'ring-4 ring-white/20 scale-110 shadow-lg' : 'opacity-60 grayscale-[0.2]'} `}
                      />
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleAddHabit}
                  className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  Create Habit <TrendingUp className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; sub: string }> = ({ label, value, icon, sub }) => (
  <div className="glass p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center">
    <div className="mb-2 p-2 bg-slate-900/50 rounded-xl">
      {icon}
    </div>
    <span className="text-xl font-black text-white">{value}</span>
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1">{sub}</span>
  </div>
);

const HabitItem: React.FC<{ habit: Habit; onToggle: () => void; onDelete: (e: React.MouseEvent) => void; isCompleted: boolean }> = ({ habit, onToggle, onDelete, isCompleted }) => {
  const IconComp = ICON_MAP[habit.icon] || Target;
  const gradientClass = COLORS[habit.color as keyof typeof COLORS] || COLORS.purple;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`relative group cursor-pointer transition-all ${isCompleted ? 'opacity-80' : 'opacity-100'}`}
      onClick={onToggle}
    >
      <div className={`glass p-5 rounded-3xl flex items-center justify-between border ${isCompleted ? 'border-white/5 bg-slate-900/20' : 'border-white/10'}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${gradientClass} flex items-center justify-center shadow-lg transition-transform ${isCompleted ? 'scale-90 grayscale-[0.5]' : ''}`}>
            <IconComp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`font-bold text-lg leading-tight transition-all ${isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}`}>
              {habit.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Flame className="w-3 h-3 text-orange-500" /> {calculateStreak(habit.completedDates)} Day Streak
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onDelete}
            className="p-3 text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 hidden md:block"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isCompleted ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-2 border-white/10 text-transparent'}`}>
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default App;
