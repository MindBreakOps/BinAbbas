import React, { useState, useEffect } from 'react';
import { Icon } from '../components/ui/Icons';

const themeColors = {
  darkGreen: '#064e3b',
  gold: '#d97706',
  cream: '#fffdf7',
  white: '#ffffff',
  textDark: '#111827',
  textGray: '#4b5563',
  borderLight: '#e5e7eb',
  borderGold: 'rgba(217, 119, 6, 0.3)',
};

export default function SettingsPreferences() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
	const currentTheme = document.documentElement.getAttribute('data-theme');
	setIsDarkMode(currentTheme === 'dark');
  }, []);

  const toggleDarkMode = () => {
	const newMode = !isDarkMode;
	setIsDarkMode(newMode);
	
	if (newMode) {
	  document.documentElement.setAttribute('data-theme', 'dark');
	  localStorage.setItem('theme', 'dark');
	} else {
	  document.documentElement.removeAttribute('data-theme');
	  localStorage.setItem('theme', 'light');
	}
  };

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', paddingBottom: '24px', borderBottom: `2px solid ${themeColors.borderLight}` },
	titleArea: { margin: 0 },
	title: { fontSize: '1.6rem', fontWeight: 900, color: themeColors.darkGreen, margin: '0 0 8px 0' },
	subtitle: { fontSize: '0.95rem', color: themeColors.textGray, margin: 0, fontFamily: 'system-ui, sans-serif' },
	
	// تصميم البطاقة المحدثة[cite: 7]
	card: { backgroundColor: themeColors.white, border: `1px solid ${themeColors.borderGold}`, borderRadius: '4px', padding: '32px', maxWidth: '700px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRight: `4px solid ${themeColors.gold}` },
	infoBox: { display: 'flex', flexDirection: 'column', gap: '8px' },
	label: { fontSize: '1.15rem', fontWeight: 900, color: themeColors.textDark },
	desc: { fontSize: '0.9rem', color: themeColors.textGray, fontFamily: 'system-ui, sans-serif' },
	
	toggleBtn: { padding: '12px 24px', borderRadius: '4px', border: `2px solid ${themeColors.darkGreen}`, backgroundColor: isDarkMode ? themeColors.darkGreen : themeColors.cream, color: isDarkMode ? themeColors.white : themeColors.darkGreen, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: isDarkMode ? '0 4px 12px rgba(6, 78, 59, 0.2)' : 'none' }
  };

  return (
	<div>
	  <div style={styles.header}>
		<div style={styles.titleArea}>
		  <h2 style={styles.title}>المظهر وتفضيلات العرض</h2>
		  <p style={styles.subtitle}>تخصيص واجهة المستخدم لتجربة استخدام أفضل</p>
		</div>
	  </div>

	  <div style={styles.card}>
		<div style={styles.infoBox}>
		  <span style={styles.label}>الوضع الليلي (Dark Mode)</span>
		  <span style={styles.desc}>يقلل من الوهج الأبيض ويحسن الرؤية في البيئات منخفضة الإضاءة.</span>
		</div>
		
		<button 
		  style={styles.toggleBtn} 
		  onClick={toggleDarkMode}
		  onMouseEnter={(e) => { if(!isDarkMode) e.currentTarget.style.backgroundColor = '#f1f5f9' }}
		  onMouseLeave={(e) => { if(!isDarkMode) e.currentTarget.style.backgroundColor = themeColors.cream }}
		>
		  <Icon name="cog" size={18} /> 
		  {isDarkMode ? 'تعطيل الوضع الليلي' : 'تفعيل الوضع الليلي'}
		</button>
	  </div>
	</div>
  );
}