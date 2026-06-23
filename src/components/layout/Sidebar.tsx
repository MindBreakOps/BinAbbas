import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Icon, type IconName } from '../ui/Icons';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { supabase } from '../../lib/supabase';
import styles from './Sidebar.module.css';

interface NavLinkConfig {
  to?: string;
  label: string;
  icon: IconName;
  adminOnly?: boolean;
  subLinks?: { to: string; label: string }[];
}

export const NAV_LINKS: NavLinkConfig[] = [
  { to: '/', label: 'الرئيسية', icon: 'home' },
  { to: '/students', label: 'الطلاب', icon: 'users', adminOnly: true },
  { to: '/teachers', label: 'المعلمون', icon: 'users', adminOnly: true },
  { to: '/halaqat', label: 'الحلقات', icon: 'book' },
  { to: '/teacher-rev', label: 'مقرأة المعلمين', icon: 'book' },
  { to: '/attendance', label: 'الحضور', icon: 'cal' },
  { to: '/exams', label: 'الاختبار الشهري', icon: 'file' },
  { to: '/news', label: 'النشرة', icon: 'news' },
  
  // قسم المالية
  { 
    label: 'قسم المالية', 
    icon: 'money', 
    adminOnly: true,
    subLinks: [
      { to: '/financials/overview', label: 'عام (الملخص)' },
      { to: '/financials/budget', label: 'الميزانية' },
      { to: '/financials/donations', label: 'التبرعات' },
      { to: '/financials/expenses', label: 'المصروفات' },
    ]
  },

  // الإعدادات أصبحت في الأسفل تماماً
  { 
    label: 'الإعدادات', 
    icon: 'cog', 
    adminOnly: true,
    subLinks: [
      { to: '/settings/workspace', label: 'مساحة العمل' },
      { to: '/settings/accounts', label: 'الحسابات والصلاحيات' },
      { to: '/settings/preferences', label: 'المظهر والتفضيلات' },
    ]
  },
];

export default function Sidebar() {
  const { user } = useAuth();
  const { workspace } = useTenant();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) return;
      const { data } = await supabase.from('profiles').select('roles(role_name)').eq('id', user.id).single();
      if (data?.roles && typeof data.roles !== 'array' && (data.roles as any).role_name === 'admin') {
        setIsAdmin(true);
      }
    };
    checkRole();
  }, [user]);

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brandHeader}>
        <div className={styles.brandLogo}><Icon name="book" size={24} /></div>
        <div className={styles.brandText}>
          <h2>نظام بن عباس</h2>
          <p>{workspace?.name || 'إدارة الحلقات'}</p>
        </div>
      </div>
      <div className={styles.navContainer}>
        {NAV_LINKS.map((link) => {
          if (link.adminOnly && !isAdmin) return null;

          if (link.subLinks) {
            const isExpanded = expandedMenus.includes(link.label);
            const isChildActive = link.subLinks.some(sub => location.pathname.includes(sub.to));

            return (
              <div key={link.label} className={styles.menuWrapper}>
                <button className={`${styles.menuButton} ${isChildActive && !isExpanded ? styles.menuButtonActive : ''}`} onClick={() => toggleMenu(link.label)}>
                  <div className={styles.menuIconLabel}><Icon name={link.icon} size={18} /><span>{link.label}</span></div>
                  <span className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}>▼</span>
                </button>
                {isExpanded && (
                  <div className={styles.subLinksContainer}>
                    {link.subLinks.map(sub => (
                      <NavLink key={sub.to} to={sub.to} className={({ isActive }) => isActive ? `${styles.subNavItem} ${styles.subNavItemActive}` : styles.subNavItem}>
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink key={link.to} to={link.to!} className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}>
              <Icon name={link.icon} size={18} /><span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}