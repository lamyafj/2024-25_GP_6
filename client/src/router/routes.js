import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from '../pages/login/login.js';
import AdminDashboard from '../pages/adminDashboard/adminDashboard.js';
import { Sidebar } from '../components/Sidebar/Sidebar.js';

const AppRouter = () => {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

const AppRoutes = () => {
    const location = useLocation();
    const shouldShowSidebar = location.pathname !== '/login';

    return (
        <div>
            {shouldShowSidebar && <Sidebar />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/adminDashboard" element={<AdminDashboard />} />
            </Routes>
        </div>
    );
}

export default AppRouter;
