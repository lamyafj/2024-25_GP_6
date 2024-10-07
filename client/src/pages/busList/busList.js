import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import { AddBusToDatabase, BringBusRecord,deleteBusDatabase } from './busListData.js';
import React, { useEffect, useState } from 'react';
import Loading from '../loading/loading.js';
import Header from '../../components/header/header.js';
import FormContainer from '../../components/FormContainer/FormContainer.js';
import './busList.css';
import ListContainer  from '../../components/ListContainer/ListContainer.js';
import { useNavigate } from 'react-router-dom'; 
import { FaPlus } from "react-icons/fa6";

export default function BusList() {
  const [record, setRecord] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageloading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const data = await BringBusRecord();
        setRecord(data); // Set the fetched data in state
      } catch (err) {
        setError('Failed to fetch record'); // Handle errors
      } finally {
        setPageLoading(false); // Set loading to false when done
      }
    };

    fetchRecord(); // Call the fetch function
  }, []); // Empty dependency array means this runs once on mount


  const addBus = () => {
    navigate('/addbus');
  };


  if (pageloading) {
    return <Loading />; // Display loading state
  }

  if (error) {
    return <div>{error}</div>; // Display error state
  }

  const deletebus = async (uid) => {
    try {
      setLoading(uid);  // Set loading to true during the operation
      await deleteBusDatabase(uid);  // Delete bus from the database
      // Log for debugging
      console.log(`Bus with UID ${uid} deleted`);
  
      const updatedRecord = await BringBusRecord();  // Fetch the updated bus list
      console.log('Updated buses after deletion:', updatedRecord);
  
      if (updatedRecord) {
        setRecord(updatedRecord);  // Update the state with the new record
      } else {
        setError('Failed to fetch updated buses');
      }
    } catch (err) {
      setError('Failed to delete bus');
    } finally {
      setLoading(false);  // Stop the loading spinner once done
    }
  };
  

  const busDetail = async (uid) => {
    try {
      console.log(uid)
      navigate(`/busdetail/${uid}`);
  
    } catch (error) {

      console.error('Error:', error);
    }
  };
  
  
  return (
    <div className="Buspage">
      <div className="busmain">
        <Header />
        <div className='bus-list-content'>
        <button className="goadd-bus-button " onClick={addBus}> <FaPlus style={{ marginLeft: '5px', verticalAlign: 'middle' }} />  إضافة حافلة </button>
        <FormContainer>
        <div className='bus-list-items'>
          {/* Pass the bus record data as a prop to ListContainer */}
          <ListContainer buses={record}  listType={'buses'} busdelete={deletebus} busdetail={busDetail} loading={loading}/> 

        </div>  
        </FormContainer>
        </div>
      </div>
      <div className="sidebar">
        <Sidebar />
      </div>
    </div>
  );
}
