import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  full_name: string;
  account_status: string;
  created_at: string;
}

export default function SettingsAccounts() {
  const { workspace } = useTenant();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
	const fetchProfiles = async () => {
	  if (!workspace) return;
	  setIsLoading(true);
	  const { data, error } = await supabase
		.from('profiles')
		.select('id, full_name, account_status, created_at')
		.eq('workspace_id', workspace.id);

	  if (!error && data) setProfiles(data);
	  setIsLoading(false);
	};
	fetchProfiles();
  }, [workspace]);

  // Inline Styles Object
  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' },
	titleArea: { margin: 0 },
	title: { fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' },
	subtitle: { fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 },
	card: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
	th: { backgroundColor: 'var(--forest-light)', color: 'var(--forest-dark)', fontWeight: 800, fontSize: '0.9rem', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' },
	td: { padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.95rem' },
	badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#475569' },
	badgeActive: { backgroundColor: '#dcfce7', color: '#166534' }
  };

  return (
	<div>
	  <div style={styles.header}>
		<div style={styles.titleArea}>
		  <h2 style={styles.title}>الحسابات والصلاحيات</h2>
		  <p style={styles.subtitle}>إدارة المستخدمين والمعلمين المرتبطين بهذا المركز</p>
		</div>
	  </div>

	  <div style={styles.card}>
		{isLoading ? (
		  <p style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>جاري تحميل الحسابات...</p>
		) : (
		  <table style={styles.table}>
			<thead>
			  <tr>
				<th style={styles.th}>الاسم</th>
				<th style={styles.th}>تاريخ الانضمام</th>
				<th style={styles.th}>حالة الحساب</th>
			  </tr>
			</thead>
			<tbody>
			  {profiles.map(p => (
				<tr key={p.id}>
				  <td style={{ ...styles.td, fontWeight: 700, color: 'var(--forest-dark)' }}>{p.full_name || 'غير محدد'}</td>
				  <td style={styles.td}>{new Date(p.created_at).toLocaleDateString('ar-SA')}</td>
				  <td style={styles.td}>
					<span style={{ ...styles.badge, ...(p.account_status === 'active' ? styles.badgeActive : {}) }}>
					  {p.account_status === 'active' ? 'نشط' : p.account_status}
					</span>
				  </td>
				</tr>
			  ))}
			  {profiles.length === 0 && (
				<tr><td colSpan={3} style={{ ...styles.td, textAlign: 'center' }}>لا توجد حسابات مسجلة.</td></tr>
			  )}
			</tbody>
		  </table>
		)}
	  </div>
	</div>
  );
}