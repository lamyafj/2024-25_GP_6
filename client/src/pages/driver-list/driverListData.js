import axios from 'axios';
import Cookies from 'js-cookie';
//import React, { useEffect, useState } from 'react';
import { baseURL, ADDDRIVER,DRIVERDETAIL,DELETEBUS,DRIVERRECORD,EDITDRIVER,ASSIGNBUSFORDRIVER,UNASSIGNBUSFORDRIVER,INACTIVATEDRIVER,ACTIVATEDRIVER} from '../../Api/Api';



export const BringDriverRecord = async () => {
  const idToken = Cookies.get('session'); 
  if (idToken) {
    try {
      const response = await axios.post(`${baseURL}/${DRIVERRECORD}`, {}, {
        headers: {
          Authorization: `Bearer ${idToken}`, 
        },
        withCredentials: true 
      });
      const record = response.data;
      return record;
    } catch (error) {
      
      console.error('Error accessing protected route:', error.response?.data || error);
      return null; 
    }
  } else {
    console.log('User not authenticated');
    return null; 
  }
};

  
  export const AddDriverToDatabase = async (newdriver) => {
    const idToken = Cookies.get('session'); 
  
    if (!newdriver) {
      console.log('No bus data provided');
      return null;
    }
  
    if (!idToken) {
      console.log('User not authenticated');
      return null;
    }
  
    try {
      const response = await axios.post( `${baseURL}/${ADDDRIVER}`, {newdriver}, 
        {
          headers: {
            Authorization: `Bearer ${idToken}`, 
          },
          withCredentials: true, 
        }
      );
  
      const record = response.data; 
      return record; // Return the record after a successful request
    } catch (error) {
      console.error('Error accessing protected route:', error.response?.data || error);
      return null; // Return null if an error occurs
    }
  };

  export const deleteBusDatabase = async (uid) => {
    const idToken = Cookies.get('session'); 
    if (!uid) {
      console.log('No bus uid is provided');
      return null;
    }
  
    if (!idToken) {
      console.log('User not authenticated');
      return null;
    }
    try {
      const response = await axios.post( `${baseURL}/${DELETEBUS}`, {uid}, 
        {
          headers: {
            Authorization: `Bearer ${idToken}`, 
          },
          withCredentials: true, 
        }
      );
      const record = response.data; 
      BringDriverRecord();
      return record; // Return the record after a successful request
    } catch (error) {
      console.error('Error accessing protected route:', error.response?.data || error);
      return null; // Return null if an error occurs
    }
  };


  export const BringDriverDetail = async (uid) => {
    const idToken = Cookies.get('session'); 
    if (idToken) {
      try {
        const response = await axios.post(`${baseURL}/${DRIVERDETAIL}`, {uid}, {
          headers: {
            Authorization: `Bearer ${idToken}`, 
          },
          withCredentials: true 
        });
        const record = response.data;
        return record;
      } catch (error) {
        
        console.error('Error accessing protected route:', error.response?.data || error);
        return null; 
      }
    } else {
      console.log('User not authenticated');
      return null; 
    }
  };

  export const assignDriverBus = async (driveruid, busuid) => {
    const idToken = Cookies.get('session'); 
    if (idToken) {
      try {
        const response = await axios.post(`${baseURL}/${ASSIGNBUSFORDRIVER}`, { driveruid, busuid }, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          withCredentials: true,
        });
  
        return response.data; // Return the response data
      } catch (error) {
        console.error('Error assigning bus:', error.response?.data || error);
        return { success: false, error: error.response?.data || 'Error assigning bus' };
      }
    } else {
      console.log('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }
  };

  export const UNassignDriverBus = async (driveruid,busuid ) => {
    const idToken = Cookies.get('session'); 
    if (idToken) {
      try {
        const response = await axios.post(`${baseURL}/${UNASSIGNBUSFORDRIVER}`, { driveruid,busuid }, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          withCredentials: true,
        });
  
        return response.data; // Return the response data
      } catch (error) {
        console.error('Error assigning bus:', error.response?.data || error);
        return { success: false, error: error.response?.data || 'Error assigning bus' };
      }
    } else {
      console.log('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }
  };
  
  export const EditDriverDetail = async (uid, formValues) => {
    const idToken = Cookies.get('session'); 
    if (idToken) {
      try {
        const response = await axios.post(`${baseURL}/${EDITDRIVER}`, { uid, formValues }, {
          headers: {
            Authorization: `Bearer ${idToken}`, 
          },
          withCredentials: true 
        });
        return response.data;
      } catch (error) {
        console.error('Error accessing protected route:', error.response?.data || error);
        return null; 
      }
    } else {
      console.log('User not authenticated');
      return null; 
    }
  };
  

  
  export const inActivateDriver = async (uid) => {
    console.log('hi')
    const idToken = Cookies.get('session'); 
    if (idToken) {
      try {
        const response = await axios.post(`${baseURL}/${INACTIVATEDRIVER}`, {uid}, {
          headers: {
            Authorization: `Bearer ${idToken}`, 
          },
          withCredentials: true 
        });
        const record = response.data;
        return record;
      } catch (error) {
        
        console.error('Error accessing protected route:', error.response?.data || error);
        return null; 
      }
    } else {
      console.log('User not authenticated');
      return null; 
    }
  };

  export const activateDriver = async (uid) => {
    console.log('hey')
    const idToken = Cookies.get('session'); 
    if (idToken) {
      try {
        const response = await axios.post(`${baseURL}/${ACTIVATEDRIVER}`, {uid}, {
          headers: {
            Authorization: `Bearer ${idToken}`, 
          },
          withCredentials: true 
        });
        const record = response.data;
        return record;
      } catch (error) {
        
        console.error('Error accessing protected route:', error.response?.data || error);
        return null; 
      }
    } else {
      console.log('User not authenticated');
      return null; 
    }
  };
