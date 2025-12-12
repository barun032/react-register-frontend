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
    logout, currentUser 
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
    navigate('/login');
  };

  const getCreateButtonText = () => {
    switch (selectedRegister) {
      case registerTypes.RECEIVE: return 'New Receive Entry';
      case registerTypes.ISSUED: return 'New Dispatch Entry';
      default: return 'Create Entry';
    }
  };

  const selectClass = "w-full px-3 py-2 border border-blue-300 rounded bg-blue-50 text-blue-900 text-sm font-semibold focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none cursor-pointer shadow-sm";

  return (
    <header className="bg-white border-b-4 border-blue-900 sticky top-0 z-40 shadow-md">
      {/* Top Government Strip */}
      <div className="bg-blue-900 text-white py-2 px-4 text-[11px] uppercase font-bold tracking-widest text-center shadow-sm">
        <span className='text-center'>Government of West Bengal • Register Management Portal</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-3">
          
          {/* Logo & Department Name */}
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="flex items-center justify-center w-14 h-14 p-1">
             <img src={logo} alt="logo" className="h-full w-auto object-contain drop-shadow-sm" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-800 leading-tight font-serif tracking-tight">
                Department of MPB
              </h1>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Register Management System</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Part Selector */}
            {selectedRegister === registerTypes.RECEIVE && (
              <div className="relative w-full sm:w-44">
                <select value={selectedPart} onChange={(e) => setSelectedPart(e.target.value)} className={selectClass}>
                  {Object.values(receivePartTypes).map((part) => <option key={part} value={part}>{part}</option>)}
                </select>
              </div>
            )}

            {/* Register Selector */}
            <div className="relative w-full sm:w-52">
              <select value={selectedRegister} onChange={(e) => setSelectedRegister(e.target.value)} className={selectClass}>
                {Object.values(registerTypes).map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            
            <button onClick={ onCreateClick } className="w-full sm:w-auto px-6 py-2 bg-green-700 text-white text-sm font-bold rounded shadow hover:bg-green-800 transition-colors flex items-center justify-center gap-2 cursor-pointer border border-green-800 active:transform active:scale-95">
              <i className="fa-solid fa-plus-circle"></i>
              {getCreateButtonText()}
            </button>

            {/* User Profile */}
            <div className="relative mx-2" ref={menuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                className="flex flex-col items-center text-gray-600 hover:text-blue-900 transition-colors cursor-pointer group" 
                title="User Profile"
              >
                 <div className="p-1 rounded-full border-2 border-gray-200 group-hover:border-blue-600 bg-gray-50 transition-colors">
                    <i className="fa-solid fa-user text-lg text-gray-500 group-hover:text-blue-700"></i>
                 </div>
                 <span className="text-[10px] font-bold mt-0.5 text-blue-900 uppercase tracking-tight">
                    {currentUser?.name?.split(' ')[0] || 'User'}
                 </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-xl border border-gray-300 py-0 z-50 overflow-hidden">
                   <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                      <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">Signed in as</p>
                      <p className="text-xs text-gray-600 truncate font-mono mt-1">{currentUser?.email}</p>
                   </div>
                  {currentUser?.role === 'admin' && (
                    <button onClick={handleDashboardSelect} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 flex items-center gap-3 cursor-pointer border-b border-gray-100 transition-colors">
                        <i className="fa-solid fa-grip text-blue-600"></i> Admin Dashboard
                    </button>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-700 hover:bg-red-50 flex items-center gap-3 cursor-pointer transition-colors">
                    <i className="fa-solid fa-power-off"></i> Sign Out
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