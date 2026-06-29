import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Coins, CheckSquare } from 'lucide-react';
import { useState } from 'react';
import { currentUser } from '../../data/mockData';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Donors', path: '/donors' },
  { icon: FileText, label: 'Opportunities', path: '/opportunities' },
  { icon: Coins, label: 'Grants', path: '/grants' },
  { icon: CheckSquare, label: 'Deliverables', path: '/deliverables' },
];

export function Sidebar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-14 bg-sidebar-bg flex flex-col items-center py-4 z-30">
      {/* Logo */}
      <div className="w-8 h-8 flex items-center justify-center mb-7">
        <span className="text-white font-black text-[13px] tracking-tight leading-none">MMV</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col items-center gap-0.5 flex-1">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive =
            path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <div key={path} className="relative group">
              <NavLink
                to={path}
                aria-label={label}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-sidebar-icon hover:bg-white/6 hover:text-white'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.75} />
              </NavLink>
              {/* Active indicator — left edge bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r-full -ml-0" />
              )}
              {/* Tooltip */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#1A1A1A] border border-white/10 text-white text-[12px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-panel">
                {label}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User avatar */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-7 h-7 rounded-full bg-white/15 text-white text-[11px] font-bold flex items-center justify-center hover:bg-white/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-bg"
          aria-label="User menu"
        >
          {currentUser.initials}
        </button>

        {showUserMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
            <div className="absolute left-full ml-3 bottom-0 w-52 bg-bg-surface border border-border-subtle rounded-xl shadow-panel z-50 py-2 overflow-hidden">
              <div className="px-3 py-2.5 border-b border-border-subtle mb-1">
                <p className="text-[14px] font-semibold text-text-primary">{currentUser.name}</p>
                <p className="text-[12px] text-text-tertiary mt-0.5">Relationship Manager</p>
              </div>
              {['Account settings', 'Manage users', 'Sign out'].map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-3 py-2 text-[14px] text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
