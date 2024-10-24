import { useParams } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import React, { useEffect, useState } from 'react';
import Loading from '../loading/loading.js';
import ItemContainer from '../../components/itemContainer/itemContainer.js';
import Header from '../../components/header/header.js';
import FormContainer from '../../components/FormContainer/FormContainer.js';
import { BringStudentDetail, EditStudentDetail ,assignStudentBus , unassignStudentBus,DeleteStudent,AcceptStudent} from './studentListData.js';
import {BringBusRecord} from '../busList/busListData.js'
import './studentDetail.css';
import { useNavigate } from 'react-router-dom'; 
import { FiEdit3 } from "react-icons/fi";
import { CgSpinnerAlt } from "react-icons/cg";
import { GoHash } from "react-icons/go";
import { MdOutlineSmartphone } from "react-icons/md";
import { TbUser } from "react-icons/tb";
import { FaRegIdCard } from "react-icons/fa";
import { FaBus } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";
import { MdOutlineOtherHouses } from "react-icons/md";
import ConfirmationModal from '../../components/Confirmation/confirm.js';
import SuccessMessage from '../../components/successMessage/successMessage.js';


export default function StudentDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const uid = params.uid;
  const [student, setStudent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [buses, setBuses] = useState([]);
  const [availableBuses, setAvailableBuses] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [studentBus, setStudentBus] = useState(null);
  const [isDelete, setIsDelete] = useState(null);
  const [isAccept, setIsAccept] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuccessbus, setShowSuccessbus] = useState(false);
  const [showSuccessaccept, setShowSuccessaccept] = useState(false);

  //const validateCityAndDistrict = (input) => input.trim().length >= 2;
  //const validateStreet = (street) => street.trim().length >= 3;
  //const validatePostalCode = (postalCode) => /^\d{5}$/.test(postalCode); // Assuming 5-digit postal codes
  const validateName = (name) => name.trim().length >= 2;
  const validateID = (id) => /^\d{1,10}$/.test(id);
  const validatePhoneNumber = (phone) => /^5\d{8}$/.test(phone);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      setLoading(true);
      try {
        const data = await BringStudentDetail(uid); // Fetch student details
        setStudent(data);
        setFormValues(data);
        const slicedPhone = data.parentPhone ? data.parentPhone.slice(4) : '';

        setFormValues({
          ...data,
          parentPhone: slicedPhone, // Set the sliced phone number
        });
        
        if (data.bus) {
          setStudentBus(data.bus);
        }
        await fetchBuses();
      } catch (err) {
        setError('فشل في جلب تفاصيل الطالب');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [uid]);

  const fetchBuses = async () => {
    try {
      const allBuses = await BringBusRecord();
      setBuses(allBuses);
      const availablebuses = allBuses.filter(
        (bus) => bus.currentCapacity < bus.maximumCapacity
      );
      setAvailableBuses(availablebuses);
    } catch (err) {
      console.error('فشل في جلب الحافلات', err);
    }
  };

  useEffect(() => {
    if (buses.length > 0 && student.bus) {
      const assignedBus = buses.find((bus) => bus.uid === student.bus);
      setStudentBus(assignedBus);
    }
  }, [buses, student.bus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(formValues)
  
    if (["city", "street", "district", "postalCode"].includes(name)) {
      // Update address fields separately
      setFormValues((prevValues) => ({
        ...prevValues,
        address: {
          ...prevValues.address,
          [name]: value,
        },
      }));
    } else if (name === "parentPhone") {
      // Format parentPhone based on the starting pattern
      const formattedPhone = value.startsWith('+966')
        ? `0${value.slice(4)}`
        : value;
  
      setFormValues((prevValues) => ({
        ...prevValues,
        parentPhone: formattedPhone,
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };
  
  

  const handleEditClick = () => {
    setIsEditing(true);
  };

const handleSave = async () => {
  setError('');
  setIsSaving(true);

  const {
    studentFirstName,
    studentFamilyName,
    parentUid,
    parentPhone,
    address, 
    grade,
  } = formValues;
  console.log(grade)

  if(!address.city || !address.street || !address.district || !address.postalCode || !grade){
    setError('الرجاء تعبئة جميع الحقول')
    setIsSaving(false);
    return;
  }

  if (!validateName(studentFirstName) || !validateName(studentFamilyName)) {
    setError('الأسماء يجب أن تحتوي على حرفين على الأقل');
    setIsSaving(false);
    return;
  }

  if (!validateID(uid) || !validateID(parentUid)) { // Validate Parent UID
    setError('رقم الهوية او الأقامة يجب ان يكون 10 أرقام');
    setIsSaving(false);
    return;
  }

  if (!validatePhoneNumber(parentPhone)) { // Validate Parent Phone
    setError('رقم هاتف ولي الأمر يجب أن يبدأ بـ 5 ويتكون من 9 أرقام');
    setIsSaving(false);
    return;
  }



  // if (!validatePostalCode(postalCode)) {
  //   setError('رمز البريد يجب أن يكون مكون من 5 أرقام.');
  //   setIsSaving(false);
  //   return;
  // }

  try {
    await EditStudentDetail(uid, formValues);
    setStudent(formValues);
    setIsEditing(false);
    setError('');
  } catch (err) {
    setError('فشل في حفظ التغييرات. يرجى المحاولة مرة أخرى.');
  } finally {
    setIsSaving(false);
    handleSuccessOperation('1');
  }
};

  const handleCancel = () => {
    setFormValues(student);
    setError(null);
    setIsEditing(false);
  };

  const handleBusSelect = async (bus) => {
    setIsAssigning(true);
    try {
      setSelectedBus(bus);
      setDropdownVisible(false);
      await assignStudentBus(uid, bus.uid);
      const updatedData = await BringStudentDetail(uid);
      setStudent(updatedData);
      setFormValues(updatedData);
    } catch (error) {
      setError('خطأ في تعيين الحافلة');
    } finally {
      setIsAssigning(false);
      handleSuccessOperation('2');
    }
  };

  const handleUnassignBus = async () => {
    setIsAssigning(true);
    try {
      await unassignStudentBus(uid, studentBus.uid);
      setSelectedBus(null);
      const updatedData = await BringStudentDetail(uid);
      setStudent(updatedData);
      setFormValues(updatedData);
      setStudentBus(null);
      fetchBuses();
    } catch (error) {
      setError('خطأ في إلغاء تعيين الحافلة');
    } finally {
      setIsAssigning(false);
    }
  };

  const deletestudent = async () => {
    setIsDelete(true);
    try {
      await DeleteStudent(uid);
      navigate('/studentList');
    } catch (error) {
      setError('خطأ في حذف الطالب');
    } finally {
      setIsDelete(false);
      setModalOpen(false);
    }
  };

  const acceptStudent = async () => {
    setIsAccept(true);
    try {
      await AcceptStudent(uid);
      const updatedData = await BringStudentDetail(uid);
      setStudent(updatedData);
      setFormValues(updatedData);
    } catch (error) {
      setError('خطأ في قبول الطالب');
    } finally {
      setIsAccept(false);
      handleSuccessOperation('3');
    }
  };

  if (loading) {
    return <Loading />;
  }

  const handleSuccessOperation = (number) => {
    if (number === '1') {
      setShowSuccess(false);
      setTimeout(() => setShowSuccess(true), 0);
    }
    if (number === '2') {
      setShowSuccessbus(false);
      setTimeout(() => setShowSuccessbus(true), 0);
    }
    if (number === '3') {
      setShowSuccessaccept(false);
      setTimeout(() => setShowSuccessaccept(true), 0);
    }
  };

  return (
    <div className="student-detail-page">
      {showSuccess && <SuccessMessage message="تم التعديل بنجاح" />}
      {showSuccessbus && <SuccessMessage message="تم التعيين بنجاح" />}
      {showSuccessaccept && <SuccessMessage message="تم القبول بنجاح" />}
      
      <Header />
      <div className="student-detail-main">
        <div className="student-detail-buttons">
          {!isEditing && (
            <button
              className="edit-student-button"
              onClick={() => navigate('/studentList')}
            >
              عودة
            </button>
          )}
  
          {student.status === 'inactive' && (
            <>
              <button
                className="details-driver-button"
                onClick={acceptStudent}
                disabled={isAccept}
              >
                {isAccept ? <CgSpinnerAlt className="spinner" /> : 'قبول'}
              </button>
  
              <button
                className="delete-bus-button"
                style={{ width: '80px' }}
                onClick={() => setModalOpen(true)}
                disabled={isDelete}
              >
                {isDelete ? <CgSpinnerAlt className="spinner" /> : 'رفض'}
              </button>
              <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={deletestudent}
              >
                هل أنت متأكد من أنك تريد رفض الطالب؟
              </ConfirmationModal>
            </>
          )}
          
          {!isEditing && student.status === 'active' && (
            <>
              <button
                className="delete-bus-button"
                style={{ width: '80px' }}
                onClick={() => setModalOpen(true)}
                disabled={isDelete}
              >
                {isDelete ? <CgSpinnerAlt className="spinner" /> : 'حذف الطالب'}
              </button>
              <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={deletestudent}
              >
                هل أنت متأكد من أنك تريد حذف الطالب؟
              </ConfirmationModal>
            </>
          )}
  
          {isEditing && (
            <>
              <button className="cancel-student-button" onClick={handleCancel}>
                إلغاء
              </button>
              <button
                className="save-student-button"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? <CgSpinnerAlt className="spinner" /> : 'حفظ'}
              </button>
            </>
          )}
        </div>
  
        {error && (
          <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </p>
        )}
  
        <FormContainer>
          <div className="detail-content">
            <div className="title-container">
              <h1>{student.studentFirstName} {student.studentFamilyName}</h1>
              <div className="line"></div>
            </div>
  
            <div className="student-one-detail-content">
              <div className="half">
                <ItemContainer>
                  <div className="student-details-container">
                    <ul className="student-details-list">
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <h2>معلومات الطالب</h2>
                        {!isEditing && student.status === 'active' && (
                          <button className="no-button" onClick={handleEditClick}>
                            <FiEdit3 size={20} className="hover-icon" />
                          </button>
                        )}
                      </div>
                      <hr />
                      <li>
                        <FaRegIdCard style={{ marginBottom: '-5px', marginLeft: '6px' }} />
                        <strong style={{ marginLeft: '5px' }}> الهوية الوطنية أو الاقامة الخاصة بالطالب: </strong>
                        {student.uid}
                      </li>
                      <li>
                        <TbUser style={{ marginBottom: '-3px', marginLeft: '5px' }} />
                        <strong style={{ marginLeft: '5px' }}>اسم الطالب:</strong>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                              type="text"
                              name="studentFirstName"
                              value={formValues.studentFirstName || ''}
                              onChange={handleChange}
                              placeholder="الاسم الأول"
                              style={{ flex: 1 }}
                            />
                            <input
                              type="text"
                              name="studentFamilyName"
                              value={formValues.studentFamilyName || ''}
                              onChange={handleChange}
                              placeholder="اسم العائلة"
                              style={{ flex: 1 }}
                            />
                          </div>
                        ) : (
                          `${student.studentFirstName} ${student.studentFamilyName}`
                        )}
                      </li>
                      <li>
                        <TbUser style={{ marginBottom: '-3px', marginLeft: '5px' }} />
                        <strong style={{ marginLeft: '5px' }}>صف الطالب: </strong>
                        {isEditing ? (
                          <input
                            type="text"
                            name="grade"
                            value={formValues.grade || ''}
                            onChange={handleChange}
                          />
                        ) : (
                          student.grade
                        )}
                      </li>
                      <li>
                        <MdOutlineOtherHouses style={{ marginBottom: '-3px', marginLeft: '5px' }} />
                        <strong style={{ marginLeft: '5px' }}>عنوان الطالب:</strong>
                        {!isEditing ? (
                          <span>
                            {student.address.city}, {student.address.street}, {student.address.postalCode}, {student.address.district}
                          </span>
                        ) : (
                          <>
                            <div>
                              <label htmlFor="city">المدينة:</label>
                              <input
                                type="text"
                                name="city"
                                id="city"
                                value={formValues.address.city || ''}
                                onChange={handleChange}
                                placeholder="المدينة"
                              />
                            </div>
                            <div>
                              <label htmlFor="street">الشارع:</label>
                              <input
                                type="text"
                                name="street"
                                id="street"
                                value={formValues.address.street || ''}
                                onChange={handleChange}
                                placeholder="الشارع"
                              />
                            </div>
                            <div>
                              <label htmlFor="district">الحي:</label>
                              <input
                                type="text"
                                name="district"
                                id="district"
                                value={formValues.address.district || ''}
                                onChange={handleChange}
                                placeholder="الحي"
                              />
                            </div>
                            <div>
                              <label htmlFor="postalCode">الرمز البريدي:</label>
                              <input
                                type="text"
                                name="postalCode"
                                id="postalCode"
                                value={formValues.address.postalCode || ''}
                                onChange={handleChange}
                                placeholder="الرمز البريدي"
                              />
                            </div>
                          </>
                        )}
                      </li>
                      <li>
    <MdOutlineSmartphone style={{ marginBottom: '-3px', marginLeft: '5px' }} />
    <strong style={{ marginLeft: '5px' }}>هاتف ولي الأمر:</strong>
    {isEditing ? (
      <input
        type="text"
        name="parentPhone"
        value={formValues.parentPhone || ''}
        onChange={handleChange}
        placeholder="هاتف ولي الأمر"
        maxLength={9}
      />
    ) : (
      student.parentPhone.startsWith('+966')
        ? `0${student.parentPhone.slice(4)}`
        : student.parentPhone
    )}
  </li>
  <li>
    <FaRegIdCard style={{ marginBottom: '-3px', marginLeft: '5px' }} />
    <strong style={{ marginLeft: '5px' }}>الهوية الوطنية أو الاقامة الخاصة بولي الأمر</strong>
    {isEditing ? (
      <input
        type="text"
        name="parentUid"
        value={formValues.parentUid || ''}
        onChange={handleChange}
        placeholder="الهوية الوطنية أو الاقامة"
        maxLength={10}
      />
    ) : (
      student.parentUid
    )}
  </li>
                    </ul>
                  </div>
                </ItemContainer>
              </div>
              
              {student.status === 'active' && (
                <div className="half">
                  <ItemContainer>
                    <ul className="bus-details-list">
                      {studentBus ? (
                        <>
                          <div className="container-box-detail">
                            <h2>معلومات الحافلة</h2>
                            <button className="no-button" onClick={handleUnassignBus}>
                              {isAssigning ? (
                                <CgSpinnerAlt className="spinner" />
                              ) : (
                                <IoTrashBinOutline
                                  size={20}
                                  className="hover-icon"
                                  style={{ color: 'red', marginBottom: '20px' }}
                                />
                              )}
                            </button>
                          </div>
                          <hr />
                          <li>
                            <GoHash style={{ marginBottom: '-3px', marginLeft: '5px' }} />
                            <strong style={{ marginLeft: '5px' }}>رقم الحافلة:</strong>
                            {studentBus.uid ? studentBus.uid.split('B')[1] : ''}
                          </li>
                          <li>
                            <FaBus style={{ marginBottom: '-3px', marginLeft: '5px' }} />
                            <strong style={{ marginLeft: '5px' }}>اسم الحافلة:</strong>
                            {studentBus.name}
                          </li>
                        </>
                      ) : (
                        <>
                          <div className="container-box-detail">
                            <h2>معلومات الحافلة</h2>
                            <div className="some-container">
                              {isAssigning ? (
                                <button className="choose-bus-button" disabled>
                                  <CgSpinnerAlt className="spinner" />
                                </button>
                              ) : (
                                <button
                                  className="choose-bus-button"
                                  onClick={() => setDropdownVisible(!dropdownVisible)}
                                >
                                  {dropdownVisible ? 'إلغاء' : 'تعيين'}
                                </button>
                              )}
                            </div>
                          </div>
                          <hr />
                          {dropdownVisible && availableBuses.length > 0 && (
                            <ul className="bus-dropdown">
                              {availableBuses.map((bus) => (
                                <li
                                  onClick={() => handleBusSelect(bus)}
                                >
                                  حافلة {bus.uid.split('B')[1] } {bus.name} - عدد الطلاب بالحافلة: {bus.currentCapacity}
                                </li>
                              ))}
                            </ul>
                          )}
                          {dropdownVisible && availableBuses.length === 0 && (
                            <li>لا يوجد حافلات متاحة</li>
                          )}
                          {!isAssigning && !dropdownVisible && studentBus === null && (
                            <li>الطالب غير معين لحافلة</li>
                          )}
                        </>
                      )}
                    </ul>
                  </ItemContainer>
                </div>
              )}
              
            </div>
          </div>
        </FormContainer>
      </div>
      <Sidebar />
    </div>
  );
  
}
