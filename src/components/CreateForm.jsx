// src/components/CreateForm.js
import React, { useState, useEffect, useRef } from 'react';
import { registerFieldGroups, registerTypes } from '../data/registerData';

const CreateForm = ({ selectedRegister, selectedPart, nextConsecutiveNumber, isOpen, onClose, onSubmit }) => {
  
  const initializeFormData = () => {
    const fieldGroups = registerFieldGroups[selectedRegister] || [];
    const initialData = {};
    fieldGroups.forEach(group => {
      group.fields.forEach(field => {
        initialData[field.name] = '';
      });
    });
    return initialData;
  };

  const [formData, setFormData] = useState(initializeFormData());
  const inputRefs = useRef({}); 
  
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    isSuccess: true
  });

  // ---------------------------------------------------------
  // ✅ ADD THIS EFFECT HERE
  // This ensures that when you switch from RECEIVE to ISSUED,
  // the old keys ('from', 'referenceNo') are wiped out.
  // ---------------------------------------------------------
  useEffect(() => {
    if (isOpen) {
      setFormData(initializeFormData());
    }
  }, [selectedRegister, isOpen]); 
  // ---------------------------------------------------------

  // Logic to hide the toast after a delay
  useEffect(() => {
    let timer;
    if (toast.isVisible) {
      timer = setTimeout(() => {
        setToast(prev => ({ ...prev, isVisible: false }));
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [toast.isVisible]);

  const showToast = (message, isSuccess = true) => {
    setToast({ isVisible: true, message, isSuccess });
  };

  const fieldGroups = registerFieldGroups[selectedRegister] || [];
  const allFields = fieldGroups.flatMap(group => group.fields);

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Now this will only contain keys for the current register
    const recordWithDefaults = { 
      id: nextConsecutiveNumber.toString(),
      status: 'Pending',
      ...formData
    };
    
    console.log('Submitting record for', selectedRegister, ':', recordWithDefaults);
    onSubmit(recordWithDefaults);
    
    // Reset and close
    setFormData(initializeFormData());
    onClose();

    showToast(`${selectedRegister.replace(' Register', '')} Record #${nextConsecutiveNumber} created successfully!`);
  };

  const handleClose = () => {
    setFormData(initializeFormData());
    onClose();
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';
    const commonClasses = "w-full px-3 py-2.5 border border-gray-300 rounded-lg transition-all duration-300 bg-white hover:border-slate-400 hover:shadow-sm focus:border-slate-600 focus:shadow-lg focus:shadow-slate-300/50 focus:outline-none";
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            rows={4}
            className={`${commonClasses} resize-none`}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
          />
        );
      case 'select':
        return (
          <div className="relative">
            <select
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={`${commonClasses} appearance-none pr-10 cursor-pointer`} 
            >
              <option value="">Select {field.label}</option>
              {field.options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
              if (el) el.showPicker ? el.showPicker() : el.click();
            }} 
          >
            <input
              ref={el => inputRefs.current[field.name] = el}
              type="date"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              onMouseDown={(e) => e.preventDefault()} 
              className={`${commonClasses} appearance-none pr-10 cursor-pointer select-none`} 
            />
          </div>
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={commonClasses}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={commonClasses}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
          />
        );
    }
  };

  const modalContentJSX = (
    <>
      <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-md z-40"></div>
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="bg-slate-700 px-6 py-4 rounded-t-lg sticky top-0 z-20"> 
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Create {selectedRegister.replace(' Register', '')} Record
                </h2>
                <p className="text-slate-200 text-sm mt-1">
                  Fill in the details below to create a new {selectedRegister.replace(' Register', '').toLowerCase()} record
                </p>
              </div>
              <button onClick={handleClose} className="text-slate-200 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-600 cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Consecutive No.</label>
                <div className="flex items-center space-x-3">
                  <input type="text" value={nextConsecutiveNumber} readOnly className="w-24 px-3 py-2.5 border border-slate-300 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-center" />
                  <span className="text-sm text-slate-600">
                    {selectedRegister === registerTypes.RECEIVE && selectedPart 
                      ? `This will be record #${nextConsecutiveNumber} in ${selectedPart}`
                      : `This will be record #${nextConsecutiveNumber} in ${selectedRegister}`
                    }
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Consecutive number is automatically generated and cannot be edited</p>
              </div>
            </div>

            {fieldGroups.map((group, groupIndex) => (
              <div key={group.title} className="mb-6">
                <h3 className={`text-lg font-semibold text-slate-700 mb-4 pb-2 border-b-2 ${groupIndex > 0 ? 'mt-6 border-slate-200' : 'border-slate-700'}`}>
                  {group.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.fields.map((field) => {
                    const isTextarea = field.type === 'textarea';
                    return (
                      <div key={field.name} className={`space-y-2 ${isTextarea ? 'md:col-span-2' : ''}`}>
                        <label className="block text-sm font-medium text-gray-700">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {renderField(field)}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {allFields.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                 <h3 className="text-base font-medium text-gray-900 mb-2">No form fields configured</h3>
              </div>
            )}
            
            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button type="button" onClick={handleClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">Cancel</button>
              <button type="submit" disabled={allFields.length === 0} className="flex-1 px-4 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors duration-200 font-medium disabled:bg-gray-400">Create Record</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );

  const ToastNotification = () => {
    const baseClasses = "fixed top-5 right-5 max-w-sm w-full shadow-lg rounded-xl pointer-events-auto ring-1 ring-black ring-opacity-5 transition-all duration-500 ease-in-out z-[100] p-4 flex items-center";
    const activeClasses = `opacity-100 translate-x-0 bg-emerald-500 ring-emerald-600`;
    const inactiveClasses = `opacity-0 translate-x-full bg-emerald-500 ring-emerald-600`;

    return (
      <div className={`${baseClasses} ${toast.isVisible ? activeClasses : inactiveClasses}`}>
        <div className="flex-shrink-0"><span className="text-xl">✅</span></div>
        <div className="ml-3 flex-1"><p className="text-sm font-medium text-white">{toast.message}</p></div>
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