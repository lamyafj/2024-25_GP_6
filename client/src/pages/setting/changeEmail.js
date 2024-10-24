import './changeEmail.css';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import Header from '../../components/header/header.js';
import { SchoolRecordContext } from '../../context/UserContext.js';
import { PasswordReset, ChangeEmail } from '../../BringsSchoolRecord.js'; // Assuming you have UpdateEmail function to handle email changes
import React, { useContext, useState } from 'react';
import FormContainer from '../../components/FormContainer/FormContainer.js';
import ItemContainer from '../../components/itemContainer/itemContainer.js';
import { useNavigate } from 'react-router-dom';
import { CgSpinnerAlt } from "react-icons/cg";
import HandleLogout from '../../pages/login/handleLogout';
import SuccessMessage from '../../components/successMessage/successMessage.js'
import { CiHashtag } from "react-icons/ci";
import ConfirmationModal from '../../components/Confirmation/confirm.js';

export default function ChangeEmailForm() {
const { schoolRecord, error } = useContext(SchoolRecordContext);
  const [isSaving, setIsSaving] = useState(false);
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaveError(''); 
    setIsSaving(true);
    const { email, password } = formValues;
  
    if (!email.trim() || !password.trim()) {
      setSaveError('البريد الإلكتروني وكلمة المرور كلاهما مطلوب.');
      setIsSaving(false);
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSaveError('تنسيق البريد الإلكتروني غير صحيح.');
      setIsSaving(false);
      return;
    }
  
    if (email === schoolRecord.email) {
      setSaveError('البريد الإلكتروني الجديد يجب أن يكون مختلفاً عن البريد المسجل حالياً.');
      setIsSaving(false);
      return;
    }
  
    try {
      const response = await ChangeEmail(schoolRecord.email, email, password);
  
      console.log(response)
      if (!response.success) {
        setSaveError(response.message); 
        setIsSaving(false); // Make sure to reset the saving state
        return;
      }
  
      setModalOpen(false);
      handleSuccessOperation();
      
    } catch (err) {
      setSaveError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً.');
    } finally {
      setIsSaving(false);
    }
  };
  
  
  const handleSuccessOperation = () => {
    setShowSuccess(false);
    setTimeout(() => {
      setShowSuccess(true);
      setTimeout(async () => {
        await HandleLogout(navigate); // Perform the logout after 2 seconds
      }, 2000);
    }, 0);
  };
  

  return (
    <div className="admin-dashboard">
          {showSuccess && <SuccessMessage message="تم التعديل بنجاح" />}
      <Sidebar />
      <Header />
      <button
        className="settings-back-button"
        onClick={() => navigate('/setting')}
        style={{marginBottom:'20px'}}
        >
        عودة
    </button>
      <div>
        <FormContainer>
          <ItemContainer>
            <h2>تغيير البريد الإلكتروني  </h2>
            <hr />
            <div className="change-email-form">
              <div>
                <label htmlFor="email">البريد الإلكتروني الجديد:</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="البريد الإلكتروني الجديد"
                />
              </div>
              <div>
                <label htmlFor="password">كلمة المرور الحالية:</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formValues.password}
                  onChange={handleChange}
                  placeholder="كلمة المرور الحالية"
                />
              </div>
              {saveError && <div className="error-message">{saveError}</div>}
              <div className="button-group">
              <>
      <button
        className="change-email-button"
        onClick={handleOpenModal}
        disabled={isSaving}
      >
        {isSaving ? <CgSpinnerAlt className="spinner" /> : 'تغيير'}
      </button>

      <ConfirmationModal
  isOpen={isModalOpen}
  onClose={() => setModalOpen(false)}
  onConfirm={() => {
    setModalOpen(false); // Close modal immediately
    handleSave(); // Proceed with the save operation
  }}
>
  هل أنت متأكد من أنك تريد تغيير البريد الإلكتروني؟
</ConfirmationModal>

    </>
              </div>
            </div>
          </ItemContainer>
        </FormContainer>
      </div>
    </div>
  );
}
