// src/components/CreateForm.js
import React, { useState, useEffect, useRef } from 'react';
import { registerFields, registerTypes } from '../data/registerData';

const CreateForm = ({ selectedRegister, selectedPart, nextConsecutiveNumber, isOpen, onClose, onSubmit }) => {
  
  // Initialize formData with empty values for current register fields
  const initializeFormData = () => {
    const fields = registerFields[selectedRegister] || [];
    const initialData = {};
    fields.forEach(field => {
      initialData[field.name] = '';
    });
    return initialData;
  };

  const [formData, setFormData] = useState(initializeFormData());
  const inputRefs = useRef({}); 
  
  // Toast state
  const [toast, setToast] = useState({ isVisible: false, message: '', isSuccess: true });

  // Reset form data when register changes
  useEffect(() => {
    if (isOpen) {
      setFormData(initializeFormData());
    }
  }, [selectedRegister, isOpen]);
  
  // Logic to hide the toast after a delay (2.5 seconds)
  useEffect(() => {
    if (toast.isVisible) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, isVisible: false }));
      }, 2500); // Vanishes after 2.5 seconds
      return () => clearTimeout(timer);
    }
  }, [toast.isVisible]);

  const showToast = (message, isSuccess = true) => {
    setToast({ isVisible: true, message, isSuccess });
  };


  // Get fields for the currently selected register
  const fields = registerFields[selectedRegister] || [];

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create the record with all form data and consecutive number as ID
    const recordWithDefaults = { 
      id: nextConsecutiveNumber.toString(), // Use consecutive number as ID
      status: 'Pending',
      ...formData
    };
    
    console.log('Submitting record for', selectedRegister, ':', recordWithDefaults);
    
    onSubmit(recordWithDefaults);
    
    setFormData(initializeFormData());
    onClose();

    // Show toast notification on successful creation
    showToast(`${selectedRegister.replace(' Register', '')} Record #${nextConsecutiveNumber} created successfully!`);
  };

  const handleClose = () => {
    setFormData(initializeFormData());
    onClose();
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';
    
    // Premium commonClasses 
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
            {/* Custom Arrow Icon */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
              if (el) {
                // Trigger input's native date picker (works on wrapper click)
                el.showPicker ? el.showPicker() : el.click();
              }
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

  // Define modal JSX content structure.
  const modalContentJSX = (
    <>
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-md z-40"></div>
      
      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
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
              <button
                onClick={handleClose}
                className="text-slate-200 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-600 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            

            {/* Consecutive Number Field - Read Only */}
            <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Consecutive No.
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={nextConsecutiveNumber}
                    readOnly
                    className="w-24 px-3 py-2.5 border border-slate-300 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-center"
                  />
                  <span className="text-sm text-slate-600">
                    {selectedRegister === registerTypes.RECEIVE && selectedPart 
                      ? `This will be record #${nextConsecutiveNumber} in ${selectedPart}`
                      : `This will be record #${nextConsecutiveNumber} in ${selectedRegister}`
                    }
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Consecutive number is automatically generated and cannot be edited
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => {
                const isTextarea = field.type === 'textarea';
                
                return (
                  <div 
                    key={field.name} 
                    className={`space-y-2 ${isTextarea ? 'md:col-span-2' : ''}`}
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {renderField(field)}
                    {field.description && (
                      <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Show message if no fields are available */}
            {fields.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-2">No form fields configured</h3>
                <p className="text-gray-600">
                  No form fields are defined for {selectedRegister}. Please check the register configuration.
                </p>
              </div>
            )}
            
            {/* Form Actions */}
            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={fields.length === 0}
                className="flex-1 px-4 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Create Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );

  // Toast Notification Component
  const ToastNotification = () => {
    // Positioned fixed top-5 right-5
    const baseClasses = "fixed top-5 right-5 max-w-sm w-full shadow-lg rounded-xl pointer-events-auto ring-1 ring-black ring-opacity-5 transition-all duration-500 ease-in-out z-[100] p-4 flex items-center";
    
    // Success colors
    const successBg = "bg-emerald-500";
    const successRing = "ring-emerald-600";
    const successText = "text-white";
    const successIcon = "✅";

    // Dynamic classes for right-side animation
    const activeClasses = `opacity-100 translate-x-0 ${successBg} ${successRing}`;
    const inactiveClasses = `opacity-0 translate-x-full ${successBg} ${successRing}`; // Starts off-screen to the right

    return (
      <div 
        aria-live="assertive" 
        className={`${baseClasses} ${toast.isVisible ? activeClasses : inactiveClasses}`}
      >
        <div className="flex-shrink-0">
          <span className="text-xl">{successIcon}</span>
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${successText}`}>
            {toast.message}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Only render the modal content if the `isOpen` prop is true */}
      {isOpen && modalContentJSX}
      
      {/* Toast is always rendered so it can persist after the modal unmounts */}
      <ToastNotification />
    </>
  );
};

export default CreateForm;