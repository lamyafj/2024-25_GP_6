import {Sidebar} from '../../components/Sidebar/Sidebar.js'
import { AddBusToDatabase,BringBusRecord} from './busListData.js'
import React, { useEffect, useState } from 'react';
import Loading from '../loading/loading.js';

  
  export default function BusList() {
  
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchRecord = async () => {
        try {
          const data = await BringBusRecord();
          setRecord(data); // Set the fetched data in a state
        } catch (err) {
          setError('Failed to fetch record'); // Handle any errors
        } finally {
          setLoading(false); // Set loading to false when done
        }
      };
  
      fetchRecord(); // Call the fetch function
    }, []); // Empty dependency array means this runs once on mount

    ////////////////////////////addbus
  
    const addBus = async () => {
      try {
        setLoading(true); 
        const newBus = {id:"3"}; // Example new bus data
        await AddBusToDatabase(newBus); 
        const updatedRecord = await BringBusRecord(); //bring new data after adding
        setRecord(updatedRecord); // Update the record with new data
      } catch (err) {
        setError('Failed to add bus');
      } finally {
        setLoading(false);
      }
    };
  
    if (loading) {
      return <Loading/>; // Display loading state
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
        <button style={{width:'80px'}} onClick={addBus}>Add Bus</button> {/* Corrected the onClick handler */}
      </div>
    );
  }
  