// src/hooks/useLocalStorage.js

import { useState, useEffect } from 'react';

/**
 * Custom hook to get and set a value in localStorage, mirroring useState behavior.
 * @param {string} key - The localStorage key to use.
 * @param {any} initialValue - The value to use if nothing is found in localStorage.
 * @returns {[any, Function]} - [value, setValue]
 */
export function useLocalStorage(key, initialValue) {
  
  // State is initialized from localStorage or initialValue
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return initialValue;
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      // Fallback to initial value if localStorage is unavailable or error occurs
      return initialValue; 
    }
  });

  // Effect to save the state to localStorage whenever the value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      console.log(`Data for key "${key}" successfully saved to localStorage.`);
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [key, value]);
  
  // Return the state and the setter, just like useState
  return [value, setValue];
}