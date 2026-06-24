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

  // الألوان المتناسقة مع الثيم الجديد
  const theme = {
	primary: '#2A5D4E', // الأخضر الغامق
	bg: '#F9FAFB', // خلفية رمادية فاتحة جداً للمحتوى
	border: '#E0EFDF' // أخضر فاتح للحدود
  };

  const styles: { [key: string]: React.CSSProperties } = {
	layout: { 
	  display: 'flex', 
	  height: '100vh', 
	  width: '100vw', 
	  backgroundColor: theme.bg, 
	  direction: 'rtl', 
	  fontFamily: 'system-ui, -apple-system, sans-serif',
	  overflow: 'hidden' 
	},
	mainArea: { 
	  flex: 1, 
	  display: 'flex', 
	  flexDirection: 'column', 
	  overflow: 'hidden' 
	},
	topBar: { 
	  height: '80px', // مطابقة لارتفاع ترويسة الشريط الجانبي
	  backgroundColor: '#ffffff', 
	  borderBottom: `1px solid ${theme.border}`, 
	  display: 'flex', 
	  alignItems: 'center', 
	  justifyContent: 'space-between', 
	  padding: '0 32px', 
	  flexShrink: 0, 
	  zIndex: 10,
	  transition: 'all 0.3s'
	},
	topTitle: { 
	  margin: 0, 
	  color: theme.primary, 
	  fontSize: '1.25rem', 
	  fontWeight: 900 
	},
	userInfo: { 
	  display: 'flex', 
	  alignItems: 'center', 
	  gap: '16px' 
	},
	divider: { 
	  width: '2px', 
	  height: '24px', 
	  backgroundColor: theme.border, 
	  margin: '0 8px',
	  borderRadius: '2px'
	},
	btnLogout: { 
	  display: 'flex', 
	  alignItems: 'center', 
	  gap: '8px', 
	  padding: '8px 16px', 
	  backgroundColor: '#ffffff', 
	  border: '1px solid #fee2e2', 
	  borderRadius: '8px', 
	  color: '#ef4444', 
	  fontWeight: 800, 
	  cursor: 'pointer', 
	  fontSize: '0.85rem', 
	  transition: 'all 0.2s', 
	  fontFamily: 'inherit' 
	},
	avatar: { 
	  width: '40px', 
	  height: '40px', 
	  borderRadius: '10px', 
	  objectFit: 'cover', 
	  border: `2px solid ${theme.border}` 
	},
	userDetails: { 
	  display: 'flex', 
	  flexDirection: 'column', 
	  textAlign: 'left' 
	},
	userName: { 
	  fontSize: '0.9rem', 
	  fontWeight: 900, 
	  color: theme.primary 
	},
	userRole: { 
	  fontSize: '0.75rem', 
	  color: '#6b7280', 
	  fontWeight: 700 
	},
	contentArea: { 
	  flex: 1, 
	  padding: '32px', 
	  overflowY: 'auto',
	  backgroundColor: theme.bg
	}
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
			  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#fee2e2'; }}
			>
			  <LogoutIcon />
			  تسجيل الخروج
			</button>
			<div style={styles.divider}></div>
			<div style={styles.userDetails}>
			  <span style={styles.userName}>مدير النظام</span>
			  <span style={styles.userRole}>Administrator</span>
			</div>
			{/* تم تحديث لون خلفية الصورة الرمزية لتطابق الثيم الأخضر */}
			<img src="https://ui-avatars.com/api/?name=Admin&background=2A5D4E&color=fff" alt="User" style={styles.avatar} />
		  </div>
		</header>

		<div style={styles.contentArea} className="custom-scrollbar">
		  <Outlet />
		</div>
	  </main>
	</div>
  );
}