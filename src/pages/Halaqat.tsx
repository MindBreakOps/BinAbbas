import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Halaqat() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
	const fetchSessions = async () => {
	  setIsLoading(true);
	  // استعلام مباشر وسليم يضمن عدم التوقف بسبب علاقات الجداول
	  const { data, error } = await supabase
		.from('halaqat')
		.select('*')
		.order('date', { ascending: false });

	  if (!error && data) setSessions(data);
	  setIsLoading(false);
	};

	fetchSessions();
  }, []);

  const styles: { [key: string]: React.CSSProperties } = {
	header: { marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' },
	title: { fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right', border: '1px solid var(--border-subtle)' },
	th: { backgroundColor: 'var(--bg-app)', padding: '16px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 800 },
	td: { padding: '16px', borderBottom: '1px solid var(--border-subtle)' }
  };

  return (
	<div>
	  <div style={styles.header}>
		<h2 style={styles.title}>سجل الجلسات والتسميع</h2>
	  </div>

	  {isLoading ? <p>جاري التحميل...</p> : (
		<table style={styles.table}>
		  <thead>
			<tr>
			  <th style={styles.th}>التاريخ</th>
			  <th style={styles.th}>الحلقة</th>
			  <th style={styles.th}>المعلم</th>
			  <th style={styles.th}>الطالب</th>
			  <th style={styles.th}>السورة / المقطع</th>
			  <th style={styles.th}>التقييم</th>
			</tr>
		  </thead>
		  <tbody>
			{sessions.map(s => (
			  <tr key={s.id}>
				<td style={styles.td}>{s.date || new Date(s.created_at).toLocaleDateString('ar-SA')}</td>
				<td style={styles.td}>{s.halqa || '—'}</td>
				<td style={styles.td}>{s.teacher || '—'}</td>
				<td style={{ ...styles.td, fontWeight: 700 }}>{s.student}</td>
				<td style={styles.td}>{s.surah} {s.from_verse && `(${s.from_verse} - ${s.to_verse})`}</td>
				<td style={{ ...styles.td, fontWeight: 800, color: s.grade >= 90 ? '#166534' : '#991b1b' }}>
				  {s.grade ? `${s.grade}%` : '—'}
				</td>
			  </tr>
			))}
			{sessions.length === 0 && <tr><td colSpan={6} style={{textAlign: 'center', padding: '20px'}}>لا توجد سجلات.</td></tr>}
		  </tbody>
		</table>
	  )}
	</div>
  );
}