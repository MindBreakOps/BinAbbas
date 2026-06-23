import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useTenant } from '../context/TenantContext';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/ui/Icons';
import styles from './Certificates.module.css';

export default function Certificates() {
  const { workspace } = useTenant();
  const { user } = useAuth();
  const certRef = useRef<HTMLDivElement>(null);

  const [type, setType] = useState<'hifz' | 'shokr' | 'solok'>('hifz');
  const [student, setStudent] = useState('');
  const [teacher, setTeacher] = useState('');
  const [halqa, setHalqa] = useState('');
  const [parts, setParts] = useState('');
  const [zoom, setZoom] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const displayStudent = student || '.......................';
  const displayTeacher = teacher || '.......................';
  const displayHalqa = halqa || '.......................';
  const displayParts = parts || '.......................';

  const handleZoom = (step: number) => {
	setZoom(prev => Math.min(1.6, Math.max(0.6, prev + step)));
  };

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

  const shareWhatsApp = () => {
	if (!student) return alert('الرجاء إدخال اسم الطالب أولاً');
	
	// In a real scenario, you'd fetch the student's phone number from the DB here.
	// For this prompt, we generate the message payload.
	
	let text = '';
	const familyName = student.split(' ').pop() || student;

	if (type === 'hifz') {
	  text = `السلام عليكم ورحمة الله وبركاته.. أسرة [ ${familyName} ] الكريمة،\n\n` +
			 `عن بريدة رضي الله عنه، قال رسول الله ﷺ:\n«مَنْ قَرَأَ الْقُرْآنَ وَتَعَلَّمَهُ وَعَمِلَ بِهِ، أُلْبِسَ وَالِدَاهُ يَوْمَ الْقِيَامَةِ تَاجًا مِنْ نُورٍ ضَوْؤُهُ مِثْلُ ضَوْءِ الشَّمْسِ».\n\n` +
			 `يسعدنا إرفاق شهادة تفوق وحفظ للإبن: [ ${student} ] 🎓\n\n` +
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

  return (
	<div className={styles.container}>
	  <div className={styles.header}>
		<div className={styles.titleArea}>
		  <div className={styles.iconBox}>
			<Icon name="award" size={20} />
		  </div>
		  <div>
			<h2 className={styles.title}>إصدار الشهادات</h2>
			<p className={styles.subtitle}>طباعة شهادات تقديرية للطلاب</p>
		  </div>
		</div>
		<div className={styles.actionButtons}>
		  <button className={styles.btnAction} onClick={saveAsImage} disabled={isExporting}>
			<Icon name="save" size={14} /> {isExporting ? 'جاري الحفظ...' : 'حفظ كصورة'}
		  </button>
		  <button className={styles.btnWhatsapp} onClick={shareWhatsApp}>
			<Icon name="whatsapp" size={14} /> واتساب
		  </button>
		</div>
	  </div>

	  <div className={styles.controlsCard}>
		<div className={styles.formGrid}>
		  <div className={styles.inputGroup}>
			<label className={styles.label}>نوع الشهادة</label>
			<select className={styles.input} value={type} onChange={(e) => setType(e.target.value as any)}>
			  <option value="hifz">حفظ وتفوق</option>
			  <option value="shokr">شكر وتقدير</option>
			  <option value="solok">حسن سيرة وسلوك</option>
			</select>
		  </div>
		  <div className={styles.inputGroup}>
			<label className={styles.label}>اسم الطالب</label>
			<input type="text" className={styles.input} value={student} onChange={e => setStudent(e.target.value)} placeholder="مثال: أحمد محمد" />
		  </div>
		  <div className={styles.inputGroup}>
			<label className={styles.label}>المعلم</label>
			<input type="text" className={styles.input} value={teacher} onChange={e => setTeacher(e.target.value)} placeholder="مثال: الشيخ عبدالله" />
		  </div>
		  <div className={styles.inputGroup}>
			<label className={styles.label}>الحلقة</label>
			<input type="text" className={styles.input} value={halqa} onChange={e => setHalqa(e.target.value)} placeholder="مثال: الحلقة الأولى" />
		  </div>
		  {type === 'hifz' && (
			<div className={styles.inputGroup}>
			  <label className={styles.label}>مقدار الحفظ</label>
			  <input type="text" className={styles.input} value={parts} onChange={e => setParts(e.target.value)} placeholder="مثال: خمسة أجزاء" />
			</div>
		  )}
		  <div className={styles.inputGroup}>
			<label className={styles.label}>حجم الخط</label>
			<div className={styles.zoomControls}>
			  <button className={styles.btnZoom} onClick={() => handleZoom(0.1)}>A+</button>
			  <button className={styles.btnZoom} onClick={() => handleZoom(-0.1)}>A-</button>
			</div>
		  </div>
		</div>
	  </div>

	  <div className={styles.certPreviewWrapper}>
		<div 
		  className={styles.certWrap} 
		  ref={certRef}
		  style={{ '--z': zoom } as React.CSSProperties}
		>
		  {workspace?.logo_url && (
			<div 
			  className={styles.certWatermark} 
			  style={{ backgroundImage: `url(${workspace.logo_url})` }} 
			/>
		  )}

		  <div className={styles.certHeader}>
			{workspace?.logo_url && (
			  <img src={workspace.logo_url} alt="Logo" className={styles.certLogo} crossOrigin="anonymous" />
			)}
			<div className={styles.ch1} style={{ fontSize: `${1.4 * zoom}rem` }}>
			  {workspace?.name || 'مركز تحفيظ القرآن الكريم'}
			</div>
			<div className={styles.ch2} style={{ fontSize: `${0.95 * zoom}rem` }}>
			  {workspace?.domain || 'إدارة الحلقات'}
			</div>
		  </div>

		  <div className={styles.certTitle} style={{ fontSize: `${2.4 * zoom}rem` }}>
			{type === 'hifz' ? 'شهادة حفظ وتفوق' : type === 'shokr' ? 'شهادة شكر وتقدير' : 'شهادة حسن سيرة وسلوك'}
		  </div>

		  <div className={styles.certBody} style={{ fontSize: `${1.45 * zoom}rem` }}>
			{type === 'hifz' && (
			  <>
				يشهد {workspace?.name || 'المركز'} بأن الطالب / <strong>{displayStudent}</strong><br />
				المقيد في <strong>{displayHalqa}</strong> عند المعلم / <strong>{displayTeacher}</strong><br />
				قد أتم بحمد الله حفظ ( <strong>{displayParts}</strong> ) من القرآن الكريم.<br />
				سائلين الله له التوفيق والسداد وأن يجعله من أهل القرآن الذين هم أهل الله وخاصته.
			  </>
			)}
			{type === 'shokr' && (
			  <>
				تتقدم إدارة {workspace?.name || 'المركز'} بخالص الشكر والتقدير للطالب / <strong>{displayStudent}</strong><br />
				المقيد في <strong>{displayHalqa}</strong> عند المعلم / <strong>{displayTeacher}</strong><br />
				وذلك لجهوده المباركة وتميزه الملحوظ ومثابرته في الحلقات.<br />
				نسأل الله أن يبارك فيه وينفع به الإسلام والمسلمين.
			  </>
			)}
			{type === 'solok' && (
			  <>
				تشهد إدارة {workspace?.name || 'المركز'} بأن الطالب / <strong>{displayStudent}</strong><br />
				المقيد في <strong>{displayHalqa}</strong> عند المعلم / <strong>{displayTeacher}</strong><br />
				يتصف بحسن السيرة والسلوك والأخلاق الفاضلة والالتزام بالآداب طيلة فترة دراسته.<br />
				مع تمنياتنا له بدوام التوفيق والنجاح.
			  </>
			)}
		  </div>

		  <div className={styles.certFooter} style={{ fontSize: `${1.15 * zoom}rem` }}>
			<div className={styles.certSign}>
			  <div className={styles.certSignRole}>معلم الحلقة</div>
			  <span className={styles.certSignName} style={{ fontSize: `${1.3 * zoom}rem` }}>
				{teacher || '.......................'}
			  </span>
			</div>
			<div className={styles.certSign} style={{ textAlign: 'left' }}>
			  <div className={styles.certSignRole}>المدير العام</div>
			  <span className={`${styles.certSignName} ${styles.certSignMgr}`} style={{ fontSize: `${1.4 * zoom}rem` }}>
				إدارة المركز
			  </span>
			</div>
		  </div>
		</div>
	  </div>
	</div>
  );
}