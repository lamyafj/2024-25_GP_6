import React from 'react';
import { RiDashboardFill } from "react-icons/ri";
import { PiStudent } from "react-icons/pi";
import { FaBus } from "react-icons/fa";
import { PiSteeringWheel } from "react-icons/pi";
import { CiRoute } from "react-icons/ci";
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
</svg>




export const SidebarData = [
  {
    title: "الصفحة الرئيسية",
    icon: <RiDashboardFill size={20} />, 
    link: "/adminDashboard",
  },
  {
    title: "مسار السير",
    icon:<CiRoute size={20}  />, 
    link: "/adminDashboard",
  },
  {
    title: "قائمة الطلاب",
    icon:<PiStudent size={20} />, 
    link: "/adminDashboard",
  },
  {
    title: "قائمة الباصات",
    icon: <FaBus size={20} />, 
    link: "/adminDashboard",
  },
  {
    title: "قائمة السائقين",
    icon: <PiSteeringWheel size={20} />, 
    link: "/adminDashboard",
  },
  {
    title:"تسجيل خروج",
    icon:"",
    link:"",
    button:"<button onClick={logoutAndRedirect}>Logout</button>"
  }

];
