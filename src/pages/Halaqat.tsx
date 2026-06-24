import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';

export default function Halaqat() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // States for CRUD Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
	date: new Date().toISOString().split('T')[0],
	halqa: '',
	teacher: '',
	student: '',
	surah: '',
	from_verse: '',
	to_verse: '',
	grade: ''
  });

  const fetchSessions = async () => {
	setIsLoading(true);
	const { data, error } = await supabase
	  .from('halaqat')
	  .select('*')
	  .order('date', { ascending: false });

	if (!error && data) setSessions(data);
	setIsLoading(false);
  };

  useEffect(() => {
	fetchSessions();
  }, []);

  const openCreateModal = () => {
	setEditingId(null);
	setFormData({
	  date: new Date().toISOString().split('T')[0],
	  halqa: '', teacher: '', student: '', surah: '', from_verse: '', to_verse: '', grade: ''
	});
	setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
	setEditingId(item.id);
	setFormData({
	  date: item.date || '',
	  halqa: item.halqa || '',
	  teacher: item.teacher || '',
	  student: item.student || '',
	  surah: item.surah || '',
	  from_verse: item.from_verse || '',
	  to_verse: item.to_verse || '',
	  grade: item.grade ? item.grade.toString() : ''
	});
	setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
	e.preventDefault();
	const payload = {
	  date: formData.date || null,
	  halqa: formData.halqa,
	  teacher: formData.teacher,
	  student: formData.student,
	  surah: formData.surah || null,
	  from_verse: formData.from_verse || null,
	  to_verse: formData.to_verse || null,
	  grade: formData.grade ? parseInt(formData.grade) : null
	};

	if (editingId) {
	  await supabase.from('halaqat').update(payload).eq('id', editingId);
	} else {
	  await supabase.from('halaqat').insert([payload]);
	}

	setIsModalOpen(false);
	fetchSessions();
  };

  const handleDelete = async (id: string) => {
	if (!window.confirm('هل أنت متأكد من حذف هذه الجلسة؟')) return;
	await supabase.from('halaqat').delete().eq('id', id);
	fetchSessions();
  };

  // دالة لتحديد لون شارة التقييم
  const getGradeBadgeStyle = (grade: number) => {
	if (!grade) return { bg: '#f3f4f6', color: '#4b5563', text: '—' };
	if (grade >= 90) return { bg: '#dcfce7', color: '#166534', text: 'ممتاز' };
	if (grade >= 80) return { bg: '#e0f2fe', color: '#0369a1', text: 'جيد جداً' };
	if (grade >= 70) return { bg: '#fef08a', color: '#854d0e', text: 'جيد' };
	return { bg: '#fee2e2', color: '#991b1b', text: 'إعادة' };
  };

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e5e7eb' },
	title: { fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 8px 0' },
	subtitle: { fontSize: '0.85rem', color: '#6b7280', margin: 0 },
	
	// تصميم الأزرار الحقيقية
	btnPrimary: { backgroundColor: '#064e3b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 800, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
	btnEdit: { backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' },
	btnDelete: { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' },
	
	// تصميم الجدول
	card: { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
	th: { padding: '16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#374151', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' },
	td: { padding: '16px', borderBottom: '1px solid #e5e7eb', color: '#111827', fontSize: '0.9rem', fontWeight: 600 },
	
	// شارة التقييم الملونة
	badge: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800, minWidth: '40px' },
	
	// النافذة المنبثقة
	modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
	modalContent: { backgroundColor: '#fff', padding: '32px', borderRadius: '8px', width: '100%', maxWidth: '600px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
	inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
	label: { fontSize: '0.85rem', fontWeight: 800, color: '#374151' },
	input: { padding: '12px', borderRadius: '4px', border: '1px solid #d1d5db', fontFamily: 'inherit', outline: 'none', backgroundColor: '#f9fafb' }
  };

  return (
	<div>
	  <div style={styles.header}>
		<div>
		  <h2 style={styles.title}>سجل الحلقات والتسميع اليومي</h2>
		  <p style={styles.subtitle}>سجلات الحفظ والمراجعة ومقدار الإنجاز لطلاب المركز</p>
		</div>
		<button style={styles.btnPrimary} onClick={openCreateModal}>
		  <Icon name="plus" size={16} /> إضافة جلسة تسميع
		</button>
	  </div>

	  <div style={styles.card}>
		{isLoading ? <p style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>جاري تحميل الجلسات...</p> : (
		  <table style={styles.table}>
			<thead>
			  <tr>
				<th style={styles.th}>التاريخ</th>
				<th style={styles.th}>الحلقة والمعلم</th>
				<th style={styles.th}>الطالب</th>
				<th style={styles.th}>السورة والمقطع</th>
				<th style={styles.th}>التقييم</th>
				<th style={styles.th}>إجراءات</th>
			  </tr>
			</thead>
			<tbody>
			  {sessions.map(s => {
				const badgeInfo = getGradeBadgeStyle(s.grade);
				return (
				  <tr key={s.id}>
					<td style={{ ...styles.td, color: '#6b7280', fontSize: '0.85rem' }}>{s.date || new Date(s.created_at).toLocaleDateString('ar-SA')}</td>
					<td style={styles.td}>
					  <span style={{ display: 'block', fontWeight: 800, color: '#111827' }}>{s.halqa || '—'}</span>
					  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{s.teacher || '—'}</span>
					</td>
					<td style={{ ...styles.td, fontWeight: 800, color: '#064e3b' }}>{s.student}</td>
					<td style={styles.td}>
					  <span style={{ backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
						{s.surah || '—'} {s.from_verse && s.to_verse ? `(${s.from_verse} - ${s.to_verse})` : ''}
					  </span>
					</td>
					<td style={styles.td}>
					  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						<span style={{ ...styles.badge, backgroundColor: badgeInfo.bg, color: badgeInfo.color }}>
						  {s.grade ? `${s.grade}%` : badgeInfo.text}
						</span>
						{s.grade && <span style={{ fontSize: '0.75rem', color: badgeInfo.color, fontWeight: 700 }}>{badgeInfo.text}</span>}
					  </div>
					</td>
					<td style={styles.td}>
					  <div style={{ display: 'flex', gap: '8px' }}>
						<button style={styles.btnEdit} onClick={() => openEditModal(s)}>تعديل</button>
						<button style={styles.btnDelete} onClick={() => handleDelete(s.id)}>حذف</button>
					  </div>
					</td>
				  </tr>
				);
			  })}
			  {sessions.length === 0 && <tr><td colSpan={6} style={{textAlign: 'center', padding: '40px', color: '#6b7280'}}>لا توجد سجلات. انقر على "إضافة جلسة" للبدء.</td></tr>}
			</tbody>
		  </table>
		)}
	  </div>

	  {isModalOpen && (
		<div style={styles.modalOverlay}>
		  <div style={styles.modalContent}>
			<h3 style={{ margin: '0 0 24px 0', fontWeight: 800, fontSize: '1.2rem', color: '#111827' }}>
			  {editingId ? 'تعديل الجلسة' : 'تسجيل جلسة تسميع جديدة'}
			</h3>
			<form onSubmit={handleSave}>
			  
			  <div style={{ display: 'flex', gap: '16px' }}>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>اسم الطالب</label>
				  <input required style={styles.input} value={formData.student} onChange={e => setFormData({...formData, student: e.target.value})} placeholder="مثال: أحمد محمد" />
				</div>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>التاريخ</label>
				  <input type="date" required style={styles.input} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
				</div>
			  </div>

			  <div style={{ display: 'flex', gap: '16px' }}>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>اسم الحلقة</label>
				  <input required style={styles.input} value={formData.halqa} onChange={e => setFormData({...formData, halqa: e.target.value})} placeholder="مثال: حلقة ابن كثير" />
				</div>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>اسم المعلم</label>
				  <input required style={styles.input} value={formData.teacher} onChange={e => setFormData({...formData, teacher: e.target.value})} placeholder="مثال: أ. عبدالله" />
				</div>
			  </div>

			  <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginTop: '8px' }}>
				<div style={{ ...styles.inputGroup, flex: 2 }}>
				  <label style={styles.label}>السورة</label>
				  <input required style={styles.input} value={formData.surah} onChange={e => setFormData({...formData, surah: e.target.value})} placeholder="مثال: البقرة" />
				</div>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>من آية</label>
				  <input style={styles.input} value={formData.from_verse} onChange={e => setFormData({...formData, from_verse: e.target.value})} placeholder="1" />
				</div>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>إلى آية</label>
				  <input style={styles.input} value={formData.to_verse} onChange={e => setFormData({...formData, to_verse: e.target.value})} placeholder="10" />
				</div>
			  </div>

			  <div style={{ ...styles.inputGroup, width: '50%' }}>
				<label style={styles.label}>الدرجة (من 100)</label>
				<input type="number" max="100" min="0" required style={styles.input} value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} placeholder="مثال: 95" />
			  </div>
			  
			  <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
				<button type="submit" style={{ ...styles.btnPrimary, flex: 1, justifyContent: 'center' }}>
				  <Icon name="save" size={16} /> حفظ البيانات
				</button>
				<button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontWeight: 800, color: '#374151' }}>
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