import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login.js';
import AdminDashboard from './pages/adminDashboard/adminDashboard.js'
import { Sidebar } from './components/Sidebar/Sidebar.js';

function App() {
  return (
    <Router>
      <div>
        <Sidebar />
        <Routes>
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;