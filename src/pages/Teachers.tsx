import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';

export default function Teachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ full_name: '', phone: '', account_status: '' });

  const fetchTeachers = async () => {
	setIsLoading(true);
	// جلب البيانات من جدول profiles مباشرة (بدون workspace_id لأنه غير موجود في الـ Schema)
	const { data, error } = await supabase
	  .from('profiles')
	  .select('*')
	  .order('updated_at', { ascending: false });

	if (!error && data) setTeachers(data);
	setIsLoading(false);
  };

  useEffect(() => {
	fetchTeachers();
  }, []);

  const openEditModal = (teacher: any) => {
	setEditingId(teacher.id);
	setFormData({
	  full_name: teacher.full_name || '',
	  phone: teacher.phone || '',
	  account_status: teacher.account_status || 'pending'
	});
	setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
	e.preventDefault();
	if (!editingId) return;

	await supabase.from('profiles').update({
	  full_name: formData.full_name,
	  phone: formData.phone,
	  account_status: formData.account_status,
	  updated_at: new Date().toISOString()
	}).eq('id', editingId);

	setIsModalOpen(false);
	fetchTeachers();
  };

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '24px' },
	title: { fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 8px 0' },
	subtitle: { fontSize: '0.85rem', color: '#6b7280', margin: 0 },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px' },
	th: { padding: '16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#374151', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' },
	td: { padding: '16px', borderBottom: '1px solid #e5e7eb', color: '#111827', fontSize: '0.9rem', fontWeight: 600 },
	btnPrimary: { backgroundColor: '#064e3b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' },
	btnEdit: { backgroundColor: 'transparent', color: '#059669', border: '1px solid #059669', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 },
	modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
	modalContent: { backgroundColor: '#fff', padding: '32px', borderRadius: '8px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
	inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
	label: { fontSize: '0.85rem', fontWeight: 700, color: '#374151' },
	input: { padding: '12px', borderRadius: '4px', border: '1px solid #d1d5db', fontFamily: 'inherit', outline: 'none' }
  };

  return (
	<div>
	  <div style={styles.header}>
		<div>
		  <h2 style={styles.title}>إدارة المعلمين والكادر</h2>
		  <p style={styles.subtitle}>سجل المستخدمين المسجلين في النظام وصلاحياتهم</p>
		</div>
	  </div>

	  {isLoading ? <p style={{ color: '#6b7280' }}>جاري تحميل البيانات...</p> : (
		<table style={styles.table}>
		  <thead>
			<tr>
			  <th style={styles.th}>الاسم الكامل</th>
			  <th style={styles.th}>البريد الإلكتروني</th>
			  <th style={styles.th}>رقم الجوال</th>
			  <th style={styles.th}>حالة الحساب</th>
			  <th style={styles.th}>إجراءات</th>
			</tr>
		  </thead>
		  <tbody>
			{teachers.map(t => (
			  <tr key={t.id}>
				<td style={styles.td}>{t.full_name}</td>
				<td style={{ ...styles.td, color: '#6b7280', fontFamily: 'monospace' }} dir="ltr">{t.email}</td>
				<td style={{ ...styles.td, fontFamily: 'monospace' }} dir="ltr">{t.phone || '—'}</td>
				<td style={styles.td}>
				  <span style={{ 
					padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800,
					backgroundColor: t.account_status === 'active' ? '#dcfce7' : '#f3f4f6', 
					color: t.account_status === 'active' ? '#065f46' : '#4b5563' 
				  }}>
					{t.account_status}
				  </span>
				</td>
				<td style={styles.td}>
				  <button style={styles.btnEdit} onClick={() => openEditModal(t)}>تعديل</button>
				</td>
			  </tr>
			))}
			{teachers.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>لا يوجد معلمين مسجلين.</td></tr>}
		  </tbody>
		</table>
	  )}

	  {isModalOpen && (
		<div style={styles.modalOverlay}>
		  <div style={styles.modalContent}>
			<h3 style={{ margin: '0 0 24px 0', fontWeight: 800, fontSize: '1.2rem', color: '#111827' }}>تعديل بيانات المعلم</h3>
			<form onSubmit={handleSave}>
			  <div style={styles.inputGroup}>
				<label style={styles.label}>الاسم الكامل</label>
				<input required style={styles.input} value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
			  </div>
			  <div style={styles.inputGroup}>
				<label style={styles.label}>رقم الجوال</label>
				<input style={styles.input} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
			  </div>
			  <div style={styles.inputGroup}>
				<label style={styles.label}>حالة الحساب</label>
				<select style={styles.input} value={formData.account_status} onChange={e => setFormData({...formData, account_status: e.target.value})}>
				  <option value="active">نشط (Active)</option>
				  <option value="pending">قيد المراجعة (Pending)</option>
				  <option value="suspended">موقوف (Suspended)</option>
				</select>
			  </div>
			  <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
				<button type="submit" style={{ ...styles.btnPrimary, flex: 1, justifyContent: 'center' }}>حفظ التعديلات</button>
				<button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontWeight: 700 }}>إلغاء</button>
			  </div>
			</form>
		  </div>
		</div>
	  )}
	</div>
  );
}