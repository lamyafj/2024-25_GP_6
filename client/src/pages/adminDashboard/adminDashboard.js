import React from 'react';
import './AdminDashboard.css';
import { FaBus } from 'react-icons/fa';
import BusItem from '../../components/Busltem/Busltem.js';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <BusItem />

      <div className="bus-list-container">
        <button className="add-bus-button">+ إضافة باص</button>

        <div className="bus-list">
         
          <div className="bus-list-item">
            <div className="bus-details">
            <FaBus size={24} style={{direction:"rtl",marginLeft: '10px', color: 'grey' }} />
              <p>#رقم الباص</p>
            </div>
            <button className="delete-bus-button">حذف</button>
          </div>
          <div className="bus-list-item">
            <div className="bus-details">
            <FaBus size={24} style={{direction:"rtl",marginLeft: '10px', color: 'grey' }} />
              <p>#رقم الباص</p>
            </div>
            <button className="delete-bus-button">حذف</button>
          </div>
          <div className="bus-list-item">
            <div className="bus-details">
            <FaBus size={24} style={{direction:"rtl",marginLeft: '10px', color: 'grey' }} />
              <p>#رقم الباص</p>
            </div>
            <button className="delete-bus-button">حذف</button>
          </div>
          <div className="bus-list-item">
            <div className="bus-details">
            <FaBus size={24} style={{direction:"rtl",marginLeft: '10px', color: 'grey' }} />
              <p>#رقم الباص</p>
            </div>
            <button className="delete-bus-button">حذف</button>
          </div>
          <div className="bus-list-item">
            <div className="bus-details">
            <FaBus size={24} style={{direction:"rtl",marginLeft: '10px', color: 'grey' }} />
              <p>#رقم الباص</p>
            </div>
            <button className="delete-bus-button">حذف</button>
          </div>
          <div className="bus-list-item">
            <div className="bus-details">
            <FaBus size={24} style={{direction:"rtl",marginLeft: '10px', color: 'grey' }} />
              <p>#رقم الباص</p>
            </div>
            <button className="delete-bus-button">حذف</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
