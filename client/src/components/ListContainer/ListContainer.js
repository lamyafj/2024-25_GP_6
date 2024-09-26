import { FaBus } from 'react-icons/fa';
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