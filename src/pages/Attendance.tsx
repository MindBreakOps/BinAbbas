import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';
import { db, type Student } from '../lib/dexie';
import { Icon } from '../components/ui/Icons';
import styles from './Attendance.module.css';

export default function Attendance() {
  const { workspace } = useTenant();
  const [students, setStudents] = useState<Student[]>([]);
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [isSyncing, setIsSyncing] = useState(false);

  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  const weeks = [1, 2, 3, 4];

  const loadData = async () => {
	if (!workspace) return;
	
	// Load students
	const localStudents = await db.students
	  .where('workspace_id').equals(workspace.id)
	  .filter(s => s.sync_status !== 'pending_delete')
	  .toArray();
	
	localStudents.sort((a, b) => a.name.localeCompare(b.name));
	setStudents(localStudents);

	// Load attendance for this month
	const localAtt = await db.attendance
	  .where('workspace_id').equals(workspace.id)
	  .filter(a => a.month === month && a.sync_status !== 'pending_delete')
	  .toArray();

	const attMap: Record<string, string> = {};
	localAtt.forEach(a => { attMap[a.key] = a.status; });
	setAttendance(attMap);
  };

  const syncData = async () => {
	if (!navigator.onLine || !workspace) return;
	setIsSyncing(true);
	try {
	  const pending = await db.attendance.where('sync_status').anyOf(['pending_insert', 'pending_update']).toArray();
	  if (pending.length > 0) {
		const payload = pending.map(({ sync_status, ...rest }) => rest);
		const { error } = await supabase.from('attendance').upsert(payload, { onConflict: 'key,workspace_id' });
		if (!error) {
		  await db.transaction('rw', db.attendance, async () => {
			for (const item of pending) {
			  await db.attendance.update(item.key, { sync_status: 'synced' });
			}
		  });
		}
	  }

	  const { data: serverData, error } = await supabase.from('attendance').select('*');
	  if (!error && serverData) {
		const freshData = serverData.map(item => ({ ...item, sync_status: 'synced' }));
		await db.transaction('rw', db.attendance, async () => {
		  const localKeys = await db.attendance.where('workspace_id').equals(workspace.id).primaryKeys();
		  await db.attendance.bulkDelete(localKeys);
		  await db.attendance.bulkPut(freshData);
		});
		loadData();
	  }
	} catch (err) {
	  console.error('Sync failed:', err);
	} finally {
	  setIsSyncing(false);
	}
  };

  useEffect(() => {
	loadData();
	syncData();
  }, [workspace, month]);

  const toggleAttendance = (studentId: string, week: number, dayIdx: number) => {
	const key = `${studentId}_w${week}_d${dayIdx}`;
	const current = attendance[key] || '';
	const next = current === '' ? 'P' : current === 'P' ? 'A' : '';
	
	setAttendance(prev => ({ ...prev, [key]: next }));
  };

  const saveAttendance = async () => {
	if (!workspace) return;
	
	const records = Object.keys(attendance).map(key => ({
	  key,
	  workspace_id: workspace.id,
	  month,
	  status: attendance[key],
	  sync_status: 'pending_update' as const
	}));

	await db.attendance.bulkPut(records);
	alert('تم حفظ الحضور محلياً');
	syncData();
  };

  return (
	<div className={styles.container}>
	  <div className={styles.header}>
		<div className={styles.titleArea}>
		  <div className={styles.iconBox}><Icon name="cal" size={20} /></div>
		  <div>
			<h2 className={styles.title}>سجل الحضور الشهري</h2>
			<p className={styles.subtitle}>أحد — خميس، 4 أسابيع</p>
		  </div>
		</div>
		<div className={styles.actionButtons}>
		  <select className={styles.monthSelect} value={month} onChange={e => setMonth(e.target.value)}>
			{Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
			  <option key={m} value={m}>شهر {m}</option>
			))}
		  </select>
		  <button className={styles.btnOutline} onClick={syncData} disabled={isSyncing}>
			<Icon name="refresh" size={14} /> {isSyncing ? 'جاري المزامنة...' : 'مزامنة'}
		  </button>
		  <button className={styles.btnPrimary} onClick={saveAttendance}>
			<Icon name="save" size={14} /> حفظ السجل
		  </button>
		</div>
	  </div>

	  <div className={styles.card}>
		<div className={styles.tableWrap}>
		  <table className={styles.table}>
			<thead>
			  <tr>
				<th className={styles.nameCol}>اسم الطالب</th>
				{weeks.map(w => days.map((d, di) => (
				  <th key={`h_w${w}_d${di}`}>أ{w}</th>
				)))}
				<th>المج</th>
			  </tr>
			</thead>
			<tbody>
			  {students.length === 0 ? (
				<tr><td colSpan={22} style={{ padding: '30px' }}>لا يوجد طلاب</td></tr>
			  ) : (
				students.map(student => {
				  let presentCount = 0;
				  return (
					<tr key={student.id}>
					  <td className={styles.nameCol}><strong>{student.name}</strong></td>
					  {weeks.map(w => days.map((d, di) => {
						const key = `${student.id}_w${w}_d${di}`;
						const status = attendance[key] || '';
						if (status === 'P') presentCount++;
						
						let btnClass = styles.attBtn;
						let text = '-';
						if (status === 'P') { btnClass += ` ${styles.attBtnPresent}`; text = 'ح'; }
						if (status === 'A') { btnClass += ` ${styles.attBtnAbsent}`; text = 'غ'; }

						return (
						  <td key={key}>
							<button 
							  className={btnClass} 
							  onClick={() => toggleAttendance(student.id, w, di)}
							>
							  {text}
							</button>
						  </td>
						);
					  }))}
					  <td><span className={styles.badgeG}>{presentCount}</span></td>
					</tr>
				  );
				})
			  )}
			</tbody>
		  </table>
		</div>
	  </div>
	</div>
  );
}