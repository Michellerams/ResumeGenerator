
import React from 'react';
import { ATSFeedback } from '../types';
import { CheckCircle2, AlertTriangle, Lightbulb, LoaderCircle } from 'lucide-react';

interface AtsScoreProps {
  feedback: ATSFeedback | null;
  isLoading: boolean;
}

const AtsScore: React.FC<AtsScoreProps> = ({ feedback, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm flex flex-col items-center justify-center text-center">
        <LoaderCircle className="animate-spin text-teal-400 mb-4" size={48} />
        <h3 className="text-xl font-semibold text-white">Analyzing Resume...</h3>
        <p className="text-gray-400">Our AI is checking for ATS compatibility. This might take a moment.</p>
      </div>
    );
  }

  if (!feedback) return null;

  const { score, matchRate, keywordAnalysis, suggestions } = feedback;
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;

  const scoreColor = score >= 80 ? 'text-teal-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
      <h3 className="text-2xl font-semibold mb-4 text-white">ATS Compatibility Report</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="flex flex-col items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" strokeWidth="10" className="stroke-slate-700" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="10"
              className={`stroke-current ${scoreColor} transition-all duration-1000 ease-out`}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className={`text-4xl font-bold ${scoreColor} -mt-24`}>{score}</div>
          <p className="text-gray-300 font-medium mt-20">Overall Score</p>
          <p className="text-sm font-bold px-3 py-1 rounded-full bg-slate-700 mt-2" >Match Rate: {matchRate}</p>
        </div>
        <div className="md:col-span-2 space-y-4">
            <div>
                <h4 className="font-semibold flex items-center gap-2"><CheckCircle2 size={18} className="text-green-400"/> Keywords Found</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                    {keywordAnalysis.found.slice(0, 10).map(k => <span key={k} className="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded">{k}</span>)}
                </div>
            </div>
             <div>
                <h4 className="font-semibold flex items-center gap-2"><AlertTriangle size={18} className="text-yellow-400"/> Keywords Missing</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                    {keywordAnalysis.missing.slice(0, 10).map(k => <span key={k} className="bg-yellow-900/50 text-yellow-300 text-xs px-2 py-1 rounded">{k}</span>)}
                </div>
            </div>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <h4 className="font-semibold flex items-center gap-2 mb-2"><Lightbulb size={18} className="text-blue-400"/> AI Suggestions for Improvement</h4>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
            {suggestions.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default AtsScore;
