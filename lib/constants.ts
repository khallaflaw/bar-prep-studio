/**
 * Static, non-user-editable constants for bar-prep-studio.
 *
 * Port of the CONSTANTS block in `reference/bar_prep_studio.jsx`. Seed data
 * (initial tasks, flashcards, outlines, etc.) lives in `lib/seeds.ts`.
 */

import {
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  FileText,
  FlaskConical,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Repeat,
  ScrollText,
  StickyNote,
  Target,
  Wand2,
} from "lucide-react";

import type {
  NavItem,
  PlanTemplate,
  Subject,
  SubjectTab,
  TaskStatus,
  TaskType,
  TopicMap,
} from "./types";

/* =========================================================================
   SUBJECTS
   -------------------------------------------------------------------------
   The `accuracy` / `started` / `progress` / `status` fields are seeded
   placeholders; real values will eventually be derived from user data.
   ========================================================================= */

export const SUBJECTS: Subject[] = [
  {
    id: "contracts",
    name: "Contracts",
    short: "K",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    accuracy: 72,
    started: true,
    progress: 65,
    status: "In progress",
  },
  {
    id: "evidence",
    name: "Evidence",
    short: "EV",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    accuracy: 58,
    started: true,
    progress: 42,
    status: "In progress",
  },
  {
    id: "torts",
    name: "Torts",
    short: "T",
    color: "bg-rose-100 text-rose-700 border-rose-200",
    accuracy: 81,
    started: true,
    progress: 78,
    status: "Ready",
  },
  {
    id: "con_law",
    name: "Constitutional Law",
    short: "CON",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    accuracy: null,
    started: false,
    progress: 0,
    status: "Not started",
  },
  {
    id: "crim_law",
    name: "Criminal Law",
    short: "CR",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    accuracy: 65,
    started: true,
    progress: 48,
    status: "In progress",
  },
  {
    id: "crim_pro",
    name: "Criminal Procedure",
    short: "CP",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    accuracy: null,
    started: false,
    progress: 0,
    status: "Not started",
  },
  {
    id: "real_property",
    name: "Real Property",
    short: "RP",
    color: "bg-teal-100 text-teal-700 border-teal-200",
    accuracy: 49,
    started: true,
    progress: 31,
    status: "In progress",
  },
  {
    id: "civ_pro",
    name: "Civil Procedure",
    short: "CIV",
    color: "bg-violet-100 text-violet-700 border-violet-200",
    accuracy: 68,
    started: true,
    progress: 55,
    status: "In progress",
  },
  {
    id: "biz_assoc",
    name: "Business Associations",
    short: "BA",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    accuracy: null,
    started: false,
    progress: 0,
    status: "Not started",
  },
  {
    id: "mpt",
    name: "MPT",
    short: "MPT",
    color: "bg-pink-100 text-pink-700 border-pink-200",
    accuracy: null,
    started: false,
    progress: 0,
    status: "Coming soon",
    disabled: true,
  },
];

/* =========================================================================
   TOPICS — per-subject ordered topic lists
   ========================================================================= */

export const TOPICS: TopicMap = {
  contracts: [
    "Formation",
    "Defenses to Formation",
    "Statute of Frauds",
    "Parol Evidence",
    "Performance",
    "Breach",
    "Remedies",
    "UCC Article 2 — Sales",
    "Third-Party Rights",
  ],
  evidence: [
    "Relevance",
    "Character Evidence",
    "Hearsay",
    "Hearsay Exceptions",
    "Impeachment",
    "Privileges",
    "Authentication",
    "Best Evidence Rule",
  ],
  torts: [
    "Intentional Torts",
    "Defenses to Intentional Torts",
    "Negligence",
    "Defenses to Negligence",
    "Strict Liability",
    "Products Liability",
    "Defamation",
    "Privacy Torts",
    "Nuisance",
  ],
  con_law: [
    "Justiciability",
    "Federal Powers",
    "State Powers & Dormant Commerce",
    "State Action",
    "Due Process",
    "Equal Protection",
    "First Amendment — Speech",
    "First Amendment — Religion",
  ],
  crim_law: [
    "Homicide",
    "Crimes Against Persons",
    "Property Crimes",
    "Inchoate Offenses",
    "Accomplice Liability",
    "Defenses",
  ],
  crim_pro: [
    "Fourth Amendment — Search",
    "Fourth Amendment — Seizure",
    "Fifth Amendment — Miranda",
    "Sixth Amendment — Counsel",
    "Identifications",
    "Exclusionary Rule",
  ],
  real_property: [
    "Present Estates",
    "Future Interests",
    "Concurrent Estates",
    "Landlord-Tenant",
    "Easements",
    "Covenants & Servitudes",
    "Adverse Possession",
    "Deeds & Conveyances",
    "Recording Acts",
    "Mortgages",
  ],
  civ_pro: [
    "Subject Matter Jurisdiction",
    "Personal Jurisdiction",
    "Venue & Removal",
    "Erie Doctrine",
    "Pleadings",
    "Joinder",
    "Discovery",
    "Pretrial & Trial",
    "Judgments & Preclusion",
  ],
  biz_assoc: [
    "Agency",
    "Partnerships",
    "Corporations — Formation",
    "Corporations — Governance",
    "Shareholder Rights",
    "Fiduciary Duties",
    "LLCs",
  ],
  mpt: ["MPT Format", "Objective Memo", "Persuasive Brief", "Fact Analysis"],
};

