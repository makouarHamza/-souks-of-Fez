import React, { useState } from 'react';
import { MapPin, CheckCircle, AlertTriangle, Eye, MessageCircle, ShoppingBag } from 'lucide-react';
import { Product, Seller, Souk } from '../types';
import { formatCurrencyMAD, formatUSDApprox, generateWhatsAppOrderLink } from '../utils/analytics';

interface ProductCardProps {
  product: Product;
  seller?: Seller;
  souk?: Souk;
  onViewDetails: (product: Product) => void;
  onRecordSale: (productId: number, quantity: number) => void;
  lang: 'en' | 'ar';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  seller,
  souk,
  onViewDetails,
  onRecordSale,
  lang,
}) => {
  const [imageIndex, setImageIndex] = useState(0);
  const isAr = lang === 'ar';
  const name = isAr ? product.name_ar : product.name_en;
  const description = isAr ? product.description_ar : product.description_en;

  const currentImg = product.images[imageIndex] || product.images[0] || {
    url: '/src/assets/images/craft_fez_ceramics_1793828982273.jpg',
    alt_text: product.name_en,
  };

  const isSoldOut = product.stock <= 0;
  const isLowStock = !isSoldOut && product.stock <= product.low_stock_threshold;

  const whatsappUrl = seller
    ? generateWhatsAppOrderLink(seller.contact_info, product.id, name, lang)
    : '#';

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images.length > 1) {
      setImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  return (
    <div 
      className="group bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden relative"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Top Media Container */}
      <div 
        onClick={nextImage}
        className="relative aspect-4/3 overflow-hidden bg-stone-100 cursor-pointer"
        title={product.images.length > 1 ? (isAr ? 'اضغط لعرض الصورة التالية' : 'Click to see next image') : ''}
      >
        <img
          src={currentImg.url}
          alt={currentImg.alt_text || name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category & ID Tag */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <span className="text-[11px] font-semibold tracking-wide bg-stone-900/80 text-white px-2 py-0.5 rounded backdrop-blur-xs">
            #{product.id} · {product.category}
          </span>
        </div>

        {/* Multi-image counter */}
        {product.images.length > 1 && (
          <div className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-xs">
            {imageIndex + 1}/{product.images.length}
          </div>
        )}

        {/* Stock Status Badge */}
        {isSoldOut ? (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-2xs flex items-center justify-center">
            <span className="bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded shadow-md">
              {isAr ? 'مباع بالكامل' : 'Sold Out'}
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="bg-amber-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {isAr ? `متبقي ${product.stock} فقط` : `Only ${product.stock} Left`}
            </span>
          </div>
        ) : null}

        {/* Price Tooltip on hover (faithful to Maker_product.css) */}
        <div className="absolute bottom-0 inset-x-0 bg-stone-900/75 text-white py-1.5 px-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-xs text-stone-300 font-medium">
            {isAr ? 'السعر الأصلي' : 'Artisan Price'}
          </span>
          <span className="text-sm font-bold text-amber-300 tabular-nums">
            {formatCurrencyMAD(product.price)}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Artisan Profile Lockup */}
          {seller && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-stone-100">
              <img
                src={seller.profile_image}
                alt={seller.name}
                className="w-7 h-7 rounded-full object-cover border border-amber-600 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-stone-800 truncate">
                    {seller.name}
                  </span>
                  {seller.verified && (
                    <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  )}
                </div>
                {souk && (
                  <p className="text-[10px] text-stone-500 truncate flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5 text-stone-400" />
                    <span>{isAr ? souk.name_ar : souk.name_en}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Product Title */}
          <h3 
            onClick={() => onViewDetails(product)}
            className="font-display font-bold text-stone-900 text-base leading-snug line-clamp-1 cursor-pointer hover:text-amber-800 transition-colors"
          >
            {name}
          </h3>

          <p className="text-stone-500 text-xs line-clamp-2 mt-1 mb-3">
            {description}
          </p>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-lg font-bold text-amber-900 tabular-nums">
                {formatCurrencyMAD(product.price)}
              </span>
              <span className="text-[11px] text-stone-400 ml-1.5 tabular-nums">
                ({formatUSDApprox(product.price)})
              </span>
            </div>
            <span className="text-[11px] text-stone-500 tabular-nums">
              {isAr ? `المخزون: ${product.stock}` : `Stock: ${product.stock}`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* View Details */}
            <button
              onClick={() => onViewDetails(product)}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isAr ? 'عرض التفاصيل' : 'Details'}</span>
            </button>

            {/* Direct WhatsApp Contact */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
              title={isAr ? 'مراسلة المعلم عبر واتساب' : 'WhatsApp Artisan'}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
            </a>
          </div>

          {/* Quick Record/Sell button for live inventory test */}
          {!isSoldOut && (
            <button
              onClick={() => onRecordSale(product.id, 1)}
              className="w-full mt-2 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
              <span>{isAr ? 'تسجيل بيع (خصم من المخزون)' : 'Record Souk Sale (-1 stock)'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
