import React, { useState, useEffect } from 'react';

const PrintRangeModal = ({ isOpen, onClose, totalRecords, onConfirm }) => {
  const [startNo, setStartNo] = useState('1');
  const [endNo, setEndNo] = useState('');
  const maxNo = totalRecords.length > 0 ? Math.max(...totalRecords.map(r => parseInt(r.id || 0))) : 0;

  const getPreviewCount = () => {
    const start = parseInt(startNo) || 1;
    const end = parseInt(endNo) || maxNo;
    if (start > end || start < 1 || end > maxNo) return 0;
    return totalRecords.filter(r => { const id = parseInt(r.id || 0); return id >= start && id <= end; }).length;
  };
  const previewCount = getPreviewCount();

  useEffect(() => { if (!endNo && isOpen && maxNo > 0) setEndNo(maxNo.toString()); }, [maxNo, isOpen, endNo]);
  if (!isOpen) return null;

  const handleConfirm = () => {
    let start = parseInt(startNo) || 1;
    let end = parseInt(endNo) || maxNo;
    if (start < 1) start = 1; if (end > maxNo) end = maxNo; if (start > end) [start, end] = [end, start];
    const filtered = totalRecords.filter(r => { const id = parseInt(r.id || 0); return id >= start && id <= end; });
    if (filtered.length === 0) { alert('No records found in this range.'); return; }
    onConfirm(filtered); onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-200 border border-gray-300">
          
          <div className="bg-blue-900 px-6 py-4 text-white flex justify-between items-center border-b border-blue-800">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wide flex items-center gap-2">
                <i className="fa-solid fa-print"></i> Print Configuration
              </h3>
              <p className="text-blue-200 text-xs mt-0.5">Select Record Range</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-red-700 cursor-pointer transition"><i className="fa-solid fa-xmark text-lg"></i></button>
          </div>

          <div className="p-6 space-y-5 bg-gray-50">
            <div className="bg-white p-3 rounded border border-gray-200 text-center">
              <p className="text-sm font-bold text-gray-600 uppercase">Total Available Records</p>
              <p className="text-2xl font-bold text-blue-900 font-mono mt-1">{maxNo}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Start ID</label>
                <input type="number" value={startNo} onChange={(e) => setStartNo(e.target.value)}
                  className="w-full px-3 py-2 text-center font-bold border border-gray-300 rounded focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none" placeholder="1" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">End ID</label>
                <input type="number" value={endNo} onChange={(e) => setEndNo(e.target.value)}
                  className="w-full px-3 py-2 text-center font-bold border border-gray-300 rounded focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none" placeholder={maxNo} />
              </div>
            </div>

            {previewCount > 0 && (
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded text-center">
                <p className="text-green-800 text-sm font-medium">Ready to print <span className="font-bold">{previewCount}</span> records.</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="flex-1 py-2 border border-gray-300 cursor-pointer text-gray-700 bg-white rounded font-bold hover:bg-gray-100 transition text-sm uppercase">Cancel</button>
              <button onClick={handleConfirm} className="flex-1 py-2 bg-blue-800 text-white rounded cursor-pointer font-bold hover:bg-blue-900 transition shadow-sm border border-blue-900 flex items-center justify-center gap-2 text-sm uppercase">
                <i className="fa-solid fa-print"></i> Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default PrintRangeModal;