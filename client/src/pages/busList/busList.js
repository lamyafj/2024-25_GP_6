import {Sidebar} from '../../components/Sidebar/Sidebar.js'
import {BringRecord , AddBusToDatabase} from './busListData.js'
import React, { useEffect, useState } from 'react';
 // Adjust the import path accordingly

  
  export default function BusList() {
  
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchRecord = async () => {
        try {
          const data = await BringRecord(); // Assuming BringRecord fetches data
          setRecord(data); // Set the fetched data
        } catch (err) {
          setError('Failed to fetch record'); // Handle any errors
        } finally {
          setLoading(false); // Set loading to false when done
        }
      };
  
      fetchRecord(); // Call the fetch function
    }, []); // Empty dependency array means this runs once on mount
  
    const addBus = async () => {
      try {
        setLoading(true); // Set loading state to true while adding
        // Implement your logic for adding a bus here
        // For example, you can call an API to add a bus
  
        const newBus = {id:"1"}; // Example new bus data
        await AddBusToDatabase(newBus); // Assuming AddBusToDatabase is a function that handles this
        const updatedRecord = await BringRecord(); // Fetch updated record
        setRecord(updatedRecord); // Update the record with new data
      } catch (err) {
        setError('Failed to add bus');
      } finally {
        setLoading(false);
      }
    };
  
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
        <button style={{width:'80px'}} onClick={addBus}>Add Bus</button> {/* Corrected the onClick handler */}
      </div>
    );
  }
  