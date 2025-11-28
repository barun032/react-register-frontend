// src/App.js
import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { registerTypes } from './data/registerData';
import Header from './components/Header';
import StatusCards from './components/StatusCards';
import RecordTable from './components/RecordTable';
import CreateForm from './components/CreateForm';
import PrintView from './components/PrintView';

function App() {
  const [selectedRegister, setSelectedRegister] = useState(registerTypes.DISPATCH);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPrintView, setIsPrintView] = useState(false);
  
  const [allRecords, setAllRecords] = useLocalStorage('onlineRegister', {
    [registerTypes.DISPATCH]: [],
    [registerTypes.RECEIVE]: [],
    [registerTypes.ISSUED]: []
  });

  const currentRecords = allRecords[selectedRegister] || [];

  const handleCreateRecord = (newRecord) => {
    setAllRecords(prev => ({
      ...prev,
      [selectedRegister]: [...prev[selectedRegister], newRecord]
    }));
  };

  const handleRegisterChange = (register) => {
    setSelectedRegister(register);
  };

  const handlePrint = () => {
    setIsPrintView(true);
  };

  const closePrintView = () => {
    setIsPrintView(false);
  };

  if (isPrintView) {
    return (
      <PrintView
        selectedRegister={selectedRegister}
        records={currentRecords}
        onClose={closePrintView}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        selectedRegister={selectedRegister}
        onRegisterChange={handleRegisterChange}
        onCreateClick={() => setIsFormOpen(true)}
      />

      <main className="max-w-7xl mx-auto">
        <StatusCards 
          records={currentRecords} 
          selectedRegister={selectedRegister}
        />
        
        <RecordTable
          selectedRegister={selectedRegister}
          records={currentRecords}
          onPrint={handlePrint}
        />
      </main>
      
      <CreateForm
        selectedRegister={selectedRegister}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateRecord}
      />
    </div>
  );
}

export default App;