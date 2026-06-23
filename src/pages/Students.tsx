import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // States for Create & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', age: '', level: 'تأسيس' });

  const fetchStudents = async () => {
	setIsLoading(true);
	
	// جلب البيانات بناءً على الأعمدة الحقيقية فقط
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

	// تجهيز البيانات لتتطابق مع الـ Schema تماماً
	const payload = {
	  name: formData.name,
	  phone: formData.phone || null,
	  age: formData.age ? parseInt(formData.age) : null,
	  level: formData.level || null,
	};

	if (editingId) {
	  // تعديل
	  await supabase.from('students').update(payload).eq('id', editingId);
	} else {
	  // إضافة
	  await supabase.from('students').insert([payload]);
	}

	setIsModalOpen(false);
	fetchStudents();
  };

  const handleExportPDF = () => {
	window.print();
  };

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' },
	title: { fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-primary)' },
	subtitle: { fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 },
	actions: { display: 'flex', gap: '12px' },
	btnPrimary: { backgroundColor: 'var(--forest-green)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' },
	btnExport: { backgroundColor: '#fff', color: '#b91c1c', border: '1px solid #fca5a5', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' },
	card: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
	th: { backgroundColor: 'var(--forest-light)', padding: '16px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--forest-dark)' },
	td: { padding: '16px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)' },
	modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
	modalContent: { backgroundColor: '#fff', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '500px' },
	inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
	input: { padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontFamily: 'inherit' }
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
		<div>
		  <h2 style={styles.title}>سجل الطلاب الشامل</h2>
		  <p style={styles.subtitle}>إدارة البيانات الشخصية للطلاب (الإضافة، التعديل، والتصدير)</p>
		</div>
		<div style={styles.actions}>
		  <button style={styles.btnExport} onClick={handleExportPDF}>
			<Icon name="file" size={16} /> تصدير PDF
		  </button>
		  <button style={styles.btnPrimary} onClick={openCreateModal}>
			<Icon name="plus" size={16} /> طالب جديد
		  </button>
		</div>
	  </div>

	  <div id="printable-table" style={styles.card}>
		{isLoading ? <p style={{ padding: '20px', textAlign: 'center' }}>جاري التحميل...</p> : (
		  <table style={styles.table}>
			<thead>
			  <tr>
				<th style={styles.th}>الاسم</th>
				<th style={styles.th}>الجوال</th>
				<th style={styles.th}>العمر</th>
				<th style={styles.th}>المستوى</th>
				<th style={styles.th}>تاريخ التسجيل</th>
				<th className="no-print" style={styles.th}>إجراء</th>
			  </tr>
			</thead>
			<tbody>
			  {students.map(s => (
				<tr key={s.id}>
				  <td style={{ ...styles.td, fontWeight: 700 }}>{s.name}</td>
				  <td style={styles.td} dir="ltr">{s.phone || '—'}</td>
				  <td style={styles.td}>{s.age ? `${s.age} سنة` : '—'}</td>
				  <td style={styles.td}>{s.level || '—'}</td>
				  <td style={styles.td}>{new Date(s.registration_date || s.created_at).toLocaleDateString('ar-SA')}</td>
				  <td className="no-print" style={styles.td}>
					<button style={{ background: 'none', border: 'none', color: 'var(--forest-green)', fontWeight: 700, cursor: 'pointer' }} onClick={() => openEditModal(s)}>
					  تعديل
					</button>
				  </td>
				</tr>
			  ))}
			  {students.length === 0 && <tr><td colSpan={6} style={{...styles.td, textAlign: 'center'}}>لا يوجد طلاب مسجلين.</td></tr>}
			</tbody>
		  </table>
		)}
	  </div>

	  {isModalOpen && (
		<div className="no-print" style={styles.modalOverlay}>
		  <div style={styles.modalContent}>
			<h3 style={{ margin: '0 0 20px 0', fontWeight: 800 }}>{editingId ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}</h3>
			<form onSubmit={handleSave}>
			  <div style={styles.inputGroup}>
				<label style={{ fontWeight: 700, fontSize: '0.9rem' }}>الاسم الكامل</label>
				<input required style={styles.input} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
			  </div>
			  <div style={{ display: 'flex', gap: '16px' }}>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={{ fontWeight: 700, fontSize: '0.9rem' }}>رقم الجوال</label>
				  <input style={styles.input} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
				</div>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={{ fontWeight: 700, fontSize: '0.9rem' }}>العمر</label>
				  <input type="number" style={styles.input} value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
				</div>
			  </div>
			  <div style={styles.inputGroup}>
				<label style={{ fontWeight: 700, fontSize: '0.9rem' }}>المستوى</label>
				<select style={styles.input} value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
				  <option>تأسيس</option><option>متوسط</option><option>متقدم</option><option>خاتم</option>
				</select>
			  </div>
			  
			  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
				<button type="submit" style={{ ...styles.btnPrimary, flex: 1, justifyContent: 'center' }}>حفظ البيانات</button>
				<button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}>إلغاء</button>
			  </div>
			</form>
		  </div>
		</div>
	  )}
	</div>
  );
}