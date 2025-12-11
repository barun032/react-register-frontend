// src/App.jsx
import React, { useState } from 'react';
import { registerTypes } from './data/registerData';
import { useRegister } from './context/RegisterContext';

import Header from './components/Header';
import StatusCards from './components/StatusCards';
import RecordTable from './components/RecordTable';
import CreateForm from './components/CreateForm';
import PrintView from './components/PrintView';
import PrintRangeModal from './components/PrintRangeModal';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';

function App() {
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
  const [viewMode, setViewMode] = useState('register');

  const [isPrintRangeModalOpen, setIsPrintRangeModalOpen] = useState(false);
  const [recordsToPrint, setRecordsToPrint] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrintClick = () => setIsPrintRangeModalOpen(true);

  const handlePrintRange = (selectedRecords) => {
    setRecordsToPrint(selectedRecords);
    setIsPrinting(true);
    setIsPrintRangeModalOpen(false); // Close the modal
  };

  const closePrintView = () => {
    setIsPrinting(false);
    setRecordsToPrint([]);
  };

  const handleFormSubmit = (formData) => {
    if (editingRecord) {
      // EDIT MODE
      updateRecord(
        selectedRegister,
        selectedPart,
        editingRecord.id,   // ✅ use id, not consecutiveNo
        formData
      );
    } else {
      // CREATE MODE
      addNewRecord(formData);
    }

    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const handleCreateClick = () => {
    setEditingRecord(null);     // we are creating, not editing
    setIsFormOpen(true);
  };
  const handleEditRecord = (record) => {
    setEditingRecord(record);   // store row data
    setIsFormOpen(true);        // open the form
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

  if (viewMode === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminDashboard onClose={() => setViewMode('register')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCreateClick={handleCreateClick}
        onDashboardClick={() => setViewMode('dashboard')}
      />

      <main className="max-w-7xl mx-auto">
        <StatusCards />

        <RecordTable
          onPrint={handlePrintClick}
          onEdit={handleEditRecord}
        />
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
}

export default App;