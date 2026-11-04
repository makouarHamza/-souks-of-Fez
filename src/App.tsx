import React, { useState, useEffect } from 'react';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SELLERS, 
  INITIAL_SOUKS, 
  INITIAL_SALES, 
  INITIAL_USERS 
} from './data/initialData';
import { Product, Seller, Souk, SaleEvent, AppUser, ContactMessage } from './types';
import { Header } from './components/Header';
import { MarketplaceView } from './components/MarketplaceView';
import { InventoryManager } from './components/InventoryManager';
import { SellersManager } from './components/SellersManager';
import { SouksManager } from './components/SouksManager';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AboutView } from './components/AboutView';
import { UsersManager } from './components/UsersManager';
import { ProductDetailModal } from './components/ProductDetailModal';
import { NewSaleModal } from './components/NewSaleModal';
import { ContactMessagesModal } from './components/ContactMessagesModal';
import { processSaleTransaction, formatCurrencyMAD } from './utils/analytics';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('soukfes_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [sellers, setSellers] = useState<Seller[]>(() => {
    const saved = localStorage.getItem('soukfes_sellers');
    return saved ? JSON.parse(saved) : INITIAL_SELLERS;
  });

  const [souks, setSouks] = useState<Souk[]>(() => {
    const saved = localStorage.getItem('soukfes_souks');
    return saved ? JSON.parse(saved) : INITIAL_SOUKS;
  });

  const [sales, setSales] = useState<SaleEvent[]>(() => {
    const saved = localStorage.getItem('soukfes_sales');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('soukfes_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<AppUser>(users[0]);
  const [currentTab, setCurrentTab] = useState<string>('marketplace');
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  // Modals state
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [recentSaleNotification, setRecentSaleNotification] = useState<string | null>(null);

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([
    {
      id: 1,
      sender_name: 'Elena Rostova',
      sender_email: 'elena.rostova@paris-art.fr',
      sender_phone: '+33 6 12 34 56 78',
      message: 'Greetings Maâlem Abdelilah, I am interested in ordering 3 custom brass lanterns for a boutique riad in Marrakech. Can we arrange shipping?',
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: 'new',
    },
    {
      id: 2,
      sender_name: 'Karim Bennani',
      sender_email: 'karim.b@casa-design.ma',
      sender_phone: '+212 6 61 22 33 44',
      message: 'سلام عليكم، هل تتوفر لديكم حقيبة شوارة للسفر باللون البني العتيق جاهزة للتسليم في فاس؟',
      created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      status: 'new',
    },
  ]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('soukfes_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('soukfes_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('soukfes_sellers', JSON.stringify(sellers));
  }, [sellers]);

  useEffect(() => {
    localStorage.setItem('soukfes_souks', JSON.stringify(souks));
  }, [souks]);

  useEffect(() => {
    localStorage.setItem('soukfes_users', JSON.stringify(users));
  }, [users]);

  // Check URL parameters on mount (e.g. ?id=101 or ?tab=analytics or ?autostart=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    const tabParam = params.get('tab');
    const langParam = params.get('lang');

    if (langParam === 'ar' || langParam === 'en') {
      setLang(langParam);
    }

    if (tabParam) {
      setCurrentTab(tabParam);
    }

    if (idParam) {
      const p = products.find(prod => prod.id === parseInt(idParam, 10));
      if (p) setModalProduct(p);
    }
  }, []);

  // Update document direction and lang
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Handle direct sale processing
  const handleProcessSale = (saleData: Omit<SaleEvent, 'id' | 'timestamp'>) => {
    const { updatedProducts, newSale, error } = processSaleTransaction(saleData, products);
    if (error) {
      alert(error);
      return;
    }

    setProducts(updatedProducts);
    setSales(prev => [newSale, ...prev]);

    // Show floating toast
    const title = lang === 'ar' ? newSale.product_name_ar : newSale.product_name_en;
    setRecentSaleNotification(
      lang === 'ar'
        ? `تم تسجيل بيع: ${title} (${formatCurrencyMAD(newSale.total_mad)}) - تم تحديث المخزون!`
        : `New sale: ${title} (${formatCurrencyMAD(newSale.total_mad)}) - Inventory updated!`
    );
    setTimeout(() => setRecentSaleNotification(null), 4500);
  };

  // Quick sale for 1-click in Marketplace
  const handleQuickSale = (productId: number, quantity: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const seller = sellers.find(s => s.id === prod.seller_id);
    const souk = souks.find(sk => sk.id === prod.souk_id);

    handleProcessSale({
      product_id: prod.id,
      product_name_en: prod.name_en,
      product_name_ar: prod.name_ar,
      seller_id: prod.seller_id,
      seller_name: seller?.name || 'Medina Artisan',
      souk_id: prod.souk_id,
      souk_name: souk?.name_en || 'Medina Souk',
      quantity,
      unit_price: prod.price,
      total_mad: prod.price * quantity,
      customer_name: 'Medina Visitor',
      customer_country: 'Morocco',
      payment_method: 'Cash in Souk',
    });
  };

  // Trigger realistic simulated sale
  const handleTriggerRandomSale = () => {
    const inStock = products.filter(p => p.stock > 0);
    if (inStock.length === 0) return;

    const randomProd = inStock[Math.floor(Math.random() * inStock.length)];
    const seller = sellers.find(s => s.id === randomProd.seller_id);
    const souk = souks.find(sk => sk.id === randomProd.souk_id);

    const touristOrigins = ['France', 'Spain', 'Germany', 'USA', 'UK', 'Morocco', 'Italy', 'Japan'];
    const touristNames = ['Claire Dubois', 'Mateo Morales', 'Julian Schmidt', 'David Vance', 'Nadia Alami', 'Kenji Takahashi'];
    const randomOrigin = touristOrigins[Math.floor(Math.random() * touristOrigins.length)];
    const randomName = touristNames[Math.floor(Math.random() * touristNames.length)];

    handleProcessSale({
      product_id: randomProd.id,
      product_name_en: randomProd.name_en,
      product_name_ar: randomProd.name_ar,
      seller_id: randomProd.seller_id,
      seller_name: seller?.name || 'Master Artisan',
      souk_id: randomProd.souk_id,
      souk_name: souk?.name_en || 'Traditional Souk',
      quantity: 1,
      unit_price: randomProd.price,
      total_mad: randomProd.price,
      customer_name: randomName,
      customer_country: randomOrigin,
      payment_method: Math.random() > 0.4 ? 'Cash in Souk' : 'International Card',
    });
  };

  // Quick Restock (+N units)
  const handleQuickRestock = (productId: number, addQuantity: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stock: p.stock + addQuantity } : p))
    );
  };

  // Product CRUD
  const handleAddProduct = (newProd: Omit<Product, 'id'>) => {
    const nextId = Math.max(...products.map(p => p.id), 100) + 1;
    setProducts(prev => [{ ...newProd, id: nextId }, ...prev]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    if (modalProduct && modalProduct.id === updated.id) {
      setModalProduct(updated);
    }
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    if (modalProduct && modalProduct.id === productId) {
      setModalProduct(null);
    }
  };

  // Seller CRUD
  const handleAddSeller = (newSeller: Omit<Seller, 'id' | 'rating' | 'verified'>) => {
    const nextId = Math.max(...sellers.map(s => s.id), 0) + 1;
    setSellers(prev => [{ ...newSeller, id: nextId, rating: 5.0, verified: true }, ...prev]);
  };

  const handleUpdateSeller = (updated: Seller) => {
    setSellers(prev => prev.map(s => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteSeller = (sellerId: number) => {
    setSellers(prev => prev.filter(s => s.id !== sellerId));
  };

  // Souk CRUD
  const handleAddSouk = (newSouk: Omit<Souk, 'id'>) => {
    const nextId = Math.max(...souks.map(s => s.id), 0) + 1;
    setSouks(prev => [{ ...newSouk, id: nextId }, ...prev]);
  };

  const handleUpdateSouk = (updated: Souk) => {
    setSouks(prev => prev.map(s => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteSouk = (soukId: number) => {
    setSouks(prev => prev.filter(s => s.id !== soukId));
  };

  // User CRUD
  const handleAddUser = (newUser: Omit<AppUser, 'id'>) => {
    const nextId = Math.max(...users.map(u => u.id), 0) + 1;
    setUsers(prev => [{ ...newUser, id: nextId }, ...prev]);
  };

  const handleUpdateUser = (updated: AppUser) => {
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
    if (currentUser.id === updated.id) setCurrentUser(updated);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Send message
  const handleSendMessage = (msg: Omit<ContactMessage, 'id' | 'created_at' | 'status'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: Date.now(),
      created_at: new Date().toISOString(),
      status: 'new',
    };
    setContactMessages(prev => [newMsg, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        availableUsers={users}
        onOpenNewSale={() => setIsNewSaleOpen(true)}
        unreadMessagesCount={contactMessages.length}
        onOpenMessages={() => setIsMessagesOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'marketplace' && (
          <MarketplaceView
            products={products}
            sellers={sellers}
            souks={souks}
            onViewProductDetails={(p) => setModalProduct(p)}
            onRecordSale={handleQuickSale}
            lang={lang}
          />
        )}

        {currentTab === 'inventory' && (
          <InventoryManager
            products={products}
            sellers={sellers}
            souks={souks}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onQuickStockChange={(id, delta) => handleQuickRestock(id, delta)}
            lang={lang}
          />
        )}

        {currentTab === 'sellers' && (
          <SellersManager
            sellers={sellers}
            souks={souks}
            products={products}
            onAddSeller={handleAddSeller}
            onUpdateSeller={handleUpdateSeller}
            onDeleteSeller={handleDeleteSeller}
            lang={lang}
          />
        )}

        {currentTab === 'souks' && (
          <SouksManager
            souks={souks}
            sellers={sellers}
            products={products}
            onAddSouk={handleAddSouk}
            onUpdateSouk={handleUpdateSouk}
            onDeleteSouk={handleDeleteSouk}
            lang={lang}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsDashboard
            products={products}
            sales={sales}
            sellers={sellers}
            souks={souks}
            onTriggerRandomSale={handleTriggerRandomSale}
            onQuickRestock={handleQuickRestock}
            onOpenNewSaleModal={() => setIsNewSaleOpen(true)}
            lang={lang}
          />
        )}

        {currentTab === 'about' && (
          <AboutView lang={lang} />
        )}

        {currentTab === 'users' && (
          <UsersManager
            users={users}
            sellers={sellers}
            currentUser={currentUser}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            lang={lang}
          />
        )}
      </main>

      {/* Floating Real-Time Sale Toast */}
      {recentSaleNotification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 p-3.5 bg-stone-900 text-white rounded-xl shadow-xl border border-amber-600/40 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{recentSaleNotification}</span>
        </div>
      )}

      {/* Product Detail Modal (Matches seeProduit.php) */}
      {modalProduct && (
        <ProductDetailModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          seller={sellers.find(s => s.id === modalProduct.seller_id)}
          souk={souks.find(sk => sk.id === modalProduct.souk_id)}
          allProducts={products}
          onSelectProduct={(p) => setModalProduct(p)}
          onRecordSale={handleQuickSale}
          lang={lang}
        />
      )}

      {/* New Sale Modal */}
      {isNewSaleOpen && (
        <NewSaleModal
          isOpen={isNewSaleOpen}
          onClose={() => setIsNewSaleOpen(false)}
          products={products}
          sellers={sellers}
          souks={souks}
          onConfirmSale={handleProcessSale}
          lang={lang}
        />
      )}

      {/* Contact Messages Modal (Matches contact_messages.php) */}
      {isMessagesOpen && (
        <ContactMessagesModal
          isOpen={isMessagesOpen}
          onClose={() => setIsMessagesOpen(false)}
          messages={contactMessages}
          onSendMessage={handleSendMessage}
          lang={lang}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-white text-base">SoukFes</span>
            <span>·</span>
            <span>{lang === 'ar' ? 'منصة توثيق ومخزون حرفيي فاس العتيقة' : 'Old Medina of Fez Artisan Commerce & Telemetry'}</span>
          </div>
          <div className="flex items-center gap-6 text-stone-400">
            <button onClick={() => setCurrentTab('marketplace')} className="hover:text-white transition-colors cursor-pointer">
              {lang === 'ar' ? 'المعروضات' : 'Marketplace'}
            </button>
            <button onClick={() => setCurrentTab('analytics')} className="hover:text-white transition-colors cursor-pointer">
              {lang === 'ar' ? 'التحليلات اللحظية' : 'Live Analytics'}
            </button>
            <button onClick={() => setCurrentTab('about')} className="hover:text-white transition-colors cursor-pointer">
              {lang === 'ar' ? 'التراث' : 'Heritage'}
            </button>
            <button onClick={() => setIsMessagesOpen(true)} className="hover:text-white transition-colors cursor-pointer">
              {lang === 'ar' ? 'اتصل بنا' : 'Inquiries'}
            </button>
          </div>
          <div className="text-stone-500">
            Fez el-Bali, Morocco · {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}
