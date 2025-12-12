import React, { useState } from 'react';
import { useRegister } from '../context/RegisterContext';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const { users, addUser, updateUser, deleteUser } = useRegister();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Confirm deletion of this authorized user?")) {
      deleteUser(id);
      toast.warning("User access revoked.");
    }
  };

  const openCreateModal = () => { setCurrentUser(null); setIsModalOpen(true); };
  const openEditModal = (user) => { setCurrentUser(user); setIsModalOpen(true); };

  const handleFormSubmit = (formData) => {
    if (currentUser) {
      updateUser(currentUser.id, formData);
      toast.info("User profile updated.");
    } else {
      addUser(formData);
      toast.success("New user authorized.");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden mt-6">
      <div className="px-5 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
        <div>
           <h3 className="text-lg font-bold text-gray-800 uppercase tracking-tight">Authorized Personnel</h3>
           <p className="text-xs text-gray-500 font-medium">Manage System Access</p>
        </div>
        <button onClick={openCreateModal} className="px-4 py-2 bg-blue-800 text-white text-xs font-bold uppercase rounded shadow hover:bg-blue-900 transition flex items-center gap-2 cursor-pointer border border-blue-900">
          <i className="fa-solid fa-user-plus"></i> Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300 text-xs font-bold uppercase text-gray-600 bg-gray-50">
              <th className="px-5 py-3 border-r border-gray-200">Name</th>
              <th className="px-5 py-3 border-r border-gray-200">Email / ID</th>
              <th className="px-5 py-3 border-r border-gray-200">Password Key</th>
              <th className="px-5 py-3 text-center border-r border-gray-200">Role</th>
              <th className="px-5 py-3 text-center border-r border-gray-200">Registered</th>
              <th className="px-5 py-3 text-center">Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
            {users.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-6 text-center text-gray-500 italic">No users found</td></tr>
            ) : (
                users.map(user => (
                <tr key={user.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-5 py-3 font-bold border-r border-gray-200">{user.name}</td>
                    <td className="px-5 py-3 text-gray-600 font-mono text-xs border-r border-gray-200">{user.email}</td>
                    <td className="px-5 py-3 border-r border-gray-200"><PasswordCell password={user.password} /></td>
                    <td className="px-5 py-3 text-center border-r border-gray-200">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border
                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-blue-100 text-blue-800 border-blue-300'}
                        `}>
                            {user.role}
                        </span>
                    </td>
                    <td className="px-5 py-3 text-center text-gray-500 text-xs font-mono border-r border-gray-200">{user.joined}</td>
                    <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-3">
                        <button onClick={() => openEditModal(user)} className="text-gray-500 hover:text-blue-700 transition cursor-pointer" title="Edit">
                            <i className="fa-solid fa-pen"></i>
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="text-gray-500 hover:text-red-600 transition cursor-pointer" title="Revoke">
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && <UserFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleFormSubmit} initialData={currentUser} />}
    </div>
  );
};

const PasswordCell = ({ password }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div onClick={() => setIsVisible(!isVisible)} className="group flex items-center gap-2 cursor-pointer w-fit px-2 py-1 rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200" title="Click to reveal">
            <span className={`font-mono text-xs ${isVisible ? 'text-blue-900 font-bold' : 'text-gray-400 tracking-widest'}`}>
                {isVisible ? password : '••••••••'}
            </span>
            <span className="text-gray-400 group-hover:text-gray-600 text-xs">
                <i className={`fa-solid ${isVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </span>
        </div>
    );
};

const UserFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '', email: initialData?.email || '', password: initialData?.password || '', role: initialData?.role || 'editor', 
    });
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
             <div className="bg-white w-full max-w-md rounded shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 border border-gray-400">
                <div className="bg-blue-900 px-6 py-3 flex justify-between items-center border-b border-blue-800">
                    <h3 className="text-white font-bold text-base uppercase tracking-wide">{initialData ? 'Update Profile' : 'Authorize User'}</h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-6 space-y-4 bg-gray-50">
                    {['name', 'email', 'password'].map((field) => (
                        <div key={field}>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{field}</label>
                            <input required type={field === 'password' ? 'text' : field === 'email' ? 'email' : 'text'}
                                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-gray-900 placeholder-gray-400"
                                value={formData[field]} onChange={e => setFormData({...formData, [field]: e.target.value})} placeholder={`Enter ${field}...`}
                            />
                        </div>
                    ))}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Authorization Level</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-blue-600 text-gray-900"
                            value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                            <option value="editor">Editor (Standard)</option>
                            <option value="admin">Admin (Full Control)</option>
                        </select>
                    </div>
                    <div className="pt-2 flex gap-3 border-t border-gray-200 mt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2 border border-gray-300 text-gray-700 font-bold rounded hover:bg-gray-100 transition text-sm">Cancel</button>
                        <button type="submit" className="flex-1 py-2 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded shadow transition-all text-sm border border-blue-900">Confirm</button>
                    </div>
                </form>
             </div>
        </div>
    );
};

export default UserManagement;