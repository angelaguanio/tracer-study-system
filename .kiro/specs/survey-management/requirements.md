# Requirements Document

## Introduction

The Survey Management feature enables coordinators to create, manage, and analyze structured surveys for alumni tracking. Surveys are organized into **Sections**, and all Questions belong to a Section. Coordinators have full CRUD control over surveys, sections, and questions. Alumni (authenticated via the Student/User model) can view and submit responses to active surveys. Response data is structured to support aggregation and visualization through charts, including filtering and grouping by section.

The existing `survey_categories`, `survey_submissions`, and `survey_answers` tables — along with the hardcoded `questions.json` file — are being **dropped and replaced entirely** with a new, clean database structure consisting of four tables: `surveys`, `sections`, `questions`, and `responses`. This replaces the static JSON-driven approach with a fully dynamic, database-driven survey management system where sections are a first-class structural concept.

**New table structure:**
- `surveys` — id, title, description, status, timestamps, soft deletes
- `sections` — id, survey_id (FK), title, display_order, timestamps
- `questions` — id, section_id (FK), question_identifier (unique slug), label, type, options (JSON), display_order, is_required, timestamps
- `responses` — id, survey_id (FK), user_id (FK), question_id (FK), answer_value, submitted_at, timestamps
- `survey_drafts` — id, user_id (FK), survey_id (FK), answers (JSON), last_section_id (FK → sections), updated_at

## Glossary

- **Coordinator**: An authenticated admin user who manages surveys and views analytics (stored in `users` table as `user_role === 'coordinator'`)
- **Alumni**: An authenticated user who responds to surveys (stored in `users` table as `user_role === 'alumna'`; the role value is `alumna`, not `alumni` or `student`)
- **Survey**: A named container of ordered Sections created by a Coordinator (maps to `surveys` table)
- **Section**: A named, ordered group within a Survey that organizes related Questions (maps to `sections` table)
- **Question**: A structured item that belongs to exactly one Section, with a defined type and options (maps to `questions` table)
- **Question_Type**: The input type of a Question — one of: `text`, `select`, `radio`, `checkbox`, `number`, `textarea`
- **Response**: A single answer submitted by an Alumni for one Question within a Survey (maps to `responses` table)
- **Survey_Manager**: The Laravel backend system responsible for survey CRUD and response storage
- **Analytics_Engine**: The backend component that aggregates Response data for chart output
- **Survey_Form**: The React/Inertia frontend component that renders a Survey for Alumni
- **Survey_Draft**: A temporary server-side record storing an Alumni's in-progress answers for a Survey, keyed by user_id and survey_id

---

## Requirements

### Requirement 1: Survey CRUD for Coordinators

**User Story:** As a coordinator, I want to create, read, update, and delete surveys, so that I can manage the surveys available to alumni.

#### Acceptance Criteria

1. THE Survey_Manager SHALL provide a list of all surveys to the Coordinator, including each survey's title, status (active/inactive), creation date, and section count.
2. WHEN a Coordinator submits a valid new survey form, THE Survey_Manager SHALL persist the survey to the `surveys` table with a title, optional description, and a status of `inactive` by default.
3. WHEN a Coordinator submits an update to an existing survey, THE Survey_Manager SHALL update the survey's title, description, or status and return the updated record.
4. WHEN a Coordinator requests deletion of a survey, THE Survey_Manager SHALL soft-delete the survey record in the `surveys` table and cascade-deactivate all associated Section and Question records.
5. IF a Coordinator submits a survey form with a missing or empty title, THEN THE Survey_Manager SHALL return a validation error identifying the title field.
6. WHILE a survey has one or more Response records, THE Survey_Manager SHALL prevent hard deletion and return an error message indicating the survey has responses.

---

### Requirement 2: Section Management

**User Story:** As a coordinator, I want to add, rename, reorder, and delete sections within a survey, so that I can organize survey questions into meaningful groups.

#### Acceptance Criteria

