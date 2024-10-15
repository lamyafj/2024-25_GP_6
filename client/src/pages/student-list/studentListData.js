import axios from 'axios';
import Cookies from 'js-cookie';
//import React, { useEffect, useState } from 'react';
import { baseURL, ADDSTUDENT,STUDENTDETAIL,DELETEBUS,STUDENTRECORD,EDITSTUDENT,ASSIGNBUSFORSTUDENT,UNASSIGNBUSFORSTUDENT,DELETESTUDENT,ACCEPTSTUDENT} from '../../Api/Api';



export const BringStudentRecord = async () => {
  const idToken = Cookies.get('session'); 
  if (idToken) {
    try {
      const response = await axios.post(`${baseURL}/${STUDENTRECORD}`, {}, {
        headers: {
          Authorization: `Bearer ${idToken}`, 
        },
        withCredentials: true 
      });
      const record = response.data;
      console.log(record)
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

  
  export const AddStudentToDatabase = async (newstudent) => {
    const idToken = Cookies.get('session'); 
  
    if (!newstudent) {
      console.log('No bus data provided');
      return null;
    }
  
    if (!idToken) {
      console.log('User not authenticated');
      return null;
    }
  
    try {
      const response = await axios.post( `${baseURL}/${ADDSTUDENT}`, {newstudent}, 
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
      BringStudentRecord();
      return record; // Return the record after a successful request
    } catch (error) {
      console.error('Error accessing protected route:', error.response?.data || error);
      return null; // Return null if an error occurs
    }
  };


  export const BringStudentDetail = async (uid) => {
    const idToken = Cookies.get('session'); 
    if (idToken) {
      try {
        const response = await axios.post(`${baseURL}/${STUDENTDETAIL}`, {uid}, {
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

  export const assignStudentBus = async (studentuid, busuid) => {
    const idToken = Cookies.get('session'); 
    if (idToken) {
      try {
        const response = await axios.post(`${baseURL}/${ASSIGNBUSFORSTUDENT}`, { studentuid, busuid }, {
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

  /////////////////////////
  export const unassignStudentBus = async (studentuid,busuid ) => {
    const idToken = Cookies.get('session'); 
    if (idToken) {
      try {
        const response = await axios.post(`${baseURL}/${UNASSIGNBUSFORSTUDENT}`, { studentuid,busuid }, {
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
  

  
  export const EditStudentDetail = async (uid, formValues) => {
    const idToken = Cookies.get('session'); 
    if (idToken) {
      try {
        const response = await axios.post(`${baseURL}/${EDITSTUDENT}`, { uid, formValues }, {
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
  

  
  export const DeleteStudent = async (uid) => {
    const idToken = Cookies.get('session'); 
    if (idToken) {
      try {
        const response = await axios.post(`${baseURL}/${DELETESTUDENT}`, {uid}, {
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

  export const AcceptStudent = async (uid) => {
  
    const idToken = Cookies.get('session'); 
    if (idToken) {
      try {
        const response = await axios.post(`${baseURL}/${ACCEPTSTUDENT}`, {uid}, {
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
