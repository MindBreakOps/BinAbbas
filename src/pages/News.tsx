import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';

export default function News() {
  const { workspace } = useTenant();
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
	const fetchNews = async () => {
	  if (!workspace) return;
	  const { data } = await supabase
		.from('newspaper')
		.select('*')
		.eq('workspace_id', workspace.id)
		.order('created_at', { ascending: false });
	  if (data) setNews(data);
	};
	fetchNews();
  }, [workspace]);

  const styles: { [key: string]: React.CSSProperties } = {
	header: { marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' },
	title: { fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0' },
	list: { display: 'flex', flexDirection: 'column', gap: '16px' },
	card: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '24px' },
	type: { display: 'inline-block', backgroundColor: 'var(--forest-light)', color: 'var(--forest-green)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px' },
	text: { fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)', margin: '0 0 16px 0' },
	meta: { fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '16px' }
  };

  return (
	<div>
	  <div style={styles.header}><h2 style={styles.title}>النشرة والتعاميم</h2></div>
	  <div style={styles.list}>
		{news.map(item => (
		  <div key={item.id} style={styles.card}>
			<span style={styles.type}>{item.type || 'إعلان'}</span>
			<p style={styles.text}>{item.text}</p>
			<div style={styles.meta}>
			  <span>المصدر: {item.source || 'الإدارة'}</span>
			  <span>التاريخ: {item.date || new Date(item.created_at).toLocaleDateString('ar-SA')}</span>
			</div>
		  </div>
		))}
		{news.length === 0 && <p style={{ textAlign: 'center' }}>لا توجد تعاميم منشورة.</p>}
	  </div>
	</div>
  );
}