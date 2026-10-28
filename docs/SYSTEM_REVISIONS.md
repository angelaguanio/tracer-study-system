# GATE System Revisions & Technical Changelog

**Project:** GATE (Graduate Access and Tracking Environment)  
**Institution:** College of Engineering and Computer Technology (CECT), Wesleyan University-Philippines  
**Document Purpose:** Comprehensive record of recent system revisions, architectural refactoring, database migrations, and UI/UX enhancements.

---

## 1. Executive Summary of Revisions

Recent development focused on addressing faculty and defense committee feedback (including advisor recommendations / "Ma'am Kathy" revisions), optimizing for shared hosting (InfinityFree), standardizing survey operations, and improving graduate data integrity.

Key transformations:
- **Navigation & Usability:** Complete reorganization of Alumni, Coordinator, and Admin layouts into intuitive functional groupings and mobile-responsive drawer menus.
- **Data Integrity & Separation of Concerns:** Segregation of static alumni demographic data from dynamic employment tracking into two distinct modules.
- **Survey Simplification:** Reduction of fragmented survey types into two well-defined standards: *Tracer Study* and *Alumni Forms*.
- **Compliance & Participation Enforcement:** Introduction of the mandatory Tracer Study completion gate middleware.
- **Alumni Engagement:** Addition of a Featured Alumni spotlight module and 3-month profile update prompts.
- **Hosting Performance:** Implementation of server-side WebP image conversion and event-driven Pusher channels.

---

## 2. Detailed Technical Breakdown of Revisions

### Revision 1: Navigation & Layout Reorganization ("Ma'am Kathy Revisions")
- **Alumni Navigation (`resources/js/components/navbar-alumni.jsx`):**
  - Converted mobile drawer to slide out from the left (`-translate-x-full` to `translate-x-0`).
  - Added clean visual indicators: bold left accent border (`border-l-[4px] border-blue-600`) and soft blue background highlighting for active items.
  - Divided navigation links into two collapsible accordion groups:
    1. **Quick Actions:** *Surveys & Questionnaires*, *Alumni Forms*, *Inquiries*
    2. **Alumni Affairs:** *Announcements*, *Alumni Updates*, *About*, *Contact Us*
  - Re-routed primary alumni landing page to `/alumna/dashboard` (named `alumna.home`).
- **Admin Navigation (`resources/js/layouts/admin-layout.jsx`):**
  - Reorganized root menu into structured domain sub-menus:
    - **General:** Dashboard, Announcements, Inquiries
    - **Survey Management:** Forms and Surveys, Survey Responses
    - **Analytics:** Tracer Study Analytics, Alumni Forms Analytics, Employment Location
    - **Directory & Users:** Alumni, Alumni Coordinators
- **Coordinator Layout (`resources/js/layouts/coordinator-layout.jsx`):**
  - Updated sidebar items to reflect coordinator duties (Dashboard, Announcements, Inquiries, Featured Alumni, Forms & Surveys, Responses, Analytics, Alumni Directory).

---

### Revision 2: Decoupling of Alumni Profile and Employment Status
- **Problem Solved:** Previously, employment information was nested within the alumni personal profile. Alumni updating employment had to edit their full profile, leading to data confusion and lack of distinct chronological tracking.
- **New Controller (`app/Http/Controllers/AlumnaUpdatesController.php`):**
  - `index()`: Loads the alumnus's current employment record and full employment history.
  - `updateEmployment(Request $request)`: Validates status (`Yes` / `No`), employment type, company, position, location, monthly salary, and employment duration.
  - Automatically compares new input against the existing `Employment` record.
  - If employed details changed, it automatically creates a new historical snapshot in `employment_histories`.
- **New View (`resources/js/pages/Alumna/AlumnaUpdates.jsx`):**
  - Interactive radio switch between **Employed** and **Unemployed**.
  - Dynamic input rendering: company, role, location, salary bracket, employment duration for employed graduates; unemployment reason selector for job seekers.
  - Historical timeline listing all previous positions held with start/end duration and present role badges.
- **Student Profile Streamlining (`resources/js/pages/Alumna/StudentProfile.jsx`, `StudentProfileEdit.jsx`):**
  - Focused strictly on personal demographics, contact numbers, email, student ID, degree program, and graduation year/semester.

