import { useState, useEffect } from 'react';

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

// W-Hub Components & Pages
import { WHubNavbar } from './components/WHubNavbar';
import { WHubFooter } from './components/WHubFooter';
import { WHubChatWidget } from './components/WHubChatWidget';
import { WHubHomePage } from './pages/WHubHomePage';
import { ApplicationModal } from './components/ApplicationModal';

import { Coffee, Rocket } from 'lucide-react';

export function App() {
  // Read initial project from URL query (?project=celpin or ?project=whub)
  const [activeProject, setActiveProject] = useState<'celpin' | 'whub'>(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('project')?.toLowerCase();
    if (p === 'whub') return 'whub';
    return 'celpin'; // Default to Celpin as requested
  });

  // Celpin Navigation State
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<any>({});

  // W-Hub Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyRole, setApplyRole] = useState<'startup' | 'mentor' | 'student'>('startup');

  // Handle URL updates when switching projects
  const handleSwitchProject = (project: 'celpin' | 'whub') => {
    setActiveProject(project);
    const url = new URL(window.location.href);
    url.searchParams.set('project', project);
    window.history.pushState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    if (params) setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenApply = (role: 'startup' | 'mentor' | 'student' = 'startup') => {
    setApplyRole(role);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-amber-600 selection:text-white">
      {/* Global Project Switcher Bar */}
      <div className="bg-slate-900 text-white text-xs font-medium py-1.5 px-4 flex items-center justify-between border-b border-slate-800 z-50 sticky top-0">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-400 hidden sm:inline">Active Workspace:</span>
          <span className="font-semibold text-white">
            {activeProject === 'celpin' ? 'Celpin Co-Working Café' : 'W-Hub Innovation Ecosystem'}
          </span>
        </div>
        <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => handleSwitchProject('celpin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
              activeProject === 'celpin'
                ? 'bg-amber-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to Celpin Co-Working Café UI"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Celpin</span>
          </button>
          <button
            onClick={() => handleSwitchProject('whub')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
              activeProject === 'whub'
                ? 'bg-orange-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to W-Hub Warangal Ecosystem UI"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>W-Hub</span>
          </button>
        </div>
      </div>

      {/* RENDER CELPIN COWORKING PROJECT */}
      {activeProject === 'celpin' && (
        <>
          <CelpinNavbar currentPage={currentPage} onNavigate={handleNavigate} />
          <main className="flex-1 pt-16">
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
        </>
      )}

      {/* RENDER W-HUB ECOSYSTEM PROJECT */}
      {activeProject === 'whub' && (
        <>
          <WHubNavbar onOpenApply={handleOpenApply} />
          <main className="flex-1">
            <WHubHomePage onOpenApply={handleOpenApply} />
          </main>
          <ApplicationModal
            isOpen={isApplyModalOpen}
            onClose={() => setIsApplyModalOpen(false)}
            defaultRole={applyRole}
          />
          <WHubChatWidget onOpenApply={handleOpenApply} />
          <WHubFooter onOpenApply={handleOpenApply} />
        </>
      )}
    </div>
  );
}

export default App;
