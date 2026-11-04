import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  CheckCircle, 
  Package, 
  AlertTriangle, 
  Share2, 
  ShoppingBag, 
  Globe, 
  Search
} from 'lucide-react';
import { Product, Seller, Souk } from '../types';
import { formatCurrencyMAD, formatUSDApprox, generateWhatsAppOrderLink } from '../utils/analytics';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  seller?: Seller;
  souk?: Souk;
  allProducts: Product[];
  onSelectProduct: (p: Product) => void;
  onRecordSale: (productId: number, quantity: number) => void;
  lang: 'en' | 'ar';
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  seller,
  souk,
  allProducts,
  onSelectProduct,
  onRecordSale,
  lang: initialLang,
}) => {
  const [modalLang, setModalLang] = useState<'en' | 'ar'>(initialLang);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [searchIdInput, setSearchIdInput] = useState('');
  const [searchError, setSearchError] = useState('');
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [saleSuccessMessage, setSaleSuccessMessage] = useState('');

  if (!product) return null;

  const isAr = modalLang === 'ar';
  const name = isAr ? product.name_ar : product.name_en;
  const description = isAr ? product.description_ar : product.description_en;

  // Search by ID handler as in seeProduit.php
  const handleSearchById = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const idNum = parseInt(searchIdInput.trim(), 10);
    if (isNaN(idNum)) {
      setSearchError(isAr ? 'الرجاء إدخال رقم المعرف صحيح' : 'Please enter a valid numeric ID');
      return;
    }
    const found = allProducts.find(p => p.id === idNum);
    if (found) {
      onSelectProduct(found);
      setSelectedImageIndex(0);
      setSearchIdInput('');
    } else {
      setSearchError(
        isAr 
          ? `المنتج برقم #${idNum} غير موجود حالياً في أسواق فاس` 
          : `Product with ID #${idNum} was not found in the Medina directory`
      );
    }
  };

  const handleBuy = () => {
    if (product.stock < buyQuantity) return;
    onRecordSale(product.id, buyQuantity);
    setSaleSuccessMessage(
      isAr 
        ? `تم تسجيل البيع بنجاح! تم خصم ${buyQuantity} قطعة من المخزون.` 
        : `Sale recorded successfully! Deducted ${buyQuantity} unit(s) from inventory.`
    );
    setTimeout(() => setSaleSuccessMessage(''), 4000);
  };

  const currentImg = product.images[selectedImageIndex] || product.images[0] || {
    url: '/src/assets/images/craft_fez_ceramics_1793828982273.jpg',
    alt_text: product.name_en,
  };

  const whatsappLink = seller
    ? generateWhatsAppOrderLink(seller.contact_info, product.id, name, modalLang)
    : '#';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div 
        dir={isAr ? 'rtl' : 'ltr'} 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-stone-50 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
              SKU: {product.sku} · ID #{product.id}
            </span>
            {souk && (
              <span className="text-xs text-stone-500 hidden sm:inline">
                {isAr ? souk.name_ar : souk.name_en}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle in Modal */}
            <button
              onClick={() => setModalLang(modalLang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-700" />
              <span>{modalLang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar matching seeProduit.php */}
        <div className="px-6 py-2.5 bg-amber-50/50 border-b border-amber-100 flex flex-wrap items-center justify-between gap-3">
          <form onSubmit={handleSearchById} className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="number"
                placeholder={isAr ? 'ابحث عن قطعة برقم المعرف (ID)...' : 'Find product by ID (e.g. 101, 102)...'}
                value={searchIdInput}
                onChange={(e) => setSearchIdInput(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              {isAr ? 'بحث' : 'Search ID'}
            </button>
          </form>

          {searchError && (
            <p className="text-xs text-rose-600 font-medium">{searchError}</p>
          )}

          {saleSuccessMessage && (
            <p className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              {saleSuccessMessage}
            </p>
          )}
        </div>

        {/* Product Details Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Left Column: Multi-Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={currentImg.url}
                alt={currentImg.alt_text || name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-3 right-3 bg-stone-900/75 text-white text-[11px] font-medium px-2 py-0.5 rounded-full backdrop-blur-xs">
                {selectedImageIndex + 1} / {Math.max(product.images.length, 1)}
              </div>
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      selectedImageIndex === idx ? 'border-amber-600 ring-2 ring-amber-300' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.alt_text} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Artisan Workshop Mini Card */}
            {seller && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
                <img
                  src={seller.profile_image}
                  alt={seller.name}
                  className="w-12 h-12 rounded-full object-cover border border-amber-600 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-stone-900 truncate">
                      {seller.name}
                    </span>
                    {seller.verified && (
                      <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-amber-800 font-medium truncate">
                    {isAr ? seller.artisan_title_ar : seller.artisan_title_en}
                  </p>
                  <p className="text-[11px] text-stone-500 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{seller.workshop_location}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Title, Description, Stock & Buying Options */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  {product.category}
                </span>
                {product.stock <= 0 ? (
                  <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {isAr ? 'نفد المخزون' : 'Out of Stock'}
                  </span>
                ) : product.stock <= product.low_stock_threshold ? (
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {isAr ? `متبقي ${product.stock} فقط في المحل` : `Only ${product.stock} left in stock!`}
                  </span>
                ) : (
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {isAr ? `متوفر في المعرض (${product.stock} قطعة)` : `In Stock (${product.stock} units)`}
                  </span>
                )}
              </div>

              <h2 className="font-display text-2xl font-bold text-stone-900 leading-tight mb-2">
                {name}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-amber-900 tabular-nums">
                  {formatCurrencyMAD(product.price)}
                </span>
                <span className="text-sm text-stone-500 tabular-nums">
                  ≈ {formatUSDApprox(product.price)} USD
                </span>
              </div>

              <div className="border-t border-stone-200 pt-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  {isAr ? 'عن هذه التحفة' : 'Artisanal Craftsmanship'}
                </h4>
                <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>

              {souk && (
                <div className="mt-4 p-3 bg-stone-50 rounded-lg text-xs text-stone-600 border border-stone-200 space-y-1">
                  <div className="font-medium text-stone-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    <span>{isAr ? souk.name_ar : souk.name_en} — {souk.location}</span>
                  </div>
                  <p className="text-stone-500 line-clamp-2">
                    {isAr ? souk.description_ar : souk.description_en}
                  </p>
                </div>
              )}
            </div>

            {/* Actions: Direct WhatsApp (from seeProduit.php) & Immediate In-Souk Purchase */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              {/* WhatsApp direct button (key feature from seeProduit.php) */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>{isAr ? 'تواصل مباشرة عبر واتساب مع المعلم' : 'Send WhatsApp Message to Artisan'}</span>
              </a>

              {/* Direct In-Souk Purchase & Inventory Deduction */}
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50 px-2 py-1">
                  <span className="text-xs text-stone-500 mr-2">{isAr ? 'الكمية:' : 'Qty:'}</span>
                  <input
                    type="number"
                    min="1"
                    max={Math.max(1, product.stock)}
                    value={buyQuantity}
                    onChange={(e) => setBuyQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center text-sm font-semibold bg-transparent focus:outline-hidden"
                    disabled={product.stock <= 0}
                  />
                </div>

                <button
                  onClick={handleBuy}
                  disabled={product.stock <= 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all cursor-pointer ${
                    product.stock > 0
                      ? 'bg-amber-700 hover:bg-amber-800 text-white shadow-xs'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {product.stock > 0
                      ? (isAr ? `شراء وتحديث المخزون (${formatCurrencyMAD(product.price * buyQuantity)})` : `Instant Purchase (${formatCurrencyMAD(product.price * buyQuantity)})`)
                      : (isAr ? 'القطعة غير متوفرة' : 'Sold Out')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
