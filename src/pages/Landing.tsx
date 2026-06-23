import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/ui/Icons';

const OPS_API = 'https://script.google.com/macros/s/AKfycby7xDEoYBzGM7sAAAkX0LDTKNHo63LjbgmaC-0VLXESPFj7BSl10GE-sIqM-Ss3wE8/exec';
const TARGET_EMAIL = 'operixsolution@gmail.com';

export default function Landing() {
  const navigate = useNavigate();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
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
		body: `الاسم: ${demoForm.name}\nالبريد: ${demoForm.email}\nالمركز: ${demoForm.center}\nعدد الطلاب: ${demoForm.size}\n\nطلب الحصول على نظام بن عباس الخيري من أوبيركس.`
	  };
	  
	  await fetch(OPS_API, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) });
	  alert("تم إرسال طلبك بنجاح! سيتواصل معك فريق المبادرة الخيرية قريباً.");
	  setIsDemoModalOpen(false);
	  setDemoForm({ name: '', email: '', center: '', size: '1-50' });
	} catch (err) {
	  alert("حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.");
	} finally {
	  setIsSubmitting(false);
	}
  };

  const styles: { [key: string]: React.CSSProperties } = {
	container: { minHeight: '100vh', backgroundColor: 'var(--bg-app)', fontFamily: 'inherit', direction: 'rtl' },
	nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, zIndex: 50 },
	logoWrap: { display: 'flex', alignItems: 'center', gap: '12px' },
	logoImg: { height: '40px', objectFit: 'contain' },
	btnPrimary: { backgroundColor: 'var(--forest-green)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', display: 'flex', gap: '8px', alignItems: 'center' },
	btnOutline: { backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' },
	hero: { padding: '80px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' },
	badge: { display: 'inline-block', backgroundColor: 'var(--forest-light)', color: 'var(--forest-green)', padding: '8px 16px', borderRadius: '20px', fontWeight: 800, marginBottom: '24px', fontSize: '0.9rem' },
	headline: { fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 24px 0', lineHeight: 1.2 },
	subHeadline: { fontSize: '1.2rem', color: 'var(--text-secondary)', margin: '0 0 40px 0', lineHeight: 1.6 },
	ctaGroup: { display: 'flex', justifyContent: 'center', gap: '16px' },
	modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
	modalCard: { backgroundColor: 'var(--bg-card)', borderRadius: '16px', width: '100%', maxWidth: '450px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' },
	modalHeader: { padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
	input: { width: '100%', padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: '8px', marginTop: '6px', fontFamily: 'inherit', boxSizing: 'border-box' }
  };

  return (
	<div style={styles.container}>
	  <nav style={styles.nav}>
		<div style={styles.logoWrap}>
		  <img src="/logo.png" alt="شعار بن عباس" style={styles.logoImg} onError={(e) => (e.currentTarget.style.display = 'none')} />
		  <div>
			<h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--forest-green)' }}>نظام بن عباس</h1>
			<span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>مبادرة أوبيركس الخيرية</span>
		  </div>
		</div>
		<div style={{ display: 'flex', gap: '12px' }}>
		  <button style={styles.btnOutline} onClick={() => navigate('/login')}>تسجيل الدخول</button>
		  <button style={styles.btnPrimary} onClick={() => navigate('/subscription')}>
			الانضمام للمبادرة
		  </button>
		</div>
	  </nav>

	  <main style={styles.hero}>
		<span style={styles.badge}>وقف تقني ولوجه الله تعالى 🕊️</span>
		<h2 style={styles.headline}>النظام المتكامل لإدارة الحلقات والمراكز القرآنية</h2>
		<p style={styles.subHeadline}>
		  نظام مؤسسي شامل لإدارة الطلاب، المعلمين، الشؤون المالية، ومقرأة الحفاظ. 
		  مقدم مجاناً للمراكز القرآنية ضمن برنامج المسؤولية المجتمعية (Charity Program) من <strong>Operix Solutions</strong>.
		</p>
		<div style={styles.ctaGroup}>
		  <button style={styles.btnPrimary} onClick={() => setIsDemoModalOpen(true)} style={{...styles.btnPrimary, padding: '16px 32px', fontSize: '1.1rem'}}>
			<Icon name="book" size={20} /> طلب الحصول على النظام
		  </button>
		</div>
	  </main>

	  {/* Modal */}
	  {isDemoModalOpen && (
		<div style={styles.modalOverlay}>
		  <div style={styles.modalCard}>
			<div style={styles.modalHeader}>
			  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>طلب نسخة من النظام</h3>
			  <button onClick={() => setIsDemoModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
			</div>
			<form onSubmit={handleDemoRequest} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
			  <div><label style={{ fontWeight: 700, fontSize: '0.9rem' }}>الاسم الكريم</label><input style={styles.input} required value={demoForm.name} onChange={e => setDemoForm({...demoForm, name: e.target.value})} /></div>
			  <div><label style={{ fontWeight: 700, fontSize: '0.9rem' }}>البريد الإلكتروني</label><input type="email" style={styles.input} required value={demoForm.email} onChange={e => setDemoForm({...demoForm, email: e.target.value})} /></div>
			  <div><label style={{ fontWeight: 700, fontSize: '0.9rem' }}>اسم المركز أو الحلقة</label><input style={styles.input} required value={demoForm.center} onChange={e => setDemoForm({...demoForm, center: e.target.value})} /></div>
			  <div>
				<label style={{ fontWeight: 700, fontSize: '0.9rem' }}>القدرة الاستيعابية للطلاب</label>
				<select style={styles.input} value={demoForm.size} onChange={e => setDemoForm({...demoForm, size: e.target.value})}>
				  <option>1 - 50 طالب</option><option>51 - 200 طالب</option><option>أكثر من 200 طالب</option>
				</select>
			  </div>
			  <button type="submit" disabled={isSubmitting} style={{...styles.btnPrimary, justifyContent: 'center', marginTop: '12px', padding: '14px'}}>
				{isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب لإدارة المبادرة'}
			  </button>
			</form>
		  </div>
		</div>
	  )}
	</div>
  );
}