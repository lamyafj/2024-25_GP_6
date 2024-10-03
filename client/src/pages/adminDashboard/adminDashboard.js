import React from 'react';
import './AdminDashboard.css';
import { FaBus } from 'react-icons/fa';
import BusItem from '../../components/Busltem/Busltem.js';
import {Sidebar} from '../../components/Sidebar/Sidebar.js';
import Header from '../../components/header/header.js';

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <Sidebar/>
      <Header/>
    </div>
  );
};


