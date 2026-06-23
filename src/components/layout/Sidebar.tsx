import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icons';

export default function Sidebar() {
  const menuGroups = [
    {
      title: 'نظرة عامة',
      links: [
        { to: '/dashboard', label: 'لوحة القيادة', icon: 'home' }
      ]
    },
    {
      title: 'العمليات الأكاديمية',
      links: [
        { to: '/students', label: 'الطلاب', icon: 'users' },
        { to: '/halaqat', label: 'سجل الحلقات', icon: 'book' },
        { to: '/attendance', label: 'الحضور والغياب', icon: 'cal' },
        { to: '/exams', label: 'الاختبارات', icon: 'file' }
      ]
    },
    {
      title: 'التميز والمخرجات',
      links: [
        { to: '/top-students', label: 'الطلاب الأوائل', icon: 'star' },
        { to: '/certificates', label: 'إصدار الشهادات', icon: 'award' }
      ]
    },
    {
      title: 'الإدارة والمالية',
      links: [
        { to: '/teachers', label: 'المعلمون والكادر', icon: 'users' },
        { to: '/teacher-rev', label: 'مقرأة المعلمين', icon: 'book' },
        { to: '/financials/overview', label: 'المالية (FMIS)', icon: 'money' },
        { to: '/news', label: 'النشرة', icon: 'news' }
      ]
    }
  ];

  const styles: { [key: string]: React.CSSProperties } = {
    sidebar: { width: '260px', backgroundColor: '#111827', display: 'flex', flexDirection: 'column', flexShrink: 0 },
    brand: { height: '64px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #1f2937' },
    brandIcon: { width: '28px', height: '28px', backgroundColor: '#ffffff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111827', fontWeight: 900 },
    brandText: { fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '0.5px' },
    brandHighlight: { color: '#10b981' },
    navContainer: { flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '24px' },
    groupTitle: { fontSize: '0.7rem', fontWeight: 800, color: '#6b7280', margin: '0 0 12px 12px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '8px', color: '#d1d5db', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s' },
    navItemActive: { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.brandIcon}>O</div>
        <h2 style={styles.brandText}>نظام <span style={styles.brandHighlight}>ابن عباس</span></h2>
      </div>

      <nav style={styles.navContainer} className="custom-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            <div style={styles.groupTitle}>{group.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {group.links.map(link => (
                <NavLink 
                  key={link.to} 
                  to={link.to} 
                  style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navItemActive : {}) })}
                >
                  <Icon name={link.icon as any} size={18} />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}