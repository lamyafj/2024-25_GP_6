import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import {BringRecord} from '../../BringsSchoolRecord.js'


export const BringBusRecord = async () => {
  const idToken = Cookies.get('session'); 
  if (idToken) {
    try {
      const response = await axios.post('http://localhost:5000/api/busrecord', {}, {
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
    const idToken = Cookies.get('session'); // Get the token from cookies
  
    if (!newbus) {
      console.log('No bus data provided');
      return null;
    }
  
    if (!idToken) {
      console.log('User not authenticated');
      return null;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:5000/api/add', 
        { newbus }, 
        {
          headers: {
            Authorization: `Bearer ${idToken}`, // Pass the token in the Authorization header
          },
          withCredentials: true, // Include credentials if needed for cross-origin requests
        }
      );
  
      const record = response.data; // Response from the server
      return record; // Return the record after a successful request
    } catch (error) {
      console.error('Error accessing protected route:', error.response?.data || error);
      return null; // Return null if an error occurs
    }
  };