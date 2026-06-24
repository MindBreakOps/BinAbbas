import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';

const theme = {
  darkGreen: '#064e3b', gold: '#d97706', cream: '#fffdf7', white: '#ffffff',
  textDark: '#111827', textGray: '#4b5563', borderLight: '#e5e7eb', borderGold: 'rgba(217, 119, 6, 0.3)'
};

export default function StudentResults() {
  const [results, setResults] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('الكل');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ student_name: '', exam_type: 'شهري', period: '', total_score: '', juz_memorized: '', notes: '' });

  const fetchData = async () => {
	setIsLoading(true);
	const { data: stdData } = await supabase.from('students').select('name').order('name');
	if (stdData) setStudents(stdData);

	const { data: resData } = await supabase.from('student_results').select('*').order('created_at', { ascending: false });
	if (resData) setResults(resData);
	setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e: React.FormEvent) => {
	e.preventDefault();
	await supabase.from('student_results').insert([{
	  ...formData,
	  total_score: formData.total_score ? parseInt(formData.total_score) : null,
	  juz_memorized: formData.juz_memorized ? parseInt(formData.juz_memorized) : null
	}]);
	setIsModalOpen(false);
	fetchData();
  };

  const filteredResults = filterType === 'الكل' ? results : results.filter(r => r.exam_type === filterType);

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', borderBottom: `2px solid ${theme.borderLight}`, paddingBottom: '24px' },
	title: { fontSize: '1.6rem', fontWeight: 900, color: theme.darkGreen, margin: '0 0 8px 0' },
	subtitle: { fontSize: '0.95rem', color: theme.textGray, margin: 0 },
	card: { backgroundColor: theme.white, border: `1px solid ${theme.borderGold}`, borderRadius: '4px', overflow: 'hidden', borderTop: `4px solid ${theme.gold}` },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
	th: { backgroundColor: theme.cream, color: theme.textDark, fontWeight: 900, padding: '16px', borderBottom: `1px solid ${theme.borderGold}` },
	td: { padding: '16px', borderBottom: `1px solid ${theme.borderLight}`, color: theme.textDark, fontWeight: 600 },
	btnPrimary: { backgroundColor: theme.gold, color: theme.white, border: `1px solid ${theme.gold}`, padding: '10px 20px', borderRadius: '4px', fontWeight: 900, cursor: 'pointer' },
	selectFilter: { padding: '8px', borderRadius: '4px', border: `1px solid ${theme.borderGold}`, outline: 'none', fontWeight: 800, color: theme.darkGreen },
	modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 78, 59, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
	inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
	input: { padding: '10px', borderRadius: '4px', border: `1px solid ${theme.borderLight}`, outline: 'none' }
  };

  return (
	<div>
	  <div style={styles.header}>
		<div>
		  <h2 style={styles.title}>النتائج الدورية ومقدار الحفظ</h2>
		  <p style={styles.subtitle}>سجل نتائج الاختبارات الشهرية والفصلية وعدد الأجزاء المحفوظة</p>
		</div>
		<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
		  <select style={styles.selectFilter} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
			<option value="الكل">عرض الكل</option><option value="شهري">الاختبارات الشهرية</option><option value="فصلي">الاختبارات الفصلية</option>
		  </select>
		  <button style={styles.btnPrimary} onClick={() => { setFormData({ student_name: students[0]?.name || '', exam_type: 'شهري', period: '', total_score: '', juz_memorized: '', notes: '' }); setIsModalOpen(true); }}>
			+ رصد نتيجة جديدة
		  </button>
		</div>
	  </div>

	  <div style={styles.card}>
		{isLoading ? <p style={{ padding: '32px', textAlign: 'center' }}>جاري التحميل...</p> : (
		  <table style={styles.table}>
			<thead>
			  <tr><th style={styles.th}>اسم الطالب</th><th style={styles.th}>نوع الاختبار</th><th style={styles.th}>الفترة / الشهر</th><th style={styles.th}>الدرجة (%)</th><th style={styles.th}>الأجزاء المحفوظة</th><th style={styles.th}>ملاحظات</th></tr>
			</thead>
			<tbody>
			  {filteredResults.map(r => (
				<tr key={r.id}>
				  <td style={{ ...styles.td, color: theme.darkGreen, fontWeight: 900 }}>{r.student_name}</td>
				  <td style={styles.td}>
					<span style={{ backgroundColor: r.exam_type === 'فصلي' ? theme.gold : theme.cream, color: r.exam_type === 'فصلي' ? theme.white : theme.darkGreen, padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800 }}>{r.exam_type}</span>
				  </td>
				  <td style={styles.td}>{r.period}</td>
				  <td style={{ ...styles.td, color: r.total_score >= 90 ? '#166534' : '#b91c1c', fontWeight: 900 }}>{r.total_score}%</td>
				  <td style={{ ...styles.td, fontWeight: 900 }}>{r.juz_memorized} أجزاء</td>
				  <td style={{ ...styles.td, color: theme.textGray, fontSize: '0.85rem' }}>{r.notes || '—'}</td>
				</tr>
			  ))}
			  {filteredResults.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>لا توجد نتائج مسجلة.</td></tr>}
			</tbody>
		  </table>
		)}
	  </div>

	  {isModalOpen && (
		<div style={styles.modalOverlay}>
		  <div style={{ backgroundColor: theme.cream, padding: '32px', borderRadius: '4px', width: '550px', border: `2px solid ${theme.gold}` }}>
			<h3 style={{ margin: '0 0 24px 0', color: theme.darkGreen, fontWeight: 900 }}>رصد نتيجة واعتماد أجزاء</h3>
			<form onSubmit={handleSave}>
			  <div style={{ display: 'flex', gap: '16px' }}>
				<div style={{...styles.inputGroup, flex: 2}}><label style={{fontWeight: 900}}>الطالب</label>
				  <select required style={styles.input} value={formData.student_name} onChange={e => setFormData({...formData, student_name: e.target.value})}>
					{students.map((s, idx) => <option key={idx} value={s.name}>{s.name}</option>)}
				  </select>
				</div>
				<div style={{...styles.inputGroup, flex: 1}}><label style={{fontWeight: 900}}>نوع الاختبار</label>
				  <select style={styles.input} value={formData.exam_type} onChange={e => setFormData({...formData, exam_type: e.target.value})}><option>شهري</option><option>فصلي</option></select>
				</div>
			  </div>

			  <div style={{ display: 'flex', gap: '16px' }}>
				<div style={{...styles.inputGroup, flex: 2}}><label style={{fontWeight: 900}}>الفترة (مثال: ربيع الأول / ربع أول)</label><input required style={styles.input} value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} /></div>
				<div style={{...styles.inputGroup, flex: 1}}><label style={{fontWeight: 900}}>الدرجة النهائية</label><input type="number" required max="100" style={styles.input} value={formData.total_score} onChange={e => setFormData({...formData, total_score: e.target.value})} /></div>
			  </div>

			  <div style={styles.inputGroup}><label style={{fontWeight: 900}}>عدد الأجزاء التي أتم حفظها ومراجعتها</label><input type="number" max="30" required style={styles.input} value={formData.juz_memorized} onChange={e => setFormData({...formData, juz_memorized: e.target.value})} /></div>
			  <div style={styles.inputGroup}><label style={{fontWeight: 900}}>ملاحظات إضافية</label><input style={styles.input} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} /></div>
			  
			  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
				<button type="submit" style={{...styles.btnPrimary, flex: 1}}>حفظ النتيجة</button>
				<button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', border: `1px solid ${theme.borderLight}`, background: theme.white, cursor: 'pointer', fontWeight: 800 }}>إلغاء</button>
			  </div>
			</form>
		  </div>
		</div>
	  )}
	</div>
  );
}