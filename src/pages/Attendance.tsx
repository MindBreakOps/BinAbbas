import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';

export default function Attendance() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
	const fetchStudentsAndAttendance = async () => {
	  setIsLoading(true);
	  const { data: stdData } = await supabase.from('students').select('id, name, level').order('name');
	  if (stdData) setStudents(stdData);

	  const { data: attData } = await supabase.from('attendance').select('student_name, status').eq('date', selectedDate);
	  
	  const records: Record<string, string> = {};
	  if (attData) {
		attData.forEach(r => { records[r.student_name] = r.status; });
	  }
	  setAttendanceData(records);
	  setIsLoading(false);
	};

	fetchStudentsAndAttendance();
  }, [selectedDate]);

  const handleStatusChange = async (studentName: string, status: string) => {
	setAttendanceData(prev => ({ ...prev, [studentName]: status }));

	const { data: existing } = await supabase.from('attendance')
	  .select('id').eq('student_name', studentName).eq('date', selectedDate).single();

	if (existing) {
	  await supabase.from('attendance').update({ status }).eq('id', existing.id);
	} else {
	  await supabase.from('attendance').insert([{ student_name: studentName, date: selectedDate, status }]);
	}
  };

  // حساب الملخص
  const stats = { present: 0, excused: 0, absent: 0, unrecorded: 0 };
  students.forEach(s => {
	const st = attendanceData[s.name];
	if (st === 'حاضر') stats.present++;
	else if (st === 'مستأذن') stats.excused++;
	else if (st === 'غائب') stats.absent++;
	else stats.unrecorded++;
  });

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
	titleGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
	title: { fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#111827' },
	subtitle: { fontSize: '0.85rem', color: '#6b7280', margin: 0 },
	
	// شريط التحكم باليوم
	controlBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px 24px', marginBottom: '24px' },
	dateInputBox: { display: 'flex', alignItems: 'center', gap: '12px' },
	dateInput: { padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '6px', fontFamily: 'inherit', fontWeight: 800, color: '#111827', outline: 'none' },
	
	// بطاقات الملخص (Summary Badges)
	summaryGroup: { display: 'flex', gap: '12px' },
	summaryBadge: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 24px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' },
	summaryValue: { fontSize: '1.2rem', fontWeight: 900, color: '#111827' },
	summaryLabel: { fontSize: '0.75rem', fontWeight: 700, color: '#6b7280' },

	// الجدول
	card: { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
	th: { backgroundColor: '#f9fafb', padding: '14px 16px', borderBottom: '1px solid #e5e7eb', fontWeight: 800, fontSize: '0.8rem', color: '#4b5563', textTransform: 'uppercase' },
	td: { padding: '12px 16px', borderBottom: '1px solid #e5e7eb' },
	
	// أزرار الحضور (Segmented Controls)
	segmentGroup: { display: 'inline-flex', borderRadius: '6px', border: '1px solid #d1d5db', overflow: 'hidden' },
	segmentBtn: { flex: 1, padding: '8px 16px', border: 'none', backgroundColor: '#ffffff', color: '#4b5563', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.2s', borderLeft: '1px solid #d1d5db' },
	
	activePresent: { backgroundColor: '#10b981', color: '#ffffff' },
	activeExcused: { backgroundColor: '#f59e0b', color: '#ffffff' },
	activeAbsent: { backgroundColor: '#ef4444', color: '#ffffff' },
  };

  return (
	<div>
	  <div style={styles.header}>
		<div style={styles.titleGroup}>
		  <h2 style={styles.title}>الحضور والغياب</h2>
		  <p style={styles.subtitle}>سجل الحضور اليومي والمتابعة الدورية للطلاب</p>
		</div>
	  </div>

	  <div style={styles.controlBar}>
		<div style={styles.dateInputBox}>
		  <label style={{ fontWeight: 800, color: '#374151' }}>سجل يوم:</label>
		  <input 
			type="date" 
			style={styles.dateInput} 
			value={selectedDate} 
			onChange={(e) => setSelectedDate(e.target.value)} 
		  />
		</div>
		
		<div style={styles.summaryGroup}>
		  <div style={styles.summaryBadge}>
			<span style={{...styles.summaryValue, color: '#10b981'}}>{stats.present}</span>
			<span style={styles.summaryLabel}>حاضر</span>
		  </div>
		  <div style={styles.summaryBadge}>
			<span style={{...styles.summaryValue, color: '#f59e0b'}}>{stats.excused}</span>
			<span style={styles.summaryLabel}>مستأذن</span>
		  </div>
		  <div style={styles.summaryBadge}>
			<span style={{...styles.summaryValue, color: '#ef4444'}}>{stats.absent}</span>
			<span style={styles.summaryLabel}>غائب</span>
		  </div>
		  <div style={styles.summaryBadge}>
			<span style={{...styles.summaryValue, color: '#9ca3af'}}>{stats.unrecorded}</span>
			<span style={styles.summaryLabel}>لم يسجل</span>
		  </div>
		</div>
	  </div>

	  <div style={styles.card}>
		{isLoading ? <p style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>جاري تحميل الكشف...</p> : (
		  <table style={styles.table}>
			<thead>
			  <tr>
				<th style={styles.th}>اسم الطالب</th>
				<th style={styles.th}>المستوى الأكاديمي</th>
				<th style={styles.th}>إجراءات التسجيل</th>
			  </tr>
			</thead>
			<tbody>
			  {students.map(s => {
				const status = attendanceData[s.name] || '';
				return (
				  <tr key={s.id}>
					<td style={{ ...styles.td, fontWeight: 800, color: '#111827' }}>{s.name}</td>
					<td style={styles.td}>
					  <span style={{ backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', color: '#374151' }}>
						{s.level || '—'}
					  </span>
					</td>
					<td style={styles.td}>
					  <div style={styles.segmentGroup}>
						{/* زر الغياب (على اليسار) */}
						<button 
						  onClick={() => handleStatusChange(s.name, 'غائب')} 
						  style={{ ...styles.segmentBtn, borderLeft: 'none', ...(status === 'غائب' ? styles.activeAbsent : {}) }}
						>
						  غائب
						</button>
						{/* زر الاستئذان (في المنتصف) */}
						<button 
						  onClick={() => handleStatusChange(s.name, 'مستأذن')} 
						  style={{ ...styles.segmentBtn, ...(status === 'مستأذن' ? styles.activeExcused : {}) }}
						>
						  مستأذن
						</button>
						{/* زر الحضور (على اليمين) */}
						<button 
						  onClick={() => handleStatusChange(s.name, 'حاضر')} 
						  style={{ ...styles.segmentBtn, ...(status === 'حاضر' ? styles.activePresent : {}) }}
						>
						  حاضر
						</button>
					  </div>
					</td>
				  </tr>
				);
			  })}
			  {students.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>لا يوجد طلاب مسجلين في النظام.</td></tr>}
			</tbody>
		  </table>
		)}
	  </div>
	</div>
  );
}