# StudyForge UX Roadmap

This roadmap turns broad UX feedback into a delivery-friendly plan for the current product. It is based on the existing flows in the landing page, signup, dashboard, upload flow, document generation, notes, MCQ practice, and settings.

## Goals

- Reduce time-to-value for new users
- Make next steps obvious after each action
- Improve continuity between upload, generation, and practice
- Increase trust in AI outputs
- Make the product feel more personal and progress-aware

## Quick Wins

These are high-impact, low-to-medium effort improvements we can ship first.

### 1. First-run onboarding checklist

**Why**

New users are promised a fast start, but the product does not yet guide them through the first successful study loop.

**What to add**

- A dashboard checklist for first-time users
- Suggested sequence: `Upload first file -> Generate notes -> Practice MCQs`
- Progress indicators with completion states
- A dismiss option after the first successful loop

**Likely touchpoints**

- `app/dashboard/page.tsx`
- `components/dashboard/quick-actions.tsx`

**Success signal**

- More new users complete upload + generation in their first session

### 2. Smarter dashboard recommendations

**Why**

The current recommendation card is static. It should adapt to where the user is in their study journey.

**What to add**

- Dynamic recommendation cards based on usage state
- Examples:
  - No uploads: upload first file
  - Uploaded document but no outputs: generate notes
  - Notes created but no MCQs: create MCQs
  - Existing MCQs: resume last practice session
  - Upcoming exam date: create revision roadmap

**Likely touchpoints**

- `app/dashboard/page.tsx`
- `lib/plan-enforcement.ts` if usage helpers are reusable

**Success signal**

- Higher click-through rate on primary dashboard CTA

### 3. Better upload handoff

**Why**

The upload flow looks polished, but the user still has to decide what to do next after processing completes.

**What to add**

- Ask intended outcome before upload:
  - Notes
  - MCQs
  - Viva
  - Revision pack
- Auto-highlight the next best action after upload finishes
- Add one-click presets such as `Revision pack`

**Likely touchpoints**

- `app/dashboard/upload/page.tsx`
- `components/upload/upload-metadata.tsx`
- `components/upload/processing-queue.tsx`

**Success signal**

- More uploaded documents convert into generated outputs

### 4. Empty states that teach

**Why**

Current empty states are clean, but they can do more to help users understand what content to create next.

**What to add**

- Example-driven copy
- Suggested actions based on page context
- Small hints like:
  - Upload lecture slides for faster summaries
  - Use concise notes for last-minute revision
  - Generate MCQs after notes to test retention

**Likely touchpoints**

- `components/shared/empty-state.tsx`
- Feature pages with low-content states

**Success signal**

- More users recover from empty pages instead of bouncing

### 5. Fix visible text quality issues

**Why**

Encoding glitches damage trust quickly, especially in auth and study flows.

**What to fix**

- Replace broken characters such as `â€¢` and `â€”`
- Review copy for clarity and consistency

**Likely touchpoints**

- `app/auth/signup/page.tsx`
- `components/mcqs/practice-interface.tsx`

**Success signal**

- Cleaner perceived quality in first-run and practice experiences

## Medium-Term Improvements

These require more product thinking and some data/model coordination, but they are strong UX upgrades.

### 6. Turn each document into a guided study journey

**Why**

Generated outputs are grouped well, but they still behave like separate destinations instead of a connected workflow.

**What to add**

- A study journey module on the document page
- Step-based progression:
  - Read notes
  - Practice MCQs
  - Review viva questions
  - Build revision roadmap
- Contextual next-step prompts after each completed action

**Likely touchpoints**

- `app/dashboard/documents/[id]/page.tsx`
- `components/documents/document-actions.tsx`
- `components/documents/generated-content.tsx`

**Success signal**

- More multi-output usage per uploaded document

### 7. Save and resume MCQ sessions

**Why**

MCQ practice feels good, but session continuity matters a lot for students switching devices or revising in short bursts.

**What to add**

- Persist in-progress quiz state
- Resume prompt when reopening an MCQ set
- Keep marked questions and elapsed time
- Optional end-of-session weak-topic summary

**Likely touchpoints**

- `components/mcqs/practice-interface.tsx`
- MCQ detail and results flows
- API/storage layer for session persistence

**Success signal**

- Higher MCQ completion rate

### 8. Cross-content organization improvements

**Why**

Students think in subjects, exams, deadlines, and weak areas, not only in content types.

**What to add**

- Shared tags for subject and exam
- Better filters like:
  - Recent
  - Upcoming exam
  - Weak topics
  - Most practiced
- Optional unified search across documents, notes, MCQs, viva, and papers

**Likely touchpoints**

- `app/dashboard/notes/page.tsx`
- other content listing pages
- shared filter/search components

**Success signal**

- Faster retrieval of past study assets

### 9. Improve AI trust and transparency

**Why**

Users need clearer guidance on what Fast vs Full means and how much source coverage an output has.

**What to add**

- Estimated generation time
- Coverage hints like `Built from 8 sections`
- Better explanations for Fast and Full modes
- Optional warnings for low-text or low-quality uploads

**Likely touchpoints**

- `components/documents/document-actions.tsx`
- generation result toasts and metadata panels

**Success signal**

- Better confidence in generated outputs and fewer repeated retries

## Bigger Differentiators

These are larger bets that can make the product feel meaningfully better than generic AI study tools.

### 10. Personalized study momentum layer

**Why**

The dashboard already shows usage, but it can become a real study coach instead of a stats page.

**What to add**

- Weekly goals
- Streaks tied to meaningful actions, not vanity clicks
- Suggested tasks based on unfinished assets
- Smart reminders like:
  - You created notes but never practiced them
  - Your exam is close; create a roadmap now

**Likely touchpoints**

- `app/dashboard/page.tsx`
- `components/dashboard/stats.tsx`
- `components/dashboard/recent-activity.tsx`

**Success signal**

- Better return usage and more consistent study behavior

### 11. Revision pack workflow

**Why**

Students often want a full prep bundle, not one isolated output at a time.

**What to add**

- Single action: `Create revision pack`
- Generates:
  - concise notes
  - MCQs
  - viva questions
  - optional exam paper
- Unified completion screen with all outputs grouped

**Likely touchpoints**

- upload flow
- document generation flow
- background processing orchestration

**Success signal**

- Higher perceived product value from each upload

### 12. Exam-date-driven planning

**Why**

If users give an exam date, the app should help them prioritize what to study and when.

**What to add**

- Date-aware recommendations
- Time-left framing such as `12 days left`
- Suggested sequence:
  - notes first
  - then MCQs
  - then exam paper
- Revision roadmap connected to actual generated assets

**Likely touchpoints**

- upload metadata
- revision roadmap flow
- dashboard recommendation system

**Success signal**

- Stronger roadmap usage and better user retention near exam periods

## Suggested Delivery Order

### Phase 1

- First-run onboarding checklist
- Smarter dashboard recommendations
- Better upload handoff
- Empty state improvements
- Text quality fixes

### Phase 2

- Guided study journey on document pages
- Save/resume MCQ sessions
- Cross-content organization improvements
- AI trust and transparency improvements

### Phase 3

- Personalized study momentum layer
- Revision pack workflow
- Exam-date-driven planning

## Recommended Next Build

If we want the best mix of speed and impact, start here:

1. Add a first-run checklist on the dashboard
2. Make the dashboard recommendation card dynamic
3. Add `intent` selection to upload and a `Revision pack` preset
4. Fix the visible text encoding issues

That sequence should noticeably improve first-session clarity without requiring a large architecture change.
