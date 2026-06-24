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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [printingItem, setPrintingItem] = useState<any>(null);

  // States for CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ type: 'hadeeth', text: '', source: '', date: '' });

  const fetchNews = async () => {
	setIsLoading(true);
	try {
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
	  type: formData.type,
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
	// ننتظر حتى يتم تفعيل الشريحة في الـ DOM ثم نستدعي الطباعة
	setTimeout(() => {
	  window.print();
	  // تنظيف المتغير بعد إغلاق نافذة الطباعة
	  setTimeout(() => setPrintingItem(null), 500);
	}, 200);
  };

  // الألوان الأساسية للثيم الجديد
  const theme = {
	primary: '#2A5D4E',
	primaryLight: '#E0EFDF',
	cardBg: '#FFFFFF',
	border: '#E5E7EB',
	textMain: '#111827',
	textMuted: '#6B7280',
	gold: '#B45309'
  };

  const styles: { [key: string]: React.CSSProperties | any } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` },
	titleGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
	title: { fontSize: '1.8rem', fontWeight: 900, margin: 0, color: theme.primary, letterSpacing: '-0.5px' },
	subtitle: { fontSize: '0.9rem', color: theme.textMuted, margin: 0, fontWeight: 600 },
	
	btnPrimary: { backgroundColor: theme.primary, color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '24px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', boxShadow: '0 4px 12px rgba(42, 93, 78, 0.2)', transition: 'all 0.2s' },
	
	grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', alignItems: 'start' },
	
	card: { backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' },
	cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
	typeBadge: { backgroundColor: theme.primaryLight, color: theme.primary, padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 900 },
	expandIcon: { color: theme.textMuted, fontSize: '0.8rem', fontWeight: 800, padding: '4px 8px', borderRadius: '8px', backgroundColor: '#F3F4F6' },
	
	cardTextCollapsed: { fontSize: '0.95rem', color: theme.textMuted, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 },
	cardTextExpanded: { fontSize: '1.1rem', lineHeight: 1.8, color: theme.textMain, margin: '0 0 24px 0', whiteSpace: 'pre-wrap', fontWeight: 700 },
	
	cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${theme.border}`, paddingTop: '16px', marginTop: '16px', fontSize: '0.85rem', color: theme.textMuted, fontWeight: 600 },
	cardActions: { display: 'flex', gap: '8px' },
	iconBtn: { background: '#F3F4F6', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontWeight: 800, fontSize: '0.8rem', transition: 'background 0.2s' },
	
	// المودال
	modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
	modalContent: { backgroundColor: '#fff', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
	inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
	label: { fontWeight: 800, fontSize: '0.9rem', color: theme.primary },
	input: { padding: '12px 16px', borderRadius: '12px', border: `2px solid ${theme.border}`, fontFamily: 'inherit', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s', fontWeight: 600 },
	textarea: { padding: '12px 16px', borderRadius: '12px', border: `2px solid ${theme.border}`, fontFamily: 'inherit', fontSize: '0.95rem', minHeight: '140px', resize: 'vertical', outline: 'none', fontWeight: 600 }
  };

  return (
	<div>
	  {/* ستايل الطباعة (A4 Landscape) 
		تصميم إسلامي فاخر مخصص للطباعة فقط
	  */}
	  <style>{`
		@media screen {
		  .print-only { display: none !important; }
		}
		@media print {
		  @page { size: A4 landscape; margin: 0; }
		  body * { visibility: hidden; }
		  
		  .print-only, .print-only * { visibility: visible; }
		  
		  .print-only {
			position: absolute;
			left: 0; top: 0;
			width: 297mm; height: 210mm;
			padding: 12mm;
			box-sizing: border-box;
			direction: rtl;
			background-color: #FCFBF7 !important; /* لون عاجي فاتح جداً */
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
			display: flex !important;
		  }

		  /* الإطار الخارجي الأخضر */
		  .print-frame-outer {
			flex: 1;
			border: 6px solid ${theme.primary};
			padding: 4px;
			box-sizing: border-box;
		  }

		  /* الإطار الداخلي الذهبي مع الزخرفة */
		  .print-frame-inner {
			flex: 1;
			border: 2px solid ${theme.gold};
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 40px;
			box-sizing: border-box;
			position: relative;
			background: radial-gradient(circle at center, #FFFFFF 40%, #FCFBF7 100%) !important;
		  }

		  /* زوايا الإطار (تصميم هندسي بسيط) */
		  .corner-ornament {
			position: absolute;
			width: 30px; height: 30px;
			background-color: ${theme.primary};
			border: 2px solid ${theme.gold};
			transform: rotate(45deg);
		  }
		  .c-tl { top: -15px; left: -15px; }
		  .c-tr { top: -15px; right: -15px; }
		  .c-bl { bottom: -15px; left: -15px; }
		  .c-br { bottom: -15px; right: -15px; }

		  /* ترويسة الطباعة */
		  .print-header-brand {
			position: absolute;
			top: 30px;
			text-align: center;
			width: 100%;
		  }
		  .print-system-name {
			font-size: 20px;
			font-weight: 900;
			color: ${theme.primary};
			letter-spacing: 1px;
			font-family: 'Amiri', 'Traditional Arabic', serif;
		  }
		  .print-divider-line {
			width: 150px;
			height: 2px;
			background-color: ${theme.gold};
			margin: 8px auto 0;
			position: relative;
		  }
		  .print-divider-line::after {
			content: '';
			position: absolute;
			top: -3px; left: calc(50% - 4px);
			width: 8px; height: 8px;
			background-color: ${theme.primary};
			transform: rotate(45deg);
		  }

		  /* المحتوى النصي */
		  .print-type-title {
			font-size: 32px;
			font-weight: bold;
			color: ${theme.gold};
			margin-bottom: 30px;
			font-family: 'Amiri', 'Traditional Arabic', serif;
			border-bottom: 1px dashed ${theme.gold};
			padding-bottom: 10px;
		  }

		  .print-main-text {
			font-size: 38px;
			line-height: 1.8;
			color: #111827;
			text-align: center;
			max-width: 85%;
			font-family: 'Amiri', 'Traditional Arabic', serif;
			font-weight: bold;
		  }

		  .print-footer-details {
			position: absolute;
			bottom: 40px;
			font-size: 24px;
			color: ${theme.primary};
			font-weight: bold;
			font-family: 'Amiri', 'Traditional Arabic', serif;
			display: flex;
			gap: 20px;
			align-items: center;
		  }
		}
	  `}</style>

	  {/* الواجهة الرئيسية (تختفي وقت الطباعة) */}
	  <div className="no-print">
		<div style={styles.header}>
		  <div style={styles.titleGroup}>
			<h2 style={styles.title}>النشرة والإعلانات</h2>
			<p style={styles.subtitle}>إدارة الحائط الإعلاني والأحاديث والفوائد الفقهية</p>
		  </div>
		  <button 
			style={styles.btnPrimary} 
			onClick={openCreateModal}
			onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
			onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
		  >
			<Icon name="plus" size={18} /> إضافة منشور
		  </button>
		</div>

		{isLoading ? <p style={{ textAlign: 'center', padding: '40px', fontWeight: 800, color: theme.textMuted }}>جاري تحميل المنشورات...</p> : (
		  <div style={styles.grid}>
			{news.map(item => {
			  const isExpanded = expandedId === item.id;
			  
			  return (
				<div 
				  key={item.id} 
				  style={{ 
					...styles.card, 
					borderColor: isExpanded ? theme.primary : theme.border,
					boxShadow: isExpanded ? '0 10px 15px -3px rgba(42, 93, 78, 0.1)' : styles.card.boxShadow
				  }}
				  onClick={() => setExpandedId(isExpanded ? null : item.id)}
				>
				  <div style={styles.cardHeader}>
					<span style={styles.typeBadge}>{getTypeLabel(item.type)}</span>
					<span style={{...styles.expandIcon, backgroundColor: isExpanded ? theme.primaryLight : '#F3F4F6', color: isExpanded ? theme.primary : theme.textMuted}}>
					  {isExpanded ? 'طي ▲' : 'توسيع ▼'}
					</span>
				  </div>
				  
				  {isExpanded ? (
					<p style={styles.cardTextExpanded}>{item.text}</p>
				  ) : (
					<p style={styles.cardTextCollapsed}>{item.text}</p>
				  )}

				  {isExpanded && (
					<div style={styles.cardFooter} onClick={(e) => e.stopPropagation()}> 
					  <span>{item.source} {item.source && item.date && ' | '} {item.date}</span>
					  
					  <div style={styles.cardActions}>
						<button style={{...styles.iconBtn, color: '#0369a1'}} onClick={() => triggerPrint(item)}>طباعة</button>
						<button style={{...styles.iconBtn, color: theme.primary}} onClick={() => openEditModal(item)}>تعديل</button>
						<button style={{...styles.iconBtn, color: '#b91c1c'}} onClick={() => handleDelete(item.id)}>حذف</button>
					  </div>
					</div>
				  )}
				</div>
			  );
			})}
			{news.length === 0 && <p style={{ gridColumn: '1 / -1', textAlign: 'center', fontWeight: 800, color: theme.textMuted }}>لا توجد منشورات حالياً.</p>}
		  </div>
		)}
	  </div>

	  {/* نافذة الإضافة والتعديل */}
	  {isModalOpen && (
		<div className="no-print" style={styles.modalOverlay}>
		  <div style={styles.modalContent}>
			<h3 style={{ margin: '0 0 24px 0', fontWeight: 900, color: theme.primary, fontSize: '1.4rem' }}>
			  {editingId ? 'تعديل المنشور' : 'إضافة منشور جديد'}
			</h3>
			<form onSubmit={handleSave}>
			  <div style={styles.inputGroup}>
				<label style={styles.label}>التصنيف (النوع)</label>
				<select 
				  style={{...styles.input, cursor: 'pointer'}} 
				  value={formData.type} 
				  onChange={e => setFormData({...formData, type: e.target.value})}
				>
				  <option value="hadeeth">حديث شريف</option>
				  <option value="feqh">فقه</option>
				  <option value="announcement">إعلان إداري</option>
				  <option value="other">أخرى</option>
				</select>
			  </div>
			  <div style={styles.inputGroup}>
				<label style={styles.label}>النص (المحتوى)</label>
				<textarea 
				  required 
				  style={styles.textarea} 
				  value={formData.text} 
				  onChange={e => setFormData({...formData, text: e.target.value})} 
				  placeholder="اكتب نص الحديث أو الإعلان هنا..."
				/>
			  </div>
			  <div style={{ display: 'flex', gap: '16px' }}>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>المصدر أو الراوي</label>
				  <input style={styles.input} value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} placeholder="مثال: رواه البخاري" />
				</div>
				<div style={{ ...styles.inputGroup, flex: 1 }}>
				  <label style={styles.label}>التاريخ</label>
				  <input style={styles.input} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
				</div>
			  </div>
			  
			  <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
				<button type="submit" style={{ ...styles.btnPrimary, flex: 1, justifyContent: 'center', borderRadius: '12px' }}>
				  حفظ المنشور
				</button>
				<button 
				  type="button" 
				  onClick={() => setIsModalOpen(false)} 
				  style={{ padding: '12px 24px', borderRadius: '12px', border: `2px solid ${theme.border}`, background: 'transparent', cursor: 'pointer', fontWeight: 800, color: theme.textMuted }}
				>
				  إلغاء
				</button>
			  </div>
			</form>
		  </div>
		</div>
	  )}

	  {/* =========================================================
		شريحة الطباعة الفردية (Landscape A4 + Islamic Theme)
		=========================================================
	  */}
	  {printingItem && (
		<div className="print-only">
		  <div className="print-frame-outer">
			<div className="print-frame-inner">
			  {/* الزوايا الهندسية */}
			  <div className="corner-ornament c-tl"></div>
			  <div className="corner-ornament c-tr"></div>
			  <div className="corner-ornament c-bl"></div>
			  <div className="corner-ornament c-br"></div>

			  {/* الترويسة العليا */}
			  <div className="print-header-brand">
				<div className="print-system-name">نظام ابن عباس - إدارة الشؤون الأكاديمية</div>
				<div className="print-divider-line"></div>
			  </div>

			  {/* المحتوى */}
			  <div className="print-type-title">{getTypeLabel(printingItem.type)}</div>
			  <div className="print-main-text">{printingItem.text}</div>

			  {/* التذييل */}
			  {(printingItem.source || printingItem.date) && (
				<div className="print-footer-details">
				  {printingItem.source && <span>{printingItem.source}</span>}
				  {printingItem.source && printingItem.date && <span style={{color: theme.gold}}>|</span>}
				  {printingItem.date && <span>{printingItem.date}</span>}
				</div>
			  )}
			</div>
		  </div>
		</div>
	  )}

	</div>
  );
}