import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';

export default function Teachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
	full_name: '', 
	phone: '', 
	specialization: '', 
	quran_parts: '', 
	account_status: '' 
  });

  const fetchTeachers = async () => {
	setIsLoading(true);
	// جلب البيانات من جدول profiles
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
	  specialization: teacher.specialization || '',
	  quran_parts: teacher.quran_parts || '',
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
	  specialization: formData.specialization,
	  quran_parts: formData.quran_parts,
	  account_status: formData.account_status,
	  updated_at: new Date().toISOString()
	}).eq('id', editingId);

	setIsModalOpen(false);
	fetchTeachers();
  };

  const theme = {
	primary: '#2A5D4E',
	secondary: '#B4783A',
	bg: '#F9FAFB',
	cardBg: '#FFFFFF',
	border: '#E5E7EB',
	textMain: '#111827',
	textMuted: '#6B7280'
  };

  const styles: { [key: string]: React.CSSProperties } = {
	container: { padding: '24px', direction: 'rtl', fontFamily: 'system-ui, sans-serif' },
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
	title: { fontSize: '1.8rem', fontWeight: 900, color: theme.primary, margin: 0 },
	card: { backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
	th: { padding: '18px 24px', backgroundColor: '#F9FAFB', color: theme.primary, fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', borderBottom: `2px solid ${theme.border}` },
	td: { padding: '16px 24px', borderBottom: `1px solid ${theme.border}`, color: theme.textMain, fontWeight: 700, fontSize: '0.9rem' },
	btnEdit: { backgroundColor: theme.primary, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, fontSize: '0.8rem' },
	modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
	modalContent: { backgroundColor: '#fff', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '450px' },
	inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
	input: { padding: '12px', borderRadius: '12px', border: `2px solid ${theme.border}`, outline: 'none', fontWeight: 600 }
  };

  return (
	<div style={styles.container}>
	  <div style={styles.header}>
		<h2 style={styles.title}>إدارة المعلمين والكادر</h2>
	  </div>

	  <div style={styles.card}>
		{isLoading ? <p style={{ padding: '40px', textAlign: 'center' }}>جاري التحميل...</p> : (
		  <table style={styles.table}>
			<thead>
			  <tr>
				<th style={styles.th}>الاسم الكامل</th>
				<th style={styles.th}>التخصص</th>
				<th style={styles.th}>أجزاء القرآن</th>
				<th style={styles.th}>رقم الجوال</th>
				<th style={styles.th}>الحالة</th>
				<th style={styles.th}>إجراءات</th>
			  </tr>
			</thead>
			<tbody>
			  {teachers.map(t => (
				<tr key={t.id}>
				  <td style={styles.td}>{t.full_name}</td>
				  <td style={styles.td}>{t.specialization || '—'}</td>
				  <td style={styles.td}>{t.quran_parts || '—'}</td>
				  <td style={styles.td}>{t.phone || '—'}</td>
				  <td style={styles.td}>
					<span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 900, backgroundColor: t.account_status === 'active' ? '#E0EFDF' : '#F3F4F6', color: theme.primary }}>
					  {t.account_status}
					</span>
				  </td>
				  <td style={styles.td}>
					<button style={styles.btnEdit} onClick={() => openEditModal(t)}>تعديل</button>
				  </td>
				</tr>
			  ))}
			</tbody>
		  </table>
		)}
	  </div>

	  {isModalOpen && (
		<div style={styles.modalOverlay}>
		  <div style={styles.modalContent}>
			<h3 style={{ marginBottom: '24px', fontWeight: 900 }}>تعديل بيانات المعلم</h3>
			<form onSubmit={handleSave}>
			  <div style={styles.inputGroup}>
				<label style={{ fontWeight: 800 }}>الاسم الكامل</label>
				<input style={styles.input} value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
			  </div>
			  <div style={styles.inputGroup}>
				<label style={{ fontWeight: 800 }}>التخصص</label>
				<input style={styles.input} value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} />
			  </div>
			  <div style={styles.inputGroup}>
				<label style={{ fontWeight: 800 }}>أجزاء القرآن</label>
				<input style={styles.input} value={formData.quran_parts} onChange={e => setFormData({...formData, quran_parts: e.target.value})} />
			  </div>
			  <div style={styles.inputGroup}>
				<label style={{ fontWeight: 800 }}>حالة الحساب</label>
				<select style={styles.input} value={formData.account_status} onChange={e => setFormData({...formData, account_status: e.target.value})}>
				  <option value="active">نشط</option>
				  <option value="pending">قيد المراجعة</option>
				</select>
			  </div>
			  <button type="submit" style={{ ...styles.btnEdit, width: '100%', marginTop: '16px', padding: '12px' }}>حفظ التعديلات</button>
			  <button type="button" onClick={() => setIsModalOpen(false)} style={{ width: '100%', marginTop: '8px', padding: '12px', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 800 }}>إلغاء</button>
			</form>
		  </div>
		</div>
	  )}
	</div>
  );
}