import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

export const BringRecord = async () => {
    const idToken = Cookies.get('session'); 
    if (idToken) {
      try {
        const response = await axios.post('http://localhost:5000/api/record', {}, {
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
  