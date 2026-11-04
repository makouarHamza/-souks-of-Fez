import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  Check, 
  Search, 
  Upload, 
  X, 
  ArrowUpDown,
  Filter,
  Image as ImageIcon,
  Download
} from 'lucide-react';
import { Product, Seller, Souk, CraftCategory, ProductImage } from '../types';
import { formatCurrencyMAD, checkStockHealth, generateInventoryCSV, downloadCSVFile } from '../utils/analytics';

interface InventoryManagerProps {
  products: Product[];
  sellers: Seller[];
  souks: Souk[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onQuickStockChange: (productId: number, delta: number) => void;
  lang: 'en' | 'ar';
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  products,
  sellers,
  souks,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onQuickStockChange,
  lang,
}) => {
  const isAr = lang === 'ar';

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStockStatus, setFilterStockStatus] = useState<'all' | 'low' | 'out'>('all');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Form State
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [price, setPrice] = useState<number>(350);
  const [sellerId, setSellerId] = useState<number>(sellers[0]?.id || 1);
  const [soukId, setSoukId] = useState<number>(souks[0]?.id || 1);
  const [category, setCategory] = useState<CraftCategory>('Copper & Brass');
  const [stock, setStock] = useState<number>(10);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(4);
  const [sku, setSku] = useState('FEZ-NEW-01');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/craft_seffarine_copper_1793828983675.jpg');
  const [imageType, setImageType] = useState<'product' | 'thumbnail' | 'gallery'>('product');

  const presetImages = [
    { label: 'Place Seffarine Copper & Brass', url: '/src/assets/images/craft_seffarine_copper_1793828983675.jpg' },
    { label: 'Chouara Handcrafted Leather', url: '/src/assets/images/craft_chouara_leather_1793828982828.jpg' },
    { label: 'Cobalt Fez Blue Pottery & Zellige', url: '/src/assets/images/craft_fez_ceramics_1793828982273.jpg' },
    { label: 'Master Artisan Workshop & Cedar', url: '/src/assets/images/artisan_maalem_portrait_1793828985053.jpg' },
    { label: 'Historic Medina Rooftops & Souk', url: '/src/assets/images/hero_fez_medina_1793828981433.jpg' },
  ];

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setNameEn('');
    setNameAr('');
    setDescEn('');
    setDescAr('');
    setPrice(350);
    setSellerId(sellers[0]?.id || 1);
    setSoukId(souks[0]?.id || 1);
    setCategory('Copper & Brass');
    setStock(10);
    setLowStockThreshold(4);
    setSku(`FEZ-${Math.floor(100 + Math.random() * 900)}`);
    setImageUrl('/src/assets/images/craft_seffarine_copper_1793828983675.jpg');
    setIsFormOpen(true);
  };

  const handleEdit = (prod: Product) => {
    setEditingProduct(prod);
    setNameEn(prod.name_en);
    setNameAr(prod.name_ar);
    setDescEn(prod.description_en);
    setDescAr(prod.description_ar);
    setPrice(prod.price);
    setSellerId(prod.seller_id);
    setSoukId(prod.souk_id);
    setCategory(prod.category);
    setStock(prod.stock);
    setLowStockThreshold(prod.low_stock_threshold);
    setSku(prod.sku);
    setImageUrl(prod.images[0]?.url || '');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const imagePayload: ProductImage[] = [
      {
        id: Date.now(),
        url: imageUrl.trim() || '/src/assets/images/craft_fez_ceramics_1793828982273.jpg',
        alt_text: nameEn,
        image_type: imageType,
      },
    ];

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name_en: nameEn,
        name_ar: nameAr,
        description_en: descEn,
        description_ar: descAr,
        price,
        seller_id: Number(sellerId),
        souk_id: Number(soukId),
        category,
        stock,
        low_stock_threshold: lowStockThreshold,
        sku,
        images: imagePayload,
      });
      setFeedbackMessage(isAr ? 'تم تعديل المنتج بنجاح!' : 'Product updated successfully!');
    } else {
      onAddProduct({
        name_en: nameEn,
        name_ar: nameAr,
        description_en: descEn,
        description_ar: descAr,
        price,
        seller_id: Number(sellerId),
        souk_id: Number(soukId),
        category,
        stock,
        low_stock_threshold: lowStockThreshold,
        sku,
        images: imagePayload,
      });
      setFeedbackMessage(isAr ? 'تمت إضافة القطعة الحرفية بنجاح إلى مخزون فاس!' : 'New product added to Fez inventory!');
    }

    setIsFormOpen(false);
    setTimeout(() => setFeedbackMessage(''), 4000);
  };

  const handleDelete = (id: number) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذه القطعة من المخزون؟' : 'Are you sure you want to delete this product and its images?')) {
      onDeleteProduct(id);
      setFeedbackMessage(isAr ? 'تم حذف المنتج بنجاح' : 'Product deleted successfully');
      setTimeout(() => setFeedbackMessage(''), 3000);
    }
  };

  // Filter products
  const filtered = products.filter(p => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        p.id.toString() === q ||
        p.name_en.toLowerCase().includes(q) ||
        p.name_ar.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterCategory !== 'All' && p.category !== filterCategory) return false;
    if (filterStockStatus === 'low' && (p.stock <= 0 || p.stock > p.low_stock_threshold)) return false;
    if (filterStockStatus === 'out' && p.stock > 0) return false;
    return true;
  });

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Banner and Quick Add */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">
            {isAr ? 'إدارة المخزون والمنتجات الحرفية' : 'Artisan Inventory & Product Management'}
          </h1>
          <p className="text-xs text-stone-500">
            {isAr
              ? 'تتبع كميات المخزون في محلات فاس، إشعار انخفاض الكميات، وتعديل الأسعار والمواصفات.'
              : 'Add, edit, and track workshop stock levels, SKU identifiers, and price points.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const csv = generateInventoryCSV(products);
              downloadCSVFile(csv, `fez_souk_inventory_catalog_${new Date().toISOString().slice(0, 10)}.csv`);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Download complete stock catalog as CSV"
          >
            <Download className="w-4 h-4 text-stone-600" />
            <span>{isAr ? 'تصدير الكتالوج' : 'Export CSV'}</span>
          </button>

          <button
            onClick={handleOpenAddForm}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة منتج جديد' : 'Add New Product'}</span>
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Product Form Drawer/Modal matching addProduct.php */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-2xl w-full p-6 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h2 className="font-display text-lg font-bold text-stone-900">
                {editingProduct 
                  ? (isAr ? 'تعديل بيانات المنتج' : 'Edit Product') 
                  : (isAr ? 'إضافة منتج حرفي جديد' : 'Add New Artisan Product')}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'اسم المنتج (بالإنجليزية) *' : 'Product Title (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Handcrafted Brass Teapot"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'اسم المنتج (بالعربية) *' : 'Product Title (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: إبريق شاي نحاسي أصيل"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'وصف المنتج (بالإنجليزية) *' : 'Description (English) *'}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    placeholder="Authentic materials, crafting techniques..."
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'وصف المنتج (بالعربية) *' : 'Description (Arabic) *'}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={descAr}
                    onChange={(e) => setDescAr(e.target.value)}
                    placeholder="المواد الطبيعية، تقنيات الصنع التراثية..."
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'السعر (درهم مغربي MAD) *' : 'Price (MAD) *'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'الكمية في المخزون *' : 'Stock Units *'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'حد تنبيه المخزون *' : 'Low Stock Alert Limit *'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'الصانع / البائع *' : 'Artisan / Seller *'}
                  </label>
                  <select
                    value={sellerId}
                    onChange={(e) => setSellerId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    {sellers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({isAr ? s.artisan_title_ar : s.artisan_title_en})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'السوق التابع له *' : 'Souk Location *'}
                  </label>
                  <select
                    value={soukId}
                    onChange={(e) => setSoukId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    {souks.map((sk) => (
                      <option key={sk.id} value={sk.id}>
                        {isAr ? sk.name_ar : sk.name_en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'صنف الحرفة *' : 'Craft Category *'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CraftCategory)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="Copper & Brass">Copper & Brass</option>
                    <option value="Leather">Leather</option>
                    <option value="Ceramics & Zellige">Ceramics & Zellige</option>
                    <option value="Cedar Wood">Cedar Wood</option>
                    <option value="Textiles & Carpets">Textiles & Carpets</option>
                    <option value="Spices & Natural Cosmetics">Spices & Natural Cosmetics</option>
                    <option value="Jewelry & Antiques">Jewelry & Antiques</option>
                  </select>
                </div>
              </div>

              {/* Image Selection matching addProduct.php */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="block text-xs font-semibold text-stone-700">
                  {isAr ? 'صورة المنتج والحرفة *' : 'Product Image Asset *'}
                </label>
                <div className="flex gap-2">
                  <select
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    {presetImages.map((p, i) => (
                      <option key={i} value={p.url}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={imageType}
                    onChange={(e) => setImageType(e.target.value as any)}
                    className="px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="product">Product Main</option>
                    <option value="thumbnail">Thumbnail</option>
                    <option value="gallery">Gallery View</option>
                  </select>
                </div>
                {imageUrl && (
                  <div className="flex items-center gap-3 p-2 bg-stone-50 rounded-lg border border-stone-200">
                    <img src={imageUrl} alt="Preview" className="w-12 h-12 rounded object-cover" />
                    <span className="text-[11px] text-stone-500 truncate">{imageUrl}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-amber-700 hover:bg-amber-800 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  {editingProduct ? (isAr ? 'حفظ التعديلات' : 'Update Product') : (isAr ? 'إضافة القطعة' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter and Search Bar for Table */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder={isAr ? 'ابحث برقم المعرف أو الاسم أو الرمز SKU...' : 'Filter products by ID, name, or SKU...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700"
          >
            <option value="All">{isAr ? 'كافة الأصناف' : 'All Categories'}</option>
            <option value="Copper & Brass">Copper & Brass</option>
            <option value="Leather">Leather</option>
            <option value="Ceramics & Zellige">Ceramics & Zellige</option>
            <option value="Cedar Wood">Cedar Wood</option>
            <option value="Textiles & Carpets">Textiles & Carpets</option>
          </select>

          <select
            value={filterStockStatus}
            onChange={(e) => setFilterStockStatus(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700"
          >
            <option value="all">{isAr ? 'كافة حالات المخزون' : 'All Stock Status'}</option>
            <option value="low">{isAr ? 'مخزون منخفض (< الحد)' : 'Low Stock Only'}</option>
            <option value="out">{isAr ? 'منتهية المخزون (0)' : 'Out of Stock'}</option>
          </select>
        </div>
      </div>

      {/* Inventory Table matching Manage Products in addProduct.php */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">{isAr ? 'القطعة' : 'Product'}</th>
                <th className="py-3 px-4">{isAr ? 'الصانع والسوق' : 'Artisan & Souk'}</th>
                <th className="py-3 px-4">{isAr ? 'السعر' : 'Price'}</th>
                <th className="py-3 px-4 text-center">{isAr ? 'المخزون اللحظي' : 'Real-Time Stock'}</th>
                <th className="py-3 px-4 text-center">{isAr ? 'حالة التوفر' : 'Health'}</th>
                <th className="py-3 px-4 text-right">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filtered.map((prod) => {
                const seller = sellers.find(s => s.id === prod.seller_id);
                const souk = souks.find(s => s.id === prod.souk_id);
                const health = checkStockHealth(prod.stock, prod.low_stock_threshold);

                return (
                  <tr key={prod.id} className="hover:bg-stone-50/80 transition-colors">
                    {/* Product & Image */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]?.url}
                          alt={prod.name_en}
                          className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-stone-900 text-sm">
                            {isAr ? prod.name_ar : prod.name_en}
                          </div>
                          <div className="text-[11px] text-stone-400">
                            ID #{prod.id} · SKU: {prod.sku} · {prod.category}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Artisan & Souk */}
                    <td className="py-3 px-4">
                      <div className="text-stone-800 font-medium">{seller?.name || `Artisan #${prod.seller_id}`}</div>
                      <div className="text-[11px] text-amber-800">
                        {souk ? (isAr ? souk.name_ar : souk.name_en) : 'Medina Workshop'}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-amber-950 tabular-nums">
                      {formatCurrencyMAD(prod.price)}
                    </td>

                    {/* Stock Quick Controller */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onQuickStockChange(prod.id, -1)}
                          disabled={prod.stock <= 0}
                          className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center disabled:opacity-30 cursor-pointer"
                          title="Decrease stock (-1)"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-bold text-stone-900 tabular-nums text-sm">
                          {prod.stock}
                        </span>
                        <button
                          onClick={() => onQuickStockChange(prod.id, 1)}
                          className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center cursor-pointer"
                          title="Increase stock (+1)"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Stock Status Badge */}
                    <td className="py-3 px-4 text-center">
                      {health === 'out_of_stock' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3" />
                          {isAr ? 'نفد' : 'Out'}
                        </span>
                      ) : health === 'low_stock' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3" />
                          {isAr ? 'منخفض' : 'Low'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          <Check className="w-3 h-3" />
                          {isAr ? 'متوفر' : 'Nominal'}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(prod)}
                          className="p-1.5 rounded text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-1.5 rounded text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
