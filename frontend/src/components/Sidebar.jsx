import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  BrainCircuit, 
  Database, 
  MessageSquare, 
  LayoutDashboard, 
  Coffee,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', name: 'AI Overview', icon: LayoutDashboard },
    { id: 'analytics', name: 'Advanced Analytics', icon: BarChart3 },
    { id: 'forecast', name: 'AI Forecast', icon: TrendingUp },
    { id: 'insights', name: 'AI Insights', icon: BrainCircuit },
    { id: 'dataset', name: 'Smart Dataset', icon: Database },
    { id: 'chatbot', name: 'AI Chatbot', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass-panel border-r border-glassBorder flex flex-col z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-glassBorder flex items-center gap-3">
        <div className="bg-gradient-to-tr from-brandPrimary to-brandSecondary p-2 rounded-xl shadow-lg shadow-brandPrimary/20 animate-pulse">
          <Coffee className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-wide text-lg font-sans">
            BrewIntel
          </h1>
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
            Sales BI Engine
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group font-sans text-sm font-medium ${
                isActive 
                  ? 'bg-gradient-to-r from-brandPrimary/15 to-brandSecondary/5 text-emerald-400 border border-brandPrimary/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.12)]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-300'
              }`} />
              <span>{item.name}</span>
              
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              )}
            </button>
          );
        })}
      </nav>

    </aside>
  );
};

export default Sidebar;
