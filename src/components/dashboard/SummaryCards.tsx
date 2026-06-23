import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useTenant } from '../../context/TenantContext';
import { Icon } from '../ui/Icons';
import styles from '../../pages/Dashboard.module.css'; // We'll create this next

export default function SummaryCards() {
  const { workspace } = useTenant();
  const [stats, setStats] = useState({ students: 0, attendance: 0, balance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
	if (!workspace) return;

	const fetchStats = async () => {
	  setLoading(true);
	  try {
		// 1. Get total students (RLS ensures we only count this workspace's students)
		const { count: studentCount } = await supabase
		  .from('students')
		  .select('*', { count: 'exact', head: true });

		// 2. Get attendance for the current month
		const currentMonth = new Date().getMonth() + 1;
		const { count: presentCount } = await supabase
		  .from('attendance')
		  .select('*', { count: 'exact', head: true })
		  .eq('month', currentMonth.toString())
		  .eq('status', 'P');

		// 3. Calculate Balance
		const { data: financials } = await supabase
		  .from('financials')
		  .select('category, amount');

		let totalDons = 0;
		let totalExps = 0;
		financials?.forEach(f => {
		  if (f.category === 'donations') totalDons += Number(f.amount || 0);
		  if (f.category === 'expenses') totalExps += Number(f.amount || 0);
		});

		setStats({
		  students: studentCount || 0,
		  attendance: presentCount || 0,
		  balance: totalDons - totalExps
		});
	  } catch (error) {
		console.error("Error fetching stats:", error);
	  } finally {
		setLoading(false);
	  }
	};

	fetchStats();
  }, [workspace]);

  const todayGregorian = new Date().toLocaleDateString('ar-EG', {
	weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
	<div className={styles.statsGrid}>
	  <div className={styles.statCard}>
		<div className={styles.statIconWrapper} style={{ color: 'var(--green2)' }}>
		  <Icon name="users" size={24} />
		</div>
		<div className={styles.statValue}>{loading ? '-' : stats.students}</div>
		<div className={styles.statLabel}>إجمالي الطلاب</div>
	  </div>
	  
	  <div className={styles.statCard}>
		<div className={styles.statIconWrapper} style={{ color: 'var(--green2)' }}>
		  <Icon name="cal" size={24} />
		</div>
		<div className={styles.statValue}>{loading ? '-' : stats.attendance}</div>
		<div className={styles.statLabel}>حاضرون هذا الشهر</div>
	  </div>
	  
	  <div className={styles.statCard}>
		<div className={styles.statIconWrapper} style={{ color: 'var(--gold2)' }}>
		  <Icon name="money" size={24} />
		</div>
		<div className={styles.statValue}>{loading ? '-' : stats.balance} ج.س</div>
		<div className={styles.statLabel}>الرصيد المتاح</div>
	  </div>
	  
	  <div className={styles.statCard}>
		<div className={styles.statIconWrapper} style={{ color: 'var(--green2)' }}>
		  <Icon name="book" size={24} />
		</div>
		<div className={styles.statValue} style={{ fontSize: '1rem', marginTop: '12px' }}>
		  {todayGregorian}
		</div>
		<div className={styles.statLabel}>التاريخ الميلادي</div>
	  </div>
	</div>
  );
}