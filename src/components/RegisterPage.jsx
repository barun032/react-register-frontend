import React, { useState } from 'react';
import { registerTypes } from '../data/registerData';
import { useRegister } from '../context/RegisterContext';
import Header from './Header'; // Adjust path if needed
import StatusCards from './StatusCards';
import RecordTable from './RecordTable';
import CreateForm from './CreateForm';
import PrintView from './PrintView';
import PrintRangeModal from './PrintRangeModal';
import Footer from './Footer';

// This component now holds the logic that used to be in App.jsx
const RegisterPage = () => {
  const {
    selectedRegister,
    selectedPart,
    currentRecords,
    addNewRecord,
    updateRecord,
    getNextConsecutiveNumber
  } = useRegister();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isPrintRangeModalOpen, setIsPrintRangeModalOpen] = useState(false);
  const [recordsToPrint, setRecordsToPrint] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrintClick = () => setIsPrintRangeModalOpen(true);

  const handlePrintRange = (selectedRecords) => {
    setRecordsToPrint(selectedRecords);
    setIsPrinting(true);
    setIsPrintRangeModalOpen(false);
  };

  const closePrintView = () => {
    setIsPrinting(false);
    setRecordsToPrint([]);
  };

  const handleFormSubmit = (formData) => {
    if (editingRecord) {
      updateRecord(selectedRegister, selectedPart, editingRecord.id, formData);
    } else {
      addNewRecord(formData);
    }
    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const handleCreateClick = () => {
    setEditingRecord(null);
    setIsFormOpen(true);
  };
  
  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  if (isPrinting) {
    return (
      <PrintView
        selectedRegister={selectedRegister}
        selectedPart={selectedRegister === registerTypes.RECEIVE ? selectedPart : null}
        records={recordsToPrint}
        onClose={closePrintView}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header handles navigation now */}
      <Header onCreateClick={handleCreateClick} />

      <main className="max-w-7xl mx-auto w-full flex-grow">
        <StatusCards />
        <RecordTable onPrint={handlePrintClick} onEdit={handleEditRecord} />
      </main>

      <Footer />

      <CreateForm
        selectedRegister={selectedRegister}
        selectedPart={selectedPart}
        nextConsecutiveNumber={editingRecord ? editingRecord.id : getNextConsecutiveNumber()}
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingRecord(null) }}
        onSubmit={handleFormSubmit}
        initialData={editingRecord}
        mode={editingRecord ? "edit" : "create"}
      />

      <PrintRangeModal
        isOpen={isPrintRangeModalOpen}
        onClose={() => setIsPrintRangeModalOpen(false)}
        totalRecords={currentRecords}
        onConfirm={handlePrintRange}
      />
    </div>
  );
};

export default RegisterPage;