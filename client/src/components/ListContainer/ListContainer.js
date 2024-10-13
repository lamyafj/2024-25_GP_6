import { FaBus } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { CgSpinnerAlt } from 'react-icons/cg';
import './ListContainer.css';
import { IoTrashBinOutline } from "react-icons/io5";


const ListContainer = ({ listType, buses, drivers, students, driverdelete, studentdetail,driverdetail, busdelete, busdetail, loading }) => {
  return (
    <div>
      {/* Conditionally show drivers or buses based on listType prop */}
      {listType === 'drivers' && drivers ? (
        drivers.length === 0 ? (
          <p>لا يوجد سائقين</p>
        ) : (
          <>
            {/* Drivers without a bus */}
            <div className="title-container">
              <h3>سائقين من دون حافلة</h3>
              <div className="line"></div>
            </div>
            {drivers.filter(driver => !driver.bus && driver.status === 'active').map((driver, index) => (
              <div key={index} className="driver-list-item">
                <div className="driver-details">
                  <FaUser size={24} style={{ direction: "rtl", marginLeft: '10px', color: 'grey' }} />
                  <p>{`${driver.driverFirstName} ${driver.driverFamilyName}`}</p>
                </div>
                <button className="details-driver-button" onClick={() => driverdetail(driver.uid)}>تفاصيل</button>
              </div>
            ))}

            {/* Drivers with a bus */}
            <div className="title-container">
              <h3>سائقين بحافلة</h3>
              <div className="line"></div>
            </div>
            {drivers.filter(driver => driver.bus && driver.status === 'active').map((driver, index) => (
              <div key={index} className="driver-list-item">
                <div className="driver-details">
                  <FaUser size={24} style={{ direction: "rtl", marginLeft: '10px', color: 'grey' }} />
                  <p>{`${driver.driverFirstName} ${driver.driverFamilyName}`}</p>
                </div>
                <button className="details-driver-button" onClick={() => driverdetail(driver.uid)}>تفاصيل</button>
              </div>
            ))}

            {/* Inactive drivers */}
            <div className="title-container">
              <h3>سائقين تم الغاء تسجيلهم</h3>
              <div className="line"></div>
            </div>
            {drivers.filter(driver => driver.status === 'inactive').map((driver, index) => (
              <div key={index} className="driver-list-item" style={{backgroundColor:'#dcdcdc'}}>
                <div className="driver-details">
                  <FaUser size={24} style={{ direction: "rtl", marginLeft: '10px', color: 'grey' }} />
                  <p>{`${driver.driverFirstName} ${driver.driverFamilyName}`}</p>
                </div>
                <button className="details-driver-button" style={{backgroundColor:'#8f8f8f'}} onClick={() => driverdetail(driver.uid)}>تفاصيل</button>
              </div>
            ))}
          </>
        )
      ) : listType === 'buses' && buses ? (
        buses.length === 0 ? (
          <p>لا يوجد حافلات</p>
        ) : (
          <>
            {/* Buses without an assigned driver */}
            <div className="title-container">
              <h3>حافلات بدون سائق</h3>
              <div className="line"></div>
            </div>
            {buses.filter(bus => !bus.driver).map((bus, index) => (
              <div key={index} className="bus-list-item">
                <div className="bus-details">
                  <FaBus size={24} style={{ direction: "rtl", marginLeft: '10px', color: 'grey' }} />
                  <p>#رقم الحافلة {bus.id}</p>
                </div>
                <button className="details-bus-button" onClick={() => busdetail(bus.uid)}>تفاصيل</button>
                {/* <button 
                  className="delete-bus-button" 
                  onClick={() => busdelete(bus.uid)}
                > 
                  {loading === bus.uid ? <CgSpinnerAlt className="spinner" /> : 'حذف'}
                </button> */}
              </div>
            ))}

            {/* Buses with an assigned driver */}
            <div className="title-container">
              <h3>حافلات مع سائق</h3>
              <div className="line"></div>
            </div>
            {buses.filter(bus => bus.driver).map((bus, index) => (
              <div key={index} className="bus-list-item">
                <div className="bus-details">
                  <FaBus size={24} style={{ direction: "rtl", marginLeft: '10px', color: 'grey' }} />
                  <p>#رقم الحافلة {bus.id}</p>
                </div>
                <button className="details-bus-button" onClick={() => busdetail(bus.uid)}>تفاصيل</button>
                {/* <button 
                  className="delete-bus-button" 
                  onClick={() => busdelete(bus.uid)}
                > 
                  {loading === bus.uid ? <CgSpinnerAlt className="spinner" /> : 'حذف'}
                </button> */}
              </div>
            ))}
          </>
        )
      ) : listType === 'students' && students ? (
        students.length === 0 ? (
          <p>لا يوجد طلاب</p>
        ) : (
          <>
          {/* Inactive students */}
          <div className="title-container">
            <h3>طلاب  تحت المراجعه</h3>
            <div className="line"></div>
          </div>
          {students.filter(student => student.status === 'inactive').map((student, index) => (
            <div key={index} className="bus-list-item" >
              <div className="bus-details">
                <p> {`${student.student_first_name} ${student.student_family_name}`}</p>
              </div>
              <button className="details-driver-button"  onClick={() => studentdetail(student.uid)}>تفاصيل</button>
              {/* <button className="details-driver-button" style={{ backgroundColor: 'green' ,marginRight:'1px'}} onClick={() => studentdetail(student.uid)}>قبول</button>
              <button className="delete-bus-button"  onClick={() => studentdetail(student.uid)}>رفض</button> */}
            </div>
          ))}

          {/* Active students without an assigned bus */}
          <div className="title-container">
            <h3>طلاب من دون حافلة</h3>
            <div className="line"></div>
          </div>
          {students.filter(student => student.status === 'active' && !student.bus).map((student, index) => (
            <div key={index} className="bus-list-item">
              <div className="bus-details">
                <p>{`${student.student_first_name} ${student.student_family_name}`}</p>
              </div>
              <button className="details-driver-button" onClick={() => studentdetail(student.uid)}>تفاصيل</button>
            </div>
          ))}

          {/* Active students with an assigned bus */}
          <div className="title-container">
            <h3>طلاب بحافلة</h3>
            <div className="line"></div>
          </div>
          {students.filter(student => student.status === 'active' && student.bus).map((student, index) => (
            <div key={index} className="bus-list-item">
              <div className="bus-details">
                <p>{`${student.student_first_name} ${student.student_family_name}`}</p>
              </div>
              <button className="details-driver-button" onClick={() => studentdetail(student.uid)}>تفاصيل</button>
            </div>
          ))}
        </>
        )
      ) : listType === 'studentInbus' && students ? (
        /* Specific condition for students in a bus */
        students.filter(student => student.bus).map((student, index) => (
          <div key={index} className="bus-list-item">
            <div className="bus-details">
              <p> {`${student.student_first_name} ${student.student_family_name}`} </p>
            </div>    
            {`${student.city} ,${student.district} , ${student.street} ,${student.postal_code}`}
            {/* <IoTrashBinOutline size={20} className="hover-icon" style={{ color: 'red',marginLeft:'10px',marginRight:'10px', marginBottom: '1px' }} /> */}
          </div>
        ))
      ): (
        <p>لا توجد بيانات</p>
      )}
    </div>
  );
};

export default ListContainer;
