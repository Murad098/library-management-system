import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/theme.css";

const DashboardLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="layout">

      {/* Sidebar */}
      <Sidebar open={open} />

      {/* Mobile Overlay */}
      {open && (
        <div
          className="overlay"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="main">

        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <button
              className="menu-btn"
              onClick={() => setOpen(!open)}
            >
              ☰
            </button>
            <h3 className="title">LibraryHQ</h3>
          </div>

          <div className="topbar-right">
            <span className="status">● Online</span>
            <div className="avatar">AD</div>
          </div>
        </div>

        {/* Page Content */}
        <div className="content">
          {children}
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;