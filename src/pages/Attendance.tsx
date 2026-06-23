import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Attendance() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
	const fetchStudentsAndAttendance = async () => {
	  setIsLoading(true);
	  // 1. جلب الطلاب
	  const { data: stdData } = await supabase.from('students').select('id, name, level').order('name');
	  if (stdData) setStudents(stdData);

	  // 2. جلب الحضور لليوم المحدد
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
	// تحديث الواجهة فوراً
	setAttendanceData(prev => ({ ...prev, [studentName]: status }));

	// الحفظ في قاعدة البيانات
	const { data: existing } = await supabase.from('attendance')
	  .select('id').eq('student_name', studentName).eq('date', selectedDate).single();

	if (existing) {
	  await supabase.from('attendance').update({ status }).eq('id', existing.id);
	} else {
	  await supabase.from('attendance').insert([{ student_name: studentName, date: selectedDate, status }]);
	}
  };

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' },
	title: { fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-primary)' },
	input: { padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontFamily: 'inherit', fontWeight: 700 },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right', border: '1px solid var(--border-subtle)' },
	th: { backgroundColor: 'var(--bg-app)', padding: '16px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 800 },
	td: { padding: '16px', borderBottom: '1px solid var(--border-subtle)' },
	btnGroup: { display: 'flex', gap: '8px' },
	btn: { padding: '6px 16px', border: '1px solid var(--border-subtle)', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, backgroundColor: '#fff', color: 'var(--text-secondary)' },
	btnActiveH: { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#166534' },
	btnActiveG: { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#991b1b' },
	btnActiveM: { backgroundColor: '#fef08a', color: '#854d0e', borderColor: '#854d0e' }
  };

  return (
	<div>
	  <div style={styles.header}>
		<div>
		  <h2 style={styles.title}>سجل الحضور والغياب اليومي</h2>
		</div>
		<input 
		  type="date" 
		  style={styles.input} 
		  value={selectedDate} 
		  onChange={(e) => setSelectedDate(e.target.value)} 
		/>
	  </div>

	  {isLoading ? <p>جاري التحميل...</p> : (
		<table style={styles.table}>
		  <thead>
			<tr>
			  <th style={styles.th}>اسم الطالب</th>
			  <th style={styles.th}>المستوى</th>
			  <th style={styles.th}>حالة الحضور</th>
			</tr>
		  </thead>
		  <tbody>
			{students.map(s => {
			  const status = attendanceData[s.name] || '';
			  return (
				<tr key={s.id}>
				  <td style={{ ...styles.td, fontWeight: 700 }}>{s.name}</td>
				  <td style={styles.td}>{s.level}</td>
				  <td style={styles.td}>
					<div style={styles.btnGroup}>
					  <button onClick={() => handleStatusChange(s.name, 'حاضر')} style={{ ...styles.btn, ...(status === 'حاضر' ? styles.btnActiveH : {}) }}>حاضر</button>
					  <button onClick={() => handleStatusChange(s.name, 'مستأذن')} style={{ ...styles.btn, ...(status === 'مستأذن' ? styles.btnActiveM : {}) }}>مستأذن</button>
					  <button onClick={() => handleStatusChange(s.name, 'غائب')} style={{ ...styles.btn, ...(status === 'غائب' ? styles.btnActiveG : {}) }}>غائب</button>
					</div>
				  </td>
				</tr>
			  );
			})}
			{students.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>لا يوجد طلاب مسجلين.</td></tr>}
		  </tbody>
		</table>
	  )}
	</div>
  );
}