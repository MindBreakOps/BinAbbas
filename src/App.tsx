import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Providers (تأكد من مساراتها حسب مشروعك)
import { AuthProvider } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';

// Layout
import AppShell from './components/layout/AppShell';

// Core Pages
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import TeacherRev from './pages/TeacherRev'; // كما اتفقنا على اسم الملف
import Halaqat from './pages/Halaqat';
import Attendance from './pages/Attendance';
import Exams from './pages/Exams';
import News from './pages/News';

// Financial Pages
import FinancialOverview from './pages/FinancialOverview';
import FinancialBudget from './pages/FinancialBudget';
import FinancialDonations from './pages/FinancialDonations';
import FinancialExpenses from './pages/FinancialExpenses';

// Settings Pages
import SettingsWorkspace from './pages/SettingsWorkspace';
import SettingsAccounts from './pages/SettingsAccounts';
import SettingsPreferences from './pages/SettingsPreferences';

export default function App() {
  return (
	<BrowserRouter>
	  <AuthProvider>
		<TenantProvider>
		  <Routes>
			
			{/* ==========================================
				1. المسارات العامة (بدون شريط جانبي)
				========================================== */}
			<Route path="/" element={<Landing />} />
			<Route path="/login" element={<Login />} />

			{/* ==========================================
				2. مسارات لوحة التحكم (مع الشريط الجانبي)
				========================================== */}
			<Route element={<AppShell />}>
			  {/* لاحظ أن لوحة القيادة أصبح مسارها /dashboard بدلاً من / */}
			  <Route path="/dashboard" element={<Dashboard />} />
			  
			  <Route path="/students" element={<Students />} />
			  <Route path="/teachers" element={<Teachers />} />
			  <Route path="/teacher-rev" element={<TeacherRev />} />
			  <Route path="/halaqat" element={<Halaqat />} />
			  <Route path="/attendance" element={<Attendance />} />
			  <Route path="/exams" element={<Exams />} />
			  <Route path="/news" element={<News />} />

			  <Route path="/financials/overview" element={<FinancialOverview />} />
			  <Route path="/financials/budget" element={<FinancialBudget />} />
			  <Route path="/financials/donations" element={<FinancialDonations />} />
			  <Route path="/financials/expenses" element={<FinancialExpenses />} />

			  <Route path="/settings/workspace" element={<SettingsWorkspace />} />
			  <Route path="/settings/accounts" element={<SettingsAccounts />} />
			  <Route path="/settings/preferences" element={<SettingsPreferences />} />
			</Route>

		  </Routes>
		</TenantProvider>
	  </AuthProvider>
	</BrowserRouter>
  );
}