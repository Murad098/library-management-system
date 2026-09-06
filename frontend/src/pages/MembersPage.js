import React from "react";
import "../styles/theme.css";

const MembersPage = () => {
  // temporary data (later backend se ayega)
  const members = [
    { name: "Ali", phone: "03001234567", fee: 2000, status: "paid" },
    { name: "Ahmed", phone: "03111234567", fee: 2000, status: "unpaid" },
  ];

  return (
    <div style={styles.container}>
      <h2>Members</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Fee</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {members.map((m, index) => (
            <tr key={index}>
              <td>{m.name}</td>
              <td>{m.phone}</td>
              <td>{m.fee}</td>
              <td
                style={{
                  color:
                    m.status === "paid"
                      ? "var(--success)"
                      : "var(--danger)",
                }}
              >
                {m.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
  },
  table: {
    width: "100%",
    background: "var(--card)",
    borderRadius: "10px",
    boxShadow: "var(--shadow)",
    overflow: "hidden",
  },
};

export default MembersPage;