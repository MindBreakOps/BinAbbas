import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';

export default function Teachers() {
  const { workspace } = useTenant();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // States for CRUD (Update)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ full_name: '', phone: '', account_status: '' });

  const fetchTeachers = async () => {
	if (!workspace) return;
	setIsLoading(true);
	// جلب البيانات من جدول profiles
	const { data, error } = await supabase
	  .from('profiles')
	  .select('id, full_name, email, phone, account_status, created_at')
	  .eq('workspace_id', workspace.id);
	  
	if (!error && data) setTeachers(data);
	setIsLoading(false);
  };

  useEffect(() => {
	fetchTeachers();
  }, [workspace]);

  // تحديث بيانات المعلم (Update)
  const handleUpdate = async () => {
	if (!editingId) return;
	const { error } = await supabase
	  .from('profiles')
	  .update({
		full_name: editForm.full_name,
		phone: editForm.phone,
		account_status: editForm.account_status
	  })
	  .eq('id', editingId);

	if (!error) {
	  setEditingId(null);
	  fetchTeachers();
	} else {
	  alert('حدث خطأ أثناء التحديث');
	}
  };

  // حذف المعلم (Delete)
  const handleDelete = async (id: string) => {
	if (!window.confirm('هل أنت متأكد من حذف هذا السجل؟')) return;
	const { error } = await supabase.from('profiles').delete().eq('id', id);
	if (!error) fetchTeachers();
	else alert('لا يمكن الحذف لارتباط المعلم بسجلات أخرى.');
  };

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' },
	title: { fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0' },
	card: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
	th: { backgroundColor: 'var(--forest-light)', padding: '16px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 800 },
	td: { padding: '16px', borderBottom: '1px solid var(--border-subtle)' },
	input: { padding: '8px', borderRadius: '6px', border: '1px solid var(--border-subtle)', width: '100%', fontFamily: 'inherit' },
	select: { padding: '8px', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontFamily: 'inherit' },
	btnAction: { background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700, padding: '6px 12px', borderRadius: '6px' },
	btnSave: { backgroundColor: 'var(--forest-green)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' },
  };

  return (
	<div>
	  <div style={styles.header}>
		<div>
		  <h2 style={styles.title}>إدارة المعلمين والكادر</h2>
		  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>تحديث بيانات وحالة حسابات المعلمين</p>
		</div>
	  </div>

	  <div style={styles.card}>
		{isLoading ? <p style={{ padding: '24px', textAlign: 'center' }}>جاري التحميل...</p> : (
		  <table style={styles.table}>
			<thead>
			  <tr>
				<th style={styles.th}>الاسم الكامل</th>
				<th style={styles.th}>البريد الإلكتروني</th>
				<th style={styles.th}>رقم الهاتف</th>
				<th style={styles.th}>الحالة</th>
				<th style={styles.th}>إجراءات (CRUD)</th>
			  </tr>
			</thead>
			<tbody>
			  {teachers.map(t => (
				<tr key={t.id}>
				  {editingId === t.id ? (
					<>
					  <td style={styles.td}><input style={styles.input} value={editForm.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} /></td>
					  <td style={styles.td}>{t.email}</td>
					  <td style={styles.td}><input style={styles.input} value={editForm.phone || ''} onChange={e => setEditForm({...editForm, phone: e.target.value})} /></td>
					  <td style={styles.td}>
						<select style={styles.select} value={editForm.account_status} onChange={e => setEditForm({...editForm, account_status: e.target.value})}>
						  <option value="active">نشط</option>
						  <option value="pending">قيد المراجعة</option>
						  <option value="suspended">موقوف</option>
						</select>
					  </td>
					  <td style={styles.td}>
						<button style={styles.btnSave} onClick={handleUpdate}>حفظ</button>
						<button style={{...styles.btnAction, color: 'var(--text-secondary)'}} onClick={() => setEditingId(null)}>إلغاء</button>
					  </td>
					</>
				  ) : (
					<>
					  <td style={{...styles.td, fontWeight: 700}}>{t.full_name}</td>
					  <td style={styles.td}>{t.email}</td>
					  <td style={styles.td} dir="ltr">{t.phone || '—'}</td>
					  <td style={styles.td}>
						<span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, backgroundColor: t.account_status === 'active' ? '#dcfce7' : '#f1f5f9', color: t.account_status === 'active' ? '#166534' : '#475569' }}>
						  {t.account_status}
						</span>
					  </td>
					  <td style={styles.td}>
						<button style={{...styles.btnAction, color: 'var(--forest-green)'}} onClick={() => { setEditingId(t.id); setEditForm({ full_name: t.full_name, phone: t.phone, account_status: t.account_status }); }}>تعديل</button>
						<button style={{...styles.btnAction, color: '#b91c1c'}} onClick={() => handleDelete(t.id)}>حذف</button>
					  </td>
					</>
				  )}
				</tr>
			  ))}
			</tbody>
		  </table>
		)}
	  </div>
	</div>
  );
}