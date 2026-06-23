import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';

export default function FinancialDonations() {
  const { workspace } = useTenant();
  const [donations, setDonations] = useState<any[]>([]);

  useEffect(() => {
	const fetchDonations = async () => {
	  if (!workspace) return;
	  const { data } = await supabase
		.from('financials')
		.select('*')
		.eq('workspace_id', workspace.id)
		.in('type', ['تبرع', 'وارد'])
		.order('transaction_date', { ascending: false });
	  if (data) setDonations(data);
	};
	fetchDonations();
  }, [workspace]);

  const styles: { [key: string]: React.CSSProperties } = {
	header: { marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' },
	title: { fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0' },
	card: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
	th: { backgroundColor: 'var(--forest-light)', padding: '16px', borderBottom: '1px solid var(--border-subtle)' },
	td: { padding: '16px', borderBottom: '1px solid var(--border-subtle)' }
  };

  return (
	<div>
	  <div style={styles.header}><h2 style={styles.title}>سجل التبرعات</h2></div>
	  <div style={styles.card}>
		<table style={styles.table}>
		  <thead>
			<tr>
			  <th style={styles.th}>المتبرع</th>
			  <th style={styles.th}>الوصف</th>
			  <th style={styles.th}>المبلغ</th>
			  <th style={styles.th}>التاريخ</th>
			</tr>
		  </thead>
		  <tbody>
			{donations.map(d => (
			  <tr key={d.id}>
				<td style={{...styles.td, fontWeight: 700}}>{d.donor_name || 'فاعل خير'}</td>
				<td style={styles.td}>{d.item_desc}</td>
				<td style={{...styles.td, color: 'var(--forest-green)', fontWeight: 800}}>{d.amount} ر.س</td>
				<td style={styles.td}>{d.transaction_date}</td>
			  </tr>
			))}
		  </tbody>
		</table>
	  </div>
	</div>
  );
}