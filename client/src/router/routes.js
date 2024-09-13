import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/login/login.js';
import AdminDashboard from '../pages/adminDashboard/adminDashboard.js'
import {Sidebar} from '../components/Sidebar/Sidebar.js'

const AppRouter= () => {
    return (
        <Router>
          <Sidebar />
          <Routes>
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          </Routes>
      </Router>
    );
  }
  
  export default AppRouter;