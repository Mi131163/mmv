import { useState } from 'react';
import { Search, Calendar, Bell, Users, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { currentUser, notifications } from '../../data/mockData';

interface HeaderProps {
  title: string;
}

const searchResults: Record<string, { name: string; meta: string; path: string }[]> = {
  Donors: [
    { name: 'Bill & Melinda Gates Foundation', meta: 'Philanthropic · Active', path: '/donors/donor-1' },
    { name: 'USAID — Global Health Bureau', meta: 'Government · Active', path: '/donors/donor-2' },
    { name: 'Wellcome Trust', meta: 'Philanthropic · Active', path: '/donors/donor-3' },
    { name: 'UNITAID', meta: 'Multilateral · Active', path: '/donors/donor-4' },
  ],
  Grants: [
    { name: 'MMV-GF-2024-01', meta: 'Gates Foundation · Ongoing', path: '/grants' },
    { name: 'MMV-USAID-2024-01', meta: 'USAID · Ongoing', path: '/grants' },
    { name: 'MMV-WT-2023-01', meta: 'Wellcome Trust · Ongoing', path: '/grants' },
  ],
};

export function Header({ title }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="fixed top-0 left-14 right-0 h-12 bg-bg-surface border-b border-border-subtle flex items-center px-5 gap-4 z-20">
      <h1 className="text-[17px] font-bold text-text-primary whitespace-nowrap tracking-tight">{title}</h1>

      {/* Search */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-[300px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            placeholder="Search donors, grants…"
            className="w-full h-8 pl-8 pr-10 bg-bg-page border border-border-subtle rounded-lg text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-text-primary focus:bg-bg-surface transition-all"
          />
          {!searchFocused && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary font-mono select-none">
              ⌘K
            </span>
          )}
          {searchFocused && (
            <div className="absolute top-full mt-1.5 left-0 right-0 bg-bg-surface border border-border-default rounded-xl shadow-panel z-50 py-2 min-w-[340px] overflow-hidden">
              {Object.entries(searchResults).map(([category, items]) => (
                <div key={category}>
                  <div className="px-3 py-1.5 text-[11px] font-bold text-text-tertiary uppercase tracking-[0.06em]">
                    {category}
                  </div>
                  {items.map((item) => (
                    <button
                      key={item.name}
                      onMouseDown={() => navigate(item.path)}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-bg-hover transition-colors text-left"
                    >
                      <div className="w-6 h-6 rounded-md bg-neutral-bg flex items-center justify-center flex-shrink-0">
                        {category === 'Donors' ? (
                          <Users size={12} className="text-text-secondary" />
                        ) : (
                          <Coins size={12} className="text-text-secondary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-text-primary truncate">{item.name}</p>
                        <p className="text-[11px] text-text-tertiary">{item.meta}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          className="w-8 h-8 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors"
          aria-label="Calendar"
        >
          <Calendar size={16} strokeWidth={1.75} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8 h-8 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={16} strokeWidth={1.75} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-danger rounded-full" />
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-[360px] max-h-[480px] bg-bg-surface border border-border-subtle rounded-xl shadow-panel z-50 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle flex-shrink-0">
                  <h3 className="text-[15px] font-bold text-text-primary tracking-tight">Notifications</h3>
                  <button className="text-[13px] text-text-tertiary hover:text-text-primary transition-colors">
                    Mark all read
                  </button>
                </div>
                <div className="overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b border-border-subtle last:border-0 hover:bg-bg-hover transition-colors ${
                        !n.read ? 'bg-bg-hover' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {!n.read && (
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                        )}
                        <div className={!n.read ? '' : 'pl-4'}>
                          <p className="text-[13px] font-semibold text-text-primary">{n.title}</p>
                          <p className="text-[13px] text-text-secondary mt-0.5 leading-snug">{n.description}</p>
                          <p className="text-[11px] text-text-tertiary mt-1.5">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="ml-1">
          <Avatar initials={currentUser.initials} size="sm" />
        </div>
      </div>
    </header>
  );
}
