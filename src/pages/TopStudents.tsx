import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// أيقونة وسام بصيغة SVG
const MedalSVG = ({ fill }: { fill: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={fill} stroke="rgba(0,0,0,0.1)" strokeWidth="1">
	<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function TopStudents() {
  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // شهر البحث الافتراضي هو الشهر الحالي
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
	const fetchAndCalculate = async () => {
	  setIsLoading(true);

	  try {
		const { data: students } = await supabase.from('students').select('name, level');
		
		// جلب الاختبارات للشهر المحدد فقط
		const { data: exams } = await supabase.from('monthly_exams').select('student_name, total').eq('exam_month', selectedMonth);
		
		// جلب الحلقات وتصفيتها برمجياً للشهر المحدد
		const { data: halaqat } = await supabase.from('halaqat').select('student, grade, date').not('grade', 'is', null);
		const monthHalaqat = halaqat?.filter(h => h.date && h.date.startsWith(selectedMonth)) || [];
		
		// جلب الحضور وتصفيته للشهر المحدد
		const { data: attendance } = await supabase.from('attendance').select('student_name, date, status').eq('status', 'حاضر');
		const monthAttendance = attendance?.filter(a => a.date && a.date.startsWith(selectedMonth)) || [];

		if (students) {
		  const aggregated = students.map(student => {
			const sName = student.name;
			
			const sExams = exams?.filter(e => e.student_name === sName) || [];
			const examAvg = sExams.length ? sExams.reduce((s, e) => s + (e.total || 0), 0) / sExams.length : 0;
			
			const sHalaqat = monthHalaqat.filter(h => h.student === sName);
			const halaqatAvg = sHalaqat.length ? sHalaqat.reduce((s, h) => s + (h.grade || 0), 0) / sHalaqat.length : 0;
			
			const sAtt = monthAttendance.filter(a => a.student_name === sName);
			const attPoints = sAtt.length * 2;

			const totalScore = Math.round((examAvg * 0.5) + (halaqatAvg * 0.4) + attPoints);

			return { name: sName, level: student.level, examScore: Math.round(examAvg), halaqaScore: Math.round(halaqatAvg), attDays: sAtt.length, totalScore };
		  });

		  // ترتيب تنازلي وإحضار أفضل 20
		  const sorted = aggregated.sort((a, b) => b.totalScore - a.totalScore).filter(s => s.totalScore > 0).slice(0, 20);
		  setTopStudents(sorted);
		}
	  } catch (err) {
		console.error("Calculation Error:", err);
	  } finally {
		setIsLoading(false);
	  }
	};

	fetchAndCalculate();
  }, [selectedMonth]);

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '24px' },
	title: { fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0' },
	input: { padding: '10px', borderRadius: '4px', border: '1px solid var(--border-subtle)', fontFamily: 'inherit', fontWeight: 700 },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right', border: '1px solid var(--border-subtle)' },
	th: { padding: '16px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', fontWeight: 800 },
	td: { padding: '16px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700 }
  };

  return (
	<div>
	  <div style={styles.header}>
		<div>
		  <h2 style={styles.title}>لوحة الشرف والأوائل</h2>
		  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>تحليل شامل للمستويات (اختبارات، تسميع، حضور)</p>
		</div>
		<div>
		  <label style={{ marginLeft: '12px', fontWeight: 700 }}>شهر التقييم:</label>
		  <input type="month" style={styles.input} value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} />
		</div>
	  </div>

	  {isLoading ? <p>جاري حساب الدرجات...</p> : (
		<table style={styles.table}>
		  <thead>
			<tr>
			  <th style={styles.th}>المركز</th>
			  <th style={styles.th}>الطالب</th>
			  <th style={styles.th}>المستوى</th>
			  <th style={styles.th}>الاختبارات</th>
			  <th style={styles.th}>التسميع</th>
			  <th style={styles.th}>الحضور</th>
			  <th style={styles.th}>المجموع النهائي</th>
			</tr>
		  </thead>
		  <tbody>
			{topStudents.map((s, idx) => (
			  <tr key={idx} style={{ backgroundColor: idx < 3 ? 'var(--forest-light)' : 'transparent' }}>
				<td style={styles.td}>
				  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
					{idx + 1}
					{idx === 0 && <MedalSVG fill="#eab308" />}
					{idx === 1 && <MedalSVG fill="#94a3b8" />}
					{idx === 2 && <MedalSVG fill="#d97706" />}
				  </div>
				</td>
				<td style={styles.td}>{s.name}</td>
				<td style={styles.td}>{s.level}</td>
				<td style={styles.td}>{s.examScore}%</td>
				<td style={styles.td}>{s.halaqaScore}%</td>
				<td style={styles.td}>{s.attDays} يوم</td>
				<td style={{ ...styles.td, color: 'var(--forest-green)', fontWeight: 900, fontSize: '1.2rem' }}>{s.totalScore}</td>
			  </tr>
			))}
			{topStudents.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>لا توجد بيانات لهذا الشهر.</td></tr>}
		  </tbody>
		</table>
	  )}
	</div>
  );
}