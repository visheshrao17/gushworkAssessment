# CallTrack — Daily Follow-Up Board for a Repair Business

A dead-simple job tracker that answers one question every morning: "Who do I need to call today?"
Built for the owner of a small commercial refrigeration repair company who loses jobs because leads are scattered across phone, email, texts, and a notebook.

## Who it's for
Denise, the owner-operator from the call transcript in the task PDF. She runs a walk-in cooler / freezer / ice machine repair company with four field techs and a part-time bookkeeper (her husband). She handles ~15–20 new requests a week plus repeat customers. She is not technical and does not want anything fancy — she wants to stop dropping the ball on follow-ups.

## Core features and experience
Phase 1 (what gets built now):

- **"Call Today" morning view** — the home screen. A single prioritized list of exactly who needs attention right now, grouped into three buckets:
  - Waiting on a quote from us
  - Said yes, needs scheduling
  - Gone quiet (no contact in 2+ days)
  Each item shows the customer, what the job is, how long they've been waiting, and a one-tap way to mark it handled.

- **Add a job in seconds** — a quick form to capture a new request: customer name, phone, what's broken, where it came from (phone / website / text / referral), and a note. Fast enough to use while on another call.

- **Paste-to-capture (AI)** — paste a raw message (a forwarded website-form email, a text from a customer, or a scribbled call note) into one box, and the app auto-fills the new-job form — pulling out the customer name, phone, and the problem — so Denise isn't retyping. She reviews and saves.

- **Simple pipeline** — every job moves through clear stages: New → Quoted → Approved → Scheduled → Done (plus a "Lost" option). Moving a job is one tap. The current stage drives whether it shows up in "Call Today."

- **All jobs view** — a filterable list of every job and its stage, so Denise can finally answer "how many open jobs do we have?" when her husband asks. Includes a small count summary (open, waiting on quote, scheduled, etc.).

- **Follow-up tracking** — each job remembers the last time it was touched. Logging a call/text updates that timestamp, which is what powers the "gone quiet" bucket.

## User flow
1. Denise opens the app in the morning and lands on **Call Today**.
2. She works top-down: calls the people waiting on quotes, confirms the ones who said yes, chases the ones who've gone quiet. After each, she logs the contact or advances the stage.
3. A new request comes in during the day → she either types it into the quick form or pastes the raw message and lets it auto-fill → saves it as a New job.
4. As jobs progress she taps them forward through the pipeline (quote sent, customer approved, tech scheduled, done).
5. Any time, she opens **All Jobs** to see the full picture and counts.

## UI/UX feel
Calm, high-contrast, and genuinely usable on a phone while standing in a noisy kitchen or truck. Big tap targets, minimal typing, one clear action per row. The morning view reads like a to-do checklist, not a CRM. Stages are color-coded so status is obvious at a glance. No jargon, no clutter, nothing that needs training to understand.

## Implementation phases
**Phase 1 — MVP (built now):** Call Today morning view, add-a-job quick form, paste-to-capture AI auto-fill, the five-stage pipeline with one-tap advance, All Jobs list with counts, and last-contact tracking that powers the "gone quiet" bucket.

**Phase 2:** Multiple user accounts / login so the data is private and persistent per owner; dollar value per job and a simple "pipeline value" and won/lost summary for the bookkeeper; reminders/notifications for jobs about to go quiet; quick-log templates (e.g., "left voicemail").

**Phase 3:** Tech assignment and a light schedule view; inbound capture automation (forward website-form emails / texts straight into the board without pasting); customer history for repeat clients; basic reporting (jobs won per week, average time-to-quote).

## Assumptions
- The intent behind "can you understand this pdf" is to actually build the prototype the task asks for, not just summarize it.
- Single-user prototype with no login in Phase 1 — Denise is the only user. Accounts are deferred to Phase 2.
- Data is stored in the app's database and seeded with a handful of realistic example jobs (drawn from the transcript, e.g. the Friday restaurant freezer) so the morning view is populated on first open.
- "Gone quiet" is defined as no logged contact for 2+ days, matching Denise's own wording.
- The AI paste-to-capture uses a default hosted model (no API key required from the user). It only parses text into fields; it does not read live email/text inboxes in Phase 1.
- Scheduling, tech locations, and tech schedules are explicitly out of scope for Phase 1 — Denise said those are "nice later," and the leads/follow-ups are the real problem.
- Scope covers the volume described (~15–20 new jobs/week); no bulk import or high-volume tooling needed.
- The other files in the shared folder (task.md, plan.md, DOCUMENTATION.md) are treated as reference/sample material; the build follows the PDF's requirements and the customer's stated needs directly.
