import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Book, PlayCircle, ArrowLeft, X, Loader2, Heart, 
  Users, Wallet, GraduationCap, HelpCircle
} from 'lucide-react';

const OPS_API = 'https://script.google.com/macros/s/AKfycby7xDEoYBzGM7sAAAkX0LDTKNHo63LjbgmaC-0VLXESPFj7BSl10GE-sIqM-Ss3wE8/exec';
const TARGET_EMAIL = 'support@operix-solutions.com';

// تم تحديث الألوان لتتطابق مع تصميم Operix FMIS في النظام
const theme = {
  primary: '#10b981', // Emerald الخاص بالنظام
  primaryHover: '#059669',
  primaryLight: 'rgba(16, 185, 129, 0.1)',
  darkNavy: '#111827', // لون الشريط الجانبي في النظام
  gray600: '#4b5563',
  gray500: '#6b7280',
  gray200: '#e5e7eb',
  gray100: '#f3f4f6',
  gray50: '#f9fafb',
  white: '#ffffff',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  fontFamily: 'system-ui, -apple-system, sans-serif'
};

export default function EsnadLanding() {
  const navigate = useNavigate();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: '', email: '', center: '', size: '1-50' });

  const handleDemoRequest = async (e: React.FormEvent) => {
	e.preventDefault();
	setIsSubmitting(true);
	try {
	  const payload = {
		action: 'send_email',
		emailTo: TARGET_EMAIL,
		subject: `طلب انضمام للمبادرة الخيرية: ${demoForm.center}`,
		body: `الاسم: ${demoForm.name}\nالبريد: ${demoForm.email}\nالمركز: ${demoForm.center}\nعدد الطلاب: ${demoForm.size}\n\nطلب الحصول على نظام إسناد الخيري من أوبيركس.`
	  };
	  
	  await fetch(OPS_API, { 
		method: 'POST', 
		mode: 'no-cors', 
		headers: { 'Content-Type': 'text/plain' }, 
		body: JSON.stringify(payload) 
	  });
	  
	  alert("تم إرسال طلبك بنجاح! سيتواصل معك فريق المبادرة الخيرية قريباً.");
	  setIsDemoModalOpen(false);
	  setDemoForm({ name: '', email: '', center: '', size: '1-50' });
	} catch (err) {
	  alert("حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.");
	} finally {
	  setIsSubmitting(false);
	}
  };

  return (
	<div dir="rtl" style={{ minHeight: '100vh', backgroundColor: theme.gray50, fontFamily: theme.fontFamily, color: theme.darkNavy }}>
	  
	  {/* NAVIGATION */}
	  <nav style={{ position: 'fixed', top: 0, width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${theme.gray200}`, zIndex: 50 }}>
		<div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
		  
		  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
			<div style={{ width: '32px', height: '32px', backgroundColor: theme.darkNavy, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.white, fontWeight: 900 }}>O</div>
			<span style={{ fontWeight: '900', fontSize: '20px', letterSpacing: '-0.025em', color: theme.darkNavy }}>
			  نظام إسناد <span style={{ color: theme.primary, fontSize: '14px' }}>مبادرة أوبيركس</span>
			</span>
		  </div>

		  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
			<span onClick={() => setIsSupportModalOpen(true)} style={{ fontSize: '14px', fontWeight: 'bold', color: theme.gray600, cursor: 'pointer', transition: 'color 0.2s' }}>
			  الدعم الفني
			</span>
			<Link to="/subscription" style={{ fontSize: '14px', fontWeight: 'bold', color: theme.gray600, textDecoration: 'none', transition: 'color 0.2s' }}>
			  الباقات والاشتراكات
			</Link>
			<Link to="/login" style={{ fontSize: '14px', fontWeight: 'bold', color: theme.darkNavy, textDecoration: 'none', cursor: 'pointer' }}>
			  تسجيل الدخول
			</Link>
			<button 
			  onClick={() => setIsDemoModalOpen(true)} 
			  style={{ padding: '8px 20px', backgroundColor: theme.primary, color: theme.white, fontSize: '14px', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: theme.shadowSm, transition: 'background-color 0.2s' }}
			  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.primaryHover}
			  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.primary}
			>
			  <PlayCircle size={16} /> طلب النظام
			</button>
		  </div>

		</div>
	  </nav>

	  {/* HERO SECTION */}
	  <section style={{ paddingTop: '140px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
		
		<div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '9999px', backgroundColor: theme.primaryLight, color: theme.primaryHover, fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '24px' }}>
		  <Heart size={14} fill={theme.primaryHover} /> وقف تقني ولوجه الله تعالى
		</div>
		
		<h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.025em', color: theme.darkNavy, marginBottom: '24px', lineHeight: 1.2 }}>
		  نظام إسناد . <br />
		  <span style={{ color: theme.primary }}>لإدارة الحلقات والمراكز القرآنية.</span>
		</h1>
		
		<p style={{ fontSize: '1.125rem', color: theme.gray600, maxWidth: '800px', margin: '0 auto 40px auto', lineHeight: 1.8, textAlign: 'justify', textJustify: 'inter-word' }}>
		  هذا العمل التقني تم إنجازه بالكامل تحت ظروف المعاناة والنزوح في <strong>حرب السودان (نوفمبر 2023)</strong>، وبأيدي مجموعة من الشباب المخلصين الذين يمثّلون اليوم مؤسسي شركة <strong>OPERIX Solutions</strong>. لقد بدأت الفكرة عندما قاموا بتأسيس وبناء مركز لتعليم وتحفيظ القرآن الكريم على أرض الواقع، وتزامنًا مع ذلك قاموا ببرمجة وتطوير هذا النظام الرقمي المتكامل لإدارته وتسييره. عند انضمامكم إلينا واستخدامكم لهذا النظام، فإننا لا نعتبركم مجرد مستخدمين، بل أعضاءً خيريين ومساهمين فاعلين في مجتمعنا الممتد وشراكتنا المستدامة لدعم كتاب الله وأهله.
		</p>
		
		<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
		  <button 
			onClick={() => setIsDemoModalOpen(true)} 
			style={{ padding: '16px 32px', backgroundColor: theme.primary, color: theme.white, fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: theme.shadowLg, transition: 'background-color 0.2s' }}
			onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.primaryHover}
			onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.primary}
		  >
			<Book size={18} /> طلب الحصول على النظام ومساحتكم الخاصة
		  </button>
		  <Link 
			to="/login" 
			style={{ padding: '16px 32px', backgroundColor: theme.white, color: theme.darkNavy, border: `1px solid ${theme.gray200}`, fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', boxShadow: theme.shadowSm, transition: 'background-color 0.2s' }}
			onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.gray50}
			onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.white}
		  >
			الدخول للنظام <ArrowLeft size={18} />
		  </Link>
		</div>
	  </section>

	  {/* FEATURES SECTION */}
	  <section style={{ padding: '96px 0', backgroundColor: theme.white, borderTop: `1px solid ${theme.gray200}`, borderBottom: `1px solid ${theme.gray200}` }}>
		<div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
		  <div style={{ textAlign: 'center', marginBottom: '64px' }}>
			<h2 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '16px', color: theme.darkNavy }}>كيف يعمل نظام إسناد وتدبير الحلقات</h2>
			<p style={{ color: theme.gray500, maxWidth: '672px', margin: '0 auto' }}>تغطية شاملة لكافة احتياجات المركز القرآني في منصة واحدة متكاملة ومنظمة تكنولوجياً.</p>
		  </div>

		  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', position: 'relative' }}>
			
			<div className="feature-card" style={{ backgroundColor: theme.white, border: `1px solid ${theme.gray200}`, padding: '24px', borderRadius: '16px', boxShadow: theme.shadowSm }}>
			  <div className="icon-box" style={{ width: '48px', height: '48px', backgroundColor: theme.gray100, color: theme.gray600, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}><Users size={24} /></div>
			  <h3 className="card-title" style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '8px', color: theme.darkNavy }}>1. إدارة الطلاب</h3>
			  <p style={{ fontSize: '0.875rem', color: theme.gray500, lineHeight: 1.5 }}>تسجيل الطلاب، إدارة الحضور والانصراف، ومتابعة السجلات الأكاديمية بدقة وسهولة.</p>
			</div>
			
			<div className="feature-card" style={{ backgroundColor: theme.white, border: `1px solid ${theme.gray200}`, padding: '24px', borderRadius: '16px', boxShadow: theme.shadowSm }}>
			  <div className="icon-box" style={{ width: '48px', height: '48px', backgroundColor: theme.gray100, color: theme.gray600, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}><GraduationCap size={24} /></div>
			  <h3 className="card-title" style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '8px', color: theme.darkNavy }}>2. شؤون المعلمين</h3>
			  <p style={{ fontSize: '0.875rem', color: theme.gray500, lineHeight: 1.5 }}>إسناد الحلقات للمعلمين، تقييم الأداء، ومتابعة الإنجاز اليومي لمقرأة الحفاظ.</p>
			</div>
			
			<div className="feature-card" style={{ backgroundColor: theme.white, border: `1px solid ${theme.gray200}`, padding: '24px', borderRadius: '16px', boxShadow: theme.shadowSm }}>
			  <div className="icon-box" style={{ width: '48px', height: '48px', backgroundColor: theme.gray100, color: theme.gray600, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}><Book size={24} /></div>
			  <h3 className="card-title" style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '8px', color: theme.darkNavy }}>3. التسميع والمقرأة</h3>
			  <p style={{ fontSize: '0.875rem', color: theme.gray500, lineHeight: 1.5 }}>سجل إلكتروني دقيق لمقدار الحفظ والمراجعة، مع نظام تنبيهات فوري ومباشر لأولياء الأمور.</p>
			</div>
			
			<div className="feature-card" style={{ backgroundColor: theme.white, border: `1px solid ${theme.gray200}`, padding: '24px', borderRadius: '16px', boxShadow: theme.shadowSm }}>
			  <div className="icon-box" style={{ width: '48px', height: '48px', backgroundColor: theme.gray100, color: theme.gray600, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}><Wallet size={24} /></div>
			  <h3 className="card-title" style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '8px', color: theme.darkNavy }}>4. الإدارة المالية</h3>
			  <p style={{ fontSize: '0.875rem', color: theme.gray500, lineHeight: 1.5 }}>إدارة التبرعات والصدقات، رسوم النقل، مكافآت المعلمين التشجيعية، والمصروفات التشغيلية للمركز.</p>
			</div>

		  </div>
		</div>
	  </section>

	  {/* FOOTER */}
	  <footer style={{ backgroundColor: theme.darkNavy, padding: '48px 0', textAlign: 'center' }}>
		<div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
		  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', opacity: 0.5 }}>
			<div style={{ width: '24px', height: '24px', backgroundColor: theme.white, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			  <span style={{ color: theme.darkNavy, fontWeight: 'bold', fontSize: '12px' }}>O</span>
			</div>
			<span style={{ fontWeight: 'bold', color: theme.white, letterSpacing: '-0.025em' }}>OPERIX Solutions</span>
		  </div>
		  <p style={{ color: theme.gray500, fontSize: '14px', marginBottom: '24px' }}>مبادرة تقنية مجتمعية مخصصة ومطورة كلياً لخدمة القرآن الكريم وأهله في كل مكان.</p>
		  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', fontSize: '14px', fontWeight: 500 }}>
			<span onClick={() => setIsSupportModalOpen(true)} style={{ color: '#9ca3af', textDecoration: 'none', cursor: 'pointer' }}>الدعم الفني</span>
			<a href="https://www.operix-solutions.com" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', textDecoration: 'none' }}>موقع الشركة الرسمي</a>
		  </div>
		</div>
	  </footer>

	  {/* DEMO MODAL */}
	  {isDemoModalOpen && (
		<div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
		  <div style={{ backgroundColor: theme.white, borderRadius: '16px', maxWidth: '440px', width: '100%', boxShadow: theme.shadowLg, overflow: 'hidden' }}>
			
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: `1px solid ${theme.gray100}` }}>
			  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: theme.darkNavy }}>طلب نسخة من النظام</h3>
			  <button onClick={() => setIsDemoModalOpen(false)} style={{ background: 'none', border: 'none', color: theme.gray500, cursor: 'pointer' }}><X size={20} /></button>
			</div>
			
			<form onSubmit={handleDemoRequest} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
			  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
				<label style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.gray500 }}>الاسم الكريم</label>
				<input type="text" required value={demoForm.name} onChange={e => setDemoForm({ ...demoForm, name: e.target.value })} style={{ width: '100%', height: '44px', backgroundColor: theme.white, border: `1px solid ${theme.gray200}`, borderRadius: '8px', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
			  </div>
			  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
				<label style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.gray500 }}>البريد الإلكتروني</label>
				<input type="email" required value={demoForm.email} onChange={e => setDemoForm({ ...demoForm, email: e.target.value })} dir="ltr" style={{ width: '100%', height: '44px', backgroundColor: theme.white, border: `1px solid ${theme.gray200}`, borderRadius: '8px', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box', textAlign: 'right', outline: 'none' }} />
			  </div>
			  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
				<label style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.gray500 }}>اسم المركز أو الحلقة</label>
				<input type="text" required value={demoForm.center} onChange={e => setDemoForm({ ...demoForm, center: e.target.value })} style={{ width: '100%', height: '44px', backgroundColor: theme.white, border: `1px solid ${theme.gray200}`, borderRadius: '8px', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
			  </div>
			  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
				<label style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.gray500 }}>القدرة الاستيعابية للطلاب</label>
				<select value={demoForm.size} onChange={e => setDemoForm({ ...demoForm, size: e.target.value })} style={{ width: '100%', height: '44px', backgroundColor: theme.white, border: `1px solid ${theme.gray200}`, borderRadius: '8px', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}>
				  <option>1 - 50 طالب</option>
				  <option>51 - 200 طالب</option>
				  <option>أكثر من 200 طالب</option>
				</select>
			  </div>
			  <button type="submit" disabled={isSubmitting} style={{ width: '100%', height: '48px', marginTop: '16px', backgroundColor: theme.primary, color: theme.white, fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
				{isSubmitting ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> جاري الإرسال...</> : 'إرسال الطلب لإدارة المبادرة'}
			  </button>
			</form>
		  </div>
		</div>
	  )}

	  {/* INTERACTIVE POP-UP SUPPORT MODAL */}
	  {isSupportModalOpen && (
		<div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
		  <div style={{ backgroundColor: theme.white, borderRadius: '16px', maxWidth: '460px', width: '100%', boxShadow: theme.shadowLg, overflow: 'hidden' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: `1px solid ${theme.gray100}`, backgroundColor: theme.gray50 }}>
			  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
				<HelpCircle size={20} style={{ color: theme.primary }} />
				<h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', margin: 0, color: theme.darkNavy }}>مركز المساعدة والدعم الفني المباشر</h3>
			  </div>
			  <button onClick={() => setIsSupportModalOpen(false)} style={{ background: 'none', border: 'none', color: theme.gray500, cursor: 'pointer' }}><X size={20} /></button>
			</div>
			<div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', lineHeight: 1.6 }}>
			  <p style={{ margin: 0, fontSize: '14px', color: theme.gray600 }}>
				إذا كنت تواجه أي صعوبة تقنية في استخدام مساحتك البرمجية أو ترغب في الاستفسار عن تفعيل الخصائص المالية المتقدمة، يمكنك التواصل مباشرة مع مهندسي النظام لدينا.
			  </p>
			  <div style={{ padding: '14px', backgroundColor: theme.white, borderRadius: '12px', border: `1px solid ${theme.gray200}`, direction: 'ltr', textAlign: 'left' }}>
				<span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', color: theme.gray500, display: 'block', marginBottom: '2px' }}>Official Support Email</span>
				<a href="mailto:support@operix-solutions.com" style={{ color: theme.primary, fontWeight: 'bold', textDecoration: 'none', fontSize: '15px' }}>support@operix-solutions.com</a>
			  </div>
			  <p style={{ margin: 0, fontSize: '12px', color: theme.gray400, textAlign: 'center' }}>
				نعمل على مدار الساعة لخدمتكم وضمان استقرار عملياتكم التعليمية والقرآنية.
			  </p>
			</div>
		  </div>
		</div>
	  )}

	  {/* STYLES FOR ANIMATIONS AND INTERACTIONS */}
	  <style>{`
		@keyframes spin { 100% { transform: rotate(360deg); } }
		
		/* Interactive Cards CSS */
		.feature-card {
		  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		  cursor: pointer;
		}
		
		.feature-card:hover {
		  transform: translateY(-6px);
		  border-color: ${theme.primary} !important;
		  box-shadow: 0 12px 24px -8px rgba(16, 185, 129, 0.15), 0 4px 12px -4px rgba(16, 185, 129, 0.1) !important;
		}
		
		.icon-box {
		  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		}
		
		.feature-card:hover .icon-box {
		  background-color: ${theme.primary} !important;
		  color: ${theme.white} !important;
		  transform: scale(1.08);
		}

		.card-title {
		  transition: color 0.3s ease;
		}

		.feature-card:hover .card-title {
		  color: ${theme.primary};
		}
	  `}</style>
	</div>
  );
}