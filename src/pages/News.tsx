import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';
import { toPng } from 'html-to-image';// المكتبة المسؤولة عن تحويل التصميم لصورة

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
  
  // للتحكم بالمنشور المراد تصديره كصورة
  const [printingItem, setPrintingItem] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);

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

  // دالة تحويل البطاقة إلى صورة عالية الدق// دالة تحويل البطاقة إلى صورة عالية الدقة وبدون تكسير في اللغة العربية
	const exportAsImage = (item: any) => {
	  setIsExporting(true);
	  setPrintingItem(item);
	  
	  setTimeout(async () => {
		const element = document.getElementById('image-export-node');
		if (element) {
		  try {
			const dataUrl = await toPng(element, {
			  pixelRatio: 2, 
			  backgroundColor: '#FCFBF7',
			  cacheBust: true,
			});
			
			const link = document.createElement('a');
			link.download = `منشور-${getTypeLabel(item.type)}.png`;
			link.href = dataUrl;
			link.click();
		  } catch (error) {
			console.error("Error generating image: ", error);
			alert("حدث خطأ أثناء إنشاء الصورة.");
		  } finally {
			setIsExporting(false);
			setPrintingItem(null);
		  }
		}
	  }, 300);
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
	<div style={{ position: 'relative' }}>
	  {/* الواجهة الرئيسية */}
	  <div>
		<div style={styles.header}>
		  <div style={styles.titleGroup}>
			<h2 style={styles.title}>النشرة والإعلانات</h2>
			<p style={styles.subtitle}>إدارة الحائط الإعلاني والأحاديث والفوائد الفقهية</p>
		  </div>
		  <button 
			style={{...styles.btnPrimary, opacity: isExporting ? 0.7 : 1, cursor: isExporting ? 'not-allowed' : 'pointer'}} 
			onClick={openCreateModal}
			disabled={isExporting}
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
						<button 
						  style={{...styles.iconBtn, color: '#0369a1', opacity: isExporting ? 0.5 : 1}} 
						  onClick={() => exportAsImage(item)}
						  disabled={isExporting}
						>
						  {isExporting && printingItem?.id === item.id ? 'جاري التحميل...' : 'حفظ كصورة'}
						</button>
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
		<div style={styles.modalOverlay}>
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
		شريحة التصدير للصورة (مخفية عن الشاشة ولكن يتم رسمها للتصدير)
		بأبعاد A4 Landscape وحواف إسلامية فاخرة
		=========================================================
	  */}
	  <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', overflow: 'hidden' }}>
		{printingItem && (
		  <div id="image-export-node" style={{
			width: '1122px', // عرض A4 بالبيكسل
			height: '794px', // طول A4 بالبيكسل
			backgroundColor: '#FCFBF7',
			padding: '45px',
			boxSizing: 'border-box',
			direction: 'rtl',
			display: 'flex'
		  }}>
			<div style={{ flex: 1, border: `8px solid ${theme.primary}`, padding: '6px', boxSizing: 'border-box' }}>
			  <div style={{
				flex: 1, 
				border: `3px solid ${theme.gold}`, 
				height: '100%',
				display: 'flex', 
				flexDirection: 'column', 
				alignItems: 'center',
				justifyContent: 'center', 
				padding: '40px', 
				position: 'relative',
				background: 'radial-gradient(circle at center, #FFFFFF 40%, #FCFBF7 100%)'
			  }}>
				
				{/* الزوايا الهندسية الإسلامية */}
				<div style={{ position: 'absolute', width: '40px', height: '40px', backgroundColor: theme.primary, border: `2px solid ${theme.gold}`, transform: 'rotate(45deg)', top: '-20px', left: '-20px' }}></div>
				<div style={{ position: 'absolute', width: '40px', height: '40px', backgroundColor: theme.primary, border: `2px solid ${theme.gold}`, transform: 'rotate(45deg)', top: '-20px', right: '-20px' }}></div>
				<div style={{ position: 'absolute', width: '40px', height: '40px', backgroundColor: theme.primary, border: `2px solid ${theme.gold}`, transform: 'rotate(45deg)', bottom: '-20px', left: '-20px' }}></div>
				<div style={{ position: 'absolute', width: '40px', height: '40px', backgroundColor: theme.primary, border: `2px solid ${theme.gold}`, transform: 'rotate(45deg)', bottom: '-20px', right: '-20px' }}></div>

				{/* الترويسة العليا */}
				<div style={{ position: 'absolute', top: '40px', textAlign: 'center', width: '100%' }}>
				  <div style={{ fontSize: '24px', fontWeight: 900, color: theme.primary, letterSpacing: '1px', fontFamily: '"Traditional Arabic", serif' }}>
					نظام ابن عباس - إدارة الشؤون الأكاديمية
				  </div>
				  <div style={{ width: '180px', height: '2px', backgroundColor: theme.gold, margin: '12px auto 0', position: 'relative' }}>
					<div style={{ position: 'absolute', top: '-4px', left: 'calc(50% - 5px)', width: '10px', height: '10px', backgroundColor: theme.primary, transform: 'rotate(45deg)' }}></div>
				  </div>
				</div>

				{/* المحتوى */}
				<div style={{ fontSize: '36px', fontWeight: 'bold', color: theme.gold, marginBottom: '40px', fontFamily: '"Traditional Arabic", serif', borderBottom: `2px dashed ${theme.gold}`, paddingBottom: '16px' }}>
				  {getTypeLabel(printingItem.type)}
				</div>
				<div style={{ fontSize: '42px', lineHeight: 1.8, color: '#111827', textAlign: 'center', maxWidth: '85%', fontFamily: '"Traditional Arabic", serif', fontWeight: 'bold' }}>
				  {printingItem.text}
				</div>

				{/* التذييل */}
				{(printingItem.source || printingItem.date) && (
				  <div style={{ position: 'absolute', bottom: '50px', fontSize: '28px', color: theme.primary, fontWeight: 'bold', fontFamily: '"Traditional Arabic", serif', display: 'flex', gap: '20px', alignItems: 'center' }}>
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

	</div>
  );
}