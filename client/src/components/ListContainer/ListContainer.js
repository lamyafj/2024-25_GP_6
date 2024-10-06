import { FaBus } from 'react-icons/fa';
import './ListContainer.css';
import { CgSpinnerAlt } from "react-icons/cg";
import { FaUser } from "react-icons/fa";

const ListContainer = ({ buses, drivers, fun, fundetail, loading }) => {  
  return (
    <div>
      {drivers ? (
        drivers.length === 0 ? (
          <p>لا يوجد سائقين</p>
        ) : (
          drivers.map((driver, index) => (
            <div key={index} className="driver-list-item">
              <div className="driver-details">
                <FaUser size={24} style={{ direction: "rtl", marginLeft: '10px', color: 'grey' }} />
                <p>اسم السائق: {`${driver.driverFirstName} ${driver.driverFamilyName}`}</p>{/* Display the driver's name dynamically */}
              </div>
              <button className="details-driver-button" onClick={() => fundetail(driver.uid)}>تفاصيل</button>
              <button 
                value={driver.id} 
                className="delete-driver-button" 
                onClick={() => fun(driver.uid)}
              > 
                {loading === driver.uid ? <CgSpinnerAlt className='spinner'/> : 'حذف'}
              </button>
            </div>
          ))
        )
      ) : (
        buses ? (
          buses.length === 0 ? (
            <p>لا يوجد باصات</p>
          ) : (
            buses.map((bus, index) => (
              <div key={index} className="bus-list-item">
                <div className="bus-details">
                  <FaBus size={24} style={{ direction: "rtl", marginLeft: '10px', color: 'grey' }} />
                  <p>#رقم الباص {bus.id}</p> {/* Display the bus ID dynamically */}
                </div>
                <button className="delete-bus-details" onClick={() => fundetail(bus.uid)}>تفاصيل</button>
                <button 
                  value={bus.id} 
                  className="delete-bus-button" 
                  onClick={() => fun(bus.uid)}
                > 
                  {loading === bus.uid ? <CgSpinnerAlt className='spinner'/> : 'حذف'}
                </button>
              </div>
            ))
          )
        ) : (
          <p>No data available</p>
        )
      )}
    </div>
  );
};



export default ListContainer;


