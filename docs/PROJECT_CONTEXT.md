# Project Overview

I am currently developing a capstone project entitled:

**GATE (Graduate Access and Tracking Environment): A Web-Based Alumni Tracer Study and Update Portal for the College of Engineering and Computer Technology (CECT), Wesleyan University-Philippines.**

## Project Purpose

The system is designed to replace the college's manual and Google Forms-based alumni tracer process with a centralized web application that allows alumni to register, maintain their personal and employment profiles, answer tracer study surveys and institutional forms, receive announcements, view featured alumni, send inquiries, and allows administrators and coordinators to track graduates and analyze tracer data.

The system focuses specifically on CECT graduates (BSIT, BSCS, and other CECT engineering and technology programs).

The goal is to develop and evaluate the software system, not to conduct the tracer study itself.

---

Technology Stack
Backend
- Laravel 12
- PHP 8.3
- MySQL / MariaDB
- Laravel Broadcasting

Frontend
- React
- Inertia.js
- Vite
- Tailwind CSS
- shadcn/ui

Other Services
- Pusher Channels (Realtime notifications)
- Mailtrap SMTP (for sending emails)
- Inertia React SPA architecture
- Image Optimization (WebP conversion via `App\Helpers\ImageHelper`)

Deployment

The project is currently deployed on InfinityFree.

Deployment characteristics:

- Manual FTP deployment
- FileZilla
- Public folder deployment
- Uses .htaccess
- Uses a MySQL database provided by InfinityFree
- Database imported manually
- Environment variables configured manually
- No SSH access
- No Composer on server
- No Node.js on server
- Assets are built locally using:
  `npm run build`
  then uploaded manually.

Known InfinityFree limitations:

- No storage symlink (`php artisan storage:link` cannot be used)
- Uploaded profile pictures and files are stored directly under a public uploads / storage directory instead of Laravel storage symlink.
- No cron jobs.
- No Node.js on server.
- Limited mail functionality.
- Uses shared hosting.

---

## Authentication & User Roles

The system supports three user roles sharing a unified `users` table:
1. **Alumni (`alumna`)**
2. **Coordinator (`coordinator`)**
3. **Admin (`admin`)**

### Dedicated Role-Specific Entry Routes
To enhance usability and security, authentication is segmented into distinct portal endpoints:
- **Alumni Portal:** `/alumna/login` (with email verification via `/alumna/verify-notice` and `/alumna/verify-email/{id}/{hash}`)
- **Coordinator Portal:** `/coordinator/login`
- **Admin Portal:** Secure obfuscated prefix configured via `.env` (`ADMIN_PORTAL_PREFIX`, e.g., `/portal/{hash}/login`)

### Post-Login Redirection & Route Protection
- Alumni → `/alumna/dashboard` (enforced with `tracer.completed` middleware)
- Coordinators → `/coordinator/dashboard`
- Admins → `/admin/dashboard`
- Root URL (`/`) automatically detects authentication state and role, redirecting appropriately.

---

## Main Modules & Features

### 1. Alumni Portal
- **Registration & Email Verification:** Includes name, suffix, student ID, course, graduation year/semester, Philippine/International address with ZIP code, and email verification.
- **Mandatory Tracer Study Gate (`tracer.completed` Middleware):** Active Tracer Study surveys are strictly enforced. Until an alumna completes the official tracer survey, access to other pages (dashboard, announcements, profile, updates, inquiries) is locked with automatic redirection to the questionnaire.
- **Separated Profile vs. Employment Management:**
  - **Student Profile (`/alumna/profile`, `/alumna/profile/edit`):** Dedicated to personal, academic, and contact details with Philippine PSGC address selectors (Region, Province, City/Municipality, Barangay, Zip) and International address support.
  - **Alumni Updates (`/alumna/updates`):** Dedicated page to report current employment status (`Employed` vs `Unemployed`), company, position, employment type, location, monthly salary, and duration. Updates automatically record a snapshot into `employment_histories`.
- **3-Month Profile Freshness Reminder:** Banner (`UpdateProfileBanner.jsx`) reminding alumni to review and update employment/contact data every 3 months.
- **Surveys & Forms (`/alumna/questionnaire`, `/alumna/surveys`):**
  - Divided cleanly into **Tracer Study** and **Alumni Forms** tabs.
  - Supports multi-section forms, drafts, and autosave.
- **Featured Alumni (`/alumna/featured-alumni`):** View approved success stories of notable CECT graduates.
- **Inquiry & Feedback:** Send inquiries directly to coordinators/admins with real-time reply tracking.
- **Alumni Affairs Information:** Institutional pages including Alumni Association officers, Alumni Office, About CECT, and Contact Us.
- **Redesigned Mobile-First Drawer Navigation:** Left-side slide-out navigation with distinct collapsible sub-menus ("Quick Actions" and "Alumni Affairs").

### 2. Coordinator Portal
- **Dashboard:** Overview of alumni count, survey responses, and pending announcements.
- **Survey Management ("Alumni Forms"):**
  - Create and manage general surveys and institutional forms using the interactive drag-and-drop Survey Builder.
  - Archive / Unarchive surveys.
