import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';

export default function Dashboard() {
  const { workspace } = useTenant();
  const [isLoading, setIsLoading] = useState(true);
  
  // Dashboard State
  const [stats, setStats] = useState({
	studentsCount: 0,
	halaqatCount: 0,
	totalIncome: 0,
	totalExpense: 0,
  });
  const [recentNews, setRecentNews] = useState<any[]>([]);

  useEffect(() => {
	const fetchDashboardData = async () => {
	  if (!workspace) return;
	  setIsLoading(true);

	  try {
		// 1. جلب بيانات الحلقات لحساب عدد الطلاب والحلقات 
		const { data: halaqatData } = await supabase
		  .from('halaqat')
		  .select('halqa, student')
		  .eq('workspace_id', workspace.id);

		let uniqueStudents = new Set();
		let uniqueHalaqat = new Set();
		
		if (halaqatData) {
		  halaqatData.forEach(record => {
			if (record.student) uniqueStudents.add(record.student);
			if (record.halqa) uniqueHalaqat.add(record.halqa);
		  });
		}

		// 2. جلب السجلات المالية لحساب الميزانية 
		const { data: finData } = await supabase
		  .from('financials')
		  .select('amount, type')
		  .eq('workspace_id', workspace.id);

		let income = 0;
		let expense = 0;
		
		if (finData) {
		  finData.forEach(record => {
			// افتراض أن حقل type يحتوي على كلمات تدل على النوع 
			if (record.type === 'وارد' || record.type === 'تبرع') income += Number(record.amount || 0);
			else expense += Number(record.amount || 0);
		  });
		}

		setStats({
		  studentsCount: uniqueStudents.size,
		  halaqatCount: uniqueHalaqat.size,
		  totalIncome: income,
		  totalExpense: expense,
		});

		// 3. جلب آخر الأخبار من جدول newspaper 
		const { data: newsData } = await supabase
		  .from('newspaper')
		  .select('*')
		  .eq('workspace_id', workspace.id)
		  .order('created_at', { ascending: false })
		  .limit(3);

		if (newsData) setRecentNews(newsData);

	  } catch (error) {
		console.error("Error fetching dashboard data:", error);
	  } finally {
		setIsLoading(false);
	  }
	};

	fetchDashboardData();
  }, [workspace]);

  // Inline CSS
  const styles: { [key: string]: React.CSSProperties } = {
	header: { marginBottom: '32px' },
	title: { fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' },
	subtitle: { fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 },
	statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px' },
	statCard: { backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '16px' },
	iconWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px' },
	statInfo: { display: 'flex', flexDirection: 'column' },
	statLabel: { fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' },
	statValue: { fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' },
	contentGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' },
	card: { backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-subtle)', padding: '24px', boxShadow: 'var(--shadow-sm)' },
	cardTitle: { fontSize: '1.1rem', fontWeight: 800, color: 'var(--forest-dark)', margin: '0 0 20px 0', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' },
	newsItem: { padding: '16px', backgroundColor: 'var(--bg-app)', borderRadius: '8px', marginBottom: '12px', border: '1px solid var(--border-subtle)' },
	newsDate: { fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }
  };

  const today = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
	day: 'numeric', month: 'long', year: 'numeric', weekday: 'long'
  }).format(new Date());

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center' }}>جاري تجميع البيانات ...</div>;

  return (
	<div>
	  <div style={styles.header}>
		<h1 style={styles.title}>لوحة القيادة</h1>
		<p style={styles.subtitle}>{today}</p>
	  </div>

	  <div style={styles.statsGrid}>
		<div style={styles.statCard}>
		  <div style={{...styles.iconWrap, backgroundColor: 'var(--forest-light)', color: 'var(--forest-green)'}}>
			<Icon name="users" size={24} />
		  </div>
		  <div style={styles.statInfo}>
			<span style={styles.statLabel}>إجمالي الطلاب</span>
			<span style={styles.statValue}>{stats.studentsCount}</span>
		  </div>
		</div>

		<div style={styles.statCard}>
		  <div style={{...styles.iconWrap, backgroundColor: '#f0f9ff', color: '#0369a1'}}>
			<Icon name="book" size={24} />
		  </div>
		  <div style={styles.statInfo}>
			<span style={styles.statLabel}>الحلقات النشطة</span>
			<span style={styles.statValue}>{stats.halaqatCount}</span>
		  </div>
		</div>

		<div style={styles.statCard}>
		  <div style={{...styles.iconWrap, backgroundColor: '#fef2f2', color: '#b91c1c'}}>
			<Icon name="money" size={24} />
		  </div>
		  <div style={styles.statInfo}>
			<span style={styles.statLabel}>المصروفات</span>
			<span style={styles.statValue}>{stats.totalExpense} </span>
		  </div>
		</div>
		
		<div style={styles.statCard}>
		  <div style={{...styles.iconWrap, backgroundColor: '#f0fdf4', color: '#15803d'}}>
			<Icon name="money" size={24} />
		  </div>
		  <div style={styles.statInfo}>
			<span style={styles.statLabel}>الرصيد المتاح</span>
			<span style={styles.statValue}>{stats.totalIncome - stats.totalExpense} </span>
		  </div>
		</div>
	  </div>

	  <div style={styles.contentGrid}>
		<div style={styles.card}>
		  <h3 style={styles.cardTitle}>آخر الأخبار والتعاميم</h3>
		  {recentNews.length === 0 ? (
			<p style={{ color: 'var(--text-secondary)' }}>لا توجد أخبار منشورة.</p>
		  ) : (
			recentNews.map(news => (
			  <div key={news.id} style={styles.newsItem}>
				<span style={styles.newsDate}>{news.date || new Date(news.created_at).toLocaleDateString('ar-SA')}</span>
				<strong style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>{news.type}</strong>
				<p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{news.text}</p>
				<small style={{ display: 'block', marginTop: '8px', color: 'var(--forest-green)' }}>المصدر: {news.source}</small>
			  </div>
			))
		  )}
		</div>

		<div style={styles.card}>
		  <h3 style={styles.cardTitle}>وصول سريع</h3>
		  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
			<button style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--forest-green)', backgroundColor: 'var(--forest-light)', color: 'var(--forest-green)', fontWeight: 700, cursor: 'pointer' }}>تسجيل حضور اليوم</button>
			<button style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'transparent', color: 'var(--text-primary)', fontWeight: 700, cursor: 'pointer' }}>إضافة معاملة مالية</button>
		  </div>
		</div>
	  </div>
	</div>
  );
}