import { FaBus } from 'react-icons/fa';
import './itemContainer.css';

const ItemContainer = (props) => {  // Destructure both buses and fun from props
  return (
        <div className="container-item">
          <div className="item-details">
            {props.children}
          </div>
       
        </div>

  );
};


export default ItemContainer;