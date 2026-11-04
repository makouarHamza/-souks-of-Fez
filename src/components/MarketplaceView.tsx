import React, { useState } from 'react';
import { Search, MapPin, Sparkles, Filter, Package, AlertCircle } from 'lucide-react';
import { Product, Seller, Souk, CraftCategory } from '../types';
import { ProductCard } from './ProductCard';
import { filterAndSearchProducts } from '../utils/analytics';

interface MarketplaceViewProps {
  products: Product[];
  sellers: Seller[];
  souks: Souk[];
  onViewProductDetails: (product: Product) => void;
  onRecordSale: (productId: number, quantity: number) => void;
  lang: 'en' | 'ar';
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  products,
  sellers,
  souks,
  onViewProductDetails,
  onRecordSale,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSoukId, setSelectedSoukId] = useState<number | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  const isAr = lang === 'ar';

  const categories: (string | CraftCategory)[] = [
    'All',
    'Leather',
    'Copper & Brass',
    'Ceramics & Zellige',
    'Cedar Wood',
    'Textiles & Carpets',
    'Spices & Natural Cosmetics',
  ];

  const filteredProducts = filterAndSearchProducts(
    products,
    searchQuery,
    selectedSoukId,
    selectedCategory === 'All' ? undefined : selectedCategory,
    undefined,
    stockFilter
  );

  return (
    <div className="space-y-8" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Medina Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200">
        <img
          src="/src/assets/images/hero_fez_medina_1793828981433.jpg"
          alt="Fez Medina Rooftops and Artisans"
          className="absolute inset-0 w-full h-full object-cover brightness-65 scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-900/40" />

        <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-between text-white min-h-[380px] sm:min-h-[320px]">
          <div className="max-w-3xl flex flex-col items-start gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-medium backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{isAr ? 'حرفيو فاس العتيقة · تراث إنساني حي' : 'Old Medina of Fez · Living Heritage'}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white leading-snug">
              {isAr ? 'سوق صناع فاس التقليديين' : 'The Master Artisan Souks of Fez'}
            </h1>

            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {isAr
                ? 'استكشف إبداعات معلّمي ساحة الصفارين، مدابغ شوارة، عين نقبي وفندق النجارين. تتبع المخزون والأسعار وتواصل مع الحرفيين مباشرة.'
                : 'Explore authentic creations from the master craftsmen of Place Seffarine, Chouara Tanneries, and Ain Nokbi pottery. Direct artisan connection with live inventory.'}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-4 sm:gap-8 text-xs text-stone-300">
            <div>
              <span className="font-bold text-white text-base mr-1 tabular-nums">{souks.length}</span>
              <span>{isAr ? 'أسواق عتيقة' : 'Historic Souks'}</span>
            </div>
            <div>
              <span className="font-bold text-white text-base mr-1 tabular-nums">{sellers.length}</span>
              <span>{isAr ? 'معلم حرفي معتمد' : 'Master Artisans'}</span>
            </div>
            <div>
              <span className="font-bold text-white text-base mr-1 tabular-nums">{products.length}</span>
              <span>{isAr ? 'قطعة معروضة' : 'Crafted Pieces'}</span>
            </div>
            <div>
              <span className="font-bold text-emerald-400 text-base mr-1 tabular-nums">
                {products.filter(p => p.stock > 0).length}
              </span>
              <span>{isAr ? 'متوفر بالمخزن' : 'In-Stock Today'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Control Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/90 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input (Keyword or Product ID) */}
          <div className="md:col-span-5 relative">
            <input
              type="text"
              placeholder={isAr ? 'ابحث بالاسم، برقم المعرف (#ID)، أو الوصف...' : 'Search by title, ID (#101), or craft keyword...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Souk Filter Dropdown */}
          <div className="md:col-span-4">
            <select
              value={selectedSoukId || ''}
              onChange={(e) => setSelectedSoukId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 cursor-pointer"
            >
              <option value="">{isAr ? 'جميع أسواق وفنادق فاس' : 'All Souks & Fondouks'}</option>
              {souks.map((souk) => (
                <option key={souk.id} value={souk.id}>
                  {isAr ? souk.name_ar : souk.name_en} ({souk.category})
                </option>
              ))}
            </select>
          </div>

          {/* Stock Availability Filter */}
          <div className="md:col-span-3">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 cursor-pointer"
            >
              <option value="all">{isAr ? 'حالة المخزون (الكل)' : 'Stock: All Statuses'}</option>
              <option value="in_stock">{isAr ? 'متوفر حالياً فقط' : 'In Stock Only'}</option>
              <option value="low_stock">{isAr ? 'مخزون منخفض (< 5)' : 'Low Stock Warning'}</option>
              <option value="out_of_stock">{isAr ? 'القطع المنتهية' : 'Sold Out'}</option>
            </select>
          </div>
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-stone-100">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider shrink-0 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            {isAr ? 'الحرفة:' : 'Craft:'}
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-800 text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-stone-900">
            {isAr ? 'معروضات الحرفيين' : 'Artisanal Collection'}
          </h2>
          <p className="text-xs text-stone-500">
            {isAr 
              ? `عرض ${filteredProducts.length} من أصل ${products.length} قطعة مصنوعة يدوياً` 
              : `Showing ${filteredProducts.length} of ${products.length} authentic pieces`}
          </p>
        </div>

        {/* Quick Reset Filters */}
        {(searchQuery || selectedSoukId || selectedCategory !== 'All' || stockFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSoukId(undefined);
              setSelectedCategory('All');
              setStockFilter('all');
            }}
            className="text-xs text-amber-800 hover:text-amber-900 font-semibold cursor-pointer underline"
          >
            {isAr ? 'إعادة ضبط التصفية' : 'Reset Filters'}
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const seller = sellers.find((s) => s.id === product.seller_id);
            const souk = souks.find((s) => s.id === product.souk_id);
            return (
              <ProductCard
                key={product.id}
                product={product}
                seller={seller}
                souk={souk}
                onViewDetails={onViewProductDetails}
                onRecordSale={onRecordSale}
                lang={lang}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-display font-semibold text-stone-800 text-lg">
            {isAr ? 'لم يتم العثور على أي قطعة مطابقة' : 'No matching artisan pieces found'}
          </h3>
          <p className="text-stone-500 text-sm max-w-md mx-auto">
            {isAr
              ? 'جرّب تغيير كلمات البحث أو مسح تصفية الأسواق والتصنيفات للوصول إلى كافة المنتجات.'
              : 'Try clearing your search terms or filters to discover other handmade goods from Fez.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSoukId(undefined);
              setSelectedCategory('All');
              setStockFilter('all');
            }}
            className="px-4 py-2 bg-amber-700 text-white text-xs font-semibold rounded-lg hover:bg-amber-800 transition-colors cursor-pointer"
          >
            {isAr ? 'عرض كافة المعروضات' : 'View All Products'}
          </button>
        </div>
      )}
    </div>
  );
};
