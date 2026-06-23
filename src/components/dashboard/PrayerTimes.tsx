import React, { useState, useEffect } from 'react';
import { Icon } from '../ui/Icons';
import styles from '../../pages/Dashboard.module.css';

interface Timings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export default function PrayerTimes() {
  const [timings, setTimings] = useState<Timings | null>(null);
  const [nextPrayer, setNextPrayer] = useState('');
  
  useEffect(() => {
	const fetchPrayers = async (lat: number, lon: number) => {
	  try {
		const date = new Date();
		const dateString = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
		const res = await fetch(`https://api.aladhan.com/v1/timings/${dateString}?latitude=${lat}&longitude=${lon}&method=4`);
		const json = await res.json();
		
		if (json.code === 200) {
		  setTimings(json.data.timings);
		  calculateNextPrayer(json.data.timings);
		}
	  } catch (error) {
		console.error('Failed to fetch prayer times', error);
	  }
	};

	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(
		(pos) => fetchPrayers(pos.coords.latitude, pos.coords.longitude),
		() => fetchPrayers(24.7136, 46.6753) // Fallback to Riyadh coordinates
	  );
	} else {
	  fetchPrayers(24.7136, 46.6753);
	}
  }, []);

  const calculateNextPrayer = (currentTimings: Timings) => {
	const now = new Date();
	const nowMins = now.getHours() * 60 + now.getMinutes();
	
	const prayers = [
	  { name: 'الفجر', key: 'Fajr' },
	  { name: 'الظهر', key: 'Dhuhr' },
	  { name: 'العصر', key: 'Asr' },
	  { name: 'المغرب', key: 'Maghrib' },
	  { name: 'العشاء', key: 'Isha' }
	];

	let upcomingName = '';
	let minDiff = Infinity;

	prayers.forEach(p => {
	  const timeStr = currentTimings[p.key as keyof Timings];
	  if (!timeStr) return;
	  
	  const [hh, mm] = timeStr.split(':').map(Number);
	  const pMins = hh * 60 + mm;
	  
	  if (pMins > nowMins && (pMins - nowMins) < minDiff) {
		minDiff = pMins - nowMins;
		upcomingName = p.name;
	  }
	});

	if (upcomingName) {
	  setNextPrayer(`القادمة: ${upcomingName}`);
	}
  };

  const formatTime12 = (time24?: string) => {
	if (!time24) return '—';
	const [h, m] = time24.split(':').map(Number);
	const suffix = h >= 12 ? 'م' : 'ص';
	const h12 = h % 12 || 12;
	return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
  };

  return (
	<div className={styles.prayerSection}>
	  <div className={styles.prayerHeader}>
		<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
		  <Icon name="mosque" size={18} color="var(--gold2)" />
		  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold2)' }}>مواقيت الصلاة</span>
		</div>
		{nextPrayer && (
		  <span className={styles.prayerBadge}>{nextPrayer}</span>
		)}
	  </div>

	  <div className={styles.prayerGrid}>
		<div className={styles.prayerItem}>
		  <div className={styles.prayerName}>الفجر</div>
		  <div className={styles.prayerTime}>{formatTime12(timings?.Fajr)}</div>
		</div>
		<div className={styles.prayerItem}>
		  <div className={styles.prayerName}>الظهر</div>
		  <div className={styles.prayerTime}>{formatTime12(timings?.Dhuhr)}</div>
		</div>
		<div className={styles.prayerItem}>
		  <div className={styles.prayerName}>العصر</div>
		  <div className={styles.prayerTime}>{formatTime12(timings?.Asr)}</div>
		</div>
		<div className={styles.prayerItem}>
		  <div className={styles.prayerName}>المغرب</div>
		  <div className={styles.prayerTime}>{formatTime12(timings?.Maghrib)}</div>
		</div>
		<div className={styles.prayerItem}>
		  <div className={styles.prayerName}>العشاء</div>
		  <div className={styles.prayerTime}>{formatTime12(timings?.Isha)}</div>
		</div>
	  </div>
	</div>
  );
}