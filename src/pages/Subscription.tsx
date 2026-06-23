import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/ui/Icons';

const OPS_API = 'https://script.google.com/macros/s/AKfycby7xDEoYBzGM7sAAAkX0LDTKNHo63LjbgmaC-0VLXESPFj7BSl10GE-sIqM-Ss3wE8/exec';
const TARGET_EMAIL = 'operixsolution@gmail.com';

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
	  
	  await fetch(OPS_API, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) });
	  
	  alert(`تم إرسال طلبكم لاستضافة (${selectedPlan}) بنجاح! في ميزان حسناتكم.`);
	  setIsModalOpen(false);
	  setFormData({ name: '', email: '', phone: '', center: '', role: 'مدير مركز' });
	} catch (err) {
	  alert("حدث خطأ أثناء الإرسال.");
	} finally {
	  setIsSubmitting(false);
	}
  };

  const styles: { [key: string]: React.CSSProperties } = {
	container: { minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'inherit', direction: 'rtl', paddingBottom: '60px' },
	header: { backgroundColor: '#fff', borderBottom: '1px solid var(--border-subtle)', padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
	hero: { textAlign: 'center', padding: '60px 20px 40px', maxWidth: '800px', margin: '0 auto' },
	grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', maxWidth: '1100px', margin: '0 auto', padding: '0 20px' },
	card: { backgroundColor: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' },
	cardHighlight: { backgroundColor: 'var(--forest-green)', color: '#fff', border: 'none', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px -5px rgba(17, 75, 50, 0.4)', transform: 'scale(1.02)' },
	priceTag: { fontSize: '2rem', fontWeight: 800, margin: '16px 0', color: 'inherit' },
	ul: { listStyle: 'none', padding: 0, margin: '0 0 32px 0', flexGrow: 1 },
	li: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', fontSize: '0.95rem', fontWeight: 600 },
	btnPrimary: { width: '100%', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '1rem', textAlign: 'center' },
	input: { width: '100%', padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: '8px', marginTop: '6px', fontFamily: 'inherit', boxSizing: 'border-box' }
  };

  return (
	<div style={styles.container}>
	  <div style={styles.header}>
		<button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 700 }}>
		  → العودة للرئيسية
		</button>
		<img src="/logo.png" alt="شعار" style={{ height: '36px' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
	  </div>

	  <div style={styles.hero}>
		<h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>برنامج أوبيركس الخيري</h1>
		<p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
		  هذا النظام التقني مقدم بشكل مجاني بالكامل للمراكز والحلقات القرآنية كجزء من المسؤولية المجتمعية والوقف التقني لشركة Operix Solutions.
		</p>
	  </div>

	  <div style={styles.grid}>
		
		{/* Card 1 */}
		<div style={styles.card}>
		  <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-primary)' }}>المساجد والحلقات</h3>
		  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>مثالي لحلقات التحفيظ المستقلة في المساجد.</p>
		  <div style={{ ...styles.priceTag, color: 'var(--forest-green)' }}>مجاني بالكامل</div>
		  <ul style={styles.ul}>
			<li style={styles.li}>✓ عدد طلاب غير محدود</li>
			<li style={styles.li}>✓ إدارة الحضور والغياب</li>
			<li style={styles.li}>✓ شهادات للطلاب</li>
			<li style={styles.li}>✓ استضافة سحابية آمنة</li>
		  </ul>
		  <button style={{ ...styles.btnPrimary, backgroundColor: 'var(--forest-light)', color: 'var(--forest-green)' }} onClick={() => openModal('حلقات المساجد')}>
			طلب إنشاء مساحة
		  </button>
		</div>

		{/* Card 2 (Highlight) */}
		<div style={styles.cardHighlight}>
		  <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', alignSelf: 'flex-start', marginBottom: '16px' }}>الأكثر طلباً</div>
		  <h3 style={{ fontSize: '1.5rem', margin: 0 }}>المراكز والمعاهد القرآنية</h3>
		  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>المراكز الكبرى التي تتطلب إدارة مالية ومقرأة.</p>
		  <div style={styles.priceTag}>مجاني برعاية Operix</div>
		  <ul style={{...styles.ul, color: '#fff'}}>
			<li style={styles.li}>✓ كل مميزات الحلقات</li>
			<li style={styles.li}>✓ نظام الإدارة المالية (واردات/مصروفات)</li>
			<li style={styles.li}>✓ نظام مقرأة المعلمين (Revisions)</li>
			<li style={styles.li}>✓ لوحة تحكم متقدمة للإدارة</li>
		  </ul>
		  <button style={{ ...styles.btnPrimary, backgroundColor: '#fff', color: 'var(--forest-green)' }} onClick={() => openModal('المراكز الكبرى')}>
			طلب تفعيل المركز
		  </button>
		</div>

	  </div>

	  {/* Modal */}
	  {isModalOpen && (
		<div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
		  <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '500px', overflow: 'hidden' }}>
			<div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
			  <h3 style={{ margin: 0, fontWeight: 800 }}>طلب تفعيل: {selectedPlan}</h3>
			  <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
			</div>
			<form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
			  <div style={{ display: 'flex', gap: '16px' }}>
				<div style={{ flex: 1 }}><label style={{ fontWeight: 700, fontSize: '0.85rem' }}>الاسم</label><input style={styles.input} required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
				<div style={{ flex: 1 }}><label style={{ fontWeight: 700, fontSize: '0.85rem' }}>الجوال</label><input type="tel" style={styles.input} required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
			  </div>
			  <div><label style={{ fontWeight: 700, fontSize: '0.85rem' }}>البريد الإلكتروني للإدارة</label><input type="email" style={styles.input} required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
			  <div><label style={{ fontWeight: 700, fontSize: '0.85rem' }}>اسم المسجد أو المركز</label><input style={styles.input} required value={formData.center} onChange={e => setFormData({...formData, center: e.target.value})} /></div>
			  <button type="submit" disabled={isSubmitting} style={{ ...styles.btnPrimary, backgroundColor: 'var(--forest-green)', color: '#fff', marginTop: '16px' }}>
				{isSubmitting ? 'جاري الإرسال...' : 'إرسال طلب الانضمام'}
			  </button>
			  <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '16px 0 0 0' }}>مبادرة تقنية من Operix Solutions لدعم القرآن الكريم</p>
			</form>
		  </div>
		</div>
	  )}
	</div>
  );
}