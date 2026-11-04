import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  Users, 
  Activity, 
  Play, 
  Pause, 
  PlusCircle, 
  ShoppingBag, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  Building2,
  RefreshCw,
  Download
} from 'lucide-react';
import { Product, SaleEvent, Seller, Souk } from '../types';
import { 
  calculateAnalyticsSummary, 
  formatCurrencyMAD, 
  formatUSDApprox,
  generateSalesCSV,
  downloadCSVFile
} from '../utils/analytics';

interface AnalyticsDashboardProps {
  products: Product[];
  sales: SaleEvent[];
  sellers: Seller[];
  souks: Souk[];
  onTriggerRandomSale: () => void;
  onQuickRestock: (productId: number, addQuantity: number) => void;
  onOpenNewSaleModal: () => void;
  lang: 'en' | 'ar';
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  products,
  sales,
  sellers,
  souks,
  onTriggerRandomSale,
  onQuickRestock,
  onOpenNewSaleModal,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [autoSimulate, setAutoSimulate] = useState(false);

  // Auto-stream effect when enabled
  useEffect(() => {
    if (!autoSimulate) return;
    const interval = setInterval(() => {
      onTriggerRandomSale();
    }, 6000);
    return () => clearInterval(interval);
  }, [autoSimulate, onTriggerRandomSale]);

  const summary = calculateAnalyticsSummary(products, sales, sellers, souks);

  const lowStockItems = products.filter(
    p => p.stock > 0 && p.stock <= p.low_stock_threshold
  );
  const outOfStockItems = products.filter(p => p.stock <= 0);

