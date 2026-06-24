import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';
import { useTenant } from '../context/TenantContext';

export default function FinancialOverview() {
  const { workspace } = useTenant();
  const [isLoading, setIsLoading] = useState(true);
  const [financials, setFinancials] = useState<any[]>([]);
  
  const [stats, setStats] = useState({ income: 0, expense: 0, budget: 0, balance: 0 });

  useEffect(() => {
	const fetchData = async () => {
	  setIsLoading(true);
	  const { data } = await supabase.from('financials').select('*').order('date', { ascending: false });
	  
	  if (data) {
		setFinancials(data);
		let inc = 0, exp = 0, bud = 0;
		data.forEach(item => {
		  const amt = Number(item.amount || 0);
		  if (item.type === 'إيراد') inc += amt;
		  else if (item.type === 'مصروف') exp += amt;
		  else if (item.type === 'ميزانية') bud += amt;
		});
		setStats({ income: inc, expense: exp, budget: bud, balance: inc - exp });
	  }
	  setIsLoading(false);
	};
	fetchData();
  }, []);

  const handlePrint = () => { window.print(); };

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
	title: { fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 8px 0' },
	subtitle: { fontSize: '0.85rem', color: '#6b7280', margin: 0 },
	btnPrint: { backgroundColor: '#111827', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 800, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' },
	
	// تصميم بطاقات Operix (Sharp Edges, Top Colored Line)
	grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' },
	card: { backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
	cardTopLine: { position: 'absolute', top: 0, left: 0, right: 0, height: '4px' },
	cardTitle: { fontSize: '0.75rem', fontWeight: 800, color: '#6b7280', margin: '0 0 16px 0', textTransform: 'uppercase' },
	cardValue: { fontSize: '1.8rem', fontWeight: 900, color: '#111827', margin: 0 },
	
	// جدول العمليات الأخيرة
	tableSection: { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '24px' },
	tableTitle: { fontSize: '1.1rem', fontWeight: 800, color: '#111827', margin: '0 0 16px 0', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' },
	tableRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }
  };

  return (
	<div>
	  {/* ستايل التقرير المطبوع (PDF) */}
	  <style>{`
		@media print {
		  body * { display: none !important; }
		  #financial-report, #financial-report * { display: block !important; }
		  @page { size: A4 portrait; margin: 20mm; }
		  
		  #financial-report {
			position: absolute; top: 0; left: 0; width: 100%;
			background-color: #fff; direction: rtl; font-family: 'Traditional Arabic', serif;
		  }
		  .rep-header { text-align: center; border-bottom: 2px solid #111827; padding-bottom: 20px; margin-bottom: 30px; }
		  .rep-org { font-size: 24px; font-weight: bold; color: #111827; }
		  .rep-title { font-size: 28px; font-weight: 900; margin-top: 10px; }
		  .rep-date { font-size: 14px; color: #666; margin-top: 5px; }
		  
		  .rep-summary { display: flex; justify-content: space-between; margin-bottom: 40px; border: 1px solid #ccc; padding: 20px; background: #fafafa; }
		  .rep-sum-item { text-align: center; }
		  .rep-sum-label { font-size: 16px; font-weight: bold; color: #444; }
		  .rep-sum-val { font-size: 24px; font-weight: 900; color: #000; margin-top: 10px; }
		  
		  .rep-table { width: 100%; border-collapse: collapse; margin-bottom: 50px; }
		  .rep-table th, .rep-table td { border: 1px solid #ccc; padding: 10px; text-align: right; }
		  .rep-table th { background: #eee; font-weight: bold; }
		  
		  .rep-signatures { display: flex; justify-content: space-around; margin-top: 80px; text-align: center; font-weight: bold; }
		}
	  `}</style>

	  {/* الواجهة الرقمية */}
	  <div className="no-print">
		<div style={styles.header}>
		  <div><h1 style={styles.title}>الملخص المالي الشامل (FMIS)</h1><p style={styles.subtitle}>مراقبة الأداء المالي، الإيرادات، والمصروفات</p></div>
		  <button style={styles.btnPrint} onClick={handlePrint}><Icon name="file" size={16} /> تصدير التقرير (PDF)</button>
		</div>

		{isLoading ? <p>جاري تجميع البيانات المالية...</p> : (
		  <>
			<div style={styles.grid}>
			  <div style={styles.card}>
				<div style={{ ...styles.cardTopLine, backgroundColor: '#10b981' }}></div>
				<h4 style={styles.cardTitle}>إجمالي الإيرادات</h4>
				<p style={styles.cardValue}>{stats.income.toLocaleString()}</p>
			  </div>
			  <div style={styles.card}>
				<div style={{ ...styles.cardTopLine, backgroundColor: '#ef4444' }}></div>
				<h4 style={styles.cardTitle}>إجمالي المصروفات</h4>
				<p style={styles.cardValue}>{stats.expense.toLocaleString()}</p>
			  </div>
			  <div style={styles.card}>
				<div style={{ ...styles.cardTopLine, backgroundColor: '#3b82f6' }}></div>
				<h4 style={styles.cardTitle}>صافي الصندوق (Balance)</h4>
				<p style={{...styles.cardValue, color: stats.balance >= 0 ? '#10b981' : '#ef4444'}}>{stats.balance.toLocaleString()}</p>
			  </div>
			  <div style={styles.card}>
				<div style={{ ...styles.cardTopLine, backgroundColor: '#f59e0b' }}></div>
				<h4 style={styles.cardTitle}>الميزانية المعتمدة</h4>
				<p style={styles.cardValue}>{stats.budget.toLocaleString()}</p>
			  </div>
			</div>

			<div style={styles.tableSection}>
			  <h3 style={styles.tableTitle}>آخر العمليات المالية المسجلة</h3>
			  {financials.slice(0, 10).map((f, i) => (
				<div key={i} style={styles.tableRow}>
				  <div>
					<strong style={{ display: 'block', fontSize: '0.9rem', color: '#111827' }}>{f.description || f.category}</strong>
					<span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{f.date} • {f.type}</span>
				  </div>
				  <strong style={{ fontSize: '1rem', color: f.type === 'مصروف' ? '#ef4444' : f.type === 'إيراد' ? '#10b981' : '#f59e0b' }}>
					{f.type === 'مصروف' ? '-' : '+'}{Number(f.amount).toLocaleString()} ر.س
				  </strong>
				</div>
			  ))}
			  {financials.length === 0 && <p style={{ color: '#6b7280', textAlign: 'center' }}>لا توجد عمليات مسجلة.</p>}
			</div>
		  </>
		)}
	  </div>

	  {/* تقرير الطباعة الرسمي A4 (مخفي بالشاشة) */}
	  <div id="financial-report" style={{ display: 'none' }}>
		<div className="rep-header">
		  <div className="rep-org">{workspace?.name || 'مركز تحفيظ القرآن الكريم'}</div>
		  <div className="rep-title">التقرير المالي الشامل</div>
		  <div className="rep-date">تاريخ الإصدار: {new Date().toLocaleDateString('ar-SA')}</div>
		</div>

		<div className="rep-summary">
		  <div className="rep-sum-item">
			<div className="rep-sum-label">إجمالي الإيرادات</div>
			<div className="rep-sum-val">{stats.income.toLocaleString()} ر.س</div>
		  </div>
		  <div className="rep-sum-item">
			<div className="rep-sum-label">إجمالي المصروفات</div>
			<div className="rep-sum-val">{stats.expense.toLocaleString()} ر.س</div>
		  </div>
		  <div className="rep-sum-item">
			<div className="rep-sum-label">صافي الرصيد الحالي</div>
			<div className="rep-sum-val">{stats.balance.toLocaleString()} ر.س</div>
		  </div>
		</div>

		<h3 style={{ marginBottom: '15px' }}>سجل الحركات المالية المعتمدة:</h3>
		<table className="rep-table">
		  <thead>
			<tr><th>التاريخ</th><th>نوع الحركة</th><th>التصنيف</th><th>البيان</th><th>المبلغ (ر.س)</th></tr>
		  </thead>
		  <tbody>
			{financials.map((f, i) => (
			  <tr key={i}>
				<td>{f.date}</td>
				<td style={{ fontWeight: 'bold' }}>{f.type}</td>
				<td>{f.category}</td>
				<td>{f.description}</td>
				<td style={{ fontWeight: 'bold', direction: 'ltr' }}>{Number(f.amount).toLocaleString()}</td>
			  </tr>
			))}
		  </tbody>
		</table>

		<div className="rep-signatures">
		  <div>المحاسب المالي<br/><br/>__________________</div>
		  <div>المدير العام<br/><br/>__________________</div>
		  <div>ختم الإدارة<br/><br/></div>
		</div>
	  </div>
	</div>
  );
}