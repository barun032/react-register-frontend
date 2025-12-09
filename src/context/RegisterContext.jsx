// src/context/RegisterContext.jsx
import React, { createContext, useContext, useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { registerTypes, receivePartTypes, statusTypes } from '../data/registerData';

const RegisterContext = createContext();

export const RegisterProvider = ({ children }) => {
  const [allRecords, setAllRecords] = useLocalStorage('onlineRegister', {
    [registerTypes.RECEIVE]: {
      [receivePartTypes.PART_I]: [],
      [receivePartTypes.PART_II]: [],
      [receivePartTypes.PART_III]: [],
      [receivePartTypes.PART_IV]: []
    },
    [registerTypes.ISSUED]: []
  });
  
  const [selectedRegister, setSelectedRegister] = useState(registerTypes.RECEIVE);
  const [selectedPart, setSelectedPart] = useState(receivePartTypes.PART_I);

  const handleRegisterChange = (register) => {
    setSelectedRegister(register);
    if (register === registerTypes.RECEIVE) {
      setSelectedPart(receivePartTypes.PART_I);
    }
  };

  const currentRecords = useMemo(() => {
    // FIX for the register switch error: 
    // Explicitly check for RECEIVE to access nested parts.
    if (selectedRegister === registerTypes.RECEIVE) {
      return allRecords[registerTypes.RECEIVE]?.[selectedPart] || [];
    } 
    return allRecords[selectedRegister] || [];
  }, [allRecords, selectedRegister, selectedPart]);

  const getNextConsecutiveNumber = () => {
    const records = currentRecords;
    const maxId = records.reduce((max, r) => Math.max(max, parseInt(r.id || 0)), 0);
    return maxId + 1;
  };

  const addNewRecord = (formData) => {
    const newRecordId = getNextConsecutiveNumber();
    const newRecord = {
      id: newRecordId,
      status: statusTypes.PENDING,
      date: formData.date || new Date().toISOString().split('T')[0],
      ...formData
    };

    setAllRecords(prev => {
      const updated = { ...prev, [registerTypes.RECEIVE]: { ...prev[registerTypes.RECEIVE] } };

      if (selectedRegister === registerTypes.RECEIVE) {
        const currentPartList = updated[registerTypes.RECEIVE][selectedPart] || [];
        updated[registerTypes.RECEIVE][selectedPart] = [...currentPartList, newRecord];
      }
      else if (selectedRegister === registerTypes.ISSUED) {
        const currentIssuedList = updated[registerTypes.ISSUED] || [];
        updated[registerTypes.ISSUED] = [...currentIssuedList, newRecord];

        // Update linked Receive Record
        const refPart = formData.receiveRefPart;
        const refNo = String(formData.receiveRefNo || '').trim();

        if (refPart && refNo) {
           const partRecords = [...(updated[registerTypes.RECEIVE][refPart] || [])];
           const idx = partRecords.findIndex(r => String(r.id).trim() === refNo);

           if (idx !== -1) {
             partRecords[idx] = {
               ...partRecords[idx],
               dispatchMemoNo: String(newRecordId),
               dispatchDate: newRecord.date,
               status: statusTypes.COMPLETED
             };
             updated[registerTypes.RECEIVE][refPart] = partRecords;
           }
        }
      }
      return updated;
    });
  };

  const value = {
    selectedRegister,
    selectedPart,
    currentRecords,
    setSelectedRegister: handleRegisterChange,
    setSelectedPart,
    addNewRecord,
    getNextConsecutiveNumber
  };

  return <RegisterContext.Provider value={value}>{children}</RegisterContext.Provider>;
};

export const useRegister = () => {
    const context = useContext(RegisterContext);
    if (!context) throw new Error("useRegister must be used within RegisterProvider");
    return context;
};