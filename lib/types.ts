/**
 * Shared type definitions for bar-prep-studio.
 *
 * Derived from the source prototype at `reference/bar_prep_studio.jsx`.
 * Keep in sync when new fields appear in seed data or component props.
 */

import type { LucideIcon } from "lucide-react";

/* =========================================================================
   SUBJECTS
   ========================================================================= */

export type SubjectId =
  | "contracts"
  | "evidence"
  | "torts"
  | "con_law"
  | "crim_law"
  | "crim_pro"
  | "real_property"
  | "civ_pro"
  | "biz_assoc"
  | "mpt";

export type SubjectStatus =
  | "Ready"
  | "In progress"
  | "Not started"
  | "Coming soon";

export interface Subject {
  id: SubjectId;
  name: string;
  short: string;
  /** Tailwind classes used for the subject badge (bg + text + border). */
  color: string;
  accuracy: number | null;
  started: boolean;
  /** 0–100 */
  progress: number;
  status: SubjectStatus;
  disabled?: boolean;
}

/** Map of subject id → ordered list of topic names. */
export type TopicMap = Record<SubjectId, string[]>;

/* =========================================================================
   NAVIGATION + TABS
   ========================================================================= */

export type SubjectTabId =
  | "outline"
  | "flashcards"
  | "mcqs"
  | "essays"
  | "explain"
  | "notes"
  | "simplifier"
  | "outside";

export interface SubjectTab {
  id: SubjectTabId;
  label: string;
  icon: LucideIcon;
  /** Placeholder template — may contain `{subject}` / `{topic}` tokens. */
  desc: string;
}

export type NavItemId =
  | "dashboard"
  | "subjects"
  | "notes"
  | "outline_lab"
  | "plans"
  | "progress";

export interface NavItem {
  id: NavItemId;
  icon: LucideIcon;
  label: string;
}

/* =========================================================================
   TASKS
   ========================================================================= */

export type TaskStatusId =
  | "not_started"
  | "in_progress"
  | "completed"
  | "partial"
  | "skipped"
  | "rescheduled";

export interface TaskStatus {
  id: TaskStatusId;
  label: string;
  color: string;
  dot: string;
}

export type TaskTypeId =
  | "outline"
  | "flashcards"
  | "mcq"
  | "essay"
  | "read"
  | "other";

export interface TaskType {
  id: TaskTypeId;
  label: string;
  icon: LucideIcon;
}

export interface Task {
  id: string;
  title: string;
  /** Subject display name (e.g. "Torts"); may be empty if unassigned. */
  subjectName: string;
  minutes: number;
  status: TaskStatusId;
  /** ISO date (YYYY-MM-DD). */
  scheduledFor: string;
  type: TaskTypeId;
  note?: string;
  timeSpent?: number;
  createdAt?: number;
  /** Optional link to a Material (e.g. Barbri chapter). */
  materialId?: string;
}

/* =========================================================================
   PLANS
   ========================================================================= */

export type PlanTemplateId = "FULL_TIME" | "PART_TIME" | "LATE_START" | "CATCH_UP";

export interface PlanTemplate {
  id: PlanTemplateId;
  label: string;
  desc: string;
}

export type StudyMode = "full-time" | "part-time";

export interface PlanInputs {
  examDate: string;
  startDate: string;
  mode: StudyMode;
  hoursPerDay: number;
  daysPerWeek: number;
  template: PlanTemplateId;
  targets: string;
  materials: string;
  bookToc: string;
  coursePlan: string;
}

export interface WeeklyTarget {
  week: number;
  phase: string;
  focus: string;
  goals: string[];
}

export interface GeneratedPlan {
  overview: string;
  weeklyTargets: WeeklyTarget[];
  dailyTemplate: string[];
  generatedAt: number;
}

/* =========================================================================
   FLASHCARDS
   ========================================================================= */

export type FlashcardDeck = "rule" | "notes";

export interface SRSData {
  interval: number;
  ease: number;
  dueAt: number;
  lastReviewed: number | null;
  reviews: number;
}

