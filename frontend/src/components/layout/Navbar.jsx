import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Briefcase, User, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Briefcase className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Hire<span className="text-blue-600">Lens</span>
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/jobs" className="hover:text-blue-600 transition-colors">Jobs</Link>
            {user && (
              <>
                <Link to="/applied" className="hover:text-blue-600 transition-colors">Dashboard</Link>
                <Link to="/roadmap" className="hover:text-blue-600 transition-colors">Roadmap</Link>
                <Link to="/rankings" className="hover:text-blue-600 transition-colors">Rankings</Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 border-l pl-4">
                <Link to="/profile" className="p-2 hover:bg-slate-100 rounded-full transition-all">
                  <User size={20} className="text-slate-600" />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-all"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-slate-600 px-4 py-2 hover:text-blue-600">Login</Link>
                <Link to="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-all">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;