import { useParams } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import React, { useEffect, useState } from 'react';
import Loading from '../loading/loading.js';
import ItemContainer from '../../components/itemContainer/itemContainer.js';
import Header from '../../components/header/header.js';
import FormContainer from '../../components/FormContainer/FormContainer.js';
import { BringDriverDetail, EditDriverDetail ,assignDriverBus , UNassignDriverBus,inActivateDriver,activateDriver} from './driverListData.js';
import {BringBusRecord} from '../busList/busListData.js'
import './driverDetail.css';
import { useNavigate } from 'react-router-dom'; 
import { FiEdit3 } from "react-icons/fi";
import { CgSpinnerAlt } from "react-icons/cg";
import { GoHash } from "react-icons/go";
import { MdOutlineSmartphone } from "react-icons/md";
import { TbUser } from "react-icons/tb";
import { FaRegIdCard } from "react-icons/fa";
import { FaBus } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";

export default function DriverDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const uid = params.uid;
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 
  const [formValues, setFormValues] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [buses, setBuses] = useState([]);
  const [driverBus, setDriverBus] = useState(null);
  const [isBusLoading, setIsBusLoading] = useState(false);
  const [isDriverActiveLoading, setIsDriverActiveLoading] = useState(false);
  console.log(formValues)

  // Fetch driver record and bus list
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const data = await BringDriverDetail(uid);
        setRecord(data);
        setFormValues(data);
        await buslist();  // Fetch the buses first
      } catch (err) {
        setError('Failed to fetch record');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecord();
  }, [uid]);

  // Fetch the list of buses
  const buslist = async () => {
    try {
      const allBuses = await BringBusRecord();
      setBuses(allBuses);
    } catch (err) {
      console.error('Failed to fetch buses', err);
    }
  };

 
  useEffect(() => {
    if (buses.length > 0 && record.bus) {
      driverbus(); // Call this to set the assigned bus
    }
  }, [buses, record.bus]);

  const driverbus = () => {
    const assignedBus = buses.find(bus => bus.uid === record.bus._path.segments[1]);
    setDriverBus(assignedBus);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await EditDriverDetail(uid, formValues);
      setRecord(formValues);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save changes', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormValues(record);
    setIsEditing(false);
  };

  const choosebus = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const inactivateDriver = async () => {
    setIsDriverActiveLoading(true)
    try {
      // Call the function to inactivate the driver
      await inActivateDriver(uid);
  
      // Refetch the driver details to get the updated information
      const updatedData = await BringDriverDetail(uid);
  
      // You may want to update the state with the new driver data
      setRecord(updatedData); // Assuming setRecord is used to store driver details in your state
      setFormValues(updatedData); // Update form values if necessary
      setDriverBus(null)

      // Optional: You could also reset any loading states or other relevant UI updates here
    } catch (error) {
      console.error('Error inactivating driver:', error);
      // Handle the error accordingly, e.g., show an alert or set an error state
      // setError('Failed to inactivate driver.'); // Uncomment if you want to show an error message
    }finally{
        setIsDriverActiveLoading(false)
    }
  };
  

  const handleBusSelect = async (bus) => {
    setIsBusLoading(true);
    try {
      setSelectedBus(bus);
      setDropdownVisible(false);
      await assignDriverBus(uid, bus.uid);
      // Refetch driver details to get updated bus assignment
      const updatedData = await BringDriverDetail(uid);
      setRecord(updatedData);
      setFormValues(updatedData);
    } catch (error) {
      console.error('Error assigning bus:', error);
    } finally {
      setIsBusLoading(false);
    }
  };
  const deleteDriverBus = async () => {
    setIsBusLoading(true)
    try {
      await UNassignDriverBus(uid, driverBus.uid); // Unassign bus from driver
      setSelectedBus(null); // Clear selected bus
      const updatedData = await BringDriverDetail(uid); 
      await buslist(); 
      setRecord(updatedData); // Update record with new data
      setFormValues(updatedData); // Update form values to reflect changes
      // Optionally reset driverBus if it's no longer assigned
      if (updatedData.bus === null) {
        setDriverBus(null); // Clear the driver bus reference
      } else {
        driverbus(); // Call to update the driverBus if still assigned
      }
    } catch (error) {
      console.error('Error unassigning bus:', error);
    }finally{
        setIsBusLoading(false)
    }
  };

  const activatedriver = async () => {
    setIsDriverActiveLoading(true)
    try {
      await activateDriver(uid); // Unassign bus from driver
      setSelectedBus(null); // Clear selected bus
      const updatedData = await BringDriverDetail(uid); 
      await buslist(); 
      setRecord(updatedData); // Update record with new data
      setFormValues(updatedData); // Update form values to reflect changes
      // Optionally reset driverBus if it's no longer assigned
      if (updatedData.bus === null) {
        setDriverBus(null); // Clear the driver bus reference
      } else {
        driverbus(); // Call to update the driverBus if still assigned
      }
    } catch (error) {
      console.error('Error unassigning bus:', error);
    }finally{
        setIsDriverActiveLoading(false)
    }
  };
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='bus-detail-page'>
      <Header />
      <div className="bus-detail-main">
        <div className="bus-detail-buttons">
          
          {!isEditing && (
            <button className='edit-bus-button' onClick={() => navigate('/driverList')}>عودة</button>
          )}
            {!isEditing && record.statue === 'active' && (
                <button 
                    value={uid} 
                    className="delete-driver-button" 
                    onClick={inactivateDriver} // Call the function directly
                    disabled={isDriverActiveLoading} // Optionally disable the button while loading
                >
                    {isDriverActiveLoading ? <CgSpinnerAlt className='spinner' /> : 'الغاء التسجيل'}
                </button>
            )}

            {!isEditing && record.statue === 'inactive' && (
                <button 
                    value={uid} 
                    className="activate-driver-button" 
                    onClick={activatedriver} // Call the function directly
                    disabled={isDriverActiveLoading} // Optionally disable the button while loading
                >
                    {isDriverActiveLoading ? <CgSpinnerAlt className='spinner' /> : 'تنشيط'}
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
                disabled={isSaving}
              >
                {isSaving ? <CgSpinnerAlt className='spinner' /> : 'حفظ'}
              </button>
            </>
          )}
        </div>

        <FormContainer>
                    <div className='detail-content'>
                        <div className="title-container">
                        <h1>{record.driverFirstName} {record.driverFamilyName}</h1>
                        <div className="line"></div>
                        </div>

                        <div className='bus-one-detail-content'>
                        <div className="half">
                            <ItemContainer>
                            <div className="bus-details-container">
                <ul className="bus-details-list">
                    <div className='container-box-detail'>
                    <h2>معلومات السائق</h2>
                    {!isEditing && (
                        <button className='no-button' onClick={handleEditClick}>
                        <FiEdit3 size={20} className="hover-icon" />
                        </button>
                    )}
                    </div>
                    <hr />
                    <li>
                    <TbUser style={{ marginBottom: '-3px', marginLeft: '5px' }} />
                    <strong style={{ marginLeft: '5px' }}>الاسم الاول:</strong>
                    {isEditing ? (
                        <input
                        type="text"
                        name="driverFirstName"
                        value={formValues.driverFirstName || ''} // Use correct field
                        onChange={handleChange}
                        />
                    ) : (
                        record.driverFirstName
                    )}
                    </li>
                    <li>
                    <TbUser style={{ marginBottom: '-3px', marginLeft: '5px' }} />
                    <strong style={{ marginLeft: '5px' }}>اسم العائلة :</strong>
                    {isEditing ? (
                        <input
                        type="text"
                        name="driverFamilyName"
                        value={formValues.driverFamilyName || ''} // Use correct field
                        onChange={handleChange}
                        />
                    ) : (
                        record.driverFamilyName
                    )}
                    </li>
                    <li>
                    <FaRegIdCard style={{ marginBottom: '-3px', marginLeft: '5px' }} />
                    <strong style={{ marginLeft: '5px' }}>الاقامة او الهوية الوطنية:</strong>
                    {isEditing ? (
                        <input
                        type="text"
                        name="driverId"
                        value={formValues.driverId || ''} // Use correct field
                        onChange={handleChange}
                        />
                    ) : (
                        record.driverId
                    )}
                    </li>
                    <li>
                    <MdOutlineSmartphone style={{ marginBottom: '-3px', marginLeft: '5px' }} />
                    <strong style={{ marginLeft: '5px' }}>رقم الجوال:</strong>
                    {isEditing ? (
                        <input
                        type="text"
                        name="driverPhone"
                        value={formValues.driverPhone || ''} // Use correct field
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

              <div className="half">
                <ItemContainer>
                  <ul className="bus-details-list">
                      <div>
                      {driverBus  ? (
                        <>
                     <div className='container-box-detail'>
                      <h2>معلومات الحافلة</h2>
                      <button className='no-button' onClick={deleteDriverBus}>
    {isBusLoading ? (
        <CgSpinnerAlt className='spinner' />
    ) : (
        <IoTrashBinOutline size={20} className="hover-icon" style={{ color: 'red', marginBottom: '20px' }} />
    )}
</button>
</div>
                          <hr />
                          <li>
                            <GoHash style={{ marginBottom: '-3px', marginLeft: '5px' }} />
                            <strong style={{ marginLeft: '5px' }}>رقم الحافلة:</strong>
                            {driverBus.id}
                          </li>
                          <li>
                            <FaBus style={{ marginBottom: '-3px', marginLeft: '5px' }} />
                            <strong style={{ marginLeft: '5px' }}>اسم الحافلة:</strong>
                            {driverBus.name}
                          </li>
                        </>
                      ) : (
                        <>
                    <div className='container-box-detail'>
                      <h2>معلومات الحافلة</h2>
                      <div className="some-container">
                      {isBusLoading ? (
                            <button className='choose-bus-button' disabled>
                                <CgSpinnerAlt className='spinner' />
                            </button>
                        ) : (
                            record.statue === 'active' && (
                                <button className='choose-bus-button' onClick={choosebus}>
                                    {dropdownVisible ? 'إلغاء' : 'تعيين'}
                                </button>
                            )
                        )}

                            </div>
                            </div>
                          <hr />
                          {dropdownVisible && buses.length > 0 && (
                            <ul className="bus-dropdown">
                              {buses
                                .filter(bus => bus.driver === null) // Filter buses where driver is null
                                .map((bus) => (
                                    <li key={bus.uid} onClick={() => handleBusSelect(bus)}>
                                    حافلة رقم {bus.id} - {bus.name}
                                    </li>
                                ))}
                            </ul>
                          )}
                           {!dropdownVisible && !record.bus && !isBusLoading && record.statue === 'active' && (
                                <li>السائق غير معين لحافلة</li>
                            )}

                            {!dropdownVisible && !record.bus && !isBusLoading && record.statue !== 'active' && (
                                <li>السائق غير نشط</li>
                            )}
                        </>
                      )}
                    </div>
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
