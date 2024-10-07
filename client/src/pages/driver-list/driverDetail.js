import { useParams } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import React, { useEffect, useState } from 'react';
import Loading from '../loading/loading.js';
import ItemContainer from '../../components/itemContainer/itemContainer.js';
import Header from '../../components/header/header.js';
import FormContainer from '../../components/FormContainer/FormContainer.js';
import { BringDriverDetail, EditDriverDetail } from './driverListData.js';
import './driverDetail.css';
import { useNavigate } from 'react-router-dom'; 
import { FiEdit3 } from "react-icons/fi";
import { CgSpinnerAlt } from "react-icons/cg";
import { GoHash } from "react-icons/go";
import { IoPeopleOutline } from "react-icons/io5";
import { MdBarcodeReader } from "react-icons/md";
import { MdOutlineSmartphone } from "react-icons/md";
import { TbUser } from "react-icons/tb";
import { LiaCreditCard } from "react-icons/lia";
import { FaRegIdCard } from "react-icons/fa";
import { FaBus } from "react-icons/fa";

export default function DriverDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const uid = params.uid;
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // New state to track saving process
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const data = await BringDriverDetail(uid);
        setRecord(data);
        setFormValues(data);
      } catch (err) {
        setError('Failed to fetch record');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [uid]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
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

  const handleSave = async () => {
    setIsSaving(true); // Start the saving process
    try {
      await EditDriverDetail(uid, formValues);
      setRecord(formValues);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save changes', err);
    } finally {
      setIsSaving(false); // End the saving process
    }
  };

  // Handle cancel: reset form values and exit editing mode
  const handleCancel = () => {
    setFormValues(record); // Reset form to original data
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className='bus-detail-page'>
      <Header />
      <div className="bus-detail-main">
        <div className="bus-detail-buttons">

        {!isEditing && ( // Hide edit button when editing
             <button className='edit-bus-button' onClick={() => navigate('/driverList')}>عودة</button>
          )}
          
          {!isEditing && ( // Hide edit button when editing
            <button className='no-button' onClick={handleEditClick}> 
              <FiEdit3 size={20} className="hover-icon" />
            </button>
          )}

         

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

        <FormContainer>
          <div className='detail-content'>
            <div className="title-container">
              <h1> {record.driverFirstName} {record.driverFamilyName}  </h1>
              <div className="line"></div>
            </div>

            <div className='bus-one-detail-content'>
                <div class="half"> 
              <ItemContainer>
                <div className="bus-details-container">
                  <ul className="bus-details-list">
                  
                    <h2>معلومات السائق</h2>
                    <hr />
                    <li><TbUser style={{ marginBottom: '-3px', marginLeft :'5px' }}/>
                      <strong style={{ marginLeft :'5px' }}> الاسم الاول:</strong>            
                        {record.driverFirstName}       
                    </li>
                    <li><TbUser style={{ marginBottom: '-3px', marginLeft :'5px' }}/>
                      <strong style={{ marginLeft :'5px' }}>اسم العائلة :</strong> 
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formValues.name || ''}
                          onChange={handleChange}
                        />
                      ) : (
                        record.driverFamilyName
                      )}
                    </li>
                    <li> <FaRegIdCard   style={{ marginBottom: '-3px', marginLeft :'5px' }}/>
                      <strong style={{ marginLeft :'5px' }}>الاقامة او الهوية الوطنية:</strong> 
                      {isEditing ? (
                        <input
                          type="text"
                          name="plate"
                          value={formValues.driverId || ''}
                          onChange={handleChange}
                        />
                      ) : (
                        record.driverId
                      )}
                    </li>
                    <li> <MdOutlineSmartphone style={{ marginBottom: '-3px', marginLeft :'5px' }} />
                      <strong style={{ marginLeft :'5px' }}> رقم الجوال:</strong> 
                      {isEditing ? (
                        <input
                          type="text"
                          name="rfid"
                          value={formValues.rfid || ''}
                          onChange={handleChange}
                        />
                      ) : (
                        record.driverPhone
                      )}
                    </li>
                  
                  </ul>
                </div>
              </ItemContainer>
              </div>
              <div class="half">
              <ItemContainer>
                <h2>معلومات الحافلة</h2>
                <hr/>
                <ul className="bus-details-list">
                {record.bus ?
                    <>
                    <li>
                        <GoHash style={{ marginBottom: '-3px', marginLeft: '5px' }} />
                        <strong style={{ marginLeft: '5px' }}>رقم الحافلة:</strong> 
                        { record.bus.number}
                    </li>
                    <li>
                      <FaBus style={{ marginBottom: '-3px', marginLeft: '5px' }} />
                      <strong style={{ marginLeft: '5px' }}>اسم الحافلة:</strong> 
                     { record.bus.name }
                    </li> 
                    </>
                    : <li>السائق غير معين لحافلة</li>}
                    </ul>
              </ItemContainer>
                </div>

            </div>


          </div>
        </FormContainer>
      </div>  
      <div className="sidebar">
        <Sidebar />
      </div>
    </div>
  );
}
