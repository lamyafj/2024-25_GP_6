import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import {  BringStudentRecord,deleteBusDatabase } from './studentListData.js';
import React, { useEffect, useState } from 'react';
import Loading from '../loading/loading.js';
import Header from '../../components/header/header.js';
import FormContainer from '../../components/FormContainer/FormContainer.js';
import './studentList.css';
import ListContainer  from '../../components/ListContainer/ListContainer.js';
import { useNavigate } from 'react-router-dom'; 
import { FaPlus } from "react-icons/fa6";

export default function StudentList() {
  const [record, setRecord] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageloading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const data = await BringStudentRecord();
        setRecord(data); // Set the fetched data in state
      } catch (err) {
        setError('Failed to fetch record'); // Handle errors
      } finally {
        setPageLoading(false); // Set loading to false when done
      }
    };

    fetchRecord(); // Call the fetch function
  }, []); // Empty dependency array means this runs once on mount


  const addStudent = () => {
    navigate('/addStudent');
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
  
      const updatedRecord = await BringStudentRecord();  // Fetch the updated bus list
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
  

  const studentdetail= async (uid) => {
    try {

      navigate(`/studentDetail/${uid}`);
  
    } catch (error) {

      console.error('Error:', error);
    }
  };
  
  
  return (
    <div className="Buspage">
      <div className="busmain">
        <Header />
        <div className='bus-list-content'>
        <button className="goadd-bus-button " onClick={addStudent}> <FaPlus style={{ marginLeft: '5px', verticalAlign: 'middle' }} />  إضافة طالب </button>
        <FormContainer>
        <div className='bus-list-items'>
          {/* Pass the bus record data as a prop to ListContainer */}
          
          <ListContainer students={record} listType={'students'} driverdelete={deletebus} studentdetail={studentdetail} loading={loading}/> 

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
