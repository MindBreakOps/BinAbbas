import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { db } from '../lib/dexie';
import { Icon } from '../components/ui/Icons';
import styles from './Exams.module.css';

interface ExamRow {
  localId: string;
  student_name: string;
  s1: string; s2: string; s3: string; s4: string; s5: string;
  tajweed: string; tarteel: string; solok: string; mudawama: string; hifz: string;
}

export default function Exams() {
  const { workspace } = useTenant();
  const { user } = useAuth();
  
  const [halqa, setHalqa] = useState('الحلقة-الاولى');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [rows, setRows] = useState<ExamRow[]>([]);
  const [studentsList, setStudentsList] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
	if (workspace) {
	  db.students.where('workspace_id').equals(workspace.id).toArray().then(data => {
		setStudentsList(data.map(s => s.name));
	  });
	}
  }, [workspace]);

  const loadData = async () => {
	if (!workspace) return;
	const localData = await db.monthly_exams
	  .where('workspace_id').equals(workspace.id)
	  .filter(r => r.halqa_name === halqa && r.exam_month === month && r.sync_status !== 'pending_delete')
	  .toArray();

	if (localData.length > 0) {
	  setRows(localData.map(r => ({
		localId: r.id,
		student_name: r.student_name || '',
		s1: r.s1?.toString() || '',
		s2: r.s2?.toString() || '',
		s3: r.s3?.toString() || '',
		s4: r.s4?.toString() || '',
		s5: r.s5?.toString() || '',
		tajweed: r.tajweed?.toString() || '',
		tarteel: r.tarteel?.toString() || '',
		solok: r.solok?.toString() || '',
		mudawama: r.mudawama?.toString() || '',
		hifz: r.hifz?.toString() || ''
	  })));
	} else {
	  setRows([]);
	}
  };

  const syncData = async () => {
	if (!navigator.onLine || !workspace) return;
	setIsSyncing(true);
	try {
	  const pending = await db.monthly_exams.where('sync_status').anyOf(['pending_insert', 'pending_update']).toArray();
	  if (pending.length > 0) {
		const payload = pending.map(({ sync_status, ...rest }) => rest);
		const { error } = await supabase.from('monthly_exams').upsert(payload);
		if (!error) {
		  await db.transaction('rw', db.monthly_exams, async () => {
			for (const item of pending) {
			  await db.monthly_exams.update(item.id, { sync_status: 'synced' });
			}
		  });
		}
	  }

	  const { data: serverData, error } = await supabase.from('monthly_exams').select('*');
	  if (!error && serverData) {
		const freshData = serverData.map(item => ({ ...item, sync_status: 'synced' }));
		await db.transaction('rw', db.monthly_exams, async () => {
		  const localKeys = await db.monthly_exams.where('workspace_id').equals(workspace.id).primaryKeys();
		  await db.monthly_exams.bulkDelete(localKeys);
		  await db.monthly_exams.bulkPut(freshData);
		});
		loadData();
	  }
	} catch (err) {
	  console.error('Sync error:', err);
	} finally {
	  setIsSyncing(false);
	}
  };

  useEffect(() => { loadData(); syncData(); }, [workspace, halqa, month]);

  const addRow = () => {
	setRows([...rows, { localId: crypto.randomUUID(), student_name: '', s1: '', s2: '', s3: '', s4: '', s5: '', tajweed: '', tarteel: '', solok: '', mudawama: '', hifz: '' }]);
  };

  const updateRow = (index: number, field: keyof ExamRow, value: string) => {
	const newRows = [...rows];
	newRows[index][field] = value;
	setRows(newRows);
  };

  const removeRow = (index: number) => {
	setRows(rows.filter((_, i) => i !== index));
  };

  const calculateTotal = (row: ExamRow) => {
	const cols = ['s1', 's2', 's3', 's4', 's5', 'tajweed', 'tarteel', 'solok', 'mudawama', 'hifz'] as const;
	const hasAny = cols.some(c => row[c] !== '');
	if (!hasAny) return null;
	return cols.reduce((sum, col) => sum + (parseFloat(row[col]) || 0), 0);
  };

  const getTaqdeer = (total: number | null) => {
	if (total === null) return { lbl: '—', cls: '' };
	if (total >= 95) return { lbl: 'ممتاز+', cls: styles.badgeG };
	if (total >= 85) return { lbl: 'ممتاز', cls: styles.badgeG };
	if (total >= 75) return { lbl: 'جيد جداً', cls: styles.badgeO };
	if (total >= 65) return { lbl: 'جيد', cls: styles.badgeO };
	if (total >= 50) return { lbl: 'مقبول', cls: styles.badgeB };
	return { lbl: 'ضعيف', cls: styles.badgeR };
  };

  const saveExams = async () => {
	if (!workspace || !user) return;
	const validRows = rows.filter(r => r.student_name.trim() !== '');
	if (validRows.length === 0) return alert('لا توجد بيانات لحفظها');

	const payload = validRows.map(r => {
	  const total = calculateTotal(r);
	  return {
		id: r.localId,
		workspace_id: workspace.id,
		halqa_name: halqa,
		exam_month: month,
		student_name: r.student_name,
		teacher_id: user.id,
		s1: r.s1 ? parseFloat(r.s1) : null,
		s2: r.s2 ? parseFloat(r.s2) : null,
		s3: r.s3 ? parseFloat(r.s3) : null,
		s4: r.s4 ? parseFloat(r.s4) : null,
		s5: r.s5 ? parseFloat(r.s5) : null,
		tajweed: r.tajweed ? parseFloat(r.tajweed) : null,
		tarteel: r.tarteel ? parseFloat(r.tarteel) : null,
		solok: r.solok ? parseFloat(r.solok) : null,
		mudawama: r.mudawama ? parseFloat(r.mudawama) : null,
		hifz: r.hifz ? parseFloat(r.hifz) : null,
		total: total,
		taqdeer: getTaqdeer(total).lbl,
		sync_status: 'pending_insert' as const
	  };
	});

	await db.monthly_exams.bulkPut(payload);
	alert('تم حفظ الدرجات محلياً');
	syncData();
  };

  return (
	<div className={styles.container}>
	  <div className={styles.header}>
		<div className={styles.titleArea}>
		  <div className={styles.iconBox}><Icon name="file" size={20} /></div>
		  <div>
			<h2 className={styles.title}>الاختبار الشهري</h2>
			<p className={styles.subtitle}>تسجيل درجات الطلاب لكل حلقة</p>
		  </div>
		</div>
		<button className={styles.btnOutline} onClick={syncData} disabled={isSyncing}>
		  <Icon name="refresh" size={14} /> {isSyncing ? 'جاري المزامنة...' : 'مزامنة السجلات'}
		</button>
	  </div>

	  <div className={styles.instructionsCard}>
		<Icon name="book" size={24} color="var(--gold2)" />
		<div>
		  <div style={{ fontWeight: 700, color: 'var(--gold2)', marginBottom: '4px' }}>تعليمات إعداد ورقة الاختبار</div>
		  <div style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>
			التسميع ٥ فقرات × ١٠ = ٥٠ + التجويد ١٠ + الترتيل ١٠ + السلوك ١٠ + المداومة ١٠ + الحفظ الإجمالي ١٠ = <strong>١٠٠ درجة</strong>
		  </div>
		</div>
	  </div>

	  <div className={styles.controlsCard}>
		<div className={styles.inputGroup}>
		  <label className={styles.label}>الحلقة</label>
		  <select className={styles.input} value={halqa} onChange={e => setHalqa(e.target.value)}>
			<option value="الحلقة-الاولى">الحلقة الأولى</option>
			<option value="الحلقة-الثانية">الحلقة الثانية</option>
			<option value="الحلقة-الثالثة">الحلقة الثالثة</option>
		  </select>
		</div>
		<div className={styles.inputGroup}>
		  <label className={styles.label}>الشهر</label>
		  <input type="month" className={styles.input} dir="ltr" value={month} onChange={e => setMonth(e.target.value)} />
		</div>
		<div style={{ display: 'flex', gap: '8px' }}>
		  <button className={styles.btnOutline} onClick={addRow} style={{ border: '1px solid var(--gold)', color: 'var(--gold)' }}>
			<Icon name="plus" size={14} /> إضافة صف
		  </button>
		  <button className={styles.btnPrimary} onClick={saveExams}>
			<Icon name="save" size={14} /> حفظ السجل
		  </button>
		</div>
	  </div>

	  <div className={styles.tableWrap}>
		<table className={styles.table}>
		  <thead>
			<tr>
			  <th rowSpan={2} style={{ width: '30px' }}>#</th>
			  <th rowSpan={2} style={{ minWidth: '130px' }}>اسم الطالب</th>
			  <th colSpan={5} className={styles.thGreen}>التسميع (كل فقرة /١٠) = ٥٠</th>
			  <th rowSpan={2} className={styles.thBlue}>التجويد<br/><small>/١٠</small></th>
			  <th rowSpan={2} className={styles.thBlue}>الترتيل<br/><small>/١٠</small></th>
			  <th rowSpan={2} className={styles.thGold}>السلوك<br/><small>/١٠</small></th>
			  <th rowSpan={2} className={styles.thGold}>المداومة<br/><small>/١٠</small></th>
			  <th rowSpan={2} className={styles.thGold}>الحفظ<br/><small>/١٠</small></th>
			  <th rowSpan={2} className={styles.thGreen}>المجموع<br/><small>/١٠٠</small></th>
			  <th rowSpan={2}>التقدير</th>
			  <th rowSpan={2}>حذف</th>
			</tr>
			<tr>
			  <th className={styles.thGreen}>ف١</th>
			  <th className={styles.thGreen}>ف٢</th>
			  <th className={styles.thGreen}>ف٣</th>
			  <th className={styles.thGreen}>ف٤</th>
			  <th className={styles.thGreen}>ف٥</th>
			</tr>
		  </thead>
		  <tbody>
			{rows.length === 0 ? (
			  <tr><td colSpan={15} style={{ padding: '30px', color: 'var(--text3)' }}>لا توجد درجات مسجلة. اضغط "إضافة صف".</td></tr>
			) : (
			  rows.map((row, idx) => {
				const total = calculateTotal(row);
				const tq = getTaqdeer(total);
				return (
				  <tr key={row.localId}>
					<td>{idx + 1}</td>
					<td>
					  <input type="text" list="students-datalist" className={styles.nameInput} value={row.student_name} onChange={e => updateRow(idx, 'student_name', e.target.value)} />
					</td>
					{['s1', 's2', 's3', 's4', 's5', 'tajweed', 'tarteel', 'solok', 'mudawama', 'hifz'].map(col => (
					  <td key={col}>
						<input type="number" min="0" max="10" className={styles.gradeInput} value={row[col as keyof ExamRow]} onChange={e => updateRow(idx, col as keyof ExamRow, e.target.value)} />
					  </td>
					))}
					<td style={{ fontWeight: 800 }}>{total !== null ? total : ''}</td>
					<td><span className={`${styles.badge} ${tq.cls}`}>{tq.lbl}</span></td>
					<td>
					  <button className={styles.btnDanger} onClick={() => removeRow(idx)}><Icon name="trash" size={14} /></button>
					</td>
				  </tr>
				);
			  })
			)}
		  </tbody>
		</table>
		<datalist id="students-datalist">
		  {studentsList.map(name => <option key={name} value={name} />)}
		</datalist>
	  </div>
	</div>
  );
}