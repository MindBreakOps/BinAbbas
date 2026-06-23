import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const styles: { [key: string]: React.CSSProperties } = {
	container: {
	  minHeight: '100vh',
	  backgroundColor: 'var(--bg-app)',
	  display: 'flex',
	  flexDirection: 'column',
	  fontFamily: 'inherit',
	  direction: 'rtl'
	},
	nav: {
	  display: 'flex',
	  justifyContent: 'space-between',
	  alignItems: 'center',
	  padding: '24px 5%',
	  backgroundColor: 'var(--bg-card)',
	  borderBottom: '1px solid var(--border-subtle)',
	},
	logo: {
	  fontSize: '1.5rem',
	  fontWeight: 800,
	  color: 'var(--forest-green)',
	  margin: 0,
	},
	loginBtn: {
	  backgroundColor: 'var(--forest-green)',
	  color: '#fff',
	  border: 'none',
	  padding: '10px 24px',
	  borderRadius: '8px',
	  fontWeight: 700,
	  cursor: 'pointer',
	  fontSize: '1rem'
	},
	hero: {
	  flex: 1,
	  display: 'flex',
	  flexDirection: 'column',
	  justifyContent: 'center',
	  alignItems: 'center',
	  textAlign: 'center',
	  padding: '0 20px',
	},
	badge: {
	  backgroundColor: 'var(--forest-light)',
	  color: 'var(--forest-green)',
	  padding: '8px 16px',
	  borderRadius: '20px',
	  fontWeight: 800,
	  marginBottom: '24px',
	  fontSize: '0.9rem'
	},
	headline: {
	  fontSize: '3.5rem',
	  fontWeight: 800,
	  color: 'var(--text-primary)',
	  margin: '0 0 24px 0',
	  maxWidth: '800px',
	  lineHeight: 1.2
	},
	subHeadline: {
	  fontSize: '1.2rem',
	  color: 'var(--text-secondary)',
	  margin: '0 0 40px 0',
	  maxWidth: '600px',
	  lineHeight: 1.6
	},
	ctaGroup: {
	  display: 'flex',
	  gap: '16px',
	},
	primaryCta: {
	  backgroundColor: 'var(--forest-green)',
	  color: '#fff',
	  border: 'none',
	  padding: '16px 32px',
	  borderRadius: '12px',
	  fontWeight: 800,
	  fontSize: '1.1rem',
	  cursor: 'pointer',
	  boxShadow: '0 4px 14px rgba(17, 75, 50, 0.3)'
	},
	secondaryCta: {
	  backgroundColor: 'var(--bg-card)',
	  color: 'var(--text-primary)',
	  border: '1px solid var(--border-subtle)',
	  padding: '16px 32px',
	  borderRadius: '12px',
	  fontWeight: 800,
	  fontSize: '1.1rem',
	  cursor: 'pointer'
	}
  };

  return (
	<div style={styles.container}>
	  {/* Navbar */}
	  <nav style={styles.nav}>
		<h1 style={styles.logo}>نظام بن عباس</h1>
		<button style={styles.loginBtn} onClick={() => navigate('/login')}>
		  تسجيل الدخول
		</button>
	  </nav>

	  {/* Hero Section */}
	  <main style={styles.hero}>
		<span style={styles.badge}>الإصدار المؤسسي 2.0 🚀</span>
		<h2 style={styles.headline}>
		  نظام الإدارة المتكامل للحلقات القرآنية
		</h2>
		<p style={styles.subHeadline}>
		  منصة سحابية متطورة لإدارة الطلاب، المعلمين، الشؤون المالية، والمقرأة. مصممة خصيصاً للمراكز التي تبحث عن التميز المؤسسي والأداء العالي.
		</p>
		<div style={styles.ctaGroup}>
		  <button style={styles.primaryCta} onClick={() => navigate('/login')}>
			ابدأ الاستخدام الآن
		  </button>
		  <button style={styles.secondaryCta} onClick={() => window.open('https://operix.sa', '_blank')}>
			تواصل مع المبيعات
		  </button>
		</div>
	  </main>
	</div>
  );
}