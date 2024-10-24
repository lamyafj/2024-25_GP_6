import React from 'react';
import './GreenContainer.css';
import TextField from '../input/input.js'

function GreenContainer(props) {
  return (
    <div className='GreenContainer'>
      
      {/* <div className='green-header'>
      <h1 style={{color:'white'}}>تسجيل الدخول</h1>
      </div> */}
      <div className='content'>
       
      {props.children}

      
      </div>
     
    </div>
  );
}

export default GreenContainer;
