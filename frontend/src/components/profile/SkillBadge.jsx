import React from 'react';

const SkillBadge = ({ name, level = 3, isMatched = true, onGenerateRoadmap }) => {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
        isMatched
          ? 'bg-blue-50 border-blue-100 text-blue-700'
          : 'bg-slate-50 border-slate-200 text-slate-400'
      }`}
    >
      <span className="text-sm font-bold">{name}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={`h-1.5 w-1.5 rounded-full ${
              dot <= level && isMatched ? 'bg-blue-500' : 'bg-slate-300'
            }`}
          />
        ))}
      </div>
      {!isMatched && (
        <button
          onClick={() => onGenerateRoadmap(name)}
          className="ml-2 text-xs text-blue-600 font-bold hover:underline"
        >
          Generate Roadmap
        </button>
      )}
    </div>
  );
};

export default SkillBadge;