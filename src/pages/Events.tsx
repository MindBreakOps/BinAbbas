import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/ui/Icons';

const theme = {
  darkGreen: '#064e3b', gold: '#d97706', cream: '#fffdf7', white: '#ffffff',
  textDark: '#111827', textGray: '#4b5563', borderLight: '#e5e7eb', borderGold: 'rgba(217, 119, 6, 0.3)'
};

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'نشاط' | 'احتفال'>('نشاط');
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: new Date().toISOString().split('T')[0], organizer: '', description: '' });

  const fetchEvents = async () => {
	setIsLoading(true);
	const { data } = await supabase.from('events').select('*').order('date', { ascending: false });
	if (data) setEvents(data);
	setIsLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSave = async (e: React.FormEvent) => {
	e.preventDefault();
	await supabase.from('events').insert([{ ...formData, type: activeTab }]);
	setIsModalOpen(false);
	fetchEvents();
  };

  const handleDelete = async (id: string) => {
	if (window.confirm('تأكيد الحذف؟')) {
	  await supabase.from('events').delete().eq('id', id);
	  fetchEvents();
	}
  };

  const filteredEvents = events.filter(e => e.type === activeTab);

  const styles: { [key: string]: React.CSSProperties } = {
	header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', borderBottom: `2px solid ${theme.borderLight}`, paddingBottom: '24px' },
	title: { fontSize: '1.6rem', fontWeight: 900, color: theme.darkGreen, margin: '0 0 8px 0' },
	subtitle: { fontSize: '0.95rem', color: theme.textGray, margin: 0 },
	tabs: { display: 'flex', gap: '12px', marginBottom: '24px' },
	tabBtn: { padding: '10px 24px', borderRadius: '4px', fontWeight: 900, cursor: 'pointer', border: `1px solid ${theme.borderGold}`, transition: 'all 0.2s' },
	card: { backgroundColor: theme.white, border: `1px solid ${theme.borderGold}`, borderRadius: '4px', overflow: 'hidden', borderTop: `4px solid ${theme.darkGreen}` },
	table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
	th: { backgroundColor: theme.cream, color: theme.textDark, fontWeight: 900, padding: '16px', borderBottom: `1px solid ${theme.borderGold}` },
	td: { padding: '16px', borderBottom: `1px solid ${theme.borderLight}`, color: theme.textDark, fontWeight: 600 },
	btnPrimary: { backgroundColor: theme.darkGreen, color: theme.cream, border: `1px solid ${theme.gold}`, padding: '10px 20px', borderRadius: '4px', fontWeight: 900, cursor: 'pointer' },
	modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 78, 59, 0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
	inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
	input: { padding: '10px', borderRadius: '4px', border: `1px solid ${theme.borderLight}`, outline: 'none' }
  };

  return (
	<div>
	  <div style={styles.header}>
		<div>
		  <h2 style={styles.title}>الأنشطة والاحتفالات</h2>
		  <p style={styles.subtitle}>توثيق الأنشطة اللامنهجية، المسابقات، والاحتفالات التكريمية</p>
		</div>
		<button style={styles.btnPrimary} onClick={() => { setFormData({ title: '', date: new Date().toISOString().split('T')[0], organizer: '', description: '' }); setIsModalOpen(true); }}>
		  + إضافة {activeTab === 'نشاط' ? 'نشاط' : 'احتفال'}
		</button>
	  </div>

	  <div style={styles.tabs}>
		<button onClick={() => setActiveTab('نشاط')} style={{ ...styles.tabBtn, backgroundColor: activeTab === 'نشاط' ? theme.darkGreen : theme.white, color: activeTab === 'نشاط' ? theme.white : theme.textDark }}>الأنشطة التفاعلية</button>
		<button onClick={() => setActiveTab('احتفال')} style={{ ...styles.tabBtn, backgroundColor: activeTab === 'احتفال' ? theme.gold : theme.white, color: activeTab === 'احتفال' ? theme.white : theme.textDark }}>الاحتفالات والتكريم</button>
	  </div>

	  <div style={styles.card}>
		{isLoading ? <p style={{ padding: '32px', textAlign: 'center' }}>جاري التحميل...</p> : (
		  <table style={styles.table}>
			<thead>
			  <tr><th style={styles.th}>العنوان</th><th style={styles.th}>التاريخ</th><th style={styles.th}>المشرف / المنظم</th><th style={styles.th}>الوصف والتفاصيل</th><th style={styles.th}>إجراءات</th></tr>
			</thead>
			<tbody>
			  {filteredEvents.map(e => (
				<tr key={e.id}>
				  <td style={{ ...styles.td, color: theme.darkGreen, fontWeight: 900 }}>{e.title}</td>
				  <td style={styles.td}>{e.date}</td>
				  <td style={styles.td}>{e.organizer || '—'}</td>
				  <td style={styles.td}>{e.description || '—'}</td>
				  <td style={styles.td}>
					<button onClick={() => handleDelete(e.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 800 }}>حذف</button>
				  </td>
				</tr>
			  ))}
			  {filteredEvents.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px' }}>لا توجد سجلات.</td></tr>}
			</tbody>
		  </table>
		)}
	  </div>

	  {isModalOpen && (
		<div style={styles.modalOverlay}>
		  <div style={{ backgroundColor: theme.cream, padding: '32px', borderRadius: '4px', width: '450px', border: `2px solid ${theme.gold}` }}>
			<h3 style={{ margin: '0 0 24px 0', color: theme.darkGreen, fontWeight: 900 }}>إضافة {activeTab === 'نشاط' ? 'نشاط' : 'احتفال'} جديد</h3>
			<form onSubmit={handleSave}>
			  <div style={styles.inputGroup}><label style={{fontWeight: 900}}>العنوان</label><input required style={styles.input} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
			  <div style={styles.inputGroup}><label style={{fontWeight: 900}}>التاريخ</label><input type="date" required style={styles.input} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
			  <div style={styles.inputGroup}><label style={{fontWeight: 900}}>المنظم / المشرف</label><input style={styles.input} value={formData.organizer} onChange={e => setFormData({...formData, organizer: e.target.value})} /></div>
			  <div style={styles.inputGroup}><label style={{fontWeight: 900}}>التفاصيل</label><input style={styles.input} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
			  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
				<button type="submit" style={{...styles.btnPrimary, flex: 1}}>حفظ السجل</button>
				<button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', border: `1px solid ${theme.borderLight}`, background: theme.white, cursor: 'pointer', fontWeight: 800 }}>إلغاء</button>
			  </div>
			</form>
		  </div>
		</div>
	  )}
	</div>
  );
}