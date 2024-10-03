import { FaBus } from 'react-icons/fa';
import './ListContainer.css';
import { CgSpinnerAlt } from "react-icons/cg";

const ListContainer = ({ buses, fun, fundetail, loading }) => {  
  return (
    <div>
      {buses.map((bus, index) => (
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
      ))}
    </div>
  );
};


export default ListContainer;


