import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Globe, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, Home, LayoutTemplate } from 'lucide-react';

const successAudio = new Audio('/sounds/success.mp3');
const errorAudio = new Audio('/sounds/error.mp3');
successAudio.preload = 'auto';
errorAudio.preload = 'auto';

const triggerVibration = (type) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
	if (type === 'success') navigator.vibrate([20, 40, 20]);
	else navigator.vibrate([50, 50, 50, 50, 50]);
  }
};

const playSound = (type) => {
  try {
	if (type === 'success') { successAudio.currentTime = 0; successAudio.play().catch(() => {}); }
	else { errorAudio.currentTime = 0; errorAudio.play().catch(() => {}); }
  } catch (e) {}
};

// Unified Theme matching the new Landing Page
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
  red500: '#ef4444',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  fontFamily: '"Tajawal", "Cairo", system-ui, sans-serif'
};

export default function Login() {
  const navigate = useNavigate();
  const [view, setView] = useState('domain');
  const [domain, setDomain] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [localSuccess, setLocalSuccess] = useState(null);
  const [isShaking, setIsShaking] = useState(false);

  const triggerErrorUI = (msg) => {
	setLocalSuccess(null);
	setLocalError(msg);
	setIsShaking(true);
	playSound('error');
	triggerVibration('error');
	setTimeout(() => setIsShaking(false), 500); 
  };

  const triggerSuccessUI = (msg) => {
	setLocalError(null);
	setLocalSuccess(msg);
	playSound('success');
	triggerVibration('success');
	setTimeout(() => setLocalSuccess(null), 5000); 
  };

  const handleDomainCheck = async (e) => {
	e.preventDefault();
	if (!domain) return;
	setLoading(true);
	setLocalError(null);
	try {
	  const { data, error } = await supabase
		.from('workspaces')
		.select('name, domain')
		.eq('domain', domain.trim().toLowerCase())
		.single();

	  if (error || !data) throw new Error('مساحة العمل غير موجودة. الرجاء التأكد من الرابط.');

	  setWorkspaceName(data.name);
	  triggerSuccessUI('تم العثور على مساحة العمل بنجاح.');
	  setTimeout(() => { setLocalSuccess(null); setView('login'); }, 800);
	} catch (err) {
	  triggerErrorUI(err.message);
	} finally {
	  setLoading(false);
	}
  };

  const handleLogin = async (e) => {
	e.preventDefault();
	setLoading(true);
	setLocalError(null);
	try {
	  const { error } = await supabase.auth.signInWithPassword({
		email: email.trim().toLowerCase(),
		password,
	  });
	  if (error) throw error;
	  triggerSuccessUI('تم تسجيل الدخول بنجاح. جاري التحويل...');
	  
	  setTimeout(() => { navigate('/dashboard'); }, 800);
	  
	} catch (err) {
	  triggerErrorUI(err.message || 'بيانات الدخول غير صحيحة. حاول مرة أخرى.');
	} finally {
	  setLoading(false);
	}
  };

  const handleOTP = async (e) => {
	e.preventDefault();
	setLoading(true);
	setLocalError(null);
	try {
	  const { error } = await supabase.auth.signInWithOtp({ email: email.trim().toLowerCase() });
	  if (error) throw new Error('تعذر إرسال الرمز. تأكد من البريد الإلكتروني.');
	  triggerSuccessUI('تم إرسال رابط/رمز الدخول إلى بريدك الإلكتروني بنجاح.');
	} catch (err) {
	  triggerErrorUI(err.message);
	} finally {
	  setLoading(false);
	}
  };

  const inputStyle = {
	width: '100%',
	height: '52px',
	backgroundColor: theme.bgMain,
	border: `1px solid ${theme.borderLight}`,
	borderRadius: '12px',
	color: theme.textDark,
	fontSize: '15px',
	fontWeight: 500,
	boxSizing: 'border-box',
	outline: 'none',
	transition: 'all 0.2s ease'
  };

  return (
	<>
	  <style>{`
		@keyframes shake {
		  0%, 100% { transform: translateX(0); }
		  15%, 45%, 75% { transform: translateX(-6px); }
		  30%, 60%, 90% { transform: translateX(6px); }
		}
		.animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
		.input-focus:focus { border-color: ${theme.primary}; box-shadow: 0 0 0 3px rgba(45, 89, 72, 0.1); background-color: ${theme.white}; }
		.btn-white-hover:hover { background-color: ${theme.accent} !important; color: ${theme.primary} !important; }
		.btn-primary-hover:hover { background-color: ${theme.primaryHover} !important; }
		.btn-outline-hover:hover { background-color: ${theme.accent} !important; border-color: ${theme.primary} !important; }
	  `}</style>

	  <div dir="rtl" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bgMain, padding: '16px', position: 'relative', overflow: 'hidden', fontFamily: theme.fontFamily }}>
		
		{/* Back to Home Button */}
		<button 
		  onClick={() => navigate('/')} 
		  className="btn-white-hover"
		  style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: theme.white, border: `1px solid ${theme.borderLight}`, color: theme.textGray, borderRadius: '9999px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', zIndex: 50, boxShadow: theme.shadowSm, transition: 'all 0.2s' }}
		>
		  <Home size={16} /> العودة للرئيسية
		</button>

		{/* Decorative background */}
		<div style={{ position: 'absolute', width: '800px', height: '800px', top: '-200px', left: '-200px', borderRadius: '50%', pointerEvents: 'none', background: `radial-gradient(circle, ${theme.accentDark}22 0%, transparent 70%)` }} />
		<div style={{ position: 'absolute', width: '600px', height: '600px', bottom: '-150px', right: '-150px', borderRadius: '50%', pointerEvents: 'none', background: `radial-gradient(circle, ${theme.accent} 0%, transparent 70%)` }} />

		{/* Form Card */}
		<div className={isShaking ? 'animate-shake' : ''} style={{ backgroundColor: theme.white, border: `1px solid ${theme.borderLight}`, padding: '48px 32px', borderRadius: '24px', width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10, boxShadow: theme.shadowXl, boxSizing: 'border-box' }}>
		  
		  {/* Logo Header */}
		  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'right', marginBottom: '40px' }}>
			<div style={{ width: '56px', height: '56px', backgroundColor: theme.primary, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: theme.shadowMd, flexShrink: 0 }}>
			  <LayoutTemplate color={theme.white} size={28} />
			</div>
			<div>
			  <h1 style={{ fontSize: '24px', fontWeight: 900, color: theme.primary, margin: '0 0 4px 0', lineHeight: 1 }}>
				نظام ابن عباس
			  </h1>
			  <p style={{ fontSize: '12px', color: theme.textGray, fontWeight: 'bold', margin: 0 }}>
				بوابة الدخول الآمنة
			  </p>
			</div>
		  </div>

		  {/* ─── DOMAIN VIEW (STEP 1) ─── */}
		  {view === 'domain' && (
			<div style={{ animation: 'fadeIn 0.3s ease-out' }}>
			  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: theme.textDark, marginBottom: '8px', marginTop: 0 }}>البحث عن مساحة العمل</h2>
			  <p style={{ fontSize: '14px', color: theme.textGray, marginBottom: '24px', marginTop: 0 }}>أدخل نطاق مساحة العمل الخاصة بمركزك للبدء.</p>
			  
			  <form onSubmit={handleDomainCheck}>
				<div dir="ltr" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
				  <Globe style={{ position: 'absolute', left: '16px', width: '20px', height: '20px', color: theme.textLight, zIndex: 10 }} />
				  <input 
					type="text" 
					className="input-focus"
					style={{ ...inputStyle, paddingLeft: '48px', paddingRight: '100px' }} 
					placeholder="alnaseem" 
					value={domain} 
					onChange={(e) => setDomain(e.target.value)} 
					required 
					autoFocus 
				  />
				  <span style={{ position: 'absolute', right: '16px', fontSize: '14px', color: theme.textGray, pointerEvents: 'none', borderLeft: `1px solid ${theme.borderLight}`, paddingLeft: '12px', fontFamily: 'monospace', fontWeight: 'bold' }}>
					.workspace
				  </span>
				</div>
				
				<button type="submit" disabled={loading} className="btn-primary-hover" style={{ width: '100%', padding: '14px', marginTop: '8px', backgroundColor: theme.primary, color: theme.white, borderRadius: '999px', fontWeight: 'bold', fontSize: '15px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', boxShadow: theme.shadowSm }}>
				  {loading ? 'جاري البحث...' : 'المتابعة'}
				</button>
			  </form>
			</div>
		  )}

		  {/* ─── LOGIN VIEW (STEP 2) ─── */}
		  {view === 'login' && (
			<div style={{ animation: 'fadeIn 0.3s ease-out' }}>
			  {/* Breadcrumb */}
			  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingBottom: '16px', borderBottom: `1px solid ${theme.borderLight}` }}>
				<button type="button" onClick={() => { setView('domain'); setWorkspaceName(''); setLocalError(null); setLocalSuccess(null); }} className="btn-white-hover" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: theme.bgMain, border: `1px solid ${theme.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textGray, cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}>
				  <ArrowRight size={18} />
				</button>
				<div style={{ flex: 1, overflow: 'hidden', textAlign: 'right' }}>
				  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: theme.textDark, margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
					{workspaceName}
				  </h3>
				  <div dir="ltr" style={{ textAlign: 'right', fontSize: '12px', fontFamily: 'monospace', color: theme.primary, fontWeight: 'bold', marginTop: '2px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
					{domain}.workspace
				  </div>
				</div>
			  </div>

			  <form onSubmit={handleLogin}>
				<div dir="ltr" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
				  <Mail style={{ position: 'absolute', left: '16px', width: '20px', height: '20px', color: theme.textLight, zIndex: 10 }} />
				  <input 
					type="email" 
					className="input-focus"
					style={{ ...inputStyle, paddingLeft: '48px', paddingRight: '16px' }} 
					placeholder="name@center.com" 
					value={email} 
					onChange={(e) => setEmail(e.target.value)} 
					required 
					autoFocus 
				  />
				</div>
				
				<div dir="ltr" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
				  <Lock style={{ position: 'absolute', left: '16px', width: '20px', height: '20px', color: theme.textLight, zIndex: 10 }} />
				  <input 
					type="password" 
					className="input-focus"
					style={{ ...inputStyle, paddingLeft: '48px', paddingRight: '16px' }} 
					placeholder="••••••••" 
					value={password} 
					onChange={(e) => setPassword(e.target.value)} 
					required 
				  />
				</div>
				
				<button type="submit" disabled={loading || !!localSuccess} className="btn-primary-hover" style={{ width: '100%', padding: '14px', marginTop: '8px', backgroundColor: theme.primary, color: theme.white, borderRadius: '999px', fontWeight: 'bold', fontSize: '15px', border: 'none', cursor: (loading || !!localSuccess) ? 'not-allowed' : 'pointer', opacity: (loading || !!localSuccess) ? 0.7 : 1, transition: 'all 0.2s', boxShadow: theme.shadowSm }}>
				  {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
				</button>

				<div style={{ position: 'relative', margin: '24px 0' }}>
				  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
					<div style={{ width: '100%', borderTop: `1px solid ${theme.borderLight}` }}></div>
				  </div>
				  <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
					<span style={{ padding: '0 16px', backgroundColor: theme.white, color: theme.textGray, fontSize: '12px', fontWeight: 'bold' }}>أو استخدم طريقة أخرى</span>
				  </div>
				</div>

				<button 
				  type="button" 
				  onClick={() => { setView('otp'); setLocalError(null); setLocalSuccess(null); }}
				  disabled={loading || !!localSuccess}
				  className="btn-outline-hover"
				  style={{ width: '100%', padding: '14px', backgroundColor: theme.white, border: `2px solid ${theme.accentDark}`, color: theme.primary, borderRadius: '999px', fontWeight: 'bold', fontSize: '14px', cursor: (loading || !!localSuccess) ? 'not-allowed' : 'pointer', opacity: (loading || !!localSuccess) ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s' }}
				>
				  <ShieldCheck style={{ width: '18px', height: '18px' }} />
				  الدخول السريع (بدون كلمة مرور)
				</button>
			  </form>
			</div>
		  )}

		  {/* ─── OTP VIEW (STEP 3) ─── */}
		  {view === 'otp' && (
			<form onSubmit={handleOTP} style={{ animation: 'fadeIn 0.3s ease-out' }}>
			  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingBottom: '16px', borderBottom: `1px solid ${theme.borderLight}` }}>
				<button type="button" onClick={() => { setView('login'); setLocalError(null); setLocalSuccess(null); }} className="btn-white-hover" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: theme.bgMain, border: `1px solid ${theme.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textGray, cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}>
				  <ArrowRight size={18} />
				</button>
				<div style={{ flex: 1, textAlign: 'right' }}>
				  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: theme.textDark, margin: 0 }}>الدخول السريع</h3>
				</div>
			  </div>
			  
			  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
				<div style={{ width: '64px', height: '64px', backgroundColor: theme.accent, color: theme.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.accentDark}`, boxShadow: theme.shadowSm }}>
				  <ShieldCheck size={32} strokeWidth={2} />
				</div>
			  </div>
			  
			  <p style={{ fontSize: '14px', color: theme.textGray, marginBottom: '24px', textAlign: 'center', lineHeight: 1.6, marginTop: 0 }}>
				أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً سرياً للدخول المباشر إلى النظام.
			  </p>
			  
			  <div dir="ltr" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
				<Mail style={{ position: 'absolute', left: '16px', width: '20px', height: '20px', color: theme.textLight, zIndex: 10 }} />
				<input 
				  type="email" 
				  required 
				  className="input-focus"
				  placeholder="name@center.com" 
				  value={email} 
				  onChange={e => setEmail(e.target.value)} 
				  style={{ ...inputStyle, paddingLeft: '48px', paddingRight: '16px' }} 
				  autoFocus
				/>
			  </div>

			  <button type="submit" disabled={loading || !!localSuccess} className="btn-primary-hover" style={{ width: '100%', padding: '14px', backgroundColor: theme.primary, color: theme.white, borderRadius: '999px', fontWeight: 'bold', fontSize: '15px', border: 'none', cursor: (loading || !!localSuccess) ? 'not-allowed' : 'pointer', opacity: (loading || !!localSuccess) ? 0.7 : 1, transition: 'all 0.2s', boxShadow: theme.shadowSm }}>
				{loading ? 'جاري الإرسال...' : 'إرسال رابط الدخول'}
			  </button>
			</form>
		  )}

		  {/* GLOBAL Error Alert */}
		  {localError && (
			<div style={{ marginTop: '24px', borderRadius: '16px', border: `1px solid rgba(239, 68, 68, 0.2)`, backgroundColor: 'rgba(239, 68, 68, 0.05)', display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', textAlign: 'right', animation: 'fadeIn 0.3s ease-out' }}>
			  <div style={{ backgroundColor: theme.red500, color: theme.white, borderRadius: '50%', padding: '4px', flexShrink: 0, marginTop: '2px', display: 'flex' }}>
				<AlertCircle size={16} strokeWidth={2.5} />
			  </div>
			  <div style={{ flex: 1 }}>
				<h4 style={{ fontSize: '13px', fontWeight: 'bold', color: theme.red500, margin: '0 0 4px 0' }}>تنبيه</h4>
				<p style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(239, 68, 68, 0.9)', margin: 0, lineHeight: 1.5 }}>{localError}</p>
			  </div>
			</div>
		  )}

		  {/* GLOBAL Success Alert */}
		  {localSuccess && (
			<div style={{ marginTop: '24px', borderRadius: '16px', border: `1px solid rgba(45, 89, 72, 0.2)`, backgroundColor: theme.accent, display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', textAlign: 'right', animation: 'fadeIn 0.3s ease-out' }}>
			  <div style={{ backgroundColor: theme.primary, color: theme.white, borderRadius: '50%', padding: '4px', flexShrink: 0, marginTop: '2px', display: 'flex' }}>
				<CheckCircle2 size={16} strokeWidth={2.5} />
			  </div>
			  <div style={{ flex: 1 }}>
				<h4 style={{ fontSize: '13px', fontWeight: 'bold', color: theme.primary, margin: '0 0 4px 0' }}>نجاح</h4>
				<p style={{ fontSize: '13px', fontWeight: 500, color: theme.textDark, margin: 0, lineHeight: 1.5 }}>{localSuccess}</p>
			  </div>
			</div>
		  )}

		</div>
	  </div>
	</>
  );
}