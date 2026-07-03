# Namma AI → CBSE CT & AI Implementation Platform

Restructure the existing portal into a premium, school-ready implementation suite for Grades 3–8. This plan sets up the **architecture, routing, roles, sidebars, data model, and empty screen shells** only. No screen is fully built here — those come in the specified order in follow-up turns.

## Scope of this turn (structure only)

1. **Roles & routing skeleton** — four role experiences with role-based post-login redirect:
   - `principal` → `/principal`
   - `teacher` → `/teacher`
   - `student` → `/student`
   - `admin` (Namma AI) → `/admin`
2. **Sidebars** — one premium sidebar layout per role, using the existing brand tokens but toned down (no heavy mascots on principal/teacher/admin). Neo appears only on student surfaces, empty states, and celebrations.
3. **Route shells** — every sidebar item gets a route file with a titled placeholder ("Coming in the next build step"). This makes navigation real without pre-building content.
4. **Data layer stubs** — extend `src/lib/namma-admin.ts` with grade/week/mission/evidence/project/certificate shapes (localStorage) so later screens can plug in without refactor. Seed one demo school ("Green Valley Public School"), teachers, and students on first load.
5. **Legal guardrails** — global constants for approved phrasing ("Supports implementation of CBSE CT & AI curriculum"). No CBSE logo, no copied content.

## Sidebars (per role)

**Principal**: Dashboard · Grades · Teachers · Students · Implementation Tracker · CT & AI Progress · Projects · Evidence Portfolio · Reports · Certificates · Calendar · Settings

**Teacher**: Dashboard · My Classes · Weekly Planner · Student Completion · Workbook Tracker · Projects · Assessments · Observation Journal · Reports · Resources

**Student**: Dashboard · My Grade Journey · Weekly Tasks · Workbook Check-ins · Portal Activities · Projects · Badges · Portfolio · Certificates

**Namma AI Admin**: Schools · Grade Templates · Learning Outcomes · Activity Library · Report Templates · User Management · Analytics · Support (keeps existing Schools/Teachers/Students admin flows already built)

## Grade model

Grades 3–5 → CT only. Grades 6–8 → CT + AI + Projects. Stored as a `track` field on each grade so Phase 2 missions/QR flow can attach later.

## Phase 2 readiness (structure only, not built)

- Mission model (id, grade, week, workbookPages, portalActivitySlug, quiz, reflection, project, badge, teacherApproval, status).
- Unique completion code format: `NAI-G{grade}-M{mission}-{studentInitials}-{4digit}`.
- Activity library taxonomy (CT / AI Literacy / Reflection / Project / Gamified).
- All Phase 2 routes exist but render "Available in Namma AI Learning Pack 2027–28".

## Build order (subsequent turns, one per turn)

1. Principal dashboard
2. Teacher dashboard
3. Student completion tracker
4. Evidence portfolio
5. Reports
6. Admin panel expansion
7. Phase 2 student journey (My Grade Journey + Missions)
8. QR-linked activity flow + completion code + teacher approval

## Technical details

- **Files added**
  - `src/lib/namma-roles.ts` — role type, current-role helpers, post-login redirect map.
  - `src/lib/namma-curriculum.ts` — grade tracks, week structure, mission/activity types, seed data.
  - `src/lib/namma-legal.ts` — approved phrasing constants.
  - `src/components/namma/role-sidebar.tsx` — shared sidebar shell driven by role config.
  - `src/components/namma/role-shell.tsx` — role-scoped `AppShell` that swaps sidebar + guards role.
  - `src/routes/principal.tsx` (layout) + `principal.index.tsx` … `principal.settings.tsx` (12 shells).
  - `src/routes/teacher.tsx` becomes a layout; add `teacher.index.tsx` … `teacher.resources.tsx` (10 shells).
  - `src/routes/student.tsx` (layout) + `student.index.tsx` … `student.certificates.tsx` (9 shells).
  - `src/routes/admin.tsx` layout extended: add `admin.grade-templates.tsx`, `admin.learning-outcomes.tsx`, `admin.activity-library.tsx`, `admin.report-templates.tsx`, `admin.users.tsx`, `admin.analytics.tsx`, `admin.support.tsx`.
- **Files edited**
  - `src/routes/login.tsx` — route by role using `roleRedirect(role)`.
  - `src/routes/index.tsx` — redirect authed users to their role home.
  - `src/lib/namma-admin.ts` — add `role`, `grade_track`, seed demo school on first mount.
  - `src/components/namma/app-shell.tsx` — accept `role` prop; keep student shell as-is.
- **Placeholder shell** — each shell uses the existing `page-placeholder.tsx` component with a title, one-line description, and a "Coming in the next build step" note. Zero business logic.
- **No design tokens change.** Reuse existing gradients, radii, shadows. Sidebars for principal/teacher/admin drop mascot avatars and use a tighter, whiter surface for the "premium ERP" feel; student sidebar keeps Neo.
- **No backend.** Everything remains localStorage-backed. Data shapes match Supabase-ready tables for a later migration.

Confirm this plan and I'll implement the structure in the next turn, then move to the Principal dashboard as step 1 of the build order.
