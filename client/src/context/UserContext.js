import React, { createContext, useState, useEffect } from 'react';
import { BringRecord } from '../BringsSchoolRecord';
import Loading from '../pages/loading/loading';

export const SchoolRecordContext = createContext();

export const SchoolRecordProvider = ({ children }) => {
  const [schoolRecord, setSchoolRecord] = useState(null); // Start as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch the school record data
  const fetchRecord = async () => {
    setLoading(true); // Set loading to true before starting the fetch
    setError(null);   // Reset the error state
    try {
      const data = await BringRecord();
      setSchoolRecord(data);
    } catch (err) {
      setError('Failed to fetch record');
    } finally {
      setLoading(false);
    }
  };

  // Call fetchRecord on initial load
  useEffect(() => {
    fetchRecord();
  }, []);

  if (loading) {
    return <Loading />; // Show loading component while loading
  }

  return (
    <SchoolRecordContext.Provider value={{ schoolRecord, loading, error, refetchSchoolRecord: fetchRecord }}>
      {children}
    </SchoolRecordContext.Provider>
  );
};
