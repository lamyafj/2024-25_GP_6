import React from 'react';
import './FormContainer.css';
//import TextField from '../input/input.js'

function FormContainer(props) {
  return (
    <div className='FormContainer'>
      
      <div className='content'>
       
      {props.children}
 
      </div>
     
    </div>
  );
}

export default FormContainer;