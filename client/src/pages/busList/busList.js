import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import { AddBusToDatabase, BringBusRecord } from './busListData.js';
import React, { useEffect, useState } from 'react';
import Loading from '../loading/loading.js';
import Header from '../../components/header/header.js';
import FormContainer from '../../components/FormContainer/FormContainer.js';
import './busList.css';
import ListContainer from '../../components/ListContainer/ListContainer.js';

export default function BusList() {
  const [record, setRecord] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const data = await BringBusRecord();
        setRecord(data); // Set the fetched data in state
      } catch (err) {
        setError('Failed to fetch record'); // Handle errors
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchRecord(); // Call the fetch function
  }, []); // Empty dependency array means this runs once on mount

  const addBus = async () => {
    try {
      setLoading(true);
      const newBus = { id: "4" }; // Example new bus data
      await AddBusToDatabase(newBus);
      const updatedRecord = await BringBusRecord(); // Fetch new data after adding
      setRecord(updatedRecord); // Update the record with new data
    } catch (err) {
      setError('Failed to add bus');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />; // Display loading state
  }

  if (error) {
    return <div>{error}</div>; // Display error state
  }

  return (
    <div className="Buspage">
      <div className="busmain">
        <Header />
        <FormContainer>
          {/* Pass the bus record data as a prop to ListContainer */}
          <ListContainer buses={record} />
          <button className="" onClick={addBus}>
            Add Bus
          </button>
        </FormContainer>
      </div>
      <div className="sidebar">
        <Sidebar />
      </div>
    </div>
  );
}
