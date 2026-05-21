import React, { useState, useEffect } from 'react';
import { 
  Sparkles, DollarSign, Store, Coffee, Clock, RefreshCw, AlertTriangle
} from 'lucide-react';
import { getInsights } from '../services/api';

const Insights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const insightsData = await getInsights();
        setData(insightsData);
        setError(null);
      } catch (err) {
        console.error('Failed to load insights:', err);
        setError('Failed to retrieve automated retail insights. Verify the Flask API is online.');
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Extracting data-mining insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 rounded-2xl max-w-xl mx-auto mt-20 border-red-500/20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-red-200 mb-2">Insights Interrupted</h3>
        <p className="text-slate-400 text-sm mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-slate-800 rounded-xl hover:bg-slate-700 text-slate-200 transition-all">Retry</button>
      </div>
    );
  }

  const sections = [
    {
      id: 'revenue',
      title: 'Revenue Insights',
      icon: DollarSign,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      glow: 'from-emerald-500/5 to-transparent',
      insights: data.revenue
    },
    {
      id: 'store',
      title: 'Store Performance',
      icon: Store,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      glow: 'from-blue-500/5 to-transparent',
      insights: data.store
    },
    {
      id: 'product',
      title: 'Product Intelligence',
      icon: Coffee,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
      glow: 'from-violet-500/5 to-transparent',
      insights: data.product
    },
    {
      id: 'time',
      title: 'Time & Traffic Peaks',
      icon: Clock,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      glow: 'from-amber-500/5 to-transparent',
      insights: data.time
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 font-sans tracking-tight">
          AI Automated Insights
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Python-driven intelligence mining trends, correlations, and anomalies across your locations.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.id} className="glass-panel p-6 rounded-2xl flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-xl border ${section.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-200 tracking-wide text-sm font-sans uppercase">
                  {section.title}
                </h3>
              </div>

              <div className="space-y-6 flex-1">
                {section.insights.map((insight, idx) => (
                  <div 
                    key={idx} 
                    className={`p-5 rounded-2xl bg-gradient-to-br ${section.glow} border border-glassBorder hover:border-slate-500/10 transition-colors`}
                  >
                    <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider mb-2">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-sans">
                      {insight.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overview recommendation summary */}
      <div className="glass-panel p-6 rounded-2xl bg-gradient-to-r from-violet-500/5 to-emerald-500/5 border-violet-500/10 flex items-center gap-6">
        <div className="bg-violet-500/10 border border-violet-500/20 p-3 rounded-xl text-violet-400 hidden md:block">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h4 className="font-extrabold text-sm text-slate-200 mb-1">Intelligence Generation Cycle</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            BrewIntel mines transactions periodically. Every insight above is dynamically recalculated directly from your live database, ensuring zero hardcoded statements and absolute business relevance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Insights;
