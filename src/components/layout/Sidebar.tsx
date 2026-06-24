import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icons';

export default function Sidebar() {
  // حالة (State) للتحكم في فتح وإغلاق القوائم الفرعية
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]);
  };

  // هيكل الروابط المدمج (تصنيفات رئيسية + روابط + قوائم فرعية)
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
        { to: '/news', label: 'النشرة', icon: 'news' },
        { 
          label: 'المالية (FMIS)', 
          icon: 'money', 
          subLinks: [
            { to: '/financials/overview', label: 'الملخص العام' },
            { to: '/financials/budget', label: 'الميزانية' },
            { to: '/financials/donations', label: 'التبرعات' },
            { to: '/financials/expenses', label: 'المصروفات' },
          ]
        }
      ]
    },
    {
      title: 'إعدادات النظام',
      links: [
        { 
          label: 'الإعدادات', 
          icon: 'cog', 
          subLinks: [
            { to: '/settings/workspace', label: 'مساحة العمل' },
            { to: '/settings/accounts', label: 'الحسابات' },
            { to: '/settings/preferences', label: 'المظهر' },
          ]
        }
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
    navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '8px', color: '#d1d5db', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s', border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', textAlign: 'right', fontFamily: 'inherit' },
    navItemActive: { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
    subLinksContainer: { display: 'flex', flexDirection: 'column', gap: '4px', borderRight: '2px solid #1f2937', marginRight: '22px', marginTop: '4px' },
    subNavItem: { padding: '8px 16px 8px 16px', color: '#9ca3af', textDecoration: 'none', fontSize: '0.85rem', display: 'block', borderRadius: '6px', transition: 'all 0.2s' },
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
              
              {group.links.map((link) => {
                // إذا كان الرابط يحتوي على قوائم فرعية (SubLinks)
                if (link.subLinks) {
                  const isExpanded = expandedMenus.includes(link.label);
                  return (
                    <div key={link.label}>
                      <button 
                        style={{...styles.navItem, color: isExpanded ? '#ffffff' : '#d1d5db'}} 
                        onClick={() => toggleMenu(link.label)}
                      >
                        <Icon name={link.icon as any} size={18} />
                        <span style={{ flex: 1 }}>{link.label}</span>
                        <span style={{ fontSize: '0.7rem' }}>{isExpanded ? '▲' : '▼'}</span>
                      </button>
                      
                      {isExpanded && (
                        <div style={styles.subLinksContainer}>
                          {link.subLinks.map(sub => (
                            <NavLink 
                              key={sub.to} 
                              to={sub.to} 
                              style={({ isActive }) => ({ 
                                ...styles.subNavItem, 
                                ...(isActive ? { color: '#10b981', fontWeight: 800, backgroundColor: 'rgba(16, 185, 129, 0.05)' } : {}) 
                              })}
                            >
                              {sub.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // إذا كان رابطاً عادياً
                return (
                  <NavLink 
                    key={link.to} 
                    to={link.to!} 
                    style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navItemActive : {}) })}
                  >
                    <Icon name={link.icon as any} size={18} />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}

            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}