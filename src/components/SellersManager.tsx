import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Phone, 
  MapPin, 
  CheckCircle, 
  Star, 
  X, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { Seller, Souk, Product } from '../types';

interface SellersManagerProps {
  sellers: Seller[];
  souks: Souk[];
  products: Product[];
  onAddSeller: (seller: Omit<Seller, 'id' | 'rating' | 'verified'>) => void;
  onUpdateSeller: (seller: Seller) => void;
  onDeleteSeller: (sellerId: number) => void;
  onViewSellerProducts?: (sellerId: number) => void;
  lang: 'en' | 'ar';
}

export const SellersManager: React.FC<SellersManagerProps> = ({
  sellers,
  souks,
  products,
  onAddSeller,
  onUpdateSeller,
  onDeleteSeller,
  onViewSellerProducts,
  lang,
}) => {
  const isAr = lang === 'ar';

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [feedback, setFeedback] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [artisanTitleEn, setArtisanTitleEn] = useState('');
  const [artisanTitleAr, setArtisanTitleAr] = useState('');
  const [contactInfo, setContactInfo] = useState('+212');
  const [soukId, setSoukId] = useState<number>(souks[0]?.id || 1);
  const [workshopLocation, setWorkshopLocation] = useState('');
  const [bioEn, setBioEn] = useState('');
  const [bioAr, setBioAr] = useState('');
  const [yearsActive, setYearsActive] = useState<number>(25);
  const [profileImage, setProfileImage] = useState('/src/assets/images/artisan_maalem_portrait_1793828985053.jpg');

  const presetAvatars = [
    { label: 'Master Maâlem Wood & Brass', url: '/src/assets/images/artisan_maalem_portrait_1793828985053.jpg' },
    { label: 'Chouara Leather Tanner Master', url: '/src/assets/images/craft_chouara_leather_1793828982828.jpg' },
    { label: 'Place Seffarine Coppersmith', url: '/src/assets/images/craft_seffarine_copper_1793828983675.jpg' },
    { label: 'Ain Nokbi Master Ceramist', url: '/src/assets/images/craft_fez_ceramics_1793828982273.jpg' },
  ];

  const handleOpenAdd = () => {
    setEditingSeller(null);
    setName('');
    setArtisanTitleEn('Master Artisan');
    setArtisanTitleAr('معلم تقليدي محترف');
    setContactInfo('+212 6');
    setSoukId(souks[0]?.id || 1);
    setWorkshopLocation('Medina of Fez');
    setBioEn('');
    setBioAr('');
    setYearsActive(20);
    setProfileImage('/src/assets/images/artisan_maalem_portrait_1793828985053.jpg');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (s: Seller) => {
    setEditingSeller(s);
    setName(s.name);
    setArtisanTitleEn(s.artisan_title_en);
    setArtisanTitleAr(s.artisan_title_ar);
    setContactInfo(s.contact_info);
    setSoukId(s.souk_id);
    setWorkshopLocation(s.workshop_location);
    setBioEn(s.bio_en);
    setBioAr(s.bio_ar);
    setYearsActive(s.years_active);
    setProfileImage(s.profile_image);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSeller) {
      onUpdateSeller({
        ...editingSeller,
        name,
        artisan_title_en: artisanTitleEn,
        artisan_title_ar: artisanTitleAr,
        contact_info: contactInfo,
        souk_id: Number(soukId),
        workshop_location: workshopLocation,
        bio_en: bioEn,
        bio_ar: bioAr,
        years_active: yearsActive,
        profile_image: profileImage,
      });
      setFeedback(isAr ? 'تم تعديل بيانات الصانع بنجاح!' : 'Artisan profile updated!');
    } else {
      onAddSeller({
        name,
        artisan_title_en: artisanTitleEn,
        artisan_title_ar: artisanTitleAr,
        contact_info: contactInfo,
        souk_id: Number(soukId),
        workshop_location: workshopLocation,
        bio_en: bioEn,
        bio_ar: bioAr,
        years_active: yearsActive,
        profile_image: profileImage,
      });
      setFeedback(isAr ? 'تم تسجيل الصانع الحرفي الجديد بنجاح!' : 'New artisan added to Fez registry!');
    }
    setIsFormOpen(false);
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleDelete = (id: number) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذا الصانع الحرفي؟' : 'Are you sure you want to delete this artisan?')) {
      onDeleteSeller(id);
      setFeedback(isAr ? 'تم حذف الصانع بنجاح' : 'Artisan deleted successfully');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header and Add Seller Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">
            {isAr ? 'إدارة معلمي وحرفيي أسواق فاس' : 'Fez Artisans & Store Owners Management'}
          </h1>
          <p className="text-xs text-stone-500">
            {isAr 
              ? 'سجل المعلمين والحرفيين بمدينة فاس القديمة، ورشات العمل، أرقام الواتساب والتواصل.' 
              : 'Directory of master craftsmen, workshops, WhatsApp links, and verified guild members.'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة صانع جديد' : 'Add New Artisan'}</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Add / Edit Modal matching addSeller.php */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-xl w-full p-6 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h2 className="font-display text-lg font-bold text-stone-900">
                {editingSeller 
                  ? (isAr ? 'تعديل بيانات الحرفي' : 'Edit Artisan Profile') 
                  : (isAr ? 'إضافة معلم حرفي جديد' : 'Register Master Artisan')}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isAr ? 'اسم الصانع / المعلم *' : 'Artisan Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maâlem Abdelilah El-Fassi"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'اللقب المهني (بالإنجليزية) *' : 'Title (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={artisanTitleEn}
                    onChange={(e) => setArtisanTitleEn(e.target.value)}
                    placeholder="Master Copper Smith"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'اللقب المهني (بالعربية) *' : 'Title (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={artisanTitleAr}
                    onChange={(e) => setArtisanTitleAr(e.target.value)}
                    placeholder="معلم الحدادة والنحاسيات"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'معلومات الاتصال / واتساب *' : 'Contact / WhatsApp *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="+212 617-763777"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'السوق التابع له *' : 'Souk Assignment *'}
                  </label>
                  <select
                    value={soukId}
                    onChange={(e) => setSoukId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    {souks.map((sk) => (
                      <option key={sk.id} value={sk.id}>
                        {isAr ? sk.name_ar : sk.name_en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'عنوان الورشة بالمدينة العتيقة *' : 'Workshop Location *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={workshopLocation}
                    onChange={(e) => setWorkshopLocation(e.target.value)}
                    placeholder="Place Seffarine #14, Medina"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'سنوات الخبرة في الحرفة *' : 'Years of Experience *'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={yearsActive}
                    onChange={(e) => setYearsActive(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Profile Image Asset Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isAr ? 'صورة الحرفي الشخصية *' : 'Artisan Portrait Asset *'}
                </label>
                <select
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg mb-2"
                >
                  {presetAvatars.map((av, i) => (
                    <option key={i} value={av.url}>
                      {av.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-3 p-2 bg-stone-50 rounded-lg border border-stone-200">
                  <img src={profileImage} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-amber-600" />
                  <span className="text-[11px] text-stone-500 truncate">{profileImage}</span>
                </div>
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
                  {editingSeller ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'تسجيل الصانع' : 'Register Seller')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sellers Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((seller) => {
          const souk = souks.find((s) => s.id === seller.souk_id);
          const sellerProducts = products.filter((p) => p.seller_id === seller.id);
          const totalStock = sellerProducts.reduce((sum, p) => sum + p.stock, 0);

          return (
            <div
              key={seller.id}
              className="bg-white rounded-xl border border-stone-200 shadow-2xs p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-3">
                  <img
                    src={seller.profile_image}
                    alt={seller.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-amber-700 shadow-xs shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-bold text-base text-stone-900 truncate">
                        {seller.name}
                      </h3>
                      {seller.verified && (
                        <span title="Verified Fez Guild Master">
                          <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-amber-800 truncate">
                      {isAr ? seller.artisan_title_ar : seller.artisan_title_en}
                    </p>
                    <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span>{seller.workshop_location}</span>
                    </p>
                  </div>
                </div>

                {/* Artisan Experience & Stats */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-stone-50 rounded-lg border border-stone-100 text-center mb-3">
                  <div>
                    <span className="block text-xs font-bold text-stone-900 tabular-nums">
                      {seller.years_active} {isAr ? 'سنة' : 'yrs'}
                    </span>
                    <span className="text-[10px] text-stone-400">{isAr ? 'الخبرة' : 'Exp'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-stone-900 tabular-nums">
                      {sellerProducts.length}
                    </span>
                    <span className="text-[10px] text-stone-400">{isAr ? 'القطع' : 'Items'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-emerald-700 tabular-nums">
                      {totalStock}
                    </span>
                    <span className="text-[10px] text-stone-400">{isAr ? 'المخزون' : 'Units'}</span>
                  </div>
                </div>

                <p className="text-stone-600 text-xs line-clamp-2 mb-3">
                  {isAr ? (seller.bio_ar || seller.bio_en) : (seller.bio_en || seller.bio_ar)}
                </p>

                {souk && (
                  <div className="text-[11px] text-stone-500 mb-2">
                    <span className="text-stone-400">{isAr ? 'السوق:' : 'Souk:'}</span>{' '}
                    <span className="font-semibold text-stone-700">{isAr ? souk.name_ar : souk.name_en}</span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <a
                  href={`https://wa.me/${seller.contact_info.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{seller.contact_info}</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(seller)}
                    className="p-1.5 rounded text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(seller.id)}
                    className="p-1.5 rounded text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
