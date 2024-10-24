import './setting.css';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import Header from '../../components/header/header.js';
import { SchoolRecordContext } from '../../context/UserContext';
import {PasswordReset} from '../../BringsSchoolRecord.js'
import {sendPasswordReset} from '../../pages/login/handleLogin.js'
import React, { useContext, useEffect, useState } from 'react';
import FormContainer from '../../components/FormContainer/FormContainer.js';
import ItemContainer from '../../components/itemContainer/itemContainer.js';
import { useNavigate } from 'react-router-dom'; 
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineSmartphone, MdOutlineOtherHouses } from "react-icons/md";
import { CgSpinnerAlt } from "react-icons/cg";
import { EditSchoolDetail } from '../../BringsSchoolRecord.js';
import { RiQuestionFill } from "react-icons/ri";
import ConfirmationModal from '../../components/Confirmation/confirm.js';
import SuccessMessage from '../../components/successMessage/successMessage.js'
import HandleLogout from '../../pages/login/handleLogout';

export default function Setting() {
  const { schoolRecord, refetchSchoolRecord, loading ,error} = useContext(SchoolRecordContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuccessPassword, setShowSuccessPassword] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  
  const navigate = useNavigate();

  const handleEditClick = () => {
    if (schoolRecord) {
      setIsEditing(true);
      setFormValues({
        schoolName: schoolRecord.schoolName || '',
        phoneNumber: schoolRecord.phoneNumber || '',
        ...schoolRecord.address,
      });
    } else {
      console.error('School record is not loaded yet.');
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    console.log(formValues)
  };

  const handleChangeEmail = () => {
    navigate('/changeEmail');
  };

const handleChangePassword = async () => {
    try{ 
   await sendPasswordReset(schoolRecord.email)
   handlePasswordSuccessOperation()
}catch(error){
  setSaveError('عذرا فشل في ارسال بريد لاعادة تعيين كلمة المرور')
}
  };

  const handleSave = async () => {
    setIsSaving(true);

    const { schoolName, phoneNumber, city, street, district, postalCode } = formValues;

    if (!schoolName.trim() || !phoneNumber.trim() || !city.trim() || !street.trim() || !district.trim() || !postalCode.trim()) {
      setSaveError('جميع الحقول مطلوبة.');
      setIsSaving(false);
      return;
    }

    try {
      await EditSchoolDetail(formValues); // Replace with actual save function
      setIsEditing(false);
      setSaveError('');
      handleSuccessOperation()
      handleReFetch()
    } catch (err) {
      setSaveError('فشل في حفظ التغييرات. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReFetch = () => {
    refetchSchoolRecord();
  };


  const handleCancel = () => {
    setFormValues({
      schoolName: schoolRecord?.schoolName || '',
      phoneNumber: schoolRecord?.phoneNumber || '',
      ...schoolRecord?.address
    });
    setSaveError(null);
    setIsEditing(false);
  };

  const handleSuccessOperation = () => {
    setShowSuccess(false); 
    setTimeout(() => {
      setShowSuccess(true);
    }, 0);
  };
  const handlePasswordSuccessOperation = () => {
    setShowSuccess(false);
    setTimeout(() => {
      setShowSuccessPassword(true);
      setTimeout(async () => {
        await HandleLogout(navigate); // Perform the logout after 2 seconds
      }, 2000);
    }, 0);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    console.log('School Record:', schoolRecord);
    if (!schoolRecord) {
      console.log('School record is not available.');
    }
  }, [schoolRecord]);

  return (
    <div className="admin-dashboard">
         {showSuccessPassword && <SuccessMessage message="تم ارسال البريد بنجاح" />}
         {showSuccess && <SuccessMessage message="تم التعديل بنجاح" />}
      <Sidebar />
      <Header />
      {!isEditing && (
        <button
          className="settings-back-button"
          onClick={() => navigate(-1)}
        >
          عودة
        </button>
      )}
      <div style={{display:'flex' , marginTop:'20px'}}>
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
      )}</div>
      <div>
        <FormContainer>
          <ItemContainer>
          <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}> 
              <h2>معلومات المدرسة</h2>
              {!isEditing && (
                <button className="no-button" onClick={handleEditClick}>
                  <FiEdit3 size={20} className="hover-icon" />
                </button>
              )}
            </div>
            <hr />
            <div className='school-detail'>
              {schoolRecord ? (
                <ul className="student-details-list">
                  <li>
                   
                    <strong style={{ marginLeft: '5px' }}>رمز المدرسة:</strong>
                    <div style={{ display: 'inline-block', position: 'relative' }}>
                        <span>{schoolRecord.uid}</span>
                        <span class="tooltip-icon"><RiQuestionFill style={{marginBottom: '-3px', marginRight: '5px' }}/></span>
                        <span class="tooltip-text">
                         يُرجى مشاركته مع أولياء الأمور الراغبين في تسجيل أبنائهم في الحافلات عبر تطبيق مسلك.
                        </span>
                    </div>
                    </li>
                  <li>
                   
                    <strong style={{ marginLeft: '5px' }}>اسم المدرسة:</strong>
                    {!isEditing ? (
                      schoolRecord.schoolName
                    ) : (
                      <input
                        type="text"
                        name="schoolName"
                        value={formValues.schoolName || ''}
                        onChange={handleChange}
                        placeholder="اسم المدرسة"
                      />
                    )}
                  </li>
                  <li>
                
                    <strong style={{ marginLeft: '5px' }}>رقم هاتف المدرسة:</strong>
                    {!isEditing ? (
                      schoolRecord.phoneNumber.startsWith('966') ? `0${schoolRecord.phoneNumber.slice(4)}` : schoolRecord.phoneNumber
                    ) : (
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formValues.phoneNumber || ''}
                        onChange={handleChange}
                        placeholder="رقم هاتف المدرسة"
                      />
                    )}
                  </li>
                  <li>
                   
                    <strong style={{ marginLeft: '5px' }}>عنوان المدرسة:</strong>
                    {!isEditing ? (
                      <span>
                        {schoolRecord.address?.city}, {schoolRecord.address?.street}, {schoolRecord.address?.postalCode}, {schoolRecord.address?.district}
                      </span>
                    ) : (
                      <>
                        <div>
                          <label htmlFor="city">المدينة:</label>
                          <input
                            type="text"
                            name="city"
                            id="city"
                            value={formValues.city || ''}
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
                            value={formValues.street || ''}
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
                            value={formValues.district || ''}
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
                            value={formValues.postalCode || ''}
                            onChange={handleChange}
                            placeholder="الرمز البريدي"
                          />
                        </div>
                      </>
                    )}
                                </li>
                                <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}> 
                        <h2>معلومات الحساب</h2>

                        </div>
                        <hr />
                    <li style={{ textAlign: 'right' }}>
                       
                        <strong style={{ marginLeft: '5px' }}>البريد الإلكتروني الخاص بالمدرسة:</strong>
                        {schoolRecord.email}
                    <button className="change-button" style={{ float: 'left' }} onClick={handleChangeEmail}>تغيير البريد الإلكتروني</button>
                    </li>
                    <li style={{ textAlign: 'right' }}>
                      
                        <strong style={{ marginLeft: '5px' }}>الرمز السري الخاص بحساب المدرسة</strong>
                        <div style={{ display: 'inline-block', position: 'relative' }}>
                        <span class="tooltip-icon"><RiQuestionFill style={{marginBottom: '-3px', marginRight: '5px' }}/></span>
                        <span class="tooltip-text">
                       عند تغيير كلمة المرور ستتلقى رسالة عبر البريد الإلكتروني تحتوي على رابط لإتمام عملية التغيير.
                        </span>
                        </div>
                        <>
      <button
        className="change-button"
        style={{ float: 'left' }}
        onClick={handleOpenModal}
      >
        تغيير الرمز السري
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          setModalOpen(false); 
          handleChangePassword(); 
        }}
      >
      <p>هل أنت متأكد من أنك تريد تغيير الرمز السري؟<br/> سيتم ارسال رسالة عبر البريد الالكتروني لتغيير كلمه المرور <br/> الرجاء اعادة تسجيل الدخول</p>
      </ConfirmationModal>
    </>
                    </li>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}> 
                        <h2>احصائيات المدرسة</h2>
                        </div>
                        <hr />
                        <li>
                   
                    <strong style={{ marginLeft: '5px' }}> إجمالي عدد الطلبة المسجلين بالحافلات:</strong>
                    <div style={{ display: 'inline-block', position: 'relative' }}>
                       {schoolRecord.students.length}
                    </div>
                    </li>
                    <li>
                 
                    <strong style={{ marginLeft: '5px' }}>إجمالي عدد الحافلات:</strong>
                    <div style={{ display: 'inline-block', position: 'relative' }}>
                       {schoolRecord.buses.length}
                    </div>
                    </li>
                    <li>
                  
                    <strong style={{ marginLeft: '5px' }}>إجمالي عدد السائقين (النشطين وغير النشطين):</strong>
                    <div style={{ display: 'inline-block', position: 'relative' }}>
                       {schoolRecord.drivers.length}
                    </div>
                    </li>
                </ul>
                
              ) : (
                <p>Loading school record...</p>
              )}
            </div>
            {saveError && <div className="error-message">{saveError}</div>}
          </ItemContainer>
        </FormContainer>
      </div>
    </div>
  );
}
