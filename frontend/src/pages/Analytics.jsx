import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { BarChart3, PieChart as PieIcon, Users, Flame, ChevronRight, AlertTriangle, ShieldAlert } from 'lucide-react';
import { getAnalytics } from '../services/api';

const COLORS = ['#10b981', '#8b5cf6', '#3b82f6', '#f59e0b', '#ec4899'];
const SEGMENT_COLORS = {
  'Morning Rushers': '#10b981',
  'Weekend Treaters': '#8b5cf6',
  'Premium Lunchers': '#3b82f6'
};

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('sales'); // sales, product, customer

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const analyticsData = await getAnalytics();
        setData(analyticsData);
        setError(null);
      } catch (err) {
        console.error('Failed to load analytics:', err);
        setError('Failed to load advanced analytics. Please verify that the backend API is reachable and VITE_API_BASE_URL is configured.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="w-12 h-12 rounded-full border-2 border-brandSecondary border-t-transparent animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Modeling transaction parameters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 rounded-2xl max-w-xl mx-auto mt-20 border-red-500/20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-red-200 mb-2 font-sans">Data Error</h3>
        <p className="text-slate-400 text-sm mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-slate-800 rounded-xl hover:bg-slate-700 text-slate-200 transition-all">Retry</button>
      </div>
    );
  }

  // Pre-process store share for charts
  const storeChartData = data.stores.map((s) => ({
    name: s.store_location,
    value: s.revenue
  }));

  const categoryChartData = data.categories.map((c) => ({
    name: c.product_category,
    value: c.revenue
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 font-sans tracking-tight">
          Advanced Analytics
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Explore granular store transactions, seasonal footprints, and machine learning segments.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-glassBorder gap-6 font-sans">
        <button
          onClick={() => setActiveTab('sales')}
          className={`pb-4 text-sm font-semibold tracking-wider uppercase transition-all relative ${
            activeTab === 'sales' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Sales & Hour Analytics
          {activeTab === 'sales' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('product')}
          className={`pb-4 text-sm font-semibold tracking-wider uppercase transition-all relative ${
            activeTab === 'product' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Product Intelligence
          {activeTab === 'product' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('customer')}
          className={`pb-4 text-sm font-semibold tracking-wider uppercase transition-all relative ${
            activeTab === 'customer' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Customer Behavior (ML)
          {activeTab === 'customer' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          )}
        </button>
      </div>

      {/* TAB CONTENTS */}

      {/* TAB 1: SALES & HOUR ANALYTICS */}
      {activeTab === 'sales' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Peak Buying Hours */}
            <div className="glass-panel p-6 rounded-2xl lg:col-span-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                Hourly Demand Profile (24h Distribution)
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.hourlyDemand} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="hour" stroke="#475569" fontSize={11} tickFormatter={(h) => `${h}:00`} />
                    <YAxis stroke="#475569" fontSize={11} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Sales ($)">
                      {data.hourlyDemand.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.hour >= 8 && entry.hour <= 11 ? '#10b981' : '#1e293b'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
                * Highlighted cells reveal peak rush operations occurring between 8:00 AM - 11:00 AM.
              </p>
            </div>

            {/* Store footprint Share */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-violet-400" />
                Location Revenue Share
              </h3>
              <div className="h-56 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={storeChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {storeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col text-center">
                  <span className="text-2xl font-black text-white tracking-tight">3 Stores</span>
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest mt-0.5">Footprint</span>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                {data.stores.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-slate-300 font-medium">{s.store_location}</span>
                    </div>
                    <span className="text-slate-400 font-mono font-semibold">{s.share}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekend vs Weekday Category Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
                Category Revenue contribution
              </h3>
              <div className="h-52 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={75}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {data.categories.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[(idx + 2) % COLORS.length] }} />
                      <span className="text-slate-300 font-medium">{c.product_category}</span>
                    </div>
                    <span className="text-slate-400 font-mono font-semibold">${c.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl lg:col-span-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
                Weekday vs Weekend Category Shares
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.weekendVsWeekday} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day_type" stroke="#475569" fontSize={11} />
                    <YAxis stroke="#475569" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="Coffee" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Bakery" fill="#8b5cf6" stackId="a" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Sandwiches" fill="#3b82f6" stackId="a" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Tea" fill="#f59e0b" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">
                * Note the massive surge in Bakery sales on weekends compared to weekday averages.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT INTELLIGENCE */}
      {activeTab === 'product' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="glass-panel p-6 rounded-2xl border-emerald-500/10">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400 rotate-180" />
              Top Revenue Catalog items
            </h3>
            <div className="space-y-4">
              {data.productIntelligence.topRevenue.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-glassBorder hover:border-emerald-500/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{p.product_type}</p>
                      <p className="text-[10px] text-slate-500">{p.product_category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold font-mono text-emerald-400">${p.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-[10px] text-slate-500">{p.quantity.toLocaleString()} units sold</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Declining Products */}
          <div className="glass-panel p-6 rounded-2xl border-rose-500/10">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Underperforming / Declining Items
            </h3>
            <div className="space-y-4">
              {data.productIntelligence.declining.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-glassBorder hover:border-rose-500/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-sm">
                      -{idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{p.product_type}</p>
                      <p className="text-[10px] text-slate-500">{p.product_category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold font-mono text-rose-400">${p.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-[10px] text-slate-500">Sales dropping month-over-month</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-white/[0.01] border border-glassBorder mt-6 text-xs text-slate-400 leading-relaxed">
              <span className="font-bold text-slate-300 block mb-1">AI Recommendation Insight:</span>
              Green Tea is showing a -1.5% MoM decline. We recommend replacing low-demand loose-leaf tea categories with seasonal iced matchas or high-margin items to boost category revenues.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER BEHAVIOR */}
      {activeTab === 'customer' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Segments Summary */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between lg:col-span-1">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brandSecondary" />
                  K-Means Segment Profiles
                </h3>
                <div className="space-y-4">
                  {data.segments.summary.map((seg, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-xl border border-glassBorder relative overflow-hidden"
                      style={{ borderLeft: `4px solid ${SEGMENT_COLORS[seg.segment]}` }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-slate-200">{seg.segment}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-slate-400">{seg.share_pct}%</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2">
                        Avg Ticket: <strong className="text-slate-300">${seg.avg_order_value}</strong> | Visited: <strong className="text-slate-300">{seg.avg_frequency} times</strong>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Mornings: {seg.morning_ratio}% | Weekends: {seg.weekend_ratio}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Segment Clustering Map (Scatter) */}
            <div className="glass-panel p-6 rounded-2xl lg:col-span-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
                Customer Behavioral Clustering Map
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis 
                      type="number" 
                      dataKey="orders_count" 
                      name="Transactions" 
                      stroke="#475569" 
                      fontSize={11} 
                      label={{ value: 'Transaction Count', position: 'bottom', fill: '#475569', fontSize: 11 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="total_spend" 
                      name="Total Spend" 
                      stroke="#475569" 
                      fontSize={11} 
                      label={{ value: 'Total Spend ($)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 11 }}
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    {Object.keys(SEGMENT_COLORS).map((name) => (
                      <Scatter
                        key={name}
                        name={name}
                        data={data.segments.scatter.filter(s => s.segment_name === name)}
                        fill={SEGMENT_COLORS[name]}
                        shape="circle"
                      />
                    ))}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
                * The scatter map visualizes 200 random customers plotted across Total Spend (Y) and Frequency (X). K-Means groups Morning Rushers (Green), Premium Lunchers (Blue), and Weekend Treaters (Purple).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
