import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, MapPin, DollarSign, Briefcase, Zap, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SkillBadge from '../components/profile/SkillBadge';
import RoadmapModal from '../components/profile/RoadmapModal';
import Button from '../components/common/Button';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const fetchJobDetails = async () => {
    setLoadingJob(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      toast.error('Failed to fetch job details.');
    } finally {
      setLoadingJob(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  useEffect(() => {
    fetchJobDetails();
    fetchUserProfile();
  }, [id]);

  // 1. Logic for Apply Job (Adds to Dashboard/Applied Jobs)
  const handleApplyJob = async () => {
    setIsApplying(true);
    try {
      // 1. Save to your internal dashboard (Applied Jobs page)
      await axios.post('http://localhost:5000/api/jobs/apply', {
        userId: user.id,
        jobId: id,
        jobTitle: job.title,
        company: job.company?.display_name || job.company,
        status: 'Applied'
      });
  
      toast.success('Added to Applied Jobs dashboard!');
  
      // 2. Open the ACTUAL job application URL in a new tab
      if (job.url) {
        window.open(job.url, '_blank', 'noopener,noreferrer');
      } else {
        toast.error("External application link not found.");
      }
  
      // 3. Navigate to dashboard to see the record
      navigate('/applied');
  
    } catch (error) {
      console.error(error);
      toast.error('Could not track application.');
    } finally {
      setIsApplying(false);
    }
  };

  // 2. Logic for Roadmap Generation
  const handleGenerateRoadmap = () => {
    setShowModal(true);
  };

  const saveRoadmap = async (roadmap) => {
    try {
      await axios.post('http://localhost:5000/api/roadmap/generate', { 
        userId: user.id,
        roadmap 
      });
      toast.success('New learning path activated!');
      navigate('/roadmap');
    } catch (err) {
      toast.error('Failed to save roadmap.');
    }
  };

  if (loadingJob)
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {job && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{job.title}</h1>
              <p className="text-blue-600 text-xl font-semibold">{job.company?.display_name || 'Unknown Company'}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <Button 
                onClick={handleGenerateRoadmap} 
                variant="outline" 
                className="flex-1 md:flex-none border-blue-600 text-blue-600"
              >
                <Zap size={18} className="fill-blue-600" /> Generate Roadmap
              </Button>
              <Button 
                onClick={handleApplyJob} 
                loading={isApplying}
                className="flex-1 md:flex-none"
              >
                <Briefcase size={18} /> Apply for Job
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Description</h2>
                <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-line">{job.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 pt-6 border-t border-slate-100">
                  <span className="flex items-center gap-2"><MapPin size={18} className="text-blue-500" /> {job.location?.display_name}</span>
                  <span className="flex items-center gap-2"><DollarSign size={18} className="text-blue-500" /> {job.salary || 'Not disclosed'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill, index) => (
                    <SkillBadge
                      key={index}
                      name={skill}
                      isMatched={profile?.skills?.some((s) => s.toLowerCase() === skill.toLowerCase())}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-6">
                  Click 'Generate Roadmap' to get an AI learning path for missing skills.
                </p>
              </div>
            </div>
          </div>

          {showModal && (
            <RoadmapModal
              jobTitle={job.title}
              jobDescription={job.description}
              userSkills={profile?.skills}
              onClose={() => setShowModal(false)}
              onSave={saveRoadmap}
            />
          )}
        </>
      )}
    </div>
  );
};

export default JobDetail;