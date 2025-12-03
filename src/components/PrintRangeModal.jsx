// src/components/PrintRangeModal.jsx
import React, { useState, useEffect } from 'react';

const PrintRangeModal = ({ isOpen, onClose, totalRecords, onConfirm }) => {
  const [startNo, setStartNo] = useState('1');
  const [endNo, setEndNo] = useState('');
  
  const maxNo = totalRecords.length > 0 
    ? Math.max(...totalRecords.map(r => parseInt(r.id || 0))) 
    : 0;

  const getPreviewCount = () => {
    const start = parseInt(startNo) || 1;
    const end = parseInt(endNo) || maxNo;
    if (start > end || start < 1 || end > maxNo) return 0;
    return totalRecords.filter(r => {
      const id = parseInt(r.id || 0);
      return id >= start && id <= end;
    }).length;
  };

  const previewCount = getPreviewCount();

  useEffect(() => {
    if (!endNo && isOpen && maxNo > 0) {
      setEndNo(maxNo.toString());
    }
  }, [maxNo, isOpen, endNo]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    let start = parseInt(startNo) || 1;
    let end = parseInt(endNo) || maxNo;
    if (start < 1) start = 1;
    if (end > maxNo) end = maxNo;
    if (start > end) [start, end] = [end, start];

    const filtered = totalRecords.filter(r => {
      const id = parseInt(r.id || 0);
      return id >= start && id <= end;
    });

    if (filtered.length === 0) {
      alert('No records found in this range.');
      return;
    }

    onConfirm(filtered); // ← Now passing actual records, not just numbers
    onClose();
  };

  return (
    <>
      {/* Perfect blurred backdrop */}
      <div 
        className="fixed inset-0 backdrop-blur-sm z-50 transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden pointer-events-auto
                        animate-in fade-in zoom-in-95 duration-300">
          
          {/* Clean Header */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-8 py-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Records
                </h3>
                <p className="text-slate-200 text-sm mt-1">Select range by Consecutive Number</p>
              </div>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-2 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-800">
                Total Records: <span className="font-bold text-slate-700">{maxNo}</span>
              </p>
              <p className="text-sm text-gray-600">
                Filtered: <strong>{totalRecords.length}</strong> record{totalRecords.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">From</label>
                <input
                  type="number"
                  value={startNo}
                  onChange={(e) => setStartNo(e.target.value)}
                  className="w-full px-5 py-4 text-center text-lg font-medium border-2 border-gray-300 rounded-xl focus:border-slate-600 focus:ring-4 focus:ring-slate-100 transition-all"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">To</label>
                <input
                  type="number"
                  value={endNo}
                  onChange={(e) => setEndNo(e.target.value)}
                  className="w-full px-5 py-4 text-center text-lg font-medium border-2 border-gray-300 rounded-xl focus:border-slate-600 focus:ring-4 focus:ring-slate-100 transition-all"
                  placeholder={maxNo}
                />
              </div>
            </div>

            {previewCount > 0 && (
              <div className="p-5 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl text-center">
                <p className="text-emerald-800 font-bold text-xl">
                  Will print <span className="text-3xl text-emerald-600">{previewCount}</span> record{previewCount !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-4 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-xl font-bold hover:from-slate-800 hover:to-black transition shadow-lg flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Range
              </button>
            </div>

            <div className="flex justify-center gap-6 text-sm font-medium">
              <button onClick={() => { setStartNo('1'); setEndNo(maxNo.toString()); }} 
                      className="text-slate-600 hover:text-slate-800 underline">Select All</button>
              <span className="text-gray-400">•</span>
              <button onClick={() => { setStartNo('1'); setEndNo(''); }} 
                      className="text-slate-600 hover:text-slate-800 underline">Clear</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintRangeModal;