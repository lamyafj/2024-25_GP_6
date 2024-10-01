// FormContainer.js
import React from 'react';
import './FormContainer.css';

function FormContainer(props) {
  return (
    <div className='FormContainer'>
      <div className='contentContaier'>
        {props.children} {/* This should render children passed to FormContainer */}
      </div>
    </div>
  );
}

export default FormContainer;
