import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, DollarSign, Filter, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import JobCard from '../components/jobs/JobCard';

const JobListing = () => {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ title: '', location: '' });

  // BACKEND INTEGRATION: Fetch jobs from your Node.js Adzuna route
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { title, location } = searchQuery;
      const response = await fetch(
        `https://hirelens-oowi.onrender.com/api/jobs/search?search=${title}&location=${location}`
      );
      const result = await response.json();

      console.log('Backend response:', result);

      // Assuming result is the array of jobs from Adzuna
      if (Array.isArray(result)) {
        setJobs(result);
      } else {
        setJobs([]);
        toast.error(result.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to fetch jobs. Check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* SIDEBAR FILTERS */}
        <aside className="w-full md:w-64 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Filter size={18} /> Filters
            </h3>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Salary Range
                </label>
                <select className="w-full mt-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                  <option>All Salaries</option>
                  <option>$50k - $80k</option>
                  <option>$80k - $120k</option>
                  <option>$120k+</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Job Type
                </label>
                <div className="mt-2 space-y-2">
                  {['Full-time', 'Remote', 'Contract'].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1">
          {/* SEARCH BAR */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Job title or keywords..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all"
                value={searchQuery.title}
                onChange={(e) =>
                  setSearchQuery({ ...searchQuery, title: e.target.value })
                }
              />
            </div>
            <div className="flex-1 relative">
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Location..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all"
                value={searchQuery.location}
                onChange={(e) =>
                  setSearchQuery({ ...searchQuery, location: e.target.value })
                }
              />
            </div>
            <button
              onClick={fetchJobs}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md"
            >
              Search
            </button>
          </div>

          {/* JOB CARDS LIST */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
              <p className="text-slate-500">Finding the best matches for you...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  userSkills={profile?.skills || []}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListing;