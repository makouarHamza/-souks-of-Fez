import React from 'react';
import { Award, ShieldCheck, HeartHandshake, Sparkles, MapPin } from 'lucide-react';

interface AboutViewProps {
  lang: 'en' | 'ar';
}

export const AboutView: React.FC<AboutViewProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  return (
    <div className="space-y-10" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Hero Narrative */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200">
        <div className="relative h-64 sm:h-96 w-full">
          <img
            src="/src/assets/images/hero_fez_medina_1793828981433.jpg"
            alt="Fez el-Bali Heritage"
            className="w-full h-full object-cover brightness-65"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />
        </div>

        <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end text-white max-w-3xl space-y-3">
          <span className="text-amber-400 font-semibold text-xs tracking-wider uppercase">
            {isAr ? 'تراث إنساني عمره أكثر من 1200 عام' : 'Over 1,200 Years of Living Craft Heritage'}
          </span>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-white">
            {isAr ? 'قصة معلّمي وصنّاع فاس العتيقة' : 'Preserving the Guilds & Crafts of Fez'}
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            {isAr
              ? 'تعد فاس البالي أكبر مجمع حرفي تراثي حي في العالم وموقعاً مصنفاً ضمن التراث العالمي لليونسكو منذ عام 1981. تهدف هذه المنصة لربط الحرفيين المحليين بالتكنولوجيا الحديثة لتتبع المخزون اللحظي وتوثيق مبيعات الصنعة المغربية الأصيلة.'
              : 'Fes el-Bali is the world\'s largest intact medieval city and living craft ecosystem, UNESCO-recognized since 1981. This platform empowers Maâlems with real-time stock tracking, fair trade access, and digital sales records.'}
          </p>
        </div>
      </div>

      {/* Craft Quarters Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-stone-900">
            {isAr ? 'ساحة الصفارين والنحاسيات' : 'Place Seffarine · Copper & Brass'}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {isAr
              ? 'تصدح مطارق صناع النحاس في أرجاء ساحة الصفارين المجاورة لمكتبة القرويين، حيث تتشكل صواني الشاي الملكية والفوانيس الساحرة بأيدي معلمي الصنعة.'
              : 'Echoing with rhythmic hammering beside the legendary Kairaouine library, master coppersmiths shape intricate brass lanterns and tea kettles using ancient geometric chisels.'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-stone-900">
            {isAr ? 'دار الدباغ شوارة والجلود' : 'Chouara Tannery · Heritage Leather'}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {isAr
              ? 'أحواض حجرية دائرية تعود للقرن الحادي عشر، تصبغ فيها جلود الماعز والأبقار بصبغات نباتية طبيعية كالزعفران والخشخاش وخشب الأرز.'
              : 'Stone pits dating to the 11th century cure leather using 100% natural organic dyes: saffron yellow, poppy crimson, and cedar wood ash.'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-stone-900">
            {isAr ? 'عين نقبي والزليج الأزرق' : 'Ain Nokbi · Fez Blue & Zellige'}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {isAr
              ? 'صلصال فاس الرمادي الفريد يتحول في أفران نوى الزيتون إلى خزف أزرق أسطوري وقطع زليج هندسية تقطع يدوياً بالمنقاش الحاد.'
              : 'Grey clay sourced from Fez hills is kiln-fired with olive pits into iconic cobalt ceramics and hand-chiselled zellige mosaics.'}
          </p>
        </div>
      </div>

      {/* Impact Numbers */}
      <div className="bg-stone-900 text-white p-8 rounded-2xl shadow-md">
        <h2 className="font-display text-xl font-bold text-center mb-8 text-amber-400">
          {isAr ? 'الأثر التنموي في مدينة فاس' : 'Economic Impact on Fez Artisanship'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="font-display text-3xl font-bold text-white tabular-nums">40,000+</div>
            <div className="text-xs text-stone-400 mt-1">{isAr ? 'صانع تقليدي بفاس' : 'Artisans in Fez'}</div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-white tabular-nums">11th c.</div>
            <div className="text-xs text-stone-400 mt-1">{isAr ? 'تاريخ أقدم مدبغة حية' : 'Oldest Working Tannery'}</div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-white tabular-nums">100%</div>
            <div className="text-xs text-stone-400 mt-1">{isAr ? 'صناعة يدوية حقيقية' : 'Handcrafted Materials'}</div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-white tabular-nums">0%</div>
            <div className="text-xs text-stone-400 mt-1">{isAr ? 'وساطة تجارية غير عادلة' : 'Unfair Middlemen'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
