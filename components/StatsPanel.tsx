import React, { useMemo, useState } from 'react';
import { HistoryEntry } from '../types';

interface StatsPanelProps {
  sessionHistory: HistoryEntry[];
  allTimeHistory: HistoryEntry[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({ sessionHistory, allTimeHistory }) => {
  const [activeTab, setActiveTab] = useState<'session' | 'all'>('session');

  const displayHistory = activeTab === 'session' ? sessionHistory : allTimeHistory;

  const accuracy = useMemo(() => {
    if (displayHistory.length === 0) return 0;
    const correct = displayHistory.filter(h => h.isCorrect).length;
    return (correct / displayHistory.length) * 100;
  }, [displayHistory]);

  // Calculate sliding window accuracy for the chart
  // We will limit the chart to the last 50 attempts to show "Recent Trend" clearly
  const chartData = useMemo(() => {
    if (displayHistory.length < 2) return [];
    
    const windowSize = 5; // Calculate moving average over 5 items
    
    // Get data in chronological order (oldest to newest)
    // displayHistory is typically [newest, ..., oldest]
    const chronologicalFull = [...displayHistory].reverse();
    
    // Take the last 50 items for the chart if the list is huge, 
    // to keep the visual trend meaningful.
    const sliceForChart = chronologicalFull.slice(-50); 

    const dataPoints = [];
    for (let i = 0; i < sliceForChart.length; i++) {
      // Calculate average for the window ending at i
      // We need to look back 'windowSize' in the slice
      const start = Math.max(0, i - windowSize + 1);
      const windowSlice = sliceForChart.slice(start, i + 1);
      const correctCount = windowSlice.filter(h => h.isCorrect).length;
      const avg = correctCount / windowSlice.length;
      dataPoints.push(avg);
    }
    return dataPoints;
  }, [displayHistory]);

  // Render SVG Chart
  const renderChart = () => {
    if (chartData.length < 2) return <div className="h-full flex items-center justify-center text-slate-600 text-xs">需要更多答题数据...</div>;

    const width = 100;
    const height = 40;
    const max = 1;
    const min = 0;
    
    const points = chartData.map((val, index) => {
      const x = (index / (chartData.length - 1)) * width;
      const y = height - ((val - min) / (max - min)) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        {/* Grid lines */}
        <line x1="0" y1="0" x2="100" y2="0" stroke="#334155" strokeWidth="0.5" strokeDasharray="2" />
        <line x1="0" y1="20" x2="100" y2="20" stroke="#334155" strokeWidth="0.5" strokeDasharray="2" />
        <line x1="0" y1="40" x2="100" y2="40" stroke="#334155" strokeWidth="0.5" strokeDasharray="2" />
        
        {/* Trend Line */}
        <polyline
          fill="none"
          stroke={activeTab === 'session' ? '#3b82f6' : '#a855f7'}
          strokeWidth="2"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Last Point Dot */}
        {chartData.length > 0 && (
          <circle 
            cx={(chartData.length - 1) / (chartData.length - 1) * width}
            cy={height - ((chartData[chartData.length - 1]) * height)}
            r="3"
            className={activeTab === 'session' ? "fill-yellow-400" : "fill-purple-400"}
          />
        )}
      </svg>
    );
  };

  return (
    <div className="bg-slate-800/50 border-l border-slate-700/50 backdrop-blur-md h-full flex flex-col overflow-hidden w-full lg:w-80 transition-colors duration-300">
      
      {/* Tabs */}
      <div className="flex border-b border-slate-700/50">
        <button 
          onClick={() => setActiveTab('session')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors
            ${activeTab === 'session' 
              ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500' 
              : 'bg-slate-900/30 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
        >
          本局数据
        </button>
        <button 
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors
            ${activeTab === 'all' 
              ? 'bg-slate-800 text-purple-400 border-b-2 border-purple-500' 
              : 'bg-slate-900/30 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
        >
          历史总计
        </button>
      </div>

      {/* Stats Summary */}
      <div className="p-4 border-b border-slate-700 bg-slate-900/20">
        <div className="flex justify-between items-end">
          <div>
            <div className={`text-3xl font-black transition-colors ${activeTab === 'session' ? 'text-white' : 'text-purple-100'}`}>
              {Math.round(accuracy)}%
            </div>
            <div className="text-xs text-slate-500">正确率</div>
          </div>
          <div className="text-right">
             <div className="text-xl font-bold text-slate-300">{displayHistory.length}</div>
             <div className="text-xs text-slate-500">答题总数</div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-4 h-32 w-full border-b border-slate-700 bg-slate-900/40 relative">
        <div className="absolute top-2 right-2 text-[10px] text-slate-600 font-mono">RECENT TREND</div>
        {renderChart()}
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {displayHistory.length === 0 && (
            <div className="text-center text-slate-600 text-sm py-8">
              {activeTab === 'session' ? '暂无本局记录' : '暂无历史记录'}
            </div>
        )}
        {displayHistory.map((entry) => (
          <div key={entry.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors animate-fade-in group">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${entry.isCorrect ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`} />
            
            <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0 bg-slate-900 border border-slate-600">
              <img 
                src={entry.targetItem.image} 
                alt={entry.targetItem.name} 
                className="w-full h-full object-cover" 
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <div className="text-xs font-medium text-slate-200 truncate">{entry.targetItem.name}</div>
                <div className="text-[10px] text-slate-500 opacity-50 group-hover:opacity-100">
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsPanel;