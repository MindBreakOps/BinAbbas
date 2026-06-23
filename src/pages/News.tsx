import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';

// دالة لترجمة النوع من الإنجليزية (قاعدة البيانات) إلى العربية (الواجهة)
const getTypeLabel = (type: string) => {
  if (type === 'hadeeth') return 'حديث شريف';
  if (type === 'feqh') return 'فقه';
  if (type === 'announcement') return 'إعلان إداري';
  return type || 'أخرى';
};

export default function News() {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // للتحكم بالبطاقات (أي بطاقة مفتوحة حالياً)
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // للتحكم بالمنشور المراد طباعته
  const [printingItem, setPrintingItem] = useState<any>(null);

  // States for CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ type: 'hadeeth', text: '', source: '', date: '' });

  const fetchNews = async () => {
	setIsLoading(true);
	try {
	  // جلب البيانات من جدول newspaper بناءً على الأعمدة الصحيحة فقط
	  const { data, error } = await supabase
		.from('newspaper')
		.select('id, type, text, source, date, created_at')
		.order('created_at', { ascending: false });

	  if (error) throw error;
	  if (data) setNews(data);
	} catch (err) {
	  console.error('Error fetching news:', err);
	} finally {
	  setIsLoading(false);
	}
  };

  useEffect(() => {
	fetchNews();
  }, []);

  const openCreateModal = () => {
	setEditingId(null);
	setFormData({ 
	  type: 'hadeeth', 
	  text: '', 
	  source: '', 
	  date: new Intl.DateTimeFormat('ar-SA-u-ca-islamic').format(new Date()) 
	});
	setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
	setEditingId(item.id);
	setFormData({
	  type: item.type || 'hadeeth',
	  text: item.text || '',
	  source: item.source || '',
	  date: item.date || ''
	});
	setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
	e.preventDefault();
	const payload = {
	  type: formData.type, // يتم حفظها كـ hadeeth أو feqh
	  text: formData.text,
	  source: formData.source,
	  date: formData.date
	};

	try {
	  if (editingId) {
		await supabase.from('newspaper').update(payload).eq('id', editingId);
	  } else {
		await supabase.from('newspaper').insert([payload]);
	  }
	  setIsModalOpen(false);
	  fetchNews();
	} catch (err) {
	  alert('حدث خطأ أثناء الحفظ');
	}
  };

  const handleDelete = async (id: string) => {
	if (!window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) return;
	await supabase.from('newspaper').delete().eq('id', id);
	fetchNews();
  };

  const triggerPrint = (item: any) => {
	setPrintingItem(item);
	// ننتظر قليلاً حتى يتم تحديث الـ DOM بالمنشور المختار قبل استدعاء نافذة الطباعة
	setTimeout(() => {
	  window.print();
	}, 150);
  };

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' },
	title: { fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-primary)' },
	subtitle: { fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 },
	btnPrimary: { backgroundColor: 'var(--forest-green)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' },
	grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', alignItems: 'start' },
	
	// ستايل البطاقة المصغرة والقابلة للتوسيع
	card: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: 'var(--shadow-sm)' },
	cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
	typeBadge: { backgroundColor: 'var(--forest-light)', color: 'var(--forest-green)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 },
	expandIcon: { color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700 },
	
	cardTextCollapsed: { fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
	cardTextExpanded: { fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-primary)', margin: '0 0 20px 0', whiteSpace: 'pre-wrap' },
	
	cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' },
	cardActions: { display: 'flex', gap: '12px' },
	iconBtnEdit: { background: 'none', border: 'none', color: 'var(--forest-green)', cursor: 'pointer', fontWeight: 700, padding: 0 },
	iconBtnDelete: { background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', fontWeight: 700, padding: 0 },
	iconBtnPrint: { background: 'none', border: 'none', color: '#0369a1', cursor: 'pointer', fontWeight: 700, padding: 0 },
	
	// المودال (النماذج)
	modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
	modalContent: { backgroundColor: '#fff', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '500px' },
	inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
	input: { padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontFamily: 'inherit' },
	textarea: { padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontFamily: 'inherit', minHeight: '120px', resize: 'vertical' }
  };

  return (
	<div>
	  {/* 
		ستايل الطباعة المزخرف (A4 Landscape) 
		نقوم بإخفاء كل شيء، ونظهر فقط الحاوية التي تحمل الـ ID: single-print-canvas
	  */}
	  <style>{`
		@media print {
		  body * { display: none !important; }
		  #single-print-canvas, #single-print-canvas * { display: block !important; }
		  
		  @page {
			size: A4 landscape;
			margin: 0;
		  }

		  #single-print-canvas {
			position: fixed;
			top: 0; left: 0;
			width: 297mm; height: 210mm;
			background-color: #fffdf7; /* لون ورق مائل للبيج */
			padding: 20mm;
			box-sizing: border-box;
			direction: rtl;
		  }

		  .print-border {
			position: absolute;
			top: 15mm; left: 15mm; right: 15mm; bottom: 15mm;
			border: 8px double #064e3b; /* أخضر إسلامي */
			outline: 2px solid #b45309; /* ذهبي */
			outline-offset: -12px;
			pointer-events: none;
			z-index: 1;
		  }

		  .print-content {
			position: relative;
			z-index: 2;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
		  }

		  .print-type {
			font-size: 28px;
			font-weight: 900;
			color: #b45309;
			border-bottom: 2px solid #064e3b;
			padding-bottom: 10px;
			margin-bottom: 30px;
			font-family: 'Traditional Arabic', serif;
		  }

		  .print-text {
			font-size: 32px;
			line-height: 2;
			color: #111827;
			font-family: 'Traditional Arabic', serif;
			max-width: 85%;
		  }

		  .print-source {
			margin-top: 40px;
			font-size: 22px;
			color: #064e3b;
			font-weight: bold;
		  }
		}
	  `}</style>

	  {/* الواجهة الرئيسية (تختفي وقت الطباعة) */}
	  <div className="no-print">
		<div style={styles.header}>
		  <div>
			<h2 style={styles.title}>النشرة وحائط الإعلانات</h2>
			<p style={styles.subtitle}>انقر على أي بطاقة لعرض محتواها أو طباعتها</p>
		  </div>
		  <button style={styles.btnPrimary} onClick={openCreateModal}>
			<Icon name="plus" size={16} /> إضافة منشور
		  </button>
		</div>

		{isLoading ? <p style={{ textAlign: 'center', padding: '40px' }}>جاري التحميل...</p> : (
		  <div style={styles.grid}>
			{news.map(item => {
			  const isExpanded = expandedId === item.id;
			  
			  return (
				<div 
				  key={item.id} 
				  style={{ ...styles.card, borderColor: isExpanded ? 'var(--forest-green)' : 'var(--border-subtle)' }}
				  onClick={() => setExpandedId(isExpanded ? null : item.id)} // التبديل بين الطي والتوسيع
				>
				  <div style={styles.cardHeader}>
					<span style={styles.typeBadge}>{getTypeLabel(item.type)}</span>
					<span style={styles.expandIcon}>{isExpanded ? '▲ طي' : '▼ توسيع'}</span>
				  </div>
				  
				  {/* المحتوى المطوي مقابل المحتوى الموسع */}
				  {isExpanded ? (
					<p style={styles.cardTextExpanded}>{item.text}</p>
				  ) : (
					<p style={styles.cardTextCollapsed}>{item.text}</p>
				  )}

				  {/* تظهر الأزرار والتفاصيل فقط إذا كانت البطاقة موسعة */}
				  {isExpanded && (
					<div style={styles.cardFooter} onClick={(e) => e.stopPropagation()}> 
					  {/* إيقاف الانتشار (Propagation) حتى لا تنغلق البطاقة عند النقر على الأزرار */}
					  <span>{item.source} {item.source && item.date && '-'} {item.date}</span>
					  
					  <div style={styles.cardActions}>
						<button style={styles.iconBtnPrint} onClick={() => triggerPrint(item)}>طباعة</button>
						<button style={styles.iconBtnEdit} onClick={() => openEditModal(item)}>تعديل</button>
						<button style={styles.iconBtnDelete} onClick={() => handleDelete(item.id)}>حذف</button>
					  </div>
					</div>
				  )}
				</div>
			  );
			})}
			{news.length === 0 && <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>لا توجد منشورات حالياً.</p>}
		  </div>
		)}
	  </div>

	  {/* نافذة الإضافة والتعديل */}
	  {isModalOpen && (
		<div className="no-print" style={styles.modalOverlay}>
		  <div style={styles.modalContent}>
			<h3 style={{ margin: '0 0 20px 0', fontWeight: 800 }}>{editingId ? 'تعديل المنشور' : 'إضافة منشور جديد'}</h3>
			<form onSubmit={handleSave}>
			  <div style={styles.inputGroup}>
				<label style={{ fontWeight: 700, fontSize: '0.9rem' }}>التصنيف (النوع)</label>
				<select style={styles.input} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
				  <option value="hadeeth">حديث شريف</option>
				  <option value="feqh">فقه</option>
				  <option value="announcement">إعلان إداري</option>
				  <option value="other">أخرى</option>
				</select>
			  </div>
			  <div style={styles.inputGroup}>
				<label style={{ fontWeight: 700, fontSize: '0.9rem' }}>النص (المحتوى)</label>
				<textarea required style={styles.textarea} value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} placeholder="اكتب نص الحديث أو الإعلان هنا..."></textarea>
			  </div>
			  <div style={{ display: 'flex', gap: '16px' }}>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={{ fontWeight: 700, fontSize: '0.9rem' }}>المصدر أو الراوي</label>
				  <input style={styles.input} value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} placeholder="مثال: رواه البخاري" />
				</div>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={{ fontWeight: 700, fontSize: '0.9rem' }}>التاريخ</label>
				  <input style={styles.input} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
				</div>
			  </div>
			  
			  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
				<button type="submit" style={{ ...styles.btnPrimary, flex: 1, justifyContent: 'center' }}>حفظ المنشور</button>
				<button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}>إلغاء</button>
			  </div>
			</form>
		  </div>
		</div>
	  )}

	  {/* 
		=========================================================
		شريحة الطباعة الفردية (تتغذى من الـ state `printingItem`)
		تظهر فقط في صفحة الطباعة للمتصفح 
		=========================================================
	  */}
	  {printingItem && (
		<div id="single-print-canvas">
		  <div className="print-border"></div>
		  <div className="print-content">
			<div className="print-type">{getTypeLabel(printingItem.type)}</div>
			<div className="print-text">{printingItem.text}</div>
			{(printingItem.source || printingItem.date) && (
			  <div className="print-source">
				{printingItem.source} {printingItem.source && printingItem.date ? ' | ' : ''} {printingItem.date}
			  </div>
			)}
		  </div>
		</div>
	  )}

	</div>
  );
}