import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';

export default function SettingsWorkspace() {
  const { workspace } = useTenant();
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
	if (workspace) {
	  setName(workspace.name || '');
	  setDomain(workspace.domain || '');
	}
  }, [workspace]);

  const handleSave = async () => {
	if (!workspace) return;
	setIsSaving(true);
	setMessage('');

	const { error } = await supabase
	  .from('workspaces')
	  .update({ name, domain })
	  .eq('id', workspace.id);

	setIsSaving(false);
	if (error) {
	  setMessage('حدث خطأ أثناء الحفظ: ' + error.message);
	} else {
	  setMessage('تم حفظ إعدادات مساحة العمل بنجاح.');
	}
  };

  // Inline Styles Object
  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' },
	titleArea: { margin: 0 },
	title: { fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' },
	subtitle: { fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 },
	card: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '32px', maxWidth: '600px', boxShadow: 'var(--shadow-sm)' },
	inputGroup: { marginBottom: '20px' },
	label: { display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' },
	input: { width: '100%', padding: '12px 16px', border: '1px solid var(--border-subtle)', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.95rem', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' },
	btnPrimary: { backgroundColor: 'var(--forest-green)', color: '#ffffff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' },
	message: { marginTop: '16px', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--forest-light)', color: 'var(--forest-green)', fontSize: '0.9rem', fontWeight: 600 }
  };

  return (
	<div>
	  <div style={styles.header}>
		<div style={styles.titleArea}>
		  <h2 style={styles.title}>إعدادات مساحة العمل</h2>
		  <p style={styles.subtitle}>تعديل بيانات المركز والنطاق المخصص (Domain)</p>
		</div>
	  </div>

	  <div style={styles.card}>
		<div style={styles.inputGroup}>
		  <label style={styles.label}>اسم المركز / مساحة العمل</label>
		  <input style={styles.input} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="مثال: مركز الإمام الشاطبي" />
		</div>

		<div style={styles.inputGroup}>
		  <label style={styles.label}>النطاق المخصص (Domain)</label>
		  <input style={styles.input} type="text" dir="ltr" value={domain} onChange={e => setDomain(e.target.value)} placeholder="example-domain" />
		  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px', display: 'block' }}>
			هذا هو الرابط الذي يستخدمه المعلمون للدخول للنظام.
		  </span>
		</div>

		<button style={styles.btnPrimary} onClick={handleSave} disabled={isSaving}>
		  <Icon name="save" size={16} /> {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
		</button>

		{message && <div style={styles.message}>{message}</div>}
	  </div>
	</div>
  );
}