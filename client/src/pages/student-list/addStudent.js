import { AddStudentToDatabase } from './studentListData';
import './addStudent.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import FormContainer from '../../components/FormContainer/FormContainer.js';
import Header from '../../components/header/header.js';
import { CgSpinnerAlt } from "react-icons/cg";
import { FaStarOfLife } from "react-icons/fa";
import SuccessMessage from '../../components/successMessage/successMessage.js'


const AddStudent = () => {
  const [studentFirstName, setStudentFirstName] = useState('');
  const [studentFamilyName, setStudentFamilyName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentUid, setParentUid] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [district, setDistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^5[0-9]{8}$/; // Starts with 5 followed by exactly 8 digits
    return phoneRegex.test(phone);
  };

  const validateID = (ID) => {
    const idRegex = /^\d{10}$/; // Must be 10 digits
    return idRegex.test(ID);
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Za-zأ-ي]{2,}$/; // Supports at least 2 letters (Arabic/English)
    return nameRegex.test(name);
  };

  const validatePostalCode = postalCode => /^\d{5}$/.test(postalCode); // 5-digit postal code

  const handlePhoneChange = (e) => {
    if (e.target.value.length <= 9) {
      setParentPhone(e.target.value);
    }
  };

  const handleIdChange = (e) => {
    if (e.target.value.length <= 10) {
      setStudentId(e.target.value);
    }
  };

  const addStudent = async (studentFirstName, studentFamilyName, studentId, parentPhone, city, street, postalCode, district, grade, parentUid) => {
    try {
      setLoading(true);
      const newStudent = {
        studentId: studentId,
        parent_phone: parentPhone,
        studentFirstName: studentFirstName,
        studentFamilyName: studentFamilyName,
        parentUid: parentUid,
        grade: grade,
        address: {
          city: city,
          district: district,
          street: street,
          postalCode: postalCode,
        },
      };
      const response = await AddStudentToDatabase(newStudent);
      console.log(response.err);
      handleSuccessOperation()
    } catch (err) {
      setError('يوجد طالب بهذه الهوية الوطنية او الاقامة مسبقا');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!studentFirstName.trim() || !studentFamilyName.trim() || !studentId.trim() || !parentPhone.trim() || !city.trim() || !street.trim() || !district.trim() || !postalCode.trim() || !grade.trim() || !parentUid.trim()) {
      setError('جميع الحقول مطلوبة.');
      return;
    }

    if (!validateName(studentFirstName)) {
      setError('الاسم يجب أن يحتوي على حرفين على الأقل.');
      return;
    }

    if (!validateName(studentFamilyName)) {
      setError('اسم العائلة يجب أن يحتوي على حرفين على الأقل.');
      return;
    }

    if (!validateID(studentId)) {
      setError('رقم الهوية أو الاقامة يجب ان يكون 10 أرقام.');
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
    addStudent(studentFirstName, studentFamilyName, studentId, parentPhone, city, street, postalCode, district, grade, parentUid);
  };

  const handleSuccessOperation = () => {
    setShowSuccess(false); 
    setTimeout(() => {
      setShowSuccess(true);
      setTimeout(() => navigate('/studentList'), 2000); // Navigate after 2 seconds
    }, 0);
  };
  return (
    <div className="add-student-page">
       {showSuccess && <SuccessMessage message="تم إضافة طالب بنجاح" />}
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
                  الهوية الوطنية أو الإقامة <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} />
                </label>
                <input
                  type="text"
                  id="studentId"
                  className="form-input"
                  value={studentId}
                  onChange={handleIdChange}
                  placeholder="الهوية الوطنية أو الإقامة"
                  maxLength="10"
                />
                <small  style={{color:'gray'}}>{studentId.length}/10</small>

                <label htmlFor="grade" className="form-label">
                  اختر الصف الدراسي <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} />
                </label>
                <select
                  id="grade"
                  className="form-input"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                >
                  <option value="">اختر الصف</option>
                  <option value="الصف الأول">الصف الأول</option>
                  <option value="الصف الثاني">الصف الثاني</option>
                  <option value="الصف الثالث">الصف الثالث</option>
                  <option value="الصف الرابع">الصف الرابع</option>
                  <option value="الصف الخامس">الصف الخامس</option>
                  <option value="الصف السادس">الصف السادس</option>
                  <option value="الصف السابع">الصف السابع</option>
                  <option value="الصف الثامن">الصف الثامن</option>
                  <option value="الصف التاسع">الصف التاسع</option>
                  <option value="الصف العاشر">الصف العاشر</option>
                  <option value="الصف الحادي عشر">الصف الحادي عشر</option>
                  <option value="الصف الثاني عشر">الصف الثاني عشر</option>
                </select>
                <div className="title-container">
                  <h3>معلومات ولي الأمر</h3>
                  <div className="line"></div>
                </div>

                <label htmlFor="parentUid" className="form-label">
                  الهوية الوطنية أو الإقامة لولي الأمر <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} />
                </label>
                <input
                  type="text"
                  id="parentUid"
                  className="form-input"
                  value={parentUid}
                  onChange={(e) => setParentUid(e.target.value)}
                  placeholder="الهوية الوطنية أو الإقامة"
                  maxLength="10"
                />
                   <small style={{color:'gray'}}>{parentUid.length}/10</small>

                <label htmlFor="parentPhone" className="form-label">
                  رقم جوال ولي أمر الطالب <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} />
                </label>
                <div className="phone-input" style={{ display: 'flex' }}>
                  <input
                    type="text"
                    id="parentPhone"
                    className="form-input"
                    value={parentPhone}
                    onChange={handlePhoneChange}
                    placeholder="5xxxxxxxx"
                    style={{ direction: 'ltr' }}
                    maxLength="9"
                  />
                  <input type="text" className="form-input" value="966+" disabled style={{ width: '35px' }} />
                </div>
                <small  style={{color:'gray'}}>{parentPhone.length}/9</small>

                <div className="title-container">
                  <h3>معلومات عنوان الطالب</h3>
                  <div className="line"></div>
                </div>
                {/* Continue with other form fields for address */}
                <label htmlFor="city" className="form-label">المدينة <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /></label>
                <input
                  type="text"
                  id="city"
                  className="form-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="المدينة"
                />

                <label htmlFor="district" className="form-label">الحي <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /></label>
                <input
                  type="text"
                  id="district"
                  className="form-input"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="الحي"
                />

                <label htmlFor="street" className="form-label">الشارع <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /></label>
                <input
                  type="text"
                  id="street"
                  className="form-input"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="الشارع"
                />

                <label htmlFor="postalCode" className="form-label">الرمز البريدي <FaStarOfLife size={6} style={{ color: 'red', marginRight: '5px', marginBottom: '5px' }} /></label>
                <input
                  type="text"
                  id="postalCode"
                  className="form-input"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="الرمز البريدي"
                />

                {error && <p className="error-message">{error}</p>}

                <div className='button-area'>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? <>جاري الإضافة <CgSpinnerAlt style={{ marginRight: '2px' }} className='spinner' /></> : 'إضافة'}
                  </button>
                </div>
              </div>
            </form>
          </FormContainer>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
