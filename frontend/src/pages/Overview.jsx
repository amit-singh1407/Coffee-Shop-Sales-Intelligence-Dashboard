import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Sparkles, 
  Store, 
  ChevronsDown,
  Info,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { getOverview } from '../services/api';

const Overview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const overviewData = await getOverview();
        setData(overviewData);
        setError(null);
      } catch (err) {
        console.error('Failed to load overview data:', err);
        setError('Unable to reach the sales intelligence API. Please verify the backend is deployed and VITE_API_BASE_URL is set correctly.');
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Crunching retail transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 rounded-2xl max-w-xl mx-auto mt-20 border-red-500/20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4 animate-bounce" />
        <h3 className="text-lg font-bold text-red-200 mb-2">Connection Failure</h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-200 font-semibold text-sm transition-all"
        >
          Try Reconnecting
        </button>
      </div>
    );
  }

  const { kpis, aiWidgets } = data;

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `$${kpis.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      glow: 'from-emerald-500/10 to-transparent',
      textColor: 'text-emerald-400',
      desc: 'All-time cumulative sales'
    },
    {
      title: 'Total Orders',
      value: kpis.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      glow: 'from-blue-500/10 to-transparent',
      textColor: 'text-blue-400',
      desc: 'Unique customer checkouts'
    },
    {
      title: 'Avg Order Value',
      value: `$${kpis.avgOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      glow: 'from-amber-500/10 to-transparent',
      textColor: 'text-amber-400',
      desc: 'Mean ticket transaction revenue'
    },
    {
      title: 'Monthly Growth',
      value: `${kpis.monthlyGrowthPct >= 0 ? '+' : ''}${kpis.monthlyGrowthPct.toFixed(1)}%`,
      icon: kpis.monthlyGrowthPct >= 0 ? ArrowUpRight : ArrowDownRight,
      glow: kpis.monthlyGrowthPct >= 0 ? 'from-green-500/10 to-transparent' : 'from-red-500/10 to-transparent',
      textColor: kpis.monthlyGrowthPct >= 0 ? 'text-green-400' : 'text-red-400',
      desc: 'Last 30d vs. previous 30d'
    },
    {
      title: 'AI Sales Prediction',
      value: `$${kpis.aiSalesPrediction.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      icon: Sparkles,
      glow: 'from-violet-500/15 to-transparent',
      textColor: 'text-violet-400',
      desc: 'Projected next 30 days revenue'
    },
    {
      title: 'Best Store',
      value: kpis.bestStore,
      icon: Store,
      glow: 'from-cyan-500/10 to-transparent',
      textColor: 'text-cyan-400',
      desc: 'Top grossing retail footprint'
    },
    {
      title: 'Worst Product',
      value: kpis.worstProduct,
      icon: ChevronsDown,
      glow: 'from-rose-500/10 to-transparent',
      textColor: 'text-rose-400',
      desc: 'Lowest performing catalog item'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 font-sans tracking-tight">
            Executive Intelligence
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time shop chain monitoring with machine learning diagnostics.
          </p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-2 self-start md:self-auto shadow-lg shadow-emerald-500/5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
            System Live
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className={`glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col relative overflow-hidden bg-gradient-to-b ${card.glow}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl bg-slate-900/60 border border-glassBorder ${card.textColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <span className={`text-2xl font-black ${card.textColor} tracking-tight font-sans`}>
                {card.value}
              </span>
              <span className="text-[10px] text-slate-400 mt-2 font-medium">
                {card.desc}
              </span>
            </div>
          );
        })}
      </div>

      {/* AI Widgets Section */}
      <div className="mt-10">
        <h3 className="text-lg font-bold text-slate-300 mb-6 flex items-center gap-2 font-sans tracking-wide">
          <Sparkles className="w-5 h-5 text-violet-400" />
          Active AI Intelligence
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* AI Insight Card */}
          <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent relative overflow-hidden border-blue-500/10 shadow-lg shadow-black/10 group hover:border-blue-500/25 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-md">
                <Info className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-blue-200 tracking-wide">AI Insight Card</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed font-sans">
              "{aiWidgets.insightCard}"
            </p>
            <div className="mt-6 flex items-center text-xs text-blue-400 font-semibold gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* AI Recommendation Card */}
          <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-violet-500/5 to-transparent relative overflow-hidden border-violet-500/10 shadow-lg shadow-black/10 group hover:border-violet-500/25 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shadow-md">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-violet-200 tracking-wide">AI Recommendation</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed font-sans">
              "{aiWidgets.recommendationCard}"
            </p>
            <div className="mt-6 flex items-center text-xs text-violet-400 font-semibold gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Apply recommendation</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* AI Alert Card */}
          <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent relative overflow-hidden border-amber-500/10 shadow-lg shadow-black/10 group hover:border-amber-500/25 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-md">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <h4 className="font-extrabold text-sm text-amber-200 tracking-wide">Anomaly Diagnostic Alert</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed font-sans">
              {aiWidgets.alertCard.includes("Significant drop") ? (
                <span className="text-amber-300 font-medium">"{aiWidgets.alertCard}"</span>
              ) : (
                `"${aiWidgets.alertCard}"`
              )}
            </p>
            <div className="mt-6 flex items-center text-xs text-amber-400 font-semibold gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Inspect anomaly</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
