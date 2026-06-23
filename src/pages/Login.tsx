import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import styles from './Login.module.css';

export default function Login() {
  const [domain, setDomain] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'domain' | 'login' | 'otp'>('domain');

  // Step 1: Verify the Workspace Domain
  const handleDomainCheck = async (e: React.FormEvent) => {
	e.preventDefault();
	if (!domain) return;
	
	setLoading(true);
	setError(null);

	const { data, error } = await supabase
	  .from('workspaces')
	  .select('name, domain')
	  .eq('domain', domain)
	  .single();

	if (error || !data) {
	  setError('مساحة العمل غير موجودة. الرجاء التأكد من الرابط.');
	} else {
	  setWorkspaceName(data.name);
	  setView('login'); // Move to authentication step
	}
	setLoading(false);
  };

  // Step 2: Authenticate User
 const handleLogin = async (e: React.FormEvent) => {
	 e.preventDefault();
	 setLoading(true);
	 setError(null);
 
	 const { data, error } = await supabase.auth.signInWithPassword({
	   email,
	   password,
	 });
 
	 if (error) {
	   // This will now show the EXACT reason it failed (e.g., "Email not confirmed")
	   setError(error.message); 
	   setLoading(false);
	 } else {
	   // Login successful! Force the browser to refresh and load the Dashboard
	   window.location.href = '/'; 
	 }
   };

  const handleOTP = async (e: React.FormEvent) => {
	e.preventDefault();
	setLoading(true);
	setError(null);

	const { error } = await supabase.auth.signInWithOtp({
	  email,
	});

	if (error) {
	  setError('تعذر إرسال الرمز. تأكد من البريد الإلكتروني.');
	} else {
	  setError('تم إرسال الرمز إلى بريدك الإلكتروني بنجاح.');
	}
	setLoading(false);
  };

  return (
	<div className={styles.container}>
	  <div className={styles.card}>
		<div className={styles.header}>
		  {view === 'domain' ? (
			<>
			  <h1 className={styles.title}>البحث عن مساحة العمل</h1>
			  <p className={styles.subtitle}>أدخل رابط مساحة العمل الخاصة بمركزك للبدء</p>
			</>
		  ) : (
			<>
			  <h1 className={styles.title}>تسجيل الدخول</h1>
			  <p className={styles.subtitle}>
				مرحباً بك في <strong>{workspaceName}</strong>
			  </p>
			</>
		  )}
		</div>

		{error && <div className={styles.error}>{error}</div>}

		{/* VIEW 1: DOMAIN CHECK */}
		{view === 'domain' && (
		  <form onSubmit={handleDomainCheck}>
			<div className={styles.inputGroup}>
			  <label className={styles.label}>رابط مساحة العمل (Domain)</label>
			  <input
				type="text"
				className={styles.input}
				value={domain}
				onChange={(e) => setDomain(e.target.value)}
				placeholder="مثال: alnaseem.workspace"
				dir="ltr"
				required
			  />
			</div>
			<button
			  type="submit"
			  className={`${styles.button} ${loading ? styles.buttonDisabled : ''}`}
			  disabled={loading}
			>
			  {loading ? 'جاري البحث...' : 'المتابعة'}
			</button>
		  </form>
		)}

		{/* VIEW 2: PASSWORD LOGIN */}
		{view === 'login' && (
		  <form onSubmit={handleLogin}>
			<div className={styles.inputGroup}>
			  <label className={styles.label}>البريد الإلكتروني</label>
			  <input
				type="email"
				className={styles.input}
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				dir="ltr"
				required
			  />
			</div>
			<div className={styles.inputGroup}>
			  <label className={styles.label}>كلمة المرور</label>
			  <input
				type="password"
				className={styles.input}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				dir="ltr"
				required
			  />
			</div>
			<button
			  type="submit"
			  className={`${styles.button} ${loading ? styles.buttonDisabled : ''}`}
			  disabled={loading}
			>
			  {loading ? 'جاري التحقق...' : 'دخول'}
			</button>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
			  <button
				type="button"
				className={styles.linkButton}
				onClick={() => setView('domain')}
			  >
				تغيير مساحة العمل
			  </button>
			  <button
				type="button"
				className={styles.linkButton}
				onClick={() => setView('otp')}
			  >
				الدخول السريع (OTP)
			  </button>
			</div>
		  </form>
		)}

		{/* VIEW 3: OTP LOGIN */}
		{view === 'otp' && (
		  <form onSubmit={handleOTP}>
			<div className={styles.inputGroup}>
			  <label className={styles.label}>البريد الإلكتروني</label>
			  <input
				type="email"
				className={styles.input}
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				dir="ltr"
				required
			  />
			</div>
			<button
			  type="submit"
			  className={`${styles.button} ${loading ? styles.buttonDisabled : ''}`}
			  disabled={loading}
			>
			  {loading ? 'جاري الإرسال...' : 'إرسال الرمز السري'}
			</button>
			<div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
			  <button
				type="button"
				className={styles.linkButton}
				onClick={() => setView('login')}
			  >
				العودة لتسجيل الدخول بكلمة المرور
			  </button>
			</div>
		  </form>
		)}
	  </div>
	</div>
  );
}