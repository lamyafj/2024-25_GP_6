import React from 'react';
import './GreenContainer.css';
import TextField from '../input/input.js'

function GreenContainer(props) {
  return (
    <div className='GreenContainer'>
      
      <div className='content'>
       
      {props.children}

      
      </div>
     
    </div>
  );
}

export default GreenContainer;
