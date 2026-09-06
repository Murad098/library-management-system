import React from "react";
import "../styles/theme.css";

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Dashboard</h2>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h4>Total Members</h4>
          <p>120</p>
        </div>

        <div style={styles.card}>
          <h4>Paid Members</h4>
          <p style={{ color: "var(--success)" }}>90</p>
        </div>

        <div style={styles.card}>
          <h4>Unpaid Members</h4>
          <p style={{ color: "var(--danger)" }}>30</p>
        </div>

        <div style={styles.card}>
          <h4>Total Revenue</h4>
          <p>PKR 50,000</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
  },
  heading: {
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "var(--card)",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "var(--shadow)",
    textAlign: "center",
  },
};

export default Dashboard;