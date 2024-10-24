import axios from 'axios';
import Cookies from 'js-cookie';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig.js';
import { baseURL, RECORD, PASSWORDRESET,CHANGEEMAIL,EDITSCHOOLDETAIL } from './Api/Api';
import React, { useEffect, useState } from 'react';

export const BringRecord = async () => {
    const idToken = Cookies.get('session'); 
    if (idToken) {
      try {
        const response = await axios.post(`${baseURL}/${RECORD}`, {}, {
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
  

  export const EditSchoolDetail = async (newschool) => {
    const idToken = Cookies.get('session'); 
    if (idToken) {
      try {
        const response = await axios.post(`${baseURL}/${EDITSCHOOLDETAIL}`, {newschool}, {
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
  

  export const ChangeEmail = async (currentemail, newemail, password) => {
    try {
      await signInWithEmailAndPassword(auth, currentemail.trim(), password.trim());
    } catch (error) {
      return { success: false, message: 'كلمة المرور خاطئة' };
    }
  
    const idToken = Cookies.get('session');
    if (idToken) {
      try {
        const response = await axios.post(`${baseURL}/${CHANGEEMAIL}`, { newemail, password }, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          withCredentials: true,
        });
  
        // Assuming the backend response contains a `success` field
        return response.data; 
      } catch (error) {
        console.error('Error accessing protected route:', error.response?.data || error);
        return { success: false, message: 'حدث خطأ أثناء تغيير البريد الإلكتروني. يرجى المحاولة مرة أخرى لاحقاً.' };
      }
    } else {
      console.log('User not authenticated');
      return { success: false, message: 'لم يتم التحقق من هوية المستخدم.' };
    }
  };
  

  export const PasswordReset = async (email) => {
    const idToken = Cookies.get('session'); 
    if (idToken) {
      try {
        const response = await axios.post(`${baseURL}/${PASSWORDRESET}`, {email}, {
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