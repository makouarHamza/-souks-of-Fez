import React, { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, X, Check, Building2, ExternalLink } from 'lucide-react';
import { Souk, Seller, Product } from '../types';

interface SouksManagerProps {
  souks: Souk[];
  sellers: Seller[];
  products: Product[];
  onAddSouk: (souk: Omit<Souk, 'id'>) => void;
  onUpdateSouk: (souk: Souk) => void;
  onDeleteSouk: (soukId: number) => void;
  lang: 'en' | 'ar';
}

export const SouksManager: React.FC<SouksManagerProps> = ({
  souks,
  sellers,
  products,
  onAddSouk,
  onUpdateSouk,
  onDeleteSouk,
  lang,
}) => {
  const isAr = lang === 'ar';

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSouk, setEditingSouk] = useState<Souk | null>(null);
  const [feedback, setFeedback] = useState('');

  // Form Fields
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [category, setCategory] = useState('Traditional Market');
  const [location, setLocation] = useState('Fes el-Bali, Medina');
  const [descEn, setDescEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [image, setImage] = useState('/src/assets/images/hero_fez_medina_1793828981433.jpg');

  const presetImages = [
    { label: 'Place Seffarine Copper Souk', url: '/src/assets/images/craft_seffarine_copper_1793828983675.jpg' },
    { label: 'Chouara Leather Tannery Quarter', url: '/src/assets/images/craft_chouara_leather_1793828982828.jpg' },
    { label: 'Ain Nokbi Pottery & Zellige Village', url: '/src/assets/images/craft_fez_ceramics_1793828982273.jpg' },
    { label: 'Place an-Nejjarine Cedar Fondouk', url: '/src/assets/images/artisan_maalem_portrait_1793828985053.jpg' },
    { label: 'Historic Tala\'a Kebira & Bab Boujloud', url: '/src/assets/images/hero_fez_medina_1793828981433.jpg' },
  ];

  const handleOpenAdd = () => {
    setEditingSouk(null);
    setNameEn('');
    setNameAr('');
    setCategory('Traditional Market');
    setLocation('Fes el-Bali, Old Medina');
    setDescEn('');
    setDescAr('');
    setImage('/src/assets/images/hero_fez_medina_1793828981433.jpg');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (s: Souk) => {
    setEditingSouk(s);
    setNameEn(s.name_en);
    setNameAr(s.name_ar);
    setCategory(s.category);
    setLocation(s.location);
    setDescEn(s.description_en);
    setDescAr(s.description_ar);
    setImage(s.image);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSouk) {
      onUpdateSouk({
        ...editingSouk,
        name_en: nameEn,
        name_ar: nameAr,
        category,
        location,
        description_en: descEn,
        description_ar: descAr,
        image,
      });
      setFeedback(isAr ? 'تم تعديل بيانات السوق التراثي بنجاح!' : 'Souk updated successfully!');
    } else {
      onAddSouk({
        name_en: nameEn,
        name_ar: nameAr,
        category,
        location,
        city_name_en: 'Fez',
        city_name_ar: 'فاس',
        description_en: descEn,
        description_ar: descAr,
        image,
        artisan_count: 5,
      });
      setFeedback(isAr ? 'تمت إضافة السوق التراثي الجديد بنجاح!' : 'New souk added to Medina registry!');
    }

    setIsFormOpen(false);
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleDelete = (id: number) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذا السوق التراثي؟' : 'Are you sure you want to delete this souk?')) {
      onDeleteSouk(id);
      setFeedback(isAr ? 'تم حذف السوق بنجاح' : 'Souk deleted');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Banner and Quick Add */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">
            {isAr ? 'إدارة أسواق وفنادق مدينة فاس العتيقة' : 'Historic Souks of Fez Management'}
          </h1>
          <p className="text-xs text-stone-500">
            {isAr
              ? 'نظام إدارة الأسواق التقليدية العريقة، تصنيف الحرف، مواقع الأزقة التراثية ووصفها.'
              : 'Directory of traditional Medina markets, craft categories, and heritage quarter locations.'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة سوق جديد' : 'Add New Souk'}</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Add / Edit Souk Modal matching mangeSouks.php */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-xl w-full p-6 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h2 className="font-display text-lg font-bold text-stone-900">
                {editingSouk 
                  ? (isAr ? 'تعديل بيانات السوق' : 'Edit Souk Details') 
                  : (isAr ? 'إضافة سوق تقليدي جديد' : 'Add Historic Souk')}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'اسم السوق (بالإنجليزية) *' : 'Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Souk Seffarine"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'اسم السوق (بالعربية) *' : 'Name (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="سوق الصفارين"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'الصنف / النشاط الحرفي *' : 'Category *'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="Traditional Market">Traditional Market</option>
                    <option value="Copper & Brass">Copper & Brass</option>
                    <option value="Leather">Leather</option>
                    <option value="Ceramics & Zellige">Ceramics & Zellige</option>
                    <option value="Cedar Wood">Cedar Wood</option>
                    <option value="Spices & Natural Cosmetics">Spices & Natural Cosmetics</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Mixed">Mixed Crafts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'الموقع بالمدينة العتيقة *' : 'Location *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Place Seffarine, Fes el-Bali"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'الوصف التاريخي (بالإنجليزية)' : 'Description (English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    placeholder="History and specialties of this artisan quarter..."
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'الوصف التاريخي (بالعربية)' : 'Description (Arabic)'}
                  </label>
                  <textarea
                    rows={2}
                    value={descAr}
                    onChange={(e) => setDescAr(e.target.value)}
                    placeholder="التاريخ والأنشطة المميزة لهذا السوق التراثي..."
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isAr ? 'صورة السوق' : 'Souk Photo Asset'}
                </label>
                <select
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg mb-2"
                >
                  {presetImages.map((p, i) => (
                    <option key={i} value={p.url}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-amber-700 hover:bg-amber-800 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  {editingSouk ? (isAr ? 'حفظ التعديل' : 'Update Souk') : (isAr ? 'إضافة السوق' : 'Add Souk')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Souks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {souks.map((souk) => {
          const soukArtisans = sellers.filter((s) => s.souk_id === souk.id);
          const soukProducts = products.filter((p) => p.souk_id === souk.id);

          return (
            <div
              key={souk.id}
              className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative h-40 overflow-hidden bg-stone-100">
                  <img
                    src={souk.image}
                    alt={souk.name_en}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-stone-900/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                    {souk.category}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-lg text-stone-900">
                      {isAr ? souk.name_ar : souk.name_en}
                    </h3>
                    <span className="text-xs text-amber-800 font-semibold">
                      {isAr ? 'فاس العتيقة' : 'Fez Medina'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{souk.location}</span>
                  </p>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed pt-1">
                    {isAr ? (souk.description_ar || souk.description_en) : (souk.description_en || souk.description_ar)}
                  </p>
                </div>
              </div>

              {/* Bottom statistics & Actions */}
              <div className="p-4 pt-2 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <div>
                    <span className="font-bold text-stone-900 tabular-nums">{soukArtisans.length}</span>{' '}
                    <span>{isAr ? 'صناع' : 'Artisans'}</span>
                  </div>
                  <span>·</span>
                  <div>
                    <span className="font-bold text-stone-900 tabular-nums">{soukProducts.length}</span>{' '}
                    <span>{isAr ? 'قطع' : 'Pieces'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(souk)}
                    className="p-1.5 rounded text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(souk.id)}
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
