import { LayoutDashboard, LogOut, Plus, Users, X } from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar({ onLogout, menuOpen, closeMenu }) {
  const links = [["/", "Overview", LayoutDashboard], ["/members", "Members", Users], ["/add", "Add member", Plus]];
  return <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#17243a] px-4 py-6 text-slate-300 transition-transform lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
    <div className="flex items-center justify-between px-3"><div className="flex items-center gap-3 font-display text-lg font-bold text-white"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-xl text-white">L</span>Library<span className="font-normal text-slate-500">HQ</span></div><button aria-label="Close navigation" className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden" onClick={closeMenu}><X size={19} /></button></div>
    <p className="mb-3 mt-14 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Workspace</p>
    <nav className="space-y-1">{links.map(([to, label, Icon]) => <NavLink key={to} end={to === "/"} to={to} onClick={closeMenu} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${isActive ? "bg-blue-500 text-white" : "text-slate-400 hover:bg-white/10 hover:text-white"}`}><Icon size={18} />{label}</NavLink>)}</nav>
    <div className="mt-auto space-y-4"><div className="border-t border-white/10 px-3 pt-5"><p className="text-sm font-semibold text-slate-200">Library operations</p><p className="mt-1 text-xs text-slate-500">Keep your directory organized.</p></div><button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-400 hover:bg-white/10 hover:text-white"><LogOut size={18} />Log out</button></div>
  </aside>;
}
export default Sidebar;