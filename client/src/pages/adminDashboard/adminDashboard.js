import './AdminDashboard.css';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import Header from '../../components/header/header.js';
import Loading from '../loading/loading.js';
import { SchoolRecordContext } from '../../context/UserContext';
import React, { useContext, useState, useEffect } from 'react';
import SettingsForm from '../../components/SettingsForm/SettingsForm';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Cookies from 'js-cookie';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [schoolImage, setSchoolImage] = useState('default-logo.png'); // Default image
  const { schoolRecord } = useContext(SchoolRecordContext);
  const schoolId = schoolRecord?.uid;

  useEffect(() => {
    const fetchSchoolData = async () => {
      if (!schoolId) {
        setLoading(false);
        return; // Exit early if schoolId is not available
      }
      
      // Simulate loading state, you can add actual data fetching logic if needed
      setTimeout(() => {
        setLoading(false);
        if (schoolRecord?.imageUrl) {
          setSchoolImage(schoolRecord.imageUrl);
        }
      }, 3000);
    };

    fetchSchoolData();
  }, [schoolId, schoolRecord]);

  const toggleSettingsForm = () => {
    setShowSettingsForm(!showSettingsForm);
  };

  const handleSettingsSubmit = (updatedData) => {
    // Optionally handle the updated data here if needed
    setSchoolImage(updatedData.imageUrl);
    alert('تم تحديث معلومات المدرسة بنجاح');
    setShowSettingsForm(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Header toggleSettingsForm={toggleSettingsForm} schoolImage={schoolImage} />
        <h2 className="dashboard-title">لوحة التحكم</h2>
        {showSettingsForm && (
          <div className="settings-form">
            <SettingsForm onSubmit={handleSettingsSubmit} schoolId={schoolId} />
          </div>
        )}
        {/* Render the rest of your admin dashboard content here */}
      </div>
    </div>
  );
}
