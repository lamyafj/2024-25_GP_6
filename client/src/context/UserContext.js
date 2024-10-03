import React, { createContext, useState, useEffect } from 'react';
import {BringRecord} from '../BringsSchoolRecord';

export const SchoolRecordContext = createContext();

export const SchoolRecordProvider = ({ children }) => {
  const [schoolRecord, setSchoolRecord] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecord = async () => {
    try {
      const data = await BringRecord();
      setSchoolRecord(data);
    } catch (err) {
      setError('Failed to fetch record');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecord();
  }, []);

  return (
    <SchoolRecordContext.Provider value={{ schoolRecord, loading, error }}>
      {children}
    </SchoolRecordContext.Provider>
  );
};
