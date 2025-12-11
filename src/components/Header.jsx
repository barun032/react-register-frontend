// src/components/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { registerTypes, receivePartTypes } from '../data/registerData';
import { useRegister } from '../context/RegisterContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../public/logo.png'

const Header = ({ onCreateClick }) => {
  const navigate = useNavigate();
  const { 
    selectedRegister, setSelectedRegister, 
    selectedPart, setSelectedPart,
    logout, // Import logout
    currentUser 
  } = useRegister();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDashboardSelect = () => {
    setIsUserMenuOpen(false);
    navigate('/admin-dashboard');
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logout(); 
    navigate('/login'); // Redirect to Login Page
  };

  const getCreateButtonText = () => {
    switch (selectedRegister) {
      case registerTypes.RECEIVE: return 'Create Receive';
      case registerTypes.ISSUED: return 'Create Dispatch';
      default: return 'Create';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-4">
          
          {/* Logo Section */}
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg">
             <img src={logo} alt="logo" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-gray-900">Register Management</h1>
              <p className="text-sm text-gray-500">Welcome, {currentUser?.name || 'User'}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {/* ... (Selectors remain the same) ... */}
            {selectedRegister === registerTypes.RECEIVE && (
              <div className="relative w-full sm:w-40">
                <select value={selectedPart} onChange={(e) => setSelectedPart(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 appearance-none cursor-pointer focus:border-slate-500 focus:outline-none">
                  {Object.values(receivePartTypes).map((part) => <option key={part} value={part}>{part}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            )}

            <div className="relative w-full sm:w-48">
              <select value={selectedRegister} onChange={(e) => setSelectedRegister(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 appearance-none cursor-pointer focus:border-slate-500 focus:outline-none">
                {Object.values(registerTypes).map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            
            <button onClick={ onCreateClick } className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 text-white font-medium cursor-pointer rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              {getCreateButtonText()}
            </button>

            {/* Admin/User Menu */}
            <div className="relative mx-[10px]" ref={menuRef}>
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex flex-col items-center text-gray-500 hover:text-slate-700 transition-colors cursor-pointer" title="User Menu">
                 <i className="fa-solid fa-circle-user text-3xl"></i>
                 <span className="text-[11px] font-bold mt-1 max-w-[80px] truncate leading-tight">
                    {currentUser?.name || 'User'}
                 </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  {/* Dashboard Option - Only if Admin */}
                  {currentUser?.role === 'admin' && (
                    <button onClick={handleDashboardSelect} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 transition-colors flex items-center gap-3 cursor-pointer">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        Dashboard
                    </button>
                  )}
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-3 cursor-pointer">
                    <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;