---

### Revision 3: Survey Classification & Database Migration
- **Survey Types Consolidation:**
  - Deprecated and removed legacy types: `Forms and Requests` and `Events`.
  - Standardized into two unambiguous types:
    1. **`Tracer Study`:** Exclusive official CECT Tracer Study survey (Admin-only creation).
    2. **`Alumni Forms`:** General surveys, feedback forms, and event registration forms (Admin and Coordinator creation).
- **Migration (`database/migrations/2026_10_13_000000_merge_survey_types_into_alumni_forms.php`):**
  - Automatically migrated all legacy `Forms and Requests` and `Events` records into `Alumni Forms`.
- **Model Scopes (`app/Models/Survey.php`):**
  - `Survey::scopeTracerStudy($query)`
  - `Survey::scopeAlumniForms($query)`
  - `Survey::scopeActive($query)`
  - `Survey::scopeNotArchived($query)`
  - `Survey::scopeArchived($query)`
- **UI & Controller Alignment:**
  - `AdminOfSurveyResponseController` & `CoordinatorOfSurveyResponseController`: Added dropdown filters for `Tracer Study` and `Alumni Forms`.
  - `AdminSurveyResponseIndex.jsx` & `CoordinatorSurveyResponseIndex.jsx`: Display type badge on survey cards and provide multi-criteria filtering.
  - Admin Analytics separated into Tracer Study (`/admin/analytics/tracer-study`) and Alumni Forms (`/admin/analytics/alumni-forms`).

---

### Revision 4: Mandatory Tracer Study Gate Middleware
- **Middleware (`app/Http/Middleware/EnsureTracerStudyCompleted.php`):**
  - Registered as `tracer.completed` in `bootstrap/app.php`.
  - Applied to all core authenticated alumni routes (`dashboard`, `announcements`, `profile`, `updates`, `inquiries`, `association`, `office`, `about`, `contact`).
- **Enforcement Logic:**
  - If an active `Tracer Study` survey exists in the database, checks whether the logged-in alumnus has submitted a response (`$user->responses()->where('survey_id', $activeTracer->id)->exists()`).
  - If incomplete, intercepts all route navigation and redirects the alumnus to `/alumna/questionnaire?tab=tracer-study` with an alert notification.
  - Allows bypass only for necessary survey submission endpoints (`alumna.questionnaire`, `alumna.start-survey`, `alumna.surveys.*`, and `alumna.logout`).

---

### Revision 5: Featured Alumni Spotlight Module
- **Purpose:** Showcase success stories, promotions, entrepreneurial ventures, and board exam top-notchers from CECT.
- **Database Table (`featured_alumni`):**
  - Fields: `title`, `details`, `image` (JSON), `status` (`Pending`, `Approved`, `Rejected`), `revision_note`, `user_id`, timestamps.
- **Role Permissions & Workflow:**
  - **Coordinators:** Submit stories (`status = Pending`).
  - **Administrators:** Review, edit, approve, or reject with feedback notes. Admin submissions are approved immediately.
  - **Alumni Portal (`/alumna/featured-alumni`):** Grid cards displaying approved featured alumni with modal/page reading view.

---

### Revision 6: Address Architecture Standardization
- **Dual Address Selector Support:**
  - **Philippine Standard (`PhAddressSelector.jsx`):** Uses Philippine Standard Geographic Code (PSGC) hierarchical selects: Region → Province → City/Municipality → Barangay.
  - **International Selector (`InternationalAddressSelector.jsx`):** Country, State/Province, City, Postal Code for overseas graduates (OFW / international tech professionals).
- **Database Updates:**
  - Added `country` and `zip_code` columns to the `addresses` table.

---

### Revision 7: Shared Hosting & Image Optimization
- **Image Conversion Utility (`app/Helpers/ImageHelper.php`):**
  - Converts all uploaded JPG, JPEG, and PNG images into modern `.webp` format at 80% compression quality.
  - Generates transparent WebP images for PNGs.
  - Addresses InfinityFree's strict storage limits and slow transfer speeds, cutting payload sizes by up to 70%.
