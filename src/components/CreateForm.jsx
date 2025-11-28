// src/components/CreateForm.js
import React, { useState } from 'react';
import { registerFields, registerTypes } from '../data/registerData';

const registerFieldGroups = {
  [registerTypes.RECEIVE]: [
    'date', 'from', 'referenceNo', 'referenceDate', 'subject',
    'reminderNumber', 'reminderDate', 'fileNo', 'serialNo', 
    'collectionNumber', 'fileInCollection', 'actionType',
    'dispatchMemoNo', 'dispatchDate', 'endorsedTo'
  ],
  [registerTypes.ISSUED]: [
    'date', 'to', 'subject', 'fileSerialNo', 'collectionTitle', 
    'fileInCollection', 'replyDetails', 'receiveRef', 'reminderNumber', 
    'reminderDate', 'stampRupees', 'stampPaise', 'remarks', 'officerName'
  ]
};

const CreateForm = ({ selectedRegister, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const fields = registerFields[selectedRegister] || [];
  const fieldOrder = registerFieldGroups[selectedRegister] || [];

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = `REG-${Date.now()}`;
    const recordWithDefaults = { 
      status: 'Pending', 
      ...formData, 
      id 
    };
    onSubmit(recordWithDefaults);
    setFormData({});
    onClose();
  };

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  const getFieldByName = (fieldName) => {
    return fields.find(field => field.name === fieldName);
  };

  const renderField = (field, value) => {
    const commonClasses = "w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-white";
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            rows={4}
            className={`${commonClasses} resize-none`}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
          />
        );
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`${commonClasses} appearance-none bg-white`}
          >
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={commonClasses}
          />
        );
      default:
        return (
          <input
            type={field.type}
            value={value || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={commonClasses}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
          />
        );
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-md z-40"></div>
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-slate-700 px-6 py-4 rounded-t-lg sticky top-0">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Create {selectedRegister.replace(' Register', '')} Record
                </h2>
                <p className="text-slate-200 text-sm mt-1">
                  Fill in the details below to create a new record
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-slate-200 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fieldOrder.map((fieldName) => {
                const field = getFieldByName(fieldName);
                if (!field) return null;

                const isTextarea = field.type === 'textarea';
                
                return (
                  <div 
                    key={field.name} 
                    className={`space-y-2 ${isTextarea ? 'md:col-span-2' : ''}`}
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    {renderField(field, formData[field.name])}
                    {field.description && (
                      <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
            
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
                className="flex-1 px-4 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200 font-medium"
              >
                Create Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateForm;