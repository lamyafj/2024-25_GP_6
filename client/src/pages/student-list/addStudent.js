import { AddStudentToDatabase } from './studentListData';
import './addStudent.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import FormContainer from '../../components/FormContainer/FormContainer.js';
import Header from '../../components/header/header.js';
import { CgSpinnerAlt } from "react-icons/cg";
import { FaStarOfLife } from "react-icons/fa";

const AddStudent = () => {
  const [studentFirstName, setStudentFirstName] = useState('');
  const [studentFamilyName, setStudentFamilyName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [district, setDistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^5[0-9]{8}$/; // Regex to match a phone number starting with 5 followed by exactly 8 digits
    return phoneRegex.test(phone);
  };

  const validateID = (ID) => {
    const idRegex = /^\d{1,10}$/; // Regex to match an ID number with a maximum of 10 digits
    return idRegex.test(ID);
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Za-zأ-ي]{2,}$/; // Regex to match at least 3 letters (supports English and Arabic letters)
    return nameRegex.test(name);
  };

  const validatePostalCode = postalCode => /^\d{5}$/.test(postalCode);  // Assuming 5-digit postal codes

  const addStudent = async (studentFirstName, studentFamilyName, studentId, parentPhone, city, street,postalCode,district) => {
    try {
      setLoading(true);
      const newStudent = {
        student_id: studentId,
        parent_phone: parentPhone,
        student_first_name: studentFirstName,
        student_family_name: studentFamilyName,
        city:city,
        street:street,
        postal_code:postalCode,
        district:district,
      };
      await AddStudentToDatabase(newStudent);
      navigate('/studentList');
    } catch (err) {
      setError('Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!studentFirstName.trim() || !studentFamilyName.trim() || !studentId.trim() || !parentPhone.trim() || !city.trim() || !street.trim() || !district.trim() || !postalCode.trim()) {
      setError('جميع الحقول مطلوبة.');
      return;
    }

    if (!validateName(studentFirstName)) {
      setError('الاسم يجب أن يحتوي على حرفين  على الأقل.');
      return;
    }

    if (!validateName(studentFamilyName)) {
      setError('اسم العائلة يجب أن يحتوي على حرفين على الأقل.');
      return;
    }

    if (!validateID(studentId)) {
      setError('رقم الهوية يجب أن يكون بين 1 و 10 أرقام.');
      return;
    }

    if (!validatePhoneNumber(parentPhone)) {
      setError('رقم الجوال يجب أن يبدأ بـ 5 ويتكون من 9 أرقام.');
      return;
    }

    if (!validatePostalCode(postalCode)) {
      setError('رمز البريد يجب أن يكون مكون من 5 أرقام.');
      return;
    }

    setError('');
    addStudent(studentFirstName, studentFamilyName, studentId, parentPhone, city, street, postalCode, district);

  };

  return (
    <div className="add-student-page">
      <Sidebar />
      <div className="add-student-main">
        <Header />
        <div className="student-detail-buttons">
          <button className='back-student-button' onClick={() => navigate('/studentList')}>عودة</button>
        </div>
        <div className="add-student-content">
          <FormContainer>
            <div className="title-container">
              <h1>تسجيل طالب جديد</h1>
              <div className="line"></div>
            </div>
            <form onSubmit={handleSubmit} className="add-student-form">
              <div className="form-group">
                <div className="title-container">
                  <h3>معلومات الطالب الشخصية</h3>
                  <div className="line"></div>
                </div>
                <label htmlFor="studentFirstName" className="form-label">
                  اسم الطالب الأول <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} />
                </label>
                <input
                  type="text"
                  id="studentFirstName"
                  className="form-input"
                  value={studentFirstName}
                  onChange={(e) => setStudentFirstName(e.target.value)}
                  placeholder="اسم الطالب الأول"
                />
                <label htmlFor="studentFamilyName" className="form-label">
                  اسم عائلة الطالب <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} />
                </label>
                <input
                  type="text"
                  id="studentFamilyName"
                  className="form-input"
                  value={studentFamilyName}
                  onChange={(e) => setStudentFamilyName(e.target.value)}
                  placeholder="اسم عائلة الطالب"
                />
                <label htmlFor="studentId" className="form-label">
                  الإقامة أو الهوية الوطنية <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} />
                </label>
                <input
                  type="text"
                  id="studentId"
                  className="form-input"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="الإقامة أو الهوية الوطنية"
                />
                <label htmlFor="parentPhone" className="form-label">
                  رقم جوال ولي أمر الطالب <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} />
                </label>
                <div className="phone-input" style={{ display: 'flex' }}>
                  <input
                    type="text"
                    id="parentPhone"
                    className="form-input"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="5xxxxxxxx"
                    style={{ direction: 'ltr' }}
                  />
                  <input type="text" className="form-input" value="966+" disabled style={{ width: '35px' }} />
                </div>

                <div className="title-container">
                  <h3>معلومات عنوان الطالب</h3>
                  <div className="line"></div>
                </div>
                <label htmlFor="city" className="form-label">المدينة<FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /></label>
                <input
                  type="text"
                  id="city"
                  className="form-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="المدينة"
                />
                <label htmlFor="district" className="form-label">الحي<FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /></label>
                  <input
                    type="text"
                    id="district"
                    className="form-input"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="الحي"
                  />
                <label htmlFor="street" className="form-label">الشارع<FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /></label>
                <input
                  type="text"
                  id="street"
                  className="form-input"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="الشارع"
                />
                <label htmlFor="postal_code" className="form-label">الرمز البريدي<FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /></label>
                  <input
                    type="text"
                    id="postal_code"
                    className="form-input"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="الرمز البريدي"
                  />
                <p style={{marginTop:'30px', color:'#555'}}><FaStarOfLife size={6} style={{ color: 'black', marginLeft: '5px', marginBottom: '0px' }} />عند اضافة الطالب سيتم تنشيط الطالب تلقائيا.</p>
              </div>
              
              {error && <p className="error-message">{error}</p>}
              
              <div className='button-area'>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? <>جاري الإضافة <CgSpinnerAlt style={{ marginRight: '2px' }} className='spinner' /> </> : 'إضافة'}
                </button>
              </div>
            </form>
          </FormContainer>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
