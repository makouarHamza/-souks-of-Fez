import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Shield, UserCheck, X, Check } from 'lucide-react';
import { AppUser, Seller } from '../types';

interface UsersManagerProps {
  users: AppUser[];
  sellers: Seller[];
  currentUser: AppUser;
  onAddUser: (user: Omit<AppUser, 'id'>) => void;
  onUpdateUser: (user: AppUser) => void;
  onDeleteUser: (userId: number) => void;
  lang: 'en' | 'ar';
}

export const UsersManager: React.FC<UsersManagerProps> = ({
  users,
  sellers,
  currentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  lang,
}) => {
  const isAr = lang === 'ar';

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [feedback, setFeedback] = useState('');

  // Form State matching manageUsers.php & register.php
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'admin' | 'moderator' | 'artisan'>('artisan');
  const [active, setActive] = useState(true);
  const [sellerId, setSellerId] = useState<number | undefined>(undefined);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setEmail('');
    setFirstName('');
    setLastName('');
    setRole('artisan');
    setActive(true);
    setSellerId(sellers[0]?.id);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (u: AppUser) => {
    setEditingUser(u);
    setEmail(u.email);
    setFirstName(u.first_name);
    setLastName(u.last_name);
    setRole(u.role);
    setActive(u.active);
    setSellerId(u.seller_id);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      onUpdateUser({
        ...editingUser,
        email,
        first_name: firstName,
        last_name: lastName,
        role,
        active,
        seller_id: role === 'artisan' ? sellerId : undefined,
      });
      setFeedback(isAr ? 'تم تعديل بيانات المستخدم بنجاح!' : 'User updated successfully!');
    } else {
      onAddUser({
        email,
        first_name: firstName,
        last_name: lastName,
        role,
        active,
        seller_id: role === 'artisan' ? sellerId : undefined,
      });
      setFeedback(isAr ? 'تم تسجيل المستخدم الجديد بنجاح!' : 'User registered successfully!');
    }

    setIsFormOpen(false);
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleDelete = (id: number) => {
    if (id === currentUser.id) {
      alert(isAr ? 'لا يمكنك حذف حسابك الحالي الذي تستخدمه الآن!' : 'You cannot delete your active logged-in account!');
      return;
    }
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذا المستخدم؟' : 'Are you sure you want to delete this user?')) {
      onDeleteUser(id);
      setFeedback(isAr ? 'تم حذف المستخدم' : 'User deleted');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header and Add User Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">
            {isAr ? 'إدارة المستخدمين وحسابات الحرفيين' : 'User Management & Artisan Access'}
          </h1>
          <p className="text-xs text-stone-500">
            {isAr 
              ? 'صلاحيات المشرفين، حسابات المعلمين الصناع، وحالة تفعيل الحسابات.' 
              : 'Configure admin guild overseers, moderator permissions, and artisan seller accounts.'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة مستخدم جديد' : 'Add New User'}</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Add / Edit Form Modal matching manageUsers.php & register.php */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-lg w-full p-6 my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h2 className="font-display text-lg font-bold text-stone-900">
                {editingUser 
                  ? (isAr ? 'تعديل بيانات الحساب' : 'Edit User Profile') 
                  : (isAr ? 'تسجيل حساب جديد' : 'Register New User')}
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
                  {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="artisan@fez-medina.ma"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'الاسم الشخصي *' : 'First Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Abdelilah"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'الاسم العائلي *' : 'Last Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="El-Fassi"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'الدور والصلاحية *' : 'Role *'}
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="artisan">Artisan / Seller</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin / Guild Overseer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'حالة الحساب *' : 'Status *'}
                  </label>
                  <select
                    value={active ? '1' : '0'}
                    onChange={(e) => setActive(e.target.value === '1')}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>

              {role === 'artisan' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'ربط الحساب بملف الصانع' : 'Link to Artisan Workshop Profile'}
                  </label>
                  <select
                    value={sellerId || ''}
                    onChange={(e) => setSellerId(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="">{isAr ? 'غير مرتبط بملف حالياً' : 'None / Freelance'}</option>
                    {sellers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.workshop_location})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-amber-700 hover:bg-amber-800 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  {editingUser ? (isAr ? 'حفظ' : 'Save') : (isAr ? 'تسجيل' : 'Register')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table matching manageUsers.php */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">{isAr ? 'المستخدم' : 'User'}</th>
                <th className="py-3 px-4">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="py-3 px-4">{isAr ? 'الدور' : 'Role'}</th>
                <th className="py-3 px-4">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-stone-400 tabular-nums">#{u.id}</td>
                  <td className="py-3 px-4 font-semibold text-stone-900">
                    {u.first_name} {u.last_name}
                    {u.id === currentUser.id && (
                      <span className="ml-2 text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {isAr ? 'الحالي' : 'You'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">{u.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-rose-100 text-rose-800'
                          : u.role === 'moderator'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold text-xs ${
                        u.active ? 'text-emerald-700' : 'text-stone-400'
                      }`}
                    >
                      {u.active ? (isAr ? 'مفعل' : 'Active') : (isAr ? 'معطل' : 'Inactive')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 rounded text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        disabled={u.id === currentUser.id}
                        className="p-1.5 rounded text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-20"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
