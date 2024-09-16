// // // src/routes/ProtectedRoute.js
// import React from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useLocation } from 'react-router-dom';

// const ProtectedRoute = ({ element }) => {
//   const { user } = useAuth();
//   const location = useLocation();
  
//   if (user) {
//     return element;
//   } else {
//     return (
//       <div>
//         <h1>Unauthorized Access</h1>
//         <p>You do not have permission to view this page.</p>
//       </div>
//     );
//   }
// };

// export default ProtectedRoute;
