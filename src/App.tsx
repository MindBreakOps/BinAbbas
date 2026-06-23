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
	  {/* مزودات السياق (Context Providers) يجب أن تغلف التطبيق بأكمله */}
	  <AuthProvider>
		<TenantProvider>
		  
		  <Routes>
			{/* 
			  هذا هو الـ Layout Route
			  أي صفحة توضع داخل هذا الـ Route سيتم تغليفها بـ AppShell 
			  (الشريط الجانبي والشريط العلوي)
			*/}
			<Route element={<AppShell />}>
			  
			  {/* الصفحات الأساسية */}
			  <Route path="/" element={<Dashboard />} />
			  <Route path="/students" element={<Students />} />
			  <Route path="/teachers" element={<Teachers />} />
			  <Route path="/teacher-rev" element={<TeacherRev />} />
			  <Route path="/halaqat" element={<Halaqat />} />
			  <Route path="/attendance" element={<Attendance />} />
			  <Route path="/exams" element={<Exams />} />
			  <Route path="/news" element={<News />} />

			  {/* صفحات قسم المالية */}
			  <Route path="/financials/overview" element={<FinancialOverview />} />
			  <Route path="/financials/budget" element={<FinancialBudget />} />
			  <Route path="/financials/donations" element={<FinancialDonations />} />
			  <Route path="/financials/expenses" element={<FinancialExpenses />} />

			  {/* صفحات الإعدادات */}
			  <Route path="/settings/workspace" element={<SettingsWorkspace />} />
			  <Route path="/settings/accounts" element={<SettingsAccounts />} />
			  <Route path="/settings/preferences" element={<SettingsPreferences />} />

			</Route>

			{/* 
			  ملاحظة: إذا كان لديك صفحة تسجيل دخول (Login) 
			  يجب أن تكون خارج الـ AppShell حتى لا يظهر فيها الشريط الجانبي.
			  مثال:
			  <Route path="/login" element={<Login />} />
			*/}
			
		  </Routes>
		  
		</TenantProvider>
	  </AuthProvider>
	</BrowserRouter>
  );
}