import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icons';

export default function Sidebar() {
  // حالة (State) للتحكم في فتح وإغلاق القوائم الفرعية
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  // حالة (State) للتحكم في طي وتوسيع الشريط الجانبي بالكامل
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const toggleMenu = (label: string) => {
    if (isCollapsed) setIsCollapsed(false); // خروج من وضع الطي عند محاولة فتح قائمة فرعية
    setExpandedMenus(prev => prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) setExpandedMenus([]); // إغلاق القوائم الفرعية عند طي الشريط
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
        { to: '/exams', label: 'الاختبارات', icon: 'file' },
       
       
        { to: '/teachers', label: 'المعلمون والكادر', icon: 'users' },
        { to: '/teacher-rev', label: 'مقرأة المعلمين', icon: 'book' },
        { to: '/news', label: 'النشرة', icon: 'news' },
        { to: '/results', label: 'النتائج والأجزاء', icon: 'file' }
      ]
    },
    {
      title: 'التميز والمخرجات',
      links: [
        { to: '/top-students', label: 'الطلاب الأوائل', icon: 'star' },
        { to: '/certificates', label: 'إصدار الشهادات', icon: 'award' },{ to: '/events', label: 'الأنشطة والاحتفالات', icon: 'star' }
      ]
    },
    {
      title: 'الإدارة والمالية',
      links: [
    
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

  // الألوان المحدثة: خلفية خضراء غامقة ونصوص بيضاء/خضراء فاتحة
  const theme = {
    sidebarBg: '#2A5D4E', // الأخضر الغامق للخلفية
    textPrimary: '#FFFFFF', // أبيض للنصوص الأساسية
    textSecondary: '#A7F3D0', // أخضر فاتح للعناوين والأيقونات الثانوية
    textMuted: '#D1FAE5', // لون باهت قليلاً للقوائم الفرعية
    activeBg: 'rgba(255, 255, 255, 0.15)', // خلفية شفافة للعنصر النشط
    border: '#37715F' // لون الحدود (أفتح قليلاً من الخلفية)
  };

  const styles: { [key: string]: React.CSSProperties | any } = {
    sidebar: { 
      width: isCollapsed ? '80px' : '260px', 
      backgroundColor: theme.sidebarBg, 
      display: 'flex', 
      flexDirection: 'column', 
      flexShrink: 0,
      borderLeft: `1px solid ${theme.border}`,
      transition: 'width 0.3s ease',
      boxShadow: '-2px 0 10px rgba(0,0,0,0.1)'
    },
    brand: { 
      height: '80px', 
      padding: isCollapsed ? '0' : '0 20px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: isCollapsed ? 'center' : 'space-between',
      borderBottom: `1px solid ${theme.border}`,
      transition: 'padding 0.3s'
    },
    brandContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      overflow: 'hidden',
    },
    brandTextContainer: { 
      display: isCollapsed ? 'none' : 'flex', 
      flexDirection: 'column',
      whiteSpace: 'nowrap'
    },
    brandTitle: { fontSize: '1.2rem', fontWeight: 900, color: theme.textPrimary, margin: 0, letterSpacing: '0px' },
    brandSubtitle: { fontSize: '0.65rem', fontWeight: 600, color: theme.textSecondary, margin: 0 },
    toggleBtn: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: theme.textPrimary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px',
      borderRadius: '4px',
      transition: 'background 0.2s'
    },
    navContainer: { 
      flex: 1, 
      overflowY: 'auto', 
      overflowX: 'hidden',
      padding: '20px 12px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '24px' 
    },
    groupTitle: { 
      fontSize: '0.75rem', 
      fontWeight: 900, 
      color: theme.textSecondary, 
      margin: '0 0 12px 12px', 
      display: isCollapsed ? 'none' : 'block'
    },
    navItem: { 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: isCollapsed ? 'center' : 'flex-start',
      gap: '12px', 
      padding: '10px 12px', 
      borderRadius: '8px', 
      color: '#E5E7EB', 
      textDecoration: 'none', 
      fontSize: '0.95rem', 
      fontWeight: 800, 
      transition: 'all 0.2s', 
      border: 'none', 
      background: 'transparent', 
      width: '100%', 
      cursor: 'pointer', 
      textAlign: 'right', 
      fontFamily: 'inherit' 
    },
    navItemActive: { 
      backgroundColor: theme.activeBg, 
      color: theme.textPrimary 
    },
    navText: { 
      flex: 1, 
      display: isCollapsed ? 'none' : 'block',
      whiteSpace: 'nowrap'
    },
    navArrow: { 
      fontSize: '0.7rem', 
      fontWeight: 900,
      display: isCollapsed ? 'none' : 'block'
    },
    subLinksContainer: { 
      display: isCollapsed ? 'none' : 'flex', 
      flexDirection: 'column', 
      gap: '4px', 
      borderRight: `2px solid ${theme.border}`, 
      marginRight: '22px', 
      marginTop: '4px' 
    },
    subNavItem: { 
      padding: '8px 16px', 
      color: theme.textMuted, 
      textDecoration: 'none', 
      fontSize: '0.85rem', 
      display: 'block', 
      borderRadius: '6px', 
      transition: 'all 0.2s', 
      fontWeight: 700 
    },
  };

  // الأيقونة معكوسة الألوان لتناسب الخلفية الخضراء
  const LogoIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#FFFFFF"/>
      <rect x="6" y="6" width="20" height="9" rx="2" stroke={theme.sidebarBg} strokeWidth="2"/>
      <rect x="6" y="18" width="8" height="8" rx="2" stroke={theme.sidebarBg} strokeWidth="2"/>
      <rect x="18" y="18" width="8" height="8" rx="2" stroke={theme.sidebarBg} strokeWidth="2"/>
    </svg>
  );

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.brandContent}>
          <LogoIcon />
          <div style={styles.brandTextContainer}>
            <h2 style={styles.brandTitle}>نظام ابن عباس</h2>
            <span style={styles.brandSubtitle}>ادارة الحلقات القرآنية</span>
          </div>
        </div>
        <button 
          style={styles.toggleBtn} 
          onClick={toggleSidebar} 
          title={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {isCollapsed ? (
             <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
          ) : (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
          )}
        </button>
      </div>

      <nav style={styles.navContainer} className="custom-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx} style={{ marginBottom: isCollapsed ? '10px' : '0' }}>
            <div style={styles.groupTitle}>{group.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              
              {group.links.map((link) => {
                if (link.subLinks) {
                  const isExpanded = expandedMenus.includes(link.label);
                  return (
                    <div key={link.label}>
                      <button 
                        style={{
                          ...styles.navItem, 
                          color: isExpanded ? theme.textPrimary : '#E5E7EB', 
                          backgroundColor: isExpanded && !isCollapsed ? theme.activeBg : 'transparent'
                        }} 
                        onClick={() => toggleMenu(link.label)}
                        title={isCollapsed ? link.label : undefined}
                      >
                        <Icon name={link.icon as any} size={20} />
                        <span style={styles.navText}>{link.label}</span>
                        <span style={styles.navArrow}>{isExpanded ? '▲' : '▼'}</span>
                      </button>
                      
                      {isExpanded && !isCollapsed && (
                        <div style={styles.subLinksContainer}>
                          {link.subLinks.map(sub => (
                            <NavLink 
                              key={sub.to} 
                              to={sub.to} 
                              style={({ isActive }) => ({ 
                                ...styles.subNavItem, 
                                ...(isActive ? { color: theme.textPrimary, fontWeight: 900, backgroundColor: 'rgba(255, 255, 255, 0.1)' } : {}) 
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

                return (
                  <NavLink 
                    key={link.to} 
                    to={link.to!} 
                    title={isCollapsed ? link.label : undefined}
                    style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navItemActive : {}) })}
                  >
                    <Icon name={link.icon as any} size={20} />
                    <span style={styles.navText}>{link.label}</span>
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