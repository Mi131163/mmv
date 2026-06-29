import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/donors': 'Donors',
  '/opportunities': 'Opportunities',
  '/grants': 'Grants',
  '/deliverables': 'Deliverables',
};

function getTitle(pathname: string): string {
  if (pathname.startsWith('/donors/')) return 'Donor Detail';
  return pageTitles[pathname] ?? 'MMV';
}

export function AppShell() {
  const location = useLocation();
  const title = getTitle(location.pathname);

  return (
    <div className="min-h-screen bg-bg-page">
      <Sidebar />
      <div className="pl-14 pt-12">
        <Header title={title} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
