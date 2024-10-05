import { useParams } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import React, { useEffect, useState } from 'react';
import Loading from '../loading/loading.js';
import ItemContainer from '../../components/itemContainer/itemContainer.js';
import Header from '../../components/header/header.js';
import FormContainer from '../../components/FormContainer/FormContainer.js';
import { BringBusDetail, EditbusDetail } from './busListData.js';
import './busdetail.css';
import { useNavigate } from 'react-router-dom'; 
import { FiEdit3 } from "react-icons/fi";
import { CgSpinnerAlt } from "react-icons/cg";

export default function BusDetail() {
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
        const data = await BringBusDetail(uid);
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
      await EditbusDetail(uid, formValues);
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
          <button className='edit-bus-button' onClick={() => navigate('/busList')}>عودة</button>

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
              <h1>تفاصيل الحافلة</h1>
              <div className="line"></div>
            </div>

            <div className='bus-one-detail-content'>
              <ItemContainer>
                <div className="bus-details-container">
                  <ul className="bus-details-list">
                    <h2>معلومات الحافلة</h2>
                    <hr />
                    <li>
                      <strong>رقم الحافلة:</strong> 
                      {isEditing ? (
                        <input
                          type="text"
                          name="id"
                          value={formValues.id || ''}
                          onChange={handleChange}
                        />
                      ) : (
                        record.id
                      )}
                    </li>
                    <li>
                      <strong>سعة الحافلة:</strong> 
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
                    <li>
                      <strong>رقم قارئ RFID الحافلة:</strong> 
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
                    </li>
                    <li>
                      <strong>لوحة الحافلة:</strong> 
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

              <ItemContainer>
                <h2>معلومات سائق الحافلة</h2>
                <hr/>
                <ul className="bus-details-list">
                  <li><strong>اسم سائق الحافلة: </strong> {record.driver}</li>
                  <li><strong>رقم سائق الحافلة: </strong> {record.driver}</li>
                </ul>
              </ItemContainer>
            </div>

            <div className="title-container">
              <h1>مسار الحافلة</h1>
              <div className="line"></div>
            </div>
            <ItemContainer />

            <div className="title-container">
              <h1>قائمه الطلاب بالحافلة</h1>
              <div className="line"></div>
            </div>
            <ItemContainer />
          </div>
        </FormContainer>
      </div>  
      <div className="sidebar">
        <Sidebar />
      </div>
    </div>
  );
}
