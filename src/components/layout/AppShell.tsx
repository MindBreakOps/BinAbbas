import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { supabase } from '../../lib/supabase';

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
	await supabase.auth.signOut();
	navigate('/login');
  };

  // تحديد اسم الصفحة الحالية لعرضه في الشريط العلوي
  const getPageTitle = () => {
	const path = location.pathname;
	if (path.includes('dashboard')) return 'لوحة القيادة';
	if (path.includes('students')) return 'إدارة الطلاب';
	if (path.includes('top-students')) return 'الطلاب الأوائل';
	if (path.includes('certificates')) return 'الشهادات';
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
	topTitle: { margin: 0, color: '#111827', fontSize: '1.1rem', fontWeight: 800 },
	userInfo: { display: 'flex', alignItems: 'center', gap: '16px' },
	avatar: { width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' },
	userDetails: { display: 'flex', flexDirection: 'column', textAlign: 'left' },
	userName: { fontSize: '0.85rem', fontWeight: 700, color: '#111827' },
	userRole: { fontSize: '0.75rem', color: '#6b7280' },
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
			<button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '1rem', marginLeft: '12px' }}>
			  تسجيل الخروج
			</button>
			<div style={styles.userDetails}>
			  <span style={styles.userName}>مدير النظام</span>
			  <span style={styles.userRole}>Admin</span>
			</div>
			<img src="https://ui-avatars.com/api/?name=Admin&background=064e3b&color=fff" alt="User" style={styles.avatar} />
		  </div>
		</header>

		<div style={styles.contentArea} className="custom-scrollbar">
		  <Outlet />
		</div>
	  </main>
	</div>
  );
}