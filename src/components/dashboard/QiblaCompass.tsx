import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../ui/Icons';
import styles from '../../pages/Dashboard.module.css';

export default function QiblaCompass() {
  const [qiblaDegree, setQiblaDegree] = useState<number | null>(null);
  const [locationText, setLocationText] = useState('اضغط لتحديد الموقع');
  const [isMatched, setIsMatched] = useState(false);
  const needleRef = useRef<SVGGElement>(null);
  const lastVibration = useRef(0);

  const calcQiblaDirection = (lat: number, lon: number) => {
	const KAABA_LAT = 21.4225, KAABA_LON = 39.8262;
	const latR = lat * Math.PI / 180;
	const kLatR = KAABA_LAT * Math.PI / 180;
	const lonDiff = (KAABA_LON - lon) * Math.PI / 180;
	const y = Math.sin(lonDiff) * Math.cos(kLatR);
	const x = Math.cos(latR) * Math.sin(kLatR) - Math.sin(latR) * Math.cos(kLatR) * Math.cos(lonDiff);
	return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  };

  const handleOrientation = (event: any) => {
	if (qiblaDegree === null) return;

	let heading = null;
	if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
	  heading = event.webkitCompassHeading;
	} else if (event.alpha !== null) {
	  heading = 360 - event.alpha;
	}

	if (heading !== null && needleRef.current) {
	  const needleAngle = qiblaDegree - heading;
	  needleRef.current.style.transform = `rotate(${needleAngle}deg)`;

	  let diff = Math.abs((needleAngle % 360 + 360) % 360);
	  if (diff > 180) diff = 360 - diff;

	  if (diff < 4) {
		setIsMatched(true);
		const now = Date.now();
		if (now - lastVibration.current > 1500 && navigator.vibrate) {
		  navigator.vibrate([70, 50, 40]);
		  lastVibration.current = now;
		}
	  } else {
		setIsMatched(false);
	  }
	}
  };

  const initQibla = () => {
	setLocationText('جاري تفعيل المستشعرات...');

	if (window.DeviceOrientationEvent && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
	  (DeviceOrientationEvent as any).requestPermission()
		.then((permission: string) => {
		  if (permission === 'granted') {
			window.addEventListener('deviceorientation', handleOrientation, true);
		  }
		})
		.catch(console.error);
	} else if ('ondeviceorientationabsolute' in window) {
	  window.addEventListener('deviceorientationabsolute', handleOrientation as any, true);
	} else {
	  window.addEventListener('deviceorientation', handleOrientation, true);
	}

	if (!navigator.geolocation) {
	  setLocationText('الـ GPS غير مدعوم');
	  return;
	}

	navigator.geolocation.getCurrentPosition(
	  (pos) => {
		const lat = pos.coords.latitude;
		const lon = pos.coords.longitude;
		setLocationText(`${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`);
		const bearing = calcQiblaDirection(lat, lon);
		setQiblaDegree(bearing);
	  },
	  (error) => {
		setLocationText('تعذّر تحديد الموقع');
	  },
	  { enableHighAccuracy: true }
	);
  };

  // Cleanup listeners on unmount
  useEffect(() => {
	return () => {
	  window.removeEventListener('deviceorientationabsolute', handleOrientation as any, true);
	  window.removeEventListener('deviceorientation', handleOrientation, true);
	};
  }, [qiblaDegree]);

  return (
	<div className={`${styles.qiblaSection} ${isMatched ? styles.qiblaMatched : ''}`}>
	  <div className={styles.qiblaHeader}>
		<span style={{ fontSize: '1rem' }}>🧭</span>
		<span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--green2)' }}>اتجاه القبلة</span>
	  </div>
	  
	  <div className={styles.qiblaWrap}>
		<div className={styles.compassSvgWrap}>
		  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
			<circle cx="80" cy="80" r="76" fill="none" stroke="var(--border2)" strokeWidth="1.5" />
			<circle cx="80" cy="80" r="68" fill="none" stroke="var(--gold)" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4" />
			<g stroke="var(--text3)" strokeWidth="1" opacity="0.4">
			  <line x1="80" y1="6" x2="80" y2="14" />
			  <line x1="80" y1="146" x2="80" y2="154" />
			  <line x1="6" y1="80" x2="14" y2="80" />
			  <line x1="146" y1="80" x2="154" y2="80" />
			</g>
			<text x="80" y="26" textAnchor="middle" fontFamily="Tajawal" fontSize="10" fill="var(--text2)" fontWeight="700">N</text>
			<text x="80" y="148" textAnchor="middle" fontFamily="Tajawal" fontSize="10" fill="var(--text2)">S</text>
			<text x="18" y="84" textAnchor="middle" fontFamily="Tajawal" fontSize="10" fill="var(--text2)">W</text>
			<text x="148" y="84" textAnchor="middle" fontFamily="Tajawal" fontSize="10" fill="var(--text2)">E</text>
			<g ref={needleRef} style={{ transformOrigin: '80px 80px', transition: 'transform 0.1s ease-out' }}>
			  <polygon points="80,22 85,65 80,58 75,65" fill="var(--gold)" opacity="0.9" />
			  <polygon points="80,138 85,95 80,102 75,95" fill="var(--text3)" opacity="0.5" />
			</g>
			<circle cx="80" cy="80" r="6" fill="var(--green2)" opacity="0.9" />
			<circle cx="80" cy="80" r="3" fill="white" />
			<text x="80" y="84" textAnchor="middle" fontFamily="serif" fontSize="8" fill="white">🕋</text>
		  </svg>
		</div>
		<div className={styles.qiblaInfo}>
		  <div className={styles.qiblaDeg}>{qiblaDegree ? `${Math.round(qiblaDegree)}°` : '—°'}</div>
		  <div className={styles.qiblaSub}>اتجاه القبلة من موقعك</div>
		  <div className={styles.qiblaLoc}>{locationText}</div>
		</div>
	  </div>
	  <button className={styles.btnOutline} onClick={initQibla} style={{ width: '100%', marginTop: '12px' }}>
		<Icon name="compass" size={14} /> تحديث الموقع
	  </button>
	</div>
  );
}