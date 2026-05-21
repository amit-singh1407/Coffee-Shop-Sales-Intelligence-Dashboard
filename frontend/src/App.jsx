import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import Analytics from './pages/Analytics';
import Forecast from './pages/Forecast';
import Insights from './pages/Insights';
import Dataset from './pages/Dataset';
import Chatbot from './pages/Chatbot';

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'analytics':
        return <Analytics />;
      case 'forecast':
        return <Forecast />;
      case 'insights':
        return <Insights />;
      case 'dataset':
        return <Dataset />;
      case 'chatbot':
        return <Chatbot />;
      default:
        return <Overview />;
    }
  };

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
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
