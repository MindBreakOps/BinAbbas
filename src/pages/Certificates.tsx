
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useTenant } from '../context/TenantContext';
import { Icon } from '../components/ui/Icons';

export default function Certificates() {
  const { workspace } = useTenant();
  const certRef = useRef<HTMLDivElement>(null);

  const [type, setType] = useState<'hifz' | 'shokr' | 'solok'>('hifz');
  const [student, setStudent] = useState('');
  const [teacher, setTeacher] = useState('');
  const [halqa, setHalqa] = useState('');
  const [parts, setParts] = useState('');
  const [zoom, setZoom] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // المتغيرات الافتراضية عند عدم الإدخال[cite: 5]
  const displayStudent = student || '.......................';
  const displayTeacher = teacher || '.......................';
  const displayHalqa = halqa || '.......................';
  const displayParts = parts || '.......................';

  // التحكم بالتكبير والتصغير[cite: 5]
  const handleZoom = (step: number) => {
	setZoom(prev => Math.min(1.6, Math.max(0.6, prev + step)));
  };

  // دالة الحفظ كصورة باستخدام html2canvas[cite: 5]
  const saveAsImage = async () => {
	if (!certRef.current) return;
	setIsExporting(true);

	try {
	  const canvas = await html2canvas(certRef.current, {
		scale: 2,
		useCORS: true,
		backgroundColor: '#ffffff',
	  });
	  
	  const link = document.createElement('a');
	  link.download = `شهادة_${student || 'طالب'}.png`;
	  link.href = canvas.toDataURL('image/png', 1.0);
	  link.click();
	} catch (err) {
	  console.error('Failed to export certificate:', err);
	  alert('حدث خطأ أثناء استخراج الصورة');
	} finally {
	  setIsExporting(false);
	}
  };

  // دالة المشاركة عبر الواتساب (بدون إيموجي)[cite: 5]
  const shareWhatsApp = () => {
	if (!student) return alert('الرجاء إدخال اسم الطالب أولاً');
	
	let text = '';
	const familyName = student.split(' ').pop() || student;

	if (type === 'hifz') {
	  text = `السلام عليكم ورحمة الله وبركاته.. أسرة [ ${familyName} ] الكريمة،\n\n` +
			 `عن بريدة رضي الله عنه، قال رسول الله ﷺ:\n«مَنْ قَرَأَ الْقُرْآنَ وَتَعَلَّمَهُ وَعَمِلَ بِهِ، أُلْبِسَ وَالِدَاهُ يَوْمَ الْقِيَامَةِ تَاجًا مِنْ نُورٍ ضَوْؤُهُ مِثْلُ ضَوْءِ الشَّمْسِ».\n\n` +
			 `يسعدنا إرفاق شهادة تفوق وحفظ للإبن: [ ${student} ]\n\n` +
			 `نسأل الله له التوفيق والسداد، وأن يجعله من أهل القرآن.\n\n` +
			 `إدارة ${workspace?.name || 'المركز'}`;
	} else if (type === 'shokr') {
	  text = `السلام عليكم ورحمة الله وبركاته.. أسرة الطالب [ ${student} ]،\n\n` +
			 `يسعدنا أن نرفق شهادة (شكر وتقدير) تقديراً لجهود ابنكم وتميزه الملحوظ في الحلقات.\n` +
			 `نسأل الله أن يبارك فيه وينفع به الإسلام والمسلمين.\n\n` +
			 `إدارة ${workspace?.name || 'المركز'}`;
	} else {
	  text = `السلام عليكم ورحمة الله وبركاته.. أسرة الطالب [ ${student} ]،\n\n` +
			 `يسعدنا أن نرفق شهادة (حسن سيرة وسلوك)، حيث كان ابنكم مثالاً للأخلاق الفاضلة والالتزام.\n` +
			 `مع تمنياتنا له بدوام التوفيق والنجاح.\n\n` +
			 `إدارة ${workspace?.name || 'المركز'}`;
	}

	const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
	window.open(whatsappUrl, '_blank');
  };

  // تحويل CSS الخاص بك إلى Inline Styles[cite: 6]
  const styles: { [key: string]: React.CSSProperties } = {
	container: { animation: 'fadeIn 0.3s ease', direction: 'rtl', fontFamily: 'inherit' },
	header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
	titleArea: { display: 'flex', alignItems: 'center', gap: '12px' },
	iconBox: { width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(30, 122, 80, 0.12), rgba(30, 122, 80, 0.06))', border: '1px solid rgba(30, 122, 80, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#064e3b' },
	title: { fontFamily: '"Amiri", serif', fontSize: '1.35rem', color: 'var(--text-primary)', margin: 0, fontWeight: 800 },
	subtitle: { fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' },
	actionButtons: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
	btnAction: { background: 'white', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
	btnWhatsapp: { background: 'linear-gradient(135deg, #25D366, #128C7E)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', boxShadow: '0 3px 12px rgba(37, 211, 102, 0.3)', fontFamily: 'inherit' },
	controlsCard: { background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px', marginBottom: '24px' },
	formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'flex-end' },
	inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
	label: { fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' },
	input: { padding: '10px 14px', border: '1.5px solid var(--border-subtle)', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.9rem', background: 'white', color: 'var(--text-primary)', outline: 'none' },
	zoomControls: { display: 'flex', gap: '8px' },
	btnZoom: { flex: 1, background: 'white', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '8px', borderRadius: '8px', fontFamily: 'serif', fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', fontWeight: 800 },
	certPreviewWrapper: { overflowX: 'auto', paddingBottom: '20px', display: 'flex', justifyContent: 'center' },
	
	// تصميم الشهادة الأصلي[cite: 6]
	certWrap: { border: '8px double #b45309', padding: '40px', background: 'white', textAlign: 'center', position: 'relative', width: '100%', maxWidth: '1123px', minHeight: '700px', overflow: 'hidden', borderRadius: '12px', boxSizing: 'border-box' },
	certWatermark: { position: 'absolute', inset: 0, backgroundPosition: 'center', backgroundSize: '350px', backgroundRepeat: 'no-repeat', opacity: 0.05, pointerEvents: 'none', backgroundImage: 'url(/logo.png)' },
	certHeader: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '25px', position: 'relative', zIndex: 1 },
	certLogo: { width: '85px', height: '85px', marginBottom: '12px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #064e3b' },
	ch1: { fontFamily: '"Amiri", "Traditional Arabic", serif', fontWeight: 800, color: '#064e3b' },
	certTitle: { fontFamily: '"Amiri", "Traditional Arabic", serif', color: '#064e3b', fontWeight: 800, marginBottom: '30px', position: 'relative', zIndex: 1 },
	certBody: { fontFamily: '"Amiri", "Traditional Arabic", serif', color: '#111827', lineHeight: 2.2, marginBottom: '40px', position: 'relative', zIndex: 1 },
	strong: { color: '#b45309', borderBottom: '1px dashed #b45309', padding: '0 8px' }, // تم استبدال اللون الأخضر بالذهبي للتناسق
	certFooter: { display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 40px', marginTop: '50px', position: 'relative', zIndex: 1, boxSizing: 'border-box' },
	certSign: { textAlign: 'center' },
	certSignRole: { fontFamily: '"Tajawal", sans-serif', color: '#6b7280', fontWeight: 700 },
	certSignName: { display: 'block', marginTop: '45px', fontFamily: '"Amiri", serif', color: '#111827' },
	certSignMgr: { color: '#064e3b', fontWeight: 800 }
  };

  return (
	<div style={styles.container}>
	  {/* Header[cite: 5, 6] */}
	  <div style={styles.header}>
		<div style={styles.titleArea}>
		  <div style={styles.iconBox}>
			<Icon name="award" size={20} />
		  </div>
		  <div>
			<h2 style={styles.title}>إصدار الشهادات</h2>
			<p style={styles.subtitle}>طباعة شهادات تقديرية للطلاب والتصدير كصورة</p>
		  </div>
		</div>
		<div style={styles.actionButtons}>
		  <button style={styles.btnAction} onClick={saveAsImage} disabled={isExporting}>
			{isExporting ? 'جاري الحفظ...' : 'حفظ كصورة'}
		  </button>
		  <button style={styles.btnWhatsapp} onClick={shareWhatsApp}>
			 مشاركة عبر واتساب
		  </button>
		</div>
	  </div>

	  {/* Controls Card[cite: 5, 6] */}
	  <div style={styles.controlsCard}>
		<div style={styles.formGrid}>
		  <div style={styles.inputGroup}>
			<label style={styles.label}>نوع الشهادة</label>
			<select style={styles.input} value={type} onChange={(e) => setType(e.target.value as any)}>
			  <option value="hifz">حفظ وتفوق</option>
			  <option value="shokr">شكر وتقدير</option>
			  <option value="solok">حسن سيرة وسلوك</option>
			</select>
		  </div>
		  <div style={styles.inputGroup}>
			<label style={styles.label}>اسم الطالب</label>
			<input type="text" style={styles.input} value={student} onChange={e => setStudent(e.target.value)} placeholder="مثال: أحمد محمد" />
		  </div>
		  <div style={styles.inputGroup}>
			<label style={styles.label}>المعلم</label>
			<input type="text" style={styles.input} value={teacher} onChange={e => setTeacher(e.target.value)} placeholder="مثال: الشيخ عبدالله" />
		  </div>
		  <div style={styles.inputGroup}>
			<label style={styles.label}>الحلقة</label>
			<input type="text" style={styles.input} value={halqa} onChange={e => setHalqa(e.target.value)} placeholder="مثال: الحلقة الأولى" />
		  </div>
		  {type === 'hifz' && (
			<div style={styles.inputGroup}>
			  <label style={styles.label}>مقدار الحفظ</label>
			  <input type="text" style={styles.input} value={parts} onChange={e => setParts(e.target.value)} placeholder="مثال: خمسة أجزاء" />
			</div>
		  )}
		  <div style={styles.inputGroup}>
			<label style={styles.label}>حجم الخط</label>
			<div style={styles.zoomControls}>
			  <button type="button" style={styles.btnZoom} onClick={() => handleZoom(0.1)}>A+</button>
			  <button type="button" style={styles.btnZoom} onClick={() => handleZoom(-0.1)}>A-</button>
			</div>
		  </div>
		</div>
	  </div>

	  {/* Certificate Preview[cite: 5, 6] */}
	  <div style={styles.certPreviewWrapper}>
		<div 
		  style={styles.certWrap} 
		  ref={certRef}
		>
		  <div style={styles.certWatermark} />

		  <div style={styles.certHeader}>
			{/* البسملة المطلوبة مسبقاً */}
			<div style={{ fontFamily: '"Traditional Arabic", serif', fontSize: `${1.6 * zoom}rem`, fontWeight: 'bold', color: '#064e3b', marginBottom: '16px' }}>
			  بسم الله الرحمن الرحيم
			</div>
			
			<img src="/logo.png" alt="Logo" style={styles.certLogo} crossOrigin="anonymous" onError={(e) => (e.currentTarget.style.display = 'none')} />
			
			<div style={{ ...styles.ch1, fontSize: `${1.8 * zoom}rem` }}>
			  {workspace?.name || 'مركز تحفيظ القرآن الكريم'}
			</div>
		  </div>

		  <div style={{ ...styles.certTitle, fontSize: `${2.8 * zoom}rem` }}>
			{type === 'hifz' ? 'شهادة حفظ وتفوق' : type === 'shokr' ? 'شهادة شكر وتقدير' : 'شهادة حسن سيرة وسلوك'}
		  </div>

		  <div style={{ ...styles.certBody, fontSize: `${1.6 * zoom}rem` }}>
			{type === 'hifz' && (
			  <>
				يشهد {workspace?.name || 'المركز'} بأن الطالب / <strong style={styles.strong}>{displayStudent}</strong><br />
				المقيد في <strong style={styles.strong}>{displayHalqa}</strong> عند المعلم / <strong style={styles.strong}>{displayTeacher}</strong><br />
				قد أتم بحمد الله حفظ ( <strong style={styles.strong}>{displayParts}</strong> ) من القرآن الكريم.<br />
				سائلين الله له التوفيق والسداد وأن يجعله من أهل القرآن الذين هم أهل الله وخاصته.
			  </>
			)}
			{type === 'shokr' && (
			  <>
				تتقدم إدارة {workspace?.name || 'المركز'} بخالص الشكر والتقدير للطالب / <strong style={styles.strong}>{displayStudent}</strong><br />
				المقيد في <strong style={styles.strong}>{displayHalqa}</strong> عند المعلم / <strong style={styles.strong}>{displayTeacher}</strong><br />
				وذلك لجهوده المباركة وتميزه الملحوظ ومثابرته في الحلقات.<br />
				نسأل الله أن يبارك فيه وينفع به الإسلام والمسلمين.
			  </>
			)}
			{type === 'solok' && (
			  <>
				تشهد إدارة {workspace?.name || 'المركز'} بأن الطالب / <strong style={styles.strong}>{displayStudent}</strong><br />
				المقيد في <strong style={styles.strong}>{displayHalqa}</strong> عند المعلم / <strong style={styles.strong}>{displayTeacher}</strong><br />
				يتصف بحسن السيرة والسلوك والأخلاق الفاضلة والالتزام بالآداب طيلة فترة دراسته.<br />
				مع تمنياتنا له بدوام التوفيق والنجاح.
			  </>
			)}
		  </div>

		  <div style={styles.certFooter}>
			<div style={styles.certSign}>
			  <div style={{ ...styles.certSignRole, fontSize: `${1.1 * zoom}rem` }}>معلم الحلقة</div>
			  <span style={{ ...styles.certSignName, fontSize: `${1.5 * zoom}rem` }}>
				{teacher || '.......................'}
			  </span>
			</div>
			<div style={{ ...styles.certSign, textAlign: 'left' }}>
			  <div style={{ ...styles.certSignRole, fontSize: `${1.1 * zoom}rem` }}>المدير العام</div>
			  <span style={{ ...styles.certSignName, ...styles.certSignMgr, fontSize: `${1.6 * zoom}rem` }}>
				إدارة المركز
			  </span>
			</div>
		  </div>
		</div>
	  </div>
	</div>
  );
}