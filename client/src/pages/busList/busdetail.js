import { useParams } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import React, { useEffect, useState } from 'react';
import Loading from '../loading/loading.js';
import ItemContainer from '../../components/itemContainer/itemContainer.js';
import Header from '../../components/header/header.js';
import FormContainer from '../../components/FormContainer/FormContainer.js';
import { BringBusDetail, EditbusDetail ,deleteBusDatabase } from './busListData.js';
import './busdetail.css';
import ListContainer  from '../../components/ListContainer/ListContainer.js';
import { useNavigate } from 'react-router-dom'; 
import { FiEdit3 } from "react-icons/fi";
import { CgSpinnerAlt } from "react-icons/cg";
import { GoHash } from "react-icons/go";
import { IoPeopleOutline } from "react-icons/io5";
import { MdBarcodeReader } from "react-icons/md";
import { MdOutlineSmartphone } from "react-icons/md";
import { TbUser } from "react-icons/tb";
import { LiaCreditCard } from "react-icons/lia";
import {BringDriverDetail} from '../driver-list/driverListData.js'
import {BringStudentRecord} from '../student-list/studentListData.js'
import ConfirmationModal from '../../components/Confirmation/confirm.js';


export default function BusDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const uid = params.uid;
  const [record, setRecord] = useState({});
  const [driver, setDriver] = useState(null);
  const [students, setStudents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteloading, setDeleteloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // New state to track saving process
  const [formValues, setFormValues] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const data = await BringBusDetail(uid); 
        setRecord(data);       
        setFormValues(data);
        bringDriver(data.driver)
        if(data.students!==null){
          bringStudent();
        }
      } catch (err) {
        setError('Failed to fetch record');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [uid]);

  const bringDriver= async(uid)=>{  
    try{
    if(uid!==null){
    const driverrecord= await BringDriverDetail(uid)
    setDriver(driverrecord)}
    }catch(err){
      console.error('Failed to bring the driver data ');
    }
  
}


