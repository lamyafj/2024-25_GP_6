import AdminDashboard from './pages/adminDashboard/adminDashboard.js';
import Login from './pages/login/login.js';
import Signup from './pages/signup/signup.js';
import { Route, Routes } from 'react-router-dom';
import RequireAuth from './context/AuthContext.js'; // Updated path
import BusList from './pages/busList/busList.js';
import Loading from './pages/loading/loading.js';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/loading" element={<Loading/>}/>
        <Route 
          path="/adminDashboard" 
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          } 
        />
        <Route 
          path="/busList" 
          element={
            <RequireAuth>
              <BusList />
            </RequireAuth>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
