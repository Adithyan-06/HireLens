import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../services/supabase';
import { 
  Briefcase, Clock, CheckCircle, XCircle, 
  ChevronRight, Plus, ExternalLink, MessageSquare, AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

const AppliedJobs = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Status Styles Mapping
  const statusConfig = {
    'Applied': { color: 'bg-blue-50 text-blue-600', icon: <Clock size={16}/> },
    'Interviewing': { color: 'bg-amber-50 text-amber-600', icon: <MessageSquare size={16}/> },
    'Accepted': { color: 'bg-green-50 text-green-600', icon: <CheckCircle size={16}/> },
    'Rejected': { color: 'bg-red-50 text-red-600', icon: <XCircle size={16}/> },
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    // BACKEND INTEGRATION: Fetch from your 'applications' table in Supabase
    const { data } = await supabase.from('applied_jobs').select('*').eq('user_id', user.id);
    setApplications(data);
  };

  const updateStatus = async (id, newStatus) => {
    // BACKEND INTEGRATION: Update the status column in Supabase
    setApplications(apps => apps.map(a => a.id === id ? { ...a, status: newStatus } : a));
    toast.success(`Status updated to ${newStatus}`);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Application Tracker</h1>
          <p className="text-slate-500">Manage and track your external job applications.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg transition-all"
        >
          <Plus size={20}/> Add Application
        </button>
      </div>

      {/* Kanban-style Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {Object.keys(statusConfig).map(status => (
          <div key={status} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{status}</p>
            <p className="text-2xl font-black text-slate-900">
              {applications.filter(a => a.status === status).length}
            </p>
          </div>
        ))}
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-xs font-bold text-slate-400 uppercase">Role & Company</th>
              <th className="p-6 text-xs font-bold text-slate-400 uppercase">Date Applied</th>
              <th className="p-6 text-xs font-bold text-slate-400 uppercase">Status</th>
              <th className="p-6 text-xs font-bold text-slate-400 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-6">
                  <div className="font-bold text-slate-900">{app.title}</div>
                  <div className="text-sm text-slate-500 flex items-center gap-1">
                    {app.company} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                  </div>
                </td>
                <td className="p-6 text-sm text-slate-500 font-medium">
                  {new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="p-6">
                  <select 
                    value={app.status}
                    onChange={(e) => updateStatus(app.id, e.target.value)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border-none outline-none cursor-pointer ${statusConfig[app.status].color}`}
                  >
                    {Object.keys(statusConfig).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-6 text-right">
                   {app.status === 'Rejected' ? (
                     <button 
                      onClick={() => toast("AI Tip: Focus on system design for similar roles.", { icon: '💡' })}
                      className="text-slate-400 hover:text-blue-600 transition-colors p-2"
                      title="See Improvement Areas"
                     >
                       <AlertCircle size={20}/>
                     </button>
                   ) : (
                     <button className="text-slate-300 hover:text-slate-600 p-2">
                       <ChevronRight size={20}/>
                     </button>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Conditional Rejection Insight (Bottom Section) */}
      {applications.some(a => a.status === 'Rejected') && (
        <div className="mt-8 p-6 bg-blue-900 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-800 p-3 rounded-2xl">
              <Briefcase size={24}/>
            </div>
            <div>
              <h3 className="font-bold text-lg">Turn rejections into growth</h3>
              <p className="text-blue-200 text-sm">Based on your recent status, we suggest updating your roadmap.</p>
            </div>
          </div>
          <button className="bg-white text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors whitespace-nowrap">
            Analyze Improvements
          </button>
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;