import './AdminDashboard.css';
import { FaBus } from 'react-icons/fa';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import Header from '../../components/header/header.js';
import Loading from '../loading/loading.js';
import { SchoolRecordContext } from '../../context/UserContext';
import React, { useContext, useState, useEffect } from 'react';


export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const { schoolRecord, error } = useContext(SchoolRecordContext);
  const schoolCode = schoolRecord?.schoolCode;

  // Simulate data fetching with useEffect (replace with your actual fetch logic)
  useEffect(() => {
    // Simulating a fetch request with setTimeout
    setTimeout(() => {
      setLoading(false); // Once data is fetched, set loading to false
    }, 3000); // Simulate a 2-second fetch delay
  }, []);

  // Render a loading spinner until the fetch is done
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-dashboard">
      <Sidebar  />
      <Header schoolCode={schoolCode} />
      {/* Render the rest of your admin dashboard content here */}
    </div>
  );
}
