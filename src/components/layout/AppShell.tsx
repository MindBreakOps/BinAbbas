import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import styles from './AppShell.module.css';

export default function AppShell() {
  const { user } = useAuth();

  return (
	<div className={styles.appShell}>
	  {/* الشريط الجانبي */}
	  <Sidebar />
	  
	  {/* القسم الأيسر الذي يحتوي على الشريط العلوي والمحتوى */}
	  <main className={styles.mainContent}>
		
		{/* الشريط العلوي */}
		<header className={styles.topBar}>
		  <div>
			{/* يمكن إضافة مسار التنقل (Breadcrumbs) هنا مستقبلاً */}
			<h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>لوحة التحكم</h3>
		  </div>
		  
		  <div className={styles.userInfo}>
			<div className={styles.userDetails}>
			  <span className={styles.userName}>{user?.email?.split('@')[0] || 'مدير النظام'}</span>
			  <span className={styles.userRole}>الإدارة العليا</span>
			</div>
			<div className={styles.avatar}>
			  {user?.email?.charAt(0).toUpperCase() || 'م'}
			</div>
		  </div>
		</header>

		{/* مساحة عرض الصفحات مع الإطار المحدِد */}
		<div className={styles.pageWrapper}>
		  <div className={styles.pageContainer}>
			<Outlet />
		  </div>
		</div>
		
	  </main>
	</div>
  );
}