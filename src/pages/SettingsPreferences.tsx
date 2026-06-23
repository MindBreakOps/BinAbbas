import React, { useState, useEffect } from 'react';
import { Icon } from '../components/ui/Icons';

export default function SettingsPreferences() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // التحقق من الوضع الحالي عند تحميل الصفحة
  useEffect(() => {
	const currentTheme = document.documentElement.getAttribute('data-theme');
	setIsDarkMode(currentTheme === 'dark');
  }, []);

  const toggleDarkMode = () => {
	const newMode = !isDarkMode;
	setIsDarkMode(newMode);
	
	// حقن أو إزالة الخاصية من ملف الـ HTML
	if (newMode) {
	  document.documentElement.setAttribute('data-theme', 'dark');
	  localStorage.setItem('theme', 'dark');
	} else {
	  document.documentElement.removeAttribute('data-theme');
	  localStorage.setItem('theme', 'light');
	}
  };

  // Inline Styles Object
  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' },
	titleArea: { margin: 0 },
	title: { fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' },
	subtitle: { fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 },
	card: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '32px', maxWidth: '600px', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
	infoBox: { display: 'flex', flexDirection: 'column', gap: '4px' },
	label: { fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' },
	desc: { fontSize: '0.9rem', color: 'var(--text-secondary)' },
	toggleBtn: { padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: isDarkMode ? 'var(--forest-green)' : 'var(--bg-app)', color: isDarkMode ? '#fff' : 'var(--text-primary)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }
  };

  return (
	<div>
	  <div style={styles.header}>
		<div style={styles.titleArea}>
		  <h2 style={styles.title}>المظهر والتفضيلات</h2>
		  <p style={styles.subtitle}>تخصيص واجهة المستخدم والنظام</p>
		</div>
	  </div>

	  <div style={styles.card}>
		<div style={styles.infoBox}>
		  <span style={styles.label}>الوضع الليلي (Dark Mode)</span>
		  <span style={styles.desc}>تغيير ألوان النظام لتخفيف إجهاد العين في البيئات المظلمة.</span>
		</div>
		
		<button style={styles.toggleBtn} onClick={toggleDarkMode}>
		  <Icon name={isDarkMode ? 'cal' : 'cal'} size={18} /> 
		  {isDarkMode ? 'إيقاف الوضع الليلي' : 'تفعيل الوضع الليلي'}
		</button>
	  </div>
	</div>
  );
}