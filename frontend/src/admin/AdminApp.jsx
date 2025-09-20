import React from "react";
import "./Admin.css";
import Layout from "./Layout";
import { GlobalProvider } from "./state/GlobalContext";

function AdminApp() {
  return (
    <GlobalProvider>
      <div className="admin-app">
        <Layout />
      </div>
    </GlobalProvider>
  );
}

export default AdminApp;
