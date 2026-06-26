import React from 'react';
import { 
  Menu, Play, LayoutTemplate, 
  BookOpen, Users, FileText, Wallet, Shield, 
  ChevronLeft, Quote, MonitorSmartphone, CheckCircle, Monitor
} from 'lucide-react';
// استدعاء ملفات الفيديو ليتم معالجتها في بيئة الإنتاج (Production)
import desktopVideo from '../assets/desktop.mp4';
import mobileVideo from '../assets/bin-abbas-mobile.MP4';
const theme = {
  bgMain: '#F8FAF9',
  primary: '#2D5948',
  primaryHover: '#224436',
  white: '#ffffff',
  textDark: '#1f2937',
  textGray: '#6b7280',
  textLight: '#9ca3af',
  borderLight: '#f3f4f6',
  accent: '#E5F0E8',
  accentDark: '#B9DDBE',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  fontFamily: '"Tajawal", "Cairo", system-ui, sans-serif'
};

export default function OperixLanding() {
  return (
	<div dir="rtl" style={{ minHeight: '100vh', backgroundColor: theme.bgMain, fontFamily: theme.fontFamily, color: theme.textDark }}>
	  
	  {/* HEADER */}
	  <header style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', backgroundColor: 'rgba(248, 250, 249, 0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${theme.borderLight}` }}>
		<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
		  <div style={{ width: '40px', height: '40px', backgroundColor: theme.primary, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<LayoutTemplate color={theme.white} size={24} />
		  </div>
		  <div>
			<h1 style={{ margin: 0, fontWeight: 'bold', fontSize: '18px', color: theme.primary, lineHeight: 1.2 }}>نظام ابن عباس</h1>
			<p style={{ margin: 0, fontSize: '12px', color: theme.textGray }}>Operix Solutions</p>
		  </div>
		</div>

		<nav style={{ display: 'flex', alignItems: 'center', gap: '32px', fontWeight: 'bold', fontSize: '14px', color: theme.textGray }}>
		  <a href="/" style={{ textDecoration: 'none', color: theme.primary }}>الرئيسية</a>
		  <a href="/subscription" style={{ textDecoration: 'none', color: 'inherit' }}>الباقات</a>
		  <a href="#esnad" style={{ textDecoration: 'none', color: 'inherit' }}>منظومة إسناد</a>
		  <a href="#ibn-abbas" style={{ textDecoration: 'none', color: 'inherit' }}>بوابة ابن عباس</a>
		</nav>

		<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
		  <a href="/login" style={{ padding: '8px 24px', backgroundColor: theme.primary, color: theme.white, borderRadius: '999px', fontWeight: 'bold', fontSize: '14px', border: 'none', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
			الذهاب للنظام
		  </a>
		</div>
	  </header>

	  {/* HERO SECTION (Esnad) */}
	  <section id="esnad" style={{ padding: '64px 32px 48px', maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'center' }}>
		<div style={{ flex: '1 1 400px' }}>
		  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: theme.primary, margin: '0 0 24px 0' }}>Esnad Quran Center Management System</h2>
		  <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: theme.primary, lineHeight: 1.3, margin: '0 0 16px 0' }}>
			منظومة إسناد
		  </h1>
		  <p style={{ color: theme.textGray, fontSize: '16px', lineHeight: 1.8, marginBottom: '32px', maxWidth: '500px' }}>
			منصة رقمية متكاملة لإدارة مراكز تحفيظ القرآن الكريم، الحلقات التعليمية، الاختبارات، الشهادات، والإدارة المالية بسلاسة واحترافية.
		  </p>
		  
		  <a href="#product-display" style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', backgroundColor: theme.white, padding: '8px 8px 8px 24px', borderRadius: '999px', boxShadow: theme.shadowSm, border: `1px solid ${theme.borderLight}`, textDecoration: 'none' }}>
			<div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.accent, color: theme.primary, borderRadius: '50%', border: 'none', cursor: 'pointer' }}>
			  <Play size={16} fill="currentColor" style={{ marginRight: '4px' }} />
			</div>
			<div style={{ width: '128px', height: '4px', backgroundColor: theme.borderLight, borderRadius: '999px', overflow: 'hidden' }}>
			  <div style={{ width: '33%', height: '100%', backgroundColor: theme.primary }}></div>
			</div>
			<span style={{ fontSize: '12px', fontWeight: 'bold', color: theme.textGray }}>عرض تعريفي</span>
		  </a>
		</div>
		
		<div style={{ flex: '1 1 400px', display: 'flex', justifySelf: 'center', alignItems: 'center', height: '320px', background: `linear-gradient(to top left, ${theme.accent}, transparent)`, borderRadius: '999px', position: 'relative', justifyContent: 'center' }}>
		  <BookOpen size={128} color={theme.primary} opacity={0.2} style={{ position: 'absolute' }} />
		</div>
	  </section>

	  {/* HORIZONTAL CARDS SECTION (Core Modules) */}
	  <section style={{ padding: '0 32px 64px', maxWidth: '1280px', margin: '0 auto' }}>
		<div style={{ backgroundColor: theme.accentDark, padding: '16px', borderRadius: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', boxShadow: theme.shadowSm }}>
		  {[
			{ title: 'إدارة الطلاب', desc: 'سجلات متكاملة' },
			{ title: 'الحضور والغياب', desc: 'متابعة يومية', active: true },
			{ title: 'الاختبارات', desc: 'تقييم مستمر' },
			{ title: 'الشهادات', desc: 'إصدار آلي' },
			{ title: 'الإدارة المالية', desc: 'ميزانيات دقيقة' }
		  ].map((item, index) => (
			<div key={index} style={{ flex: 1, minWidth: '120px', textAlign: 'center', padding: '16px', borderRadius: '12px', backgroundColor: item.active ? theme.white : 'transparent', cursor: 'pointer', boxShadow: item.active ? theme.shadowSm : 'none' }}>
			  <h3 style={{ fontWeight: 'bold', color: theme.primary, margin: '0 0 4px 0' }}>{item.title}</h3>
			  <p style={{ margin: 0, fontSize: '12px', color: item.active ? theme.textGray : theme.primary, fontWeight: 'bold' }}>{item.desc}</p>
			</div>
		  ))}
		</div>
	  </section>

	  {/* GRID SECTION (The Challenge & Solution) */}
	  <section style={{ padding: '64px 32px', maxWidth: '1280px', margin: '0 auto' }}>
		<h2 style={{ fontSize: '30px', fontWeight: 'bold', color: theme.primary, margin: '0 0 8px 0' }}>التحدي والحل</h2>
		<p style={{ color: theme.textGray, fontSize: '14px', fontWeight: 'bold', margin: '0 0 32px 0' }}>
		  إدارة البيانات كانت تستهلك وقتاً كبيراً، لذلك قمنا بتطوير منصة سحابية تضع كل الأدوات في مكان واحد.
		</p>
		
		<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
		  {[
			{ title: 'بيانات الطلاب', icon: <Users size={24} /> },
			{ title: 'متابعة الحضور', icon: <CheckCircle size={24} /> },
			{ title: 'نظام الاختبارات', icon: <FileText size={24} /> },
			{ title: 'إدارة الميزانيات', icon: <Wallet size={24} /> }
		  ].map((item, i) => (
			<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: theme.white, padding: '16px', borderRadius: '16px', boxShadow: theme.shadowSm, border: `1px solid ${theme.borderLight}`, cursor: 'pointer' }}>
			  <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bgMain, borderRadius: '12px', color: theme.primary }}>
				{item.icon}
			  </div>
			  <div>
				<h3 style={{ fontWeight: 'bold', color: theme.textDark, fontSize: '14px', margin: '0 0 4px 0' }}>{item.title}</h3>
				<p style={{ fontSize: '12px', color: theme.textLight, margin: 0 }}>أدوات متكاملة</p>
			  </div>
			</div>
		  ))}
		</div>
	  </section>

	  {/* SPLIT FEATURE SECTION (Ibn Abbas Portal) */}
	  <section id="ibn-abbas" style={{ padding: '64px 32px', maxWidth: '1280px', margin: '0 auto' }}>
		<h2 style={{ fontSize: '30px', fontWeight: 'bold', color: theme.primary, margin: '0 0 8px 0' }}>نظام عبدالله بن عباس</h2>
		<p style={{ color: theme.textGray, fontSize: '14px', fontWeight: 'bold', margin: '0 0 32px 0' }}>تطبيق iOS مخصص للطلاب وأعضاء المجتمع.</p>
		
		<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
		  {/* Left Large Highlight Card */}
		  <div style={{ backgroundColor: theme.white, borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: theme.shadowSm, border: `1px solid ${theme.borderLight}`, minHeight: '300px' }}>
			<div style={{ zIndex: 10, maxWidth: '75%' }}>
			  <div style={{ display: 'inline-block', backgroundColor: theme.accent, color: theme.primary, padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', marginBottom: '16px' }}>التعليم والمجتمع</div>
			  <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: theme.textDark, margin: '0 0 8px 0' }}>بوابة ابن عباس</h3>
			  <p style={{ fontSize: '16px', color: theme.textGray, lineHeight: 1.6, margin: '0 0 24px 0', fontWeight: 'bold' }}>البوابة المؤسسية</p>
			  <p style={{ fontSize: '14px', color: theme.textGray, lineHeight: 1.8, margin: '0 0 32px 0' }}>
				بوابة إدارية مخصصة لتخطيط الموارد المؤسسية وتتبع التواصل المجتمعي وإدارة الأرشيف الرقمي للوصول إلى الموارد الإسلامية والملفات التعليمية.
			  </p>
			  <a href="https://www.operix-solutions.com/mobile-apps" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: theme.primary, color: theme.white, borderRadius: '999px', fontWeight: 'bold', border: 'none', cursor: 'pointer', textDecoration: 'none' }}>
				زيارة الموقع المباشر
			  </a>
			</div>
			<div style={{ position: 'absolute', bottom: '-32px', left: '-32px', width: '256px', height: '256px', backgroundColor: theme.accent, borderRadius: '50%', opacity: 0.5, zIndex: 0 }}></div>
		  </div>

		  {/* Right Column Stack */}
		  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
			<div style={{ backgroundColor: theme.white, borderRadius: '24px', padding: '24px', boxShadow: theme.shadowSm, border: `1px solid ${theme.borderLight}` }}>
			  <div style={{ width: '48px', height: '48px', backgroundColor: theme.bgMain, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
				<Shield color={theme.primary} size={24} />
			  </div>
			  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: theme.textDark, margin: '0 0 8px 0' }}>نطاق مساحة العمل</h3>
			  <p style={{ fontSize: '14px', color: theme.textGray, marginBottom: '16px', lineHeight: 1.6 }}>
				تطبق جميع التطبيقات مصادقة من خطوتين: يجب إدخال نطاق مساحة العمل قبل الوصول إلى بوابة الدخول الآمنة المخصصة للموظفين والطلاب.
			  </p>
			  <a href="#product-display" style={{ background: 'none', border: 'none', color: theme.primary, fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: 0, textDecoration: 'none' }}>
				مشاهدة العرض <ChevronLeft size={16} />
			  </a>
			</div>

			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
			  {[
				{ title: 'مصحف تفاعلي', desc: 'مع التفسير والتلاوة' },
				{ title: 'مواقيت الصلاة', desc: 'دقيقة وتنبيهات الأذان' },
			  ].map((item, idx) => (
				<div key={idx} style={{ backgroundColor: theme.white, borderRadius: '24px', padding: '24px', boxShadow: theme.shadowSm, border: `1px solid ${theme.borderLight}` }}>
				  <div style={{ width: '40px', height: '40px', backgroundColor: theme.bgMain, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
					<CheckCircle color={theme.primary} size={20} />
				  </div>
				  <h4 style={{ fontWeight: 'bold', color: theme.textDark, fontSize: '14px', margin: '0 0 4px 0' }}>{item.title}</h4>
				  <p style={{ fontSize: '12px', color: theme.textLight, margin: 0 }}>{item.desc}</p>
				</div>
			  ))}
			</div>
		  </div>
		</div>
	  </section>

	  {/* HIGHLIGHT/QUOTE SECTION (The Story) */}
	  <section style={{ padding: '64px 32px', maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
		<div style={{ backgroundColor: theme.white, borderRadius: '24px', padding: '48px 32px', boxShadow: theme.shadowSm, border: `1px solid ${theme.borderLight}`, maxWidth: '800px', margin: '0 auto' }}>
		  <Quote color={theme.accent} size={64} style={{ margin: '0 auto 24px auto', display: 'block' }} />
		  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: theme.primary, marginBottom: '16px' }}>القصة</h3>
		  <p style={{ color: theme.textDark, fontSize: '20px', fontWeight: 'bold', lineHeight: 1.8, margin: '0 0 32px 0' }}>
			"ترتبط الخلاوي ومراكز التحفيظ في الوجدان السوداني بتاريخ طويل من التعليم والتربية. من قلب هذا الإرث نشأت فكرة إسناد، لتحويل الإدارة التقليدية إلى منظومة رقمية حديثة تحافظ على الأصالة وتستفيد من التقنية."
		  </p>
		  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
			<div style={{ height: '1px', backgroundColor: theme.borderLight, width: '48px' }}></div>
			<span style={{ fontSize: '14px', fontWeight: 'bold', color: theme.textGray }}>فريق تطوير أوبيركس</span>
			<div style={{ height: '1px', backgroundColor: theme.borderLight, width: '48px' }}></div>
		  </div>
		</div>
	  </section>

	  {/* APP PROMO OR PRODUCT DISPLAY (Desktop + Mobile) */}
	  <section id="product-display" style={{ backgroundColor: 'rgba(229, 240, 232, 0.4)', padding: '80px 32px', textAlign: 'center' }}>
		<h2 style={{ fontSize: '36px', fontWeight: 'bold', color: theme.primary, margin: '0 0 16px 0' }}>
		  تجربة متكاملة على جميع الأجهزة
		</h2>
		<p style={{ color: theme.textGray, fontSize: '16px', maxWidth: '600px', margin: '0 auto 48px auto', lineHeight: 1.6 }}>
		  استمتع بإدارة سلسة ومتقدمة عبر منصة الويب الإدارية، وابقَ على اتصال دائم وتفاعل مستمر عبر تطبيق الجوال المخصص.
		</p>
		
		<div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '64px' }}>
		  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: theme.white, border: `1px solid ${theme.borderLight}`, padding: '12px 24px', borderRadius: '12px', boxShadow: theme.shadowSm }}>
			<Monitor color={theme.primary} size={24} />
			<div style={{ textAlign: 'right' }}>
			  <p style={{ fontSize: '10px', color: theme.textGray, fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>نظام الإدارة</p>
			  <p style={{ fontSize: '14px', fontWeight: 'bold', color: theme.textDark, margin: 0 }}>منصة الويب المركزية</p>
			</div>
		  </div>
		  <a href="https://www.operix-solutions.com/mobile-apps" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: theme.white, border: `1px solid ${theme.borderLight}`, padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', boxShadow: theme.shadowSm, textDecoration: 'none' }}>
			<MonitorSmartphone color={theme.primary} size={24} />
			<div style={{ textAlign: 'right' }}>
			  <p style={{ fontSize: '10px', color: theme.textGray, fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>تطبيق iOS</p>
			  <p style={{ fontSize: '14px', fontWeight: 'bold', color: theme.textDark, margin: 0 }}>بوابة ابن عباس</p>
			</div>
		  </a>
		</div>

		{/* MOCKUPS CONTAINER */}
		<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '48px', maxWidth: '1200px', margin: '0 auto' }}>
		  
		  {/* DESKTOP MOCKUP */}
		  <div style={{ flex: '1 1 500px', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<div style={{ width: '100%', backgroundColor: '#1f2937', borderRadius: '16px', padding: '4px', boxShadow: theme.shadowMd }}>
			  {/* Browser Header */}
			  <div style={{ display: 'flex', gap: '8px', padding: '12px 16px', backgroundColor: '#374151', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
				<div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
				<div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
				<div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
			  </div>
			  {/* Screen */}
			  <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', overflow: 'hidden' }}>
				<video 
				  src="src/assets/desktop.mp4" 
				  autoPlay 
				  loop 
				  muted 
				  playsInline 
				  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
				/>
			  </div>
			</div>
			{/* Stand */}
			<div style={{ width: '140px', height: '16px', backgroundColor: '#d1d5db', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}></div>
			<div style={{ width: '220px', height: '4px', backgroundColor: '#9ca3af', borderRadius: '4px', marginTop: '2px' }}></div>
		  </div>

		  {/* iPHONE 17 MOCKUP */}
		  <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
			<div style={{ position: 'relative', width: '270px', height: '560px', backgroundColor: theme.white, borderRadius: '52px', border: '12px solid #1f2937', boxShadow: theme.shadowMd, overflow: 'hidden' }}>
			  
			  {/* Dynamic Island (iPhone 17 style - Smaller & Compact) */}
			  <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', width: '65px', height: '20px', backgroundColor: '#000000', borderRadius: '10px', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 6px', boxSizing: 'border-box' }}>
				{/* Tiny camera/sensor dots inside for realism */}
				<div style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#111827'}}></div>
				<div style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#111827'}}></div>
			  </div>
			  
			  {/* Screen Area */}
			  <div style={{ width: '100%', height: '100%', backgroundColor: '#000000', borderRadius: '36px', overflow: 'hidden' }}>
				<video 
				  src="src/assets/bin-abbas-mobile.MP4" 
				  autoPlay 
				  loop 
				  muted 
				  playsInline 
				  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
				/>
			  </div>
			</div>
		  </div>

		</div>
	  </section>

	  {/* FOOTER */}
	  <footer style={{ backgroundColor: theme.white, borderTop: `1px solid ${theme.borderLight}`, padding: '64px 32px 32px' }}>
		<div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '48px' }}>
		  
		  <div style={{ gridColumn: 'span 2' }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
			  <div style={{ width: '32px', height: '32px', backgroundColor: theme.primary, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<LayoutTemplate color={theme.white} size={16} />
			  </div>
			  <h3 style={{ fontWeight: 'bold', color: theme.primary, margin: 0 }}>أوبيركس للحلول الرقمية</h3>
			</div>
			<p style={{ fontSize: '12px', color: theme.textGray, lineHeight: 1.8, maxWidth: '350px', margin: 0 }}>
			  مؤسسة متخصصة في تطوير وبناء الأنظمة الإدارية، تطبيقات الجوال، والحلول السحابية الموجهة لخدمة المؤسسات والمراكز التعليمية والمجتمعية بأحدث التقنيات.
			</p>
		  </div>

		  <div>
			<h4 style={{ fontWeight: 'bold', color: theme.textDark, fontSize: '14px', marginBottom: '16px', marginTop: 0 }}>الروابط السريعة</h4>
			<ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
			  <li><a href="https://www.operix-solutions.com/mobile-apps" style={{ textDecoration: 'none', color: theme.textGray, fontSize: '12px' }}>تطبيقات الجوال</a></li>
			  <li><a href="/subscription" style={{ textDecoration: 'none', color: theme.textGray, fontSize: '12px' }}>الباقات والاشتراكات</a></li>
			  <li><a href="#esnad" style={{ textDecoration: 'none', color: theme.textGray, fontSize: '12px' }}>منظومة إسناد</a></li>
			  <li><a href="#ibn-abbas" style={{ textDecoration: 'none', color: theme.textGray, fontSize: '12px' }}>بوابة ابن عباس</a></li>
			</ul>
		  </div>

		  <div>
			<h4 style={{ fontWeight: 'bold', color: theme.textDark, fontSize: '14px', marginBottom: '16px', marginTop: 0 }}>الدعم والتواصل</h4>
			<ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
			  <li dir="ltr" style={{ textAlign: 'right' }}><a href="mailto:support@operix-solutions.com" style={{ textDecoration: 'none', color: theme.textGray, fontSize: '12px' }}>support@operix-solutions.com</a></li>
			  <li dir="ltr" style={{ textAlign: 'right' }}><a href="mailto:info@operix-solutions.com" style={{ textDecoration: 'none', color: theme.textGray, fontSize: '12px' }}>info@operix-solutions.com</a></li>
			  <li dir="ltr" style={{ textAlign: 'right' }}><a href="https://www.operix-solutions.com" style={{ textDecoration: 'none', color: theme.textGray, fontSize: '12px' }}>www.operix-solutions.com</a></li>
			  <li dir="ltr" style={{ textAlign: 'right' }}><a href="https://www.sudan.operix-solutions.com" style={{ textDecoration: 'none', color: theme.textGray, fontSize: '12px' }}>www.sudan.operix-solutions.com</a></li>
			</ul>
		  </div>

		</div>
		
		<div style={{ textAlign: 'center', borderTop: `1px solid ${theme.borderLight}`, paddingTop: '32px' }}>
		  <p style={{ fontSize: '12px', color: theme.textLight, margin: 0 }}>© 2026 Operix Solutions. جميع الحقوق محفوظة.</p>
		</div>
	  </footer>

	</div>
  );
}