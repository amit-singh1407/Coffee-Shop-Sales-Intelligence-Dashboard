import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Sparkles, Sliders, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2 } from 'lucide-react';
import { getForecast } from '../services/api';

const Forecast = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Scenario Simulator Multiplier
  const [marketingMultiplier, setMarketingMultiplier] = useState(1.0);
  const [scenarioName, setScenarioName] = useState('Baseline Forecast');

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        const forecastData = await getForecast();
        setData(forecastData);
        setError(null);
      } catch (err) {
        console.error('Failed to load forecast:', err);
        setError('Could not connect to the sales forecasting engine. Verify the Flask API is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Training Random Forest regression time-series models...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 rounded-2xl max-w-xl mx-auto mt-20 border-red-500/20 text-center">
        <RefreshCw className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-red-200 mb-2">Model Fitting Error</h3>
        <p className="text-slate-400 text-sm mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-slate-800 rounded-xl hover:bg-slate-700 text-slate-200 transition-all">Retry Fitting</button>
      </div>
    );
  }

  // Pre-process chart data
  // Combine historical (last 60 days) and forecast (next 30 days)
  const historicalSliced = data.historical.slice(-60);
  
  const chartData = [
    ...historicalSliced.map(h => ({
      date: h.transaction_date,
      historical: h.revenue,
      forecast: null
    })),
    // Connect the last historical point with the first forecast point to avoid gaps
    {
      date: historicalSliced[historicalSliced.length - 1].transaction_date,
      historical: historicalSliced[historicalSliced.length - 1].revenue,
      forecast: historicalSliced[historicalSliced.length - 1].revenue
    },
    ...data.forecast.map(f => ({
      date: f.transaction_date,
      historical: null,
      forecast: Math.round(f.predicted_revenue * marketingMultiplier * 100) / 100
    }))
  ];

  // Calculate adjusted forecast figures
  const originalForecastTotal = data.predicted_total_revenue;
  const adjustedForecastTotal = originalForecastTotal * marketingMultiplier;
  const originalGrowth = data.expected_growth_pct;
  
  // Re-calculate growth compared to last 30 days actuals
  // Fetch actual revenue for the last 30 days
  const last30DaysActual = historicalSliced.slice(-30).reduce((acc, curr) => acc + curr.historical, 0);
  const adjustedGrowth = ((adjustedForecastTotal - last30DaysActual) / last30DaysActual) * 100;

  const handleScenarioChange = (multiplier, name) => {
    setMarketingMultiplier(multiplier);
    setScenarioName(name);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 font-sans tracking-tight">
          AI Sales Forecasting
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Ridge-driven forward predictions modeling weekly seasonal loops and local trends.
        </p>
      </div>

      {/* Accuracy & Growth KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Expected Next 30d Revenue</span>
          <p className="text-2xl font-black text-emerald-400 mt-2 font-mono">
            ${adjustedForecastTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-500 block mt-1">Based on active scenario model</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Projected growth</span>
          <div className="flex items-center gap-2 mt-2">
            {adjustedGrowth >= 0 ? (
              <ArrowUpRight className="w-5 h-5 text-green-400" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-red-400" />
            )}
            <p className={`text-2xl font-black font-mono ${adjustedGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {adjustedGrowth >= 0 ? '+' : ''}{adjustedGrowth.toFixed(1)}%
            </p>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Relative to last 30d actuals</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Model R² Score</span>
          <p className="text-2xl font-black text-violet-400 mt-2 font-mono">
            {data.r2_score.toFixed(3)}
          </p>
          <span className="text-[10px] text-slate-500 block mt-1">Target accuracy variance metric</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Mean Absolute Error (MAE)</span>
          <p className="text-2xl font-black text-cyan-400 mt-2 font-mono">
            ${data.mae.toFixed(0)}
          </p>
          <span className="text-[10px] text-slate-500 block mt-1">Average daily prediction offset</span>
        </div>
      </div>

      {/* Main Forecast Chart */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              Historical vs. Next 30 Days Forecast Curves
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Active scenario: <span className="text-emerald-400 font-semibold">{scenarioName}</span></p>
          </div>
          <div className="flex gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-400">
              <div className="w-2.5 h-2.5 rounded bg-slate-500" /> Historical Sales
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <div className="w-2.5 h-2.5 rounded bg-emerald-400" /> Predicted Sales
            </span>
          </div>
        </div>

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHistory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#475569" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#475569" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
              <XAxis dataKey="date" stroke="#475569" fontSize={10} tickFormatter={(tick) => tick.split('-').slice(1).join('/')} />
              <YAxis stroke="#475569" fontSize={10} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="historical" 
                stroke="#64748b" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorHistory)" 
                dot={false}
              />
              <Area 
                type="monotone" 
                dataKey="forecast" 
                stroke="#10b981" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorForecast)" 
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Scenario Sliders */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-violet-400" />
          What-If Scenario Simulation Dashboard
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <button
            onClick={() => handleScenarioChange(1.0, 'Baseline Forecast')}
            className={`p-4 rounded-xl text-left border transition-all ${
              scenarioName === 'Baseline Forecast' 
                ? 'border-emerald-500/20 bg-emerald-500/5 text-slate-200' 
                : 'border-glassBorder bg-slate-900/30 text-slate-400 hover:bg-slate-900/60'
            }`}
          >
            <h4 className="font-bold text-xs uppercase tracking-wide">Baseline Forecast</h4>
            <p className="text-sm font-black mt-2 text-white">0% Adjustments</p>
            <p className="text-[10px] text-slate-500 mt-1">Normal daily sales baseline metrics.</p>
          </button>

          <button
            onClick={() => handleScenarioChange(1.15, '15% Marketing Boost')}
            className={`p-4 rounded-xl text-left border transition-all ${
              scenarioName === '15% Marketing Boost' 
                ? 'border-emerald-500/20 bg-emerald-500/5 text-slate-200' 
                : 'border-glassBorder bg-slate-900/30 text-slate-400 hover:bg-slate-900/60'
            }`}
          >
            <h4 className="font-bold text-xs uppercase tracking-wide text-green-400">Marketing Boost</h4>
            <p className="text-sm font-black mt-2 text-white">+15% Multiplier</p>
            <p className="text-[10px] text-slate-500 mt-1">Simulates loyalty double-point Tuesday sales spikes.</p>
          </button>

          <button
            onClick={() => handleScenarioChange(1.08, 'Weekend Bakery Focus')}
            className={`p-4 rounded-xl text-left border transition-all ${
              scenarioName === 'Weekend Bakery Focus' 
                ? 'border-emerald-500/20 bg-emerald-500/5 text-slate-200' 
                : 'border-glassBorder bg-slate-900/30 text-slate-400 hover:bg-slate-900/60'
            }`}
          >
            <h4 className="font-bold text-xs uppercase tracking-wide text-violet-400">Bakery Cross-Sales</h4>
            <p className="text-sm font-black mt-2 text-white">+8% Multiplier</p>
            <p className="text-[10px] text-slate-500 mt-1">Optimizing croissants/pastries preparation schedules.</p>
          </button>

          <button
            onClick={() => handleScenarioChange(0.92, 'Severe Rainy Season')}
            className={`p-4 rounded-xl text-left border transition-all ${
              scenarioName === 'Severe Rainy Season' 
                ? 'border-red-500/20 bg-red-500/5 text-slate-200' 
                : 'border-glassBorder bg-slate-900/30 text-slate-400 hover:bg-slate-900/60'
            }`}
          >
            <h4 className="font-bold text-xs uppercase tracking-wide text-red-400">Severe Rain / Slow Mo</h4>
            <p className="text-sm font-black mt-2 text-white">-8% Multiplier</p>
            <p className="text-[10px] text-slate-500 mt-1">Simulates persistent rainy weather reducing store traffic.</p>
          </button>
        </div>

        {/* Custom manual slider */}
        <div className="mt-8 pt-6 border-t border-glassBorder flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Custom Adjuster</span>
              <span className="text-xs font-mono font-bold text-emerald-400">{Math.round((marketingMultiplier - 1) * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0.7" 
              max="1.3" 
              step="0.01" 
              value={marketingMultiplier} 
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setMarketingMultiplier(val);
                setScenarioName(`Manual Adjustment (${Math.round((val - 1) * 100)}%)`);
              }}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>
          <div className="text-right bg-black/30 border border-glassBorder p-4 rounded-xl flex items-center gap-3">
            <BarChart2 className="w-5 h-5 text-emerald-400" />
            <div className="text-left">
              <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Difference</p>
              <p className="text-sm font-black text-slate-200">
                {adjustedForecastTotal >= originalForecastTotal ? '+' : ''}
                ${(adjustedForecastTotal - originalForecastTotal).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
