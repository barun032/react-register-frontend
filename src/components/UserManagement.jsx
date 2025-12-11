// src/components/UserManagement.jsx
import React, { useState } from 'react';
import { useRegister } from '../context/RegisterContext';

const UserManagement = () => {
  const { users, addUser, updateUser, deleteUser } = useRegister();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // null = create mode, object = edit mode

  // --- HANDLERS ---
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
    }
  };

  const openCreateModal = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (currentUser) {
      updateUser(currentUser.id, formData);
    } else {
      addUser(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
           <h3 className="text-lg font-bold text-gray-800">User Management</h3>
           <p className="text-sm text-gray-500">Manage system access and roles</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="px-4 py-2 bg-slate-800 cursor-pointer text-white text-sm font-semibold rounded-lg hover:bg-slate-900 transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-500 bg-white">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              {/* 1. New Column Header */}
              <th className="px-6 py-4">Password</th>
              <th className="px-6 py-4 text-center">Role</th>
              <th className="px-6 py-4 text-center">Joined Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
            {users.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">No users found.</td></tr>
            ) : (
                users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    
                    {/* 2. New Password Cell Component */}
                    <td className="px-6 py-4">
                        <PasswordCell password={user.password} />
                    </td>

                    <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wide
                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-700'}
                        `}>
                            {user.role}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500">{user.joined}</td>
                    <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                        <button 
                            onClick={() => openEditModal(user)}
                            className="text-gray-400 hover:text-blue-600 transition cursor-pointer"
                            title="Edit"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button 
                            onClick={() => handleDelete(user.id)}
                            className="text-gray-400 hover:text-rose-600 transition cursor-pointer"
                            title="Delete"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <UserFormModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleFormSubmit}
            initialData={currentUser}
        />
      )}
    </div>
  );
};

// 3. Helper Component for Password Toggle
const PasswordCell = ({ password }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div 
            onClick={() => setIsVisible(!isVisible)}
            className="group flex items-center gap-2 cursor-pointer w-fit p-1 rounded hover:bg-gray-100 transition-colors"
            title={isVisible ? "Click to hide" : "Click to show password"}
        >
            <span className={`font-mono text-sm ${isVisible ? 'text-gray-800' : 'text-gray-400 tracking-widest'}`}>
                {isVisible ? password : '••••••••'}
            </span>
            <span className="text-gray-400 group-hover:text-gray-600">
                {isVisible ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
            </span>
        </div>
    );
};

// Sub-component for the Form Modal
const UserFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        email: initialData?.email || '',
        password: initialData?.password || '', // 4. Added password to state
        role: initialData?.role || 'editor', 
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose} />
             
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-slate-800 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">
                        {initialData ? 'Edit User' : 'Add New User'}
                    </h3>
                    <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input 
                            required
                            type="email" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            placeholder="e.g. john@example.com"
                        />
                    </div>
                    
                    {/* 5. Password Field in Form */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            required
                            type="text" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            placeholder="Enter password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition bg-white"
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Admins can manage users and system settings.</p>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border cursor-pointer border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 px-4 py-2 bg-slate-800 cursor-pointer text-white font-medium rounded-lg hover:bg-slate-900 transition"
                        >
                            {initialData ? 'Save Changes' : 'Create User'}
                        </button>
                    </div>
                </form>
             </div>
        </div>
    );
};

export default UserManagement;