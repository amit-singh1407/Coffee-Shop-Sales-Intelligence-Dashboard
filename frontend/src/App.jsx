import React, { Suspense, lazy, useState } from 'react';
import Sidebar from './components/Sidebar';

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
    <div className="min-h-screen flex bg-darkBg text-slate-100 relative font-sans">
      {/* Ambient Pulsing Glow Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brandPrimary/10 rounded-full blur-[120px] ambient-glow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brandSecondary/10 rounded-full blur-[120px] ambient-glow pointer-events-none" style={{ animationDelay: '4s' }} />

      {/* Sticky Left Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Responsive Content Workspace */}
      <main className="flex-1 min-h-screen ml-64 p-8 relative z-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto py-4">
          <Suspense fallback={<PageLoader />}>
            <ActivePage />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export default App;
