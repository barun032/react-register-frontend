// src/context/RegisterContext.jsx
import React, { createContext, useContext, useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { registerTypes, receivePartTypes, statusTypes } from '../data/registerData';

const RegisterContext = createContext();

export const RegisterProvider = ({ children }) => {

    // 1. User State (Default Admin User)
    const [users, setUsers] = useLocalStorage('appUsers', [
        { 
            id: 1, 
            name: 'Admin User', 
            email: 'admin@gmail.com', 
            password: 'admin', 
            role: 'admin', 
            joined: new Date().toISOString().split('T')[0] 
        }
    ]);

    // 2. Current User Session
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = sessionStorage.getItem('currentUser');
        return saved ? JSON.parse(saved) : null;
    });

    // 3. Login Function
    const login = (email, password) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            setCurrentUser(user);
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true, role: user.role };
        } else {
            return { success: false, message: 'Invalid email or password' };
        }
    };

    // 4. Logout Function
    const logout = () => {
        setCurrentUser(null);
        sessionStorage.removeItem('currentUser');
    };

    
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

                // Update linked Receive Record logic
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

    const updateRecord = (registerType, part, id, updatedFields) => {
         setAllRecords(prev => {
            const copy = { ...prev };
            if (registerType === registerTypes.RECEIVE) {
                const list = [...copy[registerTypes.RECEIVE][part]];
                const index = list.findIndex(r => String(r.id) === String(id));
                if (index === -1) return prev;
                list[index] = { ...list[index], ...updatedFields };
                copy[registerTypes.RECEIVE][part] = list;
            }
            if (registerType === registerTypes.ISSUED) {
                const list = [...copy[registerTypes.ISSUED]];
                const index = list.findIndex(r => String(r.id) === String(id));
                if (index === -1) return prev;
                list[index] = { ...list[index], ...updatedFields };
                copy[registerTypes.ISSUED] = list;
            }
            return copy;
        });
    };

    const addUser = (userData) => {
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        const newUser = { 
            id: newId, 
            joined: new Date().toISOString().split('T')[0],
            ...userData 
        };
        setUsers([...users, newUser]);
    };

    const updateUser = (id, updatedData) => {
        setUsers(users.map(user => user.id === id ? { ...user, ...updatedData } : user));
    };

    const deleteUser = (id) => {
        setUsers(users.filter(user => user.id !== id));
    };

    const value = {
        allRecords,
        users,        
        addUser,      
        updateUser,   
        deleteUser,   
        selectedRegister,
        selectedPart,
        currentRecords,
        setSelectedRegister: handleRegisterChange,
        setSelectedPart,
        addNewRecord,
        updateRecord,
        getNextConsecutiveNumber,
        currentUser,  
        login,        
        logout,
    };

    return <RegisterContext.Provider value={value}>{children}</RegisterContext.Provider>;
};

export const useRegister = () => {
    const context = useContext(RegisterContext);
    if (!context) throw new Error("useRegister must be used within RegisterProvider");
    return context;
};