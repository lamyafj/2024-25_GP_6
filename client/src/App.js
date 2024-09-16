import AdminDashboard from './pages/adminDashboard/adminDashboard.js';
import Login from './pages/login/login.js';
import Signup from './pages/signup/signup.js';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './router/ProtectedRoute.js'; // Import the ProtectedRoute component

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        {/* Protect the Admin Dashboard route */}
        {/* <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute element={<AdminDashboard />} />
          }
        /> */}
      </Routes>
    </div>
  );
}

export default App;
