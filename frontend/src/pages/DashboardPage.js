import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircleDollarSign,
  CreditCard,
  Users,
  UserRoundPlus,
} from "lucide-react";
import BASE_URL from "../config/api";

const DashboardPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${BASE_URL}/members`);
      setMembers(response.data);
    } catch (err) {
      console.error("Dashboard members error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const totalMembers = members.length;

  const paidMembers = members.filter(
    (member) => member.status === "paid"
  ).length;

  const unpaidMembers = members.filter(
    (member) => member.status !== "paid"
  ).length;

  const totalRevenue = members
    .filter((member) => member.status === "paid")
    .reduce(
      (total, member) => total + Number(member.fee || 0),
      0
    );

  const paymentPercentage =
    totalMembers > 0
      ? Math.round((paidMembers / totalMembers) * 100)
      : 0;

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <section className="dashboard-page">

      <div className="welcome-row">
        <div>
          <p className="eyebrow accent">Overview</p>

          <h2 className="section-title">
            Good morning, Admin
          </h2>

          <p className="section-subtitle">
            Here is your library overview for today.
          </p>
        </div>

        <div className="date-chip">
          {today}
        </div>
      </div>

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      <div className="stats-grid">

        <div className="stat-card blue">
          <div className="stat-icon">
            <Users size={20} />
          </div>

          <p>Total members</p>

          <strong>
            {loading ? "—" : totalMembers}
          </strong>

          <span className="stat-change">
            Registered members
          </span>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <CreditCard size={20} />
          </div>

          <p>Paid members</p>

          <strong>
            {loading ? "—" : paidMembers}
          </strong>

          <span className="stat-change positive">
            {paymentPercentage}% of members
          </span>
        </div>

        <div className="stat-card red">
          <div className="stat-icon">
            <UserRoundPlus size={20} />
          </div>

          <p>Unpaid members</p>

          <strong>
            {loading ? "—" : unpaidMembers}
          </strong>

          <span className="stat-change negative">
            {unpaidMembers > 0
              ? "Needs attention"
              : "All payments clear"}
          </span>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">
            <CircleDollarSign size={20} />
          </div>

          <p>Total revenue</p>

          <strong>
            {loading
              ? "—"
              : `PKR ${totalRevenue.toLocaleString()}`}
          </strong>

          <span className="stat-change positive">
            From paid memberships
          </span>
        </div>

      </div>

      <div className="summary-grid">

        <div className="panel welcome-panel">
          <div>
            <p className="eyebrow accent">
              Library snapshot
            </p>

            <h3>
              Keep your community moving.
            </h3>

            <p>
              Manage members, membership payments,
              and day-to-day library expenses from
              one focused workspace.
            </p>
          </div>

          <div className="snapshot-orbit">
            <Users size={30} />
          </div>
        </div>

        <div className="panel quick-panel">

          <div className="panel-heading">
            <h3>Membership payments</h3>
            <span>Current</span>
          </div>

          <div className="progress-row">
            <span>Paid memberships</span>

            <strong>
              {loading
                ? "—"
                : `${paymentPercentage}%`}
            </strong>
          </div>

          <div className="progress-track">
            <span
              style={{
                width: `${paymentPercentage}%`,
              }}
            />
          </div>

          <div className="mini-metrics">

            <div>
              <strong>
                {loading ? "—" : paidMembers}
              </strong>
              <small>Paid</small>
            </div>

            <div>
              <strong>
                {loading ? "—" : unpaidMembers}
              </strong>
              <small>Pending</small>
            </div>

            <div>
              <strong>
                {loading ? "—" : totalMembers}
              </strong>
              <small>Total</small>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};

export default DashboardPage;