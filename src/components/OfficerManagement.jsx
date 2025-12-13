// src/components/OfficerManagement.jsx
import React, { useState } from 'react';
import { useRegister } from '../context/RegisterContext';
import { toast } from 'react-toastify';

const OfficerManagement = () => {
  const { officers, addOfficer, deleteOfficer } = useRegister();
  const [newOfficer, setNewOfficer] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newOfficer.trim()) return;
    addOfficer(newOfficer.trim());
    setNewOfficer('');
    toast.success("Officer added to system.");
  };

  const handleDelete = (name) => {
    if (window.confirm(`Remove "${name}" from the active list?`)) {
      deleteOfficer(name);
      toast.warning("Officer removed.");
    }
  };

  return (
    <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden mt-6">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
        <div>
           <h3 className="text-lg font-bold text-gray-800 uppercase tracking-tight">Officer Designation</h3>
           <p className="text-xs text-gray-500 font-medium">Manage Dropdown Options</p>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Add Form */}
        <div className="md:col-span-1 bg-blue-50 p-4 rounded border border-blue-100 h-fit">
            <h4 className="text-xs font-bold text-blue-900 uppercase mb-3 border-b border-blue-200 pb-2">Add New Officer</h4>
            <form onSubmit={handleAdd} className="space-y-3">
                <input 
                    type="text" 
                    placeholder="e.g. SI John Doe"
                    className="w-full px-3 py-2 border border-blue-300 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 text-gray-900"
                    value={newOfficer}
                    onChange={(e) => setNewOfficer(e.target.value)}
                />
                <button 
                    type="submit" 
                    className="w-full py-2 bg-blue-800 text-white text-xs font-bold uppercase rounded shadow hover:bg-blue-900 transition border border-blue-900 cursor-pointer"
                >
                    <i className="fa-solid fa-plus mr-1"></i> Add to List
                </button>
            </form>
        </div>

        {/* Right Side: List */}
        <div className="md:col-span-2">
            <h4 className="text-xs font-bold text-gray-600 uppercase mb-3">Active Personnel List</h4>
            <div className="overflow-hidden border border-gray-200 rounded">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50">
                        <tr className="border-b border-gray-200 text-[10px] font-bold uppercase text-gray-500">
                            <th className="px-4 py-2">Officer Name</th>
                            <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {officers.length === 0 ? (
                            <tr><td colSpan="2" className="px-4 py-4 text-center text-gray-400 italic">No officers defined.</td></tr>
                        ) : (
                            officers.map((officer, idx) => (
                                <tr key={idx} className="group hover:bg-gray-50 transition">
                                    <td className="px-4 py-2 text-gray-800 font-medium">{officer}</td>
                                    <td className="px-4 py-2 text-right">
                                        <button 
                                            onClick={() => handleDelete(officer)}
                                            className="text-gray-400 hover:text-red-600 transition cursor-pointer px-2"
                                            title="Remove"
                                        >
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
};

export default OfficerManagement;