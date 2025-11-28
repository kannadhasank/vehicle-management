import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Users,
  FolderKanban,
  Wrench,
  Shield,
  Fuel,
  MapPin,
  Package,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import useStore from '../store/useStore';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, darkMode, toggleDarkMode } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/vehicles/')) return 'Vehicle Details';
    if (path === '/vehicles') return 'Vehicles';
    if (path === '/drivers') return 'Drivers';
    if (path === '/projects') return 'Projects';
    if (path === '/maintenance') return 'Maintenance';
    if (path === '/insurance') return 'Insurance';
    if (path === '/fuel') return 'Fuel Management';
    if (path === '/gps') return 'GPS Tracking';
    if (path === '/sold-lost') return 'Sold & Lost Vehicles';
    return 'Vehicle Management';
  };

  const navItems = [
    { section: 'Overview', items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    ]},
    { section: 'Fleet', items: [
      { to: '/vehicles', icon: Car, label: 'Vehicles' },
      { to: '/drivers', icon: Users, label: 'Drivers' },
      { to: '/sold-lost', icon: Package, label: 'Sold & Lost' },
    ]},
    { section: 'Operations', items: [
      { to: '/projects', icon: FolderKanban, label: 'Projects' },
      { to: '/gps', icon: MapPin, label: 'GPS Tracking' },
    ]},
    { section: 'Management', items: [
      { to: '/maintenance', icon: Wrench, label: 'Maintenance' },
      { to: '/insurance', icon: Shield, label: 'Insurance' },
      { to: '/fuel', icon: Fuel, label: 'Fuel Records' },
    ]},
  ];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">VM</div>
            <div>
              <div className="logo-text">FleetPro</div>
              <div className="logo-subtext">Vehicle Manager</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((section) => (
            <div key={section.section} className="nav-section">
              <div className="nav-section-title">{section.section}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  end={item.to === '/'}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.username}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <h1 className="header-title">{getPageTitle()}</h1>
          </div>
          <div className="header-right">
            <button className="theme-toggle" onClick={toggleDarkMode} title={darkMode ? 'Light Mode' : 'Dark Mode'}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <div className="page-content animate-in">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
