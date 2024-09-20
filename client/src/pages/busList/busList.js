import {Sidebar} from '../../components/Sidebar/Sidebar.js'
import {BringRecord} from './busListData.js'
import React, { useEffect, useState } from 'react';
 // Adjust the import path accordingly

export default function BusList() {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const data = await BringRecord();
        setRecord(data); // Set the fetched data
      } catch (err) {
        setError('Failed to fetch record'); // Handle any errors
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchRecord(); // Call the fetch function
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (error) {
    return <div>{error}</div>; // Display error state
  }

  return (
    <div>
      <Sidebar />
      <h1>Bus Admin Dashboard</h1>
      {record ? (
        <div>
          {/* Render your record data here */}
          <pre>{JSON.stringify(record, null, 2)}</pre> {/* Example of rendering record */}
        </div>
      ) : (
        <div>No record found.</div>
      )}
    </div>
  );
}