const bringStudent = async () => {
  try {
    // Fetch all student records
    const allstudents = await BringStudentRecord();
    
    if (allstudents !== null) {
      // Filter students whose 'bus' property matches the given 'uid'
      const filteredStudents = allstudents.filter(student => student.bus === uid);
      
      // Set the filtered list of students
      setStudents(filteredStudents);
      console.log(students)
    }
  } catch (err) {
    console.error('Failed to bring the student data', err);
  }
};
  // useEffect(() => {
  //   console.log(record.driver!==null)
  //   if (record.driver!==null) {
  //     bringDriver(record.driver); // Call this to set the assigned bus
  //   }
  // }, [record.driver]);

  if (loading) {
    return <Loading />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

    // Validation function
    const validateForm = () => {
      const { name, capacity, plate } = formValues;
      const plateRegex = /^[A-Za-z\u0600-\u06FF]{3}\d{4}$/;
  
      if (!name.trim() || !capacity || !plate.trim()) {
        setError("الرجاء قم بتعبئة جميع المعلومات المطلوبة");
        return false;
      }
  
      if (isNaN(capacity) || parseInt(capacity) <= 0) {
        setError('يرجى إدخال سعة حافلة رقم صحيح');
        return false;
      }
  
      if (!plateRegex.test(plate)) {
        setError('تنسيق لوحة الحافلة غير صحيح. يجب أن تكون مكونة من 3 أحرف تليها 4 أرقام');
        return false;
      }
  
      setError(null); // Clear any existing errors
      return true;
    };
  
  const handleSave = async () => {

    if (!validateForm()) {
      return false; 
    }

    setIsSaving(true); // Start the saving process
    try {
      await EditbusDetail(uid, formValues);
      setRecord(formValues);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save changes', err);
    } finally {
      setIsSaving(false); // End the saving process
    }
  };

  const deletebus = async (uid) => {
    try {
      setDeleteloading(uid);  // Set loading to true during the operation
      await deleteBusDatabase(uid);  // Delete bus from the database
      // Log for debugging
      console.log(`Bus with UID ${uid} deleted`);
      navigate('/busList')
      //const updatedRecord = await BringBusRecord();  // Fetch the updated bus list
      //console.log('Updated buses after deletion:', updatedRecord);
  
      // if (updatedRecord) {
      //   setRecord(updatedRecord);  // Update the state with the new record
      // } else {
      //   setError('Failed to fetch updated buses');
      // }
    } catch (err) {
      setError('Failed to delete bus');
    } finally {
      setDeleteloading(false);  // Stop the loading spinner once done
    }
  };

  // Handle cancel: reset form values and exit editing mode
  const handleCancel = () => {
    setFormValues(record); // Reset form to original data
    setIsEditing(false); // Exit edit mode
    setError(null);
  };

  return (
    <div className='bus-detail-page'>
      <Header />
      <div className="bus-detail-main">
        <div className="bus-detail-buttons">

        {!isEditing && ( // Hide edit button when editing
             <button className='edit-bus-button' onClick={() => navigate('/busList')}>عودة</button>
          )}
    <>
      {!isEditing && (
        <button 
          style={{ width: '80px' }}  
          className="delete-bus-button" 
          onClick={() => setModalOpen(true)} // Open the modal instead of deleting directly
          disabled={deleteloading}
        >
          {deleteloading ? <CgSpinnerAlt className="spinner" /> : 'حذف الحافلة'}
        </button>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => deletebus(uid)}
      >
        هل أنت متأكد من أنك تريد حذف الحافلة؟
      </ConfirmationModal>
    </>
          
          
          {isEditing && (
            <>
            <button className='cancel-bus-button' onClick={handleCancel}>
                إلغاء
              </button>
              <button
                className='save-bus-button'
                onClick={handleSave}
                disabled={isSaving} // Disable save button while saving
              >
                {isSaving ? <CgSpinnerAlt className='spinner'/>: 'حفظ'}
              </button>
              
            </>
          )}
          
        </div>
        {error && <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
        <FormContainer >
          <div className='detail-content'>
            <div className="title-container">
              <h1>تفاصيل الحافلة</h1>
              <div className="line"></div>
            </div>

            <div className='bus-one-detail-content'> 
              <div className='half'>
              <ItemContainer>
                <div className="bus-details-container">
                 
                  <ul className="bus-details-list">
                    <div style={{display:'flex' ,  justifyContent:'Space-Between'}}>
                    <h2>معلومات الحافلة</h2>
                   {!isEditing && ( // Hide edit button when editing
                    <button className='no-button' onClick={handleEditClick}> 
                      <FiEdit3 size={20} className="hover-icon" />
                    </button>
                  )}</div>
                    <hr />
                    <li><GoHash style={{ marginBottom: '-3px', marginLeft :'5px' }}/>
                      <strong style={{ marginLeft :'5px' }}>رقم الحافلة:</strong>            
                        {record.id }       
                    </li>
                    <li><GoHash style={{ marginBottom: '-3px', marginLeft :'5px' }}/>
                      <strong style={{ marginLeft :'5px' }}>اسم الحافلة:</strong> 
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formValues.name || ''}
                          onChange={handleChange}
                        />
                      ) : (
                        record.name
                      )}
                    </li>
                    <li><IoPeopleOutline style={{ marginBottom: '-3px', marginLeft :'5px' }} />
                      <strong style={{ marginLeft :'5px' }}>سعة الحافلة:</strong> 
                      {isEditing ? (
                        <input
                          type="text"
                          name="capacity"
                          value={formValues.capacity || ''}
                          onChange={handleChange}
                        />
                      ) : (
                        record.capacity
                      )}
                    </li>
                    {/* <li> <MdBarcodeReader style={{ marginBottom: '-3px', marginLeft :'5px' }} />
                      <strong style={{ marginLeft :'5px' }}>رقم قارئ RFID الحافلة:</strong> 
                      {isEditing ? (
                        <input
                          type="text"
                          name="rfid"
                          value={formValues.rfid || ''}
                          onChange={handleChange}
                        />
                      ) : (
                        record.rfid
                      )}
                    </li> */}
                    <li> <LiaCreditCard  style={{ marginBottom: '-3px', marginLeft :'5px' }}/>
                      <strong style={{ marginLeft :'5px' }}>لوحة الحافلة:</strong> 
                      {isEditing ? (
                        <input
                          type="text"
                          name="plate"
                          value={formValues.plate || ''}
                          onChange={handleChange}
                        />
                      ) : (
                        record.plate
                      )}
                    </li>
                  </ul>
                </div>
              </ItemContainer>
              </div>
              <div className='half'>
              <ItemContainer>
                <h2>معلومات سائق الحافلة</h2>
                <hr/>
               
                  {driver === null ? (
                    <p>لا يوجد سائق</p> // Display "no driver" message
                  ) : (
                    <ul className="bus-details-list" >
                      <li>
                        <TbUser style={{ marginBottom: '-3px', marginLeft: '5px' }} />
                        <strong style={{ marginLeft: '5px'}}>اسم سائق الحافلة: </strong>
                        {driver.driverFirstName} {driver.driverFamilyName} {/* Access driver's first name */}
                      </li>
                      <li>
                        <MdOutlineSmartphone style={{ marginBottom: '-3px', marginLeft: '5px' }} />
                        <strong style={{ marginLeft: '5px' }}>رقم سائق الحافلة: </strong>
                        {'0'+driver.driverPhone} {/* Access driver's phone number */}
                      </li>
                    </ul>
                  )}
            
              </ItemContainer>
              </div>
            </div>

            <div className="title-container">
              <h1>قائمه الطلاب بالحافلة {record.current_capacity}</h1>
              <div className="line"></div>
            </div>
         
            <ListContainer students={students} listType={'studentInbus'} loading={loading}/> 
           
           
          </div>
        </FormContainer>
      </div>  
      <div className="sidebar">
        <Sidebar />
      </div>
    </div>
  );
}
