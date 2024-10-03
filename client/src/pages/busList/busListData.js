import axios from 'axios';
import Cookies from 'js-cookie';
//import React, { useEffect, useState } from 'react';
import { baseURL, ADDBUS,BUSRECORD,DELETEBUS,BUSDETAIL} from '../../Api/Api';



export const BringBusRecord = async () => {
  const idToken = Cookies.get('session'); 
  if (idToken) {
    try {
      const response = await axios.post(`${baseURL}/${BUSRECORD}`, {}, {
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

  
  export const AddBusToDatabase = async (newbus) => {
    const idToken = Cookies.get('session'); 
  
    if (!newbus) {
      console.log('No bus data provided');
      return null;
    }
  
    if (!idToken) {
      console.log('User not authenticated');
      return null;
    }
  
    try {
      const response = await axios.post( `${baseURL}/${ADDBUS}`, {newbus }, 
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
    console.log('i delete', uid)
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
      BringBusRecord();
      return record; // Return the record after a successful request
    } catch (error) {
      console.error('Error accessing protected route:', error.response?.data || error);
      return null; // Return null if an error occurs
    }
  };


  export const BringBusDetail = async (uid) => {
    const idToken = Cookies.get('session'); 
    if (idToken) {
      try {
        const response = await axios.post(`${baseURL}/${BUSDETAIL}`, {uid}, {
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

  export const updateBusDetails = async (uid) => {
    const idToken = Cookies.get('session'); 
    if (idToken) {
      try {
        const response = await axios.post(`${baseURL}/${BUSDETAIL}`, {uid}, {
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