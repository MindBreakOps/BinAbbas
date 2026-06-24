import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  account_status: string;
  updated_at: string;
  sec_q1: string;
  sec_a1: string;
  sec_q2: string;
  sec_a2: string;
  sec_q3: string;
  sec_a3: string;
}

const theme = {
  darkGreen: '#064e3b',
  gold: '#d97706',
  cream: '#fffdf7',
  white: '#ffffff',
  textDark: '#111827',
  textGray: '#4b5563',
  borderLight: '#e5e7eb',
  borderGold: 'rgba(217, 119, 6, 0.3)',
};

export default function SettingsAccounts() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // States for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
	full_name: '', phone: '', account_status: 'pending',
	sec_q1: '', sec_a1: '', sec_q2: '', sec_a2: '', sec_q3: '', sec_a3: ''
  });

  const fetchProfiles = async () => {
	setIsLoading(true);
	// جلب كافة البيانات من الجدول بما فيها أسئلة الأمان والجوال
	const { data, error } = await supabase
	  .from('profiles')
	  .select('id, full_name, email, phone, account_status, updated_at, sec_q1, sec_a1, sec_q2, sec_a2, sec_q3, sec_a3')
	  .order('updated_at', { ascending: false });

	if (!error && data) setProfiles(data);
	setIsLoading(false);
  };

  useEffect(() => {
	fetchProfiles();
  }, []);

  const openEditModal = (p: Profile) => {
	setEditingId(p.id);
	setFormData({
	  full_name: p.full_name || '',
	  phone: p.phone || '',
	  account_status: p.account_status || 'pending',
	  sec_q1: p.sec_q1 || '', sec_a1: p.sec_a1 || '',
	  sec_q2: p.sec_q2 || '', sec_a2: p.sec_a2 || '',
	  sec_q3: p.sec_q3 || '', sec_a3: p.sec_a3 || ''
	});
	setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
	e.preventDefault();
	if (!editingId) return;

	const payload = {
	  full_name: formData.full_name,
	  phone: formData.phone,
	  account_status: formData.account_status,
	  sec_q1: formData.sec_q1, sec_a1: formData.sec_a1,
	  sec_q2: formData.sec_q2, sec_a2: formData.sec_a2,
	  sec_q3: formData.sec_q3, sec_a3: formData.sec_a3,
	  updated_at: new Date().toISOString()
	};

	await supabase.from('profiles').update(payload).eq('id', editingId);
	
	setIsModalOpen(false);
	fetchProfiles();
  };

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: `2px solid ${theme.borderLight}`, paddingBottom: '24px' },
	titleArea: { margin: 0 },
	title: { fontSize: '1.6rem', fontWeight: 900, color: theme.darkGreen, margin: '0 0 8px 0' },
	subtitle: { fontSize: '0.95rem', color: theme.textGray, margin: 0, fontFamily: 'system-ui, sans-serif' },
	card: { backgroundColor: theme.white, border: `1px solid ${theme.borderGold}`, borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderTop: `4px solid ${theme.darkGreen}` },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
	th: { backgroundColor: theme.cream, color: theme.textDark, fontWeight: 900, fontSize: '0.85rem', padding: '16px', borderBottom: `1px solid ${theme.borderGold}`, textTransform: 'uppercase' },
	td: { padding: '16px', borderBottom: `1px solid ${theme.borderLight}`, color: theme.textDark, fontSize: '0.95rem', fontWeight: 600 },
	badge: { padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.5px' },
	btnEdit: { background: 'none', border: `1px solid ${theme.gold}`, color: theme.gold, padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem' },
	
	// ستايل النافذة المنبثقة
	modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 78, 59, 0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
	modalContent: { backgroundColor: theme.cream, padding: '0', borderRadius: '4px', width: '100%', maxWidth: '750px', border: `2px solid ${theme.gold}`, maxHeight: '90vh', overflowY: 'auto' },
	modalHeader: { backgroundColor: theme.white, padding: '24px', borderBottom: `1px solid ${theme.borderGold}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
	modalBody: { padding: '24px' },
	sectionTitle: { fontSize: '1.1rem', fontWeight: 900, color: theme.darkGreen, marginBottom: '16px', borderBottom: `1px dashed ${theme.gold}`, paddingBottom: '8px' },
	inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
	label: { fontSize: '0.85rem', fontWeight: 800, color: theme.textDark },
	input: { padding: '12px', borderRadius: '4px', border: `1px solid ${theme.borderLight}`, fontFamily: 'system-ui, sans-serif', outline: 'none', backgroundColor: theme.white },
	btnPrimary: { backgroundColor: theme.darkGreen, color: theme.cream, border: `1px solid ${theme.gold}`, padding: '12px 24px', borderRadius: '4px', fontWeight: 900, cursor: 'pointer', flex: 1 },
	btnCancel: { backgroundColor: theme.white, color: theme.textGray, border: `1px solid ${theme.borderLight}`, padding: '12px 24px', borderRadius: '4px', fontWeight: 800, cursor: 'pointer' }
  };

  return (
	<div>
	  <div style={styles.header}>
		<div style={styles.titleArea}>
		  <h2 style={styles.title}>الحسابات والصلاحيات</h2>
		  <p style={styles.subtitle}>إدارة المستخدمين، البيانات، وتحديث أسئلة الأمان</p>
		</div>
		<div style={{ backgroundColor: theme.cream, border: `1px solid ${theme.borderGold}`, padding: '10px 16px', borderRadius: '4px', color: theme.gold, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
		  <Icon name="users" size={18} />
		  <span>إجمالي الحسابات: {profiles.length}</span>
		</div>
	  </div>

	  <div style={styles.card}>
		{isLoading ? (
		  <p style={{ padding: '32px', textAlign: 'center', color: theme.textGray, fontWeight: 600 }}>جاري مزامنة الحسابات والمعلومات...</p>
		) : (
		  <table style={styles.table}>
			<thead>
			  <tr>
				<th style={styles.th}>الاسم الكامل</th>
				<th style={styles.th}>الجوال</th>
				<th style={styles.th}>تاريخ التحديث</th>
				<th style={styles.th}>حالة الحساب</th>
				<th style={styles.th}>إجراءات</th>
			  </tr>
			</thead>
			<tbody>
			  {profiles.map(p => (
				<tr key={p.id}>
				  <td style={{ ...styles.td, fontWeight: 900, color: theme.darkGreen }}>
					{p.full_name || 'غير محدد'}
					<div style={{ fontSize: '0.8rem', color: theme.textGray, fontFamily: 'monospace', marginTop: '4px' }}>{p.email}</div>
				  </td>
				  <td style={{ ...styles.td, fontFamily: 'monospace', color: theme.textGray }} dir="ltr">{p.phone || '—'}</td>
				  <td style={{ ...styles.td, color: theme.textGray, fontSize: '0.85rem' }}>{p.updated_at ? new Date(p.updated_at).toLocaleDateString('ar-SA') : '—'}</td>
				  <td style={styles.td}>
					<span style={{ 
					  ...styles.badge, 
					  backgroundColor: p.account_status === 'active' ? '#ecfdf5' : '#fef3c7', 
					  color: p.account_status === 'active' ? '#065f46' : '#92400e',
					  border: `1px solid ${p.account_status === 'active' ? '#a7f3d0' : '#fcd34d'}`
					}}>
					  {p.account_status === 'active' ? 'نشط' : (p.account_status || 'قيد الانتظار')}
					</span>
				  </td>
				  <td style={styles.td}>
					<button style={styles.btnEdit} onClick={() => openEditModal(p)}>عرض وتعديل</button>
				  </td>
				</tr>
			  ))}
			  {profiles.length === 0 && (
				<tr><td colSpan={5} style={{ ...styles.td, textAlign: 'center', color: theme.textGray }}>لا توجد حسابات مسجلة في النظام.</td></tr>
			  )}
			</tbody>
		  </table>
		)}
	  </div>

	  {/* نافذة التعديل المنبثقة (تشمل أسئلة الأمان) */}
	  {isModalOpen && (
		<div style={styles.modalOverlay}>
		  <div style={styles.modalContent} className="custom-scrollbar">
			<div style={styles.modalHeader}>
			  <h3 style={{ margin: 0, fontWeight: 900, color: theme.darkGreen, fontSize: '1.3rem' }}>الملف الشخصي وإعدادات الأمان</h3>
			</div>
			
			<form onSubmit={handleSave} style={styles.modalBody}>
			  {/* القسم الأول: البيانات الأساسية */}
			  <h4 style={styles.sectionTitle}>البيانات الأساسية</h4>
			  <div style={{ display: 'flex', gap: '16px' }}>
				<div style={{ ...styles.inputGroup, flex: 2 }}>
				  <label style={styles.label}>الاسم الكامل</label>
				  <input required style={styles.input} value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
				</div>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>رقم الجوال</label>
				  <input style={styles.input} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} dir="ltr" />
				</div>
			  </div>
			  <div style={{ ...styles.inputGroup, width: '50%' }}>
				<label style={styles.label}>حالة الحساب</label>
				<select style={styles.input} value={formData.account_status} onChange={e => setFormData({...formData, account_status: e.target.value})}>
				  <option value="active">نشط (Active)</option>
				  <option value="pending">قيد المراجعة (Pending)</option>
				  <option value="suspended">موقوف (Suspended)</option>
				</select>
			  </div>

			  {/* القسم الثاني: أسئلة الأمان */}
			  <h4 style={{ ...styles.sectionTitle, marginTop: '32px' }}>أسئلة الأمان (Security Questions)</h4>
			  
			  <div style={{ backgroundColor: theme.white, padding: '16px', borderRadius: '4px', border: `1px solid ${theme.borderLight}`, marginBottom: '16px' }}>
				<div style={{ display: 'flex', gap: '16px' }}>
				  <div style={{ ...styles.inputGroup, flex: 1 }}>
					<label style={styles.label}>سؤال الأمان الأول</label>
					<input placeholder="مثال: ما هو اسم مدرستك الابتدائية؟" style={styles.input} value={formData.sec_q1} onChange={e => setFormData({...formData, sec_q1: e.target.value})} />
				  </div>
				  <div style={{ ...styles.inputGroup, flex: 1 }}>
					<label style={styles.label}>الإجابة</label>
					<input style={styles.input} value={formData.sec_a1} onChange={e => setFormData({...formData, sec_a1: e.target.value})} />
				  </div>
				</div>
			  </div>

			  <div style={{ backgroundColor: theme.white, padding: '16px', borderRadius: '4px', border: `1px solid ${theme.borderLight}`, marginBottom: '16px' }}>
				<div style={{ display: 'flex', gap: '16px' }}>
				  <div style={{ ...styles.inputGroup, flex: 1 }}>
					<label style={styles.label}>سؤال الأمان الثاني</label>
					<input placeholder="مثال: في أي مدينة ولد والدك؟" style={styles.input} value={formData.sec_q2} onChange={e => setFormData({...formData, sec_q2: e.target.value})} />
				  </div>
				  <div style={{ ...styles.inputGroup, flex: 1 }}>
					<label style={styles.label}>الإجابة</label>
					<input style={styles.input} value={formData.sec_a2} onChange={e => setFormData({...formData, sec_a2: e.target.value})} />
				  </div>
				</div>
			  </div>

			  <div style={{ backgroundColor: theme.white, padding: '16px', borderRadius: '4px', border: `1px solid ${theme.borderLight}` }}>
				<div style={{ display: 'flex', gap: '16px' }}>
				  <div style={{ ...styles.inputGroup, flex: 1 }}>
					<label style={styles.label}>سؤال الأمان الثالث</label>
					<input placeholder="مثال: ما هو اسم صديق طفولتك؟" style={styles.input} value={formData.sec_q3} onChange={e => setFormData({...formData, sec_q3: e.target.value})} />
				  </div>
				  <div style={{ ...styles.inputGroup, flex: 1 }}>
					<label style={styles.label}>الإجابة</label>
					<input style={styles.input} value={formData.sec_a3} onChange={e => setFormData({...formData, sec_a3: e.target.value})} />
				  </div>
				</div>
			  </div>
			  
			  {/* أزرار الحفظ والإلغاء */}
			  <div style={{ display: 'flex', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${theme.borderLight}` }}>
				<button type="submit" style={styles.btnPrimary}>حفظ التحديثات</button>
				<button type="button" onClick={() => setIsModalOpen(false)} style={styles.btnCancel}>إلغاء</button>
			  </div>
			</form>
		  </div>
		</div>
	  )}
	</div>
  );
}