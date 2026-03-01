import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { 
  User, MapPin, Globe, Github, Plus, 
  Trash2, FileText, Upload, Loader2, Check, Save 
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ProfileSetup = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    location: '',
    website_url: '',
    github_username: '',
    skills: [],
    projects: [],
    experience: []
  });

  const [newSkill, setNewSkill] = useState('');

  // Sync profile data when it loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        location: profile.location || '',
        website_url: profile.website_url || '',
        github_username: profile.github_username || '',
        skills: profile.skills || [],
        projects: profile.projects || [],
        experience: profile.experience || []
      });
    }
  }, [profile]);

  // --- FEATURE 1: RESUME UPLOAD & AUTO-FILL ---
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setParsing(true);
    const formDataFile = new FormData();
    formDataFile.append('resume', file);
  
    try {
      const response = await axios.post('http://localhost:5000/api/profile/parse', formDataFile);
      
      if (response.data.success) {
        const parsed = response.data.data;
        
        setFormData(prev => ({
          ...prev,
          // Fill basic details if they were found
          full_name: parsed.full_name || prev.full_name,
          github_username: parsed.github_username || prev.github_username,
          cgpa: parsed.cgpa || prev.cgpa,
          
          // Append new skills and remove duplicates
          skills: [...new Set([...prev.skills, ...parsed.skills])],
          
          // Overwrite or append projects/experience
          projects: parsed.projects.length > 0 ? parsed.projects : prev.projects,
          experience: parsed.experience.length > 0 ? parsed.experience : prev.experience
        }));
        
        toast.success("Resume parsed successfully!");
      }
    } catch (error) {
      console.error("Parsing error:", error);
      toast.error("Failed to parse resume. Check console for details.");
    } finally {
      setParsing(false);
    }
  };

  // --- FEATURE 2: GITHUB SKILL SYNC ---
  const syncGithubSkills = async () => {
    if (!formData.github_username) return toast.error("Enter GitHub username first");
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/github/${formData.github_username}`);
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          skills: [...new Set([...prev.skills, ...response.data.skills])]
        }));
        toast.success("Skills synced from GitHub!");
      }
    } catch (error) {
      toast.error("Could not fetch GitHub data.");
    } finally {
      setLoading(false);
    }
  };

  // --- FEATURE 3: MANUAL UPDATES ---
  const handleSave = async () => {
    setLoading(true);
    try {
      // 1. Update Profile (Basics + Projects + Experience)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          location: formData.location,
          website_url: formData.website_url,
          github_username: formData.github_username,
          projects: formData.projects,
          experience: formData.experience,
          updated_at: new Date()
        })
        .eq('id', user.id);
  
      if (profileError) throw profileError;
  
      // 2. Sync Skills (This is trickier because skills are separate rows)
      // First, clear existing and re-insert (simple approach) OR upsert
      await supabase.from('skills').delete().eq('user_id', user.id);
      
      const skillsToInsert = formData.skills.map(skillName => ({
        user_id: user.id,
        name: skillName,
        level: 1, // Default
        source: 'manual' 
      }));
  
      const { error: skillError } = await supabase
        .from('skills')
        .insert(skillsToInsert);
  
      if (skillError) throw skillError;
  
      toast.success("Full profile and skills updated!");
      refreshProfile();
    } catch (error) {
      console.error(error);
      toast.error("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill] });
      setNewSkill('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-slate-900">Complete Your Profile</h1>
        <p className="text-slate-500">This data powers your AI job matching and rankings.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar: Resume & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 mb-4"><FileText size={18}/> Smart Upload</h3>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
              {parsing ? (
                <Loader2 className="animate-spin text-blue-600" />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <Upload size={24} />
                  <span className="text-xs mt-2 font-medium">Upload Resume</span>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleResumeUpload} accept=".pdf,.docx" />
            </label>
            <p className="text-[10px] text-slate-400 mt-3 text-center">AI will extract skills, projects, and internships.</p>
          </div>

          <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg">
            <h3 className="font-bold flex items-center gap-2 mb-2"><Github size={18}/> GitHub Sync</h3>
            <p className="text-xs opacity-80 mb-4">Pull top languages and skills from your repos.</p>
            <button 
              onClick={syncGithubSkills}
              className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-xl text-sm font-bold transition-all"
            >
              Sync Now
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="md:col-span-2 space-y-8">
          {/* Basics */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold mb-4">Personal Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 col-span-2 md:col-span-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <input 
                  className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
              <div className="space-y-1 col-span-2 md:col-span-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                <input 
                  className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">GitHub Username</label>
                <input 
                  className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.github_username}
                  onChange={e => setFormData({...formData, github_username: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Portfolio/Website</label>
                <input 
                  className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.website_url}
                  onChange={e => setFormData({...formData, website_url: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Skills Stack</h2>
            <div className="flex gap-2 mb-4">
              <input 
                placeholder="Add skill (e.g. React)"
                className="flex-1 bg-slate-50 border-none rounded-xl p-3 outline-none"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addSkill()}
              />
              <button onClick={addSkill} className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-all">
                <Plus size={20}/>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, i) => (
                <span key={i} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-bold border border-blue-100">
                  {skill}
                  <button onClick={() => setFormData({...formData, skills: formData.skills.filter(s => s !== skill)})}>
                    <Trash2 size={14} className="text-blue-300 hover:text-red-500" />
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* Action Footer */}
          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;