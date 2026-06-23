import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Loader2, X, Building2 } from 'lucide-react';

const OPS_API = 'https://script.google.com/macros/s/AKfycby7xDEoYBzGM7sAAAkX0LDTKNHo63LjbgmaC-0VLXESPFj7BSl10GE-sIqM-Ss3wE8/exec';
const TARGET_EMAIL = 'support@operix-solutions.com';

const theme = {
  emerald: '#059669',
  emeraldHover: '#047857',
  gray900: '#111827',
  gray800: '#1f2937',
  gray700: '#374151',
  gray500: '#6b7280',
  gray400: '#9ca3af',
  gray300: '#d1d5db',
  gray200: '#e5e7eb',
  gray100: '#f3f4f6',
  gray50: '#f9fafb',
  white: '#ffffff',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  fontFamily: 'system-ui, -apple-system, sans-serif'
};

export default function Subscription() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', center: '', role: 'مدير مركز' });

  const openModal = (planName: string) => {
	setSelectedPlan(planName);
	setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
	height: '44px',
	backgroundColor: theme.white,
	border: `1px solid ${theme.gray300}`,
	borderRadius: '8px',
	padding: '0 12px',
	fontSize: '14px',
	color: theme.gray900,
	boxSizing: 'border-box' as const,
	outline: 'none',
  };

  return (
	<>
	  <style>{`
		@keyframes spin { 100% { transform: rotate(360deg); } }
		.input-focus:focus { border-color: ${theme.emerald}; box-shadow: 0 0 0 2px rgba(5,150,105,0.2); }
		.btn-gray-hover:hover { background-color: ${theme.gray50} !important; }
		.btn-emerald-hover:hover { background-color: ${theme.emeraldHover} !important; }
		.btn-black-hover:hover { background-color: #000000 !important; }
		.card-hover:hover { box-shadow: ${theme.shadowMd}; transform: translateY(-2px); }
		.fade-in { animation: fadeIn 0.4s ease-out forwards; }
		@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
	  `}</style>

	  <div dir="rtl" style={{ minHeight: '100vh', backgroundColor: theme.gray50, fontFamily: theme.fontFamily, color: theme.gray900, paddingBottom: '80px' }}>
		
		{/* HEADER */}
		<div style={{ backgroundColor: theme.white, borderBottom: `1px solid ${theme.gray200}`, padding: '24px', position: 'relative', zIndex: 10, boxShadow: theme.shadowSm }}>
		  <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
			  <img src="/logo.png" alt="شعار" style={{ height: '36px', objectFit: 'contain' }} onError={(e) => {
				e.currentTarget.style.display = 'none';
				e.currentTarget.parentElement!.innerHTML = `<div style="width: 32px; height: 32px; background-color: ${theme.gray900}; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: ${theme.shadowSm};"><span style="color: ${theme.white}; font-weight: bold; font-size: 18px;">O</span></div>`;
			  }} />
			  <span style={{ fontWeight: 'bold', fontSize: '20px', letterSpacing: '-0.025em' }}>
				نظام إسناد <span style={{ color: theme.emerald, fontSize: '14px' }}>الخيري</span>
			  </span>
			</div>
			
			<button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: theme.gray600, textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
			  العودة للرئيسية <ArrowLeft size={18} />
			</button>
		  </div>
		</div>

		{/* PRICING CONTENT */}
		<section style={{ paddingTop: '64px', paddingLeft: '24px', paddingRight: '24px', maxWidth: '1280px', margin: '0 auto' }}>
		  <div className="fade-in" style={{ textAlign: 'center', marginBottom: '64px' }}>
			<h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: theme.gray900, marginBottom: '16px', letterSpacing: '-0.025em' }}>برنامج أوبيركس الخيري</h1>
			<p style={{ fontSize: '1.125rem', color: theme.gray500, maxWidth: '672px', margin: '0 auto', lineHeight: 1.6 }}>
			  هذا النظام التقني مقدم بشكل مجاني بالكامل للمراكز والحلقات القرآنية كجزء من المسؤولية المجتمعية والوقف التقني لشركة Operix Solutions.
			</p>
		  </div>
		  
		  <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', maxWidth: '900px', margin: '0 auto', alignItems: 'center' }}>
			
			{/* CARD 1: MOSQUES */}
			<div className="card-hover" style={{ backgroundColor: theme.white, border: `1px solid ${theme.gray200}`, borderRadius: '16px', padding: '32px', boxShadow: theme.shadowSm, transition: 'all 0.2s' }}>
			  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: theme.gray900, marginBottom: '8px' }}>المساجد والحلقات</h3>
			  <p style={{ color: theme.gray500, fontSize: '14px', marginBottom: '24px', height: '40px' }}>مثالي لحلقات التحفيظ المستقلة في المساجد والمدارس.</p>
			  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: theme.emerald, marginBottom: '24px' }}>مجاني بالكامل</div>
			  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
				<li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: theme.gray700 }}><CheckCircle size={16} color={theme.emerald} /> عدد طلاب غير محدود</li>
				<li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: theme.gray700 }}><CheckCircle size={16} color={theme.emerald} /> إدارة الحضور والغياب</li>
				<li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: theme.gray700 }}><CheckCircle size={16} color={theme.emerald} /> شهادات للطلاب</li>
				<li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: theme.gray700 }}><CheckCircle size={16} color={theme.emerald} /> استضافة سحابية آمنة</li>
			  </ul>
			  <button onClick={() => openModal('حلقات المساجد')} className="btn-gray-hover" style={{ width: '100%', padding: '12px', backgroundColor: theme.white, border: `1px solid ${theme.emerald}`, color: theme.emerald, fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', transition: 'background-color 0.2s' }}>طلب إنشاء مساحة</button>
			</div>

			{/* CARD 2: CENTERS (HIGHLIGHTED) */}
			<div style={{ backgroundColor: theme.gray900, border: `1px solid ${theme.gray800}`, borderRadius: '16px', padding: '32px', boxShadow: theme.shadowXl, position: 'relative', transform: 'scale(1.05)', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
			  <div style={{ position: 'absolute', top: 0, right: '50%', transform: 'translate(50%, -50%)', backgroundColor: theme.emerald, color: theme.white, fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>الأكثر طلباً</div>
			  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: theme.white, marginBottom: '8px' }}>المراكز والمعاهد القرآنية</h3>
			  <p style={{ color: theme.gray400, fontSize: '14px', marginBottom: '24px', height: '40px' }}>المراكز الكبرى التي تتطلب إدارة مالية ومقرأة للمستويات.</p>
			  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: theme.white, marginBottom: '24px' }}>مجاني برعاية Operix</div>
			  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
				<li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: theme.gray300 }}><CheckCircle size={16} color="#34d399" /> كل مميزات الحلقات الأساسية</li>
				<li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: theme.gray300 }}><CheckCircle size={16} color="#34d399" /> نظام الإدارة المالية (واردات/مصروفات)</li>
				<li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: theme.gray300 }}><CheckCircle size={16} color="#34d399" /> نظام مقرأة المعلمين (المراجعة والتسميع)</li>
				<li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: theme.gray300 }}><CheckCircle size={16} color="#34d399" /> لوحة تحكم متقدمة للإدارة المركزية</li>
			  </ul>
			  <button onClick={() => openModal('المراكز الكبرى')} className="btn-emerald-hover" style={{ width: '100%', padding: '12px', backgroundColor: theme.emerald, border: 'none', color: theme.white, fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', transition: 'background-color 0.2s' }}>طلب تفعيل المركز</button>
			</div>

		  </div>
		</section>

		{/* SUBSCRIPTION REQUEST MODAL */}
		{isModalOpen && (
		  <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
			<div className="fade-in" style={{ backgroundColor: theme.white, borderRadius: '16px', maxWidth: '480px', width: '100%', boxShadow: theme.shadowXl, overflow: 'hidden' }}>
			  
			  <div style={{ backgroundColor: theme.gray50, borderBottom: `1px solid ${theme.gray200}`, padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<div>
				  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: theme.gray900, margin: 0 }}>طلب تفعيل: {selectedPlan}</h3>
				  <p style={{ fontSize: '12px', color: theme.gray500, margin: '4px 0 0 0' }}>سيتم مراجعة الطلب والتواصل معكم لإعداد المساحة.</p>
				</div>
				<button onClick={() => setIsModalOpen(false)} style={{ background: theme.white, border: 'none', color: theme.gray400, cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: theme.shadowSm }}><X size={18} /></button>
			  </div>
			  
			  <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
				  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
					<label style={{ fontSize: '12px', fontWeight: 'bold', color: theme.gray500 }}>الاسم الكريم</label>
					<input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-focus" style={inputStyle} />
				  </div>
				  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
					<label style={{ fontSize: '12px', fontWeight: 'bold', color: theme.gray500 }}>رقم الجوال</label>
					<input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="input-focus" style={{...inputStyle, textAlign: 'left'}} dir="ltr" />
				  </div>
				</div>
				
				<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
				  <label style={{ fontSize: '12px', fontWeight: 'bold', color: theme.gray500 }}>البريد الإلكتروني للإدارة</label>
				  <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="input-focus" style={{...inputStyle, textAlign: 'left'}} dir="ltr" />
				</div>
				
				<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
				  <label style={{ fontSize: '12px', fontWeight: 'bold', color: theme.gray500 }}>اسم المسجد أو المركز</label>
				  <input type="text" required value={formData.center} onChange={e => setFormData({ ...formData, center: e.target.value })} className="input-focus" style={inputStyle} />
				</div>

				<div style={{ paddingTop: '16px', borderTop: `1px solid ${theme.gray100}`, marginTop: '8px' }}>
				  <button type="submit" disabled={isSubmitting} className="btn-emerald-hover" style={{ width: '100%', height: '48px', backgroundColor: theme.emerald, color: theme.white, fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s', boxShadow: theme.shadowLg }}>
					{isSubmitting ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> جاري الإرسال...</> : 'إرسال طلب الانضمام'}
				  </button>
				  <p style={{ textAlign: 'center', fontSize: '12px', color: theme.gray400, marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', margin: '16px 0 0 0' }}>
					<Building2 size={14}/> مبادرة تقنية من Operix Solutions لدعم القرآن الكريم
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