  // SVG Area Chart points for hourly trend
  const maxHourlyRevenue = Math.max(...summary.recentHourlyTrend.map(h => h.revenue), 100);
  const chartPoints = summary.recentHourlyTrend.map((h, index) => {
    const x = (index / (summary.recentHourlyTrend.length - 1)) * 500;
    const y = 140 - (h.revenue / maxHourlyRevenue) * 110;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-8" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Real-Time Live Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {isAr ? 'بث البيانات الحرفية اللحظي' : 'Live Medina Telemetry & Sales'}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-stone-900">
            {isAr ? 'لوحة تحليلات المبيعات ومخزون الصناع' : 'Real-Time Sales & Inventory Analytics'}
          </h1>
          <p className="text-xs text-stone-500">
            {isAr 
              ? 'متابعة لحظية لتدفق المبيعات النقدية والإلكترونية، سرعة نفاذ السلع في أسواق فاس القديمة.' 
              : 'Live cash-in-souk and digital sales streams, stock depletion velocity, and artisan revenue.'}
          </p>
        </div>

        {/* Live Simulator Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoSimulate(!autoSimulate)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              autoSimulate
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {autoSimulate ? <Pause className="w-3.5 h-3.5 text-amber-700" /> : <Play className="w-3.5 h-3.5 text-emerald-700" />}
            <span>{autoSimulate ? (isAr ? 'إيقاف المحاكاة' : 'Pause Live Feed') : (isAr ? 'تشغيل البث الآلي' : 'Live Stream Mode')}</span>
          </button>

          <button
            onClick={onTriggerRandomSale}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            title="Simulate single in-souk customer purchase"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'محاكاة بيع فوري' : 'Simulate Sale'}</span>
          </button>

          <button
            onClick={onOpenNewSaleModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{isAr ? 'تسجيل بيع يدوي' : 'Record Manual Sale'}</span>
          </button>

          <button
            onClick={() => {
              const csv = generateSalesCSV(sales);
              downloadCSVFile(csv, `fez_souk_sales_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Download full sales transactions ledger as CSV"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>{isAr ? 'تصدير سجل المبيعات' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">
              {isAr ? 'إجمالي المبيعات' : 'Total Revenue'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-bold text-stone-900 tabular-nums">
            {formatCurrencyMAD(summary.totalRevenueMAD)}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
            <span>≈ {formatUSDApprox(summary.totalRevenueMAD)} USD</span>
            <span className="text-stone-300">·</span>
            <span className="text-emerald-700 font-semibold">{isAr ? 'اليوم:' : 'Today:'} {formatCurrencyMAD(summary.todaySalesMAD)}</span>
          </div>
        </div>

        {/* Units Sold & Depletion */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">
              {isAr ? 'القطع المباعة' : 'Units Sold'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-bold text-stone-900 tabular-nums">
            {summary.totalUnitsSold} <span className="text-sm font-normal text-stone-500">{isAr ? 'قطعة' : 'units'}</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {isAr ? 'المخزون المتبقي:' : 'Stock Remaining:'} <span className="font-semibold text-stone-800 tabular-nums">{summary.totalStockRemaining}</span>
          </div>
        </div>

        {/* Active Artisans & Souks */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">
              {isAr ? 'الصناع والأسواق' : 'Artisans & Souks'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-bold text-stone-900 tabular-nums">
            {summary.activeArtisansCount} <span className="text-sm font-normal text-stone-500">{isAr ? 'معلم' : 'Masters'}</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {isAr ? 'عبر 5 أسواق عتيقة في فاس البالي' : 'Active across 5 historic Medina souks'}
          </div>
        </div>

        {/* Stock Alert Counter */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">
              {isAr ? 'تنبيهات المخزون' : 'Stock Alerts'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-bold text-rose-700 tabular-nums">
            {summary.lowStockCount + summary.outOfStockCount} <span className="text-sm font-normal text-stone-500">{isAr ? 'قطع حرجة' : 'items'}</span>
          </div>
          <div className="text-[11px] text-rose-600 mt-1 font-medium">
            {summary.outOfStockCount} {isAr ? 'منتهية' : 'sold out'} · {summary.lowStockCount} {isAr ? 'مخزون منخفض' : 'low stock'}
          </div>
        </div>
      </div>

      {/* Main Charts & Live Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Hourly Revenue Sparkline & Souk Distribution */}
        <div className="lg:col-span-8 space-y-6">
          {/* Revenue Velocity Curve */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-stone-900">
                  {isAr ? 'منحنى الإيرادات اليومية بالدرهم' : 'Today\'s Hourly Revenue Curve (MAD)'}
                </h3>
                <p className="text-xs text-stone-400">
                  {isAr ? 'تطور وتيرة المبيعات عبر فترات اليوم بأسواق فاس' : 'Intraday sales velocity in Moroccan Dirhams'}
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                +24.6% vs Yesterday
              </span>
            </div>

            {/* Clean SVG Area Chart */}
            <div className="h-44 w-full relative">
              <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b45309" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#b45309" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal reference grid lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="130" x2="500" y2="130" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

                {/* Shaded Area */}
                <polygon
                  points={`0,140 ${chartPoints} 500,140`}
                  fill="url(#revenueGrad)"
                />

                {/* Line Path */}
                <polyline
                  fill="none"
                  stroke="#b45309"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={chartPoints}
                />

                {/* Data Points */}
                {summary.recentHourlyTrend.map((h, i) => {
                  const x = (i / (summary.recentHourlyTrend.length - 1)) * 500;
                  const y = 140 - (h.revenue / maxHourlyRevenue) * 110;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="4" fill="#ffffff" stroke="#b45309" strokeWidth="2.5" />
                    </g>
                  );
                })}
              </svg>

              {/* Time Labels */}
              <div className="flex justify-between text-[11px] text-stone-400 mt-2 px-1">
                {summary.recentHourlyTrend.map((h, i) => (
                  <span key={i} className="tabular-nums">{h.time}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Sales Breakdown by Souk */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs">
            <h3 className="font-display font-bold text-base text-stone-900 mb-1">
              {isAr ? 'حصة المبيعات حسب الأسواق العتيقة' : 'Revenue Distribution by Historic Souk'}
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              {isAr ? 'الصفارين، شوارة، عين نقبي، النجارين، والعطارين' : 'Share of trade volume across traditional craft quarters'}
            </p>

            <div className="space-y-3.5">
              {summary.soukBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-stone-800">{item.souk_name}</span>
                    <span className="font-bold text-stone-900 tabular-nums">
                      {formatCurrencyMAD(item.revenue)} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-700 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(5, item.percentage))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Real-Time Sales Stream */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700" />
                <h3 className="font-display font-bold text-sm text-stone-900">
                  {isAr ? 'آخر معاملات البيع اللحظية' : 'Live Transaction Stream'}
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {sales.length} {isAr ? 'عملية' : 'sales'}
              </span>
            </div>

            {/* Sales Feed List */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[460px] pr-1">
              {sales.slice(0, 8).map((sale) => (
                <div
                  key={sale.id}
                  className="p-3 rounded-lg bg-stone-50 border border-stone-100/80 hover:bg-amber-50/40 transition-colors text-xs space-y-1 animate-in fade-in slide-in-from-top-1"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-stone-900 line-clamp-1">
                      {isAr ? sale.product_name_ar : sale.product_name_en}
                    </span>
                    <span className="font-bold text-amber-900 tabular-nums shrink-0 ml-2">
                      +{formatCurrencyMAD(sale.total_mad)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px] text-stone-500">
                    <span>{sale.seller_name} · {sale.souk_name}</span>
                    <span className="tabular-nums">x{sale.quantity}</span>
                  </div>

                  <div className="flex justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-200/50">
                    <span>{sale.customer_name} ({sale.customer_country})</span>
                    <span className="font-medium text-stone-500">{sale.payment_method}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Attention & Leaderboard Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Low Stock Alert & Quick Restock */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-display font-bold text-base text-stone-900">
                {isAr ? 'تنبيهات المخزون الحرج للمحلات' : 'Low Stock Depletion Watchlist'}
              </h3>
            </div>
            <span className="text-xs text-stone-400">
              {isAr ? 'عتبة التنبيه < 4 قطع' : 'Alert threshold ≤ 4 units'}
            </span>
          </div>

          {lowStockItems.length + outOfStockItems.length > 0 ? (
            <div className="divide-y divide-stone-100">
              {[...outOfStockItems, ...lowStockItems].map((prod) => (
                <div key={prod.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={prod.images[0]?.url} alt="" className="w-9 h-9 rounded object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-stone-800 truncate">
                        {isAr ? prod.name_ar : prod.name_en}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        {prod.stock === 0 ? (
                          <span className="text-rose-600 font-bold">{isAr ? 'نفد بالكامل!' : 'OUT OF STOCK'}</span>
                        ) : (
                          <span className="text-amber-700 font-semibold">{isAr ? `متبقي ${prod.stock} قطع` : `${prod.stock} units left`}</span>
                        )}
                        {' · '}SKU: {prod.sku}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onQuickRestock(prod.id, 5)}
                    className="flex items-center gap-1 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold rounded text-[11px] shrink-0 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 text-amber-700" />
                    <span>{isAr ? '+5 تزويد' : '+5 Restock'}</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-stone-500">
              {isAr ? 'كافة المعروضات في مستوى مخزون ممتاز!' : 'All artisan inventory levels are nominal!'}
            </div>
          )}
        </div>

        {/* Master Artisans Leaderboard */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              <h3 className="font-display font-bold text-base text-stone-900">
                {isAr ? 'ترتيب المعلمين حسب إيرادات البيع' : 'Top Performing Master Artisans'}
              </h3>
            </div>
            <span className="text-xs text-stone-400">
              {isAr ? 'تأثير الصنعة في الاقتصاد المحلي' : 'Craft guild revenue impact'}
            </span>
          </div>

          <div className="space-y-3">
            {summary.topSellers.map((s, index) => {
              const sellerObj = sellers.find(sel => sel.id === s.seller_id);
              return (
                <div key={s.seller_id} className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-100 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-5 font-bold text-amber-800 text-sm tabular-nums">
                      #{index + 1}
                    </span>
                    {sellerObj && (
                      <img src={sellerObj.profile_image} alt="" className="w-8 h-8 rounded-full object-cover border border-amber-600 shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-stone-900">{s.seller_name}</div>
                      <div className="text-[10px] text-stone-400">
                        {s.units} {isAr ? 'قطعة مباعة' : 'units sold'}
                      </div>
                    </div>
                  </div>

                  <div className="font-bold text-amber-950 tabular-nums text-sm">
                    {formatCurrencyMAD(s.revenue)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
