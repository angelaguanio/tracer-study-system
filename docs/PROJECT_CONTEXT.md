
I am currently developing a capstone project entitled:

GATE (Graduate Access and Tracking Environment): A Web-Based Alumni Tracer Study and Update Portal for the College of Engineering and Computer Technology (CECT), Wesleyan University-Philippines.

Project Purpose

The system is designed to replace the college's manual and Google Forms-based alumni tracer process with a centralized web application that allows alumni to register, update their profile, answer tracer study surveys, receive announcements, send inquiries, and allows administrators to analyze graduate data.

The system focuses only on CECT graduates.

The goal is to develop the system, not to conduct the tracer study itself.

Technology Stack
Backend
Laravel 12
PHP 8.3
MySQL / MariaDB
Laravel Broadcasting

Frontend
React
Inertia.js
Vite
Tailwind CSS
shadcn/ui
Other Services
Pusher Channels (Realtime notifications)
Mailtrap SMTP (for sending emails)
Inertia React SPA architecture
Deployment

The project is currently deployed on InfinityFree.

Deployment characteristics:

Manual FTP deployment
FileZilla
Public folder deployment
Uses .htaccess
Uses a MySQL database provided by InfinityFree
Database imported manually
Environment variables configured manually
No SSH access
No Composer on server
No Node.js on server
Assets are built locally using:
npm run build

then uploaded manually.

Known InfinityFree limitations:

No storage symlink (php artisan storage:link cannot be used)
Uploaded profile pictures are stored directly under a public uploads directory instead of Laravel storage.
No cron jobs.
No Node.js.
Limited mail functionality.
Uses shared hosting.
Authentication

The system has three roles.

Alumni
Coordinator
Admin

Authentication is shared among all users.

After login:

Alumni are redirected to the Alumni dashboard.
Coordinators are redirected to the Coordinator dashboard.
Admins are redirected to the Admin dashboard.
Main Modules
Alumni
Registration
Login
Update Profile
Employment Information
Employment History
Survey Submission
View Announcements
Send Inquiry
Password Reset
Coordinator
Create Announcements
Create Surveys
View Alumni Information
Reply to Inquiries
View Reports

Coordinator announcements require Admin review before publication.

Admin
Manage Alumni
Manage Coordinators
Manage Surveys
Manage Announcements
Review Coordinator Announcements
View Reports
Send Emails
Reply to Inquiries

Admin announcements are published immediately without approval.

Only Admin can create Tracer Study Surveys.

Survey Module

Both Coordinator and Admin can create surveys.

However,

only Admin can create the official Tracer Study Survey.

Alumni:

retrieve active surveys
submit responses

Survey responses are stored and used for report generation.

Announcement Workflow

Coordinator:

Create Announcement

↓

Status = Pending

↓

Admin reviews

↓

Approved → Published

or

Rejected

↓

Coordinator revises

↓

Resubmits

Admin announcements bypass the review process and are published immediately.

Inquiry Workflow

Alumni submit inquiries.

Coordinator or Admin can:

View inquiries
Reply
Change inquiry status

Replies are stored.

Alumni can view replies.

Reports

Survey responses are processed into analytical reports.

Coordinator and Admin can:

View reports
Download reports (if enabled)

Reports are generated from survey response data.

Research Context

This project is a BSIT Capstone Project.

University:

Wesleyan University-Philippines

College:

College of Engineering and Computer Technology (CECT)

The research evaluates the developed system using ISO/IEC 25010 software quality characteristics.

The study focuses on:

Functional Suitability
Reliability
Performance Efficiency
Interaction Capability
Flexibility

The system is intended to:

improve alumni data management
centralize tracer information
improve communication between alumni and the college
support curriculum improvement through analytical reports
Current Development Status

The project is nearly feature complete.

Completed features include:

Authentication
Role-based dashboards
Alumni Profile Management
Employment History
Surveys
Announcements
Inquiry System
Coordinator Management
Report Generation
Email Sending
Password Reset
Realtime Notifications
Deployment to InfinityFree

Currently working on:

Final deployment testing
Minor UI improvements
Capstone documentation
Final bug fixing

When answering my questions, assume this is the context unless I specify otherwise. Keep recommendations consistent with this architecture, deployment environment, and research objectives.