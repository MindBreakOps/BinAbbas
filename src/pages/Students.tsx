import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';

// أيقونة بحث SVG
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

  const fetchStudents = async () => {
	setIsLoading(true);
	const { data, error } = await supabase
	  .from('students')
	  .select('*')
	  .order('created_at', { ascending: false });

	if (!error && data) setStudents(data);
	setIsLoading(false);
  };

  useEffect(() => {
	fetchStudents();
  }, []);

  const filteredStudents = students.filter(s => 
	s.name.includes(searchTerm) || (s.phone && s.phone.includes(searchTerm))
  );

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
	fetchStudents();
  };

  const handleExportPDF = () => {
	window.print();
  };

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
	titleGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
	title: { fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: 0 },
	subtitle: { fontSize: '0.85rem', color: '#6b7280', margin: 0 },
	
	// شريط التحكم (Search & Actions)
	controlBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '16px', flexWrap: 'wrap' },
	searchBox: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', padding: '8px 16px', width: '300px' },
	searchInput: { border: 'none', outline: 'none', backgroundColor: 'transparent', width: '100%', fontSize: '0.9rem', fontFamily: 'inherit' },
	actionsGroup: { display: 'flex', gap: '12px' },
	
	// الأزرار الاحترافية
	btnPrimary: { backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
	btnExport: { backgroundColor: '#ffffff', color: '#374151', border: '1px solid #d1d5db', padding: '10px 20px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
	btnEdit: { backgroundColor: 'transparent', color: '#059669', border: '1px solid #a7f3d0', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' },
	
	// الجدول
	card: { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
	th: { padding: '14px 16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#4b5563', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' },
	td: { padding: '14px 16px', borderBottom: '1px solid #e5e7eb', color: '#111827', fontSize: '0.9rem', fontWeight: 600 },
	
	// النوافذ المنبثقة
	modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(17, 24, 39, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
	modalContent: { backgroundColor: '#ffffff', padding: '32px', borderRadius: '8px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
	inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
	label: { fontSize: '0.8rem', fontWeight: 800, color: '#374151' },
	input: { padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontFamily: 'inherit', outline: 'none' }
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
			placeholder="بحث بالاسم أو رقم الجوال..." 
			style={styles.searchInput}
			value={searchTerm}
			onChange={(e) => setSearchTerm(e.target.value)}
		  />
		</div>
		<div style={styles.actionsGroup}>
		  <button style={styles.btnExport} onClick={handleExportPDF}>
			<Icon name="file" size={16} /> تصدير PDF
		  </button>
		  <button style={styles.btnPrimary} onClick={openCreateModal}>
			<Icon name="plus" size={16} /> إضافة طالب
		  </button>
		</div>
	  </div>

	  <div id="printable-table" style={styles.card}>
		{isLoading ? <p style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>جاري تحميل البيانات...</p> : (
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
			  {filteredStudents.map(s => (
				<tr key={s.id}>
				  <td style={{ ...styles.td, fontWeight: 800 }}>{s.name}</td>
				  <td style={styles.td} dir="ltr">{s.phone || '—'}</td>
				  <td style={styles.td}>{s.age ? `${s.age} سنة` : '—'}</td>
				  <td style={styles.td}>
					<span style={{ backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', color: '#374151' }}>
					  {s.level || '—'}
					</span>
				  </td>
				  <td style={{ ...styles.td, color: '#6b7280', fontSize: '0.85rem' }}>
					{new Date(s.registration_date || s.created_at).toLocaleDateString('ar-SA')}
				  </td>
				  <td className="no-print" style={styles.td}>
					<button style={styles.btnEdit} onClick={() => openEditModal(s)}>تعديل السجل</button>
				  </td>
				</tr>
			  ))}
			  {filteredStudents.length === 0 && <tr><td colSpan={6} style={{textAlign: 'center', padding: '32px', color: '#6b7280'}}>لا توجد نتائج مطابقة.</td></tr>}
			</tbody>
		  </table>
		)}
	  </div>

	  {isModalOpen && (
		<div className="no-print" style={styles.modalOverlay}>
		  <div style={styles.modalContent}>
			<h3 style={{ margin: '0 0 24px 0', fontWeight: 800, color: '#111827', fontSize: '1.2rem' }}>
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
				  <input style={styles.input} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
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
				<button type="submit" style={{ ...styles.btnPrimary, flex: 1, justifyContent: 'center' }}>حفظ البيانات</button>
				<button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#ffffff', cursor: 'pointer', fontWeight: 700, color: '#374151' }}>إلغاء</button>
			  </div>
			</form>
		  </div>
		</div>
	  )}
	</div>
  );
}