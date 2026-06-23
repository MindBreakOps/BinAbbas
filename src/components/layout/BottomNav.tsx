import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icons';
import styles from './Navigation.module.css';

export default function BottomNav() {
  // Mobile users typically only get the daily operational tools on the quick bar
  const MOBILE_TABS = [
	{ to: '/', label: 'الرئيسية', icon: 'home' as const },
	{ to: '/halaqat', label: 'الحلقات', icon: 'book' as const },
	{ to: '/attendance', label: 'الحضور', icon: 'cal' as const },
	{ to: '/exams', label: 'الاختبار', icon: 'file' as const },
  ];

  return (
	<nav className={styles.bottomNav}>
	  {MOBILE_TABS.map((tab) => (
		<NavLink
		  key={tab.to}
		  to={tab.to}
		  className={({ isActive }) => 
			isActive ? `${styles.tabItem} ${styles.tabItemActive}` : styles.tabItem
		  }
		>
		  <Icon name={tab.icon} size={22} />
		  <span>{tab.label}</span>
		</NavLink>
	  ))}
	  
	  {/* Real Drawer Trigger - We will implement the drawer state in AppShell later */}
	  <button className={styles.tabItem} onClick={() => alert('Drawer coming next!')}>
		<Icon name="grid" size={22} />
		<span>المزيد</span>
	  </button>
	</nav>
  );
}