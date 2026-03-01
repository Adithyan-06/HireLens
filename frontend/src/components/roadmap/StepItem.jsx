import React from 'react';
import { CheckCircle2, Circle, BookOpen } from 'lucide-react';

const StepItem = ({ step, index, onToggle }) => {
  return (
    <div className={`p-5 rounded-2xl border transition-all ${step.completed ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200 shadow-sm'}`}>
      <div className="flex gap-4">
        <button onClick={() => onToggle(index)} className="mt-1">
          {step.completed ? <CheckCircle2 className="text-green-500" size={28} /> : <Circle className="text-slate-300" size={28} />}
        </button>
        <div className="flex-1">
          <h4 className={`font-bold ${step.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
            {step.topic}
          </h4>
          <div className="flex gap-3 mt-2">
            {step.resources.map((res, i) => (
              <a key={i} href="#" className="text-xs text-blue-600 font-medium flex items-center gap-1 hover:underline">
                <BookOpen size={12} /> Resource {i + 1}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepItem;