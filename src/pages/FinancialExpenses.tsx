import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';

export default function FinancialExpenses() {
  const { workspace } = useTenant();
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
	const fetchExpenses = async () => {
	  if (!workspace) return;
	  const { data } = await supabase
		.from('financials')
		.select('*')
		.eq('workspace_id', workspace.id)
		.eq('type', 'مصروف')
		.order('transaction_date', { ascending: false });
	  if (data) setExpenses(data);
	};
	fetchExpenses();
  }, [workspace]);

  const styles: { [key: string]: React.CSSProperties } = {
	header: { marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' },
	title: { fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0' },
	card: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
	th: { backgroundColor: '#fef2f2', color: '#991b1b', padding: '16px', borderBottom: '1px solid var(--border-subtle)' },
	td: { padding: '16px', borderBottom: '1px solid var(--border-subtle)' }
  };

  return (
	<div>
	  <div style={styles.header}><h2 style={styles.title}>سجل المصروفات</h2></div>
	  <div style={styles.card}>
		<table style={styles.table}>
		  <thead>
			<tr>
			  <th style={styles.th}>التصنيف</th>
			  <th style={styles.th}>البيان</th>
			  <th style={styles.th}>المبلغ</th>
			  <th style={styles.th}>التاريخ</th>
			</tr>
		  </thead>
		  <tbody>
			{expenses.map(e => (
			  <tr key={e.id}>
				<td style={{...styles.td, fontWeight: 700}}>{e.category}</td>
				<td style={styles.td}>{e.item_desc}</td>
				<td style={{...styles.td, color: '#b91c1c', fontWeight: 800}}>{e.amount} ر.س</td>
				<td style={styles.td}>{e.transaction_date}</td>
			  </tr>
			))}
		  </tbody>
		</table>
	  </div>
	</div>
  );
}