import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkStockHealth,
  processSaleTransaction,
  calculateAnalyticsSummary,
  filterAndSearchProducts,
  generateWhatsAppOrderLink,
  formatCurrencyMAD,
  generateSalesCSV,
  generateInventoryCSV,
} from './analytics';
import { Product, SaleEvent, Seller, Souk } from '../types';

const mockProducts: Product[] = [
  {
    id: 101,
    name_en: 'Hand-hammered Copper Teapot',
    name_ar: 'إبريق شاي نحاسي منقوش باليد',
    description_en: 'Traditional Moroccan teapot crafted in Place Seffarine',
    description_ar: 'إبريق شاي مغربي تقليدي مصنوع في ساحة الصفارين',
    price: 450,
    seller_id: 1,
    souk_id: 1,
    category: 'Copper & Brass',
    stock: 8,
    low_stock_threshold: 3,
    sku: 'FEZ-COP-101',
    images: [{ id: 1, url: '/test.jpg', alt_text: 'Teapot', image_type: 'product' }],
  },
  {
    id: 102,
    name_en: 'Chouara Leather Messenger Bag',
    name_ar: 'حقيبة جلدية طبيعية شوارة',
    description_en: 'Vegetable-tanned goat leather bag',
    description_ar: 'حقيبة من جلد الماعز المدبوغ طبيعياً',
    price: 650,
    seller_id: 2,
    souk_id: 2,
    category: 'Leather',
    stock: 2,
    low_stock_threshold: 4,
    sku: 'FEZ-LEA-102',
    images: [{ id: 2, url: '/leather.jpg', alt_text: 'Bag', image_type: 'product' }],
  },
  {
    id: 103,
    name_en: 'Zellige Ceramic Tajine',
    name_ar: 'طاجين خزفي بزخرفة زليج فاس',
    description_en: 'Cobalt blue glazed serving tajine',
    description_ar: 'طاجين تقديم مزجج باللون الأزرق الفاسي',
    price: 320,
    seller_id: 1,
    souk_id: 1,
    category: 'Ceramics & Zellige',
    stock: 0,
    low_stock_threshold: 5,
    sku: 'FEZ-CER-103',
    images: [{ id: 3, url: '/tajine.jpg', alt_text: 'Tajine', image_type: 'product' }],
  },
];

const mockSellers: Seller[] = [
  {
    id: 1,
    name: 'Maâlem Abdelilah El-Fassi',
    artisan_title_en: 'Master Copper Smith',
    artisan_title_ar: 'معلم الحدادة والنحاسيات',
    contact_info: '+212617763777',
    souk_id: 1,
    profile_image: '/artisan.jpg',
    workshop_location: 'Place Seffarine #14, Medina',
    bio_en: '40 years hammering brass and copper',
    bio_ar: '40 عاماً من الصنعة التقليدية في النحاس',
    years_active: 40,
    verified: true,
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Hassan Belmokhtar',
    artisan_title_en: 'Master Leather Tanner & Artisan',
    artisan_title_ar: 'حرفي الجلود الطبيعية بشوارة',
    contact_info: '+212622334455',
    souk_id: 2,
    profile_image: '/hassan.jpg',
    workshop_location: 'Derb Chouara #3, Medina',
    bio_en: 'Family heritage since 1952',
    bio_ar: 'تراث عائلي عريق منذ 1952',
    years_active: 28,
    verified: true,
    rating: 4.8,
  },
];

const mockSouks: Souk[] = [
  {
    id: 1,
    name_en: 'Souk Seffarine',
    name_ar: 'سوق الصفارين',
    category: 'Copper & Brass',
    location: 'Place Seffarine, Fes el-Bali',
    city_name_en: 'Fez',
    city_name_ar: 'فاس',
    description_en: 'The renowned square of copper coppersmiths',
    description_ar: 'ساحة صناع النحاس العريقة بقلب فاس البالي',
    image: '/seffarine.jpg',
  },
  {
    id: 2,
    name_en: 'Souk Chouara',
    name_ar: 'سوق شوارة للجلود',
    category: 'Leather',
    location: 'Chouara Tannery Quarter, Fes el-Bali',
    city_name_en: 'Fez',
    city_name_ar: 'فاس',
    description_en: 'Historic 11th century stone tanneries',
    description_ar: 'دار الدباغ شوارة التاريخية من القرن الحادي عشر',
    image: '/chouara.jpg',
  },
];

const mockSales: SaleEvent[] = [
  {
    id: 's1',
    product_id: 101,
    product_name_en: 'Hand-hammered Copper Teapot',
    product_name_ar: 'إبريق شاي نحاسي',
    seller_id: 1,
    seller_name: 'Maâlem Abdelilah El-Fassi',
    souk_id: 1,
    souk_name: 'Souk Seffarine',
    quantity: 2,
    unit_price: 450,
    total_mad: 900,
    timestamp: new Date().toISOString(),
    customer_name: 'Youssef B.',
    customer_country: 'Morocco',
    payment_method: 'Cash in Souk',
  },
  {
    id: 's2',
    product_id: 102,
    product_name_en: 'Chouara Leather Messenger Bag',
    product_name_ar: 'حقيبة جلدية طبيعية',
    seller_id: 2,
    seller_name: 'Hassan Belmokhtar',
    souk_id: 2,
    souk_name: 'Souk Chouara',
    quantity: 1,
    unit_price: 650,
    total_mad: 650,
    timestamp: new Date().toISOString(),
    customer_name: 'Elena Rostova',
    customer_country: 'France',
    payment_method: 'International Card',
  },
];