export interface Flashcard extends SRSData {
  id: string;
  deck: FlashcardDeck;
  subjectId: SubjectId;
  topic: string;
  front: string;
  back: string;
  source?: string;
}

/* =========================================================================
   MCQs
   ========================================================================= */

export interface MCQ {
  id: string;
  subjectId: SubjectId;
  topic: string;
  question: string;
  choices: string[];
  /** Index into `choices`. */
  correct: number;
  explanation: string;
  /** Optional sub-topic tag (falls back to `topic`). */
  tag?: string;
}

export interface MCQResult {
  id: string;
  mcqId: string;
  correct: boolean;
  selectedIndex: number;
  timestamp: number;
}

/* =========================================================================
   OUTLINES + NOTES
   ========================================================================= */

export interface Outline {
  content: string;
  updatedAt: number;
}

export interface Note {
  content: string;
  important: boolean;
  confusing: boolean;
  updatedAt?: number;
}

/** SubjectId → topic name → Outline. */
export type OutlineMap = Partial<Record<SubjectId, Record<string, Outline>>>;

/** SubjectId → topic name → Note. */
export type NoteMap = Partial<Record<SubjectId, Record<string, Note>>>;

/* =========================================================================
   SIMPLIFIER
   ========================================================================= */

export type SimplificationType =
  | "SIMPLIFY"
  | "TABLE"
  | "FLOWCHART"
  | "ATTACK_SHEET"
  | "SUMMARY"
  | "RULE_MAP";

export type SimplificationSource = "BPS_LIBRARY" | "USER";

export interface Simplification {
  id: string;
  subjectId: SubjectId;
  topic: string;
  type: SimplificationType;
  title: string;
  content: string;
  source: SimplificationSource;
  createdAt: number;
  updatedAt?: number;
}

/* =========================================================================
   EXPLANATION MACHINE
   ========================================================================= */

export type ExplanationMode =
  | "SIMPLE"
  | "STEP"
  | "COMPARE"
  | "EXAMPLE"
  | "MEMORY"
  | "QUIZ";

export type ExplanationSectionType =
  | "simple"
  | "step"
  | "compare"
  | "example"
  | "memory"
  | "trap";

export interface ExplanationSection {
  type: ExplanationSectionType;
  title: string;
  content: string;
}

export interface QuizQuestion {
  q: string;
  a: string;
}

export interface ExplanationPayload {
  isQuiz: boolean;
  sections?: ExplanationSection[];
  questions?: QuizQuestion[];
  subject: Subject;
  topic: string;
  mode?: ExplanationMode;
  input?: string;
}

export interface SavedExplanation {
  id: string;
  subjectId: SubjectId;
  topic: string;
  prompt: string;
  mode: ExplanationMode;
  payload: ExplanationPayload;
  timestamp: number;
}

/* =========================================================================
   ROUTINE + MATERIALS
   ========================================================================= */

export interface RoutineBlock {
  id: string;
  start: string;
  end: string;
  label: string;
}

export interface Routine {
  wakeTime: string;
  studyStart: string;
  obligations: string;
  breakPref: string;
  blocks: RoutineBlock[];
}

export interface Material {
  id: string;
  name: string;
  chapters: number;
  completed: number;
  lastUpdated: number;
}

/* =========================================================================
   OUTLINE LAB
   ========================================================================= */

export interface OutlineLabInputs {
  subjectId: SubjectId;
  topic: string;
  personalNotes: string;
  externalOutline: string;
  bookToc: string;
  otherMaterials: string;
  coursePlan: string;
}

/* =========================================================================
   USER / AUTH
   ========================================================================= */

export interface User {
  id: string;
  email: string;
  /** SHA-256 hex digest (or fallback). Placeholder until Supabase Auth. */
  passwordHash: string;
  createdAt: number;
}

/* =========================================================================
   TOP-LEVEL VIEW STATE
   ========================================================================= */

/** The global view the single-page shell is currently rendering. */
export type View = NavItemId | "subject";
