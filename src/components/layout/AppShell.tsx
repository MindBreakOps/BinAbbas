import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import styles from './AppShell.module.css';

export default function AppShell() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
	const { error } = await supabase.auth.signOut();
	if (!error) {
	  navigate('/login'); // توجيه المستخدم لصفحة الدخول بعد الخروج
	} else {
	  alert('حدث خطأ أثناء تسجيل الخروج');
	}
  };

  return (
	<div className={styles.appShell}>
	  <Sidebar />
	  <main className={styles.mainContent}>
		<header className={styles.topBar}>
		  <div>
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
			{/* زر تسجيل الخروج الجديد */}
			<button 
			  onClick={handleLogout}
			  style={{
				marginLeft: '16px',
				padding: '8px 12px',
				backgroundColor: '#fef2f2',
				color: '#b91c1c',
				border: '1px solid #fecaca',
				borderRadius: '8px',
				cursor: 'pointer',
				fontWeight: 700,
				fontFamily: 'inherit'
			  }}
			>
			  تسجيل الخروج
			</button>
		  </div>
		</header>

		<div className={styles.pageWrapper}>
		  <div className={styles.pageContainer}>
			<Outlet />
		  </div>
		</div>
	  </main>
	</div>
  );
}