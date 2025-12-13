import React, { useState, useEffect } from 'react'; // 1. Imported useEffect
import { useRegister } from '../context/RegisterContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../public/logo.png'; 

const LoginPage = () => {
  const { login } = useRegister();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  // 2. Logic to auto-hide error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000); // Time in milliseconds (3000ms = 3 seconds)

      return () => clearTimeout(timer); // Cleanup the timer on unmount or re-render
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(formData.email, formData.password);
    if (result.success) { 
        navigate('/'); 
    } else { 
        setError(result.message); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col item-center justify-center py-12 relative overflow-hidden">
      {/* Top Decoration Bar */}
      <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-green-600 via-blue-700 to-green-600"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex flex-col items-center text-center mb-8">
            <div className="w-17 h-17 mb-4">
                <img src={logo} alt="Biswa Bangla Logo" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <h2 className="text-2xl font-bold text-blue-900 font-serif tracking-tight uppercase">
              Department of WBCID
            </h2>
            <p className="text-sm font-bold text-green-700 mt-1 uppercase tracking-widest">Government of West Bengal</p>
            <div className="mt-6 border-b-2 border-yellow-500 w-16"></div>
        </div>

        <div className="bg-white py-8 px-10 shadow-xl border border-gray-200 rounded-lg sm:rounded-xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-800 rounded-t-xl"></div>
          
          <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">Official Login Portal</h3>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-600 uppercase mb-1">Username / Email ID</label>
              <input
                id="email" type="email" required
                className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded bg-gray-50 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all text-sm"
                placeholder="official@wb.gov.in"
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-600 uppercase mb-1">Secure Password</label>
              <input
                id="password" type="password" required
                className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded bg-gray-50 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all text-sm"
                placeholder="••••••••"
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {/* 3. Updated Error Style */}
            {error && (
              <div className="flex items-center bg-red-50 border-l-4 border-red-600 p-3 rounded shadow-sm animate-pulse">
                <svg className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-red-700 text-sm font-medium">{error}</span>
              </div>
            )}

            <div>
              <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded shadow-sm text-sm font-bold text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 transition cursor-pointer uppercase tracking-wide">
                Secure Sign In
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
              <p className="text-[10px] text-gray-400">Authorized Personnel Only • MPB WB</p>
          </div>
        </div>
      </div>
      
      {/* Bottom Watermark */}
      <div className="absolute bottom-4 text-center text-gray-400 text-xs">
        <p>Register Management System v2.0</p>
      </div>
    </div>
  );
};

export default LoginPage;