/* =========================================================================
   SUBJECT WORKSPACE TABS
   -------------------------------------------------------------------------
   `desc` is a template string; `{subject}` / `{topic}` are interpolated at
   render time.
   ========================================================================= */

export const SUBJECT_TABS: SubjectTab[] = [
  {
    id: "outline",
    label: "Rule Outline",
    icon: ScrollText,
    desc: "This is where the rule outline for {subject} → {topic} will appear.",
  },
  {
    id: "flashcards",
    label: "Flashcards",
    icon: Repeat,
    desc: "Rule and notes flashcards for {subject} → {topic}.",
  },
  {
    id: "mcqs",
    label: "MCQs",
    icon: Target,
    desc: "Multiple-choice questions for {subject} → {topic}.",
  },
  {
    id: "essays",
    label: "Essays",
    icon: FileText,
    desc: "This is where essay prompts and your responses for {subject} → {topic} will live.",
  },
  {
    id: "explain",
    label: "Explanation Machine",
    icon: Brain,
    desc: "The AI professor / explainer for {subject} → {topic}.",
  },
  {
    id: "notes",
    label: "Notes",
    icon: StickyNote,
    desc: "Lecture notes and study notes for {subject} → {topic}.",
  },
  {
    id: "simplifier",
    label: "Simplifier",
    icon: Wand2,
    desc: "BPS Simplifier — library, generator, and your saved simplifications for {subject} → {topic}.",
  },
  {
    id: "outside",
    label: "Outside Log",
    icon: Inbox,
    desc: "Outside practice log for {subject} → {topic}.",
  },
];

/* =========================================================================
   TOP-LEVEL NAV
   ========================================================================= */

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "subjects", icon: BookOpen, label: "Subjects" },
  { id: "notes", icon: StickyNote, label: "Notes" },
  { id: "outline_lab", icon: FlaskConical, label: "Outline Lab" },
  { id: "plans", icon: ListChecks, label: "Plans" },
  { id: "progress", icon: BarChart3, label: "Progress" },
];

/* =========================================================================
   TASK STATUSES
   ========================================================================= */

export const TASK_STATUSES: TaskStatus[] = [
  {
    id: "not_started",
    label: "Not started",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-300",
  },
  {
    id: "in_progress",
    label: "In progress",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  {
    id: "completed",
    label: "Completed",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  {
    id: "partial",
    label: "Partial",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  {
    id: "skipped",
    label: "Skipped",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
  {
    id: "rescheduled",
    label: "Rescheduled",
    color: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
  },
];

/* =========================================================================
   TASK TYPES
   -------------------------------------------------------------------------
   Source used a `CheckSquareSafe` wrapper that just rendered `CheckCircle2`
   — we reference `CheckCircle2` directly here.
   ========================================================================= */

export const TASK_TYPES: TaskType[] = [
  { id: "outline", label: "Outline", icon: ScrollText },
  { id: "flashcards", label: "Flashcards", icon: Repeat },
  { id: "mcq", label: "MCQ", icon: Target },
  { id: "essay", label: "Essay", icon: FileText },
  { id: "read", label: "Read", icon: BookOpen },
  { id: "other", label: "Other", icon: CheckCircle2 },
];

/* =========================================================================
   PLAN TEMPLATES
   ========================================================================= */

export const PLAN_TEMPLATES: PlanTemplate[] = [
  {
    id: "FULL_TIME",
    label: "Full-Time",
    desc: "6–8 hrs/day, 6 days/week. Comprehensive coverage.",
  },
  {
    id: "PART_TIME",
    label: "Part-Time",
    desc: "2–4 hrs/day, 5–6 days/week. Working professional pacing.",
  },
  {
    id: "LATE_START",
    label: "Late Start",
    desc: "Intensive ramp-up. Triage by weakness.",
  },
  {
    id: "CATCH_UP",
    label: "Catch-Up",
    desc: "Behind schedule. Focus on high-yield + defensive coverage.",
  },
];
