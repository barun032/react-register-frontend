// src/components/Header.js (Refined Version)
import React from 'react';
import { registerTypes } from '../data/registerData';

const Header = ({ selectedRegister, onRegisterChange, onCreateClick }) => {
  const getCreateButtonText = () => {
    switch (selectedRegister) {
      case registerTypes.DISPATCH:
        return 'Create Dispatch';
      case registerTypes.RECEIVE:
        return 'Create Receive';
      case registerTypes.ISSUED:
        return 'Create Issued';
      default:
        return 'Create';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-4">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="flex items-center justify-center w-10 h-10 bg-slate-700 rounded-lg">
              <span className="text-white font-bold text-lg">📋</span>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-gray-900">Register Management</h1>
              <p className="text-sm text-gray-500">Document Tracking System</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
            <div className="relative w-full sm:w-56">
              <select
                value={selectedRegister}
                onChange={(e) => onRegisterChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 appearance-none cursor-pointer focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
              >
                {Object.values(registerTypes).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            <button
              onClick={onCreateClick}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>+</span>
              <span>{getCreateButtonText()}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;