1. WHEN a Coordinator adds a section to a survey, THE Survey_Manager SHALL persist a record to the `sections` table with a title, the parent `survey_id`, and a display order appended after the last existing section.
2. WHEN a Coordinator renames a section, THE Survey_Manager SHALL update the Section title in the `sections` table while preserving all Questions and Response records linked to that section.
3. WHEN a Coordinator reorders sections within a survey, THE Survey_Manager SHALL update the `display_order` of all affected Section records atomically.
4. WHEN a Coordinator deletes a section that contains no Questions, THE Survey_Manager SHALL remove the Section record from the `sections` table and resequence the `display_order` of remaining sections.
5. IF a Coordinator attempts to delete a section that contains one or more Questions, THEN THE Survey_Manager SHALL return a validation error requiring the Coordinator to remove or reassign all Questions before deletion.
6. IF a Coordinator submits a section with a duplicate title within the same survey, THEN THE Survey_Manager SHALL return a validation error indicating the section title must be unique within the survey.
7. THE Survey_Manager SHALL enforce that every Survey has at least one Section before the survey can be set to `active` status.

---

### Requirement 3: Question Management

**User Story:** As a coordinator, I want to manage questions within a section, so that I can structure each section for meaningful data collection.

#### Acceptance Criteria

1. WHEN a Coordinator adds a Question to a Section, THE Survey_Manager SHALL persist the question to the `questions` table with a label, Question_Type, `display_order`, `is_required` flag, optional `options` (JSON), and the parent `section_id`.
2. WHEN a Coordinator updates a Question's label or type, THE Survey_Manager SHALL update the record and preserve all existing Response records linked to that question.
3. WHEN a Coordinator reorders questions within a Section, THE Survey_Manager SHALL update the `display_order` of all affected questions atomically.
4. WHEN a Coordinator moves a Question from one Section to another, THE Survey_Manager SHALL update the Question's `section_id` reference and resequence `display_order` in both the source and destination sections.
5. IF a Coordinator submits a Question with a Question_Type of `select`, `radio`, or `checkbox` and provides no answer options, THEN THE Survey_Manager SHALL return a validation error requiring at least one option.
6. IF a Coordinator submits a Question with a duplicate label within the same Section, THEN THE Survey_Manager SHALL return a validation error indicating the label must be unique within the section.
7. THE Survey_Manager SHALL enforce that each Question has a unique `question_identifier` slug derived from its label, scoped to the parent Survey.
8. THE Survey_Manager SHALL reject any request to create a Question that is not associated with a Section.

---

### Requirement 4: Survey Activation and Visibility

**User Story:** As a coordinator, I want to activate or deactivate surveys, so that I can control which surveys are visible to alumni.

#### Acceptance Criteria

1. WHEN a Coordinator sets a survey's status to `active`, THE Survey_Manager SHALL make the survey visible to all authenticated Alumni.
2. WHEN a Coordinator sets a survey's status to `inactive`, THE Survey_Manager SHALL hide the survey from the Alumni survey list.
3. WHILE a survey status is `inactive`, THE Survey_Form SHALL NOT render the survey for Alumni.
4. IF a Coordinator attempts to activate a survey that has no Section records, THEN THE Survey_Manager SHALL return a validation error indicating the survey must have at least one section before activation.

---

### Requirement 5: Alumni Survey Submission

**User Story:** As an alumna, I want to view and submit responses to active surveys one section at a time, so that I can provide information to the institution without losing progress.

#### Acceptance Criteria

1. THE Survey_Form SHALL display only surveys with an `active` status to authenticated users with `user_role === 'alumna'`.
2. WHEN an alumna opens an active survey, THE Survey_Form SHALL render one Section per step in ascending `display_order`, displaying only the current section's Questions at a time.
3. THE Survey_Form SHALL display a progress indicator at the top of the survey in the format "Step N of T", where N is the current section's position and T is the total number of sections.
4. THE Survey_Form SHALL visually distinguish the current section with the Section title as a heading, so that the alumna can identify which group of questions they are answering.
5. WHEN an alumna clicks "Next" on any section that is not the final section, THE Survey_Manager SHALL save the alumna's answers for that section as a Survey_Draft record in the `survey_drafts` table, then THE Survey_Form SHALL advance to the next section.
6. WHEN an alumna returns to a survey with an existing Survey_Draft, THE Survey_Form SHALL resume the survey at the section identified by `last_section_id` in the Survey_Draft, pre-populating previously answered fields from the stored `answers` JSON.
7. WHEN an alumna reaches the final section, THE Survey_Form SHALL display a "Submit" button in place of the "Next" button.
8. WHEN an alumna clicks "Submit" on the final section, THE Survey_Manager SHALL promote all answers from the Survey_Draft into individual Response records in the `responses` table, each linked by `survey_id`, `user_id`, `question_id`, and `answer_value` with `submitted_at` set to the current timestamp, then delete the Survey_Draft record.
9. IF an alumna submits a section with a missing answer to a Question where `is_required` is true, THEN THE Survey_Manager SHALL return a validation error identifying the unanswered required field before saving the draft or advancing to the next section.
10. WHILE an alumna has existing Response records for a survey, THE Survey_Form SHALL display the survey as already completed and SHALL NOT allow resubmission.
11. IF an unauthenticated user attempts to access a survey, THEN THE Survey_Manager SHALL redirect the user to the alumna login page.

