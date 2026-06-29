import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Coins, CheckSquare } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '../ui/Avatar';
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
    <aside className="fixed left-0 top-0 h-full w-14 bg-bg-surface border-r border-border-subtle flex flex-col items-center py-3 z-30">
      {/* Logo mark */}
      <div className="w-8 h-8 flex items-center justify-center mb-6">
        <span className="text-accent font-bold text-[13px] tracking-tight leading-none">MMV</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive =
            path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <div key={path} className="relative group">
              <NavLink
                to={path}
                aria-label={label}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? 'bg-accent-subtle text-accent'
                    : 'text-text-tertiary hover:bg-bg-hover hover:text-text-primary'
                }`}
              >
                <Icon size={18} />
              </NavLink>
              {/* Tooltip */}
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-text-primary text-white text-[12px] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
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
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-full"
          aria-label="User menu"
        >
          <Avatar initials={currentUser.initials} size="sm" />
        </button>

        {showUserMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
            <div className="absolute left-full ml-2 bottom-0 w-52 bg-bg-surface border border-border-default rounded-xl shadow-lg z-50 py-2">
              <div className="px-3 py-2 border-b border-border-subtle mb-1">
                <p className="text-[14px] font-medium text-text-primary">{currentUser.name}</p>
                <p className="text-[12px] text-text-tertiary">Relationship Manager</p>
              </div>
              {['Account settings', 'Manage users', 'Sign out'].map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-3 py-2 text-[14px] text-text-secondary hover:bg-bg-hover transition-colors"
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
