
import React from 'react';
//import './Spinner.css'; 

export default function Loading() {
    return (
      <div style={{ height: '100vh', width: '100vw', margin: '0', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <img src="../MaslakgifwithName.gif" class="ld ld-surprise" alt="Logo" style={{ width: '300px', height: 'auto', marginLeft:'10px' }} />
       {/* <div className="spinner">
    <div className="double-bounce1"></div>
    <div className="double-bounce2"></div>
  </div> */}
      </div>
    );
  }

