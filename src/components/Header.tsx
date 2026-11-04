import React from 'react';
import { 
  Store, 
  Package, 
  Users, 
  MapPin, 
  TrendingUp, 
  Info, 
  Globe, 
  UserCheck, 
  PlusCircle, 
  MessageSquare
} from 'lucide-react';
import { AppUser } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
  availableUsers: AppUser[];
  onOpenNewSale: () => void;
  unreadMessagesCount: number;
  onOpenMessages: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  currentUser,
  setCurrentUser,
  availableUsers,
  onOpenNewSale,
  unreadMessagesCount,
  onOpenMessages,
}) => {
  const isAr = lang === 'ar';

  const navItems = [
    { id: 'marketplace', labelEn: 'Medina Souks', labelAr: 'السوق والمعروضات', icon: Store },
    { id: 'inventory', labelEn: 'Inventory & Products', labelAr: 'المخزون والمنتجات', icon: Package },
    { id: 'sellers', labelEn: 'Artisans & Stores', labelAr: 'الصناع والمحلات', icon: Users },
    { id: 'souks', labelEn: 'Manage Souks', labelAr: 'أسواق فاس', icon: MapPin },
    { id: 'analytics', labelEn: 'Live Sales Analytics', labelAr: 'التحليلات اللحظية', icon: TrendingUp },
    { id: 'about', labelEn: 'Medina Heritage', labelAr: 'عن الصناعة التقليدية', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner with Medina Location Trust & Role switcher */}
      <div className="bg-stone-900 text-stone-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-medium">Fez el-Bali, Morocco</span>
          <span className="text-stone-500">·</span>
          <span>UNESCO World Heritage Craft Platform</span>
          <span className="text-stone-500">·</span>
          <span className="text-stone-400">Currency: Moroccan Dirham (MAD)</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick role switcher dropdown */}
          <div className="flex items-center gap-1.5 bg-stone-800 px-2.5 py-0.5 rounded text-stone-300">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-stone-400">Role:</span>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const selected = availableUsers.find(u => u.id === Number(e.target.value));
                if (selected) setCurrentUser(selected);
              }}
              className="bg-transparent text-stone-100 font-medium cursor-pointer focus:outline-hidden text-xs"
              aria-label="Switch User Role"
            >
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id} className="bg-stone-900 text-stone-200">
                  {u.first_name} {u.last_name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-stone-800 text-stone-300 transition-colors text-xs cursor-pointer font-medium"
            title="Toggle Language"
            aria-label="Toggle English / Arabic"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Brand Zone */}
        <div 
          onClick={() => setCurrentTab('marketplace')} 
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-xs group-hover:bg-amber-700 transition-colors">
            ف
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xl font-bold tracking-tight text-stone-900">
                SoukFes
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                Artisans
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              {isAr ? 'منصة إدارة الحرف ومحلات أسواق فاس العتيقة' : 'Store & Inventory Management in Fez'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-50 text-amber-900 border border-amber-200/80 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-stone-400'}`} />
                <span>{isAr ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls Zone */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Contact Messages Trigger */}
          <button
            onClick={onOpenMessages}
            className="relative p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            title={isAr ? 'رسائل واستفسارات الزبائن' : 'Inquiries & Messages'}
            aria-label="View inquiries"
          >
            <MessageSquare className="w-5 h-5 text-stone-700" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Quick Record/Simulate Sale */}
          <button
            onClick={onOpenNewSale}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs hover:shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isAr ? 'تسجيل بيع جديد' : 'Record Sale'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 bg-stone-50 border-t border-stone-200 gap-1 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{isAr ? item.labelAr : item.labelEn}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
