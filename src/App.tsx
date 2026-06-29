import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { DonorsList } from './pages/DonorsList';
import { DonorDetail } from './pages/DonorDetail';
import { ComingSoon } from './pages/ComingSoon';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="/donors" element={<DonorsList />} />
          <Route path="/donors/:id" element={<DonorDetail />} />
          <Route
            path="/opportunities"
            element={
              <ComingSoon
                title="Opportunities"
                description="Track and manage funding opportunities across all your donor relationships. Pipeline stages, win probability, and revenue forecasting coming soon."
              />
            }
          />
          <Route
            path="/grants"
            element={
              <ComingSoon
                title="Grants"
                description="Manage the full lifecycle of your grants portfolio — from award through to final reporting and close-out. Coming soon."
              />
            }
          />
          <Route
            path="/deliverables"
            element={
              <ComingSoon
                title="Deliverables"
                description="Track milestones, reports, and tasks across all active grants and opportunities. Coming soon."
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
