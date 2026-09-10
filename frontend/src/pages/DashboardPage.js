import React from 'react';
import { 
  LayoutGrid, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  UserCheck, 
  AlertTriangle, 
  AlertCircle, 
  Zap, 
  MapPin, 
  UserPlus
} from 'lucide-react';
const DashboardScreen = ({
  selectedBranch = null,
  onNavigate = () => {},
  activities = [],
  expensesTotal = 8649,
}) => {
  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            May 2026{selectedBranch?.name ? ` • ${selectedBranch.name}` : ''}
          </p>
        </div>

        {/* Live Tracking Beacon */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Live Tracking</span>
        </div>
      </div>

      {/* ROW 1: 3 Analytics Visual Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Seat Occupancy Donut */}
        <div className="bg-[#131c31] border border-[#1e293b] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-white">Seat Occupancy</h2>
            <button 
              onClick={() => onNavigate('halls')}
              className="p-1.5 rounded-lg bg-[#1e293b]/60 text-slate-400 hover:text-white hover:bg-[#1e293b] transition-colors"
              title="View Hall Layout"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Donut Chart Visual */}
          <div className="my-4 flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring (Free Seats) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#1e293b"
                  strokeWidth="11"
                  fill="transparent"
                />
                {/* Active Ring (Occupied Seats ~ 3%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#f59e0b"
                  strokeWidth="11"
                  strokeDasharray="238.76"
                  strokeDashoffset={238.76 * (1 - 0.03)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              {/* Inner Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold tracking-tight text-white leading-none">
                  3%
                </span>
                <span className="text-xs text-slate-400 mt-1 font-medium">
                  {selectedBranch ? `${selectedBranch.occupiedSeats}/${selectedBranch.totalSeats}` : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="flex items-center justify-center gap-6 pt-2 border-t border-[#1e293b]/60 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
              <span>Free</span>
            </div>
          </div>
        </div>

        {/* Card 2: Monthly P&L */}
        <div className="bg-[#131c31] border border-[#1e293b] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-white">Monthly P&L</h2>
            <div className="p-1.5 rounded-lg bg-[#1e293b]/60 text-slate-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          {/* Donut Chart Visual */}
          <div className="my-4 flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#1e293b"
                  strokeWidth="11"
                  fill="transparent"
                />
                {/* Collected Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#f59e0b"
                  strokeWidth="11"
                  strokeDasharray="238.76"
                  strokeDashoffset={238.76 * (1 - 0.78)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              {/* Inner Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-none">
                  ₹3.1K
                </span>
                <span className="text-[10px] font-bold tracking-widest text-slate-400 mt-1 uppercase">
                  PROFIT
                </span>
              </div>
            </div>
          </div>

          {/* P&L Legend */}
          <div className="flex items-center justify-center gap-6 pt-2 border-t border-[#1e293b]/60 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>Collected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
              <span>Expenses</span>
            </div>
          </div>
        </div>

        {/* Card 3: Revenue vs Expenses Bar Chart */}
        <div className="bg-[#131c31] border border-[#1e293b] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-sm font-semibold text-white">Revenue vs Expenses</h2>
              <p className="text-[11px] text-slate-400">Last 6 months</p>
            </div>
            {/* Chart Legend */}
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="text-[11px]">Collected</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                <span className="text-[11px]">Expenses</span>
              </div>
            </div>
          </div>

          {/* High-Fidelity Custom Bar Chart matching Image 3 */}
          <div className="mt-4 mb-2 flex items-end justify-between h-36 pt-4 relative">
            {/* Y-Axis scale marks */}
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-slate-400 font-medium">
              <span>₹3.4K</span>
              <span>₹1.7K</span>
              <span>₹850</span>
              <span>₹0</span>
            </div>

            {/* Background horizontal grid lines */}
            <div className="absolute left-10 right-0 top-1.5 h-[1px] bg-[#1e293b]/50"></div>
            <div className="absolute left-10 right-0 top-1/3 h-[1px] bg-[#1e293b]/40"></div>
            <div className="absolute left-10 right-0 top-2/3 h-[1px] bg-[#1e293b]/40"></div>
            <div className="absolute left-10 right-0 bottom-6 h-[1px] bg-[#1e293b]"></div>

            {/* Month Bars Container */}
            <div className="pl-12 w-full flex items-end justify-between h-full pb-6">
              {/* Dec */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-1.5 bg-[#1e293b] rounded-t-sm"></div>
                <span className="text-[10px] text-slate-400">Dec</span>
              </div>
              {/* Jan */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-1.5 bg-[#1e293b] rounded-t-sm"></div>
                <span className="text-[10px] text-slate-400">Jan</span>
              </div>
              {/* Feb */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-1.5 bg-[#1e293b] rounded-t-sm"></div>
                <span className="text-[10px] text-slate-400">Feb</span>
              </div>
              {/* Mar */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-1.5 bg-[#1e293b] rounded-t-sm"></div>
                <span className="text-[10px] text-slate-400">Mar</span>
              </div>
              {/* Apr */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-2 bg-[#1e293b] rounded-t-sm"></div>
                <span className="text-[10px] text-slate-400">Apr</span>
              </div>
              {/* May (Current active month, tall amber bar) */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-24 bg-amber-500 rounded-t shadow-lg shadow-amber-500/20"></div>
                <span className="text-[10px] font-bold text-white">May</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: ACTIVE STUDENTS */}
        <div className="bg-[#131c31] border border-[#1e293b] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Students
            </div>
            <div className="text-2xl font-bold text-white mt-1">6</div>
            <div className="text-xs text-slate-400 mt-0.5">all seats filled</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#1e293b] border border-[#2d3545] flex items-center justify-center text-slate-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: PENDING APPROVALS */}
        <div className="bg-[#131c31] border border-[#1e293b] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pending Approvals
            </div>
            <div className="text-2xl font-bold text-white mt-1">0</div>
            <div className="text-xs text-slate-400 mt-0.5">awaiting review</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#1e293b] border border-[#2d3545] flex items-center justify-center text-slate-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: COLLECTED • MAY */}
        <div className="bg-[#131c31] border border-[#1e293b] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Collected • May
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-1">₹3.3K</div>
            <div className="text-xs text-slate-400 mt-0.5">11 payments</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <span className="font-bold text-base">₹</span>
          </div>
        </div>

        {/* Metric 4: OUTSTANDING */}
        <div className="bg-[#131c31] border border-[#1e293b] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Outstanding
            </div>
            <div className="text-2xl font-bold text-white mt-1">₹0</div>
            <div className="text-xs text-slate-400 mt-0.5">0 students • 0 overdue</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#1e293b] border border-[#2d3545] flex items-center justify-center text-slate-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ROW 3: 3 Action & Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pending Approvals */}
        <div className="bg-[#131c31] border border-[#1e293b] rounded-2xl p-5 flex flex-col justify-between min-h-[130px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
              <UserCheck className="w-4 h-4" />
              <span>Pending Approvals</span>
            </div>
            <button 
              onClick={() => onNavigate('students')}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="text-center py-4 text-xs text-slate-400">
            All caught up
          </div>
        </div>

        {/* Grace Ending Soon */}
        <div className="bg-[#131c31] border border-[#1e293b] rounded-2xl p-5 flex flex-col justify-between min-h-[130px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Grace Ending Soon</span>
            </div>
            <button 
              onClick={() => onNavigate('fees')}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="text-center py-4 text-xs text-slate-400">
            No grace endings soon
          </div>
        </div>

        {/* Overdue Fees */}
        <div className="bg-[#131c31] border border-[#1e293b] rounded-2xl p-5 flex flex-col justify-between min-h-[130px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-400 font-semibold text-xs">
              <AlertCircle className="w-4 h-4" />
              <span>Overdue Fees</span>
            </div>
            <button 
              onClick={() => onNavigate('fees')}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="text-center py-4 text-xs text-slate-400">
            No overdue fees
          </div>
        </div>
      </div>

      {/* ROW 4: Recent Activity Section */}
      <div className="bg-[#131c31] border border-[#1e293b] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4 text-white font-semibold text-sm">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Recent Activity</span>
        </div>

        {/* Activity items matching Image 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activities.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-[#0f172a]/60 border border-[#1e293b] hover:border-[#2d3545] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  {item.action.includes('Seat') ? (
                    <MapPin className="w-4 h-4" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {item.action}
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Footer matching Image 3 */}
      <footer className="pt-6 pb-2 text-center text-xs text-slate-400">
        © 2026 LibraHQ • LibVertex • Made with ❤️ for India's study libraries
      </footer>
    </div>
  );
};

export default DashboardScreen;
