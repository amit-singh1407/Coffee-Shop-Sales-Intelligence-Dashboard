import React, { useState, useEffect } from 'react';
import { 
  Database, Search, Filter, Calendar, DollarSign, Download, ChevronLeft, ChevronRight, RefreshCw, Sparkles 
} from 'lucide-react';
import { getDataset } from '../services/api';

const Dataset = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({ totalRevenue: 0, averageSales: 0, productCount: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters State
  const [search, setSearch] = useState('');
  const [store, setStore] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minRevenue, setMinRevenue] = useState('');
  const [maxRevenue, setMaxRevenue] = useState('');
  const [limit, setLimit] = useState(15);

  const fetchFilteredData = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
        search,
        store,
        category,
        startDate,
        endDate,
        minRevenue,
        maxRevenue
      };
      const res = await getDataset(params);
      setData(res.data);
      setTotalPages(res.totalPages);
      setTotalCount(res.totalCount);
      setStatistics(res.statistics);
    } catch (err) {
      console.error('Failed to load dataset:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when filters or page change
  useEffect(() => {
    fetchFilteredData();
  }, [currentPage, store, category, limit]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchFilteredData();
  };

  const handleResetFilters = () => {
    setSearch('');
    setStore('');
    setCategory('');
    setStartDate('');
    setEndDate('');
    setMinRevenue('');
    setMaxRevenue('');
    setCurrentPage(1);
    // Timeout to let state clear before trigger
    setTimeout(() => fetchFilteredData(), 50);
  };

  // Convert current table to CSV for local download
  const handleExportCSV = () => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(val => typeof val === 'string' ? `"${val}"` : val).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `coffee_sales_filtered_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 font-sans tracking-tight">
            Smart Transactions Ledger
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Query your 28,000+ transactional database using filters or standard NLP search phrases.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={data.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 font-semibold text-sm transition-all disabled:opacity-50 self-start md:self-auto shadow-lg shadow-emerald-500/5"
        >
          <Download className="w-4 h-4" />
          Export Filtered Grid
        </button>
      </div>

      {/* Dynamic Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border-emerald-500/10">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Filtered Segment Sales</span>
          <p className="text-xl font-black text-emerald-400 mt-1 font-mono">
            ${statistics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border-blue-500/10">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Average Ticket</span>
          <p className="text-xl font-black text-blue-400 mt-1 font-mono">
            ${statistics.averageSales.toFixed(2)}
          </p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border-violet-500/10">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Unique Products</span>
          <p className="text-xl font-black text-violet-400 mt-1 font-mono">
            {statistics.productCount} Items
          </p>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        {/* NLP Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Ask NLP: e.g. 'show coffee sales in January' or search product types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black/35 border border-glassBorder rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-brandPrimary transition-colors"
            />
            <div className="absolute right-3 top-3 flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
              <Sparkles className="w-3 h-3" />
              <span>AI Search</span>
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brandPrimary to-brandSecondary text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </form>

        {/* Granular filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-glassBorder">
          {/* Store select */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Store location</label>
            <select
              value={store}
              onChange={(e) => { setStore(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 bg-black/25 border border-glassBorder rounded-xl text-slate-300 text-xs focus:outline-none focus:border-slate-500"
            >
              <option value="">All Locations</option>
              <option value="Lower Manhattan">Lower Manhattan</option>
              <option value="Astoria">Astoria</option>
              <option value="Hell's Kitchen">Hell's Kitchen</option>
            </select>
          </div>

          {/* Category select */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Category</label>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 bg-black/25 border border-glassBorder rounded-xl text-slate-300 text-xs focus:outline-none focus:border-slate-500"
            >
              <option value="">All Categories</option>
              <option value="Coffee">Coffee</option>
              <option value="Tea">Tea</option>
              <option value="Bakery">Bakery</option>
              <option value="Sandwiches">Sandwiches</option>
            </select>
          </div>

          {/* Date range inputs */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 bg-black/25 border border-glassBorder rounded-xl text-slate-300 text-xs focus:outline-none focus:border-slate-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 bg-black/25 border border-glassBorder rounded-xl text-slate-300 text-xs focus:outline-none focus:border-slate-500"
            />
          </div>
        </div>

        {/* Range and Apply Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-glassBorder">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                placeholder="Min Revenue" 
                value={minRevenue}
                onChange={(e) => setMinRevenue(e.target.value)}
                className="w-24 px-3 py-2 bg-black/25 border border-glassBorder rounded-xl text-slate-300 text-xs focus:outline-none"
              />
              <span className="text-slate-600 text-xs">-</span>
              <input 
                type="number" 
                placeholder="Max Revenue" 
                value={maxRevenue}
                onChange={(e) => setMaxRevenue(e.target.value)}
                className="w-24 px-3 py-2 bg-black/25 border border-glassBorder rounded-xl text-slate-300 text-xs focus:outline-none"
              />
            </div>
            <button
              onClick={() => { setCurrentPage(1); fetchFilteredData(); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs rounded-xl font-bold border border-glassBorder transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              Apply Range
            </button>
          </div>

          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-4 py-2 text-slate-500 hover:text-slate-300 text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Grid Table */}
      <div className="glass-panel rounded-2xl overflow-hidden relative border-glassBorder">
        {loading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-10">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glassBorder bg-white/[0.01]">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">ID</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Date</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Time</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Customer ID</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Store</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Product</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Qty</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right font-mono">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glassBorder text-xs text-slate-300 font-sans">
              {data.map((row) => (
                <tr key={row.transaction_id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 font-mono text-slate-500 font-semibold">{row.transaction_id}</td>
                  <td className="p-4 font-mono text-slate-400">{row.transaction_date}</td>
                  <td className="p-4 text-slate-500">{row.transaction_time}</td>
                  <td className="p-4 font-semibold text-slate-400">{row.customer_id}</td>
                  <td className="p-4 text-slate-300">{row.store_location}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      row.product_category === 'Coffee' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                      row.product_category === 'Bakery' ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' :
                      row.product_category === 'Sandwiches' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                      'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                      {row.product_category}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-200">{row.product_type}</td>
                  <td className="p-4 text-right font-semibold">{row.quantity}</td>
                  <td className="p-4 text-right font-bold text-emerald-400 font-mono">${row.revenue.toFixed(2)}</td>
                </tr>
              ))}
              {data.length === 0 && !loading && (
                <tr>
                  <td colSpan="9" className="p-12 text-center text-slate-500 font-medium leading-relaxed">
                    No transactions match your active filters. Try searching for another keyword or resetting sliders.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Panel */}
        <div className="p-4 border-t border-glassBorder bg-white/[0.01] flex items-center justify-between flex-wrap gap-4 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={limit}
              onChange={(e) => { setLimit(parseInt(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-1.5 bg-black/25 border border-glassBorder rounded text-slate-300 text-xs focus:outline-none"
            >
              <option value={10}>10 Rows</option>
              <option value={15}>15 Rows</option>
              <option value={25}>25 Rows</option>
              <option value={50}>50 Rows</option>
            </select>
            <span>of {totalCount.toLocaleString()} total transactions</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-slate-900 border border-glassBorder text-slate-400 hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>Page <span className="text-slate-200 font-bold">{currentPage}</span> of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-slate-900 border border-glassBorder text-slate-400 hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dataset;
