import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';

// واجهة (Interface) لتمثيل الحلقة المجمّعة بعد معالجة البيانات
interface GroupedHalaqah {
  name: string;
  teacher: string;
  studentsCount: number;
}

export default function Halaqat() {
  const { workspace } = useTenant();
  const [groupedHalaqat, setGroupedHalaqat] = useState<GroupedHalaqah[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
	const fetchAndGroupHalaqat = async () => {
	  if (!workspace) return;
	  setIsLoading(true);
	  
	  // جلب جميع السجلات من جدول halaqat 
	  const { data, error } = await supabase
		.from('halaqat')
		.select('halqa, teacher, student')
		.eq('workspace_id', workspace.id);

	  if (!error && data) {
		// تجميع السجلات حسب اسم الحلقة لمعرفة عدد الطلاب والمعلم
		const groups: Record<string, { teacher: string, students: Set<string> }> = {};
		
		data.forEach(record => {
		  if (!record.halqa) return;
		  
		  if (!groups[record.halqa]) {
			groups[record.halqa] = {
			  teacher: record.teacher || 'غير محدد',
			  students: new Set()
			};
		  }
		  
		  if (record.student) {
			groups[record.halqa].students.add(record.student);
		  }
		});

		// تحويل الكائن المجمّع إلى مصفوفة لعرضها
		const formattedArray = Object.keys(groups).map(halqaName => ({
		  name: halqaName,
		  teacher: groups[halqaName].teacher,
		  studentsCount: groups[halqaName].students.size
		}));

		setGroupedHalaqat(formattedArray);
	  }
	  setIsLoading(false);
	};

	fetchAndGroupHalaqat();
  }, [workspace]);

  // Inline CSS
  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' },
	titleArea: { margin: 0 },
	title: { fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' },
	subtitle: { fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 },
	btnPrimary: { backgroundColor: 'var(--forest-green)', color: '#ffffff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' },
	grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
	card: { border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '24px', backgroundColor: '#ffffff', transition: 'all 0.2s ease', boxShadow: 'var(--shadow-sm)' },
	cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
	halaqahName: { fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 },
	badge: { backgroundColor: 'var(--forest-light)', color: 'var(--forest-green)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 },
	infoGroup: { display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' },
	infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingBottom: '12px', borderBottom: '1px dashed var(--border-subtle)' },
	infoRowLast: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
	label: { color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, flexShrink: 0 },
	value: { color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 700, textAlign: 'left' }
  };

  return (
	<div>
	  <div style={styles.header}>
		<div style={styles.titleArea}>
		  <h2 style={styles.title}>إدارة الحلقات</h2>
		  <p style={styles.subtitle}>نظرة شاملة على الحلقات الدراسية، المعلمين، والطلاب المسجلين.</p>
		</div>
		<button style={styles.btnPrimary}>+ إضافة سجل جديد</button>
	  </div>

	  {isLoading ? (
		<p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>جاري تحميل البيانات الحقيقية...</p>
	  ) : groupedHalaqat.length === 0 ? (
		<div style={{ textAlign: 'center', padding: '60px', border: '1px dashed var(--border-subtle)', borderRadius: '12px' }}>
		  <p style={{ color: 'var(--text-secondary)' }}>لا توجد بيانات مسجلة في جدول الحلقات.</p>
		</div>
	  ) : (
		<div style={styles.grid}>
		  {groupedHalaqat.map((halaqah, index) => (
			<div key={index} style={styles.card}>
			  
			  <div style={styles.cardHeader}>
				<h3 style={styles.halaqahName}>{halaqah.name}</h3>
				<span style={styles.badge}>حلقة معتمدة</span>
			  </div>

			  <div style={styles.infoGroup}>
				<div style={styles.infoRow}>
				  <span style={styles.label}>المعلم المكلّف</span>
				  <span style={styles.value}>{halaqah.teacher}</span>
				</div>
				
				<div style={styles.infoRowLast}>
				  <span style={styles.label}>الطلاب المسجلين</span>
				  <span style={styles.value}>{halaqah.studentsCount} طلاب</span>
				</div>
			  </div>

			</div>
		  ))}
		</div>
	  )}
	</div>
  );
}