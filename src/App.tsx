import React, { useState } from 'react';
import { CelpinNavbar } from './components/CelpinNavbar';
import { CelpinFooter } from './components/CelpinFooter';
import { NotificationDrawer } from './components/NotificationDrawer';
import { NotificationToast } from './components/NotificationToast';
import { NotificationProvider } from './context/NotificationContext';
import { HomePage } from './pages/HomePage';
import { BookingPage } from './pages/BookingPage';
import { FloorMapPage } from './pages/FloorMapPage';
import { CafePage } from './pages/CafePage';
import { RewardsPage } from './pages/RewardsPage';
import { ProposalPage } from './pages/ProposalPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminPage } from './pages/AdminPage';
import { CareersPage } from './pages/CareersPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [params, setParams] = useState<any>({});

  const handleNavigate = (page: string, newParams?: any) => {
    setCurrentPage(page);
    if (newParams) {
      setParams(newParams);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-amber-600 selection:text-white">
        {/* Celpin Official Navbar */}
        <CelpinNavbar currentPage={currentPage} onNavigate={handleNavigate} />

        {/* Notifications Slide-over Drawer & Real-Time Toast */}
        <NotificationDrawer onNavigate={handleNavigate} />
        <NotificationToast onNavigate={handleNavigate} />

        {/* Main Pages */}
        <main className="flex-1 pt-18 sm:pt-20">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'booking' && (
          <BookingPage
            onNavigate={handleNavigate}
            initialSeatId={params.selectedSeatId}
            initialZone={params.selectedZone}
            preselectedCart={params.preselectedCart}
            initialLocation={params.initialLocation || params.location}
            initialCustomerName={params.customerName}
            initialCustomerEmail={params.customerEmail}
          />
        )}
        {currentPage === 'floor-map' && <FloorMapPage onNavigate={handleNavigate} />}
        {currentPage === 'cafe' && <CafePage onNavigate={handleNavigate} />}
        {currentPage === 'rewards' && <RewardsPage onNavigate={handleNavigate} />}
        {currentPage === 'proposal' && <ProposalPage />}
        {currentPage === 'register' && (
          <RegisterPage
            onNavigate={handleNavigate}
            redirectTo={params.redirectTo || 'booking'}
            initialParams={params}
          />
        )}
        {currentPage === 'careers' && <CareersPage onNavigate={handleNavigate} />}
        {currentPage === 'admin' && <AdminPage onNavigate={handleNavigate} />}
      </main>

      {/* Celpin Official Footer */}
      <CelpinFooter onNavigate={handleNavigate} />
    </div>
  </NotificationProvider>
);
}

export default App;
