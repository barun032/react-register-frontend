import React, { useState, useEffect, useRef } from 'react';
import { registerFields, registerTypes } from '../data/registerData';
import { toast } from 'react-toastify';

const CreateForm = ({ selectedRegister, selectedPart, nextConsecutiveNumber, isOpen, onClose, onSubmit, initialData = null, mode = "create" }) => {

  const initializeFormData = () => {
    const fields = registerFields[selectedRegister] || [];
    const initData = {};
    fields.forEach(field => { initData[field.name] = ''; });
    return initData;
  };
  const [formData, setFormData] = useState(initialData || initializeFormData());
  const inputRefs = useRef({});

  useEffect(() => { if (isOpen) document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = 'auto'; }; }, [isOpen]);
  useEffect(() => { setFormData(initialData || initializeFormData()); }, [initialData, selectedRegister]);

  const handleInputChange = (fieldName, value) => { setFormData(prev => ({ ...prev, [fieldName]: value })); };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (mode === 'create') setFormData(initializeFormData());
    onClose();
    mode === "edit" ? toast.info(`Record #${nextConsecutiveNumber} modified.`) : toast.success("Record saved to database.");
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';
    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 text-sm focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition-all placeholder-gray-400";
    
    if (field.type === 'textarea') return <textarea name={field.name} value={value} onChange={(e) => handleInputChange(field.name, e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder={`Enter ${field.label}...`} />;
    if (field.type === 'select') return (
      <div className="relative">
        <select name={field.name} value={value} onChange={(e) => handleInputChange(field.name, e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
          <option value="">Select Option</option>
          {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">▼</div>
      </div>
    );
    if (field.type === 'date') return (
        <div className='relative cursor-pointer' onClick={() => inputRefs.current[field.name]?.showPicker()}>
            <input ref={el => inputRefs.current[field.name] = el} name={field.name} type="date" value={value} onChange={(e) => handleInputChange(field.name, e.target.value)} className={`${inputClass} cursor-pointer`} />
        </div>
    );
    return <input name={field.name} type={field.type === 'number' ? 'number' : 'text'} value={value} onChange={(e) => handleInputChange(field.name, e.target.value)} className={inputClass} placeholder={`Enter ${field.label}...`} />;
  };

  const fields = registerFields[selectedRegister] || [];

  return (
    isOpen && (
      <>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col rounded shadow-2xl overflow-hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-300 border border-gray-400">
            
            {/* Modal Header */}
            <div className="bg-gray-100 px-8 py-4 border-b border-gray-300 shrink-0 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-blue-900 uppercase tracking-wide flex items-center gap-2">
                  <i className="fa-solid fa-file-pen"></i> {mode === 'edit' ? 'Modify Record' : 'New Record Entry'}
                </h2>
                <p className="text-gray-500 text-xs mt-0.5">Official Use Only</p>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-red-600 transition-colors cursor-pointer text-xl"><i className="fa-solid fa-xmark"></i></button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-8 custom-scrollbar bg-gray-50">
              <form onSubmit={handleSubmit}>
                <div className="mb-6 p-4 rounded border border-blue-200 bg-blue-50 flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-blue-800 uppercase">Consecutive Number</label>
                    <p className="text-[10px] text-blue-600 mt-1">SYSTEM GENERATED</p>
                  </div>
                  <div className="text-3xl font-mono font-bold text-blue-900 bg-white px-4 py-1 rounded border border-blue-200">
                    {nextConsecutiveNumber}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {fields.map((field) => (
                    <div key={field.name} className={`space-y-1 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                      <label className="block text-xs font-bold text-gray-700 uppercase">{field.label} {field.required && <span className="text-red-600">*</span>}</label>
                      {renderField(field)}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200">
                  <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-300 text-gray-700 bg-white rounded font-bold hover:bg-gray-100 transition shadow-sm text-sm uppercase">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-blue-800 text-white rounded font-bold hover:bg-blue-900 transition-all shadow border border-blue-900 flex items-center justify-center gap-2 text-sm uppercase">
                    <i className="fa-solid fa-save"></i> Save Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    )
  );
};
export default CreateForm;