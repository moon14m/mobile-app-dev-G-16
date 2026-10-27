import { Course, CourseEvent } from '@/models/types';

// Lab deadlines and quiz dates from today on, nearest first.
export function upcomingEvents(courses: Course[], fromDate: string): CourseEvent[] {
  const events: CourseEvent[] = courses.flatMap((c) => [
    ...c.labs.map((lab) => ({ id: lab.id, courseId: c.id, courseCode: c.code, kind: 'Lab' as const, title: lab.title, date: lab.dueDate })),
    ...c.quizzes.map((quiz) => ({ id: quiz.id, courseId: c.id, courseCode: c.code, kind: 'Quiz' as const, title: quiz.title, date: quiz.dueDate })),
  ]);
  return events.filter((e) => e.date >= fromDate).sort((a, b) => a.date.localeCompare(b.date));
}