- **Controller Integration:**
  - Utilized in `StudentProfileController` (profile pictures), `AnnouncementController` (announcement banners), and `FeaturedAlumniController` (featured photos).

---

### Revision 8: Multi-Role Authentication & Security Hardening
- **Distinct Login Portals:**
  - Alumni: `/alumna/login`
  - Coordinator: `/coordinator/login`
  - Admin: `/portal/{ADMIN_PORTAL_PREFIX}/login` (obfuscated prefix via environment variable)
- **Email Verification (`alumna.verification.*`):**
  - Alumni accounts require verified email addresses before login is completed, ensuring valid contact channels for tracer notifications.
- **Throttling & Session Security:**
  - Rate limiting on verification email resends (`throttle:6,1`).
  - Dedicated keep-alive heartbeat endpoint (`/keep-alive`).
  - Clear session expiration modals on client side.

---

### Revision 9: 3-Month Profile Freshness Reminder System
- **Component (`resources/js/components/alumna/UpdateProfileBanner.jsx`):**
  - Checks alumnus `updated_at` timestamps on personal and employment profiles.
  - If more than 90 days have elapsed without an update, displays an attention banner on the dashboard encouraging the graduate to verify their employment status.

---

### Revision 10: Event-Driven Realtime Updates
- **Transition from Polling to Pusher Channels:**
  - Eliminated repetitive HTTP polling loops.
  - Implemented Laravel Broadcasting events for:
    - Real-time announcement publication alerts.
    - Inquiry staff replies and alumni responses.
    - Live survey response count increments on admin and coordinator dashboards.

---

### Revision 11: Dynamic Academic Structure & Admin Settings
- **Decoupled Hardcoded Academic Hierarchy:**
  - Introduced `departments` and `programs` relational tables.
  - Created Admin Settings page (`AdminSettings.jsx` & `AdminSettingsController.php`) with department-first hierarchical view.
  - When viewing or managing programs, clicking a department displays **strictly** the programs affiliated with that department.
  - Added full CRUD with real-time alumni/coordinator association counters and delete safeguards preventing orphaned records.
- **Cascading Dropdowns Across the System:**
  - **Alumni Registration (`AlumnaSignup.jsx`):** Graduate selects Department first; Program dropdown dynamically populates strictly with that department's active programs.
  - **Coordinator Form (`AdminAlumniCoordinatorForm.jsx`):** Selecting department restricts the assigned program dropdown strictly to that department.
  - **Filters (`AdminAlumniFilters`, `CoordinatorAlumniFilters`, `AdminSurveyResponseFilter`, `CoordinatorSurveyResponseFilter`):** Populated dynamically from database programs.
- **Performance Optimization:**
  - Cached active departments and programs in `HandleInertiaRequests.php` (`academic_departments_programs`) with automatic cache busting upon model updates.

---

## 3. Database Migration History Summary

| Migration Date / File | Purpose & Effect |
|:---|:---|
| `2026_08_19_create_addresses_table` | Normalized alumni addresses into dedicated relational table. |
| `2026_08_26_add_country_to_addresses` | Enabled international address tracking for overseas graduates. |
| `2026_08_26_refactor_employment_years_to_duration` | Standardized employment timeframe into duration ranges (`YYYY - YYYY` / `YYYY - Present`). |
| `2026_08_26_add_suffix_to_users_table` | Added name suffix field (`Jr.`, `III`, etc.) for alumni records. |
| `2026_09_19_create_featured_alumni_table` | Created table for spotlighting notable alumni achievements with approval states. |
| `2026_09_22_add_zip_code_to_addresses_table` | Added postal / ZIP code field to address schema. |
| `2026_10_02_add_type_to_surveys_table` | Replaced boolean `is_tracer_study` with a dynamic `type` column. |
| `2026_10_13_merge_survey_types_into_alumni_forms` | Merged legacy `Forms and Requests` and `Events` into unified `Alumni Forms`. |
| `2026_10_29_create_departments_and_programs_tables` | Created `departments` and `programs` relational tables with initial CECT baseline seeded. |

---

## 4. Route Architecture Reference

