import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  TrendingUp, 
  Zap, 
  Wifi, 
  Wrench, 
  BookOpen, 
  Tag, 
  MoreVertical, 
  CheckCircle2,
  Trash2,
  Edit2
} from 'lucide-react';
const ExpensesScreen = ({
  selectedBranch,
  expenses = [],
  onAddExpense = () => {},
  onDeleteExpense,
}) => {
  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('2026-05-15');
  const [category, setCategory] = useState('Other');
  const [paymentType] = useState('Operational');
  const [activeTab, setActiveTab] = useState('All');
  const [actionMenuId, setActionMenuId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Total calculation
  const totalBurn = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Filtered expenses
  const filteredExpenses = expenses.filter((item) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'This Month') return item.date.includes('May');
    if (activeTab === 'Food') return item.category === 'Food';
    if (activeTab === 'Transport') return item.category === 'Transport';
    if (activeTab === 'Bills') return item.category === 'Bills';
    return true;
  });

  const handleRecordExpense = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    const parsedAmount = parseFloat(amount) || 0;
    if (parsedAmount <= 0) return;

    // Determine icon
    let iconType = 'tag';
    if (category === 'Bills') {
      iconType = title.toLowerCase().includes('wifi') || title.toLowerCase().includes('internet') ? 'wifi' : 'zap';
    } else if (category === 'Shopping') {
      iconType = 'tag';
    } else if (category === 'Entertainment') {
      iconType = 'book';
    }

    // Format date nicely
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    const newExpense = {
      id: `exp-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || `${category} allocation voucher`,
      category,
      date: formattedDate,
      paymentType,
      amount: parsedAmount,
      iconType,
    };

    onAddExpense(newExpense);
    setTitle('');
    setSubtitle('');
    setAmount('');
    setSuccessMessage(`Recorded voucher: ${newExpense.title} (PKR ${parsedAmount.toLocaleString('en-PK')})`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'Utilities':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-950/70 text-blue-400 border border-blue-800/60">
            Utilities
          </span>
        );
      case 'Repairs':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
            Repairs
          </span>
        );
      case 'Subscriptions':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-purple-950/70 text-purple-400 border border-purple-800/60">
            Subscriptions
          </span>
        );
      case 'Rent':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-950/70 text-amber-400 border border-amber-800/60">
            Rent
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            {cat}
          </span>
        );
    }
  };

  const getPaymentTypeDot = (type) => {
    switch (type) {
      case 'Operational':
        return <span className="w-2 h-2 rounded-full bg-amber-400"></span>;
      case 'Monthly':
        return <span className="w-2 h-2 rounded-full bg-emerald-400"></span>;
      case 'Annual':
        return <span className="w-2 h-2 rounded-full bg-purple-400"></span>;
      default:
        return <span className="w-2 h-2 rounded-full bg-slate-400"></span>;
    }
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'zap':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'wifi':
        return <Wifi className="w-4 h-4 text-sky-400" />;
      case 'tool':
        return <Wrench className="w-4 h-4 text-emerald-400" />;
      case 'book':
        return <BookOpen className="w-4 h-4 text-purple-400" />;
      default:
        return <Tag className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="w-full min-w-0 max-w-7xl mx-auto space-y-7 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 animate-in fade-in duration-300">
      {/* Top Banner Row */}
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
            LIBRARY OPERATIONS
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Expenses
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track the operating costs and financial outflows of your library.
          </p>
        </div>

        {/* Top Right: May 2026 Burn Card matching Image 5 */}
        <div className="flex w-full min-w-0 items-center justify-between gap-4 rounded-2xl border border-[#1e293b] bg-[#131c31] p-4 sm:w-auto sm:min-w-[240px] sm:gap-6">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              May 2026 Burn
            </div>
            <div className="text-2xl font-bold text-white mt-1 tabular-nums">
              PKR {totalBurn.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* FORM CARD: Log an expense matching Image 5 */}
      <div className="relative rounded-2xl border border-[#1e293b] bg-[#131c31] p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-[#1e293b] border border-[#2d3545] flex items-center justify-center text-amber-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Log an expense</h2>
            <p className="text-xs text-slate-400">
              Record a new library expense voucher into the ledger.
            </p>
          </div>
        </div>

        {/* Input Form Fields */}
        <form onSubmit={handleRecordExpense}>
          <div className="grid min-w-0 grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-12">
            {/* Expense title */}
            <div className="min-w-0 lg:col-span-4">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Expense title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Electricity bill"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg bg-[#10141d] border border-[#2d3545] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* Amount */}
            <div className="min-w-0 lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 text-sm font-semibold">
                  PKR
                </span>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-11 pl-8 pr-3.5 rounded-lg bg-[#10141d] border border-[#2d3545] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Date */}
            <div className="min-w-0 lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-lg bg-[#10141d] border border-[#2d3545] text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Category */}
            <div className="min-w-0 lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg bg-[#10141d] border border-[#2d3545] text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              >
                <option value="Other">Other</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="min-w-0 lg:col-span-2">
              <button
                type="submit"
                className="w-full h-11 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Record Expense</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* SECTION 2: All Expenses Table & Filter Tabs matching Image 5 */}
      <div className="space-y-4">
        {/* Section Header & Filters */}
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-0.5">
              RECENT ACTIVITY
            </span>
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                All expenses
              </h2>
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-[#161b22] border border-[#2d3545] text-slate-300">
                {expenses.length} logged this month
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex max-w-full self-start overflow-x-auto rounded-xl border border-[#2d3545] bg-[#161b22] p-1 sm:self-auto">
            {['All', 'This Month', 'Utilities', 'Repairs', 'Subscriptions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#1e293b]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Expenses Data Table */}
        <div className="overflow-hidden rounded-2xl border border-[#1e293b] bg-[#131c31]">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#1e293b] text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-[#0f172a]/50">
                  <th className="py-3.5 px-5">Expense Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Payment Type</th>
                  <th className="py-3.5 px-5 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60 text-sm">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                      No expenses found matching the "{activeTab}" filter.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#18223c]/50 transition-colors group"
                    >
                      {/* Details with Icon */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#1e293b] border border-[#2d3545] flex items-center justify-center shrink-0">
                            {renderIcon(item.iconType)}
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                              {item.title}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {item.subtitle}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {getCategoryBadge(item.category)}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-300">
                        {item.date}
                      </td>

                      {/* Payment Type */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          {getPaymentTypeDot(item.paymentType)}
                          <span>{item.paymentType}</span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-5 text-right whitespace-nowrap font-bold text-white tabular-nums text-base">
                        PKR {item.amount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center whitespace-nowrap relative">
                        <button
                          onClick={() => setActionMenuId(actionMenuId === item.id ? null : item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1e293b] transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Action Menu */}
                        {actionMenuId === item.id && (
                          <div className="absolute right-6 top-10 mt-1 w-32 bg-[#161b22] border border-[#2d3545] rounded-xl shadow-2xl py-1 z-50 text-left">
                            <button
                              onClick={() => {
                                alert(`Editing ${item.title}`);
                                setActionMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-[#1e293b] flex items-center gap-2"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                              <span>Edit</span>
                            </button>
                            {onDeleteExpense && (
                              <button
                                onClick={() => {
                                  onDeleteExpense(item.id);
                                  setActionMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination bar matching Image 5 */}
          <div className="flex flex-col gap-3 border-t border-[#1e293b] p-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <div>
              Showing <span className="font-semibold text-white">{filteredExpenses.length}</span> of{' '}
              <span className="font-semibold text-white">{expenses.length}</span> expenses
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                disabled
                className="px-3.5 py-1.5 rounded-lg border border-[#2d3545] bg-[#161b22] text-slate-600 cursor-not-allowed font-medium"
              >
                Previous
              </button>
              <button
                disabled
                className="px-3.5 py-1.5 rounded-lg border border-[#2d3545] bg-[#161b22] text-slate-600 cursor-not-allowed font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesScreen;
