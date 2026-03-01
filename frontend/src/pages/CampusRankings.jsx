import React, { useState, useEffect } from 'react';
import { 
  Trophy, Search, Filter, Github, 
  ExternalLink, ChevronDown, User, Star 
} from 'lucide-react';

const CampusRankings = () => {
  const [students, setStudents] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('Overall');

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    // BACKEND INTEGRATION: Fetch students sorted by 'score' from Supabase 'profiles' table
    const { data } = await supabase.from('profiles').select('*').order('score', { ascending: false });
    setStudents(data);

    
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
            <Trophy size={20} />
            <span className="uppercase tracking-widest text-xs">Leaderboard</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900">Campus Rankings</h1>
          <p className="text-slate-500 mt-2">Rankings based on AI-evaluated skill scores and experience.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by student or role..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>
          <button className="bg-white p-3 border border-slate-200 rounded-xl hover:bg-slate-50">
            <Filter size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Ranking List */}
      <div className="space-y-4">
        {students.map((student, index) => (
          <div key={student.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all hover:border-blue-300">
            <div 
              className="p-6 flex flex-col md:flex-row items-center gap-6 cursor-pointer"
              onClick={() => setExpandedId(expandedId === student.id ? null : student.id)}
            >
              {/* Rank Badge */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl 
                ${index === 0 ? 'bg-yellow-100 text-yellow-600' : index === 1 ? 'bg-slate-100 text-slate-600' : 'bg-orange-50 text-orange-600'}`}>
                {index + 1}
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
                <p className="text-sm text-slate-500 font-medium">{student.role}</p>
              </div>

              {/* Score Indicator */}
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">CGPA</p>
                  <p className="font-bold text-slate-700">{student.cgpa}</p>
                </div>
                <div className="text-center bg-blue-50 px-6 py-2 rounded-xl border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-400 uppercase">Career Score</p>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-blue-600 fill-blue-600" />
                    <span className="text-xl font-black text-blue-600">{student.score}</span>
                  </div>
                </div>
                <ChevronDown className={`text-slate-400 transition-transform ${expandedId === student.id ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Expanded Profile Detail (For Recruiters/Faculty) */}
            {expandedId === student.id && (
              <div className="px-6 pb-6 pt-2 border-t border-slate-50 bg-slate-50/50 animate-in slide-in-from-top-2 duration-300">
                <div className="grid md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Top Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {student.skills.map(skill => (
                        <span key={skill} className="bg-white border border-slate-200 px-2 py-1 rounded text-xs font-medium text-slate-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Experience</h4>
                    <p className="text-sm text-slate-700 font-medium">{student.internships}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Portfolio</h4>
                    <a href={`https://${student.github}`} className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                      <Github size={14} /> View GitHub <ExternalLink size={12} />
                    </a>
                    <button className="mt-2 text-xs font-bold text-slate-500 border border-slate-300 py-1 px-3 rounded hover:bg-white transition-all">
                      View Full Resume
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampusRankings;