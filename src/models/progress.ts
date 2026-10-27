import { Course, Enrollment, Quiz } from './types';

// Progress = (lectures and labs done + quizzes passed) / (all lectures, labs and quizzes)
export function progressOf(course: Course, enrollment?: Enrollment): number {
  if (!enrollment) return 0;
  const total = course.lectures.length + course.labs.length + course.quizzes.length;
  if (total === 0) return 0;

  const itemIds = [...course.lectures, ...course.labs].map((item) => item.id);
  const done = enrollment.doneIds.filter((id) => itemIds.includes(id)).length;
  const passed = course.quizzes.filter((quiz) => isPassed(quiz, enrollment.quizScores[quiz.id])).length;
  return Math.round(((done + passed) / total) * 100);
}

export function isPassed(quiz: Quiz, score: number | undefined): boolean {
  return score !== undefined && score >= quiz.passMark;
}

// Totals shown on the dashboard, the profile and the students list.
export function progressSummary(progressList: number[]) {
  const enrolled = progressList.length;
  const completed = progressList.filter((p) => p === 100).length;
  const average = enrolled === 0 ? 0 : Math.round(progressList.reduce((sum, p) => sum + p, 0) / enrolled);
  return { enrolled, completed, average };
}

export function watchedPercent(seconds: number, durationMin: number): number {
  if (durationMin <= 0) return 0;
  return Math.min(100, Math.round((seconds / (durationMin * 60)) * 100));
}
