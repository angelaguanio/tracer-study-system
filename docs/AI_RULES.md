# GATE AI Rules

## Project Overview

You are assisting in the development of:

**GATE (Graduate Access and Tracking Environment)**

A web-based Alumni Tracer Study and Update Portal developed for the College of Engineering and Computer Technology (CECT), Wesleyan University-Philippines.

The objective is to develop the software system—not to conduct the tracer study itself.

---

# Technology Stack

Backend
- Laravel 12
- PHP 8.3
- MySQL / MariaDB

Frontend
- React
- Inertia.js
- Vite
- Tailwind CSS
- shadcn/ui

Services
- Pusher Channels
- Laravel Broadcasting
- Mailtrap SMTP
- Axios

Deployment
- InfinityFree
- Manual FTP deployment
- FileZilla
- Shared Hosting

---

# Project Architecture

The project uses a Laravel + React + Inertia SPA architecture.

Do NOT suggest:

- Next.js
- Vue
- Livewire
- Traditional Blade pages
- REST API architecture unless specifically requested
- GraphQL

Always preserve the current architecture.

---

# User Roles & Routing

The system has three user roles sharing a single `users` database table:

- Alumni (`alumna`)
- Coordinator (`coordinator`)
- Admin (`admin`)

Authentication Architecture:

- **Separate Login Portals:**
  - Alumni Login: `/alumna/login` (requires email verification)
  - Coordinator Login: `/coordinator/login`
  - Admin Login: `/portal/{ADMIN_PORTAL_PREFIX}/login` (obfuscated prefix via environment variable)
- **Role Redirects:**
  - Alumni → `/alumna/dashboard` (guarded by `tracer.completed` middleware)
  - Coordinator → `/coordinator/dashboard`
  - Admin → `/admin/dashboard`
- **Mandatory Tracer Study Gate:**
  - Alumni are gated by the `EnsureTracerStudyCompleted` (`tracer.completed`) middleware.
  - If an active `Tracer Study` survey exists, alumni cannot navigate to dashboard, announcements, profile, or inquiries until the tracer survey is completed.

Never suggest separate authentication databases or dismantling the single `users` table architecture.

---

# Development Philosophy

When generating code:

Prefer

- Simple
- Readable
- Maintainable
- Production-ready
- Efficient

Avoid

- Overengineering
- Unnecessary abstractions
- Complex design patterns
- Premature optimization

If a simple solution works, prefer it.

---

# Code Style

Laravel

Use

- Form Request validation whenever appropriate
- Eloquent ORM
- Route model binding
- Service classes only when logic becomes reusable
- Resource Controllers where appropriate

Avoid

- Raw SQL unless necessary
- Duplicate business logic
- Massive controllers

React

Use

- Functional Components
- Hooks
- Inertia useForm
- Reusable components
- Lucide React icons

Avoid

- Class components
- Unnecessary global state
- Deep prop drilling

Tailwind

Prefer utility classes.

Do not introduce Bootstrap or conflicting CSS frameworks.

---

# UI & Layout Rules

Maintain consistency with the existing design system.

Use

- shadcn/ui
- Existing color palette (WUP green `#008542` / `#00a651`, navy `#1e3a8a`, clean slate grays)
- Existing spacing and typography

Navigation Conventions:
- **Alumni Navigation:** Slide-out left drawer (`navbar-alumni.jsx`) with accordion submenus:
  - *Quick Actions:* Surveys & Questionnaires, Alumni Forms, Inquiries
  - *Alumni Affairs:* Announcements, Alumni Updates, About, Contact Us
- **Admin Navigation:** Submenus grouped by functional domain:
  - *General:* Dashboard, Announcements, Inquiries
  - *Survey Management:* Forms and Surveys, Survey Responses
  - *Analytics:* Tracer Study, Alumni Forms, Employment Location
- **Coordinator Navigation:** Grouped layout matching coordinator responsibilities.

Do not redesign or restructure these layouts unless requested.

---

# Database Rules

Use Laravel migrations.

Follow existing naming conventions.

Do not rename existing tables unless requested.

Preserve relationships.

Avoid breaking existing data.

---

# Validation

Always validate:

- Server-side (Form Request or Controller `$request->validate()`)

Client-side validation is optional but encouraged for responsiveness.

Never rely only on frontend validation.

---

# Error Handling

Handle

- Exceptions
- Validation errors
- Unauthorized access (HTTP 403)
- Missing records (HTTP 404)

Return meaningful responses.

Avoid exposing stack traces.

---

# Security

Always consider

- Authentication & Role Authorization
- CSRF Protection
- XSS prevention (handled by Blade / React escaping)
- SQL Injection prevention (use Eloquent / PDO bindings)
- Obfuscated administrative URL (`ADMIN_PORTAL_PREFIX`)
- Rate limiting on password resets and email verification

Never recommend insecure practices.

