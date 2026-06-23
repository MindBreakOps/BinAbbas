import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Globe, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, Home } from 'lucide-react';

const successAudio = new Audio('/sounds/success.mp3');
const errorAudio = new Audio('/sounds/error.mp3');
successAudio.preload = 'auto';
errorAudio.preload = 'auto';

const triggerVibration = (type: 'success' | 'error') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
	if (type === 'success') navigator.vibrate([20, 40, 20]);
	else navigator.vibrate([50, 50, 50, 50, 50]);
  }
};

const playSound = (type: 'success' | 'error') => {
  try {
	if (type === 'success') { successAudio.currentTime = 0; successAudio.play().catch(() => {}); }
	else { errorAudio.currentTime = 0; errorAudio.play().catch(() => {}); }
  } catch (e) {}
};

const theme = {
  emerald: '#059669',
  emeraldHover: '#047857',
  gray900: '#111827',
  gray500: '#6b7280',
  gray400: '#9ca3af',
  gray200: '#e5e7eb',
  gray50: '#f9fafb',
  white: '#ffffff',
  red500: '#ef4444',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  fontFamily: 'system-ui, -apple-system, sans-serif'
};

export default function Login() {
  const navigate = useNavigate();
  const [view, setView] = useState<'domain' | 'login' | 'otp'>('domain');
  const [domain, setDomain] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const triggerErrorUI = (msg: string) => {
	setLocalSuccess(null);
	setLocalError(msg);
	setIsShaking(true);
	playSound('error');
	triggerVibration('error');
	setTimeout(() => setIsShaking(false), 500); 
  };

  const triggerSuccessUI = (msg: string) => {
	setLocalError(null);
	setLocalSuccess(msg);
	playSound('success');
	triggerVibration('success');
	setTimeout(() => setLocalSuccess(null), 5000); 
  };

  const handleDomainCheck = async (e: React.FormEvent) => {
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
	} catch (err: any) {
	  triggerErrorUI(err.message);
	} finally {
	  setLoading(false);
	}
  };

  const handleLogin = async (e: React.FormEvent) => {
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
	  setTimeout(() => { window.location.href = '/'; }, 800);
	} catch (err: any) {
	  triggerErrorUI(err.message || 'بيانات الدخول غير صحيحة. حاول مرة أخرى.');
	} finally {
	  setLoading(false);
	}
  };

  const handleOTP = async (e: React.FormEvent) => {
	e.preventDefault();
	setLoading(true);
	setLocalError(null);
	try {
	  const { error } = await supabase.auth.signInWithOtp({ email: email.trim().toLowerCase() });
	  if (error) throw new Error('تعذر إرسال الرمز. تأكد من البريد الإلكتروني.');
	  triggerSuccessUI('تم إرسال رابط/رمز الدخول إلى بريدك الإلكتروني بنجاح.');
	} catch (err: any) {
	  triggerErrorUI(err.message);
	} finally {
	  setLoading(false);
	}
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
		.input-focus:focus { border-color: ${theme.gray900}; box-shadow: 0 0 0 1px ${theme.gray900}; }
		.btn-hover:hover { background-color: #000000 !important; }
		.btn-white-hover:hover { background-color: ${theme.gray50} !important; }
		.btn-emerald-hover:hover { background-color: ${theme.emeraldHover} !important; }
	  `}</style>

	  <div dir="rtl" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.gray50, padding: '16px', position: 'relative', overflow: 'hidden', fontFamily: theme.fontFamily }}>
		
		{/* Back to Home Button */}
		<button 
		  onClick={() => navigate('/')} 
		  style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: theme.white, border: `1px solid ${theme.gray200}`, color: theme.gray600, borderRadius: '9999px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', zIndex: 50, boxShadow: theme.shadowSm }}
		  className="btn-white-hover"
		>
		  <Home size={16} /> العودة للرئيسية
		</button>

		{/* Decorative background */}
		<div style={{ position: 'absolute', width: '800px', height: '800px', top: '-200px', left: '-200px', borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 70%)' }} />

		{/* Form Card */}
		<div className={isShaking ? 'animate-shake' : ''} style={{ backgroundColor: theme.white, border: `1px solid ${theme.gray200}`, padding: '48px', borderRadius: '24px', width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10, boxShadow: theme.shadowSm, boxSizing: 'border-box' }}>
		  
		  {/* Logo Header Updated to align perfectly and center */}
		  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'right', marginBottom: '40px' }}>
			<div style={{ width: '68px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.white, borderRadius: '16px', border: `1px solid ${theme.gray200}`, boxShadow: theme.shadowSm, flexShrink: 0 }}>
			  <img src="/logo.png" alt="شعار بن عباس" style={{ height: '48px', width: '48px', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
			</div>
			<div>
			  <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.025em', color: theme.gray900, margin: '0 0 4px 0', lineHeight: 1 }}>
				نظام <span style={{ color: theme.emerald }}>إسناد</span>
			  </h1>
			  <p style={{ fontSize: '11px', color: theme.gray500, fontWeight: 'bold', margin: 0 }}>
				مبادرة أوبيركس الخيرية
			  </p>
			</div>
		  </div>

		  {/* ─── DOMAIN VIEW (STEP 1) ─── */}
		  {view === 'domain' && (
			<div>
			  <h2 style={{ fontSize: '20px', fontWeight: 600, color: theme.gray900, marginBottom: '8px', marginTop: 0 }}>البحث عن مساحة العمل</h2>
			  <p style={{ fontSize: '14px', color: theme.gray500, marginBottom: '24px', marginTop: 0 }}>أدخل رابط مساحة العمل الخاصة بمركزك للبدء.</p>
			  
			  <form onSubmit={handleDomainCheck}>
				{/* Fixed Alignment LTR Wrapper Container */}
				<div dir="ltr" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
				  <Globe style={{ position: 'absolute', left: '16px', width: '20px', height: '20px', color: theme.gray400, zIndex: 10 }} />
				  <input 
					type="text" 
					className="input-focus"
					style={{
					  width: '100%',
					  height: '52px',
					  paddingLeft: '48px',    // Leave exact spacing for left icon
					  paddingRight: '110px',  // Leave ample right spacing for the absolute domain suffix label
					  backgroundColor: theme.gray50,
					  border: `1px solid ${theme.gray200}`,
					  borderRadius: '12px',
					  color: theme.gray900,
					  fontSize: '15px',
					  fontWeight: 500,
					  boxSizing: 'border-box',
					  outline: 'none',
					}} 
					placeholder="alnaseem" 
					value={domain} 
					onChange={(e) => setDomain(e.target.value)} 
					required 
					autoFocus 
				  />
				  <span style={{ position: 'absolute', right: '16px', fontSize: '14px', color: theme.gray500, pointerEvents: 'none', borderLeft: `1px solid ${theme.gray200}`, paddingLeft: '12px', fontFamily: 'monospace', fontWeight: 'bold' }}>
					.workspace
				  </span>
				</div>
				
				<button type="submit" disabled={loading} className="btn-hover" style={{ width: '100%', padding: '14px', marginTop: '8px', backgroundColor: theme.gray900, color: theme.white, borderRadius: '12px', fontWeight: 600, fontSize: '15px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'background-color 0.2s', boxShadow: theme.shadowSm }}>
				  {loading ? 'جاري البحث...' : 'المتابعة'}
				</button>
			  </form>
			</div>
		  )}

		  {/* ─── LOGIN VIEW (STEP 2) ─── */}
		  {view === 'login' && (
			<div>
			  {/* Breadcrumb */}
			  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingBottom: '16px', borderBottom: `1px solid ${theme.gray200}` }}>
				<button type="button" onClick={() => { setView('domain'); setWorkspaceName(''); setLocalError(null); setLocalSuccess(null); }} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: theme.gray50, border: `1px solid ${theme.gray200}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.gray500, cursor: 'pointer', flexShrink: 0 }}>
				  <ArrowRight size={16} />
				</button>
				<div style={{ flex: 1, overflow: 'hidden', textAlign: 'right' }}>
				  <h3 style={{ fontSize: '15px', fontWeight: 600, color: theme.gray900, margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
					{workspaceName}
				  </h3>
				  <div dir="ltr" style={{ textAlign: 'right', fontSize: '11px', fontFamily: 'monospace', color: theme.gray500, fontWeight: 600, marginTop: '2px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
					{domain}.workspace
				  </div>
				</div>
			  </div>

			  <form onSubmit={handleLogin}>
				{/* Email input with fixed LTR alignments */}
				<div dir="ltr" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
				  <Mail style={{ position: 'absolute', left: '16px', width: '20px', height: '20px', color: theme.gray400, zIndex: 10 }} />
				  <input 
					type="email" 
					className="input-focus"
					style={{
					  width: '100%',
					  height: '52px',
					  paddingLeft: '48px',
					  paddingRight: '16px',
					  backgroundColor: theme.gray50,
					  border: `1px solid ${theme.gray200}`,
					  borderRadius: '12px',
					  color: theme.gray900,
					  fontSize: '14px',
					  fontWeight: 500,
					  boxSizing: 'border-box',
					  outline: 'none',
					}} 
					placeholder="name@center.com" 
					value={email} 
					onChange={(e) => setEmail(e.target.value)} 
					required 
					autoFocus 
				  />
				</div>
				
				{/* Password input with fixed LTR alignments */}
				<div dir="ltr" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
				  <Lock style={{ position: 'absolute', left: '16px', width: '20px', height: '20px', color: theme.gray400, zIndex: 10 }} />
				  <input 
					type="password" 
					className="input-focus"
					style={{
					  width: '100%',
					  height: '52px',
					  paddingLeft: '48px',
					  paddingRight: '16px',
					  backgroundColor: theme.gray50,
					  border: `1px solid ${theme.gray200}`,
					  borderRadius: '12px',
					  color: theme.gray900,
					  fontSize: '14px',
					  fontWeight: 500,
					  boxSizing: 'border-box',
					  outline: 'none',
					}} 
					placeholder="••••••••" 
					value={password} 
					onChange={(e) => setPassword(e.target.value)} 
					required 
				  />
				</div>
				
				<button type="submit" disabled={loading || !!localSuccess} className="btn-hover" style={{ width: '100%', padding: '14px', marginTop: '8px', backgroundColor: theme.gray900, color: theme.white, borderRadius: '12px', fontWeight: 600, fontSize: '15px', border: 'none', cursor: (loading || !!localSuccess) ? 'not-allowed' : 'pointer', opacity: (loading || !!localSuccess) ? 0.7 : 1, transition: 'background-color 0.2s', boxShadow: theme.shadowSm }}>
				  {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
				</button>

				<div style={{ position: 'relative', margin: '24px 0' }}>
				  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
					<div style={{ width: '100%', borderTop: `1px solid ${theme.gray200}` }}></div>
				  </div>
				  <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', fontSize: '14px' }}>
					<span style={{ padding: '0 12px', backgroundColor: theme.white, color: theme.gray500, fontSize: '12px', fontWeight: 600 }}>أو استخدم طريقة أخرى</span>
				  </div>
				</div>

				<button 
				  type="button" 
				  onClick={() => { setView('otp'); setLocalError(null); setLocalSuccess(null); }}
				  disabled={loading || !!localSuccess}
				  className="btn-white-hover"
				  style={{ width: '100%', padding: '14px', backgroundColor: theme.white, border: `1px solid ${theme.gray200}`, color: theme.gray900, borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: (loading || !!localSuccess) ? 'not-allowed' : 'pointer', opacity: (loading || !!localSuccess) ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'background-color 0.2s', boxShadow: theme.shadowSm }}
				>
				  <ShieldCheck style={{ width: '20px', height: '20px', color: theme.emerald }} />
				  الدخول السريع (بدون كلمة مرور)
				</button>
			  </form>
			</div>
		  )}

		  {/* ─── OTP VIEW (STEP 3) ─── */}
		  {view === 'otp' && (
			<form onSubmit={handleOTP}>
			  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingBottom: '16px', borderBottom: `1px solid ${theme.gray200}` }}>
				<button type="button" onClick={() => { setView('login'); setLocalError(null); setLocalSuccess(null); }} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: theme.gray50, border: `1px solid ${theme.gray200}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.gray500, cursor: 'pointer', flexShrink: 0 }}>
				  <ArrowRight size={16} />
				</button>
				<div style={{ flex: 1, textAlign: 'right' }}>
				  <h3 style={{ fontSize: '15px', fontWeight: 600, color: theme.gray900, margin: 0 }}>الدخول السريع</h3>
				</div>
			  </div>
			  
			  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
				<div style={{ width: '56px', height: '56px', backgroundColor: '#ecfdf5', color: theme.emerald, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #a7f3d0', boxShadow: theme.shadowSm }}>
				  <ShieldCheck size={26} strokeWidth={2.5} />
				</div>
			  </div>
			  
			  <p style={{ fontSize: '13px', color: theme.gray500, marginBottom: '24px', textAlign: 'center', lineHeight: 1.6, marginTop: 0 }}>
				أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً سرياً للدخول المباشر إلى النظام.
			  </p>
			  
			  <div dir="ltr" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
				<Mail style={{ position: 'absolute', left: '16px', width: '20px', height: '20px', color: theme.gray400, zIndex: 10 }} />
				<input 
				  type="email" 
				  required 
				  className="input-focus"
				  placeholder="name@center.com" 
				  value={email} 
				  onChange={e => setEmail(e.target.value)} 
				  style={{
					width: '100%',
					height: '52px',
					paddingLeft: '48px',
					paddingRight: '16px',
					backgroundColor: theme.gray50,
					border: `1px solid ${theme.gray200}`,
					borderRadius: '12px',
					color: theme.gray900,
					fontSize: '14px',
					fontWeight: 500,
					boxSizing: 'border-box',
					outline: 'none',
				  }} 
				  autoFocus
				/>
			  </div>

			  <button type="submit" disabled={loading || !!localSuccess} className="btn-emerald-hover" style={{ width: '100%', padding: '14px', backgroundColor: theme.emerald, color: theme.white, borderRadius: '12px', fontWeight: 600, fontSize: '15px', border: 'none', cursor: (loading || !!localSuccess) ? 'not-allowed' : 'pointer', opacity: (loading || !!localSuccess) ? 0.7 : 1, transition: 'background-color 0.2s', boxShadow: '0 4px 12px rgba(5,150,105,0.2)' }}>
				{loading ? 'جاري الإرسال...' : 'إرسال رابط الدخول'}
			  </button>
			</form>
		  )}

		  {/* GLOBAL Error Alert */}
		  {localError && (
			<div style={{ marginTop: '20px', borderRadius: '12px', border: `1px solid rgba(239, 68, 68, 0.2)`, backgroundColor: 'rgba(239, 68, 68, 0.05)', display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', textAlign: 'right', boxShadow: '0 4px 20px rgba(239,68,68,0.08)' }}>
			  <div style={{ backgroundColor: theme.red500, color: theme.white, borderRadius: '50%', padding: '4px', flexShrink: 0, marginTop: '2px', display: 'flex' }}>
				<AlertCircle size={16} strokeWidth={2.5} />
			  </div>
			  <div style={{ flex: 1 }}>
				<h4 style={{ fontSize: '13px', fontWeight: 800, color: theme.red500, margin: '0 0 2px 0' }}>تنبيه</h4>
				<p style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(239, 68, 68, 0.8)', margin: 0, lineHeight: 1.5 }}>{localError}</p>
			  </div>
			</div>
		  )}

		  {/* GLOBAL Success Alert */}
		  {localSuccess && (
			<div style={{ marginTop: '20px', borderRadius: '12px', border: `1px solid rgba(5, 150, 105, 0.2)`, backgroundColor: 'rgba(5, 150, 105, 0.05)', display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', textAlign: 'right', boxShadow: '0 4px 20px rgba(5,150,105,0.08)' }}>
			  <div style={{ backgroundColor: theme.emerald, color: theme.white, borderRadius: '50%', padding: '4px', flexShrink: 0, marginTop: '2px', display: 'flex' }}>
				<CheckCircle2 size={16} strokeWidth={2.5} />
			  </div>
			  <div style={{ flex: 1 }}>
				<h4 style={{ fontSize: '13px', fontWeight: 800, color: theme.emerald, margin: '0 0 2px 0' }}>نجاح</h4>
				<p style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(5, 150, 105, 0.8)', margin: 0, lineHeight: 1.5 }}>{localSuccess}</p>
			  </div>
			</div>
		  )}

		</div>
	  </div>
	</>
  );
}