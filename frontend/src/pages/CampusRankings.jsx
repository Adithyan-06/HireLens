import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  Loader2,
  Trophy,
  Award,
  Search,
  Code,
  BookOpen,
  FileText,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CampusRankings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [rankings, setRankings] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [userRanking, setUserRanking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [collegeSearch, setCollegeSearch] = useState('');
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [collegeSuggestions, setCollegeSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch colleges list
  const fetchColleges = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/rankings/colleges');
      setColleges(response.data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  // Fetch global rankings with college filter
  const fetchRankings = async (collegeFilter = null) => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/rankings/global`;
      
      const params = {
        page: page,
        limit: 50
      };

      if (collegeFilter) {
        params.college = collegeFilter;
      }

      const response = await axios.get(url, { params });
      
      setRankings(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching rankings:', error);
      toast.error('Failed to fetch rankings');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user ranking
  const fetchUserRanking = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken || !user?.id) return;

      const response = await axios.get(
        `http://localhost:5000/api/rankings/user/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      setUserRanking(response.data);
    } catch (error) {
      console.error('Error fetching user ranking:', error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchColleges();
    fetchRankings();
    fetchUserRanking();
  }, []);

  // Fetch rankings when page changes
  useEffect(() => {
    if (selectedCollege) {
      fetchRankings(selectedCollege);
    } else {
      fetchRankings();
    }
  }, [page, selectedCollege]);

  // Handle college search input
  const handleCollegeSearch = (e) => {
    const value = e.target.value;
    setCollegeSearch(value);

    if (value.trim() === '') {
      setCollegeSuggestions([]);
      setShowSuggestions(false);
    } else {
      const filtered = colleges.filter((college) =>
        college.toLowerCase().includes(value.toLowerCase())
      );
      setCollegeSuggestions(filtered);
      setShowSuggestions(true);
    }
  };

  // Handle search button click
  const handleSearchCollege = () => {
    if (collegeSearch.trim() === '') {
      toast.error('Please enter a college name');
      return;
    }

    // Check if the entered college exists in the list
    const collegeExists = colleges.some(
      college => college.toLowerCase() === collegeSearch.toLowerCase()
    );

    if (collegeExists) {
      setSelectedCollege(collegeSearch);
      setShowSuggestions(false);
      setPage(1);
    } else {
      toast.error('College not found. Please select from suggestions.');
    }
  };

  // Select college from suggestion
  const handleSelectCollege = (college) => {
    setSelectedCollege(college);
    setCollegeSearch(college);
    setShowSuggestions(false);
    setPage(1);
  };

  // Clear college filter
  const handleClearFilter = () => {
    setSelectedCollege(null);
    setCollegeSearch('');
    setCollegeSuggestions([]);
    setShowSuggestions(false);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-500" />
            Campus Rankings
          </h1>
          <p className="text-slate-600">See how you rank against other students</p>
        </div>

        {/* User's Ranking Card */}
        {userRanking && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-8 mb-12 shadow-lg">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-blue-100 text-sm font-bold mb-2">YOUR RANK</p>
                <p className="text-4xl font-bold">#{userRanking.rank}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm font-bold mb-2">TOTAL SCORE</p>
                <p className="text-4xl font-bold">{userRanking.overall_score?.toFixed(2) || 0}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm font-bold mb-2">TOTAL USERS</p>
                <p className="text-4xl font-bold">{userRanking.total_users || 0}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm font-bold mb-2">COLLEGE</p>
                <p className="text-lg font-bold">{userRanking.college || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* College Filter */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Search size={20} />
            Filter by College
          </h2>

          <div className="relative">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search your college..."
                  value={collegeSearch}
                  onChange={handleCollegeSearch}
                  onFocus={() => collegeSearch && setShowSuggestions(true)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchCollege()}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && collegeSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {collegeSuggestions.map((college, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectCollege(college)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-b-0"
                      >
                        {college}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSearchCollege}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Search size={20} />
                Search
              </button>

              {selectedCollege && (
                <button
                  onClick={handleClearFilter}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-all flex items-center gap-2"
                >
                  <X size={18} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {selectedCollege && (
            <p className="text-sm text-slate-600 mt-4">
              Showing rankings for: <span className="font-bold text-blue-600">{selectedCollege}</span>
            </p>
          )}
        </div>

        {/* Rankings List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
              <p className="text-slate-500">Loading rankings...</p>
            </div>
          ) : rankings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <p className="text-slate-600 text-lg">No rankings found</p>
            </div>
          ) : (
            rankings.map((ranking) => (
              <div
                key={ranking.id}
                onClick={() => navigate(`/profile/${ranking.id}`)}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  {/* Rank Badge */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                    </div>

                    {/* Rank Number and Name */}
                    <div>
                      <p className="text-sm font-bold text-slate-500">
                        #{ranking.rank}
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        {ranking.full_name}
                      </p>
                    </div>
                  </div>

                  {/* College */}
                  <div className="hidden md:block min-w-max px-4">
                    <p className="text-sm text-slate-600 font-semibold">
                      {ranking.college || 'N/A'}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 ml-6">
                    <div className="text-center">
                      <p className="text-xs text-slate-500 font-bold mb-1">Score</p>
                      <p className="text-xl font-bold text-slate-900">
                        {ranking.overall_score?.toFixed(2) || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 font-bold mb-1">Skills</p>
                      <p className="text-xl font-bold text-slate-900">
                        {ranking.skills_count || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 font-bold mb-1">CGPA</p>
                      <p className="text-xl font-bold text-slate-900">
                        {ranking.cgpa?.toFixed(2) || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  page === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusRankings;