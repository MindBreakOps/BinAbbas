import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { supabase } from '../../lib/supabase';

// أيقونة خروج مخصصة SVG لتجنب الاعتماد على نصوص عادية أو إيموجي
const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
	<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
	<polyline points="16 17 21 12 16 7" />
	<line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
	await supabase.auth.signOut();
	navigate('/login');
  };

  const getPageTitle = () => {
	const path = location.pathname;
	if (path.includes('dashboard')) return 'لوحة القيادة';
	if (path.includes('students')) return 'إدارة الطلاب';
	if (path.includes('top-students')) return 'الطلاب الأوائل';
	if (path.includes('certificates')) return 'إصدار الشهادات';
	if (path.includes('teachers')) return 'إدارة المعلمين';
	if (path.includes('halaqat')) return 'سجل الحلقات';
	if (path.includes('attendance')) return 'الحضور والغياب';
	if (path.includes('exams')) return 'الاختبارات الشهرية';
	if (path.includes('news')) return 'النشرة والإعلانات';
	if (path.includes('financials')) return 'الإدارة المالية';
	return 'النظام';
  };

  const styles: { [key: string]: React.CSSProperties } = {
	layout: { display: 'flex', height: '100vh', backgroundColor: '#f9fafb', direction: 'rtl', fontFamily: 'system-ui, -apple-system, sans-serif' },
	mainArea: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
	topBar: { height: '64px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', flexShrink: 0, zIndex: 10 },
	topTitle: { margin: 0, color: '#111827', fontSize: '1.2rem', fontWeight: 800 },
	userInfo: { display: 'flex', alignItems: 'center', gap: '16px' },
	divider: { width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '0 8px' },
	btnLogout: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s', fontFamily: 'inherit' },
	avatar: { width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e7eb' },
	userDetails: { display: 'flex', flexDirection: 'column', textAlign: 'left' },
	userName: { fontSize: '0.85rem', fontWeight: 800, color: '#111827' },
	userRole: { fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 },
	contentArea: { flex: 1, padding: '32px', overflowY: 'auto' }
  };

  return (
	<div style={styles.layout}>
	  <Sidebar />
	  <main style={styles.mainArea}>
		<header style={styles.topBar}>
		  <div>
			<h3 style={styles.topTitle}>{getPageTitle()}</h3>
		  </div>
		  <div style={styles.userInfo}>
			<button 
			  onClick={handleLogout} 
			  style={styles.btnLogout}
			  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.borderColor = '#fca5a5'; }}
			  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
			>
			  <LogoutIcon />
			  تسجيل الخروج
			</button>
			<div style={styles.divider}></div>
			<div style={styles.userDetails}>
			  <span style={styles.userName}>مدير النظام</span>
			  <span style={styles.userRole}>Administrator</span>
			</div>
			<img src="https://ui-avatars.com/api/?name=Admin&background=111827&color=fff" alt="User" style={styles.avatar} />
		  </div>
		</header>

		<div style={styles.contentArea} className="custom-scrollbar">
		  <Outlet />
		</div>
	  </main>
	</div>
  );
}