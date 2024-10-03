import { useParams } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import React, { useEffect, useState } from 'react';
import Loading from '../loading/loading.js';
import ItemContainer from '../../components/itemContainer/itemContainer.js';
import Header from '../../components/header/header.js';
import FormContainer from '../../components/FormContainer/FormContainer.js';
import { BringBusDetail } from './busListData.js';
import './busdetail.css';
import { useNavigate } from 'react-router-dom'; 


export default function BusDetail() {
  const params = useParams(); // Extract 'uid' from the URL
  const navigate = useNavigate();
  const uid = params.uid;
  const [record, setRecord] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useEffect to call fetchRecord when the component mounts
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const data = await BringBusDetail(uid);
        setRecord(data); // Set the fetched data in state
        console.log(data)
      } catch (err) {
        setError('Failed to fetch record'); // Handle errors
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchRecord(); // Call the fetch function
  }, [uid]); // Dependency array includes uid to refetch if it changes

  // Show loading state while data is being fetched
  if (loading) {
    return <Loading />;
  }

  // Handle any errors
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='bus-detail-page'>
      
        <Header />
         <div className="bus-detail-main">
           
        <FormContainer>
            <div className='detail-content'>
            <h2>معلومات الحافلة</h2>
            <ItemContainer>
            <div class="bus-details-container">
            <ul class="bus-details-list">
        <li><strong>رقم الحافلة:</strong> {record.id}</li>
        <li><strong>سعة الحافلة:</strong> {record.capacity}</li>
        <li><strong>رقم قارئ RFID الحافلة:</strong> {record.rfid}</li>
        <li><strong>لوحة الحافلة:</strong> {record.licensePlate}</li>
        <li><strong>سائق الحافلة: </strong> {record.driver}</li>
        </ul>
        </div>
            </ItemContainer>
          
        <h2>مسار سير الحافلة</h2>
        <ItemContainer/>
        <h2>قائمه الطلاب بالحافلة</h2>
        <ItemContainer/>
        </div>
        <button className='edit-bus-button' onClick={() => navigate('/busList')}>عودة</button>
        </FormContainer>
         </div>  
         <div className="sidebar">
        <Sidebar />
      </div>
    </div>
  );
}
