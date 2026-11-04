import React, { useState } from 'react';
import { X, MessageSquare, Send, Mail, User, Phone, CheckCircle, Clock } from 'lucide-react';
import { ContactMessage } from '../types';

interface ContactMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ContactMessage[];
  onSendMessage: (msg: Omit<ContactMessage, 'id' | 'created_at' | 'status'>) => void;
  lang: 'en' | 'ar';
}

export const ContactMessagesModal: React.FC<ContactMessagesModalProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !messageText) return;

    onSendMessage({
      sender_name: senderName,
      sender_email: senderEmail,
      sender_phone: senderPhone,
      message: messageText,
    });

    setSentSuccess(true);
    setSenderName('');
    setSenderEmail('');
    setSenderPhone('');
    setMessageText('');
    setTimeout(() => {
      setSentSuccess(false);
      setActiveTab('inbox');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-2xs overflow-y-auto">
      <div 
        dir={isAr ? 'rtl' : 'ltr'}
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-xl w-full p-6 my-auto animate-in fade-in zoom-in-95"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-700" />
            <h2 className="font-display text-lg font-bold text-stone-900">
              {isAr ? 'رسائل واستفسارات صناع فاس' : 'Artisan Inquiries & Trade Desk'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-2 p-1 bg-stone-100 rounded-lg mb-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'inbox' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {isAr ? `الوارد (${messages.length})` : `Inbox (${messages.length})`}
          </button>
          <button
            onClick={() => setActiveTab('compose')}
            className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'compose' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {isAr ? 'إرسال استفسار للصناع' : 'Send New Inquiry'}
          </button>
        </div>

        {activeTab === 'inbox' ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.id} className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900">{msg.sender_name}</span>
                    <span className="text-[10px] text-stone-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    <span>{msg.sender_email}</span>
                    {msg.sender_phone && <span> · {msg.sender_phone}</span>}
                  </div>
                  <p className="text-stone-700 bg-white p-2.5 rounded border border-stone-100 whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-stone-400">
                {isAr ? 'لا توجد رسائل واردة حالياً' : 'No incoming messages yet'}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {sentSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'تم إرسال رسالتك بنجاح لمعلمي الحرفة!' : 'Your message has been sent to the artisans!'}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isAr ? 'الاسم الكامل *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Marc Dufresne"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
                </label>
                <input
                  type="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isAr ? 'الهاتف / واتساب' : 'Phone / WhatsApp'}
                </label>
                <input
                  type="text"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="+212 6..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isAr ? 'نص الرسالة أو الاستفسار *' : 'Inquiry Message *'}
              </label>
              <textarea
                rows={4}
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={isAr ? 'طلب قطع مخصصة، استفسار عن الأسعار أو التوصيل...' : 'Ask about custom orders, wholesale brassware, delivery...'}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('inbox')}
                className="px-3 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-amber-700 hover:bg-amber-800 text-white rounded-lg cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isAr ? 'إرسال الرسالة' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
