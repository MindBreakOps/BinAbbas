import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';

interface StudentData {
  name: string;
  halqa: string;
}

export default function Students() {
  const { workspace } = useTenant();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
	const fetchStudentsFromHalaqat = async () => {
	  if (!workspace) return;
	  setIsLoading(true);
	  
	  // جلب أسماء الطلاب من سجلات الحلقات
	  const { data, error } = await supabase
		.from('halaqat')
		.select('student, halqa')
		.eq('workspace_id', workspace.id);

	  if (!error && data) {
		// تصفية الطلاب المكررين (لأن الطالب قد يكون له عدة سجلات تسميع)
		const uniqueStudents = new Map<string, string>();
		data.forEach(record => {
		  if (record.student && !uniqueStudents.has(record.student)) {
			uniqueStudents.set(record.student, record.halqa || 'غير محدد');
		  }
		});

		const formatted = Array.from(uniqueStudents.entries()).map(([name, halqa]) => ({
		  name,
		  halqa
		}));
		setStudents(formatted);
	  }
	  setIsLoading(false);
	};
	fetchStudentsFromHalaqat();
  }, [workspace]);

  const styles: { [key: string]: React.CSSProperties } = {
	header: { marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' },
	title: { fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' },
	subtitle: { fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 },
	card: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
	th: { backgroundColor: 'var(--forest-light)', color: 'var(--forest-dark)', padding: '16px', borderBottom: '1px solid var(--border-subtle)' },
	td: { padding: '16px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }
  };

  return (
	<div>
	  <div style={styles.header}>
		<h2 style={styles.title}>قاعدة بيانات الطلاب</h2>
		<p style={styles.subtitle}>الطلاب المستخرجون تلقائياً من سجلات التسميع والحلقات</p>
	  </div>

	  <div style={styles.card}>
		{isLoading ? <p style={{ padding: '20px', textAlign: 'center' }}>جاري جلب الطلاب...</p> : (
		  <table style={styles.table}>
			<thead>
			  <tr>
				<th style={styles.th}>اسم الطالب</th>
				<th style={styles.th}>الحلقة المسجل بها</th>
			  </tr>
			</thead>
			<tbody>
			  {students.map((s, i) => (
				<tr key={i}>
				  <td style={{ ...styles.td, fontWeight: 700 }}>{s.name}</td>
				  <td style={styles.td}>
					<span style={{ backgroundColor: 'var(--forest-light)', color: 'var(--forest-green)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
					  {s.halqa}
					</span>
				  </td>
				</tr>
			  ))}
			  {students.length === 0 && <tr><td colSpan={2} style={{...styles.td, textAlign: 'center'}}>لا يوجد طلاب مسجلين.</td></tr>}
			</tbody>
		  </table>
		)}
	  </div>
	</div>
  );
}