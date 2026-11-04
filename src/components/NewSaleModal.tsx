import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle, AlertTriangle } from 'lucide-react';
import { Product, Seller, Souk, SaleEvent } from '../types';
import { formatCurrencyMAD } from '../utils/analytics';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  sellers: Seller[];
  souks: Souk[];
  onConfirmSale: (sale: Omit<SaleEvent, 'id' | 'timestamp'>) => void;
  lang: 'en' | 'ar';
}

export const NewSaleModal: React.FC<NewSaleModalProps> = ({
  isOpen,
  onClose,
  products,
  sellers,
  souks,
  onConfirmSale,
  lang,
}) => {
  const isAr = lang === 'ar';

  const [selectedProductId, setSelectedProductId] = useState<number>(products[0]?.id || 101);
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState('In-Souk Buyer');
  const [customerCountry, setCustomerCountry] = useState('Morocco');
  const [paymentMethod, setPaymentMethod] = useState<SaleEvent['payment_method']>('Cash in Souk');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.id === selectedProductId) || products[0];
  const currentSeller = sellers.find(s => s.id === currentProduct?.seller_id);
  const currentSouk = souks.find(sk => sk.id === currentProduct?.souk_id);
  const totalMAD = (currentProduct?.price || 0) * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentProduct) return;
    if (currentProduct.stock < quantity) {
      setErrorMsg(
        isAr 
          ? `المخزون المتوفر (${currentProduct.stock}) لا يكفي للكمية المطلوبة (${quantity})!` 
          : `Insufficient stock! Only ${currentProduct.stock} units available.`
      );
      return;
    }

    onConfirmSale({
      product_id: currentProduct.id,
      product_name_en: currentProduct.name_en,
      product_name_ar: currentProduct.name_ar,
      seller_id: currentProduct.seller_id,
      seller_name: currentSeller?.name || 'Medina Artisan',
      souk_id: currentProduct.souk_id,
      souk_name: currentSouk?.name_en || 'Medina Souk',
      quantity,
      unit_price: currentProduct.price,
      total_mad: totalMAD,
      customer_name: customerName,
      customer_country: customerCountry,
      payment_method: paymentMethod,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-2xs overflow-y-auto">
      <div 
        dir={isAr ? 'rtl' : 'ltr'}
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-lg w-full p-6 my-auto animate-in fade-in zoom-in-95"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-700" />
            <h2 className="font-display text-lg font-bold text-stone-900">
              {isAr ? 'تسجيل معاملة بيع فورية بأسواق فاس' : 'Record Real-Time Souk Transaction'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Product */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {isAr ? 'اختر القطعة الحرفية *' : 'Select Artisan Piece *'}
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(Number(e.target.value));
                setQuantity(1);
                setErrorMsg('');
              }}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                  {isAr ? p.name_ar : p.name_en} · {formatCurrencyMAD(p.price)} (Stock: {p.stock})
                </option>
              ))}
            </select>
          </div>

          {currentProduct && (
            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
              <img
                src={currentProduct.images[0]?.url}
                alt=""
                className="w-12 h-12 rounded object-cover border border-stone-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-stone-900 truncate">
                  {isAr ? currentProduct.name_ar : currentProduct.name_en}
                </div>
                <div className="text-[11px] text-stone-500">
                  {currentSeller?.name} · {currentSouk?.name_en}
                </div>
                <div className="text-[11px] text-amber-900 font-bold tabular-nums">
                  {formatCurrencyMAD(currentProduct.price)} per unit
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isAr ? 'الكمية المباعة *' : 'Quantity *'}
              </label>
              <input
                type="number"
                min="1"
                max={Math.max(1, currentProduct?.stock || 1)}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isAr ? 'طريقة الدفع *' : 'Payment Method *'}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              >
                <option value="Cash in Souk">Cash in Souk</option>
                <option value="WhatsApp Order">WhatsApp Order</option>
                <option value="International Card">International Card</option>
                <option value="Direct Transfer">Direct Transfer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isAr ? 'اسم الزبون / المشتري' : 'Buyer Name'}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Elena Rostova"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isAr ? 'بلد الزبون' : 'Buyer Origin / Country'}
              </label>
              <select
                value={customerCountry}
                onChange={(e) => setCustomerCountry(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              >
                <option value="Morocco">Morocco</option>
                <option value="France">France</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Germany">Germany</option>
                <option value="Spain">Spain</option>
                <option value="Japan">Japan</option>
                <option value="Canada">Canada</option>
              </select>
            </div>
          </div>

          {/* Total MAD display */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-700">
              {isAr ? 'الإجمالي المحسوب (يخصم من المخزون فوراً):' : 'Total Revenue (Live Stock Deduction):'}
            </span>
            <span className="text-lg font-bold text-amber-950 tabular-nums">
              {formatCurrencyMAD(totalMAD)}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={!currentProduct || currentProduct.stock < quantity}
              className="px-5 py-2 text-xs font-semibold bg-amber-700 hover:bg-amber-800 text-white rounded-lg shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isAr ? 'تأكيد وقيد المعاملة' : 'Confirm & Process Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
