import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';

export default function FinancialDonations() {
  const [donations, setDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
	date: new Date().toISOString().split('T')[0],
	amount: '',
	category: 'تبرع عام',
	description: ''
  });

  const fetchDonations = async () => {
	setIsLoading(true);
	const { data } = await supabase
	  .from('financials')
	  .select('*')
	  .eq('type', 'إيراد')
	  .order('date', { ascending: false });
	  
	if (data) setDonations(data);
	setIsLoading(false);
  };

  useEffect(() => { fetchDonations(); }, []);

  const openCreateModal = () => {
	setEditingId(null);
	setFormData({ date: new Date().toISOString().split('T')[0], amount: '', category: 'تبرع عام', description: '' });
	setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
	setEditingId(item.id);
	setFormData({
	  date: item.date || '', amount: item.amount ? item.amount.toString() : '',
	  category: item.category || 'تبرع عام', description: item.description || ''
	});
	setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
	e.preventDefault();
	const payload = {
	  type: 'إيراد',
	  date: formData.date,
	  amount: parseFloat(formData.amount),
	  category: formData.category,
	  description: formData.description
	};

	if (editingId) {
	  await supabase.from('financials').update(payload).eq('id', editingId);
	} else {
	  await supabase.from('financials').insert([payload]);
	}
	setIsModalOpen(false);
	fetchDonations();
  };

  const handleDelete = async (id: string) => {
	if (!window.confirm('تأكيد حذف هذا الإيراد؟')) return;
	await supabase.from('financials').delete().eq('id', id);
	fetchDonations();
  };

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '24px' },
	title: { fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 8px 0' },
	subtitle: { fontSize: '0.85rem', color: '#6b7280', margin: 0 },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px' },
	th: { padding: '14px 16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#374151', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' },
	td: { padding: '14px 16px', borderBottom: '1px solid #e5e7eb', color: '#111827', fontSize: '0.9rem', fontWeight: 600 },
	btnPrimary: { backgroundColor: '#064e3b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' },
	btnEdit: { background: 'none', border: 'none', color: '#059669', cursor: 'pointer', fontWeight: 800 },
	btnDelete: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 800 },
	modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
	modalContent: { backgroundColor: '#fff', padding: '32px', borderRadius: '8px', width: '100%', maxWidth: '500px' },
	inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
	label: { fontSize: '0.8rem', fontWeight: 800, color: '#374151' },
	input: { padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db', fontFamily: 'inherit', outline: 'none' }
  };

  return (
	<div>
	  <div style={styles.header}>
		<div><h2 style={styles.title}>سجل الإيرادات والتبرعات</h2><p style={styles.subtitle}>تسجيل وتتبع التدفقات النقدية الداخلة للصندوق</p></div>
		<button style={styles.btnPrimary} onClick={openCreateModal}><Icon name="plus" size={16} /> سند قبض جديد</button>
	  </div>
	  {isLoading ? <p>جاري التحميل...</p> : (
		<table style={styles.table}>
		  <thead>
			<tr><th style={styles.th}>التاريخ</th><th style={styles.th}>التصنيف</th><th style={styles.th}>البيان</th><th style={styles.th}>المبلغ (ر.س)</th><th style={styles.th}>إجراءات</th></tr>
		  </thead>
		  <tbody>
			{donations.map(d => (
			  <tr key={d.id}>
				<td style={{...styles.td, color: '#6b7280'}}>{d.date}</td>
				<td style={styles.td}>{d.category}</td>
				<td style={styles.td}>{d.description || '—'}</td>
				<td style={{...styles.td, color: '#059669', fontWeight: 900}}>{Number(d.amount).toLocaleString()}</td>
				<td style={styles.td}>
				  <div style={{display: 'flex', gap: '12px'}}>
					<button style={styles.btnEdit} onClick={() => openEditModal(d)}>تعديل</button>
					<button style={styles.btnDelete} onClick={() => handleDelete(d.id)}>حذف</button>
				  </div>
				</td>
			  </tr>
			))}
			{donations.length === 0 && <tr><td colSpan={5} style={{textAlign: 'center', padding: '24px', color: '#6b7280'}}>لا توجد سجلات.</td></tr>}
		  </tbody>
		</table>
	  )}
	  
	  {/* Modal */}
	  {isModalOpen && (
		<div style={styles.modalOverlay}>
		  <div style={styles.modalContent}>
			<h3 style={{ margin: '0 0 24px 0', fontWeight: 800 }}>{editingId ? 'تعديل السند' : 'إصدار سند قبض (إيراد)'}</h3>
			<form onSubmit={handleSave}>
			  <div style={{ display: 'flex', gap: '16px' }}>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>المبلغ (ر.س)</label>
				  <input type="number" required style={styles.input} value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
				</div>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>التاريخ</label>
				  <input type="date" required style={styles.input} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
				</div>
			  </div>
			  <div style={styles.inputGroup}>
				<label style={styles.label}>التصنيف</label>
				<select style={styles.input} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
				  <option>تبرع عام</option><option>كفالة طالب</option><option>كفالة حلقة</option><option>زكاة</option><option>أخرى</option>
				</select>
			  </div>
			  <div style={styles.inputGroup}>
				<label style={styles.label}>البيان (التفاصيل)</label>
				<input required style={styles.input} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
			  </div>
			  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
				<button type="submit" style={{ ...styles.btnPrimary, flex: 1, justifyContent: 'center' }}>حفظ السجل</button>
				<button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontWeight: 700 }}>إلغاء</button>
			  </div>
			</form>
		  </div>
		</div>
	  )}
	</div>
  );
}