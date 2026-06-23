import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [prayers, setPrayers] = useState<any>(null);
  
  const [stats, setStats] = useState({
	totalStudents: 0,
	monthSessions: 0,
	monthAvgExam: 0,
	bestHalaqa: '—',
  });

  useEffect(() => {
	const fetchDashboardData = async () => {
	  setIsLoading(true);
	  try {
		// 1. مواقيت الصلاة
		fetch('https://api.aladhan.com/v1/timingsByCity?city=Riyadh&country=Saudi%20Arabia&method=4')
		  .then(res => res.json())
		  .then(data => { if (data.data) setPrayers(data.data.timings); })
		  .catch(() => {});

		const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

		// 2. إجمالي الطلاب
		const { count: stdCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
		
		// 3. جلسات الشهر الحالي
		const { data: halaqat } = await supabase.from('halaqat').select('date, halqa');
		const monthHalaqat = halaqat?.filter(h => h.date?.startsWith(currentMonth)) || [];
		
		// 4. اختبارات الشهر الحالي
		const { data: exams } = await supabase.from('monthly_exams').select('exam_month, total, halqa_name');
		const monthExams = exams?.filter(e => e.exam_month === currentMonth) || [];
		
		let avgScore = 0;
		let bestHalqaName = '—';

		if (monthExams.length > 0) {
		  avgScore = Math.round(monthExams.reduce((sum, e) => sum + (e.total || 0), 0) / monthExams.length);
		  
		  const halqaScores: Record<string, number[]> = {};
		  monthExams.forEach(e => {
			const h = e.halqa_name || 'غير محدد';
			if (!halqaScores[h]) halqaScores[h] = [];
			halqaScores[h].push(e.total || 0);
		  });

		  let maxAvg = -1;
		  for (const [hName, scores] of Object.entries(halqaScores)) {
			const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
			if (avg > maxAvg) {
			  maxAvg = avg;
			  bestHalqaName = hName;
			}
		  }
		}

		setStats({
		  totalStudents: stdCount || 0,
		  monthSessions: monthHalaqat.length,
		  monthAvgExam: avgScore,
		  bestHalaqa: bestHalqaName
		});

	  } catch (error) {
		console.error("Dashboard Error:", error);
	  } finally {
		setIsLoading(false);
	  }
	};

	fetchDashboardData();
  }, []);

  const styles: { [key: string]: React.CSSProperties } = {
	header: { marginBottom: '32px' },
	title: { fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 8px 0' },
	subtitle: { fontSize: '0.85rem', color: '#6b7280', margin: 0 },
	sectionLabel: { fontSize: '0.75rem', fontWeight: 800, color: '#059669', letterSpacing: '0.5px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
	
	// تصميم بطاقات Operix بالضبط (زوايا طبيعية 12px، إطار رفيع، وظل خفيف جداً)
	topCardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' },
	card: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
	cardTopLine: { position: 'absolute', top: 0, left: 0, right: 0, height: '4px' },
	cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
	cardTitle: { fontSize: '0.7rem', fontWeight: 800, color: '#6b7280', margin: 0, textTransform: 'uppercase' },
	cardValue: { fontSize: '1.8rem', fontWeight: 800, color: '#111827', margin: 0 },
	
	// القسم السفلي (مواقيت الصلاة كمخطط زمني)
	bottomGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '24px' },
	panel: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
	panelTitle: { fontSize: '1rem', fontWeight: 800, color: '#111827', margin: '0 0 24px 0' },
	prayerRow: { display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f3f4f6' }
  };

  if (isLoading) return <p style={{ padding: '24px', color: '#6b7280' }}>جاري جلب المؤشرات الحية...</p>;

  return (
	<div>
	  <div style={styles.header}>
		<h1 style={styles.title}>التحليلات المؤسسية</h1>
		<p style={styles.subtitle}>مؤشرات الأداء الأكاديمي والعمليات المجمعة في الوقت الفعلي</p>
	  </div>

	  <div style={styles.sectionLabel}>
		<span>$</span> PERFORMANCE OVERVIEW
	  </div>

	  <div style={styles.topCardsGrid}>
		{/* البطاقة 1: خط أخضر */}
		<div style={styles.card}>
		  <div style={{ ...styles.cardTopLine, backgroundColor: '#10b981' }}></div>
		  <div style={styles.cardHeader}>
			<h4 style={styles.cardTitle}>إجمالي الطلاب</h4>
		  </div>
		  <p style={styles.cardValue}>{stats.totalStudents}</p>
		</div>

		{/* البطاقة 2: خط أحمر */}
		<div style={styles.card}>
		  <div style={{ ...styles.cardTopLine, backgroundColor: '#ef4444' }}></div>
		  <div style={styles.cardHeader}>
			<h4 style={styles.cardTitle}>جلسات هذا الشهر</h4>
		  </div>
		  <p style={styles.cardValue}>{stats.monthSessions}</p>
		</div>

		{/* البطاقة 3: خط أصفر */}
		<div style={styles.card}>
		  <div style={{ ...styles.cardTopLine, backgroundColor: '#f59e0b' }}></div>
		  <div style={styles.cardHeader}>
			<h4 style={styles.cardTitle}>متوسط درجات الشهر</h4>
		  </div>
		  <p style={styles.cardValue}>{stats.monthAvgExam}%</p>
		</div>

		{/* البطاقة 4: خط رمادي */}
		<div style={styles.card}>
		  <div style={{ ...styles.cardTopLine, backgroundColor: '#9ca3af' }}></div>
		  <div style={styles.cardHeader}>
			<h4 style={styles.cardTitle}>أفضل حلقة بالشهر</h4>
		  </div>
		  <p style={{...styles.cardValue, fontSize: '1.3rem', marginTop: '6px'}}>{stats.bestHalaqa}</p>
		</div>
	  </div>

	  <div style={styles.bottomGrid}>
		<div style={styles.panel}>
		  <h3 style={styles.panelTitle}>جدولة العمليات اليومية (مواقيت الصلاة - الرياض)</h3>
		  {prayers ? (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
			  <div style={styles.prayerRow}><strong style={{color: '#6b7280'}}>صلاة الفجر</strong><strong style={{color: '#111827'}}>{prayers.Fajr}</strong></div>
			  <div style={styles.prayerRow}><strong style={{color: '#6b7280'}}>صلاة الظهر</strong><strong style={{color: '#111827'}}>{prayers.Dhuhr}</strong></div>
			  <div style={styles.prayerRow}><strong style={{color: '#6b7280'}}>صلاة العصر</strong><strong style={{color: '#111827'}}>{prayers.Asr}</strong></div>
			  <div style={styles.prayerRow}><strong style={{color: '#6b7280'}}>صلاة المغرب</strong><strong style={{color: '#111827'}}>{prayers.Maghrib}</strong></div>
			  <div style={{...styles.prayerRow, borderBottom: 'none'}}><strong style={{color: '#6b7280'}}>صلاة العشاء</strong><strong style={{color: '#111827'}}>{prayers.Isha}</strong></div>
			</div>
		  ) : (
			<p style={{ color: '#6b7280' }}>جاري المزامنة مع الخادم...</p>
		  )}
		</div>
	  </div>
	</div>
  );
}