---

# Deployment Constraints

The project is deployed on InfinityFree.

Important limitations:

- No SSH
- No Composer on server
- No Node.js on server
- No Artisan commands
- No Queue Workers
- No Scheduler
- No Horizon
- Shared hosting
- Manual FTP deployment

Assets are built locally using

`npm run build`

and uploaded manually.

Never recommend deployment solutions that require server-side Node.js or SSH unless the user explicitly plans to migrate hosting.

---

# Storage & Image Processing Rules

InfinityFree does not support

`php artisan storage:link`

Uploaded files are stored inside a public uploads/storage directory.

**Image Optimization:**
All uploaded photos (profile pictures, announcement images, featured alumni pictures) MUST be converted and saved in `.webp` format using:

`App\Helpers\ImageHelper::convertAndSaveToWebp($file, $folder, $filename)`

This minimizes storage consumption and drastically speeds up image loading on shared hosting.

---

# Realtime Features

Realtime notifications, survey updates, and inquiry messaging use

**Pusher Channels** (Laravel Broadcasting)

Prefer

- Broadcasting events and listeners
- Real-time client listeners in React Inertia components

Avoid client-side polling loops unless Pusher is unavailable.

---

# Mail

Development: Mailtrap SMTP

Production: Configured SMTP

Do not recommend Gmail SMTP for production.

---

# Existing Modules & Separation of Concerns

The project includes:

- Multi-role Authentication & Email Verification
- Alumni Profile Management (`/alumna/profile`): strictly for personal, academic, and address data
- Alumni Updates (`/alumna/updates`): dedicated module for employment status and history tracking
- 3-Month Profile Reminder Banner (`UpdateProfileBanner.jsx`)
- Survey Management: "Tracer Study" and "Alumni Forms"
- Survey Response Analysis & Respondent Profile Viewer
- Announcement System with Admin approval workflow
- Featured Alumni Spotlight with Admin approval workflow
- Inquiries System with real-time replies
- Analytics (Tracer Study, Alumni Forms, Employment Location heatmaps)
- Coordinator Management
- Individual & Bulk Email sending

**CRITICAL RULE ON ALUMNI PROFILE VS EMPLOYMENT:**
Keep personal profile editing (`StudentProfileEdit.jsx`) and employment status editing (`AlumnaUpdates.jsx`) separate. Do not combine them back into a single form. Employment changes must automatically update or append records to `employment_histories`.

---

# Approval Workflows

### 1. Announcements
Coordinator creates Announcement → Status = Pending → Admin reviews → Approved (Published) or Rejected (Coordinator revises & resubmits). Admin announcements publish immediately.

### 2. Featured Alumni
Coordinator or Admin creates Featured Alumni → If Coordinator, Status = Pending → Admin reviews → Approved (Published) or Rejected (with revision note). Admin submissions are published immediately.

Never alter these approval pipelines unless requested.

---

# Survey Rules & Standardization

Surveys are classified strictly into two types:

1. **`Tracer Study`**
   - Exclusive to Administrators.
   - Enforced as a mandatory prerequisite for alumni via `EnsureTracerStudyCompleted` middleware.
2. **`Alumni Forms`**
   - Consolidated type for institutional surveys, feedback, and event registrations.
   - Can be created and managed by both Administrators and Coordinators.

**NEVER reintroduce the deprecated types "Forms and Requests" or "Events".**

---

# Reports & Analytics

Analytics are derived from survey response records.

Admin Analytics are categorized into:
- Tracer Study Analytics
- Alumni Forms Analytics
- Employment Location Analytics (Geographic mapping)
- CECT-specific tracer study reports and downloads

---

# Research Context

This is a BSIT Capstone Project.

The software is evaluated using ISO/IEC 25010.

Characteristics:

- Functional Suitability
- Reliability
- Performance Efficiency
- Interaction Capability
- Flexibility

Do not recommend features that contradict the research scope.

---

# Documentation

When generating documentation

Use

- Clear headings
- Proper grammar
- Academic tone when requested
- Technical tone for developer documentation

Avoid unnecessary verbosity.

---

# Code Changes

When modifying existing code

Prefer minimal changes.

Do not rewrite entire files if only a few lines need modification.

Respect existing project structure.

---

# Suggestions

When asked for recommendations

Prioritize

1. Simplicity
2. Reliability
3. Maintainability
4. Performance

Only suggest alternative implementations when the user explicitly asks for options.

---

# Communication Style

When answering:

- Be concise.
- Explain reasoning briefly.
- Do not overwhelm with unnecessary theory.
- Assume the existing project structure should be preserved.

If requirements are ambiguous, ask a clarifying question before making architectural changes.

---

# Primary Goal

Every recommendation should help maintain a stable, production-ready, and maintainable GATE system while remaining compatible with the current Laravel + React + Inertia architecture and the deployment constraints of InfinityFree.