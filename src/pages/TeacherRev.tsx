import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';

export default function TeacherRev() {
  const [revisions, setRevisions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // States for CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
	date: new Date().toISOString().split('T')[0],
	reciter_name: '',
	listener_name: '',
	surah: '',
	from_verse: '',
	to_verse: '',
	grade: ''
  });

  const fetchRevisions = async () => {
	setIsLoading(true);
	// الاعتماد على هيكل الجدول الفعلي
	const { data, error } = await supabase
	  .from('teacher_revisions')
	  .select('*')
	  .order('date', { ascending: false });
	  
	if (!error && data) setRevisions(data);
	setIsLoading(false);
  };

  useEffect(() => {
	fetchRevisions();
  }, []);

  const openCreateModal = () => {
	setEditingId(null);
	setFormData({
	  date: new Date().toISOString().split('T')[0],
	  reciter_name: '', listener_name: '', surah: '', from_verse: '', to_verse: '', grade: ''
	});
	setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
	setEditingId(item.id);
	setFormData({
	  date: item.date || '',
	  reciter_name: item.reciter_name || '',
	  listener_name: item.listener_name || '',
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
	  reciter_name: formData.reciter_name,
	  listener_name: formData.listener_name,
	  surah: formData.surah || null,
	  from_verse: formData.from_verse || null,
	  to_verse: formData.to_verse || null,
	  grade: formData.grade ? parseInt(formData.grade) : null
	};

	if (editingId) {
	  await supabase.from('teacher_revisions').update(payload).eq('id', editingId);
	} else {
	  await supabase.from('teacher_revisions').insert([payload]);
	}

	setIsModalOpen(false);
	fetchRevisions();
  };

  const handleDelete = async (id: string) => {
	if (!window.confirm('هل أنت متأكد من حذف هذا السجل؟')) return;
	await supabase.from('teacher_revisions').delete().eq('id', id);
	fetchRevisions();
  };

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '24px' },
	title: { fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 8px 0' },
	subtitle: { fontSize: '0.85rem', color: '#6b7280', margin: 0 },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px' },
	th: { padding: '14px 16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#374151', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' },
	td: { padding: '14px 16px', borderBottom: '1px solid #e5e7eb', color: '#111827', fontSize: '0.9rem', fontWeight: 600 },
	btnPrimary: { backgroundColor: '#064e3b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' },
	actionGroup: { display: 'flex', gap: '8px' },
	btnEdit: { backgroundColor: 'transparent', color: '#059669', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem' },
	btnDelete: { backgroundColor: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem' },
	modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
	modalContent: { backgroundColor: '#fff', padding: '32px', borderRadius: '8px', width: '100%', maxWidth: '550px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
	inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
	label: { fontSize: '0.8rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase' },
	input: { padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db', fontFamily: 'inherit', outline: 'none' }
  };

  return (
	<div>
	  <div style={styles.header}>
		<div>
		  <h2 style={styles.title}>مقرأة المعلمين (التسميع المتبادل)</h2>
		  <p style={styles.subtitle}>سجل المراجعة والتسميع بين الكادر التعليمي</p>
		</div>
		<button style={styles.btnPrimary} onClick={openCreateModal}>
		  <Icon name="plus" size={16} /> إضافة سجل جديد
		</button>
	  </div>

	  {isLoading ? <p style={{ color: '#6b7280' }}>جاري تحميل السجلات...</p> : (
		<table style={styles.table}>
		  <thead>
			<tr>
			  <th style={styles.th}>التاريخ</th>
			  <th style={styles.th}>القارئ (المُسَمِّع)</th>
			  <th style={styles.th}>المستمع (المُقَيِّم)</th>
			  <th style={styles.th}>السورة والمقطع</th>
			  <th style={styles.th}>الدرجة</th>
			  <th style={styles.th}>إجراءات</th>
			</tr>
		  </thead>
		  <tbody>
			{revisions.map(r => (
			  <tr key={r.id}>
				<td style={{ ...styles.td, color: '#6b7280' }}>{r.date}</td>
				<td style={{ ...styles.td, color: '#064e3b', fontWeight: 800 }}>{r.reciter_name}</td>
				<td style={styles.td}>{r.listener_name}</td>
				<td style={styles.td}>
				  {r.surah || '—'} 
				  {r.from_verse && r.to_verse ? ` (${r.from_verse} - ${r.to_verse})` : ''}
				</td>
				<td style={styles.td}>
				  {r.grade ? <span style={{ color: r.grade >= 90 ? '#059669' : '#d97706', fontWeight: 900 }}>{r.grade}%</span> : '—'}
				</td>
				<td style={styles.td}>
				  <div style={styles.actionGroup}>
					<button style={styles.btnEdit} onClick={() => openEditModal(r)}>تعديل</button>
					<span style={{ color: '#d1d5db' }}>|</span>
					<button style={styles.btnDelete} onClick={() => handleDelete(r.id)}>حذف</button>
				  </div>
				</td>
			  </tr>
			))}
			{revisions.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>لا توجد سجلات مقرأة حالياً.</td></tr>}
		  </tbody>
		</table>
	  )}

	  {isModalOpen && (
		<div style={styles.modalOverlay}>
		  <div style={styles.modalContent}>
			<h3 style={{ margin: '0 0 24px 0', fontWeight: 800, fontSize: '1.2rem', color: '#111827' }}>
			  {editingId ? 'تعديل السجل' : 'إضافة سجل تسميع جديد'}
			</h3>
			<form onSubmit={handleSave}>
			  <div style={{ display: 'flex', gap: '16px' }}>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>القارئ (المُسَمِّع)</label>
				  <input required style={styles.input} value={formData.reciter_name} onChange={e => setFormData({...formData, reciter_name: e.target.value})} />
				</div>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>المستمع (المُقَيِّم)</label>
				  <input required style={styles.input} value={formData.listener_name} onChange={e => setFormData({...formData, listener_name: e.target.value})} />
				</div>
			  </div>

			  <div style={{ display: 'flex', gap: '16px' }}>
				<div style={{ ...styles.inputGroup, flex: 2 }}>
				  <label style={styles.label}>السورة</label>
				  <input style={styles.input} value={formData.surah} onChange={e => setFormData({...formData, surah: e.target.value})} />
				</div>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>الدرجة (%)</label>
				  <input type="number" max="100" min="0" style={styles.input} value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} />
				</div>
			  </div>

			  <div style={{ display: 'flex', gap: '16px' }}>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>من آية</label>
				  <input style={styles.input} value={formData.from_verse} onChange={e => setFormData({...formData, from_verse: e.target.value})} />
				</div>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>إلى آية</label>
				  <input style={styles.input} value={formData.to_verse} onChange={e => setFormData({...formData, to_verse: e.target.value})} />
				</div>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>التاريخ</label>
				  <input type="date" style={styles.input} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
				</div>
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