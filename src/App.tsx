import { useState, useMemo, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, ChevronRight, Star, Globe , TikTok} from 'lucide-react';
import { PRODUCTS } from './constants';
import { Product } from './types';
import { TRANSLATIONS, Language } from './translations';
import { MOROCCAN_CITIES } from './cities';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [currentSize, setCurrentSize] = useState<string>(PRODUCTS[0].sizes[1]);
  const [currentColor, setCurrentColor] = useState<string>(PRODUCTS[0].colors[0].name);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  });

  const t = TRANSLATIONS[language];

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = language;
  }, [language, t.dir]);

  // Single product store, no filtering needed

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // FormSubmit.co expects a standard form POST or JSON
      const response = await fetch("https://formsubmit.co/ajax/46311283f96a8dcc27a516e077da8e14", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          Product_Name: PRODUCTS[0].name,
          Selected_Size: currentSize,
          Selected_Color: currentColor,
          Total_Price: `${PRODUCTS[0].price} MAD`,
          _subject: `New Order: ${PRODUCTS[0].name} - ${formData.name}`, // Email subject line
          _template: 'table' // FormSubmit will format the email as a clean table
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsOrderSuccess(true);
        setTimeout(() => {
          setIsOrderSuccess(false);
          setIsCheckoutOpen(false);
          setFormData({ name: '', phone: '', address: '', city: '' });
        }, 3000);
      } else {
        setSubmitError(language === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Checkout Error:', error);
      setSubmitError(language === 'ar' ? 'حدث خطأ في الاتصال.' : 'Error connecting to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] font-sans selection:bg-pink-500 selection:text-white" dir={t.dir}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center relative py-2">
          <div className="flex items-center gap-12 absolute left-6">
            {/* Logo removed as per request */}
          </div>
          <div className="flex items-center justify-center h-full">
            <img 
              src="/Soukaina-4-removebg-preview.jpg" 
              alt="JustQueen Logo" 
              className="h-20 w-auto object-contain hover:opacity-80 transition-opacity cursor-pointer"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex items-center gap-4 md:gap-6 absolute right-6">
          </div>
        </div>
      </nav>

      <main className="pt-28 md:pt-40 overflow-x-hidden">
        {/* Hero Section removed as per request */}

        {/* Product Grid - Simplified for Single Product */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Product Image Gallery */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <img 
                  src={PRODUCTS[0].colors.find(c => c.name === currentColor)?.image || PRODUCTS[0].image} 
                  alt={PRODUCTS[0].name} 
                  className="w-full h-full object-cover transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="grid grid-cols-5 gap-4">
                {PRODUCTS[0].colors.map((color, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setCurrentColor(color.name);
                    }}
                    className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:border-gray-300 transition-all"
                  >
                    <img src={color.image} alt={color.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`flex flex-col ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                {t.products.title}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">{PRODUCTS[0].name}</h1>
              <p className="text-gray-500 leading-relaxed mb-8 text-lg">
                {PRODUCTS[0].description}
              </p>

              {/* Size Selection */}
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-400">{t.products.size}</p>
                <div className="flex flex-wrap gap-3">
                  {PRODUCTS[0].sizes.map(size => (
                    <button
                      key={size}
                      disabled={size === 'XS'}
                      onClick={() => setCurrentSize(size)}
                      className={`min-w-[56px] h-14 flex items-center justify-center rounded-2xl border-2 font-bold text-sm transition-all ${
                        currentSize === size 
                          ? 'bg-pink-500 text-white border-pink-500 shadow-lg' 
                          : size === 'XS'
                            ? 'bg-gray-50 text-gray-200 border-gray-50 cursor-not-allowed'
                            : 'bg-white text-gray-400 border-gray-100 hover:border-pink-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-10">
                <p className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-400">{t.products.color}</p>
                <div className="flex flex-wrap gap-6">
                  {PRODUCTS[0].colors.map(color => (
                    <div key={color.name} className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => setCurrentColor(color.name)}
                        className={`w-12 h-12 rounded-full border-2 transition-all p-0.5 ${
                          currentColor === color.name 
                            ? 'border-pink-500 scale-110' 
                            : 'border-transparent hover:scale-105'
                        }`}
                        title={color.name}
                      >
                        <div 
                          className="w-full h-full rounded-full border border-black/5" 
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                      <span className={`text-xs font-bold ${currentColor === color.name ? 'text-pink-500' : 'text-gray-500'}`}>
                        {color.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-pink-500 text-white py-6 rounded-full font-bold text-lg hover:bg-pink-600 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98]"
              >
                {t.cart.checkout} — {PRODUCTS[0].price} درهم
              </button>


            </motion.div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-[#1A1A1A] text-white py-24">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{t.newsletter.title}</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
              {t.newsletter.description}
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t.newsletter.placeholder}
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              />
              <button className="bg-pink-500 text-white px-8 py-4 rounded-full font-bold hover:bg-pink-600 transition-all">
                {t.newsletter.button}
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className={`col-span-1 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <a href="#" className="mb-6 block">
              <img 
                src="/Soukaina-4-removebg-preview.jpg" 
                alt="JustQueen Logo" 
                className="h-12 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </a>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t.footer.description}
            </p>
          </div>
          <div className={t.dir === 'rtl' ? 'text-right' : 'text-left'}>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">
              {t.footer.connect}
            </h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>
                <a 
                  href="https://www.instagram.com/just_queenstore?igsh=NWs0MG9lODZ1Z3c5&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 hover:text-pink-500 transition-colors ${t.dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                >
                  <Instagram className="w-5 h-5" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.tiktok.com/@justqueenstore?_r=1&_t=ZS-95YoSXttzEa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 hover:text-pink-500 transition-colors ${t.dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                >
                  <Music2 className="w-5 h-5" />
                  <span>TikTok</span>
                </a>
              </li>
            </ul>
          </div>        
        </div>
  {/*
        <div className={`max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 ${t.dir === 'rtl' ? 'md:flex-row-reverse' : ''}`}>
          <p>{t.footer.rights}</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-pink-500">{t.footer.privacy}</a>
            <a href="#" className="hover:text-pink-500">{t.footer.terms}</a>
          </div> 
        </div>
              */}

      </footer>

      {/* Checkout Drawer/Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isOrderSuccess && setIsCheckoutOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 w-[95%] max-w-lg bg-white z-[70] shadow-2xl flex flex-col rounded-[2rem] overflow-hidden max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${t.dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  {t.cart.checkout}
                </h2>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {isOrderSuccess ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                      <Star className="w-10 h-10 text-green-500 fill-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{t.checkoutForm.success}</h3>
                    <p className="text-gray-500">{t.checkoutForm.deliveryMessage}</p>
                  </div>
                ) : (
                  <form onSubmit={handleCheckout} className="space-y-6">
                    <div className={`flex gap-4 mb-8 p-4 bg-gray-50 rounded-2xl ${t.dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img 
                          src={PRODUCTS[0].colors.find(c => c.name === currentColor)?.image || PRODUCTS[0].image} 
                          alt={PRODUCTS[0].name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className={`flex-1 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <h4 className="font-bold text-sm">{PRODUCTS[0].name}</h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {currentSize} • {currentColor}
                        </p>
                        <p className="font-bold text-sm mt-2">{PRODUCTS[0].price} درهم</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                          {t.checkoutForm.name}
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                          {t.checkoutForm.phone}
                        </label>
                        <input
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                          {t.checkoutForm.address}
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className={`w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all resize-none ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                          {t.checkoutForm.city}
                        </label>
                        <select
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className={`w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all appearance-none ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}
                        >
                          <option value="">اختر المدينة</option>
                          {MOROCCAN_CITIES.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 space-y-4">
                      {submitError && (
                        <p className="text-red-500 text-sm text-center font-bold">
                          {submitError}
                        </p>
                      )}
                      <div className={`flex justify-between text-lg font-bold ${t.dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <span>{t.cart.total}</span>
                        <span>{PRODUCTS[0].price} درهم</span>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-pink-500 text-white py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-pink-600'
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          t.checkoutForm.submit
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
