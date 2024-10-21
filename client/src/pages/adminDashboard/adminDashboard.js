import './AdminDashboard.css';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import Header from '../../components/header/header.js';
import Loading from '../loading/loading.js';
import { SchoolRecordContext } from '../../context/UserContext';
import React, { useContext, useState, useEffect } from 'react';
import { database, ref, onValue } from '../../firebaseConfig'; // Import Firebase utilities

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [realtimeData, setRealtimeData] = useState(null); // State for storing real-time data
  const { schoolRecord, error } = useContext(SchoolRecordContext);
  const schoolCode = schoolRecord?.schoolCode;
  const [cardUIDs, setCardUIDs] = useState([]);

  // Use Firebase Realtime Database to fetch constant stream of data
  useEffect(() => {
    // Replace 'path/to/data' with your Firebase database reference path
    const dataRef = ref(database, '/cards');
    
    // Listen for real-time updates
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Extract card_uid values
        const cardUIDsArray = Object.values(data).map(card => card.card_uid);
        setCardUIDs(cardUIDsArray);
      }
      setLoading(false); // Stop loading once data is received
    }, (error) => {
      console.error("Error fetching real-time data:", error);
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <Header schoolCode={schoolCode} />
      {/* Example of displaying real-time data */}
      <div className="realtime-data">
        <h2>Real-time RFID cards data:</h2>
        <pre style={{fontSize:'20px'}}>{JSON.stringify(cardUIDs, null, 2)}</pre>
      </div>
    </div>
  );
}
