import React from "react";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import TeamPage from "./scenes/team/TeamPage";
import Dashboard from "./scenes/dashboard";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import AddUserForm from "./scenes/form/AddUserForm";
import FAQ from "./scenes/faq";
import ProductPage from "./scenes/product/ProductPage"; 
import axios from "axios";

export default function IndexRouting() {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const [isSidebar, setIsSidebar] = useState(false);
  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} setIsSidebar={setIsSidebar}/>
      <main className="content" style={{  
        paddingLeft: isSidebar ? '80px' : '270px',
        transition: isSidebar ? '.5s':'.3s'
      }}>
        <Topbar setIsSidebar={setIsSidebar} />
        <Routes>
          <Route path="" element={<ProductPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="team/add" element={<AddUserForm />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="product" element={<ProductPage />} />
        </Routes>
      </main> 
    </div>
  );
}
