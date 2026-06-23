# نظام بن عباس (Bin Abbas System) 🕌

> **Enterprise Management System for Educational Centers & Halaqat**

A comprehensive, offline-first, multi-tenant SaaS platform built to digitalize and streamline the operations of Quranic centers, educational institutes, and non-profit organizations. 

## ✨ Key Features

* **🏢 Multi-Tenancy (Workspaces):** Fully isolated data environments based on `workspace_id`. Custom domain validation before authentication for center-specific logins.
* **⚡ Offline-First Architecture:** Built with Dexie.js (IndexedDB) for seamless offline operations, with automatic background synchronization to Supabase when the connection is restored.
* **🔐 Role-Based Access Control (RBAC):** Strict security policies enforced via Supabase Row Level Security (RLS) and frontend role validation (Admin vs. Teacher).
* **💰 Financial Engine:** Complete ledger system tracking:
  * Donations and incoming funds.
  * Operational expenses and salaries.
  * Departmental budget tracking and real-time financial overviews.
* **📚 Educational Operations:** * **Halaqat Management:** Track teachers, assigned students, and active classes.
  * **Teacher Revisions:** Peer-to-peer recitation tracking (`teacher_revisions`) with grading.
  * **Attendance System:** Advanced grid-based monthly attendance with sticky headers.
* **🎨 Enterprise UI/UX:** A bespoke "Forest Green" design system utilizing CSS Modules, featuring a locked sidebar, bordered data containers, and full RTL (Right-to-Left) Arabic support.

## 🛠️ Technology Stack

* **Frontend:** React 18, TypeScript, React Router DOM v6
* **Backend as a Service (BaaS):** Supabase (PostgreSQL, Auth, RLS)
* **Local Database / Offline Sync:** Dexie.js
* **Styling:** CSS Modules (No inline-clutter, highly maintainable)
* **Icons:** Custom SVG Icon System


## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* npm or yarn
* Supabase Project

### Installation

