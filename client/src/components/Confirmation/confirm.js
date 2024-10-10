import React from 'react';
import './confirm.css'; 

const ConfirmationModal = ({ isOpen, onClose, onConfirm, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>{children}</p>
          <div className="modal-buttons">
            <button onClick={onConfirm} className="modal-button">تأكيد</button>
            <button onClick={onClose} className="modal-button cancel">إلغاء</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmationModal;