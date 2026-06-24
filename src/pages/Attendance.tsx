import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// أيقونات بسيطة للبطاقات
const Icons = {
  Present: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Excused: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Absent: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Unrecorded: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
};

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

  // الألوان الأساسية للثيم الجديد
  const theme = {
	primary: '#2A5D4E',
	lightBg: '#F9FAFB',
	cardBg: '#FFFFFF',
	border: '#E5E7EB',
	colors: {
	  present: { main: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
	  excused: { main: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
	  absent: { main: '#EF4444', bg: '#FEF2F2', border: '#FECACA' },
	  unrecorded: { main: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB' }
	}
  };

  const styles: { [key: string]: React.CSSProperties | any } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
	titleGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
	title: { fontSize: '1.8rem', fontWeight: 900, margin: 0, color: theme.primary, letterSpacing: '-0.5px' },
	subtitle: { fontSize: '0.9rem', color: '#6B7280', margin: 0, fontWeight: 600 },
	
	// شريط التحكم باليوم
	controlBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' },
	dateInputBox: { display: 'flex', alignItems: 'center', gap: '12px' },
	dateLabel: { fontWeight: 800, color: theme.primary, fontSize: '0.95rem' },
	dateInput: { padding: '10px 16px', border: `2px solid ${theme.border}`, borderRadius: '8px', fontFamily: 'inherit', fontWeight: 800, color: '#111827', outline: 'none', transition: 'border-color 0.2s', backgroundColor: theme.lightBg },
	
	// بطاقات الملخص
	summaryGroup: { display: 'flex', gap: '16px' },
	summaryBadge: (type: 'present' | 'excused' | 'absent' | 'unrecorded') => ({
	  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderRadius: '10px', 
	  backgroundColor: theme.colors[type].bg, border: `1px solid ${theme.colors[type].border}`
	}),
	summaryIconContainer: (type: 'present' | 'excused' | 'absent' | 'unrecorded') => ({
	  display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', 
	  borderRadius: '8px', backgroundColor: '#FFFFFF', color: theme.colors[type].main,
	  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
	}),
	summaryText: { display: 'flex', flexDirection: 'column' },
	summaryValue: (type: 'present' | 'excused' | 'absent' | 'unrecorded') => ({ fontSize: '1.25rem', fontWeight: 900, color: theme.colors[type].main, lineHeight: '1.2' }),
	summaryLabel: { fontSize: '0.75rem', fontWeight: 800, color: '#6B7280' },

	// الجدول
	card: { backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
	th: { backgroundColor: 'rgba(42, 93, 78, 0.03)', padding: '16px', borderBottom: `2px solid ${theme.border}`, fontWeight: 900, fontSize: '0.85rem', color: theme.primary },
	td: { padding: '16px', borderBottom: `1px solid ${theme.border}` },
	
	// أزرار الحضور (Pill Buttons)
	actionGroup: { display: 'flex', gap: '8px', alignItems: 'center' },
	btnBase: { padding: '8px 20px', borderRadius: '20px', border: '2px solid', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem', transition: 'all 0.2s', fontFamily: 'inherit' },
	
	// دوال مساعدة لستايل الأزرار بناءً على الحالة
	getBtnStyle: (type: 'present' | 'excused' | 'absent', currentStatus: string) => {
	  const isMatch = currentStatus === (type === 'present' ? 'حاضر' : type === 'excused' ? 'مستأذن' : 'غائب');
	  const colors = theme.colors[type];
	  return {
		...styles.btnBase,
		backgroundColor: isMatch ? colors.main : 'transparent',
		color: isMatch ? '#FFFFFF' : colors.main,
		borderColor: isMatch ? colors.main : colors.border,
		boxShadow: isMatch ? `0 2px 8px ${colors.main}40` : 'none',
	  };
	}
  };

  return (
	<div>
	  <div style={styles.header}>
		<div style={styles.titleGroup}>
		  <h2 style={styles.title}>سجل الحضور والغياب</h2>
		  <p style={styles.subtitle}>المتابعة اليومية لانتظام الطلاب في الحلقات الأكاديمية</p>
		</div>
	  </div>

	  <div style={styles.controlBar}>
		<div style={styles.dateInputBox}>
		  <label style={styles.dateLabel}>تاريخ السجل:</label>
		  <input 
			type="date" 
			style={styles.dateInput} 
			value={selectedDate} 
			onChange={(e) => setSelectedDate(e.target.value)} 
		  />
		</div>
		
		<div style={styles.summaryGroup}>
		  <div style={styles.summaryBadge('present')}>
			<div style={styles.summaryIconContainer('present')}><Icons.Present /></div>
			<div style={styles.summaryText}>
			  <span style={styles.summaryValue('present')}>{stats.present}</span>
			  <span style={styles.summaryLabel}>حاضر</span>
			</div>
		  </div>
		  <div style={styles.summaryBadge('excused')}>
			<div style={styles.summaryIconContainer('excused')}><Icons.Excused /></div>
			<div style={styles.summaryText}>
			  <span style={styles.summaryValue('excused')}>{stats.excused}</span>
			  <span style={styles.summaryLabel}>مستأذن</span>
			</div>
		  </div>
		  <div style={styles.summaryBadge('absent')}>
			<div style={styles.summaryIconContainer('absent')}><Icons.Absent /></div>
			<div style={styles.summaryText}>
			  <span style={styles.summaryValue('absent')}>{stats.absent}</span>
			  <span style={styles.summaryLabel}>غائب</span>
			</div>
		  </div>
		  <div style={styles.summaryBadge('unrecorded')}>
			<div style={styles.summaryIconContainer('unrecorded')}><Icons.Unrecorded /></div>
			<div style={styles.summaryText}>
			  <span style={styles.summaryValue('unrecorded')}>{stats.unrecorded}</span>
			  <span style={styles.summaryLabel}>لم يسجل</span>
			</div>
		  </div>
		</div>
	  </div>

	  <div style={styles.card}>
		{isLoading ? <p style={{ padding: '40px', textAlign: 'center', color: '#6b7280', fontWeight: 700 }}>جاري تحميل كشف الحضور...</p> : (
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
					<td style={{ ...styles.td, fontWeight: 800, color: '#111827', fontSize: '0.95rem' }}>{s.name}</td>
					<td style={styles.td}>
					  <span style={{ backgroundColor: theme.lightBg, border: `1px solid ${theme.border}`, padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#4B5563' }}>
						{s.level || 'غير محدد'}
					  </span>
					</td>
					<td style={styles.td}>
					  <div style={styles.actionGroup}>
						{/* زر الغياب */}
						<button 
						  onClick={() => handleStatusChange(s.name, 'غائب')} 
						  style={styles.getBtnStyle('absent', status)}
						>
						  غائب
						</button>
						{/* زر الاستئذان */}
						<button 
						  onClick={() => handleStatusChange(s.name, 'مستأذن')} 
						  style={styles.getBtnStyle('excused', status)}
						>
						  مستأذن
						</button>
						{/* زر الحضور */}
						<button 
						  onClick={() => handleStatusChange(s.name, 'حاضر')} 
						  style={styles.getBtnStyle('present', status)}
						>
						  حاضر
						</button>
					  </div>
					</td>
				  </tr>
				);
			  })}
			  {students.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: '#6b7280', fontWeight: 700 }}>لا يوجد طلاب مسجلين في النظام.</td></tr>}
			</tbody>
		  </table>
		)}
	  </div>
	</div>
  );
}