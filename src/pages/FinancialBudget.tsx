import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';

export default function FinancialBudget() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], amount: '', category: 'اعتماد سنوي', description: '' });

  const fetchBudgets = async () => {
	setIsLoading(true);
	const { data } = await supabase.from('financials').select('*').eq('type', 'ميزانية').order('date', { ascending: false });
	if (data) setBudgets(data);
	setIsLoading(false);
  };

  useEffect(() => { fetchBudgets(); }, []);

  const openCreateModal = () => {
	setEditingId(null);
	setFormData({ date: new Date().toISOString().split('T')[0], amount: '', category: 'اعتماد سنوي', description: '' });
	setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
	setEditingId(item.id);
	setFormData({
	  date: item.date || '', amount: item.amount ? item.amount.toString() : '',
	  category: item.category || 'اعتماد سنوي', description: item.description || ''
	});
	setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
	e.preventDefault();
	const payload = { type: 'ميزانية', date: formData.date, amount: parseFloat(formData.amount), category: formData.category, description: formData.description };
	if (editingId) { await supabase.from('financials').update(payload).eq('id', editingId); } 
	else { await supabase.from('financials').insert([payload]); }
	setIsModalOpen(false);
	fetchBudgets();
  };

  const handleDelete = async (id: string) => {
	if (!window.confirm('تأكيد حذف هذا الاعتماد؟')) return;
	await supabase.from('financials').delete().eq('id', id);
	fetchBudgets();
  };

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '24px' },
	title: { fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 8px 0' },
	subtitle: { fontSize: '0.85rem', color: '#6b7280', margin: 0 },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px' },
	th: { padding: '14px 16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#374151', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' },
	td: { padding: '14px 16px', borderBottom: '1px solid #e5e7eb', color: '#111827', fontSize: '0.9rem', fontWeight: 600 },
	btnPrimary: { backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 800, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' },
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
		<div><h2 style={styles.title}>الميزانية المعتمدة (الاعتمادات)</h2><p style={styles.subtitle}>تخطيط وإدارة الميزانيات السنوية والمخصصة</p></div>
		<button style={styles.btnPrimary} onClick={openCreateModal}><Icon name="plus" size={16} /> إضافة اعتماد مالي</button>
	  </div>
	  {isLoading ? <p>جاري التحميل...</p> : (
		<table style={styles.table}>
		  <thead>
			<tr><th style={styles.th}>التاريخ</th><th style={styles.th}>نوع الاعتماد</th><th style={styles.th}>البيان</th><th style={styles.th}>المبلغ المعتمد (ر.س)</th><th style={styles.th}>إجراءات</th></tr>
		  </thead>
		  <tbody>
			{budgets.map(b => (
			  <tr key={b.id}>
				<td style={{...styles.td, color: '#6b7280'}}>{b.date}</td>
				<td style={styles.td}>{b.category}</td>
				<td style={styles.td}>{b.description || '—'}</td>
				<td style={{...styles.td, color: '#b45309', fontWeight: 900}}>{Number(b.amount).toLocaleString()}</td>
				<td style={styles.td}>
				  <div style={{display: 'flex', gap: '12px'}}>
					<button style={styles.btnEdit} onClick={() => openEditModal(b)}>تعديل</button>
					<button style={styles.btnDelete} onClick={() => handleDelete(b.id)}>حذف</button>
				  </div>
				</td>
			  </tr>
			))}
			{budgets.length === 0 && <tr><td colSpan={5} style={{textAlign: 'center', padding: '24px', color: '#6b7280'}}>لا توجد ميزانيات معتمدة.</td></tr>}
		  </tbody>
		</table>
	  )}

	  {isModalOpen && (
		<div style={styles.modalOverlay}>
		  <div style={styles.modalContent}>
			<h3 style={{ margin: '0 0 24px 0', fontWeight: 800 }}>{editingId ? 'تعديل الاعتماد' : 'تسجيل اعتماد ميزانية جديد'}</h3>
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
				<label style={styles.label}>نوع الاعتماد</label>
				<select style={styles.input} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
				  <option>اعتماد سنوي</option><option>ميزانية تشغيلية</option><option>ميزانية طوارئ</option>
				</select>
			  </div>
			  <div style={styles.inputGroup}>
				<label style={styles.label}>البيان (التفاصيل)</label>
				<input required style={styles.input} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
			  </div>
			  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
				<button type="submit" style={{ ...styles.btnPrimary, flex: 1, justifyContent: 'center' }}>حفظ الميزانية</button>
				<button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontWeight: 700 }}>إلغاء</button>
			  </div>
			</form>
		  </div>
		</div>
	  )}
	</div>
  );
}