test('checkStockHealth accurately categorizes stock levels', () => {
  assert.equal(checkStockHealth(10, 3), 'in_stock');
  assert.equal(checkStockHealth(3, 3), 'low_stock');
  assert.equal(checkStockHealth(1, 3), 'low_stock');
  assert.equal(checkStockHealth(0, 3), 'out_of_stock');
  assert.equal(checkStockHealth(-1, 3), 'out_of_stock');
});

test('processSaleTransaction decrements inventory stock accurately', () => {
  const result = processSaleTransaction(
    {
      product_id: 101,
      product_name_en: 'Hand-hammered Copper Teapot',
      product_name_ar: 'إبريق شاي نحاسي',
      seller_id: 1,
      seller_name: 'Maâlem Abdelilah El-Fassi',
      souk_id: 1,
      souk_name: 'Souk Seffarine',
      quantity: 3,
      unit_price: 450,
      total_mad: 1350,
      customer_name: 'Amina T.',
      customer_country: 'Morocco',
      payment_method: 'Cash in Souk',
    },
    mockProducts
  );

  assert.equal(result.error, undefined);
  const updatedItem = result.updatedProducts.find(p => p.id === 101);
  assert.equal(updatedItem?.stock, 5); // 8 - 3 = 5
  assert.equal(result.newSale.total_mad, 1350);
});

test('processSaleTransaction returns error when stock is insufficient', () => {
  const result = processSaleTransaction(
    {
      product_id: 102,
      product_name_en: 'Chouara Leather Messenger Bag',
      product_name_ar: 'حقيبة جلدية طبيعية',
      seller_id: 2,
      seller_name: 'Hassan Belmokhtar',
      souk_id: 2,
      souk_name: 'Souk Chouara',
      quantity: 10, // Stock is only 2
      unit_price: 650,
      total_mad: 6500,
      customer_name: 'Omar K.',
      customer_country: 'Morocco',
      payment_method: 'Cash in Souk',
    },
    mockProducts
  );

  assert.notEqual(result.error, undefined);
  const item = result.updatedProducts.find(p => p.id === 102);
  assert.equal(item?.stock, 2); // Unchanged
});

test('calculateAnalyticsSummary aggregates revenues, units, and stock health', () => {
  const summary = calculateAnalyticsSummary(mockProducts, mockSales, mockSellers, mockSouks);
  
  assert.equal(summary.totalRevenueMAD, 1550); // 900 + 650
  assert.equal(summary.totalUnitsSold, 3); // 2 + 1
  assert.equal(summary.totalStockRemaining, 10); // 8 + 2 + 0
  assert.equal(summary.lowStockCount, 1); // ID 102 is stock 2 (threshold 4)
  assert.equal(summary.outOfStockCount, 1); // ID 103 is stock 0
  assert.equal(summary.activeArtisansCount, 2);
  assert.equal(summary.activeProductsCount, 3);
  assert.equal(summary.topSellingCategories.length, 2);
});

test('filterAndSearchProducts finds items by ID, title, and stock status', () => {
  // Search by ID (exact match behavior like in seeProduit.php)
  const byId = filterAndSearchProducts(mockProducts, '102');
  assert.equal(byId.length, 1);
  assert.equal(byId[0].id, 102);

  // Search by Arabic title keyword
  const byArabic = filterAndSearchProducts(mockProducts, 'نحاسي');
  assert.equal(byArabic.length, 1);
  assert.equal(byArabic[0].id, 101);

  // Filter by stock status: out of stock
  const outOfStock = filterAndSearchProducts(mockProducts, '', undefined, undefined, undefined, 'out_of_stock');
  assert.equal(outOfStock.length, 1);
  assert.equal(outOfStock[0].id, 103);
});

test('generateWhatsAppOrderLink builds valid WhatsApp redirect with custom greeting', () => {
  const link = generateWhatsAppOrderLink('+212 617-763777', 101, 'Copper Teapot', 'en');
  assert.match(link, /^https:\/\/wa\.me\/212617763777\?text=/);
  assert.match(link, /Copper%20Teapot/);
});

test('formatCurrencyMAD formats MAD amounts cleanly', () => {
  const formatted = formatCurrencyMAD(450);
  assert.match(formatted, /450.*MAD/);
});

test('generateSalesCSV and generateInventoryCSV output proper headers and rows', () => {
  const salesCsv = generateSalesCSV(mockSales);
  assert.ok(salesCsv.startsWith('Sale ID,Date & Time,Product ID'));
  assert.ok(salesCsv.includes('"Hand-hammered Copper Teapot"'));
  assert.ok(salesCsv.includes('900'));

  const invCsv = generateInventoryCSV(mockProducts);
  assert.ok(invCsv.startsWith('ID,SKU,Title (EN),Title (AR)'));
  assert.ok(invCsv.includes('"FEZ-COP-101"'));
  assert.ok(invCsv.includes('"in_stock"'));
});
