import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  X,
  MoreVertical
} from 'lucide-react';
const StudentsScreen = ({
  selectedBranch = null,
  students = [],
  onAddStudent = () => {},
}) => {
  const [search, setSearch] = useState('');
  const [filterShift, setFilterShift] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Student Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [seatNumber, setSeatNumber] = useState('D-03');
  const [hall, setHall] = useState('Hall A (Quiet Zone)');
  const [shift, setShift] = useState('Full Day');
  const [monthlyFee, setMonthlyFee] = useState('1200');

  const filtered = students.filter((s) => {
    if (filterShift !== 'All' && !s.shift.includes(filterShift)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.seatNumber.toLowerCase().includes(q) ||
        s.phone.includes(q)
      );
    }
    return true;
  });

  const handleCreateStudent = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newStudent = {
      id: `stu-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: phone.trim() || '+91 98765 00000',
      seatNumber,
      hall,
      shift,
      admissionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      feeStatus: 'Paid',
      monthlyFee: Number(monthlyFee) || 1200,
    };

    onAddStudent(newStudent);
    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
            WORKSPACE • MEMBER DIRECTORY
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Students Roster
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Registered study library members and assigned desks{selectedBranch?.name ? ` at ${selectedBranch.name}` : ''}.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Register New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#131c31] border border-[#1e293b] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, seat #, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#10141d] border border-[#2d3545] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Shift:</span>
          <select
            value={filterShift}
            onChange={(e) => setFilterShift(e.target.value)}
            className="h-10 px-3 rounded-lg bg-[#10141d] border border-[#2d3545] text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="All">All Shifts</option>
            <option value="Full Day">Full Day</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-[#131c31] border border-[#1e293b] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1e293b] text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-[#0f172a]/50">
                <th className="py-3.5 px-5">Student Name</th>
                <th className="py-3.5 px-4">Seat #</th>
                <th className="py-3.5 px-4">Hall & Shift</th>
                <th className="py-3.5 px-4">Admission Date</th>
                <th className="py-3.5 px-4">Fee Status</th>
                <th className="py-3.5 px-5 text-right">Monthly Fee</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60 text-sm">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#18223c]/50 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {s.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{s.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{s.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300">
                      {s.seatNumber}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-xs font-medium text-slate-200">{s.hall}</div>
                    <div className="text-[11px] text-slate-400">{s.shift}</div>
                  </td>

                  <td className="py-4 px-4 text-xs text-slate-300 whitespace-nowrap">
                    {s.admissionDate}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-950/70 border border-emerald-800/60 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {s.feeStatus}
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right font-bold text-white tabular-nums">
                    PKR {s.monthlyFee.toLocaleString('en-PK')}
                  </td>

                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1e293b] transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#161b22] border border-[#2d3545] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1e293b]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Enroll New Student</h3>
                <p className="text-xs text-slate-400">Issue study membership card and allocate seat.</p>
              </div>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-[#10141d] border border-[#2d3545] text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-lg bg-[#10141d] border border-[#2d3545] text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-lg bg-[#10141d] border border-[#2d3545] text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Allocated Seat</label>
                  <input
                    type="text"
                    required
                    placeholder="D-03"
                    value={seatNumber}
                    onChange={(e) => setSeatNumber(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-lg bg-[#10141d] border border-[#2d3545] text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hall</label>
                  <select
                    value={hall}
                    onChange={(e) => setHall(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-lg bg-[#10141d] border border-[#2d3545] text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Hall A (Quiet Zone)">Hall A (Quiet Zone)</option>
                    <option value="Hall B (Discussion Room)">Hall B (Discussion Room)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Shift</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-lg bg-[#10141d] border border-[#2d3545] text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Full Day">Full Day (6am - 10pm)</option>
                    <option value="Morning (6am - 2pm)">Morning (6am - 2pm)</option>
                    <option value="Evening (2pm - 10pm)">Evening (2pm - 10pm)</option>
                    <option value="Night Owl">Night Owl (10pm - 6am)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Fee (PKR)</label>
                  <input
                    type="number"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-lg bg-[#10141d] border border-[#2d3545] text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                >
                  Complete Enrollment
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-[#1e293b] text-slate-300 hover:text-white font-semibold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsScreen;
