import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Loader2, X, Building2, LayoutTemplate } from 'lucide-react';

const OPS_API = 'https://script.google.com/macros/s/AKfycby7xDEoYBzGM7sAAAkX0LDTKNHo63LjbgmaC-0VLXESPFj7BSl10GE-sIqM-Ss3wE8/exec';
const TARGET_EMAIL = 'support@operix-solutions.com';

// Unified Theme matching the new Landing Page
const theme = {
  bgMain: '#F8FAF9',
  primary: '#2D5948',
  primaryHover: '#224436',
  white: '#ffffff',
  textDark: '#1f2937',
  textGray: '#6b7280',
  textLight: '#9ca3af',
  borderLight: '#f3f4f6',
  accent: '#E5F0E8',
  accentDark: '#B9DDBE',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  fontFamily: '"Tajawal", "Cairo", system-ui, sans-serif'
};

export default function Subscription() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', center: '', role: 'مدير مركز' });

  const openModal = (planName) => {
	setSelectedPlan(planName);
	setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
	e.preventDefault();
	setIsSubmitting(true);
	try {
	  const payload = {
		action: 'send_email',
		emailTo: TARGET_EMAIL,
		subject: `طلب مبادرة Operix الخيرية: ${formData.center} (${selectedPlan})`,
		body: `الاسم: ${formData.name}\nالصفة: ${formData.role}\nالبريد: ${formData.email}\nالجوال: ${formData.phone}\nالمركز: ${formData.center}\n\nنوع الاحتياج: ${selectedPlan}\n\nيرجى التواصل معهم لإعداد المساحة الخاصة بهم.`
	  };
	  
	  await fetch(OPS_API, { 
		method: 'POST', 
		mode: 'no-cors', 
		headers: { 'Content-Type': 'text/plain' }, 
		body: JSON.stringify(payload) 
	  });
	  
	  alert(`تم إرسال طلبكم لاستضافة (${selectedPlan}) بنجاح! في ميزان حسناتكم.`);
	  setIsModalOpen(false);
	  setFormData({ name: '', email: '', phone: '', center: '', role: 'مدير مركز' });
	} catch (err) {
	  alert("حدث خطأ أثناء الإرسال.");
	} finally {
	  setIsSubmitting(false);
	}
  };

  const inputStyle = {
	width: '100%',
	height: '48px',
	backgroundColor: theme.bgMain,
	border: `1px solid ${theme.borderLight}`,
	borderRadius: '12px',
	padding: '0 16px',
	fontSize: '14px',
	color: theme.textDark,
	boxSizing: 'border-box',
	outline: 'none',
	transition: 'all 0.2s ease'
  };

  return (
	<>
	  <style>{`
		@keyframes spin { 100% { transform: rotate(360deg); } }
		.input-focus:focus { border-color: ${theme.primary}; box-shadow: 0 0 0 3px rgba(45, 89, 72, 0.1); background-color: ${theme.white}; }
		.btn-outline-hover:hover { background-color: ${theme.accent} !important; }
		.btn-primary-hover:hover { background-color: ${theme.primaryHover} !important; }
		.card-hover:hover { box-shadow: ${theme.shadowMd}; transform: translateY(-2px); }
		.fade-in { animation: fadeIn 0.4s ease-out forwards; }
		@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
	  `}</style>

	  <div dir="rtl" style={{ minHeight: '100vh', backgroundColor: theme.bgMain, fontFamily: theme.fontFamily, color: theme.textDark, paddingBottom: '80px' }}>
		
		{/* HEADER */}
		<header style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', backgroundColor: 'rgba(248, 250, 249, 0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${theme.borderLight}` }}>
		  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
			<div style={{ width: '40px', height: '40px', backgroundColor: theme.primary, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			  <LayoutTemplate color={theme.white} size={24} />
			</div>
			<div>
			  <h1 style={{ margin: 0, fontWeight: 'bold', fontSize: '18px', color: theme.primary, lineHeight: 1.2 }}>نظام ابن عباس</h1>
			  <p style={{ margin: 0, fontSize: '12px', color: theme.textGray }}>Operix Solutions</p>
			</div>
		  </div>

		  <nav style={{ display: 'flex', alignItems: 'center', gap: '32px', fontWeight: 'bold', fontSize: '14px', color: theme.textGray }}>
			<a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>الرئيسية</a>
			<a href="/subscription" style={{ textDecoration: 'none', color: theme.primary }}>الباقات</a>
		  </nav>

		  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
			<button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: theme.textGray, fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = theme.primary} onMouseLeave={(e) => e.currentTarget.style.color = theme.textGray}>
			  العودة للرئيسية <ArrowLeft size={16} />
			</button>
			<a href="/login" style={{ padding: '8px 24px', backgroundColor: theme.primary, color: theme.white, borderRadius: '999px', fontWeight: 'bold', fontSize: '14px', border: 'none', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
			  الذهاب للنظام
			</a>
		  </div>
		</header>

		{/* PRICING CONTENT */}
		<section style={{ paddingTop: '80px', paddingLeft: '32px', paddingRight: '32px', maxWidth: '1280px', margin: '0 auto' }}>
		  <div className="fade-in" style={{ textAlign: 'center', marginBottom: '64px' }}>
			<h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: theme.primary, marginBottom: '16px', letterSpacing: '-0.025em' }}>برنامج أوبيركس الخيري</h1>
			<p style={{ fontSize: '1.125rem', color: theme.textGray, maxWidth: '672px', margin: '0 auto', lineHeight: 1.8 }}>
			  هذا النظام التقني مقدم بشكل مجاني بالكامل للمراكز والحلقات القرآنية كجزء من المسؤولية المجتمعية والوقف التقني لشركة Operix Solutions.
			</p>
		  </div>
		  
		  <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', maxWidth: '960px', margin: '0 auto', alignItems: 'center' }}>
			
			{/* CARD 1: MOSQUES */}
			<div className="card-hover" style={{ backgroundColor: theme.white, border: `1px solid ${theme.borderLight}`, borderRadius: '24px', padding: '40px 32px', boxShadow: theme.shadowSm, transition: 'all 0.2s' }}>
			  <div style={{ display: 'inline-block', backgroundColor: theme.accent, color: theme.primary, padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', marginBottom: '16px' }}>الأساسية</div>
			  <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: theme.textDark, marginBottom: '8px' }}>المساجد والحلقات</h3>
			  <p style={{ color: theme.textGray, fontSize: '14px', marginBottom: '32px', height: '40px', lineHeight: 1.6 }}>مثالي لحلقات التحفيظ المستقلة في المساجد والمدارس.</p>
			  
			  <div style={{ fontSize: '2.25rem', fontWeight: 900, color: theme.primary, marginBottom: '32px' }}>مجاني بالكامل</div>
			  
			  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
				<li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: theme.textDark, fontWeight: 'bold' }}><CheckCircle size={20} color={theme.accentDark} /> عدد طلاب غير محدود</li>
				<li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: theme.textDark, fontWeight: 'bold' }}><CheckCircle size={20} color={theme.accentDark} /> إدارة الحضور والغياب</li>
				<li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: theme.textDark, fontWeight: 'bold' }}><CheckCircle size={20} color={theme.accentDark} /> شهادات للطلاب</li>
				<li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: theme.textDark, fontWeight: 'bold' }}><CheckCircle size={20} color={theme.accentDark} /> استضافة سحابية آمنة</li>
			  </ul>
			  
			  <button onClick={() => openModal('حلقات المساجد')} className="btn-outline-hover" style={{ width: '100%', padding: '14px', backgroundColor: theme.white, border: `2px solid ${theme.accentDark}`, color: theme.primary, fontWeight: 'bold', borderRadius: '999px', cursor: 'pointer', transition: 'background-color 0.2s', fontSize: '16px' }}>
				طلب إنشاء مساحة
			  </button>
			</div>

			{/* CARD 2: CENTERS (HIGHLIGHTED) */}
			<div style={{ backgroundColor: theme.primary, borderRadius: '24px', padding: '40px 32px', boxShadow: theme.shadowXl, position: 'relative', transform: 'scale(1.05)', zIndex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
			  {/* Decorative Background Element */}
			  <div style={{ position: 'absolute', top: '-64px', right: '-64px', width: '256px', height: '256px', backgroundColor: theme.accent, borderRadius: '50%', opacity: 0.1, zIndex: 0 }}></div>
			  
			  <div style={{ position: 'relative', zIndex: 1 }}>
				<div style={{ position: 'absolute', top: '-40px', right: '50%', transform: 'translate(50%, -50%)', backgroundColor: theme.accentDark, color: theme.primary, fontSize: '12px', fontWeight: 'bold', padding: '6px 16px', borderRadius: '9999px', boxShadow: theme.shadowSm }}>الأكثر طلباً</div>
				
				<h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: theme.white, marginBottom: '8px' }}>المراكز والمعاهد القرآنية</h3>
				<p style={{ color: theme.accent, fontSize: '14px', marginBottom: '32px', height: '40px', lineHeight: 1.6, opacity: 0.9 }}>المراكز الكبرى التي تتطلب إدارة مالية ومقرأة للمستويات.</p>
				
				<div style={{ fontSize: '2.25rem', fontWeight: 900, color: theme.white, marginBottom: '32px' }}>مجاني برعاية Operix</div>
				
				<ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
				  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: theme.white, fontWeight: 'bold' }}><CheckCircle size={20} color={theme.accentDark} /> كل مميزات الحلقات الأساسية</li>
				  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: theme.white, fontWeight: 'bold' }}><CheckCircle size={20} color={theme.accentDark} /> نظام الإدارة المالية (واردات/مصروفات)</li>
				  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: theme.white, fontWeight: 'bold' }}><CheckCircle size={20} color={theme.accentDark} /> نظام مقرأة المعلمين (المراجعة والتسميع)</li>
				  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: theme.white, fontWeight: 'bold' }}><CheckCircle size={20} color={theme.accentDark} /> لوحة تحكم متقدمة للإدارة المركزية</li>
				</ul>
				
				<button onClick={() => openModal('المراكز الكبرى')} style={{ width: '100%', padding: '14px', backgroundColor: theme.white, border: 'none', color: theme.primary, fontWeight: 'bold', borderRadius: '999px', cursor: 'pointer', transition: 'all 0.2s', fontSize: '16px', boxShadow: theme.shadowSm }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
				  طلب تفعيل المركز
				</button>
			  </div>
			</div>

		  </div>
		</section>

		{/* SUBSCRIPTION REQUEST MODAL */}
		{isModalOpen && (
		  <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(45, 89, 72, 0.75)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
			<div className="fade-in" style={{ backgroundColor: theme.white, borderRadius: '24px', maxWidth: '500px', width: '100%', boxShadow: theme.shadowXl, overflow: 'hidden', border: `1px solid ${theme.borderLight}` }}>
			  
			  <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.borderLight}` }}>
				<div>
				  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: theme.primary, margin: 0 }}>طلب تفعيل: {selectedPlan}</h3>
				  <p style={{ fontSize: '12px', color: theme.textGray, margin: '4px 0 0 0' }}>سيتم مراجعة الطلب والتواصل معكم لإعداد المساحة.</p>
				</div>
				<button onClick={() => setIsModalOpen(false)} style={{ background: theme.bgMain, border: 'none', color: theme.textGray, cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.borderLight} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.bgMain}>
				  <X size={20} />
				</button>
			  </div>
			  
			  <form onSubmit={handleSubmit} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
				  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
					<label style={{ fontSize: '13px', fontWeight: 'bold', color: theme.textDark }}>الاسم الكريم</label>
					<input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-focus" style={inputStyle} />
				  </div>
				  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
					<label style={{ fontSize: '13px', fontWeight: 'bold', color: theme.textDark }}>رقم الجوال</label>
					<input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="input-focus" style={{...inputStyle, textAlign: 'left'}} dir="ltr" />
				  </div>
				</div>
				
				<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
				  <label style={{ fontSize: '13px', fontWeight: 'bold', color: theme.textDark }}>البريد الإلكتروني للإدارة</label>
				  <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="input-focus" style={{...inputStyle, textAlign: 'left'}} dir="ltr" />
				</div>
				
				<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
				  <label style={{ fontSize: '13px', fontWeight: 'bold', color: theme.textDark }}>اسم المسجد أو المركز</label>
				  <input type="text" required value={formData.center} onChange={e => setFormData({ ...formData, center: e.target.value })} className="input-focus" style={inputStyle} />
				</div>

				<div style={{ paddingTop: '16px', marginTop: '8px' }}>
				  <button type="submit" disabled={isSubmitting} className="btn-primary-hover" style={{ width: '100%', height: '54px', backgroundColor: theme.primary, color: theme.white, fontWeight: 'bold', fontSize: '16px', borderRadius: '999px', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s', boxShadow: theme.shadowMd }}>
					{isSubmitting ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> جاري الإرسال...</> : 'إرسال طلب الانضمام'}
				  </button>
				  <p style={{ textAlign: 'center', fontSize: '12px', color: theme.textLight, marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', margin: '20px 0 0 0', fontWeight: 'bold' }}>
					<Building2 size={16}/> مبادرة تقنية من Operix Solutions
				  </p>
				</div>
			  </form>

			</div>
		  </div>
		)}

	  </div>
	</>
  );
}