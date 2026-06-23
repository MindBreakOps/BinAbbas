import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';

export default function FinancialBudget() {
  const { workspace } = useTenant();
  const [budgets, setBudgets] = useState<Record<string, number>>({});

  useEffect(() => {
	const fetchBudget = async () => {
	  if (!workspace) return;
	  const { data, error } = await supabase
		.from('financials')
		.select('amount, category')
		.eq('workspace_id', workspace.id)
		.eq('type', 'مصروف');
	  
	  if (!error && data) {
		const groups: Record<string, number> = {};
		data.forEach(row => {
		  const cat = row.category || 'أخرى';
		  groups[cat] = (groups[cat] || 0) + Number(row.amount || 0);
		});
		setBudgets(groups);
	  }
	};
	fetchBudget();
  }, [workspace]);

  const styles: { [key: string]: React.CSSProperties } = {
	header: { marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' },
	title: { fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0' },
	grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' },
	card: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '24px' },
	catName: { fontSize: '1.1rem', fontWeight: 800, color: 'var(--forest-dark)', margin: '0 0 12px 0' },
	amount: { fontSize: '1.5rem', color: '#b91c1c', fontWeight: 800, margin: 0 }
  };

  return (
	<div>
	  <div style={styles.header}>
		<h2 style={styles.title}>استهلاك الميزانية حسب التصنيف</h2>
	  </div>
	  <div style={styles.grid}>
		{Object.entries(budgets).map(([cat, total]) => (
		  <div key={cat} style={styles.card}>
			<h3 style={styles.catName}>{cat}</h3>
			<p style={styles.amount}>{total} ر.س</p>
		  </div>
		))}
		{Object.keys(budgets).length === 0 && <p>لا توجد مصروفات مسجلة لتحليل الميزانية.</p>}
	  </div>
	</div>
  );
}