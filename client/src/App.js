import AdminDashboard from './pages/adminDashboard/adminDashboard.js';
import Login from './pages/login/login.js';
import Signup from './pages/signup/signup.js';
import { Route, Routes } from 'react-router-dom';
import RequireAuth from './context/AuthContext.js'; // Updated path
import BusList from './pages/busList/busList.js';
import Addbus from './pages/busList/addbus.js';
import Busdetail from './pages/busList/busdetail.js';
import Loading from './pages/loading/loading.js';
import BusItem from './components/Busltem/Busltem.js';
import AddDriver from './pages/driver-list/addDriver.js'
import DriverList from './pages/driver-list/driverList.js'
import DriverDetail from './pages/driver-list/driverDetail.js'
import AddStudent from './pages/student-list/addStudent.js'
import StudentList from './pages/student-list/studentList.js'
import StudentDetail from './pages/student-list/studentDetail.js'

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
                <Route 
          path="/addbus" 
          element={
            <RequireAuth>
              <Addbus />
            </RequireAuth>
          } 
        />
                <Route 
          path="/Busltem" 
          element={
            <RequireAuth>
              <BusItem />
            </RequireAuth>
          } 
        />
        <Route 
          path="/busdetail/:uid" 
          element={
            <RequireAuth>
              <Busdetail />
            </RequireAuth>
          } 
        />
        <Route 
          path="/addDriver" 
          element={
            <RequireAuth>
              <AddDriver />
            </RequireAuth>
          } 
        />
        <Route 
          path="/DriverList" 
          element={
            <RequireAuth>
              <DriverList/>
            </RequireAuth>
          } 
        />
        <Route 
          path="/driverDetail/:uid" 
          element={
            <RequireAuth>
              <DriverDetail/>
            </RequireAuth>
          } 
        />
        <Route 
          path="/studentDetail/:uid" 
          element={
            <RequireAuth>
              <StudentDetail/>
            </RequireAuth>
          } 
        />
        <Route 
          path="/studentList" 
          element={
            <RequireAuth>
              <StudentList/>
            </RequireAuth>
          } 
        />
        <Route 
          path="/addStudent" 
          element={
            <RequireAuth>
              <AddStudent/>
            </RequireAuth>
          } 
        />
      </Routes>
      
    </div>
  );
}

export default App;
