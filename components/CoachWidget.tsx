import React from 'react';
import { CoachFeedback } from '../types';

interface CoachWidgetProps {
  feedback: CoachFeedback | null;
  loading: boolean;
}

const CoachWidget: React.FC<CoachWidgetProps> = ({ feedback, loading }) => {
  if (!feedback && !loading) return null;

  return (
    <div className="my-2 w-full max-w-md mx-auto animate-fade-in">
      <div className="relative bg-slate-900/80 border border-slate-700 rounded-xl p-3 flex items-center gap-3 shadow-xl backdrop-blur-sm">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center border-2 border-white shadow-lg">
            <span className="text-lg">🐧</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
            金铲铲教练
          </h4>
          
          {loading ? (
            <div className="flex space-x-1 h-5 items-center">
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          ) : (
            <p className={`text-sm font-medium leading-tight ${
              feedback?.tone === 'encouraging' ? 'text-green-300' : 
              feedback?.tone === 'critical' ? 'text-red-300' : 'text-slate-200'
            }`}>
              "{feedback?.message}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachWidget;