import { FaBus } from 'react-icons/fa';
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
