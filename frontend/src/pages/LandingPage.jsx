import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Target, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Navigate your career with <span className="text-blue-600">AI precision.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your resume, find matching jobs, and let our AI generate a step-by-step roadmap to bridge your skill gaps. 
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg flex items-center justify-center gap-2 group">
              Get Started Free <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/jobs" className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50">
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-slate-50 py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Zap className="text-blue-600" size={32} />} 
              title="AI Resume Parsing" 
              desc="Extract skills and projects automatically to build your professional profile in seconds."
            />
            <FeatureCard 
              icon={<Target className="text-blue-600" size={32} />} 
              title="Smart Job Matching" 
              desc="We compare your profile with live Adzuna listings to find the perfect role for your skills."
            />
            <FeatureCard 
              icon={<CheckCircle className="text-blue-600" size={32} />} 
              title="Skill Roadmaps" 
              desc="Missing a skill? Our AI builds a weekly learning plan so you're ready to apply."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;