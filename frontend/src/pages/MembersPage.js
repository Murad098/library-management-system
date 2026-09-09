import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config/api";
import {
  RefreshCw,
  Users,
  Phone,
  Mail,
  CreditCard,
} from "lucide-react";

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

  const paidCount = members.filter(
    (member) => member.status === "paid"
  ).length;

  const unpaidCount = members.filter(
    (member) => member.status !== "paid"
  ).length;

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow accent">Directory</p>

          <h2 className="section-title">Members</h2>

          <p className="section-subtitle">
            Your library community, all in one place.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={fetchMembers}
          disabled={loading}
          type="button"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />

          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      {!loading && !error && members.length > 0 && (
        <div className="member-summary">
          <div className="member-summary-item">
            <div className="member-summary-icon">
              <Users size={17} />
            </div>

            <div>
              <strong>{members.length}</strong>
              <span>Total members</span>
            </div>
          </div>

          <div className="member-summary-item">
            <div className="member-summary-icon paid-summary">
              <CreditCard size={17} />
            </div>

            <div>
              <strong>{paidCount}</strong>
              <span>Paid</span>
            </div>
          </div>

          <div className="member-summary-item">
            <div className="member-summary-icon unpaid-summary">
              <CreditCard size={17} />
            </div>

            <div>
              <strong>{unpaidCount}</strong>
              <span>Unpaid</span>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="state-card">
          <span className="spinner" />
          <strong>Loading members...</strong>
          <span>Please wait while the directory is loaded.</span>
        </div>
      )}

      {!loading && !error && members.length === 0 && (
        <div className="state-card">
          <Users size={30} />

          <strong>No members found</strong>

          <span>
            Add your first member to populate the directory.
          </span>
        </div>
      )}

      {!loading && !error && members.length > 0 && (
        <div className="table-card">
          <div className="table-header">
            <div>
              <p className="eyebrow accent">
                Member directory
              </p>

              <h3>All members</h3>
            </div>

            <span>
              {members.length}{" "}
              {members.length === 1 ? "member" : "members"}
            </span>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Membership fee</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {members.map((member) => {
                  const initial =
                    member.name?.charAt(0)?.toUpperCase() || "?";

                  const isPaid = member.status === "paid";

                  return (
                    <tr key={member._id}>
                      <td>
                        <div className="member-cell">
                          <span className="member-avatar">
                            {initial}
                          </span>

                          <div className="member-info">
                            <strong>{member.name}</strong>

                            <small>Library member</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="table-contact">
                          <Mail size={14} />

                          <span>
                            {member.email || "—"}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="table-contact">
                          <Phone size={14} />

                          <span>
                            {member.phone || "—"}
                          </span>
                        </div>
                      </td>

                      <td>
                        <strong className="fee-value">
                          PKR{" "}
                          {Number(
                            member.fee || 0
                          ).toLocaleString()}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`status-pill ${
                            isPaid ? "paid" : "unpaid"
                          }`}
                        >
                          <span className="status-dot" />

                          {isPaid ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default MembersPage;