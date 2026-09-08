import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config/api";
import { RefreshCw, Users } from "lucide-react";

const API_URL = `${BASE_URL}/members`;

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      setMembers(response.data);
    } catch (err) {
      console.error("Error fetching members:", err);

      setError(
        err.response?.data?.message ||
          `Unable to fetch members (${err.response?.status || "Error"})`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  if (loading) {
    return <section className="page-section"><div className="page-heading"><div><p className="eyebrow accent">Directory</p><h2 className="section-title">Members</h2></div></div><div className="state-card"><span className="spinner" />Loading members...</div></section>;
  }

  return (
    <section className="page-section">
      <div className="page-heading"><div><p className="eyebrow accent">Directory</p><h2 className="section-title">Members</h2><p className="section-subtitle">Your library community, all in one place.</p></div><button className="secondary-button" onClick={fetchMembers}><RefreshCw size={16} />Refresh</button></div>

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      {!error && members.length === 0 && (
        <div className="state-card"><Users size={30} /><strong>No members found</strong><span>Add your first member to populate the directory.</span></div>
      )}

      {members.length > 0 && (
        <div className="table-card"><table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Fee</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr key={member._id}>
                <td><div className="member-cell"><span className="member-avatar">{member.name?.charAt(0)?.toUpperCase()}</span><strong>{member.name}</strong></div></td>
                <td>{member.phone}</td>
                <td>PKR {member.fee}</td>
                <td><span className={`status-pill ${member.status === "paid" ? "paid" : "unpaid"}`}>{member.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}
    </section>
  );
};

export default MembersPage;