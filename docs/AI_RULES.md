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

# User Roles

The system has three user roles:

- Alumni
- Coordinator
- Admin

Authentication is shared among all users.

Redirects:

Alumni
→ Alumni Dashboard

Coordinator
→ Coordinator Dashboard

Admin
→ Admin Dashboard

Never suggest separate authentication systems.

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

Avoid

- Class components
- Unnecessary state
- Deep prop drilling

Tailwind

Prefer utility classes.

Do not introduce Bootstrap.

---

# UI Design Rules

Maintain consistency with the existing UI.

Use

- shadcn/ui
- Existing color palette
- Existing spacing
- Existing typography

Do not redesign pages unless requested.

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

- Server-side

Client-side validation is optional but encouraged.

Never rely only on frontend validation.

---

# Error Handling

Handle

- Exceptions
- Validation errors
- Unauthorized access
- Missing records

Return meaningful responses.

Avoid exposing stack traces.

---

# Security

Always consider

- Authentication
- Authorization
- CSRF
- XSS
- SQL Injection
- Validation

Never recommend insecure practices.

---

# Deployment Constraints

The project is deployed on InfinityFree.

Important limitations:

- No SSH
- No Composer
- No Node.js
- No Artisan commands
- No Queue Workers
- No Scheduler
- No Horizon
- Shared hosting
- Manual FTP deployment

Assets are built locally using

npm run build

and uploaded manually.

Never recommend deployment solutions that require server-side Node.js or SSH unless the user explicitly plans to migrate hosting.

---

# Storage Rules

InfinityFree does not support

php artisan storage:link

Uploaded files are stored directly inside a public uploads directory.

Always respect this implementation.

---

# Realtime Features

Realtime notifications use

Pusher Channels

Prefer

- Broadcasting
- Events
- Listeners

Avoid polling unless specifically requested.

---

# Mail

Development

Mailtrap

Production

SMTP

Do not recommend Gmail SMTP for production.

---

# Existing Modules

The project already includes:

- Authentication
- Alumni Management
- Employment Information
- Employment History
- Survey Management
- Announcement System
- Inquiry System
- Reports
- Notifications
- Coordinator Management
- Email Sending
- Password Reset

Do not recreate modules that already exist.

Extend them instead.

---

# Announcement Workflow

Coordinator

Create Announcement

↓

Pending

↓

Admin Review

↓

Approved

↓

Published

or

Rejected

↓

Coordinator Revises

↓

Resubmits

Admin announcements bypass approval.

Never change this workflow unless requested.

---

# Survey Rules

Only Admin can create official Tracer Study Surveys.

Coordinator-created surveys are separate from official tracer surveys.

Do not change this behavior.

---

# Reports

Reports are generated from survey responses.

Maintain this relationship.

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