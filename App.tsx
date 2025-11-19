import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { COMPONENTS, RECIPES, COMPLETED_ITEMS, ALL_ITEMS_MAP } from './constants';
import { Item, Recipe, CoachFeedback, HistoryEntry } from './types';
import ItemCard from './components/ItemCard';
import CoachWidget from './components/CoachWidget';
import StatsPanel from './components/StatsPanel';
import { getCoachFeedback } from './services/geminiService';

// --- Sub Components for specific screens ---

const MainMenu = ({ onStart }: { onStart: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in p-4 text-center w-full max-w-2xl mx-auto">
    <div className="space-y-2">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 drop-shadow-sm">
        装备锻造坊
      </h1>
      <p className="text-slate-400 text-lg">掌握金铲铲合成配方</p>
    </div>
    
    <div className="grid grid-cols-2 gap-4 max-w-xs w-full">
      <button 
        onClick={(e) => { e.stopPropagation(); onStart(); }}
        className="col-span-2 group relative px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-600 transition-all hover:shadow-[0_0_20px_rgba(250,204,21,0.2)]"
      >
        <span className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">开始训练</span>
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-yellow-400/50 transition-all" />
      </button>
    </div>

    <div className="text-xs text-slate-600 fixed bottom-4">
      S13 赛季数据 • 历史记录已启用
    </div>
  </div>
);

const GameOver = ({ score, streak, onRetry }: { score: number, streak: number, onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full space-y-6 p-4 text-center animate-fade-in w-full max-w-2xl mx-auto">
    <h2 className="text-4xl font-bold text-white">训练结束</h2>
    
    <div className="flex gap-8 bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-md">
      <div className="text-center">
        <div className="text-sm text-slate-400 uppercase tracking-widest">得分</div>
        <div className="text-5xl font-black text-yellow-400 mt-2">{score}</div>
      </div>
      <div className="w-px bg-slate-700"></div>
      <div className="text-center">
        <div className="text-sm text-slate-400 uppercase tracking-widest">最高连胜</div>
        <div className="text-5xl font-black text-blue-400 mt-2">{streak}</div>
      </div>
    </div>

    <button 
      onClick={(e) => { e.stopPropagation(); onRetry(); }}
      className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-transform active:scale-95 shadow-lg shadow-blue-900/50"
    >
      再玩一次
    </button>
  </div>
);

// --- Main App Component ---

export default function App() {
  // App State
  const [screen, setScreen] = useState<'menu' | 'game' | 'end'>('menu');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [bestStreak, setBestStreak] = useState(0);
  
  // History State
  const [sessionHistory, setSessionHistory] = useState<HistoryEntry[]>([]);
  const [allTimeHistory, setAllTimeHistory] = useState<HistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('tft_quiz_history');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // Hydrate items from IDs
      return parsed.map((p: any) => ({
        ...p,
        targetItem: ALL_ITEMS_MAP[p.itemId] || COMPLETED_ITEMS[p.itemId]
      })).filter((i: any) => i.targetItem); // Filter out invalid items
    } catch (e) {
      console.error("Failed to load history", e);
      return [];
    }
  });

  // Round State
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<CoachFeedback | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [isWrongAnimation, setIsWrongAnimation] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Timer refs for skipping
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextActionRef = useRef<() => void>(() => {});

  const generateQuestion = useCallback(() => {
    const randomRecipe = RECIPES[Math.floor(Math.random() * RECIPES.length)];
    setCurrentRecipe(randomRecipe);
    setSelectedComponents([]);
    setFeedback(null);
    setShowResult(false);
    setIsWrongAnimation(false);
    timerRef.current = null;
  }, []);

  const handleStart = () => {
    setScore(0);
    setStreak(0);
    setLives(3);
    setBestStreak(0);
    setSessionHistory([]); // Clear session history, but keep allTimeHistory
    setScreen('game');
    generateQuestion();
  };

  // Allow adding duplicates (e.g., Sword + Sword)
  // New logic: Clicking inventory always adds (if < 2). Clicking selected slot removes.
  const handleInventoryClick = (id: string) => {
    if (showResult) return;
    if (selectedComponents.length < 2) {
      setSelectedComponents(prev => [...prev, id]);
    }
  };

  const handleSlotClick = (indexToRemove: number) => {
    if (showResult) return;
    setSelectedComponents(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const saveToGlobalHistory = (entry: HistoryEntry) => {
    setAllTimeHistory(prev => {
      const updated = [entry, ...prev];
      // Limit stored history to last 500 items to prevent localStorage issues
      const sliced = updated.slice(0, 500);
      
      // Minify for storage
      const toSave = sliced.map(h => ({
        id: h.id,
        itemId: h.targetItem.id,
        isCorrect: h.isCorrect,
        timestamp: h.timestamp
      }));
      
      try {
        localStorage.setItem('tft_quiz_history', JSON.stringify(toSave));
      } catch (e) {
        console.error("Failed to save history", e);
      }
      return sliced;
    });
  };

  const checkAnswer = async () => {
    if (!currentRecipe || selectedComponents.length !== 2) return;

    // Clear any existing timer just in case
    if (timerRef.current) clearTimeout(timerRef.current);

    const targetComponents = currentRecipe.components;
    const sortedSelected = [...selectedComponents].sort();
    const sortedTarget = [...targetComponents].sort();
    
    const isCorrect = JSON.stringify(sortedSelected) === JSON.stringify(sortedTarget);
    const targetItem = COMPLETED_ITEMS[currentRecipe.result];

    // Create History Entry
    const newEntry: HistoryEntry = {
      id: Date.now(),
      targetItem: targetItem,
      isCorrect: isCorrect,
      timestamp: Date.now()
    };

    // Update State
    setSessionHistory(prev => [newEntry, ...prev]);
    saveToGlobalHistory(newEntry);

    setShowResult(true);
    setLoadingFeedback(true);
    
    // Fetch AI feedback
    getCoachFeedback(targetItem.name, isCorrect, isCorrect ? streak + 1 : 0)
      .then(setFeedback)
      .finally(() => setLoadingFeedback(false));

    if (isCorrect) {
      setScore(prev => prev + 100 + (streak * 10));
      setStreak(prev => {
        const next = prev + 1;
        setBestStreak(b => Math.max(b, next));
        return next;
      });
      
      // Prepare next action
      nextActionRef.current = generateQuestion;
      timerRef.current = setTimeout(generateQuestion, 5000);
    } else {
      setIsWrongAnimation(true);
      setStreak(0);
      
      // Calculate new lives immediately to determine next step
      const newLives = lives - 1;
      setLives(newLives);
      
      if (newLives <= 0) {
         nextActionRef.current = () => setScreen('end');
         timerRef.current = setTimeout(() => setScreen('end'), 5000);
      } else {
         nextActionRef.current = generateQuestion;
         timerRef.current = setTimeout(generateQuestion, 5000);
      }
    }
  };

  // Skip handler
  const handleSkip = useCallback(() => {
    if (showResult && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      nextActionRef.current();
    }
  }, [showResult]);

  useEffect(() => {
    if (selectedComponents.length === 2 && !showResult) {
      checkAnswer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponents]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="h-screen bg-slate-900 text-slate-100 overflow-hidden relative font-sans flex flex-col lg:flex-row">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
        {/* Header - Always visible in game */}
        {screen === 'game' && (
          <header className="flex justify-between items-center p-4 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 shrink-0">
            <div className="flex items-center space-x-4">
              <div className="text-slate-400 font-bold text-sm tracking-wider">得分 <span className="text-white text-lg ml-1">{score}</span></div>
              <div className="text-slate-400 font-bold text-sm tracking-wider">连胜 <span className="text-yellow-400 text-lg ml-1">{streak}🔥</span></div>
            </div>
            <div className="flex items-center space-x-1">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-3 h-3 rounded-full ${i <= lives ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-slate-800'}`} />
              ))}
            </div>
          </header>
        )}

        <main 
          className={`flex-1 flex flex-col items-center overflow-y-auto p-4 w-full transition-colors ${showResult ? 'cursor-pointer hover:bg-white/5' : ''}`}
          onClick={showResult ? handleSkip : undefined}
        >
          {screen === 'menu' && <MainMenu onStart={handleStart} />}
          
          {screen === 'end' && <GameOver score={score} streak={bestStreak} onRetry={handleStart} />}

          {screen === 'game' && currentRecipe && (
            <div className="flex-1 flex flex-col items-center animate-fade-in-up w-full max-w-md">
              
              {/* Target Item Display */}
              <div className="mt-4 mb-6 flex flex-col items-center">
                <h3 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-4">合成目标</h3>
                <div className={`relative group transition-transform duration-500 ${isWrongAnimation ? 'animate-shake' : ''}`}>
                   <ItemCard 
                     item={COMPLETED_ITEMS[currentRecipe.result]} 
                     size="lg" 
                     selected={false}
                   />
                   <div className="mt-4 text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                     {COMPLETED_ITEMS[currentRecipe.result].name}
                   </div>
                </div>

                {/* Correct Answer Reveal */}
                {showResult && isWrongAnimation && (
                  <div className="mt-4 flex items-center gap-2 animate-fade-in bg-red-900/30 px-4 py-2 rounded-lg border border-red-500/30">
                    <span className="text-red-300 text-xs font-bold mr-2">正确配方:</span>
                    {currentRecipe.components.map((id, idx) => (
                      <div key={idx} className="flex items-center">
                         <img src={ALL_ITEMS_MAP[id].image} className="w-6 h-6" alt="" />
                         {idx === 0 && <span className="mx-1 text-slate-400">+</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Coach Widget */}
              <div className="w-full min-h-[100px] mb-4 flex justify-center px-4">
                <CoachWidget feedback={feedback} loading={loadingFeedback} />
              </div>

              {/* Component Selection Grid */}
              <div className="w-full">
                <h3 className="text-center text-slate-500 text-xs uppercase tracking-widest font-bold mb-4">
                  选择 2 个散件
                </h3>
                <div className="grid grid-cols-4 gap-3 sm:gap-4 justify-items-center p-4 bg-slate-800/30 rounded-3xl border border-slate-700/50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                  {COMPONENTS.map(comp => {
                     // Count how many times this item is selected
                     const selectionCount = selectedComponents.filter(id => id === comp.id).length;
                     const isMaxSelected = selectedComponents.length >= 2;
                     
                     return (
                       <div key={comp.id} className="relative">
                         <ItemCard 
                           item={comp} 
                           onClick={() => handleInventoryClick(comp.id)}
                           selected={false} // Don't show "selected" ring in inventory, visualize in slots instead
                           disabled={showResult || (isMaxSelected)}
                           size="md"
                         />
                         {/* Badge showing quantity currently selected */}
                         {selectionCount > 0 && (
                           <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-slate-900 shadow-md animate-bounce-sm">
                             {selectionCount}
                           </div>
                         )}
                       </div>
                     );
                  })}
                </div>
              </div>
              
              {/* Selection Preview / Slots */}
              <div className="mt-8 flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                  {[0, 1].map(index => {
                    const id = selectedComponents[index];
                    const item = id ? ALL_ITEMS_MAP[id] : null;
                    return (
                      <button 
                        key={index} 
                        onClick={() => item && handleSlotClick(index)}
                        disabled={showResult}
                        className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center transition-all duration-200 
                          ${item 
                            ? 'border-yellow-400/50 bg-slate-800 shadow-[0_0_15px_rgba(250,204,21,0.15)]' 
                            : 'border-dashed border-slate-700 bg-slate-800/30'
                          }
                          ${!showResult && item ? 'hover:bg-red-900/30 hover:border-red-400 cursor-pointer' : ''}
                        `}
                      >
                        {item ? (
                          <div className="relative w-full h-full p-2 group">
                             <img src={item.image} className="w-full h-full object-contain drop-shadow-lg" alt={item.name} />
                             {!showResult && (
                               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-lg">
                                 <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                 </svg>
                               </div>
                             )}
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xl">+</span>
                        )}
                      </button>
                    );
                  })}
              </div>

              {/* Skip/Next Hint */}
              {showResult && (
                 <div className="mt-6 text-slate-500 text-xs animate-pulse flex items-center gap-2">
                    <span>即将进入下一题...</span>
                    <span className="text-slate-400">(点击任意处跳过)</span>
                 </div>
              )}

            </div>
          )}
        </main>
      </div>

      {/* Right Panel: Stats (Visible on Large Screens or stacked on mobile) */}
      {(screen === 'game' || screen === 'end') && (
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-700 shrink-0 lg:h-auto h-[300px] relative z-20">
          <StatsPanel 
            sessionHistory={sessionHistory} 
            allTimeHistory={allTimeHistory} 
          />
        </div>
      )}

      {/* Global styles for animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes bounce-sm {
           0%, 100% { transform: translateY(0); }
           50% { transform: translateY(-25%); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        .animate-bounce-sm { animation: bounce-sm 0.3s ease-out; }
      `}</style>
    </div>
  );
}