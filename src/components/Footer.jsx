// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Brand/Logo Section */}
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-slate-700 rounded-lg shadow-sm">
              <span className="text-white text-sm">📋</span>
            </div>
            <div className="ml-3">
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                MPB Register
              </span>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Document Tracking System
              </p>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              © {currentYear} <span className="font-semibold text-slate-700">MPB Department</span>. 
              All rights reserved.
            </p>
          </div>

          {/* Quick Links / Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold uppercase tracking-wide">System Online</span>
            </div>
            <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
            <p className="text-xs text-gray-400 font-medium">v1.0.4</p>
          </div>
          
        </div>

        {/* Bottom Decorative Bar */}
        <div className="mt-8 h-1 w-full bg-gradient-to-r from-slate-100 via-slate-700 to-slate-100 rounded-full opacity-20"></div>
      </div>
    </footer>
  );
};

export default Footer;