### Alumni Endpoints (`/alumna/*`)
- `/alumna/login`, `/alumna/signup`, `/alumna/verify-notice`, `/alumna/verify-email/{id}/{hash}`
- `/alumna/dashboard` (Landing dashboard; guarded by `tracer.completed`)
- `/alumna/questionnaire`, `/alumna/questionnaire/start-survey`
- `/alumna/surveys`, `/alumna/surveys/{survey}`, `/alumna/surveys/{survey}/draft`, `/alumna/surveys/{survey}/submit`
- `/alumna/profile`, `/alumna/profile/edit`
- `/alumna/updates` (GET & POST/PUT for employment tracking)
- `/alumna/featured-alumni`, `/alumna/featured-alumni/{id}`
- `/alumna/announcements`, `/alumna/announcement/{id}`
- `/alumna/inquiries`, `/alumna/inquiries/{id}`, `/alumna/inquiries/{id}/replies`
- `/alumna/association`, `/alumna/office`, `/alumna/about`, `/alumna/contact`

### Coordinator Endpoints (`/coordinator/*`)
- `/coordinator/login`, `/coordinator/change-password`
- `/coordinator/dashboard`, `/coordinator/profile`
- `/coordinator/alumni`, `/coordinator/alumni/{id}`
- `/coordinator/alumni/{id}/email`, `/coordinator/alumni/email/bulk`
- `/coordinator/announcement` (Full CRUD, submitted as `Pending`)
- `/coordinator/featured-alumni` (Full CRUD, submitted as `Pending`)
- `/coordinator/forms-and-surveys` (Survey Builder for `Alumni Forms`)
- `/coordinator/survey-response` (Response Index with survey type and status filters)
- `/coordinator/survey-response/{surveyId}/{userId}` (Completed response viewer)
- `/coordinator/survey-response/{surveyId}/{userId}/not-complete` (Incomplete response viewer)
- `/coordinator/analytics`, `/coordinator/analytics/{survey}/cect`
- `/coordinator/inquiries` (Review and reply)

### Admin Endpoints (`/{ADMIN_PORTAL_PREFIX}/*`)
- `/login`, `/forgot-password`, `/reset-password`
- `/dashboard`, `/profile`, `/profile/edit`
- `/announcement` (Full CRUD with immediate publication + approve/reject actions)
- `/featured-alumni` (Full CRUD with approve/reject actions)
- `/alumni` (Alumni Directory, profile viewer, individual and bulk emails)
- `/alumni-coordinators` (Full coordinator account management)
- `/forms-and-surveys` (Survey Builder for both `Tracer Study` and `Alumni Forms`)
- `/survey-response` (Response Index with multi-filter controls and respondent profile modal)
- `/analytics/tracer-study` (Dedicated Tracer Study analytics index)
- `/analytics/alumni-forms` (Dedicated Alumni Forms analytics index)
- `/analytics/employment-location` (Geographic alumni distribution heatmap)
- `/analytics/{survey}/download`, `/analytics/{survey}/cect/download`
- `/inquiries` (Review, status change, and replies)
- `/settings` (Manage academic departments and degree programs)

---

## 5. Verification & Testing Checklist

- [x] **Alumni Navigation:** Slide-out left drawer functions with accordion toggling on mobile and desktop viewports.
- [x] **Tracer Completion Gate:** Alumni without a submitted active tracer response are correctly redirected to the questionnaire when attempting to browse other sections.
- [x] **Employment Tracking:** Submitting changes in `/alumna/updates` successfully updates the `employments` table and adds a new record to `employment_histories`.
- [x] **Survey Creation:** Admin can create both `Tracer Study` and `Alumni Forms`; Coordinator can only create `Alumni Forms`.
- [x] **Survey Type Filter:** Admin and Coordinator response tables accurately filter between `Tracer Study` and `Alumni Forms`.
- [x] **Image Conversion:** Image uploads generate `.webp` files in the destination directory.
- [x] **Email Verification:** Unverified alumni accounts are directed to the verify notice page until verification is confirmed.
- [x] **Approval Workflows:** Coordinator announcements and featured alumni entries remain `Pending` until approved by an administrator.
- [x] **Academic Structure & Cascading:** Adding a department/program in Admin Settings immediately reflects across Alumni Signup, Coordinator assignments, and directory filters with department-scoped cascading.
