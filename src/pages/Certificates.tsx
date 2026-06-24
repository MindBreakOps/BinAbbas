import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image'; // المكتبة الجديدة التي تدعم اللغة العربية
import { supabase } from '../lib/supabase';
import { useTenant } from '../context/TenantContext';
import { Icon } from '../components/ui/Icons';

export default function Certificates() {
  const { workspace } = useTenant();
  const certRef = useRef<HTMLDivElement>(null);
  
  // States for fetched data
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [teachersList, setTeachersList] = useState<any[]>([]);
  
  // Form states
  const [type, setType] = useState<'hifz' | 'shokr' | 'solok'>('hifz');
  const [studentName, setStudentName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [halqa, setHalqa] = useState('');
  const [parts, setParts] = useState('');
  const [zoom, setZoom] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // جلب بيانات الطلاب والمعلمين من قاعدة البيانات
  useEffect(() => {
	const fetchDropdownData = async () => {
	  // جلب الطلاب
	  const { data: stdData } = await supabase
		.from('students')
		.select('id, name')
		.order('name');
	  if (stdData) setStudentsList(stdData);

	  // جلب المعلمين من جدول profiles
	  const { data: tchrData } = await supabase
		.from('profiles')
		.select('id, full_name')
		.order('full_name');
	  if (tchrData) setTeachersList(tchrData);
	};

	fetchDropdownData();
  }, []);

  // المتغيرات الافتراضية عند عدم الإدخال
  const displayStudent = studentName || '.......................';
  const displayTeacher = teacherName || '.......................';
  const displayHalqa = halqa || '.......................';
  const displayParts = parts || '.......................';

  const handleZoom = (step: number) => {
	setZoom(prev => Math.min(1.6, Math.max(0.6, prev + step)));
  };

  // دالة الحفظ كصورة باستخدام html-to-image (تدعم العربية بشكل ممتاز)
  const saveAsImage = async () => {
	if (!certRef.current) return;
	setIsExporting(true);

	try {
	  const dataUrl = await toPng(certRef.current, {
		pixelRatio: 2, // جودة عالية
		backgroundColor: '#ffffff',
		cacheBust: true,
	  });
	  
	  const link = document.createElement('a');
	  link.download = `شهادة_${studentName || 'طالب'}.png`;
	  link.href = dataUrl;
	  link.click();
	} catch (err) {
	  console.error('Failed to export certificate:', err);
	  alert('حدث خطأ أثناء استخراج الصورة');
	} finally {
	  setIsExporting(false);
	}
  };

  const shareWhatsApp = () => {
	if (!studentName) return alert('الرجاء اختيار اسم الطالب أولاً');
	
	let text = '';
	const familyName = studentName.split(' ').pop() || studentName;

	if (type === 'hifz') {
	  text = `السلام عليكم ورحمة الله وبركاته.. أسرة [ ${familyName} ] الكريمة،\n\n` +
			 `عن بريدة رضي الله عنه، قال رسول الله ﷺ:\n«مَنْ قَرَأَ الْقُرْآنَ وَتَعَلَّمَهُ وَعَمِلَ بِهِ، أُلْبِسَ وَالِدَاهُ يَوْمَ الْقِيَامَةِ تَاجًا مِنْ نُورٍ ضَوْؤُهُ مِثْلُ ضَوْءِ الشَّمْسِ».\n\n` +
			 `يسعدنا إرفاق شهادة تفوق وحفظ للإبن: [ ${studentName} ]\n\n` +
			 `نسأل الله له التوفيق والسداد، وأن يجعله من أهل القرآن.\n\n` +
			 `إدارة ${workspace?.name || 'المركز'}`;
	} else if (type === 'shokr') {
	  text = `السلام عليكم ورحمة الله وبركاته.. أسرة الطالب [ ${studentName} ]،\n\n` +
			 `يسعدنا أن نرفق شهادة (شكر وتقدير) تقديراً لجهود ابنكم وتميزه الملحوظ في الحلقات.\n` +
			 `نسأل الله أن يبارك فيه وينفع به الإسلام والمسلمين.\n\n` +
			 `إدارة ${workspace?.name || 'المركز'}`;
	} else {
	  text = `السلام عليكم ورحمة الله وبركاته.. أسرة الطالب [ ${studentName} ]،\n\n` +
			 `يسعدنا أن نرفق شهادة (حسن سيرة وسلوك)، حيث كان ابنكم مثالاً للأخلاق الفاضلة والالتزام.\n` +
			 `مع تمنياتنا له بدوام التوفيق والنجاح.\n\n` +
			 `إدارة ${workspace?.name || 'المركز'}`;
	}

	const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
	window.open(whatsappUrl, '_blank');
  };

  // التصميم القديم بالضبط كما طلبته
  const styles: { [key: string]: React.CSSProperties | any } = {
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
	
	// تصميم الشهادة الأصلي
	certWrap: { border: '8px double #b45309', padding: '40px', background: 'white', textAlign: 'center', position: 'relative', width: '100%', maxWidth: '1123px', minHeight: '700px', overflow: 'hidden', borderRadius: '12px', boxSizing: 'border-box' },
	certWatermark: { position: 'absolute', inset: 0, backgroundPosition: 'center', backgroundSize: '350px', backgroundRepeat: 'no-repeat', opacity: 0.05, pointerEvents: 'none', backgroundImage: 'url(/logo.png)' },
	certHeader: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '25px', position: 'relative', zIndex: 1 },
	certLogo: { width: '85px', height: '85px', marginBottom: '12px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #064e3b' },
	ch1: { fontFamily: '"Amiri", "Traditional Arabic", serif', fontWeight: 800, color: '#064e3b' },
	certTitle: { fontFamily: '"Amiri", "Traditional Arabic", serif', color: '#b45309', fontWeight: 800, marginBottom: '30px', position: 'relative', zIndex: 1, borderBottom: '2px dashed #b45309', paddingBottom: '10px', display: 'inline-block' },
	certBody: { fontFamily: '"Amiri", "Traditional Arabic", serif', color: '#111827', lineHeight: 2.2, marginBottom: '40px', position: 'relative', zIndex: 1 },
	strong: { color: '#b45309', borderBottom: '1px dashed #b45309', padding: '0 8px' },
	certFooter: { display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 40px', marginTop: '50px', position: 'relative', zIndex: 1, boxSizing: 'border-box' },
	certSign: { textAlign: 'center' },
	certSignRole: { fontFamily: '"Tajawal", sans-serif', color: '#6b7280', fontWeight: 700 },
	certSignName: { display: 'block', marginTop: '45px', fontFamily: '"Amiri", serif', color: '#111827', fontWeight: 'bold' },
	certSignMgr: { color: '#064e3b', fontWeight: 800 }
  };

  return (
	<div style={styles.container}>
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
		  <button style={{...styles.btnAction, opacity: isExporting ? 0.6 : 1}} onClick={saveAsImage} disabled={isExporting}>
			{isExporting ? 'جاري التصدير...' : 'حفظ كصورة'}
		  </button>
		  <button style={styles.btnWhatsapp} onClick={shareWhatsApp}>
			 مشاركة عبر واتساب
		  </button>
		</div>
	  </div>

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
			<select style={styles.input} value={studentName} onChange={e => setStudentName(e.target.value)}>
			  <option value="">-- اختر الطالب --</option>
			  {studentsList.map(s => (
				<option key={s.id} value={s.name}>{s.name}</option>
			  ))}
			</select>
		  </div>
		  <div style={styles.inputGroup}>
			<label style={styles.label}>المعلم</label>
			<select style={styles.input} value={teacherName} onChange={e => setTeacherName(e.target.value)}>
			  <option value="">-- اختر المعلم --</option>
			  {teachersList.map(t => (
				<option key={t.id} value={t.full_name}>{t.full_name}</option>
			  ))}
			</select>
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

	  <div style={styles.certPreviewWrapper}>
		<div style={styles.certWrap} ref={certRef}>
		  <div style={styles.certWatermark} />

		  <div style={styles.certHeader}>
			<div style={{ fontFamily: '"Traditional Arabic", "Amiri", serif', fontSize: `${1.6 * zoom}rem`, fontWeight: 'bold', color: '#064e3b', marginBottom: '16px' }}>
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
				{displayTeacher}
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