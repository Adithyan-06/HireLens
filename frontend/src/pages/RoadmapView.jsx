import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { 
  CheckCircle2, Circle, Trash2, 
  Trophy, BookOpen, Clock, AlertTriangle, Loader2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RoadmapView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchActiveRoadmap();
  }, [user]);

  const fetchActiveRoadmap = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_roadmaps')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle(); // Gets one or null

      if (error) throw error;
      setActiveRoadmap(data);
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      toast.error("Failed to load your roadmap.");
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = async (index) => {
    // 1. Update UI locally for instant feedback
    const updatedSteps = [...activeRoadmap.steps];
    updatedSteps[index].completed = !updatedSteps[index].completed;
    
    const newRoadmap = { ...activeRoadmap, steps: updatedSteps };
    setActiveRoadmap(newRoadmap);

    // 2. Sync with Supabase
    try {
      const { error } = await supabase
        .from('user_roadmaps')
        .update({ steps: updatedSteps })
        .eq('id', activeRoadmap.id);

      if (error) throw error;
      toast.success(updatedSteps[index].completed ? "Step completed!" : "Step reset");
    } catch (error) {
      toast.error("Failed to save progress.");
      // Rollback UI if DB update fails
      fetchActiveRoadmap();
    }
  };

  const dropRoadmap = async () => {
    if (window.confirm("Are you sure? This will delete your current progress.")) {
      try {
        const { error } = await supabase
          .from('user_roadmaps')
          .update({ status: 'archived' }) // We archive instead of delete for data history
          .eq('id', activeRoadmap.id);

        if (error) throw error;
        setActiveRoadmap(null);
        toast.error("Roadmap dropped.");
      } catch (error) {
        toast.error("Failed to drop roadmap.");
      }
    }
  };

  const calculateProgress = () => {
    if (!activeRoadmap?.steps) return 0;
    const completed = activeRoadmap.steps.filter(s => s.completed).length;
    return Math.round((completed / activeRoadmap.steps.length) * 100);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  if (!activeRoadmap) return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <BookOpen className="text-blue-600" size={40} />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">No Active Roadmap</h2>
      <p className="text-slate-500 mb-8">Generate a roadmap from a job listing to start your personalized learning journey.</p>
      <button 
        onClick={() => navigate('/jobs')}
        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
      >
        Browse Jobs
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Active Goal</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">{activeRoadmap.title}</h1>
          {activeRoadmap.company && <p className="text-slate-500 font-medium">Targeting: {activeRoadmap.company}</p>}
        </div>
        <button 
          onClick={dropRoadmap}
          className="flex items-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-bold transition-all"
        >
          <Trash2 size={18} /> Drop Goal
        </button>
      </div>

      {/* Progress Overview */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-8 flex flex-wrap gap-8 items-center">
        <div className="flex-1 min-w-200px">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-bold text-slate-700">Overall Progress</span>
            <span className="text-sm font-bold text-blue-600">{calculateProgress()}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-500" 
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
            <p className="font-bold text-green-600 flex items-center gap-1">
              <Trophy size={16}/> {calculateProgress() === 100 ? "Completed!" : "On Track"}
            </p>
          </div>
        </div>
      </div>

      {/* Roadmap Steps */}
      <div className="space-y-4">
        {activeRoadmap.steps.map((step, index) => (
          <div 
            key={index}
            className={`group flex items-start gap-6 p-6 rounded-2xl border transition-all ${
              step.completed 
              ? 'bg-slate-50 border-slate-100' 
              : 'bg-white border-slate-200 shadow-sm hover:border-blue-300'
            }`}
          >
            <button 
              onClick={() => toggleStep(index)}
              className={`mt-1 transition-transform active:scale-90 ${step.completed ? 'text-green-500' : 'text-slate-300 hover:text-blue-400'}`}
            >
              {step.completed ? <CheckCircle2 size={32} fill="currentColor" className="text-green-500 fill-white" /> : <Circle size={32} />}
            </button>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className={`text-lg font-bold ${step.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                  {step.topic}
                </h3>
                <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded">Week {step.week || index + 1}</span>
              </div>
              
              {step.learning_objective && (
                <p className={`mt-1 text-sm ${step.completed ? 'text-slate-300' : 'text-slate-500'}`}>
                   {step.learning_objective}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                {step.resources?.map((res, i) => (
                  <span 
                    key={i} 
                    className="text-sm text-blue-500 font-medium flex items-center gap-1 bg-blue-50/50 px-3 py-1 rounded-full"
                  >
                    <BookOpen size={14}/> {res}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapView;