import React from "react";
import { ArrowUpRight, CircleDollarSign, CreditCard, Users, UserRoundPlus } from "lucide-react";

const DashboardPage = () => {
  return (
    <section className="dashboard-page">
      <div className="welcome-row"><div><p className="eyebrow accent">Overview</p><h2 className="section-title">Good morning, Admin</h2><p className="section-subtitle">Here is what is happening across your library today.</p></div><div className="date-chip">September 08, 2026</div></div>
      <div className="stats-grid">
        <div className="stat-card blue"><div className="stat-icon"><Users size={20} /></div><p>Total members</p><strong>120</strong><span className="stat-change positive"><ArrowUpRight size={14} /> 12% this month</span></div>
        <div className="stat-card green"><div className="stat-icon"><CreditCard size={20} /></div><p>Paid members</p><strong>90</strong><span className="stat-change positive"><ArrowUpRight size={14} /> 8% this month</span></div>
        <div className="stat-card red"><div className="stat-icon"><UserRoundPlus size={20} /></div><p>Unpaid members</p><strong>30</strong><span className="stat-change negative">Needs attention</span></div>
        <div className="stat-card purple"><div className="stat-icon"><CircleDollarSign size={20} /></div><p>Total revenue</p><strong>PKR 50,000</strong><span className="stat-change positive"><ArrowUpRight size={14} /> 14% this month</span></div>
      </div>
      <div className="summary-grid"><div className="panel welcome-panel"><div><p className="eyebrow accent">Library snapshot</p><h3>Keep your community moving.</h3><p>Manage members, payments, and day-to-day expenses from one focused workspace.</p></div><div className="snapshot-orbit"><Users size={30} /></div></div><div className="panel quick-panel"><div className="panel-heading"><h3>At a glance</h3><span>Today</span></div><div className="progress-row"><span>Membership payments</span><strong>75%</strong></div><div className="progress-track"><span style={{ width: "75%" }} /></div><div className="mini-metrics"><div><strong>90</strong><small>Paid</small></div><div><strong>30</strong><small>Pending</small></div></div></div></div>
    </section>
  );
};

export default DashboardPage;