import { FaBus } from 'react-icons/fa';
<<<<<<< HEAD
import './ListContainer.css';

const ListContainer = ({ buses }) => {
  return (
    <div>
      {buses.map((bus, index) => (
        <div key={index} className="bus-list-item">
          <div className="bus-details">
            <FaBus size={24} style={{ direction: "rtl", marginLeft: '10px', color: 'grey' }} />
            <p>#رقم الباص {bus.id}</p> {/* Display the bus ID dynamically */}
          </div>
          <button className="delete-bus-button">حذف</button>
        </div>
      ))}
    </div>
  );
};

export default ListContainer;
=======
import './ListContainer.css'

const ListContainer = () => {
    return (
            <div className="bus-list-item">
              <div className="bus-details">
              <FaBus size={24} style={{direction:"rtl",marginLeft: '10px', color: 'grey' }} />
                <p>#رقم الباص</p>
              </div>
              <button className="delete-bus-button">حذف</button>
            </div>   
    );
  };
  
  export default ListContainer;
>>>>>>> 689a11abd11c287745bf2a86eb4b4b2fa7717b8d
