# Namma AI → CT & AI Implementation Command Centre (Phase 1)

Reposition the existing portal into a premium, implementation-focused command centre for CBSE schools running CT & AI for Grades 3–8. Preserve the routing shell, role system, and demo-seed infrastructure that already exist. Replace curriculum/learning surfaces with implementation, evidence, and reporting surfaces.

## Scope guardrails

- **Do NOT rebuild from scratch.** Keep `AppShell`, role sidebars, auth, demo seed, and routing.
- **Phase 1 only.** No lessons, games, module unlocks, curriculum content. Student area is status-only.
- **Legal.** Only approved phrasing (already in `namma-legal.ts`). No CBSE marks, no copied workbook text.
- **Design.** Premium/clean/school-ERP feel. Neo only in student empty states. Status colors: green/yellow/red/blue/grey.

## Work plan (executed across this + follow-up turns)

### 1. Data foundation (this turn)
Rewrite `src/lib/namma-demo.ts` to seed the full Namma Vidya Public School dataset described in the brief:
- 1 school, principal + academic coordinator, 14 teachers, 384 students (Grades 3–8, sections A/B, 32/section) with realistic Indian names.
- Grade-level metrics (implementation %, workbook %, projects %, evidence %, risk, weekly trend).
- School summary (health 76, evidence 74%, students on-track 287, needs-attention 72, delayed 25, etc.).
- 60+ observation entries, 40+ project entries with rubric scores, 1482 evidence-item counters, 96 certificate-eligible students.
- Weekly completion trend (weeks 1–9), competency coverage %, evidence-by-type breakdown.
- Smart alerts + recommended actions arrays.

Add `src/lib/namma-implementation.ts` — typed selectors over the seed (grade summary, teacher rows, student rows, competency data, timeline, alerts).

### 2. Principal Command Centre (this turn)
Rewrite `src/routes/principal.index.tsx` as the flagship screen:
- Hero row: Implementation Health, Evidence Readiness, Students On Track, Teacher Updates, Project Backlog, Certificates.
- Health Score Breakdown card (7 components summing to 76).
- Grade Overview cards (3–8), clickable → grade drill-down.
- Smart Insights list.
- Recommended Next Actions.
- Charts: grade bars, weekly trend line, competency horizontal bars, evidence donut (Recharts).

### 3. Grade drill-down (this turn)
New `src/routes/principal.grades.$grade.tsx` with section A/B comparison, teacher card, insights, recommended actions.
Rewrite `src/routes/principal.grades.tsx` as a grade-grid index.

### 4. Teacher & Student surfaces (this turn)
- Rewrite `src/routes/teacher.index.tsx` as "Weekly Workspace" (Ms. Ritu Malhotra / Grade 6A) with pending-task cards, quick-update panel trigger, 32-row student completion table.
- Rewrite `src/routes/index.tsx` (student home) as status-only Progress Profile with completion %, pending items, teacher feedback, certificate status.

### 5. Follow-up turns (queued)
Turn B: Workbook Tracker, Project Review Centre, Competency Analytics, Observation Journal.
Turn C: Evidence Portfolio (school/class/student), Reports Centre with printable previews, Certificate Centre, Implementation Calendar heatmaps.
Turn D: Academic Coordinator role + sidebar, Admin panel refresh, smart-alert engine polish, filters/search across tables.

### 6. Cleanup
Hide legacy learning entries from student sidebar (Portal Activities, Grade Journey mission pages) — keep files but remove from `STUDENT_NAV` in `namma-roles.ts` so they don't appear in Phase 1. Keep verify/QR flow available under Teacher.

## Technical notes

- All data localStorage-backed via existing `namma-demo` seed; idempotent re-seed with a bumped `SEED_VERSION` so this turn's richer data replaces prior seed.
- Charts via existing `recharts` (already in `src/components/ui/chart.tsx`).
- New shared components under `src/components/namma/command/`: `StatCard`, `InsightCard`, `GradeCard`, `SectionCompare`, `ActionList`, `MiniHeatmap`.
- Add a `roleRedirect` update so coordinator role can slot in later without refactor.
- No backend, no new packages.

## This turn's deliverables

1. Rewritten `src/lib/namma-demo.ts` (full dataset + version bump).
2. New `src/lib/namma-implementation.ts` (selectors).
3. New `src/components/namma/command/*` primitives.
4. Rewritten `src/routes/principal.index.tsx` (Command Centre).
5. New `src/routes/principal.grades.$grade.tsx` + rewritten `src/routes/principal.grades.tsx`.
6. Rewritten `src/routes/teacher.index.tsx` (Weekly Workspace + student table).
7. Rewritten `src/routes/index.tsx` (student status view).
8. Trim `STUDENT_NAV` in `src/lib/namma-roles.ts`.

Reply "go" and I'll implement turn 1. Follow-up turns unlock the remaining screens in the order listed.
