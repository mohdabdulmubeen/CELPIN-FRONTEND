import { useState } from 'react';

// Celpin Components & Pages
import { CelpinNavbar } from './components/CelpinNavbar';
import { CelpinFooter } from './components/CelpinFooter';
import { HomePage } from './pages/HomePage';
import { BookingPage } from './pages/BookingPage';
import { FloorMapPage } from './pages/FloorMapPage';
import { CafePage } from './pages/CafePage';
import { RewardsPage } from './pages/RewardsPage';
import { ProposalPage } from './pages/ProposalPage';
import { RegisterPage } from './pages/RegisterPage';

export function App() {
  // Celpin Navigation State
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<any>({});

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    if (params) setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-amber-600 selection:text-white">
      <CelpinNavbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1 pt-18 sm:pt-20">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'booking' && (
          <BookingPage
            onNavigate={handleNavigate}
            initialSeatId={pageParams.selectedSeatId}
            initialZone={pageParams.selectedZone}
            preselectedCart={pageParams.preselectedCart}
            initialLocation={pageParams.initialLocation || pageParams.location}
            initialCustomerName={pageParams.customerName}
            initialCustomerEmail={pageParams.customerEmail}
          />
        )}
        {currentPage === 'floor-map' && <FloorMapPage onNavigate={handleNavigate} />}
        {currentPage === 'cafe' && <CafePage onNavigate={handleNavigate} />}
        {currentPage === 'rewards' && <RewardsPage onNavigate={handleNavigate} />}
        {currentPage === 'proposal' && <ProposalPage />}
        {currentPage === 'register' && (
          <RegisterPage
            onNavigate={handleNavigate}
            redirectTo={pageParams.redirectTo || 'booking'}
            initialParams={pageParams}
          />
        )}
      </main>
      <CelpinFooter onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
