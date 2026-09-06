import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiLogOut, FiMenu, FiPlus, FiUsers, FiX } from 'react-icons/fi';
import { useState } from 'react';

function DashboardLayout({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = location.pathname === '/members' ? 'Members' : location.pathname === '/members/add' ? 'Add member' : 'Overview';

  const logout = () => { onLogout(); navigate('/login'); };
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand"><span className="brand-mark">L</span><span>Library<span className="brand-muted">HQ</span></span></div>
        <div className="workspace-label">Workspace</div>
        <nav className="nav-list">
          <NavLink end to="/" onClick={closeMenu} className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}><FiGrid /> Overview</NavLink>
          <NavLink to="/members" onClick={closeMenu} className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}><FiUsers /> Members</NavLink>
          <NavLink to="/members/add" onClick={closeMenu} className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}><FiPlus /> Add member</NavLink>
        </nav>
        <div className="sidebar-bottom"><div className="help-box"><strong>Need a hand?</strong><span>Visit our admin guide</span></div><button className="nav-item logout-button" onClick={logout}><FiLogOut /> Log out</button></div>
      </aside>
      {menuOpen && <button aria-label="Close menu" className="mobile-overlay" onClick={closeMenu} />}
      <main className="main-content">
        <header className="topbar"><button className="mobile-menu" aria-label="Open menu" onClick={() => setMenuOpen(true)}>{menuOpen ? <FiX /> : <FiMenu />}</button><div><div className="breadcrumb">LibraryHQ <span>/</span> {pageTitle}</div><h1>{pageTitle}</h1></div><div className="topbar-actions"><div className="status-dot"><span /> System operational</div><div className="avatar">AD</div></div></header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}

export default DashboardLayout;