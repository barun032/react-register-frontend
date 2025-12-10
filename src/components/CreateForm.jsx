// src/components/CreateForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { registerFields, registerTypes } from '../data/registerData';

const CreateForm = ({ selectedRegister, selectedPart, nextConsecutiveNumber, isOpen, onClose, onSubmit, initialData = null, mode = "create" }) => {

  // --- LOGIC SECTION ---
  const initializeFormData = () => {
    const fields = registerFields[selectedRegister] || [];
    const initialData = {};
    fields.forEach(field => {
      initialData[field.name] = '';
    });
    return initialData;
  };

  const emptyForm = { /* your default empty fields */ };
  const [formData, setFormData] = useState(initialData || emptyForm);

  const inputRefs = useRef({});
  const [toast, setToast] = useState({ isVisible: false, message: '', isSuccess: true });

  useEffect(() => {
  if (isOpen) {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // cleanup when modal closes or component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }
}, [isOpen]);

  useEffect(() => {
    setFormData(initialData || emptyForm);
  }, [initialData, selectedRegister, selectedPart]);

  useEffect(() => {
    if (toast.isVisible) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, isVisible: false }));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toast.isVisible]);

  const showToast = (message, isSuccess = true) => {
    setToast({ isVisible: true, message, isSuccess });
  };

  const fields = registerFields[selectedRegister] || [];

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "edit") {
      // 🔁 EDIT MODE: just send changed fields
      onSubmit(formData);
      onClose();
      showToast(`Record #${nextConsecutiveNumber} updated successfully!`);
    } else {
      // ➕ CREATE MODE: let context assign id & status
      onSubmit(formData);
      setFormData(initializeFormData());
      onClose();
      showToast(`${selectedRegister.replace(' Register', '')} Record created successfully!`);
    }
  };


  const handleClose = () => {
    setFormData(initializeFormData());
    onClose();
  };

  // 1. DEFINED PRESETS HERE - Keys match 'name' in registerData.js
  const fieldPresets = {
    to: [
      "To\nThe Director of Information\nDepartment of Information & Cultural Affairs\nGovt. of West Bengal\nNabanna, 9th Floor\n325, Sarat Chatterjee Road,\nMandirtala, Shibpur\nHowrah-711102",
      "To\nThe Deputy Director General (Engg.)\nAkashvani Kolkata\nAkashvani Bhavan\nGostho Paul Sarani, near Eden Gardens,\nKolkata-700001",
      "To\nThe Deputy Director General (Engg.)\nDoordarshan Kendra, Kolkata\nDoordarshan Bhavan,\n18/3, Uday Sankar Sarani,\nGolf Green,\nKolkata-700095",
    ],
    subject: [
      "Forwarding Letter/Challan for Memo No(s) .......................... /MPB to .......................... /MPB for wide publication of the information of missing/recoverd person(s) / un-identified dead body(s) through News Papers/Doordarshan Kendra Kolkata/Akashvani Kolkata",
      "Information of missing/recovered person/un-idenfied dead body.......................for wide publication through News Papers/Doordarshan Kendra Kolkata/Akashvani Kolkata",
      "Ditto for missing/recovered person/un-identified dead body..................................."
    ],
  };

  // --- STYLING SECTION ---

  const renderField = (field) => {
    const value = formData[field.name] || '';
    const commonClasses = "w-full px-4 py-3 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-slate-600 focus:ring-4 focus:ring-slate-100 transition-all outline-none placeholder-gray-400";

    // 2. CONDITIONAL CHECK: Only assign presets if the register is DISPATCH (ISSUED)
    const isDispatchRegister = selectedRegister === registerTypes.ISSUED;

    // Only look up presets if it's the Dispatch Register
    const presets = isDispatchRegister ? fieldPresets[field.name] : null;

    // 3. Reusable Preset Buttons Component (No change inside this function)
    const renderPresetButtons = () => {
      if (!presets) return null;
      return (
        <div className="flex flex-wrap gap-2 mb-2">
          {presets.map((text, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                handleInputChange(field.name, text);
                // Logic to auto-focus the input after clicking
                setTimeout(() => {
                  const el = document.querySelector(`[name="${field.name}"]`) ||
                    document.querySelector(`textarea[name="${field.name}"]`);
                  if (el) el.focus();
                }, 50);
              }}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200
                ${value === text
                  ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400'
                }
              `}
            >
              {text.length > 40 ? text.substring(0, 37) + '...' : text}
            </button>
          ))}
        </div>
      );
    };

    switch (field.type) {
      case 'textarea':
        return (
          <div className="space-y-1">
            {/* Render presets above textarea */}
            {renderPresetButtons()}
            <textarea
              name={field.name}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              rows={3}
              className={`${commonClasses} resize-none`}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
            />
          </div>
        );

      // ... (case 'select' and case 'date' remain the same)

      case 'select':
        return (
          <div className="relative">
            <select
              name={field.name}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={`${commonClasses} appearance-none pr-10 cursor-pointer`}
            >
              <option value="">Select {field.label}</option>
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        );

      case 'date':
        return (
          <div
            className="relative"
            onClick={() => {
              const el = inputRefs.current[field.name];
              if (el) (el.showPicker ? el.showPicker() : el.click());
            }}
          >
            <input
              ref={el => inputRefs.current[field.name] = el}
              name={field.name}
              type="date"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={`${commonClasses} appearance-none cursor-pointer`}
            />
          </div>
        );

      case 'number':
        return (
          <input
            name={field.name}
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={commonClasses}
            placeholder={`0`}
          />
        );

      default:
        // Standard Text Input (handles 'to', etc.)
        return (
          <div className="space-y-1">
            {/* Render presets above input */}
            {renderPresetButtons()}

            <input
              name={field.name}
              type="text"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={commonClasses}
              placeholder={
                presets
                  ? 'Click a preset above or type your own...'
                  : `Enter ${field.label.toLowerCase()}...`
              }
            />
          </div>
        );
    }
  };

  // --- MODAL JSX ---
  const modalContentJSX = (
    <>
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm z-50 transition-all duration-300"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-300">

          {/* Header */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-8 py-6 text-white shrink-0">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">📝</span>
                  {mode === 'edit' ? 'Update Record' : 'Create Record'}
                </h2>
                <p className="text-slate-200 text-sm mt-1 ml-1">
                  {mode === 'edit' ? 'Updating' : 'Add new'} entry to {selectedRegister}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-2 transition cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable Form Content */}
          <div className="overflow-y-auto p-8 custom-scrollbar">
            <form onSubmit={handleSubmit}>

              {/* Consecutive Number Display */}
              <div className="mb-8 p-5 bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Consecutive No.
                  </label>
                  <p className="text-xs text-slate-500 mt-1">
                    Auto-generated ID
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <span className="block text-xs font-semibold text-slate-400 uppercase">{selectedRegister}</span>
                    {selectedPart && <span className="block text-[12px] font-bold text-slate-300 bg-slate-600 px-2 py-0.5 rounded-full mt-1">{selectedPart}</span>}
                  </div>
                  <div className="w-20 h-12 flex items-center justify-center bg-white border-2 border-slate-300 rounded-lg text-2xl font-bold text-slate-800 shadow-sm">
                    {nextConsecutiveNumber}
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field) => {
                  const isTextarea = field.type === 'textarea';
                  return (
                    <div
                      key={field.name}
                      className={`space-y-2 ${isTextarea ? 'md:col-span-2' : ''}`}
                    >
                      <label className="block text-sm font-semibold text-gray-700 ml-1">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      {renderField(field)}
                      {field.description && (
                        <p className="text-xs text-gray-500 ml-1">{field.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Empty State */}
              {fields.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-3">⚠️</div>
                  <h3 className="text-lg font-medium text-gray-900">No fields configured</h3>
                  <p>Please check the register configuration.</p>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex gap-4 pt-8 mt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={fields.length === 0}
                  className="flex-1 py-3.5 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-xl font-bold hover:from-slate-800 hover:to-black transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>{mode === 'edit' ? 'Update Record' : 'Create Record'}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );

  const ToastNotification = () => {
    const baseClasses = "fixed top-5 right-5 max-w-sm w-full shadow-lg rounded-xl pointer-events-auto ring-1 ring-black ring-opacity-5 transition-all duration-500 ease-in-out z-[100] p-4 flex items-center";
    const activeClasses = `opacity-100 translate-x-0 bg-emerald-500 ring-emerald-600 text-white`;
    const inactiveClasses = `opacity-0 translate-x-full bg-emerald-500 ring-emerald-600`;

    return (
      <div className={`${baseClasses} ${toast.isVisible ? activeClasses : inactiveClasses}`}>
        <span className="text-xl mr-3">✅</span>
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
    );
  };

  return (
    <>
      {isOpen && modalContentJSX}
      <ToastNotification />
    </>
  );
};

export default CreateForm;