import React from 'react';
import { CoachFeedback } from '../types';

interface CoachWidgetProps {
  feedback: CoachFeedback | null;
  loading: boolean;
}

const CoachWidget: React.FC<CoachWidgetProps> = ({ feedback, loading }) => {
  if (!feedback && !loading) return null;

  return (
    <div className="mt-6 w-full max-w-md mx-auto">
      <div className="relative bg-slate-900/80 border border-slate-700 rounded-2xl p-4 flex items-start gap-4 shadow-xl backdrop-blur-sm">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center border-2 border-white shadow-lg">
            <span className="text-xl">🐧</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            金铲铲教练 AI
          </h4>
          
          {loading ? (
            <div className="flex space-x-1 h-5 items-center">
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          ) : (
            <p className={`text-sm font-medium leading-relaxed ${
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