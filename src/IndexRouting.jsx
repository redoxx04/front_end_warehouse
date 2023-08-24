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

export default function IndexRouting() {
  const [isSidebar, setIsSidebar] = useState(true);
  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content">
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
