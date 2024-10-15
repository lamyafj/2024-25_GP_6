import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { IoCheckmarkSharp } from "react-icons/io5";
import './successMessage.css'; // Ensure your CSS for animations is correct

const SuccessMessage = ({ message }) => {
  const [showMessage, setShowMessage] = useState(true);
  const nodeRef = useRef(null); // Create a ref to pass to the CSSTransition component

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(false), 2000); // Hide after 3 seconds
    return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
  }, []);

  return (
    <CSSTransition
      in={showMessage}
      timeout={500}
      classNames="fade"
      unmountOnExit
      nodeRef={nodeRef} // Pass the ref to avoid the findDOMNode warning
    >
      <div ref={nodeRef} className="success-message">
        <span className="checkmark"><IoCheckmarkSharp /></span>
        {message}
      </div>
    </CSSTransition>
  );
};

export default SuccessMessage;
