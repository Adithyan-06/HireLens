import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Map, Star } from 'lucide-react';

const Dashboard = () => {
  const { profile } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!</h1>
        <p className="text-slate-500">Here’s what’s happening with your career search.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Star size={24}/></div>
            <Link to="/profile" className="text-xs font-bold text-blue-600 hover:underline">Edit Profile</Link>
          </div>
          <h3 className="text-lg font-bold">Career Score</h3>
          <p className="text-3xl font-black text-slate-900 mt-1">{profile?.score || 0}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile?.skills?.slice(0, 3).map(s => (
              <span key={s} className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold uppercase text-slate-500">{s}</span>
            ))}
          </div>
        </div>

        {/* Active Roadmap Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 rounded-2xl text-green-600"><Map size={24}/></div>
            <Link to="/roadmap" className="text-xs font-bold text-green-600 hover:underline">View Roadmap</Link>
          </div>
          <h3 className="text-lg font-bold">Learning Goal</h3>
          <p className="text-slate-600 mt-1 line-clamp-1">Active Roadmap Title...</p>
          <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full w-[45%]"></div>
          </div>
        </div>

        {/* Applications Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600"><Briefcase size={24}/></div>
            <Link to="/applied" className="text-xs font-bold text-purple-600 hover:underline">See All</Link>
          </div>
          <h3 className="text-lg font-bold">Applications</h3>
          <p className="text-3xl font-black text-slate-900 mt-1">12</p>
          <p className="text-sm text-slate-500 mt-1">3 pending interviews</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;