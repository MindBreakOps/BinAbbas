import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';

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

export default function Teachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
	id: '', full_name: '', phone: '', specialization: '', 
	quran_parts: '', age: '', marital_status: '', children: '', residence: ''
  });

  const fetchTeachers = async () => {
	setIsLoading(true);
	// جلب البيانات من جدول المعلمين مع الربط بجدول الحسابات الأساسي
	const { data, error } = await supabase
	  .from('teachers')
	  .select(`
		id, phone, specialization, quran_parts, age, marital_status, children, residence, hire_date,
		profiles ( full_name, email )
	  `);

	if (!error && data) {
	  // ترتيب البيانات بحيث تظهر الحسابات الأحدث أولاً أو أبجدياً
	  setTeachers(data);
	}
	setIsLoading(false);
  };

  useEffect(() => {
	fetchTeachers();
  }, []);

  // دالة مزامنة الحسابات (مأخوذة من النظام القديم)
  const syncExistingTeachers = async () => {
	setIsSyncing(true);
	// سحب الحسابات النشطة فقط
	const { data: profiles, error: pError } = await supabase
	  .from('profiles')
	  .select('id')
	  .in('account_status', ['active', 'approved']); 

	if (!pError && profiles && profiles.length > 0) {
	  const payload = profiles.map(p => ({ id: p.id }));
	  await supabase.from('teachers').upsert(payload, { onConflict: 'id' });
	  await fetchTeachers();
	}
	setIsSyncing(false);
  };

  const openEditModal = (t: any) => {
	// تجهيز البيانات للنافذة المنبثقة كما في التصميم القديم
	setFormData({
	  id: t.id,
	  full_name: t.profiles?.full_name || 'غير محدد',
	  phone: t.phone || '',
	  specialization: t.specialization || '',
	  quran_parts: t.quran_parts || '',
	  age: t.age ? t.age.toString() : '',
	  marital_status: t.marital_status || '',
	  children: t.children ? t.children.toString() : '',
	  residence: t.residence || ''
	});
	setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
	e.preventDefault();
	const payload = {
	  phone: formData.phone,
	  specialization: formData.specialization,
	  quran_parts: formData.quran_parts,
	  age: formData.age ? parseInt(formData.age) : null,
	  marital_status: formData.marital_status,
	  children: formData.children ? parseInt(formData.children) : null,
	  residence: formData.residence
	};

	await supabase.from('teachers').update(payload).eq('id', formData.id);
	setIsModalOpen(false);
	fetchTeachers();
  };

  const handlePrint = () => window.print();

  // تنسيق الشارات (Badges) بناءً على توفر البيانات
  const getBadgeStyle = (val: string, type: 'spec' | 'quran') => {
	const isEmpty = !val || val === 'لم يُحدد' || val === '-';
	if (isEmpty) return { bg: theme.cream, color: theme.textGray, border: theme.borderLight };
	if (type === 'spec') return { bg: '#ecfdf5', color: '#064e3b', border: '#a7f3d0' };
	return { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' };
  };

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', borderBottom: `2px solid ${theme.borderLight}`, paddingBottom: '24px' },
	titleGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
	title: { fontSize: '1.6rem', fontWeight: 900, color: theme.darkGreen, margin: 0 },
	subtitle: { fontSize: '0.95rem', color: theme.textGray, margin: 0 },
	actionsGroup: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
	
	// الأزرار العلوية مطابقة للصورة
	btnSync: { backgroundColor: theme.white, color: theme.textDark, border: `1px solid ${theme.borderLight}`, padding: '8px 16px', borderRadius: '4px', fontWeight: 800, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' },
	btnExcel: { backgroundColor: '#166534', color: theme.white, border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 800, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' },
	btnPrint: { backgroundColor: theme.white, color: theme.textDark, border: `1px solid ${theme.borderLight}`, padding: '8px 16px', borderRadius: '4px', fontWeight: 800, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' },
	
	// الجدول
	card: { backgroundColor: theme.white, border: `1px solid ${theme.borderGold}`, borderRadius: '4px', overflow: 'hidden', borderTop: `4px solid ${theme.darkGreen}` },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
	th: { backgroundColor: theme.cream, color: theme.textDark, fontWeight: 900, fontSize: '0.85rem', padding: '16px', borderBottom: `1px solid ${theme.borderGold}` },
	td: { padding: '16px', borderBottom: `1px solid ${theme.borderLight}`, color: theme.textDark, fontSize: '0.95rem', fontWeight: 600 },
	
	// زر "إكمال البيانات"
	btnEditData: { backgroundColor: theme.white, color: theme.textGray, border: `1px solid ${theme.borderLight}`, padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 800, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' },
	
	// النافذة المنبثقة
	modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 78, 59, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
	modalContent: { backgroundColor: theme.cream, padding: '32px', borderRadius: '4px', width: '100%', maxWidth: '600px', border: `2px solid ${theme.gold}` },
	modalTitle: { margin: '0 0 24px 0', fontWeight: 900, color: theme.textDark, fontSize: '1.2rem', textAlign: 'center' },
	formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
	inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
	label: { fontSize: '0.85rem', fontWeight: 900, color: theme.darkGreen },
	input: { padding: '10px', borderRadius: '4px', border: `1px solid ${theme.borderLight}`, fontFamily: 'system-ui, sans-serif', outline: 'none', backgroundColor: theme.white },
	inputReadonly: { padding: '10px', borderRadius: '4px', border: `1px solid ${theme.borderLight}`, backgroundColor: '#f3f4f6', color: theme.textGray, cursor: 'not-allowed', fontWeight: 800 }
  };

  return (
	<div>
	  <style>{`
		@media print {
		  body * { visibility: hidden; }
		  #printable-table, #printable-table * { visibility: visible; }
		  #printable-table { position: absolute; top: 0; left: 0; width: 100%; direction: rtl; }
		  .no-print { display: none !important; }
		}
	  `}</style>

	  <div className="no-print" style={styles.header}>
		<div style={styles.titleGroup}>
		  <h2 style={styles.title}>هيئة التدريس</h2>
		  <p style={styles.subtitle}>إدارة بيانات المعلمين التفصيلية</p>
		</div>
		<div style={styles.actionsGroup}>
		  <button style={styles.btnSync} onClick={syncExistingTeachers} disabled={isSyncing}>
			<Icon name="refresh" size={16} /> {isSyncing ? 'جاري المزامنة...' : 'مزامنة الحسابات'}
		  </button>
		  <button style={styles.btnExcel}>
			<Icon name="file" size={16} /> Excel
		  </button>
		  <button style={styles.btnPrint} onClick={handlePrint}>
			<Icon name="print" size={16} /> طباعة
		  </button>
		</div>
	  </div>

	  <div id="printable-table" style={styles.card}>
		{isLoading ? <p style={{ padding: '32px', textAlign: 'center', fontWeight: 800 }}>جاري التحميل...</p> : (
		  <table style={styles.table}>
			<thead>
			  <tr>
				<th style={styles.th}>#</th>
				<th style={styles.th}>الاسم</th>
				<th style={styles.th}>البريد الإلكتروني</th>
				<th style={styles.th}>رقم الهاتف</th>
				<th style={styles.th}>التخصص</th>
				<th style={styles.th}>مقدار الحفظ</th>
				<th className="no-print" style={styles.th}>تعديل الإضافيات</th>
			  </tr>
			</thead>
			<tbody>
			  {teachers.map((t, i) => {
				const specStyle = getBadgeStyle(t.specialization, 'spec');
				const quranStyle = getBadgeStyle(t.quran_parts, 'quran');
				
				return (
				  <tr key={t.id}>
					<td style={styles.td}>{i + 1}</td>
					<td style={{ ...styles.td, fontWeight: 900, color: theme.darkGreen }}>{t.profiles?.full_name || '-'}</td>
					<td style={{ ...styles.td, color: theme.textGray, fontFamily: 'monospace' }} dir="ltr">{t.profiles?.email || '-'}</td>
					<td style={{ ...styles.td, fontFamily: 'monospace' }} dir="ltr">{t.phone || '-'}</td>
					<td style={styles.td}>
					  <span style={{ backgroundColor: specStyle.bg, color: specStyle.color, border: `1px solid ${specStyle.border}`, padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
						{t.specialization || 'لم يُحدد'}
					  </span>
					</td>
					<td style={styles.td}>
					  <span style={{ backgroundColor: quranStyle.bg, color: quranStyle.color, border: `1px solid ${quranStyle.border}`, padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
						{t.quran_parts || '-'}
					  </span>
					</td>
					<td className="no-print" style={styles.td}>
					  <button style={styles.btnEditData} onClick={() => openEditModal(t)}>
						<Icon name="edit" size={14} /> إكمال البيانات
					  </button>
					</td>
				  </tr>
				);
			  })}
			  {teachers.length === 0 && (
				<tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px' }}>لا توجد بيانات للمعلمين. قم بمزامنة الحسابات.</td></tr>
			  )}
			</tbody>
		  </table>
		)}
	  </div>

	  {isModalOpen && (
		<div className="no-print" style={styles.modalOverlay}>
		  <div style={styles.modalContent}>
			<h3 style={styles.modalTitle}>بيانات المعلم الإضافية</h3>
			<form onSubmit={handleSave}>
			  <div style={{ ...styles.inputGroup, marginBottom: '16px' }}>
				<label style={styles.label}>الاسم</label>
				<input readOnly style={styles.inputReadonly} value={formData.full_name} />
			  </div>

			  <div style={styles.formGrid}>
				<div style={styles.inputGroup}>
				  <label style={styles.label}>التخصص / الحلقة</label>
				  <input style={styles.input} value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} placeholder="مثال: حلقة عثمان بن عفان" />
				</div>
				<div style={styles.inputGroup}>
				  <label style={styles.label}>رقم الهاتف</label>
				  <input style={styles.input} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} dir="ltr" placeholder="+249..." />
				</div>
			  </div>

			  <div style={styles.formGrid}>
				<div style={styles.inputGroup}>
				  <label style={styles.label}>العمر</label>
				  <input type="number" style={styles.input} value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="العمر بالسنوات" min="15" />
				</div>
				<div style={styles.inputGroup}>
				  <label style={styles.label}>مقدار الحفظ</label>
				  <input style={styles.input} value={formData.quran_parts} onChange={e => setFormData({...formData, quran_parts: e.target.value})} placeholder="مثال: 15 جزء / كاملاً" />
				</div>
			  </div>

			  <div style={styles.formGrid}>
				<div style={styles.inputGroup}>
				  <label style={styles.label}>عدد الأبناء</label>
				  <input type="number" style={styles.input} value={formData.children} onChange={e => setFormData({...formData, children: e.target.value})} placeholder="0" min="0" />
				</div>
				<div style={styles.inputGroup}>
				  <label style={styles.label}>الحالة الاجتماعية</label>
				  <select style={styles.input} value={formData.marital_status} onChange={e => setFormData({...formData, marital_status: e.target.value})}>
					<option value="">غير محدد</option>
					<option value="أعزب">أعزب</option>
					<option value="متزوج">متزوج</option>
				  </select>
				</div>
			  </div>

			  <div style={{ ...styles.inputGroup, marginBottom: '24px' }}>
				<label style={styles.label}>مكان السكن</label>
				<input style={styles.input} value={formData.residence} onChange={e => setFormData({...formData, residence: e.target.value})} placeholder="الحي / المربع / الشارع..." />
			  </div>

			  <div style={{ display: 'flex', gap: '12px' }}>
				<button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '12px 24px', borderRadius: '4px', border: `1px solid ${theme.borderLight}`, background: theme.white, cursor: 'pointer', fontWeight: 800 }}>إلغاء</button>
				<button type="submit" style={{ flex: 1, backgroundColor: theme.darkGreen, color: theme.cream, border: `1px solid ${theme.gold}`, padding: '12px', borderRadius: '4px', fontWeight: 900, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
				  <Icon name="save" size={16} /> حفظ البيانات
				</button>
			  </div>
			</form>
		  </div>
		</div>
	  )}
	</div>
  );
}