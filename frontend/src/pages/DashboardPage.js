import React from "react";
import DashboardLayout from "../layout/DashboardLayout";
import "../styles/theme.css";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="cards">
        <div className="card">
          <h4>Total Members</h4>
          <h2>120</h2>
        </div>

        <div className="card">
          <h4>Paid Members</h4>
          <h2 style={{ color: "#22c55e" }}>90</h2>
        </div>

        <div className="card">
          <h4>Unpaid Members</h4>
          <h2 style={{ color: "#ef4444" }}>30</h2>
        </div>

        <div className="card">
          <h4>Total Revenue</h4>
          <h2>PKR 50,000</h2>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;