import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { FaBus } from 'react-icons/fa';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import Header from '../../components/header/header.js';
import Loading from '../loading/loading.js';

// Example loading spinner (you can replace this with any spinner component you prefer)
function LoadingSpinner() {
  return (
    <div className="spinner">
      <p>Loading...</p>
      {/* You can use a spinner component or animation here */}
    </div>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  // Simulate data fetching with useEffect (replace with your actual fetch logic)
  useEffect(() => {
    // Simulating a fetch request with setTimeout
    setTimeout(() => {
      setLoading(false); // Once data is fetched, set loading to false
    }, 2000); // Simulate a 2-second fetch delay
  }, []);

  // Render a loading spinner until the fetch is done
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-dashboard">
      <Sidebar number={1} />
      <Header />
      {/* Render the rest of your admin dashboard content here */}
    </div>
  );
}
