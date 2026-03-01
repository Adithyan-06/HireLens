import React from 'react';
import { Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1 rounded-md">
            <Briefcase className="text-white" size={18} />
          </div>
          <span className="font-bold text-slate-900">HireLens © 2026</span>
        </div>
        <div className="flex gap-8 text-sm text-slate-500">
          <a href="#" className="hover:text-blue-600">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600">Terms of Service</a>
          <a href="#" className="hover:text-blue-600">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;