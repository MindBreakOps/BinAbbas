import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';

// لوحة الألوان الإسلامية الفاخرة
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

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.textGray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
	<circle cx="11" cy="11" r="8" />
	<line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', age: '', level: 'تأسيس' });

  // جلب البيانات مع نظام الـ Debounce والبحث المباشر في السيرفر (لتوفير الـ Egress)
  useEffect(() => {
	const fetchStudents = async () => {
	  setIsLoading(true);
	  
	  let query = supabase
		.from('students')
		.select('*')
		.order('created_at', { ascending: false });

	  if (searchTerm.trim() === '') {
		// في الوضع الافتراضي: جلب أحدث 5 طلاب فقط
		query = query.limit(5);
	  } else {
		// عند البحث: جلب المطابقين للاسم أو الجوال (بحد أقصى 20 لتجنب الاستهلاك العالي)
		query = query.or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`).limit(20);
	  }

	  const { data, error } = await query;
	  if (!error && data) setStudents(data);
	  setIsLoading(false);
	};

	// تأخير إرسال الطلب لقاعدة البيانات بمقدار 500 ملي ثانية (Debounce)
	const delayDebounceFn = setTimeout(() => {
	  fetchStudents();
	}, 500);

	return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const openEditModal = (student: any) => {
	setEditingId(student.id);
	setFormData({
	  name: student.name || '',
	  phone: student.phone || '',
	  age: student.age ? student.age.toString() : '',
	  level: student.level || 'تأسيس'
	});
	setIsModalOpen(true);
  };

  const openCreateModal = () => {
	setEditingId(null);
	setFormData({ name: '', phone: '', age: '', level: 'تأسيس' });
	setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
	e.preventDefault();
	const payload = {
	  name: formData.name,
	  phone: formData.phone || null,
	  age: formData.age ? parseInt(formData.age) : null,
	  level: formData.level || null,
	};

	if (editingId) {
	  await supabase.from('students').update(payload).eq('id', editingId);
	} else {
	  await supabase.from('students').insert([payload]);
	}

	setIsModalOpen(false);
	// تفريغ حقل البحث ليتم جلب أحدث 5 طلاب وعرض المضاف حديثاً
	setSearchTerm(''); 
  };

  const handleExportPDF = () => {
	window.print();
  };

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' },
	titleGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
	title: { fontSize: '1.6rem', fontWeight: 900, color: theme.darkGreen, margin: 0 },
	subtitle: { fontSize: '0.95rem', color: theme.textGray, margin: 0, fontFamily: 'system-ui, sans-serif' },
	
	// شريط التحكم (Search & Actions)
	controlBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap', backgroundColor: theme.white, padding: '16px', borderRadius: '4px', border: `1px solid ${theme.borderGold}` },
	searchBox: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: theme.cream, border: `1px solid ${theme.borderLight}`, borderRadius: '4px', padding: '8px 16px', width: '350px' },
	searchInput: { border: 'none', outline: 'none', backgroundColor: 'transparent', width: '100%', fontSize: '0.95rem', fontFamily: 'system-ui, sans-serif', color: theme.textDark },
	actionsGroup: { display: 'flex', gap: '12px' },
	
	// الأزرار الاحترافية بالهوية الإسلامية
	btnPrimary: { backgroundColor: theme.darkGreen, color: theme.cream, border: `1px solid ${theme.gold}`, padding: '10px 24px', borderRadius: '4px', fontWeight: 900, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' },
	btnExport: { backgroundColor: theme.cream, color: theme.darkGreen, border: `1px solid ${theme.borderGold}`, padding: '10px 20px', borderRadius: '4px', fontWeight: 800, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' },
	btnEdit: { backgroundColor: 'transparent', color: theme.gold, border: `1px solid ${theme.gold}`, padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem' },
	
	// الجدول
	card: { backgroundColor: theme.white, border: `1px solid ${theme.borderGold}`, borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderTop: `4px solid ${theme.darkGreen}` },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
	th: { padding: '16px', borderBottom: `1px solid ${theme.borderGold}`, backgroundColor: theme.cream, color: theme.textDark, fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase' },
	td: { padding: '16px', borderBottom: `1px solid ${theme.borderLight}`, color: theme.textDark, fontSize: '0.95rem', fontWeight: 600 },
	
	// النوافذ المنبثقة
	modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 78, 59, 0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
	modalContent: { backgroundColor: theme.cream, padding: '32px', borderRadius: '4px', width: '100%', maxWidth: '500px', border: `2px solid ${theme.gold}` },
	inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
	label: { fontSize: '0.85rem', fontWeight: 900, color: theme.darkGreen },
	input: { padding: '12px', borderRadius: '4px', border: `1px solid ${theme.borderLight}`, fontFamily: 'system-ui, sans-serif', outline: 'none', backgroundColor: theme.white }
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
		  <h2 style={styles.title}>إدارة الطلاب</h2>
		  <p style={styles.subtitle}>سجل بيانات الطلاب، التعديل، واستخراج التقارير</p>
		</div>
	  </div>

	  <div className="no-print" style={styles.controlBar}>
		<div style={styles.searchBox}>
		  <SearchIcon />
		  <input 
			type="text" 
			placeholder="البحث برقم الجوال أو الاسم..." 
			style={styles.searchInput}
			value={searchTerm}
			onChange={(e) => setSearchTerm(e.target.value)}
		  />
		</div>
		<div style={styles.actionsGroup}>
		  <button style={styles.btnExport} onClick={handleExportPDF}>
			<Icon name="file" size={16} /> تصدير الكشف
		  </button>
		  <button style={styles.btnPrimary} onClick={openCreateModal}>
			<Icon name="plus" size={16} /> إضافة طالب
		  </button>
		</div>
	  </div>

	  <div id="printable-table" style={styles.card}>
		{isLoading ? (
		  <p style={{ padding: '32px', textAlign: 'center', color: theme.textGray, fontWeight: 600 }}>جاري البحث وتحديث البيانات...</p>
		) : (
		  <table style={styles.table}>
			<thead>
			  <tr>
				<th style={styles.th}>الاسم الكامل</th>
				<th style={styles.th}>الجوال</th>
				<th style={styles.th}>العمر</th>
				<th style={styles.th}>المستوى</th>
				<th style={styles.th}>تاريخ التسجيل</th>
				<th className="no-print" style={styles.th}>إجراءات</th>
			  </tr>
			</thead>
			<tbody>
			  {students.map(s => (
				<tr key={s.id}>
				  <td style={{ ...styles.td, fontWeight: 900, color: theme.darkGreen }}>{s.name}</td>
				  <td style={{...styles.td, fontFamily: 'monospace'}} dir="ltr">{s.phone || '—'}</td>
				  <td style={styles.td}>{s.age ? `${s.age} سنة` : '—'}</td>
				  <td style={styles.td}>
					<span style={{ backgroundColor: theme.cream, border: `1px solid ${theme.borderGold}`, padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', color: theme.darkGreen, fontWeight: 800 }}>
					  {s.level || '—'}
					</span>
				  </td>
				  <td style={{ ...styles.td, color: theme.textGray, fontSize: '0.85rem' }}>
					{new Date(s.registration_date || s.created_at).toLocaleDateString('ar-SA')}
				  </td>
				  <td className="no-print" style={styles.td}>
					<button style={styles.btnEdit} onClick={() => openEditModal(s)}>تعديل السجل</button>
				  </td>
				</tr>
			  ))}
			  {students.length === 0 && (
				<tr><td colSpan={6} style={{textAlign: 'center', padding: '32px', color: theme.textGray}}>لا توجد نتائج مطابقة لعملية البحث.</td></tr>
			  )}
			</tbody>
		  </table>
		)}
		
		{/* تلميح لبيان أنه يتم عرض 5 طلاب فقط لتوفير الموارد */}
		{searchTerm.trim() === '' && students.length === 5 && (
		  <div className="no-print" style={{ padding: '12px', textAlign: 'center', backgroundColor: theme.cream, color: theme.gold, fontSize: '0.85rem', fontWeight: 800, borderTop: `1px solid ${theme.borderLight}` }}>
			يتم عرض أحدث 5 طلاب فقط. استخدم صندوق البحث بالأعلى للوصول لبقية الطلاب.
		  </div>
		)}
	  </div>

	  {/* نافذة الإضافة والتعديل */}
	  {isModalOpen && (
		<div className="no-print" style={styles.modalOverlay}>
		  <div style={styles.modalContent}>
			<h3 style={{ margin: '0 0 24px 0', fontWeight: 900, color: theme.darkGreen, fontSize: '1.4rem' }}>
			  {editingId ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}
			</h3>
			<form onSubmit={handleSave}>
			  <div style={styles.inputGroup}>
				<label style={styles.label}>الاسم الكامل</label>
				<input required style={styles.input} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
			  </div>
			  <div style={{ display: 'flex', gap: '16px' }}>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>رقم الجوال</label>
				  <input style={styles.input} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} dir="ltr" />
				</div>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>العمر</label>
				  <input type="number" style={styles.input} value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
				</div>
			  </div>
			  <div style={styles.inputGroup}>
				<label style={styles.label}>المستوى الأكاديمي</label>
				<select style={styles.input} value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
				  <option>تأسيس</option><option>متوسط</option><option>متقدم</option><option>خاتم</option>
				</select>
			  </div>
			  
			  <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
				<button type="submit" style={{ ...styles.btnPrimary, flex: 1, justifyContent: 'center' }}>
				  حفظ البيانات
				</button>
				<button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '4px', border: `1px solid ${theme.borderLight}`, background: theme.white, cursor: 'pointer', fontWeight: 800, color: theme.textGray }}>
				  إلغاء
				</button>
			  </div>
			</form>
		  </div>
		</div>
	  )}
	</div>
  );
}