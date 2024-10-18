import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL, UPDATEDSCHOOL, SCHOOLDATA } from '../../Api/Api'; // Adjust the path if needed
import './SettingsForm.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { CgSpinnerAlt } from "react-icons/cg";

const SettingsForm = ({ onSubmit, schoolId }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState({
    district: '',
    street: '',
    streetAlt: '',
    postalCode: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const idToken = Cookies.get('session'); // Get the session token from cookies
      if (!schoolId) {
        setLoading(false);
        return; // Early exit if schoolId is not defined
      }

      try {
        const response = await axios.post(`${baseURL}/${SCHOOLDATA}`, {}, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          withCredentials: true,
        });

        const schoolData = response.data;
        if (schoolData) {
          setPhoneNumber(schoolData.phoneNumber || '');
          setAddress({
            district: schoolData.address?.district || '',
            street: schoolData.address?.street || '',
            streetAlt: schoolData.address?.streetAlt || '',
            postalCode: schoolData.address?.postalCode || '',
          });
        }
      } catch (error) {
        console.error('Error fetching school data:', error);
        setError(error.response?.data || 'حدث خطأ أثناء جلب بيانات المدرسة'); // Fallback to a generic message
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchData();
  }, [schoolId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error state

    const idToken = Cookies.get('session');
    const updatedData = {
      phoneNumber,
      address,
    };

    try {
      const response = await axios.put(`${baseURL}/${UPDATEDSCHOOL}`, updatedData, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        alert('تم حفظ التغييرات بنجاح');
        onSubmit(updatedData); // Call onSubmit prop to inform parent component
      }
    } catch (error) {
      console.error('Error saving school data:', error);
      setError(error.response?.data || 'حدث خطأ أثناء حفظ بيانات المدرسة'); // Fallback to a generic message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-main">
        <div className="settings-header">
          <button className="back-button" onClick={() => navigate('/previousPage')}>
            عودة
          </button>
        </div>
        <div className="settings-content">
          <h2 className="form-title">تعديل معلومات المدرسة</h2>
          {error && <p className="error-message">{error}</p>}
          {loading ? (
            <p>جاري تحميل البيانات...</p>
          ) : (
            <form className="settings-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="phoneNumber" className="form-label">رقم الهاتف:</label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="أدخل رقم الهاتف"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="district" className="form-label">الحي:</label>
                <input
                  type="text"
                  id="district"
                  value={address.district}
                  onChange={(e) => setAddress({ ...address, district: e.target.value })}
                  placeholder="أدخل اسم الحي"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="street" className="form-label">الشارع:</label>
                <input
                  type="text"
                  id="street"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="أدخل اسم الشارع"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="streetAlt" className="form-label">شارع بديل:</label>
                <input
                  type="text"
                  id="streetAlt"
                  value={address.streetAlt}
                  onChange={(e) => setAddress({ ...address, streetAlt: e.target.value })}
                  placeholder="أدخل اسم الشارع البديل"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="postalCode" className="form-label">الرمز البريدي:</label>
                <input
                  type="text"
                  id="postalCode"
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  placeholder="أدخل الرمز البريدي"
                  required
                  className="form-input"
                />
              </div>

              {error && <p className="error-message">{error}</p>}

              <div className="button-area">
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? (
                    <>جاري الحفظ <CgSpinnerAlt style={{ marginRight: '2px' }} className='spinner' /></>
                  ) : 'حفظ التغييرات'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsForm;