- **Survey Response Monitoring:**
  - View both completed and in-progress survey responses.
  - Filter responses by survey type (`Tracer Study` vs `Alumni Forms`), course, year graduated, and submission status.
  - Inspect detailed respondent profiles and chronological employment history records in a modal dialog.
- **Announcement Management:** Create announcements that enter a `Pending` state awaiting Admin approval.
- **Featured Alumni Submissions:** Submit notable alumni profiles for Admin review.
- **Inquiry Management:** Review and respond to alumni queries.
- **Alumni Directory & Communication:** Search graduates and send individual or bulk emails.

### 3. Admin Portal
- **Obfuscated Admin Route:** Enhanced security barrier against brute force attacks.
- **Structured Submenu Navigation:**
  - **General:** Dashboard, Announcements, Inquiries
  - **Survey Management:** Forms and Surveys, Survey Responses
  - **Analytics:** Tracer Study Analytics, Alumni Forms Analytics, Employment Location Analytics
  - **User Management:** Alumni Directory, Alumni Coordinators
- **Survey Authority:**
  - Exclusive authority to create official **Tracer Study** surveys.
  - Full creation and management authority over **Alumni Forms**.
- **Approval Workflows:**
  - **Announcements Review:** Approve or reject coordinator-submitted announcements (admin posts are published immediately).
  - **Featured Alumni Review:** Approve or reject coordinator-submitted alumni spotlights with revision feedback.
- **Comprehensive Analytics & Reporting:**
  - Visual charts, response distributions, employment geographical heatmaps, and downloadable Excel/PDF analytical reports.
  - Specific CECT Tracer Study analytical reporting (`CectSurveyAnalyticsController`).

---

## Survey Architecture & Standardization

The system standardizes all surveys and questionnaires into **two explicit categories**:
1. **Tracer Study (`Tracer Study`):**
   - Official institutional tracer study instrument designed specifically for CECT graduates.
   - Created and managed exclusively by Administrators.
   - Enforced as a mandatory prerequisite for alumni via `EnsureTracerStudyCompleted` middleware.
2. **Alumni Forms (`Alumni Forms`):**
   - Replaces and consolidates the previous separate types ("Forms and Requests" and "Events").
   - Open for creation by both Administrators and Coordinators for event sign-ups, feedback forms, and institutional surveys.

Survey status flow: `draft` → `active` (requires at least one section and question) → `archived`.

---

## Research Context (BSIT Capstone)

- **University:** Wesleyan University-Philippines
- **College:** College of Engineering and Computer Technology (CECT)
- **Evaluation Framework:** ISO/IEC 25010 Software Quality Standards:
  - *Functional Suitability* (accurate tracer data capture, role workflows, email verification)
  - *Reliability* (data consistency, transaction safety, drafts, error states)
  - *Performance Efficiency* (Inertia SPA, WebP image conversion, optimized database queries)
  - *Usability / Interaction Capability* (mobile responsiveness, drawer navigation, intuitive address selectors, 3-month reminder banner)
  - *Security & Maintainability* (role middleware, obfuscated admin path, Form Request validations)

---

## Current Development Status & Recent Revisions

The system is in its final deployment and documentation revision phase. Recent updates completed include:
1. **Ma'am Kathy Navigation Revisions:**
   - Overhauled Alumni drawer navigation to a left-side layout with structured accordion groupings ("Quick Actions", "Alumni Affairs").
   - Reorganized Admin and Coordinator layouts into logical functional groups (General, Survey Management, Analytics).
2. **Survey Type Simplification:**
   - Database migration and logic merge converting legacy types ("Events", "Forms and Requests") into unified **"Alumni Forms"**.
   - Admin and Coordinator builders, index filters, response indexes, and analytics updated accordingly.
3. **Separation of Profile and Employment Updates:**
   - Decoupled personal profile (`/alumna/profile/edit`) from employment updates (`/alumna/updates`).
   - Created dedicated `AlumnaUpdatesController` and `AlumnaUpdates.jsx` page with automated `employment_histories` tracking.
4. **Mandatory Tracer Study Gate:**
   - Added `tracer.completed` middleware (`EnsureTracerStudyCompleted`) locking non-survey alumni routes until the active tracer survey is submitted.
5. **Featured Alumni Module:**
   - Added `featured_alumni` table, Admin/Coordinator CRUD with approval workflow, and public alumni showcase.
6. **Performance & Shared Hosting Optimizations:**
   - Implemented `ImageHelper` for automatic `.webp` compression upon upload.
   - Replaced polling with Pusher Channels for realtime notifications and inquiries.
   - Standardized Philippine PSGC address picker and International addresses with postal/ZIP codes.
7. **Security Hardening:**
   - Obfuscated Admin portal entry URL via `ADMIN_PORTAL_PREFIX`.
   - Email verification enforcement for alumni accounts.
   - Password reset throttles and expiration timers.