---

### Requirement 6: Survey Response Analytics

**User Story:** As a coordinator, I want to view aggregated survey response data as charts filterable by section, so that I can analyze alumni trends and outcomes at both the survey and section level.

#### Acceptance Criteria

1. WHEN a Coordinator views the analytics page for a survey, THE Analytics_Engine SHALL return aggregated response counts from the `responses` table grouped by `question_id` and `answer_value` for all `select`, `radio`, and `checkbox` question types.
2. THE Analytics_Engine SHALL return the total number of unique `user_id` values in the `responses` table for a given survey.
3. WHEN a Coordinator filters analytics by a Section, THE Analytics_Engine SHALL return aggregated response data scoped to Questions belonging to that Section only.
4. WHEN a Coordinator views the analytics overview for a survey, THE Analytics_Engine SHALL return a per-section summary showing the section title and the count of responses received for questions within that section.
5. WHEN a Coordinator filters analytics by a date range, THE Analytics_Engine SHALL return aggregated data scoped to Response records with a `submitted_at` value within the specified range.
6. THE Analytics_Engine SHALL return response data in a format consumable by a frontend charting library (array of `{ label, value }` objects per question), with each entry including the `section_id` and section title for grouping purposes.
7. IF a survey has zero Response records, THEN THE Analytics_Engine SHALL return an empty dataset with a zero total count rather than an error.
8. THE Analytics_Engine SHALL exclude `text` and `textarea` question types from aggregated chart data, as free-text answers are not aggregatable.

---

### Requirement 7: Access Control

**User Story:** As a system administrator, I want role-based access enforced on all survey routes, so that alumni cannot modify surveys and coordinators cannot be impersonated.

#### Acceptance Criteria

1. WHEN an Alumni attempts to access any Coordinator survey management route, THE Survey_Manager SHALL return a 403 Forbidden response.
2. WHEN a Coordinator attempts to access the Alumni survey submission route, THE Survey_Manager SHALL return a 403 Forbidden response.
3. THE Survey_Manager SHALL use Laravel middleware to enforce role checks on all survey-related routes, where the alumna role is identified by `user_role === 'alumna'` and the coordinator role is identified by `user_role === 'coordinator'`. The `User` model provides `isAlumna()` and `isCoordinator()` helper methods that encapsulate these checks and SHOULD be used in middleware and controllers.
4. IF an unauthenticated request is made to any survey route, THEN THE Survey_Manager SHALL redirect the request to the appropriate login page based on the route guard.

---

### Requirement 8: Survey Draft Persistence

**User Story:** As an alumni, I want my in-progress survey answers saved automatically as I navigate between sections, so that I do not lose my work if I exit and return later.

#### Acceptance Criteria

1. WHEN an Alumni clicks "Next" on any section, THE Survey_Manager SHALL upsert a Survey_Draft record in the `survey_drafts` table keyed by `user_id` and `survey_id`, storing all current answers in the `answers` JSON column and setting `last_section_id` to the section just completed.
2. THE Survey_Manager SHALL update the `updated_at` timestamp on the Survey_Draft record each time a draft save occurs.
3. WHEN an Alumni opens a survey for which a Survey_Draft record exists, THE Survey_Form SHALL load the stored `answers` from the draft and navigate directly to the section identified by `last_section_id`.
4. IF a Survey_Draft record does not exist for the Alumni and survey combination, THEN THE Survey_Form SHALL start the survey at the first section with no pre-populated answers.
5. WHEN an Alumni successfully submits the final section, THE Survey_Manager SHALL delete the Survey_Draft record for that `user_id` and `survey_id` after all Response records have been persisted.
6. IF the draft promotion to Response records fails, THEN THE Survey_Manager SHALL preserve the Survey_Draft record and return an error, so that the Alumni's answers are not lost.
7. THE Survey_Manager SHALL enforce that only one Survey_Draft record exists per `user_id` and `survey_id` combination, using a unique constraint on those two columns.
