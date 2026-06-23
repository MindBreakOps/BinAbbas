import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';

export default function FinancialOverview() {
  const { workspace } = useTenant();
  const [stats, setStats] = useState({ income: 0, expense: 0 });

  useEffect(() => {
	const fetchTotals = async () => {
	  if (!workspace) return;
	  const { data, error } = await supabase
		.from('financials')
		.select('amount, type')
		.eq('workspace_id', workspace.id);
	  
	  if (!error && data) {
		let income = 0; let expense = 0;
		data.forEach(row => {
		  if (row.type === 'تبرع' || row.type === 'وارد') income += Number(row.amount || 0);
		  else if (row.type === 'مصروف') expense += Number(row.amount || 0);
		});
		setStats({ income, expense });
	  }
	};
	fetchTotals();
  }, [workspace]);

  const styles: { [key: string]: React.CSSProperties } = {
	header: { marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' },
	title: { fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' },
	grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' },
	card: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' },
	value: { fontSize: '2rem', fontWeight: 800, margin: '8px 0 0 0' },
	label: { fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }
  };

  return (
	<div>
	  <div style={styles.header}>
		<h2 style={styles.title}>الملخص المالي العام</h2>
	  </div>
	  <div style={styles.grid}>
		<div style={styles.card}>
		  <span style={styles.label}>إجمالي التبرعات والواردات</span>
		  <h3 style={{ ...styles.value, color: 'var(--forest-green)' }}>{stats.income} ر.س</h3>
		</div>
		<div style={styles.card}>
		  <span style={styles.label}>إجمالي المصروفات</span>
		  <h3 style={{ ...styles.value, color: '#b91c1c' }}>{stats.expense} ر.س</h3>
		</div>
		<div style={styles.card}>
		  <span style={styles.label}>الرصيد المتاح (الفائض)</span>
		  <h3 style={{ ...styles.value, color: '#0f172a' }}>{stats.income - stats.expense} ر.س</h3>
		</div>
	  </div>
	</div>
  );
}