import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';
import { toPng } from 'html-to-image';

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

  // دالة الحفظ كصورة باستخدام آلية النظام القديم لمنع القص ولحل مشكلة الصورة البيضاء
  const exportAsImage = (item: any) => {
	setIsExporting(true);
	setPrintingItem(item);

	// 1. بناء حاوية وهمية مفتوحة الارتفاع
	const container = document.createElement('div');
	// لضمان عدم ظهور الصورة البيضاء، يجب أن يكون العنصر داخل الـ Document 
	// ولكن نضعه خلف الواجهة الأساسية (zIndex) بدلاً من إبعاده كلياً
	container.style.position = 'fixed';
	container.style.top = '0';
	container.style.left = '0';
	container.style.width = '1123px';
	container.style.minHeight = '794px';
	container.style.backgroundColor = '#f0f4f0';
	container.style.zIndex = '-9999';
	container.style.direction = 'rtl';
	container.style.padding = '35px 45px';
	container.style.boxSizing = 'border-box';

	const logoUrl = 'https://raw.githubusercontent.com/MindBreakOps/OpSystem/main/aba.png';
	const cleanTxt = item.text.replace(/\n/g, '<br/>');
	const newsTypeTitle = item.type === 'feqh' ? "(( درس فقهي ))" : "(( حديث شريف ))";

	// 2. حقن التصميم القديم المطلوب للنشرة
	container.innerHTML = `
	  <div style="display: flex; flex-direction: column; min-height: 724px; height: 100%;">
		<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px;">
		  <div style="text-align: center; width: 140px;">
			<img src="${logoUrl}" crossorigin="anonymous" style="width: 75px; height: 75px; border-radius: 50%; object-fit: cover; border: 2px solid #1e7a50;">
			<div style="font-family: 'Tajawal', sans-serif; font-size: 0.65rem; color: #166040; margin-top: 6px; font-weight: 900;">مركز عبدالله بن عباس<br>لتحفيظ القرآن الكريم</div>
			<div style="font-family: 'Tajawal', sans-serif; font-size: 0.5rem; color: #9a7230; margin-top: 2px;">حي النسيم / الحاج يوسف</div>
		  </div>

		  <div style="text-align: center; flex: 1; padding-top: 5px;">
			<div style="font-family: 'Amiri', serif; font-size: 2.2rem; color: #111; font-weight: bold; margin-bottom: 8px;">بسم الله الرحمن الرحيم</div>
			<div style="font-family: 'Tajawal', sans-serif; font-size: 1.8rem; color: #1e7a50; font-weight: 900; margin-bottom: 12px;">النشرة الأسبوعية</div>
			<div style="font-family: 'Tajawal', sans-serif; font-size: 1.6rem; color: #9a7230; font-weight: 700;">${newsTypeTitle}</div>
		  </div>

		  <div style="text-align: center; width: 140px;">
			<img src="${logoUrl}" crossorigin="anonymous" style="width: 75px; height: 75px; border-radius: 50%; object-fit: cover; border: 2px solid #1e7a50;">
			<div style="font-family: 'Tajawal', sans-serif; font-size: 0.65rem; color: #166040; margin-top: 6px; font-weight: 900;">مركز عبدالله بن عباس<br>لتحفيظ القرآن الكريم</div>
			<div style="font-family: 'Tajawal', sans-serif; font-size: 0.5rem; color: #9a7230; margin-top: 2px;">حي النسيم / الحاج يوسف</div>
		  </div>
		</div>

		<div style="position: relative; background: #ffffff; border: 3px solid #1e7a50; box-shadow: 0 10px 25px rgba(0,0,0,0.06); padding: 50px 60px; box-sizing: border-box; flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
		  <div style="position: absolute; bottom: -3px; left: -3px; width: 75px; height: 75px; background: #f0f4f0;"></div>
		  <div style="position: absolute; bottom: -3px; left: -3px; width: 0; height: 0; border-style: solid; border-width: 75px 75px 0 0; border-color: #d1dcd4 transparent transparent transparent; box-shadow: 3px -3px 6px rgba(0,0,0,0.1);"></div>

		  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.05; pointer-events: none;">
			<img src="${logoUrl}" crossorigin="anonymous" style="width: 350px; height: 350px; border-radius: 50%; object-fit: cover; filter: contrast(120%);">
		  </div>

		  <div style="position: relative; z-index: 1;">
			<div style="font-family: 'Amiri', serif; font-size: 2.1rem; line-height: 2.2; color: #111a14; text-align: justify; direction: rtl;">
			  ${cleanTxt}
			</div>
			${item.source ? `<div style="font-family: 'Tajawal', sans-serif; font-size: 1.5rem; color: #9a7230; font-weight: 700; margin-top: 40px; text-align: left;">المصدر: ${item.source}</div>` : ''}
		  </div>
		</div>
	  </div>
	`;

	document.body.appendChild(container);

	// 3. الانتظار ليقوم المتصفح بتحميل الشعار وحساب أبعاد النص بدقة
	setTimeout(() => {
	  // إجبار المتصفح على تطبيق التنسيقات وتحديث الطول
	  void container.offsetHeight; 
	  const fullHeight = container.scrollHeight;
	  
	  const config = {
		pixelRatio: 2, 
		backgroundColor: '#f0f4f0',
		width: 1123,
		height: fullHeight,
		style: { margin: '0', transform: 'none' },
		cacheBust: true, // مهم جداً لمنع مشاكل الصور البيضاء مع الروابط الخارجية (CORS)
	  };

	  // الحل السحري لمكتبة html-to-image لتفادي الصورة البيضاء: الاستدعاء المزدوج
	  toPng(container, config)
		.then(() => {
		  // المرة الثانية تقوم بالالتقاط الفعلي بعد أن يتم تجهيز الـ SVG
		  return toPng(container, config);
		})
		.then(canvasUrl => {
		  const link = document.createElement('a');
		  const dateStr = item.date || new Date().toISOString().split('T')[0];
		  link.download = `النشرة_الأسبوعية_${dateStr}.png`;
		  link.href = canvasUrl;
		  link.click();
		})
		.catch(err => {
		  console.error('Error rendering image:', err);
		  alert('حدث خطأ أثناء استخراج الصورة.');
		})
		.finally(() => {
		  if (document.body.contains(container)) {
			document.body.removeChild(container);
		  }
		  setIsExporting(false);
		  setPrintingItem(null);
		});
	}, 1500); // زيادة وقت الانتظار قليلاً لضمان تحميل خطوط Amiri و Tajawal بالكامل
  };

  // الألوان الأساسية للواجهة المرئية
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
	
	modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
	modalContent: { backgroundColor: '#fff', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
	inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
	label: { fontWeight: 800, fontSize: '0.9rem', color: theme.primary },
	input: { padding: '12px 16px', borderRadius: '12px', border: `2px solid ${theme.border}`, fontFamily: 'inherit', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s', fontWeight: 600 },
	textarea: { padding: '12px 16px', borderRadius: '12px', border: `2px solid ${theme.border}`, fontFamily: 'inherit', fontSize: '0.95rem', minHeight: '140px', resize: 'vertical', outline: 'none', fontWeight: 600 }
  };

  return (
	<div style={{ position: 'relative' }}>
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
				  <input type="date" style={styles.input} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
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
	</div>
  );
}