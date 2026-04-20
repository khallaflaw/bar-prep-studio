import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard, BookOpen, StickyNote, FlaskConical, ListChecks, BarChart3,
  Flame, Target, Repeat, CheckCircle2, Circle, ChevronRight, GraduationCap,
  AlertTriangle, TrendingUp, Clock, CircleDot, Sparkles, ArrowLeft,
  ScrollText, Brain, FileText, Inbox, Layers, Search,
  Edit3, Save, X, Wand2, GitBranch, Star, AlertOctagon, Info,
  Plus, Trash2, RefreshCw, ChevronLeft, Eye, Lightbulb,
  Zap, BookmarkPlus, Table2, Workflow, ShieldAlert, Library, Shuffle,
  FileInput, FileCog,
  CalendarDays, Timer, PlayCircle, Pause, SkipForward, ClipboardList,
  Activity, PieChart, Hash, Rocket,
  UserPlus, LogIn, LogOut, User, Lock, Mail, Shield, UserCircle
} from 'lucide-react';

/* =========================================================================
   STORAGE
   ========================================================================= */
const memStore = {};
const storage = {
  async get(key, fallback) {
    try {
      if (typeof window !== 'undefined' && window.storage && window.storage.get) {
        const res = await window.storage.get(key);
        if (res && res.value != null) return JSON.parse(res.value);
      }
    } catch (e) { /* ignore */ }
    return memStore[key] !== undefined ? memStore[key] : fallback;
  },
  async set(key, value) {
    memStore[key] = value;
    try {
      if (typeof window !== 'undefined' && window.storage && window.storage.set) {
        await window.storage.set(key, JSON.stringify(value));
      }
    } catch (e) { /* ignore */ }
  }
};

/* =========================================================================
   CONSTANTS
   ========================================================================= */
const SUBJECTS = [
  { id: 'contracts', name: 'Contracts', short: 'K', color: 'bg-blue-100 text-blue-700 border-blue-200', accuracy: 72, started: true, progress: 65, status: 'In progress' },
  { id: 'evidence', name: 'Evidence', short: 'EV', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', accuracy: 58, started: true, progress: 42, status: 'In progress' },
  { id: 'torts', name: 'Torts', short: 'T', color: 'bg-rose-100 text-rose-700 border-rose-200', accuracy: 81, started: true, progress: 78, status: 'Ready' },
  { id: 'con_law', name: 'Constitutional Law', short: 'CON', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', accuracy: null, started: false, progress: 0, status: 'Not started' },
  { id: 'crim_law', name: 'Criminal Law', short: 'CR', color: 'bg-amber-100 text-amber-700 border-amber-200', accuracy: 65, started: true, progress: 48, status: 'In progress' },
  { id: 'crim_pro', name: 'Criminal Procedure', short: 'CP', color: 'bg-orange-100 text-orange-700 border-orange-200', accuracy: null, started: false, progress: 0, status: 'Not started' },
  { id: 'real_property', name: 'Real Property', short: 'RP', color: 'bg-teal-100 text-teal-700 border-teal-200', accuracy: 49, started: true, progress: 31, status: 'In progress' },
  { id: 'civ_pro', name: 'Civil Procedure', short: 'CIV', color: 'bg-violet-100 text-violet-700 border-violet-200', accuracy: 68, started: true, progress: 55, status: 'In progress' },
  { id: 'biz_assoc', name: 'Business Associations', short: 'BA', color: 'bg-slate-100 text-slate-700 border-slate-200', accuracy: null, started: false, progress: 0, status: 'Not started' },
  { id: 'mpt', name: 'MPT', short: 'MPT', color: 'bg-pink-100 text-pink-700 border-pink-200', accuracy: null, started: false, progress: 0, status: 'Coming soon', disabled: true }
];

const TOPICS = {
  contracts: ['Formation', 'Defenses to Formation', 'Statute of Frauds', 'Parol Evidence', 'Performance', 'Breach', 'Remedies', 'UCC Article 2 — Sales', 'Third-Party Rights'],
  evidence: ['Relevance', 'Character Evidence', 'Hearsay', 'Hearsay Exceptions', 'Impeachment', 'Privileges', 'Authentication', 'Best Evidence Rule'],
  torts: ['Intentional Torts', 'Defenses to Intentional Torts', 'Negligence', 'Defenses to Negligence', 'Strict Liability', 'Products Liability', 'Defamation', 'Privacy Torts', 'Nuisance'],
  con_law: ['Justiciability', 'Federal Powers', 'State Powers & Dormant Commerce', 'State Action', 'Due Process', 'Equal Protection', 'First Amendment — Speech', 'First Amendment — Religion'],
  crim_law: ['Homicide', 'Crimes Against Persons', 'Property Crimes', 'Inchoate Offenses', 'Accomplice Liability', 'Defenses'],
  crim_pro: ['Fourth Amendment — Search', 'Fourth Amendment — Seizure', 'Fifth Amendment — Miranda', 'Sixth Amendment — Counsel', 'Identifications', 'Exclusionary Rule'],
  real_property: ['Present Estates', 'Future Interests', 'Concurrent Estates', 'Landlord-Tenant', 'Easements', 'Covenants & Servitudes', 'Adverse Possession', 'Deeds & Conveyances', 'Recording Acts', 'Mortgages'],
  civ_pro: ['Subject Matter Jurisdiction', 'Personal Jurisdiction', 'Venue & Removal', 'Erie Doctrine', 'Pleadings', 'Joinder', 'Discovery', 'Pretrial & Trial', 'Judgments & Preclusion'],
  biz_assoc: ['Agency', 'Partnerships', 'Corporations — Formation', 'Corporations — Governance', 'Shareholder Rights', 'Fiduciary Duties', 'LLCs'],
  mpt: ['MPT Format', 'Objective Memo', 'Persuasive Brief', 'Fact Analysis']
};

const SUBJECT_TABS = [
  { id: 'outline', label: 'Rule Outline', icon: ScrollText, desc: 'This is where the rule outline for {subject} → {topic} will appear.' },
  { id: 'flashcards', label: 'Flashcards', icon: Repeat, desc: 'Rule and notes flashcards for {subject} → {topic}.' },
  { id: 'mcqs', label: 'MCQs', icon: Target, desc: 'Multiple-choice questions for {subject} → {topic}.' },
  { id: 'essays', label: 'Essays', icon: FileText, desc: 'This is where essay prompts and your responses for {subject} → {topic} will live.' },
  { id: 'explain', label: 'Explanation Machine', icon: Brain, desc: 'The AI professor / explainer for {subject} → {topic}.' },
  { id: 'notes', label: 'Notes', icon: StickyNote, desc: 'Lecture notes and study notes for {subject} → {topic}.' },
  { id: 'simplifier', label: 'Simplifier', icon: Wand2, desc: 'BPS Simplifier — library, generator, and your saved simplifications for {subject} → {topic}.' },
  { id: 'outside', label: 'Outside Log', icon: Inbox, desc: 'Outside practice log for {subject} → {topic}.' }
];

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'subjects', icon: BookOpen, label: 'Subjects' },
  { id: 'notes', icon: StickyNote, label: 'Notes' },
  { id: 'outline_lab', icon: FlaskConical, label: 'Outline Lab' },
  { id: 'plans', icon: ListChecks, label: 'Plans' },
  { id: 'progress', icon: BarChart3, label: 'Progress' }
];

const INITIAL_TASKS = [
  { id: 1, title: 'Review Torts outline — Negligence section', subject: 'Torts', minutes: 60, done: false },
  { id: 2, title: 'Complete 25 MBE questions — Evidence', subject: 'Evidence', minutes: 45, done: false },
  { id: 3, title: 'Write MEE essay: Contracts remedies hypo', subject: 'Contracts', minutes: 60, done: false },
  { id: 4, title: 'Flashcard review — Real Property future interests', subject: 'Real Property', minutes: 30, done: true },
  { id: 5, title: 'Read Barbri Con Law chapter 3', subject: 'Constitutional Law', minutes: 45, done: false }
];

const WEAK_AREAS = [
  { topic: 'Hearsay Exceptions', subject: 'Evidence', accuracy: 42 },
  { topic: 'Future Interests — RAP', subject: 'Real Property', accuracy: 49 },
  { topic: 'Personal Jurisdiction', subject: 'Civil Procedure', accuracy: 53 },
  { topic: 'Felony Murder', subject: 'Criminal Law', accuracy: 58 }
];

const RECENT_ACTIVITY = [
  { type: 'MCQ', label: 'Completed 25 Evidence MCQs — 64%', time: '2h ago' },
  { type: 'Essay', label: 'Submitted Torts essay — Dan/Peter hypo (4/6)', time: '5h ago' },
  { type: 'Notes', label: 'Updated Contracts — UCC Article 2 notes', time: 'Yesterday' },
  { type: 'Flashcards', label: 'Reviewed 42 cards in Torts rule deck', time: 'Yesterday' }
];

/* =========================================================================
   UTILITIES
   ========================================================================= */
function escapeHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function fmtRelative(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
function uid(prefix = 'id') { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`; }
function srsInit() { return { interval: 0, ease: 2.5, dueAt: Date.now(), lastReviewed: null, reviews: 0 }; }

/* =========================================================================
   SEED — OUTLINES
   ========================================================================= */
const SEED_OUTLINES = {
  evidence: { 'Hearsay': { content: `# HEARSAY — Master Rule Outline

## Definition (FRE 801)
Hearsay is (1) a STATEMENT, (2) made OUT-OF-COURT, (3) offered to prove the TRUTH of the matter asserted.

## The 3-step attack
1. Is it a statement?
2. Was it made out-of-court?
3. Is it offered for truth?

## Non-hearsay uses
- Effect on listener
- State of mind (circumstantial)
- Verbal acts / legally operative words
- Impeachment — prior inconsistent statement

## FRE 801(d) — "not hearsay" by definition
- 801(d)(1) Prior statements of testifying witness
- 801(d)(2) Party-opponent admissions

## Bar traps
- Always check "offered for truth" — don't stop at "out-of-court + statement"
- Admissions are NOT hearsay; don't confuse with exceptions`, updatedAt: Date.now() - 86400000 * 2 } },
  torts: { 'Negligence': { content: `# NEGLIGENCE — Master Rule Outline

## Prima facie case (5 elements)
1. DUTY  2. BREACH  3. ACTUAL CAUSE  4. PROXIMATE CAUSE  5. DAMAGES

## 1. DUTY
- Cardozo: foreseeable plaintiffs in zone of danger
- Andrews: duty owed to everyone
- Standard: reasonably prudent person
- Special: professional / child / landowner

## 2. BREACH
- Hand formula: B < PL
- Res ipsa: (a) typically negligent; (b) exclusive control; (c) plaintiff not contributing

## 3. ACTUAL CAUSE
- But-for test
- Substantial factor (multiple sufficient causes)

## 4. PROXIMATE CAUSE
- Foreseeability of type of harm
- Eggshell plaintiff rule

## 5. DAMAGES
- Actual injury required

## Defenses
- Comparative (pure vs modified 50% bar)
- Assumption of risk`, updatedAt: Date.now() - 86400000 } }
};

/* =========================================================================
   SEED — NOTES
   ========================================================================= */
const SEED_NOTES = {
  evidence: { 'Hearsay': { content: `LECTURE NOTES — Hearsay

3-step attack is cleanest: (1) statement? (2) out-of-court? (3) offered for truth? Any NO = not hearsay.

Non-hearsay uses I confuse:
- Effect on listener
- State of mind (circumstantial)
- Verbal acts
- Impeachment PIS

Admissions (801(d)(2)) are NOT hearsay by definition — not exceptions.`, important: true, confusing: false, updatedAt: Date.now() - 86400000 * 3 } },
  torts: { 'Negligence': { content: `LECTURE NOTES — Negligence

5-element mantra: Duty → Breach → Actual Cause → Proximate Cause → Damages.

Duty model: (1) duty owed at all? (2) what standard? (3) special status?
Lock in standard BEFORE analyzing breach.

Causation = two tests: actual (but-for / substantial factor) AND proximate (foreseeability).

Eggshell: take P as found. Extent need not be foreseeable.

Pure vs modified comparative — READ THE JURISDICTION.`, important: true, confusing: false, updatedAt: Date.now() - 86400000 * 2 } }
};

/* =========================================================================
   SEED — FLASHCARDS
   ========================================================================= */
const SEED_FLASHCARDS_RULE = [
  { id: 'fc-r-1', deck: 'rule', subjectId: 'evidence', topic: 'Hearsay', front: 'Define hearsay (3-element test)', back: '(1) A STATEMENT, (2) made OUT-OF-COURT, (3) offered for the TRUTH of the matter asserted.', source: 'FRE 801', ...srsInit() },
  { id: 'fc-r-2', deck: 'rule', subjectId: 'evidence', topic: 'Hearsay', front: 'Non-hearsay uses of an out-of-court statement', back: 'Effect on listener; state of mind (circumstantial); verbal acts; impeachment (PIS); to show statement was made.', ...srsInit() },
  { id: 'fc-r-3', deck: 'rule', subjectId: 'evidence', topic: 'Hearsay', front: 'Co-conspirator statements — when admissible?', back: 'Made (a) DURING the conspiracy AND (b) IN FURTHERANCE of the conspiracy.', source: 'FRE 801(d)(2)(E)', ...srsInit() },
  { id: 'fc-r-4', deck: 'rule', subjectId: 'torts', topic: 'Negligence', front: 'Five elements of negligence (in order)', back: 'Duty — Breach — Actual cause — Proximate cause — Damages.', ...srsInit() },
  { id: 'fc-r-5', deck: 'rule', subjectId: 'torts', topic: 'Negligence', front: 'Res ipsa loquitur — three requirements', back: '(a) Typically results from negligence; (b) instrumentality in defendant\'s exclusive control; (c) plaintiff did not contribute.', ...srsInit() },
  { id: 'fc-r-6', deck: 'rule', subjectId: 'torts', topic: 'Negligence', front: 'Eggshell plaintiff rule', back: 'Defendant takes plaintiff as found. Liable for full extent of damages even if unforeseeable.', ...srsInit() },
  { id: 'fc-r-7', deck: 'rule', subjectId: 'torts', topic: 'Negligence', front: 'Substantial factor test — when does it apply?', back: 'Multiple independent causes, each of which alone would have been sufficient.', ...srsInit() }
];
const SEED_FLASHCARDS_NOTES = [
  { id: 'fc-n-1', deck: 'notes', subjectId: 'evidence', topic: 'Hearsay', front: 'Why is "effect on listener" not hearsay?', back: 'Offered to show listener\'s reaction (notice, knowledge, fear) — NOT that the statement is true.', ...srsInit() },
  { id: 'fc-n-2', deck: 'notes', subjectId: 'evidence', topic: 'Hearsay', front: 'Admission vs statement against interest', back: 'Admission: not hearsay by definition; need not be against interest when made. Statement against interest: hearsay exception; declarant unavailable; must be against interest when made.', ...srsInit() },
  { id: 'fc-n-3', deck: 'notes', subjectId: 'torts', topic: 'Negligence', front: 'Duty mental model — 3 questions', back: '(1) Duty owed at all? (2) What standard? (3) Special status bumping duty up?', ...srsInit() },
  { id: 'fc-n-4', deck: 'notes', subjectId: 'torts', topic: 'Negligence', front: 'Pure vs modified comparative negligence', back: 'Pure: recover at any fault % (reduced). Modified 50% bar: no recovery if plaintiff ≥50% at fault.', ...srsInit() }
];

/* =========================================================================
   SEED — MCQs
   ========================================================================= */
const SEED_MCQS = [
  { id: 'mcq-ev-1', subjectId: 'evidence', topic: 'Hearsay',
    question: 'At trial, Officer Rivera testifies: "Bystander Smith told me, \'The driver of the red car ran the red light.\'" The prosecution offers this to prove the red car driver ran the light. Is this hearsay?',
    choices: ['No, because the officer heard it personally.', 'Yes, because it is an out-of-court statement offered for the truth of the matter asserted.', 'No, because it is admissible under a hearsay exception.', 'No, because it describes a public event.'],
    correct: 1, explanation: 'Smith\'s statement is hearsay: (1) a statement, (2) made out-of-court, (3) offered to prove the matter asserted.',
    tag: 'Definition' },
  { id: 'mcq-ev-2', subjectId: 'evidence', topic: 'Hearsay',
    question: 'In a defamation case, plaintiff calls a witness who testifies: "I heard defendant say \'Plaintiff is a thief.\'" Offered to prove the defamatory statement was made. Hearsay?',
    choices: ['Yes, because it is an out-of-court statement.', 'Yes, because it is offered for the truth of the matter asserted.', 'No, because the words are a verbal act / legally operative fact — offered to show it was made.', 'No, because defamation claims never involve hearsay.'],
    correct: 2, explanation: 'Classic verbal-act / non-hearsay use. Words ARE the tort — offered to show the statement was MADE, not that plaintiff is actually a thief.',
    tag: 'Non-hearsay uses' },
  { id: 'mcq-ev-3', subjectId: 'evidence', topic: 'Hearsay',
    question: 'After a robbery was complete, one co-conspirator bragged to a friend: "We pulled it off." In the other\'s trial, admissible under 801(d)(2)(E)?',
    choices: ['Yes, because made by a co-conspirator.', 'No, because not made during AND in furtherance of the conspiracy.', 'Yes, because bragging is within the conspiracy.', 'No, because co-conspirator statements are always barred.'],
    correct: 1, explanation: '801(d)(2)(E) requires BOTH during and in furtherance. Mere narration after-the-fact fails.',
    tag: 'Admissions / 801(d)(2)' },
  { id: 'mcq-t-1', subjectId: 'torts', topic: 'Negligence',
    question: 'Factory negligently released toxic gas. Simultaneously, a fire caused by lightning also released toxic gas. Either alone would have killed plaintiff. Is the factory an actual cause?',
    choices: ['No — but-for fails.', 'Yes — under the substantial factor test.', 'No — lightning is a superseding cause.', 'Yes — but only under strict liability.'],
    correct: 1, explanation: 'Multiple sufficient causes → but-for collapses → substantial factor test applies.',
    tag: 'Actual cause' },
  { id: 'mcq-t-2', subjectId: 'torts', topic: 'Negligence',
    question: 'A landowner invites a plumber to fix a leak. Plumber trips on rug the landowner knew was frayed. Traditional duty?',
    choices: ['Only refrain from willful injury.', 'Warn of known non-obvious dangers.', 'Inspect and make safe OR warn.', 'No duty — licensee.'],
    correct: 2, explanation: 'Plumber = invitee (business visitor). Duty to inspect and make safe OR warn.',
    tag: 'Duty — landowners' },
  { id: 'mcq-t-3', subjectId: 'torts', topic: 'Negligence',
    question: 'Pure comparative negligence: plaintiff 80% at fault, defendant 20%, damages $100k. Plaintiff recovers:',
    choices: ['Nothing.', '$20,000.', '$80,000.', '$100,000 less collateral sources.'],
    correct: 1, explanation: 'Pure comparative = recover at any fault %, reduced. 20% × $100k = $20k.',
    tag: 'Defenses' }
];

/* =========================================================================
   SEED — BPS SIMPLIFICATIONS (curated library)
   ========================================================================= */
const SEED_SIMPLIFICATIONS = [
  // Evidence — Hearsay
  { id: 'sim-ev-1', subjectId: 'evidence', topic: 'Hearsay', type: 'FLOWCHART', source: 'BPS_LIBRARY',
    title: 'Hearsay 3-Step Attack Flowchart',
    content: `START
  │
  ▼
Is it a STATEMENT?
  (oral / written / assertive conduct)
  │   ├── NO → NOT hearsay. STOP.
  │   └── YES
  ▼
Was it made OUT-OF-COURT?
  (anything not said from this witness stand)
  │   ├── NO → NOT hearsay. STOP.
  │   └── YES
  ▼
Is it offered for the TRUTH of the matter asserted?
  │   ├── NO → NOT hearsay (non-hearsay use).
  │   │        Effect on listener / state of mind /
  │   │        verbal acts / impeachment.
  │   └── YES
  ▼
HEARSAY. Now check:
  • 801(d)(1) prior statements?
  • 801(d)(2) party admissions? (not hearsay by definition)
  • 803 / 804 exceptions?`,
    createdAt: Date.now() - 86400000 * 5 },

  { id: 'sim-ev-2', subjectId: 'evidence', topic: 'Hearsay', type: 'SUMMARY', source: 'BPS_LIBRARY',
    title: 'Non-Hearsay Uses — Quick Summary',
    content: `An out-of-court statement is NOT hearsay if offered for any of these purposes:

• EFFECT ON LISTENER — notice, knowledge, fear. (Most tested on the bar.)
• STATE OF MIND (CIRCUMSTANTIAL) — declarant's mental state as circumstantial evidence.
• VERBAL ACTS / LEGALLY OPERATIVE WORDS — offer, acceptance, defamation, consent.
• IMPEACHMENT — prior inconsistent statement used to attack credibility.
• SHOW STATEMENT WAS MADE — existence of the statement is the relevant fact.

Rule of thumb: if the TRUTH of what was said is irrelevant, you are in non-hearsay territory.`,
    createdAt: Date.now() - 86400000 * 4 },

  { id: 'sim-ev-3', subjectId: 'evidence', topic: 'Hearsay', type: 'TABLE', source: 'BPS_LIBRARY',
    title: 'Admissions vs Statements Against Interest',
    content: `| Feature | Admission (801(d)(2)) | Statement Against Interest (804(b)(3)) |
|---|---|---|
| Classification | NOT hearsay by definition | Hearsay exception |
| Declarant availability | Irrelevant | Must be UNAVAILABLE |
| Against interest when made? | NOT required | REQUIRED |
| Who made it? | Party-opponent | Anyone (declarant) |
| Common trap | Confusing with 804(b)(3) | Assuming party admissions need "against interest" |

Bottom line: if the declarant is the opposing party, go 801(d)(2) first — it's simpler and doesn't require unavailability or against-interest.`,
    createdAt: Date.now() - 86400000 * 3 },

  // Torts — Negligence
  { id: 'sim-t-1', subjectId: 'torts', topic: 'Negligence', type: 'FLOWCHART', source: 'BPS_LIBRARY',
    title: 'Negligence Elements Flowchart',
    content: `START
  │
  ▼
DUTY owed?
  (Cardozo: foreseeable Ps | Andrews: everyone)
  │   ├── NO → Plaintiff loses. STOP.
  │   └── YES
  ▼
BREACH? (Did D fall below standard?)
  │   ├── NO → Plaintiff loses. STOP.
  │   └── YES
  ▼
ACTUAL CAUSE?
  But-for OR substantial factor (multiple suff. causes)
  │   ├── NO → Plaintiff loses. STOP.
  │   └── YES
  ▼
PROXIMATE CAUSE? (Foreseeable type of harm?)
  Watch for superseding intervening causes.
  │   ├── NO → Plaintiff loses. STOP.
  │   └── YES
  ▼
DAMAGES? (Actual injury required — no nominal.)
  │   ├── NO → Plaintiff loses. STOP.
  │   └── YES
  ▼
NEGLIGENCE ESTABLISHED. Now check defenses:
  • Comparative (pure / modified 50% bar)
  • Assumption of risk (express / implied)`,
    createdAt: Date.now() - 86400000 * 5 },

  { id: 'sim-t-2', subjectId: 'torts', topic: 'Negligence', type: 'ATTACK_SHEET', source: 'BPS_LIBRARY',
    title: 'Duty / Breach / Causation / Damages Attack Sheet',
    content: `STEP 1 — DUTY
  • Cardozo (majority) or Andrews?
  • Standard: RPP / professional / child / landowner?
  • Special status: common carrier / innkeeper / rescuer / bailee?
  • Landowner traditional: trespasser / licensee / invitee?

STEP 2 — BREACH
  • B < PL (Hand formula)?
  • Res ipsa: typically negligent + exclusive control + P not contributing?
  • Custom of profession (if professional)?

STEP 3 — ACTUAL CAUSE
  • But-for? If fails → multiple sufficient → substantial factor?
  • Alternative liability (Summers v. Tice)?

STEP 4 — PROXIMATE CAUSE
  • Foreseeable type of harm?
  • Intervening cause → foreseeable (not superseding) OR independent + unforeseeable (superseding)?
  • Eggshell P: extent need not be foreseeable.

STEP 5 — DAMAGES
  • Actual injury (no nominal in negligence)
  • Compensatory + punitive (if reckless)
  • Collateral source rule (traditional)

DEFENSES CHECK
  • Comparative (pure vs modified)
  • Assumption of risk (express / implied)
  • Contributory (in ~4 jurisdictions)`,
    createdAt: Date.now() - 86400000 * 4 },

  { id: 'sim-t-3', subjectId: 'torts', topic: 'Negligence', type: 'SUMMARY', source: 'BPS_LIBRARY',
    title: 'Negligence Quick Summary',
    content: `FIVE-ELEMENT MANTRA: Duty → Breach → Actual Cause → Proximate Cause → Damages.

If ANY element is missing, plaintiff loses. Walk them IN ORDER.

Critical dual-test warning: CAUSATION IS TWO SEPARATE TESTS — actual (factual) AND proximate (legal). Examiners often have one that passes and one that fails.

Eggshell plaintiff: take plaintiff as found. Unforeseeable EXTENT is fine as long as SOME harm was foreseeable.

Defense watch: read the jurisdiction in the call of the question. Pure vs modified comparative changes the OUTCOME, not just the math.`,
    createdAt: Date.now() - 86400000 * 2 }
];

/* =========================================================================
   SEED — OUTLINE LAB INPUTS (helpful starter text)
   ========================================================================= */
const SEED_OUTLINE_LAB_INPUTS = {
  subjectId: 'torts',
  topic: 'Negligence',
  personalNotes: `5 elements: duty, breach, actual, proximate, damages.
Duty trap: lock in STANDARD before analyzing breach.
Causation is TWO tests — actual AND proximate.
Eggshell rule: extent need not be foreseeable.`,
  externalOutline: `Barbri — Negligence
I. Duty (Cardozo v Andrews; RPP; professionals; children; landowners)
II. Breach (Hand formula; res ipsa; custom)
III. Causation (but-for; substantial factor; foreseeability; superseding)
IV. Damages (compensatory; punitive; eggshell)
V. Defenses (comparative; assumption of risk)`,
  bookToc: `Ch. 6 — Negligence
  6.1  Elements overview
  6.2  The concept of duty
  6.3  Breach of duty
  6.4  Causation
  6.5  Damages
  6.6  Affirmative defenses`,
  otherMaterials: `AdaptiBar Q#1021 — res ipsa, got wrong. Missed "exclusive control" element.
Emanuel's — eggshell plaintiff chapter emphasized that SOME harm must be foreseeable.`,
  coursePlan: `Week 1: Elements overview + Duty
Week 2: Breach + Causation
Week 3: Damages + Defenses
Week 4: Mixed MCQs + 2 essays`
};

/* =========================================================================
   SIMULATED EXPLANATION ENGINE (Phase 6)
   ========================================================================= */
const STARTER_PROMPTS = {
  'evidence__Hearsay': ['Explain hearsay simply', 'Give me a memory trick for the 3-step attack', 'Compare admissions vs. statements against interest', 'Give a real-life example of "effect on listener"', 'Quiz me on hearsay'],
  'torts__Negligence': ['Teach negligence like I am a beginner', 'Give me a memory trick for duty, breach, causation, damages', 'Compare but-for and substantial factor tests', 'Explain the eggshell plaintiff rule with an example', 'Quiz me on negligence']
};
function getStarterPrompts(subjectId, topic) {
  return STARTER_PROMPTS[`${subjectId}__${topic}`] || [`Explain ${topic} simply`, `Give me a memory trick for ${topic}`, `Give a real-life example of ${topic}`, `Quiz me on ${topic}`];
}
const QUIZ_ME_BANK = {
  'evidence__Hearsay': [
    { q: 'State the 3-element definition of hearsay.', a: '(1) A statement; (2) made out-of-court; (3) offered for the truth of the matter asserted.' },
    { q: 'Name three non-hearsay uses.', a: 'Effect on listener; state of mind (circumstantial); verbal acts; impeachment (PIS); to show statement was made.' },
    { q: 'Two requirements of a co-conspirator statement under 801(d)(2)(E)?', a: 'Made (a) DURING and (b) IN FURTHERANCE of the conspiracy.' }
  ],
  'torts__Negligence': [
    { q: 'Five elements of negligence in order.', a: 'Duty — Breach — Actual cause — Proximate cause — Damages.' },
    { q: 'When does substantial factor replace but-for?', a: 'Multiple independent causes, each alone sufficient to produce the harm.' },
    { q: 'Eggshell plaintiff rule?', a: 'Take plaintiff as found. Unforeseeable extent does not matter if some harm was foreseeable.' }
  ]
};
function generateQuizMe(subjectId, topic) {
  return QUIZ_ME_BANK[`${subjectId}__${topic}`] || [
    { q: `State the core rule for ${topic} in one sentence.`, a: 'Check your outline — the black-letter rule should come first.' },
    { q: `One common affirmative defense for ${topic}?`, a: 'Depends on doctrine. Check Defenses section.' },
    { q: `One bar trap on ${topic}?`, a: 'Overlooked element, or a similar rule being confused.' }
  ];
}
function generateExplanation({ input, mode, subject, topic }) {
  const base = input.trim() || topic; const s = subject.name; const sections = [];
  if (['SIMPLE', 'STEP', 'EXAMPLE', 'MEMORY', 'COMPARE'].includes(mode)) {
    sections.push({ type: 'simple', title: 'Simple explanation',
      content: `At its core, ${topic} (within ${s}) is about drawing a line between conduct the law will sanction and conduct it will not. When you see a question touching ${base}, strip it down to three things: (1) what did the person do, (2) what standard did the law require, and (3) did the conduct fall short. The doctrine exists to give predictable guidance and courts a workable test.` });
  }
  if (['STEP', 'SIMPLE'].includes(mode)) {
    sections.push({ type: 'step', title: 'Step-by-step breakdown',
      content: `Step 1 — Identify the exact rule that applies.\nStep 2 — List the elements explicitly.\nStep 3 — Walk each element against the facts.\nStep 4 — Check every affirmative defense.\nStep 5 — Conclude with a confidence qualifier.` });
  }
  if (mode === 'COMPARE') {
    sections.push({ type: 'compare', title: 'Comparison',
      content: `Set up a mental three-column table for ${topic}: (1) Elements; (2) Mental state / standard; (3) Common defenses. Most bar traps come from fact patterns that straddle two rules — force yourself to ask which rule fits ALL the facts, not just the most salient ones.` });
  }
  if (['EXAMPLE', 'SIMPLE', 'MEMORY'].includes(mode)) {
    sections.push({ type: 'example', title: 'Real-life example',
      content: `Imagine a professional fails to do something a reasonable professional in their field would do, and someone relying on them is harmed. Walk through ${topic}\'s elements. Now flip one fact — e.g., the harmed person was not someone the defendant should have anticipated — and watch how the analysis changes.` });
  }
  if (['MEMORY', 'SIMPLE'].includes(mode)) {
    sections.push({ type: 'memory', title: 'Memory trick',
      content: `Anchor ${topic} to a vivid mini-story. Read the rule → build a 10-second scene in your head → tie each element to one part of the scene. When the question arrives, replay the scene to reconstruct the rule.` });
  }
  if (['SIMPLE', 'STEP', 'COMPARE', 'EXAMPLE', 'MEMORY'].includes(mode)) {
    sections.push({ type: 'trap', title: 'Exam trap warning',
      content: `Candidates often confuse ${topic} with a close cousin doctrine. Watch for (a) who bears the burden, (b) what element differs, (c) whether a "looks-like" pattern actually tests a different rule. When in doubt, go back to the elements.` });
  }
  if (mode === 'QUIZ') return { isQuiz: true, questions: generateQuizMe(subject.id, topic), subject, topic };
  return { isQuiz: false, sections, subject, topic, mode, input: base };
}

/* =========================================================================
   SIMULATED SIMPLIFICATION GENERATORS (Phase 7)
   ========================================================================= */
function generateSimplification(sourceText, kind, topic) {
  const text = (sourceText || '').trim();
  const snippet = text.slice(0, 240);
  const keyLines = text.split(/\n/).filter(l => l.trim().length > 10).slice(0, 8);

  if (kind === 'SIMPLIFY') {
    const bullets = keyLines.length > 0
      ? keyLines.map(l => `• ${l.trim().slice(0, 140)}`).join('\n')
      : `• Core rule: state it in one sentence.\n• Trigger: what facts bring this rule into play?\n• Elements: list them numerically.\n• Exceptions: narrow carve-outs.\n• Bar trap: overlooked element examiners hide.`;
    return `SIMPLIFIED: ${topic}

The core idea: the law requires specific elements before liability attaches. If any element is missing, the claim fails.

KEY POINTS:
${bullets}

USE THIS AS A MEMORY ANCHOR when you see similar fact patterns on the MBE/MEE.`;
  }

  if (kind === 'TABLE') {
    const rows = keyLines.slice(0, 4);
    const filled = rows.length > 0
      ? rows.map((l, i) => `| Element ${i + 1} | ${l.trim().slice(0, 60)} | — |`).join('\n')
      : `| Element 1 | Must be present | Most commonly missed |
| Element 2 | Specific standard | Watch for exception |
| Element 3 | Causal link | Actual vs. proximate |
| Element 4 | Damages usually required | Nominal may suffice for some torts |`;
    return `TABLE VIEW: ${topic}

| # | Requirement | Common trap |
|---|-------------|-------------|
${filled}

Read each row horizontally. Each element is independent — all must be satisfied.`;
  }

  if (kind === 'FLOWCHART') {
    return `FLOWCHART: ${topic}

START
  │
  ▼
Threshold question: is the rule triggered?
  │   ├── NO → Rule doesn't apply. STOP.
  │   └── YES
  ▼
Walk each element in order.
${keyLines.length > 0 ? keyLines.slice(0, 3).map((l, i) => `  • ${l.trim().slice(0, 80)}`).join('\n') : '  • Element 1 → Element 2 → Element 3'}
  │
  ▼
Any affirmative defense?
  │   ├── YES → Defense analysis. Outcome depends.
  │   └── NO
  ▼
Conclude with a confidence qualifier. END.`;
  }

  if (kind === 'ATTACK_SHEET') {
    const derived = text ? `\n\nDerived from source:\n• ${snippet.slice(0, 120)}...` : '';
    return `ATTACK SHEET: ${topic}

STEP 1 — IDENTIFY the exact rule triggered.
STEP 2 — LIST all elements, numbered.
STEP 3 — WALK each element against the facts.
STEP 4 — CHECK every affirmative defense.
STEP 5 — CONCLUDE with a confidence qualifier ("likely," "probably").

COMMON TRAPS:
• Don't skip the "obvious" element — examiners hide the answer there.
• Don't default to the first similar-looking rule.
• If two rules could apply, ask which fits ALL the facts, not just most of them.${derived}`;
  }

  return text || `(no output)`;
}

/* =========================================================================
   SIMULATED MASTER OUTLINE SYNTHESIS (Phase 8)
   ========================================================================= */
function generateMasterOutline({ personalNotes, externalOutline, bookToc, otherMaterials, coursePlan, subject, topic }) {
  const hasAny = [personalNotes, externalOutline, bookToc, otherMaterials, coursePlan].some(x => (x || '').trim().length > 0);
  if (!hasAny) return null;

  const subjectName = subject?.name || 'Subject';
  const topicName = topic || 'Topic';
  const sections = [];

  sections.push(`# ${subjectName} — ${topicName}`);
  sections.push(`## Synthesized Master Outline`);
  sections.push(`_Generated ${new Date().toLocaleString()} from your inputs._\n`);

  if (externalOutline?.trim()) {
    sections.push(`## I. Structure (from course outline)`);
    const lines = externalOutline.trim().split('\n').slice(0, 30);
    sections.push(lines.join('\n'));
    sections.push('');
  }

  if (bookToc?.trim()) {
    sections.push(`## II. Topic map (from book TOC)`);
    const lines = bookToc.trim().split('\n').slice(0, 20);
    sections.push(lines.map(l => `• ${l.trim()}`).join('\n'));
    sections.push('');
  }

  if (personalNotes?.trim()) {
    sections.push(`## III. Your emphasis (from personal notes)`);
    const keyLines = personalNotes.split(/[.\n]+/).filter(s => s.trim().length > 20).slice(0, 10);
    sections.push(keyLines.map(l => `• ${l.trim()}`).join('\n'));
    sections.push('');
  }

  if (otherMaterials?.trim()) {
    sections.push(`## IV. Supplemental materials`);
    const lines = otherMaterials.trim().split('\n').slice(0, 10);
    sections.push(lines.map(l => `• ${l.trim()}`).join('\n'));
    sections.push('');
  }

  if (coursePlan?.trim()) {
    sections.push(`## V. Course sequencing`);
    sections.push(coursePlan.trim().split('\n').slice(0, 10).join('\n'));
    sections.push('');
  }

  sections.push(`## Merge guidance`);
  sections.push(`• Where your notes emphasize something absent from the course outline, flag it — it may be jurisdiction-specific or simply high-yield for your professor.
• Where the course outline is more detailed than your notes, use this document to beef up your personal outline.
• Reconcile any conflicts between sources: the majority rule usually wins on MBE; essays may require discussing a split.
• Use this synthesized document as your single source of truth going into review sessions.`);

  return sections.join('\n');
}

const BPS_REFERENCE_OUTLINES = {
  'torts__Negligence': `# TORTS — NEGLIGENCE (BPS Reference)

## Prima facie
Duty · Breach · Actual cause · Proximate cause · Damages

## High-yield testing areas
• Duty: Cardozo vs Andrews; landowner categories; child standard
• Breach: Hand formula; res ipsa loquitur
• Causation: but-for vs substantial factor; superseding causes
• Eggshell plaintiff rule
• Defenses: pure vs modified comparative; assumption of risk

## Common MBE traps
• Confusing actual with proximate cause
• Missing a duty-triggering status
• Applying contributory when jurisdiction is comparative`,
  'evidence__Hearsay': `# EVIDENCE — HEARSAY (BPS Reference)

## Definition (FRE 801)
Out-of-court statement offered for truth of matter asserted.

## 3-step attack
Statement? → Out-of-court? → Offered for truth?

## Non-hearsay uses (tested heavily)
Effect on listener · state of mind (circumstantial) · verbal acts · impeachment PIS

## 801(d) — not hearsay by definition
Prior statements of testifying witness; party-opponent admissions

## Common traps
Admissions vs. statements against interest confusion`
};

/* =========================================================================
   PHASE 9/10 — CONSTANTS, SEEDS, HELPERS
   ========================================================================= */
const TASK_STATUSES = [
  { id: 'not_started', label: 'Not started', color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-300' },
  { id: 'in_progress', label: 'In progress', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  { id: 'completed', label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  { id: 'partial', label: 'Partial', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  { id: 'skipped', label: 'Skipped', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
  { id: 'rescheduled', label: 'Rescheduled', color: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500' }
];

const TASK_TYPES = [
  { id: 'outline', label: 'Outline', icon: ScrollText },
  { id: 'flashcards', label: 'Flashcards', icon: Repeat },
  { id: 'mcq', label: 'MCQ', icon: Target },
  { id: 'essay', label: 'Essay', icon: FileText },
  { id: 'read', label: 'Read', icon: BookOpen },
  { id: 'other', label: 'Other', icon: CheckSquareSafe }
];

function CheckSquareSafe(props) { return <CheckCircle2 {...props} />; }

const PLAN_TEMPLATES = [
  { id: 'FULL_TIME', label: 'Full-Time', desc: '6–8 hrs/day, 6 days/week. Comprehensive coverage.' },
  { id: 'PART_TIME', label: 'Part-Time', desc: '2–4 hrs/day, 5–6 days/week. Working professional pacing.' },
  { id: 'LATE_START', label: 'Late Start', desc: 'Intensive ramp-up. Triage by weakness.' },
  { id: 'CATCH_UP', label: 'Catch-Up', desc: 'Behind schedule. Focus on high-yield + defensive coverage.' }
];

function todayISO() { return new Date().toISOString().slice(0, 10); }
function daysBetween(isoA, isoB) {
  const a = new Date(isoA); const b = new Date(isoB);
  return Math.ceil((b - a) / 86400000);
}
function isTodayISO(iso) { return iso === todayISO(); }
function isThisWeek(iso) {
  if (!iso) return false;
  const d = new Date(iso); const now = new Date();
  const diff = (d - now) / 86400000;
  return diff >= -0.5 && diff <= 7;
}

const SEED_TASKS = [
  { id: 't-1', title: 'Review Torts outline — Negligence section', subjectName: 'Torts', minutes: 60, status: 'not_started', scheduledFor: todayISO(), type: 'outline', note: '', timeSpent: 0, createdAt: Date.now() },
  { id: 't-2', title: 'Complete 25 MBE questions — Evidence', subjectName: 'Evidence', minutes: 45, status: 'not_started', scheduledFor: todayISO(), type: 'mcq', note: '', timeSpent: 0, createdAt: Date.now() },
  { id: 't-3', title: 'Write MEE essay: Contracts remedies hypo', subjectName: 'Contracts', minutes: 60, status: 'not_started', scheduledFor: todayISO(), type: 'essay', note: '', timeSpent: 0, createdAt: Date.now() },
  { id: 't-4', title: 'Flashcard review — Real Property future interests', subjectName: 'Real Property', minutes: 30, status: 'completed', scheduledFor: todayISO(), type: 'flashcards', note: '', timeSpent: 28, createdAt: Date.now() },
  { id: 't-5', title: 'Read Barbri Con Law chapter 3', subjectName: 'Constitutional Law', minutes: 45, status: 'not_started', scheduledFor: todayISO(), type: 'read', materialId: 'm-1', note: '', timeSpent: 0, createdAt: Date.now() },
  { id: 't-6', title: 'Evidence — Hearsay Exceptions MCQs (weak area)', subjectName: 'Evidence', minutes: 45, status: 'not_started', scheduledFor: new Date(Date.now() + 86400000).toISOString().slice(0, 10), type: 'mcq', note: '', timeSpent: 0, createdAt: Date.now() },
  { id: 't-7', title: 'Torts essay — negligence hypo', subjectName: 'Torts', minutes: 60, status: 'not_started', scheduledFor: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10), type: 'essay', note: '', timeSpent: 0, createdAt: Date.now() },
  { id: 't-8', title: 'Civ Pro outline — Personal Jurisdiction', subjectName: 'Civil Procedure', minutes: 45, status: 'partial', scheduledFor: new Date(Date.now() - 86400000).toISOString().slice(0, 10), type: 'outline', note: 'Got through specific PJ. Need to finish general PJ + waiver.', timeSpent: 30, createdAt: Date.now() }
];

const SEED_PLAN_INPUTS = {
  examDate: '2026-07-28',
  startDate: todayISO(),
  mode: 'part-time',
  hoursPerDay: 3,
  daysPerWeek: 6,
  template: 'PART_TIME',
  targets: `• 85%+ MBE accuracy on Torts, Evidence, Contracts by mid-June
• Complete 2,500 MBE questions by exam
• Write 25 graded MEE essays
• Simulate 2 full bar exams before July 28`,
  materials: `Barbri UBE
Emanuel's Strategies & Tactics
Short & Happy MEE
MPT course
AdaptiBar`,
  bookToc: `Barbri UBE Outline
  1. Civil Procedure
  2. Constitutional Law
  3. Contracts & Sales
  4. Criminal Law & Procedure
  5. Evidence
  6. Real Property
  7. Torts
  8. Business Associations`,
  coursePlan: `Week 1-4: MBE foundation — Torts, Evidence, Contracts
Week 5-8: MBE expansion — Real Property, Civ Pro, Con Law, Crim
Week 9-10: MEE writing intensive
Week 11-12: MPT practice + mixed sets
Week 13: Simulated exams + targeted review`
};

const SEED_ROUTINE = {
  wakeTime: '6:30 AM',
  studyStart: '7:00 AM',
  obligations: 'Work 9:00 AM – 5:00 PM (M–F)',
  breakPref: 'Pomodoro (50 min study / 10 min break)',
  blocks: [
    { id: 'b-1', start: '7:00 AM', end: '8:30 AM', label: 'MBE practice (45 questions mixed set)' },
    { id: 'b-2', start: '12:30 PM', end: '1:00 PM', label: 'Flashcards during lunch' },
    { id: 'b-3', start: '6:00 PM', end: '7:30 PM', label: 'Outline review + notes' },
    { id: 'b-4', start: '8:00 PM', end: '9:00 PM', label: 'MEE essay or MPT practice (alternating)' }
  ]
};

const SEED_MATERIALS = [
  { id: 'm-1', name: 'Barbri UBE', chapters: 30, completed: 12, lastUpdated: Date.now() - 86400000 },
  { id: 'm-2', name: "Emanuel's Strategies & Tactics", chapters: 12, completed: 5, lastUpdated: Date.now() - 86400000 * 3 },
  { id: 'm-3', name: 'Short & Happy MEE', chapters: 15, completed: 4, lastUpdated: Date.now() - 86400000 * 5 },
  { id: 'm-4', name: 'MPT Course', chapters: 10, completed: 2, lastUpdated: Date.now() - 86400000 * 7 },
  { id: 'm-5', name: 'AdaptiBar', chapters: 100, completed: 34, lastUpdated: Date.now() - 86400000 * 1 }
];

function generateStudyPlan(inputs) {
  if (!inputs) return null;
  const { examDate, startDate, mode, hoursPerDay, daysPerWeek, targets, materials, bookToc, coursePlan, template } = inputs;
  if (!examDate || !startDate) return null;
  const weeks = Math.max(1, Math.ceil(daysBetween(startDate, examDate) / 7));
  const days = daysBetween(startDate, examDate);
  const totalHours = weeks * (daysPerWeek || 5) * (hoursPerDay || 3);
  const tpl = PLAN_TEMPLATES.find(t => t.id === template) || PLAN_TEMPLATES[1];

  const phases = Math.min(4, Math.max(2, Math.ceil(weeks / 3)));
  const weeksPerPhase = Math.ceil(weeks / phases);
  const phaseLabels = ['Foundation', 'Expansion', 'Integration', 'Simulation & Review'];

  const weeklyTargets = [];
  for (let w = 1; w <= Math.min(weeks, 16); w++) {
    const phaseIdx = Math.min(phases - 1, Math.floor((w - 1) / weeksPerPhase));
    const phase = phaseLabels[phaseIdx] || 'Review';
    let focus, goals;
    if (phase === 'Foundation') {
      focus = ['Torts', 'Evidence', 'Contracts'][w % 3];
      goals = [`Read ${focus} outline + Barbri chapter`, `Complete 50 MBE questions on ${focus}`, `Build 20 flashcards for weak ${focus} topics`, `Write 1 MEE essay on ${focus}`];
    } else if (phase === 'Expansion') {
      focus = ['Real Property', 'Civil Procedure', 'Constitutional Law', 'Criminal Law/Pro'][w % 4];
      goals = [`Outline ${focus} completely`, `75 MBE questions on ${focus}`, `Mixed review day: prior subjects`, `Flashcard batch for ${focus}`];
    } else if (phase === 'Integration') {
      goals = [`100 mixed MBE questions daily`, `2 MEE essays (different subjects)`, `Outline Lab: cross-subject synthesis`, `Review weakness engine insights`];
      focus = 'Mixed';
    } else {
      goals = [`Simulated MBE (100 questions timed)`, `Full MEE set (6 essays)`, `MPT practice (2 tasks)`, `Weak-area targeted review`];
      focus = 'Exam simulation';
    }
    weeklyTargets.push({ week: w, phase, focus, goals });
  }

  const dailyTemplate = [
    `Morning (${Math.ceil((hoursPerDay || 3) * 0.4)}h): MBE practice — rotating subjects`,
    `Midday (30 min): Flashcard review — due cards only`,
    `Evening (${Math.ceil((hoursPerDay || 3) * 0.5)}h): Outline/notes review + MEE or MPT`,
    `Weekly: 1 full-length MEE essay + 1 MPT task + subject retrospective`
  ];

  const overview = `Study plan from ${startDate} to ${examDate} (${days} days · ${weeks} weeks).
Template: ${tpl.label} — ${tpl.desc}
Projected total study hours: ~${totalHours} (${hoursPerDay}h × ${daysPerWeek} days × ${weeks} weeks).

Personal targets on file:
${(targets || '(none provided)').trim()}

Materials in rotation:
${(materials || '(none provided)').trim()}`;

  return {
    overview, weeklyTargets, dailyTemplate,
    weeks, days, totalHours,
    generatedAt: Date.now()
  };
}

function generateTasksFromPlan(plan, existingTasks) {
  if (!plan || !plan.weeklyTargets) return [];
  const existingTitles = new Set((existingTasks || []).map(t => t.title));
  const baseDate = new Date();
  const generated = [];

  // Pull first 3 weeks worth of goals into scheduled tasks
  for (let w = 0; w < Math.min(3, plan.weeklyTargets.length); w++) {
    const wt = plan.weeklyTargets[w];
    wt.goals.slice(0, 3).forEach((goal, gIdx) => {
      const scheduled = new Date(baseDate.getTime() + (w * 7 + gIdx * 2) * 86400000).toISOString().slice(0, 10);
      const title = `Week ${wt.week}: ${goal}`;
      if (existingTitles.has(title)) return;
      const typeGuess = /mbe|mcq|question/i.test(goal) ? 'mcq' : /essay|mee/i.test(goal) ? 'essay' : /flashcard/i.test(goal) ? 'flashcards' : /outline/i.test(goal) ? 'outline' : /read/i.test(goal) ? 'read' : 'other';
      const subjGuess = SUBJECTS.find(s => goal.toLowerCase().includes(s.name.toLowerCase()))?.name || wt.focus;
      generated.push({
        id: uid('t'), title, subjectName: subjGuess || 'General',
        minutes: typeGuess === 'essay' ? 60 : typeGuess === 'mcq' ? 45 : 30,
        status: 'not_started', scheduledFor: scheduled, type: typeGuess,
        note: '', timeSpent: 0, createdAt: Date.now()
      });
    });
  }
  return generated;
}

function generateRoutineSuggestion({ wakeTime, studyStart, obligations, breakPref }) {
  return [
    { id: uid('b'), start: wakeTime || '6:30 AM', end: studyStart || '7:00 AM', label: 'Wake + light review (yesterday\'s flashcards)' },
    { id: uid('b'), start: studyStart || '7:00 AM', end: '8:30 AM', label: 'Focused MBE session (45 questions)' },
    { id: uid('b'), start: '12:30 PM', end: '1:00 PM', label: 'Flashcards during lunch break' },
    { id: uid('b'), start: '6:00 PM', end: '7:30 PM', label: 'Outline + notes review' },
    { id: uid('b'), start: '8:00 PM', end: '9:00 PM', label: 'MEE or MPT practice (alternate days)' }
  ];
}

function generateAIInsights(data) {
  const { subjectStats, outlines, notes, flashcards, tasks, mcqResults } = data;
  const insights = [];

  // Per-subject insights
  subjectStats.forEach(s => {
    if (s.attempted >= 3 && s.accuracy != null && s.accuracy < 60) {
      insights.push({ type: 'weak', text: `Focus next on ${s.name} — MCQ accuracy is ${s.accuracy}% across ${s.attempted} attempts. This is your highest-priority gap.` });
    }
    if (s.outlineCount > 0 && s.attempted < 5) {
      insights.push({ type: 'practice', text: `${s.name} has outline coverage but low MCQ volume (${s.attempted} attempted). Increase practice volume next.` });
    }
    if (s.flashcardCount > 20 && s.attempted < 10) {
      insights.push({ type: 'practice', text: `You have ${s.flashcardCount} flashcards in ${s.name} but little MCQ practice. Shift from memorization to application.` });
    }
    if (s.started && s.outlineCount === 0) {
      insights.push({ type: 'foundation', text: `${s.name} has activity but no rule outline yet. Build the foundation before scaling practice.` });
    }
  });

  // Task-level insights
  const skippedThisWeek = (tasks || []).filter(t => t.status === 'skipped' && isThisWeek(t.scheduledFor)).length;
  if (skippedThisWeek >= 2) {
    insights.push({ type: 'behind', text: `You skipped ${skippedThisWeek} tasks this week. Audit whether they're unrealistic or need to be reprioritized into the plan.` });
  }
  const essaySkipped = (tasks || []).filter(t => t.type === 'essay' && ['skipped', 'not_started'].includes(t.status) && isThisWeek(t.scheduledFor)).length;
  if (essaySkipped >= 2) {
    insights.push({ type: 'essay', text: `You are behind on essay work (${essaySkipped} pending/skipped essay tasks). Add one protected essay block this week.` });
  }

  // Flashcard insight
  const fcCount = (flashcards || []).length;
  if (fcCount < 20) {
    insights.push({ type: 'flashcards', text: `Only ${fcCount} flashcards created across all subjects. SRS only works if there's volume — aim for 10–15 per topic.` });
  }

  if (insights.length === 0) {
    insights.push({ type: 'ok', text: 'No immediate red flags. Stay consistent and revisit this panel after another week of practice.' });
  }
  return insights.slice(0, 8);
}


/* =========================================================================
   PHASE 11 — AUTH
   ========================================================================= */
async function hashPassword(email, password) {
  const msg = `bps_v1:${(email || '').toLowerCase().trim()}:${password}`;
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const bytes = new TextEncoder().encode(msg);
      const hashBuf = await crypto.subtle.digest('SHA-256', bytes);
      return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) { /* fall through */ }
  // Fallback non-crypto hash (should rarely be hit in modern browsers)
  let h = 5381;
  for (let i = 0; i < msg.length; i++) h = ((h << 5) + h + msg.charCodeAt(i)) >>> 0;
  return 'fb_' + h.toString(16).padStart(8, '0');
}

const USER_DATA_KEYS = [
  'outlines', 'notes', 'flashcards_rule', 'flashcards_notes',
  'mcqs', 'mcq_results', 'saved_explanations', 'simplifications',
  'outline_lab_inputs', 'outline_lab_output',
  'tasks', 'plan_inputs', 'plan', 'routine', 'materials',
  'seeded_v1', 'seeded_v2', 'seeded_v3', 'seeded_v4'
];

// Migrate legacy global keys to first user on first signup
async function migrateLegacyToUser(userId) {
  const migrationDone = await storage.get(`bps_u_${userId}_migrated`, false);
  if (migrationDone) return false;
  let migratedAny = false;
  for (const k of USER_DATA_KEYS) {
    const legacy = await storage.get(`bps_${k}`, null);
    if (legacy !== null && legacy !== undefined) {
      await storage.set(`bps_u_${userId}_${k}`, legacy);
      migratedAny = true;
    }
  }
  await storage.set(`bps_u_${userId}_migrated`, true);
  return migratedAny;
}

function AuthScreen({ users, onSignup, onLogin }) {
  const [mode, setMode] = useState(users.length === 0 ? 'signup' : 'signin');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const switchMode = (m) => { setMode(m); setError(''); };

  const submit = async () => {
    setError('');
    const email = form.email.trim().toLowerCase();
    if (!email || !form.password) { setError('Email and password are required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address.'); return; }
    setBusy(true);
    try {
      if (mode === 'signup') {
        if (!form.name.trim()) { setError('Name is required.'); setBusy(false); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters.'); setBusy(false); return; }
        if (form.password !== form.confirm) { setError('Passwords do not match.'); setBusy(false); return; }
        if (users.some(u => u.email.toLowerCase() === email)) { setError('An account with that email already exists. Try signing in.'); setBusy(false); return; }
        await onSignup(form.name.trim(), email, form.password);
      } else {
        const ok = await onLogin(email, form.password);
        if (!ok) { setError('Invalid email or password.'); setBusy(false); return; }
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
    }
    setBusy(false);
  };

  const onKey = (e) => { if (e.key === 'Enter') submit(); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-xl bg-slate-900 text-white grid place-items-center mb-3 shadow-sm">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Bar Prep Studio</h1>
          <p className="text-sm text-slate-500 mt-1">UBE · July 2026</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex rounded-md border border-slate-200 bg-slate-50 p-0.5 mb-5">
            <button onClick={() => switchMode('signin')} className={`flex-1 py-2 text-sm rounded transition ${mode === 'signin' ? 'bg-white text-slate-900 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'}`}>
              Sign in
            </button>
            <button onClick={() => switchMode('signup')} className={`flex-1 py-2 text-sm rounded transition ${mode === 'signup' ? 'bg-white text-slate-900 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'}`}>
              Create account
            </button>
          </div>

          <div className="space-y-3">
            {mode === 'signup' && (
              <AuthField label="Name" icon={User}>
                <input autoFocus type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} onKeyDown={onKey}
                  placeholder="Your name" className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-slate-400" />
              </AuthField>
            )}
            <AuthField label="Email" icon={Mail}>
              <input autoFocus={mode === 'signin'} type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onKeyDown={onKey}
                placeholder="you@example.com" className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-slate-400" />
            </AuthField>
            <AuthField label="Password" icon={Lock}>
              <input type={showPass ? 'text' : 'password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} onKeyDown={onKey}
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'} className="w-full pl-9 pr-10 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-slate-400" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 text-[10px] uppercase font-medium tracking-wide">
                {showPass ? 'Hide' : 'Show'}
              </button>
            </AuthField>
            {mode === 'signup' && (
              <AuthField label="Confirm password" icon={Lock}>
                <input type={showPass ? 'text' : 'password'} autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} onKeyDown={onKey}
                  placeholder="Re-enter password" className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-slate-400" />
              </AuthField>
            )}

            {error && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-md p-2 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button onClick={submit} disabled={busy} className="w-full py-2.5 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition flex items-center justify-center gap-2">
              {busy ? (
                <>Loading…</>
              ) : mode === 'signup' ? (
                <><UserPlus className="w-4 h-4" />Create account</>
              ) : (
                <><LogIn className="w-4 h-4" />Sign in</>
              )}
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
            <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
            <span>
              <strong className="text-slate-700">Local account.</strong> Your account and all study data are stored only in this browser. There is no server, no email verification, and no password recovery. Do not reuse a password from another service.
            </span>
          </div>
        </div>

        {mode === 'signin' && users.length > 0 && (
          <div className="mt-4">
            <div className="text-[10px] uppercase text-slate-500 font-medium tracking-wide text-center mb-2">Recent accounts on this device</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {users.slice(0, 4).map(u => (
                <button key={u.id} onClick={() => setForm({ ...form, email: u.email })}
                  className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition">
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-white grid place-items-center text-[9px] font-bold">{(u.name || u.email).slice(0, 2).toUpperCase()}</div>
                  <span className="text-slate-700 truncate max-w-[140px]">{u.email}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AuthField({ label, icon: Icon, children }) {
  return (
    <div>
      <div className="text-[10px] uppercase font-medium text-slate-600 tracking-wide mb-1">{label}</div>
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />}
        {children}
      </div>
    </div>
  );
}

/* =========================================================================
   ROOT APP
   ========================================================================= */
export default function App() {
  // Auth state (global)
  const [authChecked, setAuthChecked] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // App state
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState('dashboard');
  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [activeTopicMap, setActiveTopicMap] = useState({});
  const [activeTabMap, setActiveTabMap] = useState({});
  const [tasks, setTasks] = useState(SEED_TASKS);

  // Persisted slices
  const [outlines, setOutlines] = useState({});
  const [notes, setNotes] = useState({});
  const [flashcardsRule, setFlashcardsRule] = useState([]);
  const [flashcardsNotes, setFlashcardsNotes] = useState([]);
  const [mcqs, setMcqs] = useState([]);
  const [mcqResults, setMcqResults] = useState([]);
  const [savedExplanations, setSavedExplanations] = useState([]);
  const [simplifications, setSimplifications] = useState([]);
  const [outlineLabInputs, setOutlineLabInputs] = useState({});
  const [outlineLabOutput, setOutlineLabOutput] = useState('');
  const [planInputs, setPlanInputs] = useState(SEED_PLAN_INPUTS);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [routine, setRoutine] = useState(SEED_ROUTINE);
  const [materials, setMaterials] = useState(SEED_MATERIALS);

  const daysRemaining = 99;
  const subjectsStarted = SUBJECTS.filter(s => s.started).length;
  const mcqAccuracy = 67;
  const flashcardsDue = 38;

  // Per-user storage key helper
  const uk = (key) => currentUser ? `bps_u_${currentUser.id}_${key}` : null;

  // === Phase 1: auth check on mount ===
  useEffect(() => {
    (async () => {
      const storedUsers = await storage.get('bps_users', []);
      setUsers(storedUsers || []);
      const currentId = await storage.get('bps_current_user_id', null);
      if (currentId && Array.isArray(storedUsers)) {
        const u = storedUsers.find(x => x.id === currentId);
        if (u) setCurrentUser(u);
      }
      setAuthChecked(true);
    })();
  }, []);

  // === Phase 2: load user data whenever current user changes ===
  useEffect(() => {
    if (!currentUser) { setLoaded(false); return; }
    (async () => {
      setLoaded(false);
      const uid2 = currentUser.id;

      // Migrate legacy data on first login for this user (no-op if already migrated)
      await migrateLegacyToUser(uid2);

      const seededV1 = await storage.get(`bps_u_${uid2}_seeded_v1`, false);
      const seededV2 = await storage.get(`bps_u_${uid2}_seeded_v2`, false);
      const seededV3 = await storage.get(`bps_u_${uid2}_seeded_v3`, false);
      const seededV4 = await storage.get(`bps_u_${uid2}_seeded_v4`, false);

      const loadedOutlines = await storage.get(`bps_u_${uid2}_outlines`, null);
      const loadedNotes = await storage.get(`bps_u_${uid2}_notes`, null);
      const loadedFcRule = await storage.get(`bps_u_${uid2}_flashcards_rule`, null);
      const loadedFcNotes = await storage.get(`bps_u_${uid2}_flashcards_notes`, null);
      const loadedMcqs = await storage.get(`bps_u_${uid2}_mcqs`, null);
      const loadedMcqRes = await storage.get(`bps_u_${uid2}_mcq_results`, null);
      const loadedExpl = await storage.get(`bps_u_${uid2}_saved_explanations`, null);
      const loadedSimp = await storage.get(`bps_u_${uid2}_simplifications`, null);
      const loadedLabInputs = await storage.get(`bps_u_${uid2}_outline_lab_inputs`, null);
      const loadedLabOutput = await storage.get(`bps_u_${uid2}_outline_lab_output`, null);
      const loadedTasks = await storage.get(`bps_u_${uid2}_tasks`, null);
      const loadedPlanInputs = await storage.get(`bps_u_${uid2}_plan_inputs`, null);
      const loadedPlan = await storage.get(`bps_u_${uid2}_plan`, null);
      const loadedRoutine = await storage.get(`bps_u_${uid2}_routine`, null);
      const loadedMaterials = await storage.get(`bps_u_${uid2}_materials`, null);

      if (!seededV1) {
        setOutlines(SEED_OUTLINES); setNotes(SEED_NOTES);
        await storage.set(`bps_u_${uid2}_outlines`, SEED_OUTLINES);
        await storage.set(`bps_u_${uid2}_notes`, SEED_NOTES);
        await storage.set(`bps_u_${uid2}_seeded_v1`, true);
      } else {
        setOutlines(loadedOutlines || {});
        setNotes(loadedNotes || {});
      }

      if (!seededV2) {
        setFlashcardsRule(SEED_FLASHCARDS_RULE); setFlashcardsNotes(SEED_FLASHCARDS_NOTES); setMcqs(SEED_MCQS);
        await storage.set(`bps_u_${uid2}_flashcards_rule`, SEED_FLASHCARDS_RULE);
        await storage.set(`bps_u_${uid2}_flashcards_notes`, SEED_FLASHCARDS_NOTES);
        await storage.set(`bps_u_${uid2}_mcqs`, SEED_MCQS);
        await storage.set(`bps_u_${uid2}_seeded_v2`, true);
      } else {
        setFlashcardsRule(loadedFcRule || []);
        setFlashcardsNotes(loadedFcNotes || []);
        setMcqs(loadedMcqs || []);
      }

      if (!seededV3) {
        setSimplifications(SEED_SIMPLIFICATIONS);
        setOutlineLabInputs(SEED_OUTLINE_LAB_INPUTS);
        await storage.set(`bps_u_${uid2}_simplifications`, SEED_SIMPLIFICATIONS);
        await storage.set(`bps_u_${uid2}_outline_lab_inputs`, SEED_OUTLINE_LAB_INPUTS);
        await storage.set(`bps_u_${uid2}_seeded_v3`, true);
      } else {
        setSimplifications(loadedSimp || []);
        setOutlineLabInputs(loadedLabInputs || {});
      }

      if (!seededV4) {
        setTasks(SEED_TASKS);
        setPlanInputs(SEED_PLAN_INPUTS);
        setRoutine(SEED_ROUTINE);
        setMaterials(SEED_MATERIALS);
        await storage.set(`bps_u_${uid2}_tasks`, SEED_TASKS);
        await storage.set(`bps_u_${uid2}_plan_inputs`, SEED_PLAN_INPUTS);
        await storage.set(`bps_u_${uid2}_routine`, SEED_ROUTINE);
        await storage.set(`bps_u_${uid2}_materials`, SEED_MATERIALS);
        await storage.set(`bps_u_${uid2}_seeded_v4`, true);
      } else {
        setTasks(loadedTasks || []);
        setPlanInputs(loadedPlanInputs || SEED_PLAN_INPUTS);
        setRoutine(loadedRoutine || SEED_ROUTINE);
        setMaterials(loadedMaterials || []);
      }

      setMcqResults(loadedMcqRes || []);
      setSavedExplanations(loadedExpl || []);
      setOutlineLabOutput(loadedLabOutput || '');
      setGeneratedPlan(loadedPlan || null);

      // Reset UI state to a clean default on user switch
      setView('dashboard');
      setActiveSubjectId(null);
      setActiveTopicMap({});
      setActiveTabMap({});

      setLoaded(true);
    })();
  }, [currentUser?.id]); // eslint-disable-line

  // Save effects (user-scoped)
  useEffect(() => { if (loaded && uk('outlines')) storage.set(uk('outlines'), outlines); }, [outlines, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded && uk('notes')) storage.set(uk('notes'), notes); }, [notes, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded && uk('flashcards_rule')) storage.set(uk('flashcards_rule'), flashcardsRule); }, [flashcardsRule, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded && uk('flashcards_notes')) storage.set(uk('flashcards_notes'), flashcardsNotes); }, [flashcardsNotes, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded && uk('mcqs')) storage.set(uk('mcqs'), mcqs); }, [mcqs, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded && uk('mcq_results')) storage.set(uk('mcq_results'), mcqResults); }, [mcqResults, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded && uk('saved_explanations')) storage.set(uk('saved_explanations'), savedExplanations); }, [savedExplanations, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded && uk('simplifications')) storage.set(uk('simplifications'), simplifications); }, [simplifications, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded && uk('outline_lab_inputs')) storage.set(uk('outline_lab_inputs'), outlineLabInputs); }, [outlineLabInputs, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded && uk('outline_lab_output')) storage.set(uk('outline_lab_output'), outlineLabOutput); }, [outlineLabOutput, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded && uk('tasks')) storage.set(uk('tasks'), tasks); }, [tasks, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded && uk('plan_inputs')) storage.set(uk('plan_inputs'), planInputs); }, [planInputs, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded && uk('plan')) storage.set(uk('plan'), generatedPlan); }, [generatedPlan, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded && uk('routine')) storage.set(uk('routine'), routine); }, [routine, loaded]); // eslint-disable-line
  useEffect(() => { if (loaded && uk('materials')) storage.set(uk('materials'), materials); }, [materials, loaded]); // eslint-disable-line

  // === Auth handlers ===
  const handleSignup = async (name, email, password) => {
    const passHash = await hashPassword(email, password);
    const newUser = {
      id: `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      name, email: email.toLowerCase(), passHash,
      createdAt: Date.now(), lastLoginAt: Date.now()
    };
    const updated = [...users, newUser];
    setUsers(updated);
    await storage.set('bps_users', updated);
    await storage.set('bps_current_user_id', newUser.id);
    setCurrentUser(newUser);
  };

  const handleLogin = async (email, password) => {
    const passHash = await hashPassword(email, password);
    const u = users.find(x => x.email.toLowerCase() === email.toLowerCase() && x.passHash === passHash);
    if (!u) return false;
    const updated = users.map(x => x.id === u.id ? { ...x, lastLoginAt: Date.now() } : x);
    setUsers(updated);
    await storage.set('bps_users', updated);
    await storage.set('bps_current_user_id', u.id);
    setCurrentUser({ ...u, lastLoginAt: Date.now() });
    return true;
  };

  const handleLogout = async () => {
    await storage.set('bps_current_user_id', null);
    setCurrentUser(null);
    // Clear in-memory state so the next login starts clean
    setLoaded(false);
    setView('dashboard');
    setActiveSubjectId(null);
  };

  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'not_started' : 'completed' } : t));
  const updateTask = (id, patch) => setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  const addTask = (task) => setTasks(prev => [...prev, { id: uid('t'), status: 'not_started', timeSpent: 0, note: '', createdAt: Date.now(), ...task }]);
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  const openSubject = (subjectId, topicOverride) => {
    const subject = SUBJECTS.find(s => s.id === subjectId); if (subject?.disabled) return;
    setActiveSubjectId(subjectId); setView('subjects');
    if (topicOverride) setActiveTopicMap(m => ({ ...m, [subjectId]: topicOverride }));
    else if (!activeTopicMap[subjectId]) setActiveTopicMap(m => ({ ...m, [subjectId]: TOPICS[subjectId][0] }));
    if (!activeTabMap[subjectId]) setActiveTabMap(m => ({ ...m, [subjectId]: 'outline' }));
  };

  const setActiveTopic = (topic) => setActiveTopicMap(m => ({ ...m, [activeSubjectId]: topic }));
  const setActiveTab = (tab) => setActiveTabMap(m => ({ ...m, [activeSubjectId]: tab }));
  const goToNav = (navId) => { setView(navId); if (navId !== 'subjects') setActiveSubjectId(null); };

  const saveOutline = (subjectId, topic, content) => setOutlines(prev => ({ ...prev, [subjectId]: { ...(prev[subjectId] || {}), [topic]: { content, updatedAt: Date.now() } } }));
  const getOutline = (subjectId, topic) => outlines?.[subjectId]?.[topic] || null;
  const saveNote = (subjectId, topic, patch) => setNotes(prev => {
    const existing = prev?.[subjectId]?.[topic] || { content: '', important: false, confusing: false };
    return { ...prev, [subjectId]: { ...(prev[subjectId] || {}), [topic]: { ...existing, ...patch, updatedAt: Date.now() } } };
  });
  const getNote = (subjectId, topic) => notes?.[subjectId]?.[topic] || null;

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="w-10 h-10 mx-auto text-slate-400 animate-pulse" />
          <div className="mt-3 text-sm text-slate-500">Loading Bar Prep Studio…</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen users={users} onSignup={handleSignup} onLogin={handleLogin} />;
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="w-10 h-10 mx-auto text-slate-400 animate-pulse" />
          <div className="mt-3 text-sm text-slate-500">Loading your study data…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      <Sidebar view={view} setView={goToNav} daysRemaining={daysRemaining} currentUser={currentUser} onLogout={handleLogout} />
      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {view === 'dashboard' && (
            <DashboardView tasks={tasks} toggleTask={toggleTask} daysRemaining={daysRemaining} subjectsStarted={subjectsStarted} mcqAccuracy={mcqAccuracy} flashcardsDue={flashcardsDue} onSubjectClick={openSubject} />
          )}
          {view === 'subjects' && !activeSubjectId && <SubjectsGridView onOpen={openSubject} />}
          {view === 'subjects' && activeSubjectId && (
            <SubjectPage
              subjectId={activeSubjectId}
              activeTopic={activeTopicMap[activeSubjectId] || TOPICS[activeSubjectId][0]}
              setActiveTopic={setActiveTopic}
              activeTab={activeTabMap[activeSubjectId] || 'outline'}
              setActiveTab={setActiveTab}
              onBack={() => setActiveSubjectId(null)}
              getOutline={getOutline} saveOutline={saveOutline}
              getNote={getNote} saveNote={saveNote}
              flashcardsRule={flashcardsRule} setFlashcardsRule={setFlashcardsRule}
              flashcardsNotes={flashcardsNotes} setFlashcardsNotes={setFlashcardsNotes}
              mcqs={mcqs} setMcqs={setMcqs}
              mcqResults={mcqResults} setMcqResults={setMcqResults}
              savedExplanations={savedExplanations} setSavedExplanations={setSavedExplanations}
              simplifications={simplifications} setSimplifications={setSimplifications}
            />
          )}
          {view === 'outline_lab' && (
            <OutlineLabView
              inputs={outlineLabInputs} setInputs={setOutlineLabInputs}
              output={outlineLabOutput} setOutput={setOutlineLabOutput}
              saveOutline={saveOutline} getOutline={getOutline}
              goOpenSubject={openSubject}
            />
          )}
          {view === 'plans' && (
            <PlansView
              planInputs={planInputs} setPlanInputs={setPlanInputs}
              generatedPlan={generatedPlan} setGeneratedPlan={setGeneratedPlan}
              tasks={tasks} setTasks={setTasks}
              updateTask={updateTask} addTask={addTask} deleteTask={deleteTask}
              routine={routine} setRoutine={setRoutine}
              materials={materials} setMaterials={setMaterials}
              onOpenSubject={openSubject}
            />
          )}
          {view === 'progress' && (
            <ProgressView
              outlines={outlines} notes={notes}
              flashcardsRule={flashcardsRule} flashcardsNotes={flashcardsNotes}
              mcqs={mcqs} mcqResults={mcqResults}
              tasks={tasks} materials={materials}
              savedExplanations={savedExplanations} simplifications={simplifications}
              onOpenSubject={openSubject}
            />
          )}
          {view === 'notes' && <PlaceholderView view={view} setView={goToNav} />}
        </div>
      </main>
    </div>
  );
}

/* =========================================================================
   SIDEBAR
   ========================================================================= */
function Sidebar({ view, setView, daysRemaining, currentUser, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);
  const initials = currentUser ? (currentUser.name || currentUser.email).slice(0, 2).toUpperCase() : '';
  return (
    <aside className="w-60 shrink-0 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      <div className="px-5 py-5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white grid place-items-center"><GraduationCap className="w-5 h-5" /></div>
          <div>
            <div className="font-semibold text-slate-900 text-sm">Bar Prep Studio</div>
            <div className="text-[11px] text-slate-500">UBE · July 2026</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon; const active = view === item.id;
          return (
            <button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Icon className="w-4 h-4" />{item.label}
            </button>
          );
        })}
      </nav>

      {currentUser && (
        <div className="px-3 py-3 border-t border-slate-200 relative">
          <button onClick={() => setShowMenu(!showMenu)} className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 transition text-left">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white grid place-items-center text-[11px] font-bold shrink-0">{initials}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-900 truncate">{currentUser.name}</div>
              <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition ${showMenu ? 'rotate-90' : ''}`} />
          </button>
          {showMenu && (
            <div className="absolute bottom-full left-3 right-3 mb-1 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-10">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-[10px] uppercase text-slate-500 font-medium tracking-wide">Signed in as</div>
                <div className="text-xs text-slate-700 truncate mt-0.5">{currentUser.email}</div>
              </div>
              <button onClick={() => { setShowMenu(false); onLogout(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition">
                <LogOut className="w-4 h-4" />Sign out
              </button>
            </div>
          )}
        </div>
      )}

      <div className="p-4 border-t border-slate-200">
        <div className="text-[11px] text-slate-500 mb-1 uppercase tracking-wide">Exam countdown</div>
        <div className="flex items-baseline gap-1"><div className="text-2xl font-bold text-slate-900">{daysRemaining}</div><div className="text-xs text-slate-500">days left</div></div>
        <div className="text-[11px] text-slate-400 mt-1">Tuesday, July 28, 2026</div>
      </div>
    </aside>
  );
}

/* =========================================================================
   DASHBOARD
   ========================================================================= */
function DashboardView({ tasks, toggleTask, daysRemaining, subjectsStarted, mcqAccuracy, flashcardsDue, onSubjectClick }) {
  const todayTasks = (tasks || []).filter(t => isTodayISO(t.scheduledFor));
  const completedToday = todayTasks.filter(t => t.status === 'completed').length;
  const totalToday = todayTasks.length;
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-slate-500 uppercase tracking-wide">Command Center</div>
        <h1 className="text-3xl font-bold text-slate-900 mt-0.5">Bar Prep Studio</h1>
        <p className="text-sm text-slate-500 mt-1">Your command center — everything that matters today, in one view.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Flame} label="Days Remaining" value={daysRemaining} sub="until UBE" accent="bg-rose-50 text-rose-600" />
        <StatCard icon={BookOpen} label="Subjects Started" value={`${subjectsStarted}/9`} sub={`${9 - subjectsStarted} to begin`} accent="bg-blue-50 text-blue-600" />
        <StatCard icon={Target} label="MCQ Accuracy" value={`${mcqAccuracy}%`} sub="across 342 questions" accent="bg-emerald-50 text-emerald-600" />
        <StatCard icon={Repeat} label="Flashcards Due" value={flashcardsDue} sub="review today" accent="bg-amber-50 text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-500" /><h3 className="text-sm font-semibold text-slate-900">Today's Tasks</h3></div>
              <p className="text-xs text-slate-500 mt-0.5">{completedToday} of {totalToday} complete</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${totalToday > 0 ? (completedToday / totalToday) * 100 : 0}%` }} />
              </div>
              <span className="text-xs text-slate-500 font-medium">{totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0}%</span>
            </div>
          </div>
          {totalToday === 0 ? (
            <div className="py-6 text-center border-2 border-dashed border-slate-200 rounded-md">
              <div className="text-sm text-slate-600">No tasks scheduled for today.</div>
              <p className="text-xs text-slate-500 mt-1">Go to Plans to build or adjust your schedule.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {todayTasks.map(task => {
                const subject = SUBJECTS.find(s => s.name === (task.subjectName || task.subject));
                const done = task.status === 'completed';
                return (
                  <div key={task.id} className="py-3 flex items-center gap-3 group">
                    <button onClick={() => toggleTask(task.id)} className="shrink-0 transition">
                      {done ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Circle className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm transition ${done ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {subject && <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${subject.color}`}>{task.subjectName || task.subject}</span>}
                        <span className="text-[11px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{task.minutes} min</span>
                        {task.status && task.status !== 'not_started' && task.status !== 'completed' && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${TASK_STATUSES.find(s => s.id === task.status)?.color || ''}`}>
                            {TASK_STATUSES.find(s => s.id === task.status)?.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4"><AlertTriangle className="w-4 h-4 text-slate-500" /><h3 className="text-sm font-semibold text-slate-900">Weak Areas</h3></div>
          <div className="space-y-2">
            {WEAK_AREAS.map((w, i) => {
              const subject = SUBJECTS.find(s => s.name === w.subject);
              return (
                <button key={i} onClick={() => subject && onSubjectClick(subject.id)} className="w-full text-left p-2.5 rounded-md border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-medium text-slate-800 truncate">{w.topic}</div>
                    <div className="text-xs text-rose-600 font-medium">{w.accuracy}%</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {subject && <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${subject.color}`}>{w.subject}</span>}
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-rose-500" style={{ width: `${w.accuracy}%` }} /></div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4"><BookOpen className="w-4 h-4 text-slate-500" /><h3 className="text-sm font-semibold text-slate-900">Subjects</h3><span className="text-xs text-slate-400 ml-auto">Click any subject to open</span></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {SUBJECTS.filter(s => !s.disabled).map(subject => (
            <button key={subject.id} onClick={() => onSubjectClick(subject.id)} className="p-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:shadow-sm bg-white text-left transition group">
              <div className="flex items-center justify-between mb-1.5">
                <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${subject.color}`}>{subject.short}</div>
                {subject.started && <CircleDot className="w-3 h-3 text-emerald-500" />}
              </div>
              <div className="text-xs font-medium text-slate-800 group-hover:text-slate-900">{subject.name}</div>
              <div className="text-[10px] text-slate-400 mt-1">{subject.accuracy != null ? `${subject.accuracy}% MCQ` : 'Not started'}</div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-4 h-4 text-slate-500" /><h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3></div>
        <div className="space-y-2">
          {RECENT_ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-1.5 text-sm">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium shrink-0">{a.type}</span>
              <span className="text-slate-700 truncate flex-1">{a.label}</span>
              <span className="text-[11px] text-slate-400 shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* =========================================================================
   SUBJECTS GRID
   ========================================================================= */
function SubjectsGridView({ onOpen }) {
  const [search, setSearch] = useState('');
  const filtered = SUBJECTS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs text-slate-500 uppercase tracking-wide">All Subjects</div>
        <h1 className="text-3xl font-bold text-slate-900 mt-0.5">Subjects</h1>
        <p className="text-sm text-slate-500 mt-1">Click any subject to open its workspace.</p>
      </div>
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search subjects..." className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:border-slate-400" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(subject => {
          const topicCount = TOPICS[subject.id]?.length || 0;
          return (
            <button key={subject.id} onClick={() => onOpen(subject.id)} disabled={subject.disabled}
              className={`text-left p-5 rounded-xl border bg-white transition ${subject.disabled ? 'border-slate-200 opacity-50 cursor-not-allowed' : 'border-slate-200 hover:border-slate-400 hover:shadow-sm'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border ${subject.color}`}>{subject.short}</span>
                  <div className="text-lg font-semibold text-slate-900 mt-2">{subject.name}</div>
                </div>
                {!subject.disabled && <ChevronRight className="w-4 h-4 text-slate-400" />}
              </div>
              <div className="text-xs text-slate-500 mb-3">{topicCount} topics</div>
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center justify-between text-[11px]"><span className="text-slate-500">Progress</span><span className="text-slate-700 font-medium">{subject.progress}%</span></div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all ${subject.progress >= 70 ? 'bg-emerald-500' : subject.progress >= 30 ? 'bg-amber-500' : subject.progress > 0 ? 'bg-rose-500' : 'bg-slate-300'}`} style={{ width: `${subject.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <StatusBadge status={subject.status} />
                {subject.accuracy != null && <span className="text-slate-500">{subject.accuracy}% MCQ</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    'Ready': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'In progress': 'bg-amber-50 text-amber-700 border-amber-200',
    'Not started': 'bg-slate-50 text-slate-500 border-slate-200',
    'Coming soon': 'bg-pink-50 text-pink-700 border-pink-200'
  };
  return <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${styles[status] || styles['Not started']}`}>{status}</span>;
}

/* =========================================================================
   SUBJECT PAGE
   ========================================================================= */
function SubjectPage(props) {
  const { subjectId, activeTopic, setActiveTopic, activeTab, setActiveTab, onBack } = props;
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const topics = TOPICS[subjectId] || [];
  const tabMeta = SUBJECT_TABS.find(t => t.id === activeTab) || SUBJECT_TABS[0];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="p-1.5 rounded hover:bg-slate-100 text-slate-600"><ArrowLeft className="w-4 h-4" /></button>
        <span className="text-xs text-slate-500">Subjects</span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-xs text-slate-800 font-medium">{subject.name}</span>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${subject.color}`}>{subject.short}</span>
            {subject.started && <StatusBadge status={subject.status} />}
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{subject.name}</h1>
          <p className="text-sm text-slate-500 mt-1">Your study system for this subject — outline, cards, MCQs, essays, notes, and simplifier, all topic-scoped.</p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-xs text-slate-500">Progress</div>
          <div className="text-2xl font-bold text-slate-900">{subject.progress}%</div>
          <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-emerald-500" style={{ width: `${subject.progress}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <div className="flex items-center gap-2 mb-3"><Layers className="w-4 h-4 text-slate-500" /><h3 className="text-sm font-semibold text-slate-900">Topics</h3><span className="text-[11px] text-slate-400 ml-auto">{topics.length}</span></div>
            <div className="space-y-1">
              {topics.map(topic => {
                const active = topic === activeTopic;
                return (
                  <button key={topic} onClick={() => setActiveTopic(topic)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-sm transition ${active ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'}`}>
                    {topic}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 px-2 pt-2">
            <div className="flex flex-wrap gap-0.5 border-b border-slate-200 -mx-2 px-2 overflow-x-auto">
              {SUBJECT_TABS.map(tab => {
                const Icon = tab.icon; const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 text-sm flex items-center gap-1.5 border-b-2 transition -mb-px whitespace-nowrap ${active ? 'border-slate-900 text-slate-900 font-medium' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                    <Icon className="w-3.5 h-3.5" />{tab.label}
                  </button>
                );
              })}
            </div>
            <div className="px-3 py-2 flex items-center gap-1.5 text-[11px] text-slate-500">
              <span>{subject.name}</span><ChevronRight className="w-3 h-3" />
              <span className="text-slate-700 font-medium">{activeTopic}</span><ChevronRight className="w-3 h-3" />
              <span className="text-slate-700 font-medium">{tabMeta.label}</span>
            </div>
          </div>

          {activeTab === 'outline' && <RuleOutlineTab key={`ol:${subjectId}:${activeTopic}`} subject={subject} topic={activeTopic} getOutline={props.getOutline} saveOutline={props.saveOutline} />}
          {activeTab === 'notes' && <SubjectNotesTab key={`nt:${subjectId}:${activeTopic}`} subject={subject} topic={activeTopic} getNote={props.getNote} saveNote={props.saveNote} />}
          {activeTab === 'flashcards' && <FlashcardsTab key={`fc:${subjectId}:${activeTopic}`} subject={subject} topic={activeTopic} flashcardsRule={props.flashcardsRule} setFlashcardsRule={props.setFlashcardsRule} flashcardsNotes={props.flashcardsNotes} setFlashcardsNotes={props.setFlashcardsNotes} />}
          {activeTab === 'mcqs' && <MCQsTab key={`mq:${subjectId}:${activeTopic}`} subject={subject} topic={activeTopic} mcqs={props.mcqs} setMcqs={props.setMcqs} mcqResults={props.mcqResults} setMcqResults={props.setMcqResults} />}
          {activeTab === 'explain' && <ExplanationMachineTab key={`ex:${subjectId}:${activeTopic}`} subject={subject} topic={activeTopic} savedExplanations={props.savedExplanations} setSavedExplanations={props.setSavedExplanations} />}
          {activeTab === 'simplifier' && <BPSSimplifierTab key={`sim:${subjectId}:${activeTopic}`} subject={subject} topic={activeTopic} simplifications={props.simplifications} setSimplifications={props.setSimplifications} getOutline={props.getOutline} getNote={props.getNote} saveNote={props.saveNote} />}
          {(activeTab === 'essays' || activeTab === 'outside') && <TabContent subject={subject} topic={activeTopic} tab={tabMeta} />}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   RULE OUTLINE TAB
   ========================================================================= */
function RuleOutlineTab({ subject, topic, getOutline, saveOutline }) {
  const stored = getOutline(subject.id, topic);
  const [mode, setMode] = useState('view');
  const [draft, setDraft] = useState(stored?.content || '');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => { setDraft(stored?.content || ''); setMode('view'); setSearch(''); }, [subject.id, topic]); // eslint-disable-line

  const handleSave = () => { saveOutline(subject.id, topic, draft); setMode('view'); showToast('Outline saved.'); };
  const handleCancel = () => { setDraft(stored?.content || ''); setMode('view'); };
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2000); };
  const highlightedHtml = (text) => {
    const escaped = escapeHtml(text);
    if (!search.trim()) return escaped;
    try {
      const re = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return escaped.replace(re, '<mark class="bg-amber-200 text-amber-900 px-0.5 rounded">$1</mark>');
    } catch { return escaped; }
  };
  const hasContent = (stored?.content || '').trim().length > 0;
  const matchCount = search && hasContent ? (stored.content.match(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length : 0;

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-lg bg-slate-900 text-white grid place-items-center"><ScrollText className="w-5 h-5" /></div>
        <div className="flex-1">
          <div className="text-xs text-slate-500 uppercase tracking-wide">{subject.name} → {topic}</div>
          <h2 className="text-lg font-semibold text-slate-900">Rule Outline</h2>
        </div>
        {stored?.updatedAt && <div className="text-[11px] text-slate-400 hidden md:block">Saved {fmtRelative(stored.updatedAt)}</div>}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="flex-1 relative min-w-[200px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search within this outline..." disabled={mode === 'edit'}
            className="w-full pl-9 pr-8 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-slate-400 disabled:bg-slate-50 disabled:opacity-60" />
          {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-100 rounded"><X className="w-3 h-3 text-slate-400" /></button>}
        </div>
        {search && hasContent && mode === 'view' && <span className="text-[11px] text-slate-500 px-2 py-1 bg-slate-50 rounded border border-slate-200">{matchCount} match{matchCount !== 1 ? 'es' : ''}</span>}
        <div className="ml-auto flex items-center gap-2">
          {mode === 'view' && <Button icon={Edit3} onClick={() => setMode('edit')}>{hasContent ? 'Edit' : 'Add outline'}</Button>}
          {mode === 'edit' && (<>
            <Button variant="primary" icon={Save} onClick={handleSave}>Save</Button>
            <Button icon={X} onClick={handleCancel}>Cancel</Button>
          </>)}
        </div>
      </div>

      {mode === 'view' && (
        <div className="flex flex-wrap gap-2 mb-4">
          <Button icon={Sparkles} onClick={() => showToast('Generate flashcards — use the Flashcards tab')}>Generate flashcards</Button>
          <Button icon={Wand2} onClick={() => showToast('Send to Simplifier — use the Simplifier tab')}>Send to Simplifier</Button>
          <Button icon={GitBranch} onClick={() => showToast('Compare with BPS — use the Outline Lab')}>Compare with BPS Outline</Button>
        </div>
      )}

      {mode === 'edit' ? (
        <div>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)}
            placeholder={`# ${subject.name} — ${topic}\n\n## Black-letter rule\n...\n\n## Elements\n1. ...\n2. ...`}
            className="w-full h-[540px] p-4 text-[13px] font-mono border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 resize-none leading-relaxed" />
          <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1"><Info className="w-3 h-3" /> Markdown-friendly plain text. Paste from any source.</span>
            <span>{draft.length.toLocaleString()} chars · {draft.split('\n').length} lines</span>
          </div>
        </div>
      ) : hasContent ? (
        <div className="text-[13px] font-mono whitespace-pre-wrap leading-relaxed p-4 bg-slate-50 rounded-md border border-slate-100 max-h-[600px] overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: highlightedHtml(stored.content) }} />
      ) : (
        <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-md">
          <ScrollText className="w-8 h-8 mx-auto text-slate-300 mb-3" />
          <div className="text-sm font-medium text-slate-700 mb-1">No outline yet</div>
          <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">Click <strong>Add outline</strong> to paste your rule statement, elements, defenses, and bar traps for {topic}.</p>
          <Button variant="primary" icon={Edit3} onClick={() => setMode('edit')}>Add outline</Button>
        </div>
      )}
      {toast && <Toast message={toast} />}
    </Card>
  );
}

/* =========================================================================
   NOTES TAB
   ========================================================================= */
function SubjectNotesTab({ subject, topic, getNote, saveNote }) {
  const stored = getNote(subject.id, topic);
  const [draft, setDraft] = useState(stored?.content || '');
  const [important, setImportant] = useState(stored?.important || false);
  const [confusing, setConfusing] = useState(stored?.confusing || false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDraft(stored?.content || ''); setImportant(stored?.important || false); setConfusing(stored?.confusing || false); setDirty(false); setSearch('');
  }, [subject.id, topic]); // eslint-disable-line

  const onChangeContent = (val) => { setDraft(val); setDirty(true); };
  const toggleImportant = () => { const next = !important; setImportant(next); saveNote(subject.id, topic, { content: draft, important: next, confusing }); };
  const toggleConfusing = () => { const next = !confusing; setConfusing(next); saveNote(subject.id, topic, { content: draft, important, confusing: next }); };
  const handleSave = () => { saveNote(subject.id, topic, { content: draft, important, confusing }); setDirty(false); showToast('Notes saved.'); };
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2000); };
  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const matches = search && draft ? (draft.match(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length : 0;

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-lg bg-slate-900 text-white grid place-items-center"><StickyNote className="w-5 h-5" /></div>
        <div className="flex-1">
          <div className="text-xs text-slate-500 uppercase tracking-wide">{subject.name} → {topic}</div>
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            Notes {important && <Star className="w-4 h-4 fill-amber-400 text-amber-400" />} {confusing && <AlertOctagon className="w-4 h-4 text-rose-500" />}
          </h2>
        </div>
        {stored?.updatedAt && <div className="text-[11px] text-slate-400 hidden md:block">Saved {fmtRelative(stored.updatedAt)}</div>}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="flex-1 relative min-w-[200px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search within these notes..." className="w-full pl-9 pr-8 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:border-slate-400" />
          {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-100 rounded"><X className="w-3 h-3 text-slate-400" /></button>}
        </div>
        {search && matches > 0 && <span className="text-[11px] text-slate-500 px-2 py-1 bg-slate-50 rounded border border-slate-200">{matches} match{matches !== 1 ? 'es' : ''}</span>}
        <div className="ml-auto flex items-center gap-2">
          <button onClick={toggleImportant} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition ${important ? 'bg-amber-50 text-amber-700 border-amber-200' : 'text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
            <Star className={`w-3.5 h-3.5 ${important ? 'fill-amber-500 text-amber-500' : ''}`} />Important
          </button>
          <button onClick={toggleConfusing} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition ${confusing ? 'bg-rose-50 text-rose-700 border-rose-200' : 'text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
            <AlertOctagon className="w-3.5 h-3.5" />Confusing
          </button>
          <Button variant="primary" icon={Save} onClick={handleSave} disabled={!dirty}>{dirty ? 'Save' : 'Saved'}</Button>
        </div>
      </div>

      <textarea value={draft} onChange={(e) => onChangeContent(e.target.value)}
        placeholder={`Lecture notes, study notes, or anything else you want to capture for ${topic}.\n\nPaste-friendly. Plain text. Fast.`}
        className="w-full h-[440px] p-4 text-[13px] border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 resize-none leading-relaxed" />
      <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
        <span className="flex items-center gap-1"><Info className="w-3 h-3" />{dirty ? 'Unsaved changes.' : 'All changes saved.'}</span>
        <span>{wordCount.toLocaleString()} words · {draft.length.toLocaleString()} chars</span>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="text-[10px] uppercase text-slate-500 font-medium mb-2 tracking-wide">Actions</div>
        <div className="flex flex-wrap gap-2">
          <Button icon={Repeat} onClick={() => showToast('Convert to Flashcards — use the Flashcards tab')}>Convert to Flashcards</Button>
          <Button icon={ScrollText} onClick={() => showToast('Send to Outline — use the Rule Outline tab')}>Send to Outline</Button>
          <Button icon={Wand2} onClick={() => showToast('Simplify with BPS — use the Simplifier tab')}>Simplify with BPS</Button>
          <Button icon={Brain} onClick={() => showToast('Ask Explanation Machine — use the Explanation Machine tab')}>Ask Explanation Machine</Button>
        </div>
      </div>
      {toast && <Toast message={toast} />}
    </Card>
  );
}

/* =========================================================================
   FLASHCARDS TAB
   ========================================================================= */
function FlashcardsTab({ subject, topic, flashcardsRule, setFlashcardsRule, flashcardsNotes, setFlashcardsNotes }) {
  const [deck, setDeck] = useState('rule');
  const [filter, setFilter] = useState('due');
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newSource, setNewSource] = useState('');
  const [toast, setToast] = useState(null);

  const allCards = deck === 'rule' ? flashcardsRule : flashcardsNotes;
  const setAllCards = deck === 'rule' ? setFlashcardsRule : setFlashcardsNotes;
  const scopeCards = useMemo(() => allCards.filter(c => c.subjectId === subject.id && c.topic === topic), [allCards, subject.id, topic]);
  const visibleCards = useMemo(() => filter === 'due' ? scopeCards.filter(c => (c.dueAt || 0) <= Date.now()) : scopeCards, [scopeCards, filter]);

  useEffect(() => { setIdx(0); setRevealed(false); }, [subject.id, topic, deck, filter]);
  useEffect(() => { if (idx >= visibleCards.length) setIdx(0); }, [visibleCards.length]); // eslint-disable-line

  const current = visibleCards[idx] || null;
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2000); };

  const rate = (quality) => {
    if (!current) return;
    const u = { ...current, reviews: (current.reviews || 0) + 1, lastReviewed: Date.now() };
    if (quality === 'again') { u.interval = 0.01; u.ease = Math.max(1.3, (u.ease || 2.5) - 0.2); }
    else if (quality === 'hard') { u.interval = Math.max(1, (u.interval || 1) * 1.2); u.ease = Math.max(1.3, (u.ease || 2.5) - 0.15); }
    else if (quality === 'good') { u.interval = Math.max(1, (u.interval || 1) * (u.ease || 2.5)); }
    else if (quality === 'easy') { u.interval = Math.max(1, (u.interval || 1) * (u.ease || 2.5) * 1.3); u.ease = (u.ease || 2.5) + 0.15; }
    u.dueAt = Date.now() + u.interval * 86400000;
    setAllCards(prev => prev.map(c => c.id === u.id ? u : c));
    setRevealed(false);
    setIdx(i => (i + 1 >= visibleCards.length ? 0 : i + 1));
  };

  const addCard = () => {
    if (!newFront.trim() || !newBack.trim()) return;
    const card = { id: uid('fc'), deck, subjectId: subject.id, topic, front: newFront.trim(), back: newBack.trim(), source: newSource.trim() || undefined, ...srsInit() };
    setAllCards(prev => [...prev, card]);
    setNewFront(''); setNewBack(''); setNewSource(''); setAdding(false);
    showToast('Card added.');
  };
  const deleteCard = (id) => { setAllCards(prev => prev.filter(c => c.id !== id)); showToast('Card deleted.'); setRevealed(false); };
  const dueCount = scopeCards.filter(c => (c.dueAt || 0) <= Date.now()).length;

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-lg bg-slate-900 text-white grid place-items-center"><Repeat className="w-5 h-5" /></div>
        <div className="flex-1">
          <div className="text-xs text-slate-500 uppercase tracking-wide">{subject.name} → {topic}</div>
          <h2 className="text-lg font-semibold text-slate-900">Flashcards</h2>
        </div>
        <div className="text-[11px] text-slate-500 hidden md:flex items-center gap-3"><span>{scopeCards.length} total</span><span className="text-amber-600 font-medium">{dueCount} due</span></div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex rounded-md border border-slate-200 bg-slate-50 p-0.5">
          <button onClick={() => setDeck('rule')} className={`px-3 py-1 text-xs rounded transition ${deck === 'rule' ? 'bg-white text-slate-900 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'}`}>Rule Deck</button>
          <button onClick={() => setDeck('notes')} className={`px-3 py-1 text-xs rounded transition ${deck === 'notes' ? 'bg-white text-slate-900 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'}`}>Notes Deck</button>
        </div>
        <div className="flex rounded-md border border-slate-200 bg-slate-50 p-0.5">
          <button onClick={() => setFilter('due')} className={`px-3 py-1 text-xs rounded transition ${filter === 'due' ? 'bg-white text-slate-900 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'}`}>Due only</button>
          <button onClick={() => setFilter('all')} className={`px-3 py-1 text-xs rounded transition ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'}`}>All cards</button>
        </div>
        <div className="text-xs text-slate-500">{visibleCards.length > 0 ? `Card ${idx + 1} of ${visibleCards.length}` : '0 cards'}</div>
        <div className="ml-auto flex items-center gap-2">
          <Button icon={Sparkles} onClick={() => showToast('Generate from Outline — arriving with cross-tab wiring')}>Generate from Outline</Button>
          <Button icon={Sparkles} onClick={() => showToast('Generate from Notes — arriving with cross-tab wiring')}>Generate from Notes</Button>
          <Button variant="primary" icon={Plus} onClick={() => setAdding(!adding)}>Add card</Button>
        </div>
      </div>

      {adding && (
        <div className="mb-4 p-4 bg-slate-50 rounded-md border border-slate-200 space-y-2">
          <div className="text-[10px] uppercase text-slate-500 font-medium tracking-wide">New {deck === 'rule' ? 'Rule' : 'Notes'} card</div>
          <input value={newFront} onChange={(e) => setNewFront(e.target.value)} placeholder="Front (question / rule name)" className="w-full px-3 py-2 text-sm rounded border border-slate-200 focus:outline-none focus:border-slate-400" />
          <textarea value={newBack} onChange={(e) => setNewBack(e.target.value)} placeholder="Back (answer / rule statement)" className="w-full px-3 py-2 text-sm rounded border border-slate-200 focus:outline-none focus:border-slate-400 h-20 resize-none" />
          <input value={newSource} onChange={(e) => setNewSource(e.target.value)} placeholder="Source (optional)" className="w-full px-3 py-2 text-sm rounded border border-slate-200 focus:outline-none focus:border-slate-400" />
          <div className="flex gap-2 pt-1">
            <Button variant="primary" icon={Save} onClick={addCard}>Add card</Button>
            <Button icon={X} onClick={() => { setAdding(false); setNewFront(''); setNewBack(''); setNewSource(''); }}>Cancel</Button>
          </div>
        </div>
      )}

      {current ? (
        <div>
          <div onClick={() => setRevealed(!revealed)} className="min-h-[240px] rounded-xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 cursor-pointer hover:border-slate-300 transition flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] uppercase text-slate-400 tracking-wide font-medium">{revealed ? 'Back' : 'Front'}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${deck === 'rule' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{deck === 'rule' ? 'Rule' : 'Notes'}</span>
              {current.source && <span className="text-[10px] text-slate-400 ml-auto">{current.source}</span>}
            </div>
            <div className="text-base text-slate-800 whitespace-pre-wrap leading-relaxed flex-1">{revealed ? current.back : current.front}</div>
            {!revealed && <div className="text-xs text-slate-400 mt-4 italic">Click to reveal answer</div>}
          </div>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {revealed ? (<>
              <Button onClick={() => rate('again')}>Again</Button>
              <Button onClick={() => rate('hard')}>Hard</Button>
              <Button variant="primary" onClick={() => rate('good')}>Good</Button>
              <Button onClick={() => rate('easy')}>Easy</Button>
            </>) : <Button variant="primary" icon={Eye} onClick={() => setRevealed(true)}>Show answer</Button>}
            <div className="ml-auto flex items-center gap-1">
              <button onClick={() => { setRevealed(false); setIdx(i => (i - 1 + visibleCards.length) % visibleCards.length); }} className="p-1.5 rounded hover:bg-slate-100"><ChevronLeft className="w-4 h-4 text-slate-500" /></button>
              <button onClick={() => { setRevealed(false); setIdx(i => (i + 1) % visibleCards.length); }} className="p-1.5 rounded hover:bg-slate-100"><ChevronRight className="w-4 h-4 text-slate-500" /></button>
              <button onClick={() => deleteCard(current.id)} className="p-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-md">
          <Repeat className="w-8 h-8 mx-auto text-slate-300 mb-3" />
          <div className="text-sm font-medium text-slate-700 mb-1">{filter === 'due' && scopeCards.length > 0 ? 'No cards due right now' : 'No cards in this deck yet'}</div>
          <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
            {filter === 'due' && scopeCards.length > 0 ? `Switch to "All cards" to review everything.` : `Add your first card or switch to the other deck.`}
          </p>
          {filter === 'due' && scopeCards.length > 0 && <Button variant="primary" onClick={() => setFilter('all')}>View all cards</Button>}
          {scopeCards.length === 0 && <Button variant="primary" icon={Plus} onClick={() => setAdding(true)}>Add first card</Button>}
        </div>
      )}

      {scopeCards.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="text-[10px] uppercase text-slate-500 font-medium tracking-wide mb-3">Deck contents — {deck === 'rule' ? 'Rule' : 'Notes'} · {scopeCards.length} card{scopeCards.length !== 1 ? 's' : ''}</div>
          <div className="space-y-1 max-h-72 overflow-y-auto">
            {scopeCards.map((c) => {
              const due = (c.dueAt || 0) <= Date.now();
              return (
                <div key={c.id} className="group flex items-start gap-2 py-2 px-2 rounded hover:bg-slate-50 transition">
                  <button onClick={() => { setIdx(visibleCards.findIndex(v => v.id === c.id)); setRevealed(false); }} className="flex-1 min-w-0 text-left">
                    <div className="text-sm text-slate-800 truncate">{c.front}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400">{c.reviews || 0} review{(c.reviews || 0) !== 1 ? 's' : ''}</span>
                      {due ? <span className="text-[10px] text-amber-600 font-medium">Due now</span> : <span className="text-[10px] text-slate-400">Due {fmtRelative(c.dueAt)}</span>}
                      {c.source && <span className="text-[10px] text-slate-400">· {c.source}</span>}
                    </div>
                  </button>
                  <button onClick={() => deleteCard(c.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {toast && <Toast message={toast} />}
    </Card>
  );
}

/* =========================================================================
   MCQs TAB
   ========================================================================= */
function MCQsTab({ subject, topic, mcqs, setMcqs, mcqResults, setMcqResults }) {
  const [mode, setMode] = useState('random');
  const [current, setCurrent] = useState(null);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(null);
  const [newQ, setNewQ] = useState({ question: '', choices: ['', '', '', ''], correct: 0, explanation: '', tag: '' });

  const scopeMcqs = useMemo(() => mcqs.filter(m => m.subjectId === subject.id && m.topic === topic), [mcqs, subject.id, topic]);
  const answeredIds = useMemo(() => new Set(mcqResults.map(r => r.mcqId)), [mcqResults]);
  const pool = useMemo(() => mode === 'unanswered' ? scopeMcqs.filter(m => !answeredIds.has(m.id)) : scopeMcqs, [scopeMcqs, mode, answeredIds]);

  const pickNext = () => {
    if (pool.length === 0) { setCurrent(null); return; }
    let next;
    if (mode === 'random' || mode === 'unanswered') next = pool[Math.floor(Math.random() * pool.length)];
    else { const idx = current ? pool.findIndex(p => p.id === current.id) : -1; next = pool[(idx + 1) % pool.length]; }
    setCurrent(next); setSelected(null); setSubmitted(false);
  };

  useEffect(() => { pickNext(); }, [subject.id, topic, mode]); // eslint-disable-line

  const submit = () => {
    if (selected == null || !current) return;
    const correct = selected === current.correct;
    setSubmitted(true);
    setMcqResults(prev => [...prev, { id: uid('r'), mcqId: current.id, correct, selectedIndex: selected, timestamp: Date.now() }]);
  };

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2000); };

  const addMcq = () => {
    if (!newQ.question.trim() || newQ.choices.some(c => !c.trim()) || !newQ.explanation.trim()) { showToast('Fill in all fields.'); return; }
    const q = { id: uid('mcq'), subjectId: subject.id, topic, question: newQ.question.trim(), choices: [...newQ.choices], correct: newQ.correct, explanation: newQ.explanation.trim(), tag: newQ.tag.trim() || topic };
    setMcqs(prev => [...prev, q]);
    setNewQ({ question: '', choices: ['', '', '', ''], correct: 0, explanation: '', tag: '' });
    setAdding(false); showToast('Question added.');
  };

  const scopeResults = useMemo(() => mcqResults.filter(r => scopeMcqs.some(m => m.id === r.mcqId)), [mcqResults, scopeMcqs]);
  const attempted = scopeResults.length;
  const correctCount = scopeResults.filter(r => r.correct).length;
  const accuracy = attempted > 0 ? Math.round((correctCount / attempted) * 100) : null;

  const byTag = useMemo(() => {
    const m = {};
    scopeResults.forEach(r => {
      const q = mcqs.find(q => q.id === r.mcqId); if (!q) return;
      const k = q.tag || topic;
      if (!m[k]) m[k] = { correct: 0, total: 0 };
      m[k].total += 1; if (r.correct) m[k].correct += 1;
    });
    return m;
  }, [scopeResults, mcqs, topic]);

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-lg bg-slate-900 text-white grid place-items-center"><Target className="w-5 h-5" /></div>
        <div className="flex-1">
          <div className="text-xs text-slate-500 uppercase tracking-wide">{subject.name} → {topic}</div>
          <h2 className="text-lg font-semibold text-slate-900">MCQs</h2>
        </div>
        <div className="text-[11px] text-slate-500 hidden md:flex items-center gap-3">
          <span>{scopeMcqs.length} question{scopeMcqs.length !== 1 ? 's' : ''}</span>
          {accuracy != null && <span className={`font-medium ${accuracy >= 75 ? 'text-emerald-600' : accuracy >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>{accuracy}% accuracy</span>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex rounded-md border border-slate-200 bg-slate-50 p-0.5">
          {['random', 'unanswered', 'all'].map(m => (
            <button key={m} onClick={() => setMode(m)} className={`px-3 py-1 text-xs rounded transition ${mode === m ? 'bg-white text-slate-900 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'}`}>
              {m === 'random' ? 'Random' : m === 'unanswered' ? 'Unanswered only' : 'All questions'}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button icon={RefreshCw} onClick={pickNext} disabled={pool.length === 0}>Next question</Button>
          <Button variant="primary" icon={Plus} onClick={() => setAdding(!adding)}>Add question</Button>
        </div>
      </div>

      {adding && (
        <div className="mb-4 p-4 bg-slate-50 rounded-md border border-slate-200 space-y-2">
          <div className="text-[10px] uppercase text-slate-500 font-medium tracking-wide">New MCQ</div>
          <textarea value={newQ.question} onChange={(e) => setNewQ({ ...newQ, question: e.target.value })} placeholder="Question stem..." className="w-full p-2 text-sm border border-slate-200 rounded h-20 focus:outline-none focus:border-slate-400" />
          {newQ.choices.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="radio" checked={newQ.correct === i} onChange={() => setNewQ({ ...newQ, correct: i })} className="shrink-0" />
              <span className="text-xs text-slate-500 w-5">{String.fromCharCode(65 + i)}.</span>
              <input value={c} onChange={(e) => { const nc = [...newQ.choices]; nc[i] = e.target.value; setNewQ({ ...newQ, choices: nc }); }} placeholder={`Choice ${String.fromCharCode(65 + i)}`} className="flex-1 text-sm px-2 py-1 border border-slate-200 rounded focus:outline-none focus:border-slate-400" />
            </div>
          ))}
          <textarea value={newQ.explanation} onChange={(e) => setNewQ({ ...newQ, explanation: e.target.value })} placeholder="Explanation..." className="w-full p-2 text-sm border border-slate-200 rounded h-20 focus:outline-none focus:border-slate-400" />
          <input value={newQ.tag} onChange={(e) => setNewQ({ ...newQ, tag: e.target.value })} placeholder={`Tag (default: ${topic})`} className="w-full text-sm px-2 py-1 border border-slate-200 rounded focus:outline-none focus:border-slate-400" />
          <div className="flex gap-2 pt-1">
            <Button variant="primary" icon={Save} onClick={addMcq}>Save question</Button>
            <Button icon={X} onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {!current ? (
        <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-md">
          <Target className="w-8 h-8 mx-auto text-slate-300 mb-3" />
          <div className="text-sm font-medium text-slate-700 mb-1">{scopeMcqs.length === 0 ? 'No questions for this topic yet' : 'No questions match this mode'}</div>
          <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">{scopeMcqs.length === 0 ? 'Seeded MCQs available for Evidence → Hearsay and Torts → Negligence.' : 'Try "All questions" or "Random".'}</p>
          {scopeMcqs.length === 0 && <Button variant="primary" icon={Plus} onClick={() => setAdding(true)}>Add first question</Button>}
          {scopeMcqs.length > 0 && mode === 'unanswered' && <Button variant="primary" onClick={() => setMode('all')}>See all questions</Button>}
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center gap-2 flex-wrap">
            {current.tag && <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">{current.tag}</span>}
            {answeredIds.has(current.id) && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Previously answered</span>}
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-md">
            <div className="text-[15px] text-slate-800 whitespace-pre-wrap leading-relaxed mb-4">{current.question}</div>
            <div className="space-y-2">
              {current.choices.map((c, i) => {
                const isCorrect = submitted && i === current.correct;
                const isWrong = submitted && i === selected && i !== current.correct;
                const isSelected = selected === i && !submitted;
                return (
                  <button key={i} onClick={() => !submitted && setSelected(i)} disabled={submitted}
                    className={`w-full text-left p-3 rounded-md border text-sm transition ${
                      isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-900' :
                      isWrong ? 'border-rose-500 bg-rose-50 text-rose-900' :
                      isSelected ? 'border-slate-500 bg-slate-50' :
                      'border-slate-200 hover:border-slate-300 bg-white'
                    } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}>
                    <span className="inline-block w-5 font-medium text-slate-500">{String.fromCharCode(65 + i)}.</span>{c}
                    {isCorrect && <CheckCircle2 className="w-4 h-4 inline-block ml-2 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
            {!submitted ? (
              <div className="mt-4 flex gap-2"><Button variant="primary" onClick={submit} disabled={selected == null}>Submit</Button></div>
            ) : (
              <>
                <div className={`mt-4 p-3 rounded-md text-sm border ${selected === current.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                  <div className={`font-medium mb-1 ${selected === current.correct ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {selected === current.correct ? '✓ Correct' : '✗ Incorrect'}
                    <span className="font-normal ml-2 text-slate-600">Correct answer: {String.fromCharCode(65 + current.correct)}</span>
                  </div>
                  <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">{current.explanation}</div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 items-center">
                  <Button icon={Inbox} onClick={() => showToast('Added to Outside Log (coming in that tab)')}>Add to Outside Log</Button>
                  <Button icon={Repeat} onClick={() => showToast('Converted to flashcard (coming with cross-tab wiring)')}>Convert to Flashcard</Button>
                  <Button icon={StickyNote} onClick={() => showToast('Note drafted (use Notes tab to save)')}>Add Note</Button>
                  <Button icon={Brain} onClick={() => showToast('Use the Explanation Machine tab')}>Ask Explanation Machine</Button>
                  <Button variant="primary" icon={ChevronRight} onClick={pickNext} className="ml-auto">Next question</Button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-3"><BarChart3 className="w-4 h-4 text-slate-500" /><div className="text-sm font-semibold text-slate-900">Analytics</div></div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <StatMini label="Total questions" value={scopeMcqs.length} />
          <StatMini label="Attempted" value={attempted} />
          <StatMini label="Correct %" value={accuracy != null ? `${accuracy}%` : '—'} tone={accuracy == null ? 'neutral' : accuracy >= 75 ? 'good' : accuracy >= 50 ? 'warn' : 'bad'} />
        </div>
        {Object.keys(byTag).length === 0 ? (
          <div className="text-xs text-slate-500 italic">Answer questions to see per-tag accuracy.</div>
        ) : (
          <div className="space-y-2">
            <div className="text-[10px] uppercase text-slate-500 font-medium tracking-wide mb-1">Per-tag accuracy</div>
            {Object.keys(byTag).map(k => {
              const { correct, total } = byTag[k]; const pct = Math.round((correct / total) * 100);
              return (
                <div key={k} className="text-sm">
                  <div className="flex justify-between items-center"><span className="text-slate-700">{k}</span><span className="text-slate-500 text-xs">{correct}/{total} · {pct}%</span></div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                    <div className={`h-full ${pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {toast && <Toast message={toast} />}
    </Card>
  );
}

function StatMini({ label, value, tone = 'neutral' }) {
  const tones = { neutral: 'text-slate-900', good: 'text-emerald-600', warn: 'text-amber-600', bad: 'text-rose-600' };
  return (
    <div className="p-3 rounded-md bg-slate-50 border border-slate-100">
      <div className="text-[10px] uppercase text-slate-500 font-medium tracking-wide">{label}</div>
      <div className={`text-xl font-bold mt-0.5 ${tones[tone]}`}>{value}</div>
    </div>
  );
}

/* =========================================================================
   EXPLANATION MACHINE TAB
   ========================================================================= */
function ExplanationMachineTab({ subject, topic, savedExplanations, setSavedExplanations }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('SIMPLE');
  const [output, setOutput] = useState(null);
  const [toast, setToast] = useState(null);
  const [quizState, setQuizState] = useState({});

  useEffect(() => { setInput(''); setOutput(null); setQuizState({}); }, [subject.id, topic]);

  const modes = [
    { id: 'SIMPLE', label: 'Explain simply', icon: Lightbulb },
    { id: 'STEP', label: 'Step-by-step', icon: ListChecks },
    { id: 'COMPARE', label: 'Compare two rules', icon: GitBranch },
    { id: 'EXAMPLE', label: 'Give example', icon: BookOpen },
    { id: 'MEMORY', label: 'Memory trick', icon: Brain },
    { id: 'QUIZ', label: 'Quiz me', icon: Zap }
  ];

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2000); };
  const generate = (customMode, customInput) => {
    const useMode = customMode || mode;
    const useInput = (customInput != null ? customInput : input).trim() || topic;
    const result = generateExplanation({ input: useInput, mode: useMode, subject, topic });
    setOutput(result); setQuizState({});
  };
  const runStarter = (text) => {
    let m = 'SIMPLE'; const t = text.toLowerCase();
    if (t.includes('memory trick')) m = 'MEMORY';
    else if (t.includes('compare')) m = 'COMPARE';
    else if (t.includes('example')) m = 'EXAMPLE';
    else if (t.includes('quiz me')) m = 'QUIZ';
    else if (t.includes('step')) m = 'STEP';
    setMode(m); setInput(text); generate(m, text);
  };
  const saveCurrent = () => {
    if (!output) return;
    const entry = { id: uid('ex'), subjectId: subject.id, topic, prompt: output.input || input || topic, mode: output.isQuiz ? 'QUIZ' : output.mode, payload: output, timestamp: Date.now() };
    setSavedExplanations(prev => [entry, ...prev]);
    showToast('Explanation saved.');
  };
  const deleteSaved = (id) => { setSavedExplanations(prev => prev.filter(e => e.id !== id)); showToast('Deleted.'); };

  const topicSaved = savedExplanations.filter(e => e.subjectId === subject.id && e.topic === topic);
  const starters = getStarterPrompts(subject.id, topic);

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-lg bg-slate-900 text-white grid place-items-center"><Brain className="w-5 h-5" /></div>
        <div className="flex-1">
          <div className="text-xs text-slate-500 uppercase tracking-wide">{subject.name} → {topic}</div>
          <h2 className="text-lg font-semibold text-slate-900">Explanation Machine</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Professor mode · academic explainer · bar tutor · simplifier</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {modes.map(m => {
          const Icon = m.icon; const active = mode === m.id;
          return (
            <button key={m.id} onClick={() => setMode(m.id)} className={`px-2.5 py-1.5 text-xs rounded-md flex items-center gap-1.5 transition ${active ? 'bg-slate-900 text-white font-medium' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
              <Icon className="w-3.5 h-3.5" />{m.label}
            </button>
          );
        })}
      </div>

      <textarea value={input} onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'COMPARE' ? `e.g., Compare battery and assault...` : mode === 'QUIZ' ? `Leave blank to be quizzed on ${topic}.` : `Ask anything about ${topic}.`}
        className="w-full h-20 p-3 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 resize-none" />
      <div className="flex items-center gap-2 mt-2">
        <div className="text-[11px] text-slate-400 flex items-center gap-1"><Info className="w-3 h-3" /> Context: <strong className="text-slate-600">{topic}</strong></div>
        <Button variant="primary" icon={Zap} onClick={() => generate()} className="ml-auto">Generate</Button>
      </div>

      {!output && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="text-[10px] uppercase text-slate-500 font-medium tracking-wide mb-2">Starter prompts for {topic}</div>
          <div className="flex flex-wrap gap-2">
            {starters.map((s, i) => (
              <button key={i} onClick={() => runStarter(s)} className="text-left text-xs px-3 py-2 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition">{s}</button>
            ))}
          </div>
        </div>
      )}

      {output && (
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-[10px] uppercase text-slate-500 font-medium tracking-wide">Response</div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">{output.isQuiz ? 'QUIZ ME' : output.mode}</span>
            <div className="ml-auto flex gap-1">
              <Button icon={BookmarkPlus} onClick={saveCurrent}>Save Explanation</Button>
              <Button icon={StickyNote} onClick={() => showToast('Added to Notes (use Notes tab to review)')}>Add to Notes</Button>
              <Button icon={Repeat} onClick={() => showToast('Convert to flashcards — use Flashcards tab')}>Convert to Flashcards</Button>
              <Button icon={Wand2} onClick={() => showToast('Use Simplifier tab for full BPS workflow')}>Simplify</Button>
            </div>
          </div>
          {output.isQuiz ? (
            <QuizDisplay questions={output.questions} quizState={quizState} setQuizState={setQuizState} topic={topic} />
          ) : (
            <ExplanationDisplay sections={output.sections} />
          )}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <Library className="w-4 h-4 text-slate-500" />
          <div className="text-sm font-semibold text-slate-900">Saved explanations</div>
          <span className="text-[11px] text-slate-400 ml-auto">{topicSaved.length} for {topic}</span>
        </div>
        {topicSaved.length === 0 ? (
          <div className="text-xs text-slate-500 italic">No saved explanations yet. Generate one and click "Save Explanation".</div>
        ) : (
          <div className="space-y-2">
            {topicSaved.map(e => (
              <details key={e.id} className="border border-slate-200 rounded-md">
                <summary className="p-2.5 cursor-pointer text-sm flex items-center gap-2 hover:bg-slate-50">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">{e.mode}</span>
                  <span className="text-slate-800 truncate flex-1">{e.prompt}</span>
                  <span className="text-[11px] text-slate-400">{fmtRelative(e.timestamp)}</span>
                  <button onClick={(ev) => { ev.preventDefault(); deleteSaved(e.id); }} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </summary>
                <div className="p-3 border-t border-slate-100 bg-slate-50">
                  {e.payload?.isQuiz ? (
                    <div className="space-y-2">
                      {e.payload.questions.map((q, i) => (
                        <div key={i} className="text-sm">
                          <div className="font-medium text-slate-800">{i + 1}. {q.q}</div>
                          <div className="text-slate-600 mt-1 pl-3">→ {q.a}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {e.payload.sections.map((s, i) => (
                        <div key={i}>
                          <div className="text-xs font-semibold text-slate-700">{s.title}</div>
                          <div className="text-sm text-slate-600 whitespace-pre-wrap mt-1">{s.content}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
      {toast && <Toast message={toast} />}
    </Card>
  );
}

function ExplanationDisplay({ sections }) {
  const icons = { simple: Lightbulb, step: ListChecks, compare: GitBranch, example: BookOpen, memory: Brain, trap: AlertTriangle };
  const tones = {
    simple: 'bg-blue-50 border-blue-100',
    step: 'bg-violet-50 border-violet-100',
    compare: 'bg-indigo-50 border-indigo-100',
    example: 'bg-emerald-50 border-emerald-100',
    memory: 'bg-amber-50 border-amber-100',
    trap: 'bg-rose-50 border-rose-100'
  };
  return (
    <div className="space-y-3">
      {sections.map((s, i) => {
        const Icon = icons[s.type] || Lightbulb;
        return (
          <div key={i} className={`p-4 rounded-md border ${tones[s.type] || 'bg-slate-50 border-slate-100'}`}>
            <div className="flex items-center gap-2 mb-2"><Icon className="w-4 h-4 text-slate-700" /><div className="text-sm font-semibold text-slate-900">{s.title}</div></div>
            <div className="text-[13px] whitespace-pre-wrap leading-relaxed text-slate-700">{s.content}</div>
          </div>
        );
      })}
    </div>
  );
}

function QuizDisplay({ questions, quizState, setQuizState, topic }) {
  return (
    <div className="p-4 rounded-md border border-violet-200 bg-violet-50/50">
      <div className="flex items-center gap-2 mb-3"><Zap className="w-4 h-4 text-violet-700" /><div className="text-sm font-semibold text-violet-900">Quiz me — {topic}</div></div>
      <div className="space-y-3">
        {questions.map((q, i) => {
          const shown = quizState[i];
          return (
            <div key={i} className="p-3 bg-white rounded-md border border-violet-200">
              <div className="text-sm font-medium text-slate-800 mb-2">{i + 1}. {q.q}</div>
              {shown ? (
                <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 p-2 rounded">
                  <span className="text-[10px] uppercase text-slate-500 font-medium tracking-wide">Answer</span>
                  <div className="mt-1 whitespace-pre-wrap">{q.a}</div>
                  <button onClick={() => setQuizState(s => ({ ...s, [i]: false }))} className="text-[11px] text-slate-500 hover:text-slate-900 mt-2">Hide answer</button>
                </div>
              ) : (
                <button onClick={() => setQuizState(s => ({ ...s, [i]: true }))} className="text-xs text-violet-700 hover:text-violet-900 font-medium">Reveal answer →</button>
              )}
            </div>
          );
        })}
      </div>
      <div className="text-[11px] text-violet-700 mt-3 italic">Answer aloud first. Then reveal.</div>
    </div>
  );
}

/* =========================================================================
   BPS SIMPLIFIER TAB (Phase 7)
   ========================================================================= */
function BPSSimplifierTab({ subject, topic, simplifications, setSimplifications, getOutline, getNote, saveNote }) {
  const [kind, setKind] = useState('SIMPLIFY');
  const [sourceMode, setSourceMode] = useState('paste'); // paste | outline | notes
  const [sourceText, setSourceText] = useState('');
  const [output, setOutput] = useState('');
  const [viewingItem, setViewingItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [editingSaved, setEditingSaved] = useState(null); // id being edited
  const [editBuffer, setEditBuffer] = useState('');

  useEffect(() => {
    setOutput(''); setSourceText(''); setSourceMode('paste'); setKind('SIMPLIFY'); setViewingItem(null); setEditingSaved(null);
  }, [subject.id, topic]);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2000); };

  const library = simplifications.filter(s => s.subjectId === subject.id && s.topic === topic && s.source === 'BPS_LIBRARY');
  const mySaved = simplifications.filter(s => s.subjectId === subject.id && s.topic === topic && s.source !== 'BPS_LIBRARY');

  const outline = getOutline(subject.id, topic);
  const note = getNote(subject.id, topic);

  const pullSource = (from) => {
    setSourceMode(from);
    if (from === 'outline') setSourceText(outline?.content || '');
    else if (from === 'notes') setSourceText(note?.content || '');
    else setSourceText('');
  };

  const generate = () => {
    if (!sourceText.trim() && sourceMode === 'paste') {
      showToast('Paste or pull source text first.'); return;
    }
    setOutput(generateSimplification(sourceText || topic, kind, topic));
  };

  const saveOutput = () => {
    if (!output) return;
    const item = {
      id: uid('sim'), subjectId: subject.id, topic, type: kind,
      title: `${kindLabel(kind)} — ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`,
      content: output, source: 'USER', createdAt: Date.now()
    };
    setSimplifications(prev => [...prev, item]);
    setOutput(''); setSourceText('');
    showToast('Saved to My Simplifications.');
  };

  const addOutputToNotes = () => {
    if (!output) return;
    const existing = note?.content || '';
    const appended = existing
      ? `${existing}\n\n--- Simplification (${kindLabel(kind)}) ---\n${output}`
      : `--- Simplification (${kindLabel(kind)}) ---\n${output}`;
    saveNote(subject.id, topic, { content: appended, important: note?.important || false, confusing: note?.confusing || false });
    showToast('Appended to Notes.');
  };

  const deleteSaved = (id) => { setSimplifications(prev => prev.filter(s => s.id !== id)); showToast('Deleted.'); };

  const startEdit = (item) => { setEditingSaved(item.id); setEditBuffer(item.content); };
  const saveEdit = () => {
    setSimplifications(prev => prev.map(s => s.id === editingSaved ? { ...s, content: editBuffer, updatedAt: Date.now() } : s));
    setEditingSaved(null); setEditBuffer(''); showToast('Updated.');
  };

  const kinds = [
    { id: 'SIMPLIFY', label: 'Simplify', icon: Lightbulb },
    { id: 'TABLE', label: 'Convert to Table', icon: Table2 },
    { id: 'FLOWCHART', label: 'Create Flowchart', icon: Workflow },
    { id: 'ATTACK_SHEET', label: 'Generate Attack Sheet', icon: ShieldAlert }
  ];

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-lg bg-slate-900 text-white grid place-items-center"><Wand2 className="w-5 h-5" /></div>
        <div className="flex-1">
          <div className="text-xs text-slate-500 uppercase tracking-wide">{subject.name} → {topic}</div>
          <h2 className="text-lg font-semibold text-slate-900">BPS Simplifier</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Topic-scoped library · generator · your saved simplifications</p>
        </div>
      </div>

      {/* === SECTION A: BPS LIBRARY === */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Library className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">BPS Simplified Library</h3>
          <span className="text-[11px] text-slate-400">({library.length} curated)</span>
        </div>
        {library.length === 0 ? (
          <div className="p-4 rounded-md border-2 border-dashed border-slate-200 text-center">
            <div className="text-sm text-slate-600">No BPS simplifications yet for {topic}.</div>
            <p className="text-xs text-slate-500 mt-1">Seeded content is available for Evidence → Hearsay and Torts → Negligence. Generate your own using the tool below.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {library.map(item => (
              <button key={item.id} onClick={() => setViewingItem(item)}
                className="text-left p-3 rounded-md border border-slate-200 bg-slate-50/50 hover:border-slate-400 hover:bg-white transition">
                <div className="flex items-center gap-2">
                  <TypeIcon type={item.type} />
                  <div className="text-sm font-medium text-slate-800 flex-1 truncate">{item.title}</div>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 font-medium text-slate-600">{item.type}</span>
                  <span>BPS</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* === VIEWER PANEL (if viewing) === */}
      {viewingItem && (
        <div className="mb-6 border-2 border-slate-900 rounded-md">
          <div className="flex items-center gap-2 p-3 bg-slate-900 text-white rounded-t">
            <TypeIcon type={viewingItem.type} light />
            <div className="text-sm font-medium">{viewingItem.title}</div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 font-medium ml-2">{viewingItem.type}</span>
            <button onClick={() => setViewingItem(null)} className="ml-auto p-1 hover:bg-white/10 rounded"><X className="w-4 h-4" /></button>
          </div>
          <div className="p-4 bg-slate-50 text-[13px] font-mono whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
            {viewingItem.content}
          </div>
          <div className="p-3 bg-white border-t border-slate-200 flex flex-wrap gap-2">
            <Button icon={StickyNote} onClick={() => { const existing = note?.content || ''; const appended = existing ? `${existing}\n\n--- ${viewingItem.title} ---\n${viewingItem.content}` : `--- ${viewingItem.title} ---\n${viewingItem.content}`; saveNote(subject.id, topic, { content: appended, important: note?.important || false, confusing: note?.confusing || false }); showToast('Added to Notes.'); }}>Add to Notes</Button>
            <Button icon={Repeat} onClick={() => showToast('Convert to Flashcards — use Flashcards tab')}>Convert to Flashcards</Button>
            <Button icon={ScrollText} onClick={() => showToast('Reuse in Outline — paste manually into Rule Outline tab')}>Reuse in Outline</Button>
          </div>
        </div>
      )}

      {/* === SECTION B: CUSTOM GENERATOR === */}
      <div className="mb-6 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <FileCog className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">Custom Simplification Generator</h3>
        </div>

        {/* Source selector */}
        <div className="mb-3">
          <div className="text-[10px] uppercase text-slate-500 font-medium tracking-wide mb-1.5">Source</div>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => pullSource('paste')} className={`px-2.5 py-1.5 text-xs rounded-md flex items-center gap-1.5 transition ${sourceMode === 'paste' ? 'bg-slate-900 text-white font-medium' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}><FileInput className="w-3.5 h-3.5" />Paste text</button>
            <button onClick={() => pullSource('outline')} disabled={!outline?.content} className={`px-2.5 py-1.5 text-xs rounded-md flex items-center gap-1.5 transition disabled:opacity-40 ${sourceMode === 'outline' ? 'bg-slate-900 text-white font-medium' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}><ScrollText className="w-3.5 h-3.5" />From Outline {!outline?.content && '(empty)'}</button>
            <button onClick={() => pullSource('notes')} disabled={!note?.content} className={`px-2.5 py-1.5 text-xs rounded-md flex items-center gap-1.5 transition disabled:opacity-40 ${sourceMode === 'notes' ? 'bg-slate-900 text-white font-medium' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}><StickyNote className="w-3.5 h-3.5" />From Notes {!note?.content && '(empty)'}</button>
          </div>
        </div>

        {/* Source textarea */}
        <textarea value={sourceText} onChange={(e) => setSourceText(e.target.value)}
          placeholder={sourceMode === 'paste' ? `Paste any text — a rule, an MCQ explanation, a passage from your course outline — and simplify it.` : sourceMode === 'outline' ? 'Content pulled from your Rule Outline...' : 'Content pulled from your Notes...'}
          className="w-full h-28 p-3 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 resize-none" />
        <div className="text-[11px] text-slate-400 mt-1">{sourceText.length} chars · {sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0} words</div>

        {/* Action selector */}
        <div className="mt-3">
          <div className="text-[10px] uppercase text-slate-500 font-medium tracking-wide mb-1.5">Action</div>
          <div className="flex flex-wrap gap-1.5">
            {kinds.map(k => {
              const Icon = k.icon; const active = kind === k.id;
              return (
                <button key={k.id} onClick={() => setKind(k.id)} className={`px-2.5 py-1.5 text-xs rounded-md flex items-center gap-1.5 transition ${active ? 'bg-slate-900 text-white font-medium' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                  <Icon className="w-3.5 h-3.5" />{k.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <Button variant="primary" icon={Zap} onClick={generate}>Generate</Button>
          {output && <Button icon={X} onClick={() => setOutput('')}>Clear output</Button>}
        </div>

        {/* Output */}
        {output && (
          <div className="mt-4">
            <div className="text-[10px] uppercase text-slate-500 font-medium tracking-wide mb-1.5">Result — {kindLabel(kind)}</div>
            <div className="p-4 bg-white border-2 border-slate-300 rounded-md text-[13px] font-mono whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">{output}</div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Button variant="primary" icon={BookmarkPlus} onClick={saveOutput}>Save to My Simplifications</Button>
              <Button icon={StickyNote} onClick={addOutputToNotes}>Add to Notes</Button>
              <Button icon={Repeat} onClick={() => showToast('Convert to Flashcards — use Flashcards tab')}>Convert to Flashcards</Button>
              <Button icon={ScrollText} onClick={() => showToast('Reuse in Outline — use Rule Outline tab to paste')}>Reuse in Outline</Button>
            </div>
          </div>
        )}
      </div>

      {/* === SECTION C: MY SIMPLIFICATIONS === */}
      <div className="pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <BookmarkPlus className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">My Simplifications</h3>
          <span className="text-[11px] text-slate-400">({mySaved.length} saved)</span>
        </div>
        {mySaved.length === 0 ? (
          <div className="p-4 rounded-md border-2 border-dashed border-slate-200 text-center">
            <div className="text-sm text-slate-600">No saved simplifications yet for {topic}.</div>
            <p className="text-xs text-slate-500 mt-1">Generate one above and click "Save to My Simplifications".</p>
          </div>
        ) : (
          <div className="space-y-2">
            {mySaved.map(item => {
              const isEditing = editingSaved === item.id;
              return (
                <div key={item.id} className="border border-slate-200 rounded-md">
                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-slate-100 transition">
                    <TypeIcon type={item.type} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-800 truncate">{item.title}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-medium text-slate-600">{item.type}</span>
                        <span>{fmtRelative(item.updatedAt || item.createdAt)}</span>
                      </div>
                    </div>
                    {!isEditing && <button onClick={() => startEdit(item)} className="p-1 text-slate-400 hover:text-slate-700"><Edit3 className="w-3.5 h-3.5" /></button>}
                    <button onClick={() => deleteSaved(item.id)} className="p-1 text-slate-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  {isEditing ? (
                    <div className="p-3 bg-white border-t border-slate-200">
                      <textarea value={editBuffer} onChange={(e) => setEditBuffer(e.target.value)}
                        className="w-full h-60 p-3 text-[13px] font-mono border border-slate-200 rounded focus:outline-none focus:border-slate-400 resize-none" />
                      <div className="flex gap-2 mt-2">
                        <Button variant="primary" icon={Save} onClick={saveEdit}>Save edit</Button>
                        <Button icon={X} onClick={() => { setEditingSaved(null); setEditBuffer(''); }}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <details>
                      <summary className="p-2 border-t border-slate-200 text-[11px] text-slate-500 cursor-pointer hover:bg-slate-50">View content</summary>
                      <div className="p-3 bg-white text-[13px] font-mono whitespace-pre-wrap leading-relaxed border-t border-slate-100 max-h-80 overflow-y-auto">{item.content}</div>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {toast && <Toast message={toast} />}
    </Card>
  );
}

function kindLabel(k) {
  return { SIMPLIFY: 'Summary', TABLE: 'Table', FLOWCHART: 'Flowchart', ATTACK_SHEET: 'Attack Sheet', SUMMARY: 'Summary', RULE_MAP: 'Rule Map' }[k] || 'Item';
}

function TypeIcon({ type, light = false }) {
  const c = light ? 'text-white' : '';
  if (type === 'FLOWCHART') return <Workflow className={`w-4 h-4 text-violet-600 ${c}`} />;
  if (type === 'TABLE') return <Table2 className={`w-4 h-4 text-blue-600 ${c}`} />;
  if (type === 'ATTACK_SHEET') return <ShieldAlert className={`w-4 h-4 text-rose-600 ${c}`} />;
  if (type === 'SUMMARY') return <FileText className={`w-4 h-4 text-emerald-600 ${c}`} />;
  if (type === 'RULE_MAP') return <GitBranch className={`w-4 h-4 text-amber-600 ${c}`} />;
  return <FileText className={`w-4 h-4 text-slate-500 ${c}`} />;
}

/* =========================================================================
   OUTLINE LAB (Phase 8)
   ========================================================================= */
function OutlineLabView({ inputs, setInputs, output, setOutput, saveOutline, getOutline, goOpenSubject }) {
  const [targetSubjectId, setTargetSubjectId] = useState(inputs?.subjectId || 'torts');
  const [targetTopic, setTargetTopic] = useState(inputs?.topic || TOPICS['torts'][0]);
  const [showCompare, setShowCompare] = useState(false);
  const [toast, setToast] = useState(null);

  const subject = SUBJECTS.find(s => s.id === targetSubjectId);
  const topicList = TOPICS[targetSubjectId] || [];

  useEffect(() => {
    // Ensure topic is valid when subject changes
    if (!topicList.includes(targetTopic)) setTargetTopic(topicList[0] || '');
  }, [targetSubjectId]); // eslint-disable-line

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2500); };

  const updateInput = (field, value) => setInputs(prev => ({ ...prev, [field]: value }));

  const generate = () => {
    const result = generateMasterOutline({
      personalNotes: inputs.personalNotes,
      externalOutline: inputs.externalOutline,
      bookToc: inputs.bookToc,
      otherMaterials: inputs.otherMaterials,
      coursePlan: inputs.coursePlan,
      subject, topic: targetTopic
    });
    if (!result) { showToast('Fill at least one input to generate an outline.'); return; }
    setOutput(result);
  };

  const mergeIntoSubject = () => {
    if (!output?.trim()) { showToast('Generate a master outline first.'); return; }
    const existing = getOutline(targetSubjectId, targetTopic);
    const merged = existing?.content
      ? `${existing.content}\n\n--- Merged from Outline Lab (${new Date().toLocaleDateString()}) ---\n\n${output}`
      : output;
    saveOutline(targetSubjectId, targetTopic, merged);
    showToast(`Merged into ${subject.name} → ${targetTopic}. Open the subject's Rule Outline tab to view.`);
  };

  const saveToSubject = () => {
    if (!output?.trim()) { showToast('Generate a master outline first.'); return; }
    saveOutline(targetSubjectId, targetTopic, output);
    showToast(`Saved as ${subject.name} → ${targetTopic} Rule Outline (replaced existing).`);
  };

  const openInSubject = () => { goOpenSubject(targetSubjectId, targetTopic); };

  const referenceKey = `${targetSubjectId}__${targetTopic}`;
  const bpsRef = BPS_REFERENCE_OUTLINES[referenceKey];
  const existingOutline = getOutline(targetSubjectId, targetTopic);

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs text-slate-500 uppercase tracking-wide">Multi-source synthesis workspace</div>
        <h1 className="text-3xl font-bold text-slate-900 mt-0.5">Outline Lab</h1>
        <p className="text-sm text-slate-500 mt-1">Paste material from different sources into the slots below, then generate a synthesized master outline you can merge into any subject's Rule Outline.</p>
      </div>

      {/* Target selector */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">Target</h3>
          <span className="text-[11px] text-slate-500 ml-2">Where the generated outline will be saved / merged.</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase text-slate-500 font-medium tracking-wide block mb-1">Target subject</label>
            <select value={targetSubjectId} onChange={(e) => { setTargetSubjectId(e.target.value); setInputs(prev => ({ ...prev, subjectId: e.target.value })); }}
              className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 bg-white focus:outline-none focus:border-slate-400">
              {SUBJECTS.filter(s => !s.disabled).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase text-slate-500 font-medium tracking-wide block mb-1">Target topic</label>
            <select value={targetTopic} onChange={(e) => { setTargetTopic(e.target.value); setInputs(prev => ({ ...prev, topic: e.target.value })); }}
              className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 bg-white focus:outline-none focus:border-slate-400">
              {topicList.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {/* Input zones */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <FileInput className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">Input sources</h3>
          <span className="text-[11px] text-slate-400 ml-auto">Fill any combination — more sources = richer synthesis</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputSlot
            label="Paste your Barbri / Themis / course outline here"
            hint="External course outline — the backbone of your structure"
            value={inputs.externalOutline || ''}
            onChange={(v) => updateInput('externalOutline', v)}
          />
          <InputSlot
            label="Paste your personal notes here"
            hint="Your own lecture notes or study notes for this topic"
            value={inputs.personalNotes || ''}
            onChange={(v) => updateInput('personalNotes', v)}
          />
          <InputSlot
            label="Paste your book table of contents here"
            hint="Book TOC — helpful for topic mapping"
            value={inputs.bookToc || ''}
            onChange={(v) => updateInput('bookToc', v)}
          />
          <InputSlot
            label="Paste your course plan here (optional)"
            hint="Course schedule or weekly plan — optional"
            value={inputs.coursePlan || ''}
            onChange={(v) => updateInput('coursePlan', v)}
          />
          <InputSlot
            className="md:col-span-2"
            label="Paste any other study material here"
            hint="Supplemental notes, MCQ explanations, lecture transcripts, etc."
            value={inputs.otherMaterials || ''}
            onChange={(v) => updateInput('otherMaterials', v)}
          />
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Button variant="primary" icon={Sparkles} onClick={generate}>Generate Master Outline</Button>
          <Button icon={GitBranch} onClick={() => setShowCompare(!showCompare)}>Compare with BPS Outline</Button>
          <Button icon={Save} onClick={mergeIntoSubject} disabled={!output?.trim()}>Merge into Personal Outline</Button>
          <Button icon={FileCog} onClick={saveToSubject} disabled={!output?.trim()}>Save as Subject Outline (replace)</Button>
        </div>
      </Card>

      {/* Output area */}
      {output ? (
        <div className={`grid gap-4 ${showCompare ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Primary: AI Master Outline */}
          <Card>
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
              <ScrollText className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-semibold text-slate-900">AI Master Outline</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 ml-auto">Target: {subject.name} → {targetTopic}</span>
            </div>
            <div className="text-[13px] font-mono whitespace-pre-wrap leading-relaxed p-4 bg-slate-50 rounded-md border border-slate-100 max-h-[520px] overflow-y-auto">{output}</div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Button variant="primary" icon={Save} onClick={mergeIntoSubject}>Merge into Personal Outline</Button>
              <Button icon={FileCog} onClick={saveToSubject}>Save as Subject Outline (replace)</Button>
              <Button icon={BookOpen} onClick={openInSubject}>Open in {subject.name}</Button>
              <Button icon={X} onClick={() => setOutput('')} className="ml-auto">Clear output</Button>
            </div>
          </Card>

          {/* Side panel: BPS reference + existing */}
          {showCompare && (
            <Card>
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                <GitBranch className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-semibold text-slate-900">Reference comparison</h3>
              </div>

              <div className="mb-4">
                <div className="text-[10px] uppercase text-slate-500 font-medium tracking-wide mb-1.5">BPS Reference Outline</div>
                {bpsRef ? (
                  <div className="text-[13px] font-mono whitespace-pre-wrap leading-relaxed p-3 bg-blue-50/50 rounded border border-blue-100 max-h-56 overflow-y-auto">{bpsRef}</div>
                ) : (
                  <div className="p-3 border-2 border-dashed border-slate-200 rounded text-center text-xs text-slate-500">
                    No BPS reference yet for {subject.name} → {targetTopic}. Try Evidence → Hearsay or Torts → Negligence for a seeded reference.
                  </div>
                )}
              </div>

              <div>
                <div className="text-[10px] uppercase text-slate-500 font-medium tracking-wide mb-1.5">Your existing outline for this topic</div>
                {existingOutline?.content ? (
                  <div className="text-[13px] font-mono whitespace-pre-wrap leading-relaxed p-3 bg-amber-50/40 rounded border border-amber-100 max-h-56 overflow-y-auto">{existingOutline.content}</div>
                ) : (
                  <div className="p-3 border-2 border-dashed border-slate-200 rounded text-center text-xs text-slate-500">
                    No outline yet saved for {subject.name} → {targetTopic}. Use "Save as Subject Outline" to create one from the generated content.
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-md">
            <FlaskConical className="w-8 h-8 mx-auto text-slate-300 mb-3" />
            <div className="text-sm font-medium text-slate-700 mb-1">No master outline generated yet</div>
            <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
              Paste content into at least one input slot above, then click "Generate Master Outline". A sample Torts → Negligence input set has been seeded to help you test quickly.
            </p>
            <Button variant="primary" icon={Sparkles} onClick={generate}>Generate from current inputs</Button>
          </div>
        </Card>
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}

function InputSlot({ label, hint, value, onChange, className = '' }) {
  return (
    <div className={className}>
      <label className="block">
        <div className="text-[10px] uppercase font-bold text-slate-700 tracking-wider mb-0.5">{label}</div>
        {hint && <div className="text-[11px] text-slate-500 mb-1.5">{hint}</div>}
        <textarea value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full h-28 p-3 text-[13px] border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 resize-none bg-white" />
      </label>
      <div className="text-[10px] text-slate-400 mt-1 text-right">{value.length} chars</div>
    </div>
  );
}

/* =========================================================================
   PLANS VIEW (Phase 9)
   ========================================================================= */
function PlansView({ planInputs, setPlanInputs, generatedPlan, setGeneratedPlan, tasks, setTasks, updateTask, addTask, deleteTask, routine, setRoutine, materials, setMaterials, onOpenSubject }) {
  const [builderExpanded, setBuilderExpanded] = useState(!generatedPlan);
  const [toast, setToast] = useState(null);
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2500); };

  const updateInput = (field, value) => setPlanInputs(prev => ({ ...prev, [field]: value }));

  const handleGenerate = () => {
    if (!planInputs.examDate || !planInputs.startDate) { showToast('Enter your exam date and start date first.'); return; }
    const plan = generateStudyPlan(planInputs);
    if (!plan) { showToast('Could not generate plan — check your inputs.'); return; }
    setGeneratedPlan(plan);
    setBuilderExpanded(false);
    showToast('Master plan generated.');
  };

  const populateTasksFromPlan = () => {
    if (!generatedPlan) { showToast('Generate a study plan first.'); return; }
    const newTasks = generateTasksFromPlan(generatedPlan, tasks);
    if (newTasks.length === 0) { showToast('No new tasks to add (already populated).'); return; }
    setTasks(prev => [...prev, ...newTasks]);
    showToast(`Added ${newTasks.length} tasks from plan.`);
  };

  const applyTemplate = (tplId) => {
    const defaults = {
      FULL_TIME: { hoursPerDay: 7, daysPerWeek: 6 },
      PART_TIME: { hoursPerDay: 3, daysPerWeek: 6 },
      LATE_START: { hoursPerDay: 8, daysPerWeek: 6 },
      CATCH_UP: { hoursPerDay: 5, daysPerWeek: 7 }
    };
    setPlanInputs(prev => ({ ...prev, template: tplId, ...(defaults[tplId] || {}) }));
    showToast(`${PLAN_TEMPLATES.find(t => t.id === tplId)?.label} template applied.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-slate-500 uppercase tracking-wide">Planning + Execution</div>
        <h1 className="text-3xl font-bold text-slate-900 mt-0.5">Plans</h1>
        <p className="text-sm text-slate-500 mt-1">Build your study plan, track tasks, shape your daily routine, and monitor material progress — all in one workspace.</p>
      </div>

      {/* === PLAN BUILDER === */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Rocket className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">Plan Builder</h2>
          <button onClick={() => setBuilderExpanded(!builderExpanded)} className="ml-auto text-[11px] text-slate-500 hover:text-slate-900">
            {builderExpanded ? 'Collapse inputs' : 'Expand inputs'}
          </button>
        </div>

        {builderExpanded && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <FieldCol label="Enter your exam date">
                <input type="date" value={planInputs.examDate || ''} onChange={(e) => updateInput('examDate', e.target.value)} className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-400" />
              </FieldCol>
              <FieldCol label="Enter your study start date">
                <input type="date" value={planInputs.startDate || ''} onChange={(e) => updateInput('startDate', e.target.value)} className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-400" />
              </FieldCol>
              <FieldCol label="Study mode">
                <select value={planInputs.mode || 'part-time'} onChange={(e) => updateInput('mode', e.target.value)} className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 bg-white focus:outline-none focus:border-slate-400">
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                </select>
              </FieldCol>
              <FieldCol label="Hours per day / Days per week">
                <div className="flex items-center gap-2">
                  <input type="number" min="1" max="16" value={planInputs.hoursPerDay || 3} onChange={(e) => updateInput('hoursPerDay', parseInt(e.target.value) || 0)} className="w-16 text-sm px-2 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-400" />
                  <span className="text-xs text-slate-500">h ×</span>
                  <input type="number" min="1" max="7" value={planInputs.daysPerWeek || 6} onChange={(e) => updateInput('daysPerWeek', parseInt(e.target.value) || 0)} className="w-16 text-sm px-2 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-400" />
                  <span className="text-xs text-slate-500">d/wk</span>
                </div>
              </FieldCol>
            </div>

            <div className="mb-4">
              <div className="text-[10px] uppercase font-medium text-slate-600 tracking-wide mb-2">BPS template options</div>
              <div className="flex flex-wrap gap-2">
                {PLAN_TEMPLATES.map(t => {
                  const active = planInputs.template === t.id;
                  return (
                    <button key={t.id} onClick={() => applyTemplate(t.id)} className={`text-left p-2.5 rounded-md border transition flex-1 min-w-[180px] ${active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`}>
                      <div className="text-xs font-semibold">{t.label}</div>
                      <div className={`text-[10px] mt-0.5 ${active ? 'text-slate-300' : 'text-slate-500'}`}>{t.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <PasteField label="Paste your personal targets here" value={planInputs.targets} onChange={(v) => updateInput('targets', v)} />
              <PasteField label="Paste your books or materials here" value={planInputs.materials} onChange={(v) => updateInput('materials', v)} />
              <PasteField label="Paste your book table of contents here" value={planInputs.bookToc} onChange={(v) => updateInput('bookToc', v)} />
              <PasteField label="Paste your course schedule or external study plan here" value={planInputs.coursePlan} onChange={(v) => updateInput('coursePlan', v)} />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="primary" icon={Sparkles} onClick={handleGenerate}>Generate Study Plan</Button>
              {generatedPlan && <Button icon={ClipboardList} onClick={populateTasksFromPlan}>Populate tasks from plan</Button>}
            </div>
          </>
        )}

        {generatedPlan && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <PlanOutput plan={generatedPlan} />
          </div>
        )}
      </Card>

      {/* === TASK TRACKER === */}
      <TaskTrackerCard tasks={tasks} setTasks={setTasks} updateTask={updateTask} addTask={addTask} deleteTask={deleteTask} materials={materials} onOpenSubject={onOpenSubject} />

      {/* === DAILY ROUTINE === */}
      <RoutineCard routine={routine} setRoutine={setRoutine} showToast={showToast} />

      {/* === MATERIALS === */}
      <MaterialsCard materials={materials} setMaterials={setMaterials} showToast={showToast} />

      {toast && <Toast message={toast} />}
    </div>
  );
}

function FieldCol({ label, children }) {
  return (
    <div>
      <div className="text-[10px] uppercase font-medium text-slate-600 tracking-wide mb-1">{label}</div>
      {children}
    </div>
  );
}
function PasteField({ label, value, onChange }) {
  return (
    <div>
      <div className="text-[10px] uppercase font-medium text-slate-600 tracking-wide mb-1">{label}</div>
      <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full h-24 p-3 text-[13px] border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 resize-none" />
    </div>
  );
}

function PlanOutput({ plan }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <ScrollText className="w-4 h-4 text-slate-700" />
        <div className="text-sm font-semibold text-slate-900">Master Plan Overview</div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium ml-auto">Generated {fmtRelative(plan.generatedAt)}</span>
      </div>
      <div className="text-[13px] whitespace-pre-wrap leading-relaxed p-4 bg-slate-50 rounded-md border border-slate-100 mb-4">{plan.overview}</div>

      <div className="mb-4">
        <div className="text-[10px] uppercase text-slate-500 font-medium tracking-wide mb-2">Weekly targets ({plan.weeklyTargets.length} weeks)</div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {plan.weeklyTargets.map(wt => (
            <div key={wt.week} className="p-3 rounded-md border border-slate-200 bg-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-white font-bold">WK {wt.week}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">{wt.phase}</span>
                <span className="text-xs text-slate-600 font-medium">{wt.focus}</span>
              </div>
              <ul className="text-[12px] text-slate-700 space-y-0.5 pl-1">
                {wt.goals.map((g, i) => <li key={i}>• {g}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase text-slate-500 font-medium tracking-wide mb-2">Daily template</div>
        <ul className="text-[12px] text-slate-700 space-y-1 p-3 rounded-md border border-slate-200 bg-white">
          {plan.dailyTemplate.map((d, i) => <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />{d}</li>)}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------ TASK TRACKER ------------------------ */
function TaskTrackerCard({ tasks, setTasks, updateTask, addTask, deleteTask, materials, onOpenSubject }) {
  const [filter, setFilter] = useState('today');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');
  const [adding, setAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', subjectName: '', minutes: 30, type: 'other', scheduledFor: todayISO() });
  const [editingNote, setEditingNote] = useState(null);
  const [noteBuffer, setNoteBuffer] = useState('');

  const filtered = useMemo(() => {
    let out = tasks || [];
    if (filter === 'today') out = out.filter(t => isTodayISO(t.scheduledFor));
    else if (filter === 'week') out = out.filter(t => isThisWeek(t.scheduledFor));
    else if (filter === 'subject') out = subjectFilter === 'all' ? out : out.filter(t => t.subjectName === subjectFilter);
    else if (filter === 'material') out = materialFilter === 'all' ? out : out.filter(t => t.materialId === materialFilter);
    return out.sort((a, b) => (a.scheduledFor || '').localeCompare(b.scheduledFor || ''));
  }, [tasks, filter, subjectFilter, materialFilter]);

  const counts = useMemo(() => {
    const c = { completed: 0, in_progress: 0, partial: 0, skipped: 0, rescheduled: 0, not_started: 0 };
    (tasks || []).forEach(t => { c[t.status] = (c[t.status] || 0) + 1; });
    return c;
  }, [tasks]);

  const handleAdd = () => {
    if (!newTask.title.trim()) return;
    addTask({ ...newTask, title: newTask.title.trim() });
    setNewTask({ title: '', subjectName: '', minutes: 30, type: 'other', scheduledFor: todayISO() });
    setAdding(false);
  };

  const cycleStatus = (t) => {
    const order = ['not_started', 'in_progress', 'completed'];
    const idx = order.indexOf(t.status);
    const next = order[(idx + 1) % order.length];
    updateTask(t.id, { status: next });
  };

  const reschedule = (t, days) => {
    const d = new Date(t.scheduledFor || todayISO());
    d.setDate(d.getDate() + days);
    updateTask(t.id, { scheduledFor: d.toISOString().slice(0, 10), status: 'rescheduled' });
  };

  const saveNote = () => { updateTask(editingNote, { note: noteBuffer }); setEditingNote(null); setNoteBuffer(''); };
  const logTime = (t, delta) => updateTask(t.id, { timeSpent: Math.max(0, (t.timeSpent || 0) + delta) });

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList className="w-4 h-4 text-slate-500" />
        <h2 className="text-sm font-semibold text-slate-900">Task Tracker</h2>
        <span className="text-[11px] text-slate-500 ml-2">· {counts.completed} done · {counts.in_progress} in progress · {counts.skipped} skipped</span>
        <Button variant="primary" icon={Plus} onClick={() => setAdding(!adding)} className="ml-auto">Add task</Button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="flex rounded-md border border-slate-200 bg-slate-50 p-0.5">
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This week' },
            { id: 'subject', label: 'By subject' },
            { id: 'material', label: 'By material' },
            { id: 'all', label: 'All' }
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`px-3 py-1 text-xs rounded transition ${filter === f.id ? 'bg-white text-slate-900 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'}`}>
              {f.label}
            </button>
          ))}
        </div>
        {filter === 'subject' && (
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="text-xs px-2 py-1 rounded border border-slate-200 bg-white">
            <option value="all">All subjects</option>
            {SUBJECTS.filter(s => !s.disabled).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        )}
        {filter === 'material' && (
          <select value={materialFilter} onChange={(e) => setMaterialFilter(e.target.value)} className="text-xs px-2 py-1 rounded border border-slate-200 bg-white">
            <option value="all">All materials</option>
            {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        )}
      </div>

      {adding && (
        <div className="mb-3 p-3 bg-slate-50 rounded-md border border-slate-200 space-y-2">
          <input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task title" className="w-full text-sm px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-slate-400" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <select value={newTask.subjectName} onChange={(e) => setNewTask({ ...newTask, subjectName: e.target.value })} className="text-sm px-2 py-2 rounded border border-slate-200 bg-white">
              <option value="">Subject (optional)</option>
              {SUBJECTS.filter(s => !s.disabled).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
            <select value={newTask.type} onChange={(e) => setNewTask({ ...newTask, type: e.target.value })} className="text-sm px-2 py-2 rounded border border-slate-200 bg-white">
              {TASK_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
            <input type="number" value={newTask.minutes} onChange={(e) => setNewTask({ ...newTask, minutes: parseInt(e.target.value) || 30 })} placeholder="Minutes" className="text-sm px-2 py-2 rounded border border-slate-200" />
            <input type="date" value={newTask.scheduledFor} onChange={(e) => setNewTask({ ...newTask, scheduledFor: e.target.value })} className="text-sm px-2 py-2 rounded border border-slate-200" />
          </div>
          <div className="flex gap-2">
            <Button variant="primary" icon={Save} onClick={handleAdd}>Add</Button>
            <Button icon={X} onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="py-6 text-center border-2 border-dashed border-slate-200 rounded-md">
          <div className="text-sm text-slate-600">No tasks in this view.</div>
          <p className="text-xs text-slate-500 mt-1">Add a task or adjust the filter.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filtered.map(t => {
            const statusMeta = TASK_STATUSES.find(s => s.id === t.status) || TASK_STATUSES[0];
            const subject = SUBJECTS.find(s => s.name === t.subjectName);
            const typeMeta = TASK_TYPES.find(tt => tt.id === t.type) || TASK_TYPES[5];
            const TypeIcon = typeMeta.icon;
            return (
              <div key={t.id} className="py-3 group">
                <div className="flex items-start gap-3">
                  <button onClick={() => cycleStatus(t)} className="shrink-0 mt-0.5" title="Cycle status">
                    {t.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> :
                     t.status === 'in_progress' ? <PlayCircle className="w-5 h-5 text-blue-600" /> :
                     <Circle className="w-5 h-5 text-slate-300 hover:text-slate-500" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm ${t.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>{t.title}</div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border ${statusMeta.color}`}><span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />{statusMeta.label}</span>
                      {subject && <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${subject.color}`}>{t.subjectName}</span>}
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 px-1.5 py-0.5 bg-slate-100 rounded"><TypeIcon className="w-3 h-3" />{typeMeta.label}</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{t.minutes}m planned · {t.timeSpent || 0}m spent</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1"><CalendarDays className="w-3 h-3" />{t.scheduledFor}</span>
                    </div>
                    {t.note && editingNote !== t.id && (
                      <div className="mt-1.5 text-[11px] text-slate-500 italic pl-1 border-l-2 border-slate-200 py-0.5">{t.note}</div>
                    )}
                    {editingNote === t.id && (
                      <div className="mt-2 flex gap-2">
                        <input value={noteBuffer} onChange={(e) => setNoteBuffer(e.target.value)} placeholder="Add a short note..." className="flex-1 text-xs px-2 py-1 border border-slate-200 rounded focus:outline-none focus:border-slate-400" />
                        <Button variant="primary" icon={Save} onClick={saveNote}>Save</Button>
                        <Button icon={X} onClick={() => setEditingNote(null)}>Cancel</Button>
                      </div>
                    )}
                  </div>
                  <div className="opacity-60 group-hover:opacity-100 transition flex items-center gap-0.5">
                    <select value={t.status} onChange={(e) => updateTask(t.id, { status: e.target.value })} className="text-[11px] px-1.5 py-0.5 rounded border border-slate-200 bg-white" title="Status">
                      {TASK_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                    <button onClick={() => logTime(t, 15)} className="p-1 text-slate-400 hover:text-slate-700" title="+15 min"><Timer className="w-3.5 h-3.5" /></button>
                    <button onClick={() => reschedule(t, 1)} className="p-1 text-slate-400 hover:text-slate-700" title="Reschedule +1d"><SkipForward className="w-3.5 h-3.5" /></button>
                    <button onClick={() => { setEditingNote(t.id); setNoteBuffer(t.note || ''); }} className="p-1 text-slate-400 hover:text-slate-700" title="Edit note"><Edit3 className="w-3.5 h-3.5" /></button>
                    {subject && <button onClick={() => onOpenSubject(subject.id)} className="p-1 text-slate-400 hover:text-slate-700" title="Open subject"><ChevronRight className="w-3.5 h-3.5" /></button>}
                    <button onClick={() => deleteTask(t.id)} className="p-1 text-slate-400 hover:text-rose-600" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/* ------------------------ ROUTINE ------------------------ */
function RoutineCard({ routine, setRoutine, showToast }) {
  const [editBlock, setEditBlock] = useState(null);
  const [buf, setBuf] = useState({ start: '', end: '', label: '' });

  const updateField = (k, v) => setRoutine(prev => ({ ...prev, [k]: v }));
  const generate = () => {
    const blocks = generateRoutineSuggestion(routine);
    setRoutine(prev => ({ ...prev, blocks }));
    showToast('Suggested routine generated.');
  };
  const deleteBlock = (id) => setRoutine(prev => ({ ...prev, blocks: prev.blocks.filter(b => b.id !== id) }));
  const startEdit = (b) => { setEditBlock(b?.id || 'new'); setBuf(b || { start: '', end: '', label: '' }); };
  const saveEdit = () => {
    if (!buf.label.trim()) return;
    if (editBlock === 'new') {
      setRoutine(prev => ({ ...prev, blocks: [...prev.blocks, { ...buf, id: uid('b') }] }));
    } else {
      setRoutine(prev => ({ ...prev, blocks: prev.blocks.map(b => b.id === editBlock ? { ...b, ...buf } : b) }));
    }
    setEditBlock(null); setBuf({ start: '', end: '', label: '' });
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="w-4 h-4 text-slate-500" />
        <h2 className="text-sm font-semibold text-slate-900">Daily Routine</h2>
        <Button variant="primary" icon={Sparkles} onClick={generate} className="ml-auto">Generate suggested routine</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <FieldCol label="Wake time">
          <input value={routine.wakeTime || ''} onChange={(e) => updateField('wakeTime', e.target.value)} placeholder="6:30 AM" className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-400" />
        </FieldCol>
        <FieldCol label="Preferred study start">
          <input value={routine.studyStart || ''} onChange={(e) => updateField('studyStart', e.target.value)} placeholder="7:00 AM" className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-400" />
        </FieldCol>
        <FieldCol label="Work / personal obligations">
          <input value={routine.obligations || ''} onChange={(e) => updateField('obligations', e.target.value)} placeholder="Work 9-5 M-F" className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-400" />
        </FieldCol>
        <FieldCol label="Break preference">
          <input value={routine.breakPref || ''} onChange={(e) => updateField('breakPref', e.target.value)} placeholder="Pomodoro 50/10" className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-400" />
        </FieldCol>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase font-medium text-slate-600 tracking-wide">Time blocks ({(routine.blocks || []).length})</div>
        <Button icon={Plus} onClick={() => startEdit(null)}>Add block</Button>
      </div>

      {(routine.blocks || []).length === 0 ? (
        <div className="py-6 text-center border-2 border-dashed border-slate-200 rounded-md text-xs text-slate-500">
          No blocks yet. Click "Generate suggested routine" or add blocks manually.
        </div>
      ) : (
        <div className="space-y-1">
          {routine.blocks.map(b => (
            <div key={b.id} className="flex items-center gap-3 py-2 px-3 rounded-md border border-slate-200 bg-white group">
              {editBlock === b.id ? (
                <>
                  <input value={buf.start} onChange={(e) => setBuf({ ...buf, start: e.target.value })} className="w-20 text-xs px-2 py-1 border border-slate-200 rounded" placeholder="Start" />
                  <input value={buf.end} onChange={(e) => setBuf({ ...buf, end: e.target.value })} className="w-20 text-xs px-2 py-1 border border-slate-200 rounded" placeholder="End" />
                  <input value={buf.label} onChange={(e) => setBuf({ ...buf, label: e.target.value })} className="flex-1 text-xs px-2 py-1 border border-slate-200 rounded" placeholder="Label" />
                  <Button variant="primary" icon={Save} onClick={saveEdit}>Save</Button>
                  <Button icon={X} onClick={() => setEditBlock(null)}>Cancel</Button>
                </>
              ) : (
                <>
                  <div className="text-xs font-mono text-slate-500 w-32">{b.start} – {b.end}</div>
                  <div className="text-sm text-slate-800 flex-1 truncate">{b.label}</div>
                  <button onClick={() => startEdit(b)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-700"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteBlock(b.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </>
              )}
            </div>
          ))}
          {editBlock === 'new' && (
            <div className="flex items-center gap-3 py-2 px-3 rounded-md border-2 border-slate-400 bg-slate-50">
              <input value={buf.start} onChange={(e) => setBuf({ ...buf, start: e.target.value })} className="w-20 text-xs px-2 py-1 border border-slate-200 rounded" placeholder="Start" />
              <input value={buf.end} onChange={(e) => setBuf({ ...buf, end: e.target.value })} className="w-20 text-xs px-2 py-1 border border-slate-200 rounded" placeholder="End" />
              <input value={buf.label} onChange={(e) => setBuf({ ...buf, label: e.target.value })} className="flex-1 text-xs px-2 py-1 border border-slate-200 rounded" placeholder="Label" />
              <Button variant="primary" icon={Save} onClick={saveEdit}>Save</Button>
              <Button icon={X} onClick={() => setEditBlock(null)}>Cancel</Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

/* ------------------------ MATERIALS ------------------------ */
function MaterialsCard({ materials, setMaterials, showToast }) {
  const [adding, setAdding] = useState(false);
  const [newMat, setNewMat] = useState({ name: '', chapters: 10, completed: 0 });

  const addMaterial = () => {
    if (!newMat.name.trim()) return;
    setMaterials(prev => [...prev, { id: uid('m'), name: newMat.name.trim(), chapters: newMat.chapters, completed: newMat.completed, lastUpdated: Date.now() }]);
    setNewMat({ name: '', chapters: 10, completed: 0 });
    setAdding(false);
    showToast('Material added.');
  };

  const update = (id, patch) => setMaterials(prev => prev.map(m => m.id === id ? { ...m, ...patch, lastUpdated: Date.now() } : m));
  const remove = (id) => setMaterials(prev => prev.filter(m => m.id !== id));

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Library className="w-4 h-4 text-slate-500" />
        <h2 className="text-sm font-semibold text-slate-900">Materials Progress</h2>
        <Button variant="primary" icon={Plus} onClick={() => setAdding(!adding)} className="ml-auto">Add material</Button>
      </div>

      {adding && (
        <div className="mb-3 p-3 bg-slate-50 rounded-md border border-slate-200 flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[200px]">
            <div className="text-[10px] uppercase font-medium text-slate-600 tracking-wide mb-1">Name</div>
            <input value={newMat.name} onChange={(e) => setNewMat({ ...newMat, name: e.target.value })} placeholder="e.g., Barbri UBE" className="w-full text-sm px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-slate-400" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-medium text-slate-600 tracking-wide mb-1">Total chapters</div>
            <input type="number" value={newMat.chapters} onChange={(e) => setNewMat({ ...newMat, chapters: parseInt(e.target.value) || 0 })} className="w-24 text-sm px-2 py-2 rounded border border-slate-200" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-medium text-slate-600 tracking-wide mb-1">Completed</div>
            <input type="number" value={newMat.completed} onChange={(e) => setNewMat({ ...newMat, completed: parseInt(e.target.value) || 0 })} className="w-24 text-sm px-2 py-2 rounded border border-slate-200" />
          </div>
          <Button variant="primary" icon={Save} onClick={addMaterial}>Add</Button>
          <Button icon={X} onClick={() => setAdding(false)}>Cancel</Button>
        </div>
      )}

      {materials.length === 0 ? (
        <div className="py-6 text-center border-2 border-dashed border-slate-200 rounded-md text-xs text-slate-500">No materials tracked yet. Add one above.</div>
      ) : (
        <div className="space-y-2">
          {materials.map(m => {
            const pct = m.chapters > 0 ? Math.round((m.completed / m.chapters) * 100) : 0;
            return (
              <div key={m.id} className="group p-3 rounded-md border border-slate-200 bg-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <div className="text-sm font-medium text-slate-800 flex-1">{m.name}</div>
                  <span className="text-xs text-slate-500">{m.completed}/{m.chapters} · {pct}%</span>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition gap-1">
                    <button onClick={() => update(m.id, { completed: Math.max(0, m.completed - 1) })} className="p-1 text-slate-400 hover:text-slate-700 text-[10px] border border-slate-200 rounded">−1</button>
                    <button onClick={() => update(m.id, { completed: Math.min(m.chapters, m.completed + 1) })} className="p-1 text-slate-400 hover:text-slate-700 text-[10px] border border-slate-200 rounded">+1</button>
                    <button onClick={() => remove(m.id)} className="p-1 text-slate-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all ${pct >= 70 ? 'bg-emerald-500' : pct >= 30 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Updated {fmtRelative(m.lastUpdated)}</div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/* =========================================================================
   PROGRESS VIEW (Phase 10)
   ========================================================================= */
function ProgressView({ outlines, notes, flashcardsRule, flashcardsNotes, mcqs, mcqResults, tasks, materials, savedExplanations, simplifications, onOpenSubject }) {
  const [topicSubjectId, setTopicSubjectId] = useState('evidence');

  // Per-subject stats
  const subjectStats = useMemo(() => SUBJECTS.filter(s => !s.disabled).map(s => {
    const subjMcqs = mcqs.filter(m => m.subjectId === s.id);
    const subjResults = mcqResults.filter(r => subjMcqs.some(m => m.id === r.mcqId));
    const attempted = subjResults.length;
    const correct = subjResults.filter(r => r.correct).length;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : null;
    const outlineCount = Object.keys(outlines?.[s.id] || {}).length;
    const noteCount = Object.keys(notes?.[s.id] || {}).length;
    const fcCount = [...flashcardsRule, ...flashcardsNotes].filter(c => c.subjectId === s.id).length;
    const started = outlineCount > 0 || noteCount > 0 || fcCount > 0 || attempted > 0;
    let status = 'Not started';
    if (started) {
      if (accuracy != null && accuracy >= 75 && fcCount >= 10) status = 'Strong';
      else if (accuracy != null && accuracy < 55) status = 'Weak';
      else status = 'Medium';
    }
    return { id: s.id, name: s.name, color: s.color, short: s.short, attempted, correct, accuracy, outlineCount, noteCount, flashcardCount: fcCount, mcqCount: subjMcqs.length, started, status };
  }), [mcqs, mcqResults, outlines, notes, flashcardsRule, flashcardsNotes]);

  // Topic-level breakdown for selected subject
  const topicBreakdown = useMemo(() => {
    const topics = TOPICS[topicSubjectId] || [];
    return topics.map(topic => {
      const subjMcqs = mcqs.filter(m => m.subjectId === topicSubjectId && m.topic === topic);
      const subjResults = mcqResults.filter(r => subjMcqs.some(m => m.id === r.mcqId));
      const attempted = subjResults.length;
      const correct = subjResults.filter(r => r.correct).length;
      const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : null;
      const outlinePresent = !!(outlines?.[topicSubjectId]?.[topic]?.content || '').trim();
      const notePresent = !!(notes?.[topicSubjectId]?.[topic]?.content || '').trim();
      const fcCount = [...flashcardsRule, ...flashcardsNotes].filter(c => c.subjectId === topicSubjectId && c.topic === topic).length;
      const weak = (accuracy != null && accuracy < 60) || (!outlinePresent && fcCount < 3 && attempted === 0);
      return { topic, attempted, accuracy, outlinePresent, notePresent, flashcardCount: fcCount, mcqCount: subjMcqs.length, weak };
    });
  }, [topicSubjectId, mcqs, mcqResults, outlines, notes, flashcardsRule, flashcardsNotes]);

  // Overall metrics
  const overallAccuracy = useMemo(() => {
    const total = mcqResults.length;
    if (total === 0) return null;
    return Math.round((mcqResults.filter(r => r.correct).length / total) * 100);
  }, [mcqResults]);
  const totalFlashcards = flashcardsRule.length + flashcardsNotes.length;
  const dueFlashcards = [...flashcardsRule, ...flashcardsNotes].filter(c => (c.dueAt || 0) <= Date.now()).length;
  const totalReviews = [...flashcardsRule, ...flashcardsNotes].reduce((sum, c) => sum + (c.reviews || 0), 0);
  const subjectsStartedCount = subjectStats.filter(s => s.started).length;
  const tasksThisWeek = (tasks || []).filter(t => isThisWeek(t.scheduledFor));
  const completedThisWeek = tasksThisWeek.filter(t => t.status === 'completed').length;
  const totalMcqs = mcqs.length;

  // Weakness engine
  const weaknesses = useMemo(() => {
    const list = [];
    subjectStats.forEach(s => {
      (TOPICS[s.id] || []).forEach(topic => {
        const subjMcqs = mcqs.filter(m => m.subjectId === s.id && m.topic === topic);
        const subjResults = mcqResults.filter(r => subjMcqs.some(m => m.id === r.mcqId));
        const attempted = subjResults.length;
        const correct = subjResults.filter(r => r.correct).length;
        const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : null;
        const outlinePresent = !!(outlines?.[s.id]?.[topic]?.content || '').trim();
        const fcCount = [...flashcardsRule, ...flashcardsNotes].filter(c => c.subjectId === s.id && c.topic === topic).length;

        let score = 0; const reasons = [];
        if (attempted >= 3 && accuracy != null && accuracy < 60) { score += 3; reasons.push(`${accuracy}% MCQ accuracy (${attempted} attempted)`); }
        if (!outlinePresent && s.started) { score += 2; reasons.push('no rule outline'); }
        if (fcCount < 3 && s.started) { score += 1; reasons.push(`only ${fcCount} flashcards`); }
        if (score >= 3) list.push({ subjectId: s.id, subjectName: s.name, topic, score, reasons });
      });
    });
    return list.sort((a, b) => b.score - a.score).slice(0, 6);
  }, [subjectStats, mcqs, mcqResults, outlines, flashcardsRule, flashcardsNotes]);

  // Performance insights (rule-based)
  const performanceInsights = useMemo(() => {
    const insights = [];
    subjectStats.forEach(s => {
      if (s.accuracy != null && s.accuracy >= 75 && s.mcqCount < 10) insights.push({ kind: 'good', text: `${s.name} has strong accuracy (${s.accuracy}%) but MCQ volume is low. Add more practice to confirm mastery.` });
      if (s.outlineCount >= 2 && s.mcqCount < 5) insights.push({ kind: 'gap', text: `${s.name} has strong outline coverage but low MCQ volume. Shift toward application.` });
      if (s.accuracy != null && s.accuracy < 55) insights.push({ kind: 'weak', text: `${s.name} — low accuracy zone (${s.accuracy}%). Prioritize here before moving on.` });
    });
    const skippedEssays = (tasks || []).filter(t => t.type === 'essay' && t.status === 'skipped').length;
    if (skippedEssays > 0) insights.push({ kind: 'behind', text: `You skipped ${skippedEssays} essay-related task${skippedEssays !== 1 ? 's' : ''} this period. Add a protected essay block.` });
    if (insights.length === 0) insights.push({ kind: 'ok', text: 'No major red flags yet — keep practicing and revisit after another week of data.' });
    return insights.slice(0, 8);
  }, [subjectStats, tasks]);

  // Task stats
  const taskStats = useMemo(() => {
    const c = { not_started: 0, in_progress: 0, completed: 0, partial: 0, skipped: 0, rescheduled: 0 };
    (tasks || []).forEach(t => { c[t.status] = (c[t.status] || 0) + 1; });
    const total = tasks?.length || 0;
    const completedPct = total > 0 ? Math.round((c.completed / total) * 100) : 0;
    return { ...c, total, completedPct };
  }, [tasks]);

  // AI Insights
  const aiInsights = useMemo(() => generateAIInsights({
    subjectStats, outlines, notes, flashcards: [...flashcardsRule, ...flashcardsNotes], tasks, mcqResults
  }), [subjectStats, outlines, notes, flashcardsRule, flashcardsNotes, tasks, mcqResults]);

  // Trend data (mock week-over-week based on what we have)
  const trendData = [
    { label: 'MCQ attempts', thisWeek: mcqResults.filter(r => Date.now() - r.timestamp < 7 * 86400000).length, lastWeek: Math.max(0, mcqResults.length - mcqResults.filter(r => Date.now() - r.timestamp < 7 * 86400000).length) },
    { label: 'Tasks completed', thisWeek: completedThisWeek, lastWeek: (tasks || []).filter(t => t.status === 'completed' && !isThisWeek(t.scheduledFor)).length },
    { label: 'Flashcard reviews', thisWeek: Math.round(totalReviews * 0.6), lastWeek: Math.round(totalReviews * 0.4) }
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-slate-500 uppercase tracking-wide">Performance Intelligence</div>
        <h1 className="text-3xl font-bold text-slate-900 mt-0.5">Progress</h1>
        <p className="text-sm text-slate-500 mt-1">Live analytics from your actual study data. Updated every time you practice.</p>
      </div>

      {/* === OVERALL SNAPSHOT === */}
      <div>
        <div className="flex items-center gap-2 mb-3"><Activity className="w-4 h-4 text-slate-500" /><h2 className="text-sm font-semibold text-slate-900">Overall snapshot</h2></div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <StatCard icon={Target} label="MCQ accuracy" value={overallAccuracy != null ? `${overallAccuracy}%` : '—'} sub={`${mcqResults.length} attempts`} accent="bg-emerald-50 text-emerald-600" />
          <StatCard icon={Repeat} label="Flashcards due" value={dueFlashcards} sub={`${totalFlashcards} total`} accent="bg-amber-50 text-amber-600" />
          <StatCard icon={FileText} label="Essay attempts" value={(tasks || []).filter(t => t.type === 'essay' && t.status === 'completed').length} sub="completed tasks" accent="bg-blue-50 text-blue-600" />
          <StatCard icon={BookOpen} label="Subjects started" value={`${subjectsStartedCount}/9`} sub="with activity" accent="bg-violet-50 text-violet-600" />
          <StatCard icon={CheckCircle2} label="Tasks this week" value={`${completedThisWeek}/${tasksThisWeek.length}`} sub="completed" accent="bg-rose-50 text-rose-600" />
        </div>
      </div>

      {/* === SUBJECT BREAKDOWN === */}
      <Card>
        <div className="flex items-center gap-2 mb-3"><BookOpen className="w-4 h-4 text-slate-500" /><h2 className="text-sm font-semibold text-slate-900">Subject breakdown</h2></div>
        <div className="divide-y divide-slate-100">
          {subjectStats.map(s => (
            <div key={s.id} className="py-2.5 grid grid-cols-12 gap-2 items-center hover:bg-slate-50 -mx-2 px-2 rounded cursor-pointer" onClick={() => onOpenSubject(s.id)}>
              <div className="col-span-3 flex items-center gap-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${s.color}`}>{s.short}</span>
                <div className="text-sm font-medium text-slate-800 truncate">{s.name}</div>
              </div>
              <div className="col-span-2 text-xs">
                <div className="text-[10px] text-slate-500">MCQ</div>
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${s.accuracy == null ? 'text-slate-400' : s.accuracy >= 75 ? 'text-emerald-600' : s.accuracy >= 55 ? 'text-amber-600' : 'text-rose-600'}`}>
                    {s.accuracy != null ? `${s.accuracy}%` : '—'}
                  </span>
                  <span className="text-slate-400 text-[10px]">{s.attempted}/{s.mcqCount}</span>
                </div>
              </div>
              <div className="col-span-2 text-xs">
                <div className="text-[10px] text-slate-500">Outlines</div>
                <div className="text-slate-700 font-medium">{s.outlineCount}</div>
              </div>
              <div className="col-span-2 text-xs">
                <div className="text-[10px] text-slate-500">Flashcards</div>
                <div className="text-slate-700 font-medium">{s.flashcardCount}</div>
              </div>
              <div className="col-span-2 text-xs">
                <div className="text-[10px] text-slate-500">Notes</div>
                <div className="text-slate-700 font-medium">{s.noteCount}</div>
              </div>
              <div className="col-span-1 flex justify-end">
                <StatusBadge status={s.status === 'Strong' ? 'Ready' : s.status === 'Medium' ? 'In progress' : s.status === 'Weak' ? 'In progress' : 'Not started'} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* === TOPIC BREAKDOWN === */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Hash className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">Topic breakdown</h2>
          <select value={topicSubjectId} onChange={(e) => setTopicSubjectId(e.target.value)} className="ml-auto text-xs px-2 py-1 rounded border border-slate-200 bg-white">
            {SUBJECTS.filter(s => !s.disabled).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="divide-y divide-slate-100">
          {topicBreakdown.map(tb => (
            <div key={tb.topic} className="py-2 grid grid-cols-12 gap-2 items-center text-sm">
              <div className="col-span-4 text-slate-800 truncate flex items-center gap-1.5">
                {tb.weak && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                {tb.topic}
              </div>
              <div className="col-span-2 text-xs">
                <span className={`font-medium ${tb.accuracy == null ? 'text-slate-400' : tb.accuracy >= 75 ? 'text-emerald-600' : tb.accuracy >= 55 ? 'text-amber-600' : 'text-rose-600'}`}>
                  {tb.accuracy != null ? `${tb.accuracy}%` : '—'}
                </span>
                <span className="text-slate-400 ml-1 text-[10px]">{tb.attempted}/{tb.mcqCount}</span>
              </div>
              <div className="col-span-2 text-xs">
                {tb.outlinePresent ? <span className="text-emerald-600 font-medium">✓ Outline</span> : <span className="text-slate-400">No outline</span>}
              </div>
              <div className="col-span-2 text-xs">
                {tb.notePresent ? <span className="text-emerald-600 font-medium">✓ Notes</span> : <span className="text-slate-400">No notes</span>}
              </div>
              <div className="col-span-2 text-xs text-slate-600">{tb.flashcardCount} cards</div>
            </div>
          ))}
        </div>
      </Card>

      {/* === WEAKNESS ENGINE === */}
      <Card>
        <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-4 h-4 text-rose-500" /><h2 className="text-sm font-semibold text-slate-900">Weakness engine</h2></div>
        {weaknesses.length === 0 ? (
          <div className="text-xs text-slate-500 italic">No flagged weaknesses yet. Keep practicing and this panel will populate.</div>
        ) : (
          <div className="space-y-2">
            {weaknesses.map((w, i) => (
              <div key={i} className="p-3 rounded-md border border-rose-200 bg-rose-50/40">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-slate-800">{w.subjectName} → {w.topic}</div>
                  <span className="text-[10px] text-rose-700 font-medium ml-auto">Priority {w.score}</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">{w.reasons.join(' · ')}</div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Button icon={Target} onClick={() => onOpenSubject(w.subjectId, w.topic)}>Practice now</Button>
                  <Button icon={Repeat} onClick={() => onOpenSubject(w.subjectId, w.topic)}>Generate flashcards</Button>
                  <Button icon={Wand2} onClick={() => onOpenSubject(w.subjectId, w.topic)}>Simplify</Button>
                  <Button icon={ClipboardList} onClick={() => onOpenSubject(w.subjectId, w.topic)}>Add to plan</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* === PERFORMANCE INSIGHTS === */}
      <Card>
        <div className="flex items-center gap-2 mb-3"><PieChart className="w-4 h-4 text-slate-500" /><h2 className="text-sm font-semibold text-slate-900">Mistake / performance insights</h2></div>
        <div className="space-y-2">
          {performanceInsights.map((ins, i) => {
            const tones = {
              good: { bg: 'bg-emerald-50/60', border: 'border-emerald-100', icon: 'text-emerald-600' },
              gap: { bg: 'bg-amber-50/60', border: 'border-amber-100', icon: 'text-amber-600' },
              weak: { bg: 'bg-rose-50/60', border: 'border-rose-100', icon: 'text-rose-600' },
              behind: { bg: 'bg-violet-50/60', border: 'border-violet-100', icon: 'text-violet-600' },
              ok: { bg: 'bg-slate-50', border: 'border-slate-100', icon: 'text-slate-600' }
            };
            const tone = tones[ins.kind] || tones.ok;
            return (
              <div key={i} className={`text-sm p-2.5 rounded-md border flex items-start gap-2 ${tone.bg} ${tone.border}`}>
                <Info className={`w-4 h-4 shrink-0 mt-0.5 ${tone.icon}`} />
                <span className="text-slate-700">{ins.text}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* === TASK & PLAN PROGRESS === */}
      <Card>
        <div className="flex items-center gap-2 mb-3"><ClipboardList className="w-4 h-4 text-slate-500" /><h2 className="text-sm font-semibold text-slate-900">Task &amp; plan progress</h2></div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
          {TASK_STATUSES.map(s => (
            <div key={s.id} className="p-3 rounded-md border border-slate-200 bg-white text-center">
              <div className={`w-6 h-6 mx-auto rounded-full ${s.dot} mb-1 opacity-40`}></div>
              <div className="text-2xl font-bold text-slate-900">{taskStats[s.id] || 0}</div>
              <div className="text-[10px] uppercase text-slate-500 font-medium tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500">Overall completion</div>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${taskStats.completedPct >= 70 ? 'bg-emerald-500' : taskStats.completedPct >= 30 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${taskStats.completedPct}%` }} />
          </div>
          <div className="text-xs font-medium text-slate-700">{taskStats.completedPct}%</div>
        </div>
        <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
          <Info className="w-3 h-3" />
          {taskStats.completedPct >= 70 ? 'On track.' : taskStats.completedPct >= 40 ? 'Slightly behind — tighten the next few days.' : 'Significantly behind — revisit the plan in Plans.'}
        </div>
      </Card>

      {/* === MATERIAL USAGE === */}
      <Card>
        <div className="flex items-center gap-2 mb-3"><Library className="w-4 h-4 text-slate-500" /><h2 className="text-sm font-semibold text-slate-900">Material usage</h2></div>
        {materials.length === 0 ? (
          <div className="text-xs text-slate-500 italic">No materials tracked. Add some on the Plans page.</div>
        ) : (
          <div className="space-y-2">
            {materials.map(m => {
              const pct = m.chapters > 0 ? Math.round((m.completed / m.chapters) * 100) : 0;
              return (
                <div key={m.id} className="grid grid-cols-12 gap-2 items-center text-sm">
                  <div className="col-span-4 text-slate-800 truncate">{m.name}</div>
                  <div className="col-span-6">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${pct >= 70 ? 'bg-emerald-500' : pct >= 30 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="col-span-2 text-xs text-slate-600 text-right">{m.completed}/{m.chapters} · {pct}%</div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* === TREND VIEW === */}
      <Card>
        <div className="flex items-center gap-2 mb-3"><TrendingUp className="w-4 h-4 text-slate-500" /><h2 className="text-sm font-semibold text-slate-900">Trend view</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {trendData.map((t, i) => {
            const max = Math.max(t.thisWeek, t.lastWeek, 1);
            return (
              <div key={i} className="p-3 rounded-md border border-slate-200">
                <div className="text-[10px] uppercase text-slate-500 font-medium tracking-wide mb-2">{t.label}</div>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1"><span className="text-slate-600">This week</span><span className="text-slate-900 font-bold">{t.thisWeek}</span></div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-slate-900" style={{ width: `${(t.thisWeek / max) * 100}%` }} /></div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1"><span className="text-slate-500">Prior</span><span className="text-slate-500">{t.lastWeek}</span></div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-slate-300" style={{ width: `${(t.lastWeek / max) * 100}%` }} /></div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2">
                  {t.thisWeek > t.lastWeek ? <span className="text-emerald-600 font-medium">↑ {t.thisWeek - t.lastWeek} vs prior</span> :
                   t.thisWeek < t.lastWeek ? <span className="text-rose-600 font-medium">↓ {t.lastWeek - t.thisWeek} vs prior</span> :
                   <span>Flat vs prior</span>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* === AI INSIGHTS === */}
      <Card>
        <div className="flex items-center gap-2 mb-3"><Brain className="w-4 h-4 text-violet-600" /><h2 className="text-sm font-semibold text-slate-900">AI Insights</h2><span className="text-[11px] text-slate-500 ml-2">Action-oriented recommendations from your live data.</span></div>
        <div className="space-y-2">
          {aiInsights.map((ins, i) => {
            const icons = { weak: AlertTriangle, practice: Target, foundation: ScrollText, behind: Timer, essay: FileText, flashcards: Repeat, ok: CheckCircle2 };
            const Icon = icons[ins.type] || Lightbulb;
            return (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-md border border-violet-100 bg-violet-50/40">
                <Icon className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 leading-relaxed">{ins.text}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* =========================================================================
   PLACEHOLDER TAB CONTENT (for unbuilt tabs: essays, outside)
   ========================================================================= */
function TabContent({ subject, topic, tab }) {
  const Icon = tab.icon;
  const description = tab.desc.replace('{subject}', subject.name).replace('{topic}', topic);
  return (
    <Card>
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-lg bg-slate-900 text-white grid place-items-center"><Icon className="w-5 h-5" /></div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wide">{subject.name} → {topic}</div>
          <h2 className="text-lg font-semibold text-slate-900">{tab.label}</h2>
        </div>
      </div>
      <div className="py-8 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 grid place-items-center mb-4"><Icon className="w-6 h-6 text-slate-400" /></div>
        <div className="text-base font-semibold text-slate-800 mb-2">{subject.name} → {topic} → {tab.label}</div>
        <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">{description}</p>
        <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-full">
          <Sparkles className="w-3 h-3" />Arriving in a later phase
        </div>
      </div>
    </Card>
  );
}

/* =========================================================================
   SHARED UI
   ========================================================================= */
function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm transition">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-md grid place-items-center ${accent}`}><Icon className="w-4 h-4" /></div>
        <div className="text-xs text-slate-500 font-medium">{label}</div>
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      {sub && <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}
function Card({ children, className = '' }) { return <div className={`bg-white rounded-lg border border-slate-200 p-5 ${className}`}>{children}</div>; }
function Button({ children, variant = 'ghost', icon: Icon, onClick, disabled, className = '' }) {
  const base = 'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition disabled:opacity-40 disabled:cursor-not-allowed';
  const styles = { primary: 'bg-slate-900 text-white hover:bg-slate-800', ghost: 'text-slate-600 hover:bg-slate-100 border border-slate-200 bg-white' };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}{children}
    </button>
  );
}
function Toast({ message }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900 text-white text-sm rounded-md shadow-lg flex items-center gap-2">
      <CheckCircle2 className="w-4 h-4 text-emerald-400" />{message}
    </div>
  );
}

/* =========================================================================
   PLACEHOLDERS (global nav)
   ========================================================================= */
function PlaceholderView({ view, setView }) {
  const title = NAV_ITEMS.find(n => n.id === view)?.label || view;
  const Icon = NAV_ITEMS.find(n => n.id === view)?.icon || BookOpen;
  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs text-slate-500 uppercase tracking-wide">{title}</div>
        <h1 className="text-3xl font-bold text-slate-900 mt-0.5">{title}</h1>
      </div>
      <Card>
        <div className="py-16 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 grid place-items-center mb-4"><Icon className="w-6 h-6 text-slate-400" /></div>
          <div className="text-base font-semibold text-slate-800 mb-1">{title} coming in a later phase</div>
          <p className="text-sm text-slate-500 max-w-md mx-auto">Dashboard, Subjects, Outline, Notes, Flashcards, MCQs, Explanation Machine, BPS Simplifier, Outline Lab, Plans, and Progress are all functional. A global Notes index is still coming.</p>
          <button onClick={() => setView('dashboard')} className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-slate-900 text-white hover:bg-slate-800 transition">
            <ChevronRight className="w-4 h-4 rotate-180" />Back to Dashboard
          </button>
        </div>
      </Card>
    </div>
  );
}
