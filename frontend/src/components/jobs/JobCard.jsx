import React from 'react';
import { MapPin, DollarSign, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const JobCard = ({ job, userSkills = [] }) => {
  const navigate = useNavigate();

  const requiredSkills = Array.isArray(job.skills) ? job.skills : [];
  const matchedSkills = requiredSkills.filter((skill) =>
    userSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
  );

  return (
    <div
      className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-blue-400 hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden"
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      {/* Skill Match Indicator Tag */}
      <div className="absolute top-0 right-0 bg-blue-50 text-blue-600 px-4 py-1 rounded-bl-xl text-xs font-bold uppercase tracking-widest border-l border-b border-blue-100">
        {matchedSkills.length}/{requiredSkills.length} Skills Match
      </div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <p className="text-slate-500 font-medium">
            {job.company?.display_name || 'Unknown Company'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6">
        <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg">
          <MapPin size={16} className="text-blue-500" />{' '}
          {job.location?.display_name || 'Location not specified'}
        </span>
        <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg">
          <DollarSign size={16} className="text-blue-500" />{' '}
          {job.salary || 'Salary not disclosed'}
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex gap-2">
          {requiredSkills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className={`text-xs px-2 py-1 rounded-md font-bold ${
                userSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
                  ? 'bg-green-50 text-green-600'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
        <Link to="/jobs/:id" className="text-blue-600 font-bold flex items-center gap-1 text-sm">
          View Details <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;