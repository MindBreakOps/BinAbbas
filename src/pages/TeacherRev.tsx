import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';

export default function TeacherRev() {
  const { workspace } = useTenant();
  const [revisions, setRevisions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State (Create)
  const [form, setForm] = useState({ reciter_name: '', listener_name: '', surah: '', from_verse: '', to_verse: '', grade: '' });

  const fetchRevisions = async () => {
	if (!workspace) return;
	setIsLoading(true);
	// جلب البيانات من جدول teacher_revisions[cite: 2]
	const { data, error } = await supabase
	  .from('teacher_revisions')
	  .select('*')
	  .eq('workspace_id', workspace.id)
	  .order('date', { ascending: false });
	  
	if (!error && data) setRevisions(data);
	setIsLoading(false);
  };

  useEffect(() => {
	fetchRevisions();
  }, [workspace]);

  // إضافة سجل جديد (Create)
  const handleAdd = async (e: React.FormEvent) => {
	e.preventDefault();
	if (!workspace || !form.reciter_name || !form.listener_name) return alert('يرجى تعبئة الأسماء');

	const { error } = await supabase.from('teacher_revisions').insert([{
	  workspace_id: workspace.id,
	  reciter_name: form.reciter_name,
	  listener_name: form.listener_name,
	  surah: form.surah,
	  from_verse: form.from_verse,
	  to_verse: form.to_verse,
	  grade: form.grade ? parseInt(form.grade) : null,
	  date: new Date().toISOString().split('T')[0] // تاريخ اليوم
	}]);

	if (!error) {
	  setForm({ reciter_name: '', listener_name: '', surah: '', from_verse: '', to_verse: '', grade: '' });
	  fetchRevisions();
	} else {
	  alert('خطأ في الإضافة');
	}
  };

  // حذف سجل (Delete)
  const handleDelete = async (id: string) => {
	if (!window.confirm('تأكيد حذف السجل؟')) return;
	const { error } = await supabase.from('teacher_revisions').delete().eq('id', id);
	if (!error) fetchRevisions();
  };

  const styles: { [key: string]: React.CSSProperties } = {
	header: { marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' },
	title: { fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0' },
	card: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' },
	formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', alignItems: 'end' },
	inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
	label: { fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' },
	input: { padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontFamily: 'inherit' },
	btnPrimary: { backgroundColor: 'var(--forest-green)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', height: '40px' },
	tableWrapper: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
	th: { backgroundColor: 'var(--forest-light)', padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' },
	td: { padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.95rem' },
  };

  return (
	<div>
	  <div style={styles.header}>
		<h2 style={styles.title}>مقرأة المعلمين</h2>
		<p style={{ margin: 0, color: 'var(--text-secondary)' }}>سجل المراجعة والتسميع المتبادل بين المعلمين</p>
	  </div>

	  <div style={styles.card}>
		<form onSubmit={handleAdd} style={styles.formGrid}>
		  <div style={styles.inputGroup}>
			<label style={styles.label}>القارئ (المُسَمِّع)</label>
			<input style={styles.input} value={form.reciter_name} onChange={e => setForm({...form, reciter_name: e.target.value})} required />
		  </div>
		  <div style={styles.inputGroup}>
			<label style={styles.label}>المقرئ (المستمع)</label>
			<input style={styles.input} value={form.listener_name} onChange={e => setForm({...form, listener_name: e.target.value})} required />
		  </div>
		  <div style={styles.inputGroup}>
			<label style={styles.label}>السورة</label>
			<input style={styles.input} value={form.surah} onChange={e => setForm({...form, surah: e.target.value})} />
		  </div>
		  <div style={styles.inputGroup}>
			<label style={styles.label}>من آية</label>
			<input style={styles.input} value={form.from_verse} onChange={e => setForm({...form, from_verse: e.target.value})} />
		  </div>
		  <div style={styles.inputGroup}>
			<label style={styles.label}>إلى آية</label>
			<input style={styles.input} value={form.to_verse} onChange={e => setForm({...form, to_verse: e.target.value})} />
		  </div>
		  <div style={styles.inputGroup}>
			<label style={styles.label}>الدرجة</label>
			<input style={styles.input} type="number" value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} />
		  </div>
		  <button type="submit" style={styles.btnPrimary}>إضافة سجل</button>
		</form>
	  </div>

	  <div style={styles.tableWrapper}>
		<table style={styles.table}>
		  <thead>
			<tr>
			  <th style={styles.th}>التاريخ</th>
			  <th style={styles.th}>القارئ</th>
			  <th style={styles.th}>المستمع</th>
			  <th style={styles.th}>السورة</th>
			  <th style={styles.th}>المقطع (من-إلى)</th>
			  <th style={styles.th}>الدرجة</th>
			  <th style={styles.th}>إجراء</th>
			</tr>
		  </thead>
		  <tbody>
			{revisions.map(r => (
			  <tr key={r.id}>
				<td style={{...styles.td, color: 'var(--text-secondary)'}}>{r.date}</td>
				<td style={{...styles.td, fontWeight: 700}}>{r.reciter_name}</td>
				<td style={styles.td}>{r.listener_name}</td>
				<td style={styles.td}>{r.surah}</td>
				<td style={styles.td}>{r.from_verse} - {r.to_verse}</td>
				<td style={{...styles.td, fontWeight: 800, color: 'var(--forest-green)'}}>{r.grade}</td>
				<td style={styles.td}>
				  <button style={{ background: 'transparent', border: 'none', color: '#b91c1c', cursor: 'pointer', fontWeight: 700 }} onClick={() => handleDelete(r.id)}>حذف</button>
				</td>
			  </tr>
			))}
		  </tbody>
		</table>
	  </div>
	</div>
  );
}