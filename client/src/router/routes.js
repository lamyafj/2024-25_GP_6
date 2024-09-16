// // src/router/routes.js
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from '../pages/login/login';
// import AdminDashboard from '../pages/adminDashboard/adminDashboard';
// import { Sidebar } from '../components/Sidebar/Sidebar';
// import { AuthProvider } from '../context/AuthContext';
// import ProtectedRoute from './ProtectedRoute';

// const AppRoutes = () => {
//   return (
//     <div>
//       <Sidebar />
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route
//           path="/adminDashboard"
//           element={<ProtectedRoute element={<AdminDashboard />} />}
//         />
//         {/* Add other routes here */}
//       </Routes>
//     </div>
//   );
// };

// const AppRouter = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <AppRoutes />
//       </Router>
//     </AuthProvider>
//   );
// };

// export default AppRouter;
