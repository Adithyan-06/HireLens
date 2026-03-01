import React from 'react';

const JobFilters = ({ onFilterChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-bold text-slate-900 mb-3">Job Type</h4>
        {['Full-time', 'Contract', 'Remote'].map((type) => (
          <label key={type} className="flex items-center gap-2 mb-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            {type}
          </label>
        ))}
      </div>
    </div>
  );
};

export default JobFilters;