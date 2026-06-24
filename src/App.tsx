import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';

// Layout
import AppShell from './components/layout/AppShell';

// ==========================================
// المسارات العامة (تأكد من وجود هذه الأسطر)
// ==========================================
import Landing from './pages/Landing';
import Subscription from './pages/Subscription';
import Login from './pages/Login';

// ==========================================
// مسارات لوحة التحكم الأساسية
// ==========================================
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import TeacherRev from './pages/TeacherRev';
import Halaqat from './pages/Halaqat';
import Attendance from './pages/Attendance';
import Exams from './pages/Exams';
import News from './pages/News';
import TopStudents from './pages/TopStudents';
import Certificates from './pages/Certificates';

import StudentResults from './pages/StudentResults';
// صفحات قسم المالية
import FinancialOverview from './pages/FinancialOverview';
import FinancialBudget from './pages/FinancialBudget';
import FinancialDonations from './pages/FinancialDonations';
import FinancialExpenses from './pages/FinancialExpenses';
import Events from './pages/Events';
// صفحات الإعدادات
import SettingsWorkspace from './pages/SettingsWorkspace';
import SettingsAccounts from './pages/SettingsAccounts';
import SettingsPreferences from './pages/SettingsPreferences';

export default function App() {
  return (
	<BrowserRouter>
	  <AuthProvider>
		<TenantProvider>
		  <Routes>
			
			{/* 1. المسارات العامة (بدون شريط جانبي) */}
<Route path="/" element={<Landing />} />
			<Route path="/subscription" element={<Subscription />} />
			<Route path="/login" element={<Login />} />

			{/* 2. مسارات لوحة التحكم (مع الشريط الجانبي) */}
			<Route element={<AppShell />}>
			  <Route path="/dashboard" element={<Dashboard />} />
			  <Route path="/students" element={<Students />} />
			  <Route path="/teachers" element={<Teachers />} />
			  <Route path="/teacher-rev" element={<TeacherRev />} />
			  <Route path="/halaqat" element={<Halaqat />} />
			  <Route path="/attendance" element={<Attendance />} />
			  <Route path="/exams" element={<Exams />} />
			  <Route path="/news" element={<News />} />
				  <Route path="/top-students" element={<TopStudents />} />
				  <Route path="/certificates" element={<Certificates />} />
					  <Route path="/events" element={<Events />} />
					  <Route path="/results" element={<StudentResults />} />

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