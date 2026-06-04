import React, { Suspense, lazy, useState } from 'react';
import Sidebar from './components/Sidebar';
import { Menu } from 'lucide-react';

const Overview = lazy(() => import('./pages/Overview'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Forecast = lazy(() => import('./pages/Forecast'));
const Insights = lazy(() => import('./pages/Insights'));
const Dataset = lazy(() => import('./pages/Dataset'));
const Chatbot = lazy(() => import('./pages/Chatbot'));

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
    <div className="w-12 h-12 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
    <p className="text-slate-400 font-medium">Loading dashboard module...</p>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pageMap = {
    overview: Overview,
    analytics: Analytics,
    forecast: Forecast,
    insights: Insights,
    dataset: Dataset,
    chatbot: Chatbot,
  };

  const ActivePage = pageMap[activeTab] || Overview;

  return (
    <div className="min-h-screen flex bg-darkBg text-slate-100 relative font-sans overflow-x-hidden">
      {/* Ambient Pulsing Glow Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brandPrimary/10 rounded-full blur-[120px] ambient-glow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brandSecondary/10 rounded-full blur-[120px] ambient-glow pointer-events-none" style={{ animationDelay: '4s' }} />

      {/* Mobile Menu Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 backdrop-blur-md text-slate-200 hover:bg-slate-700/80 transition-colors shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sticky Left Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Responsive Content Workspace */}
      <main className="flex-1 min-h-screen lg:ml-64 p-4 sm:p-6 lg:p-8 relative z-10 overflow-y-auto w-full pt-20 lg:pt-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<PageLoader />}>
            <ActivePage />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export default App;
