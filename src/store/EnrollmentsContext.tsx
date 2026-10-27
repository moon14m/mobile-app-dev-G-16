import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { progressOf } from '@/models/progress';
import { Course, Enrollment, User } from '@/models/types';
import { fetchEnrollments, saveEnrollments } from '@/services/api';
import { onSavedInAnotherTab } from '@/services/storage';
import { newId, today } from '@/utils/format';
import { useAuth } from './AuthContext';
import { useCourses } from './CoursesContext';

export type StudentRow = { student: User; enrollment: Enrollment; progress: number };

// Who is enrolled where, and each student's progress in that course.
type EnrollmentsValue = {
  loading: boolean;
  error: string;
  reloadEnrollments: () => void;
  myEnrollments: Enrollment[];
  enrolledCourses: Course[];
  enrollmentOf: (courseId: string) => Enrollment | undefined;
  canOpen: (courseId: string) => boolean;
  progressIn: (courseId: string) => number;
  enroll: (courseId: string) => void;
  toggleDone: (courseId: string, itemId: string) => void;
  saveQuizScore: (courseId: string, quizId: string, score: number) => void;
  addBookmark: (courseId: string, lectureId: string, seconds: number, note: string) => void;
  removeBookmark: (courseId: string, bookmarkId: string) => void;
  savePosition: (courseId: string, lectureId: string, seconds: number) => void;
  // instructor, only for their own courses
  studentsIn: (courseId: string) => StudentRow[];
  removeEnrollmentsOf: (courseId: string) => void;
};

const EnrollmentsContext = createContext<EnrollmentsValue | null>(null);

export function EnrollmentsProvider({ children }: PropsWithChildren) {
  const { user, users } = useAuth();
  const { courses, getCourse, owns } = useCourses();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  function reloadEnrollments() {
    setLoading(true);
    setError('');
    fetchEnrollments()
      .then((loaded) => {
        setEnrollments(loaded);
        setReady(true);
      })
      .catch(() => setError('Could not load your progress. Check your connection and try again.'))
      .finally(() => setLoading(false));
  }

  useEffect(reloadEnrollments, []);
  useEffect(() => onSavedInAnotherTab<Enrollment[]>('enrollments', setEnrollments), []);

  // Save after every change, once the data has loaded.
  useEffect(() => {
    if (ready) saveEnrollments(enrollments);
  }, [enrollments, ready]);

  const myEnrollments = enrollments.filter((e) => e.userId === user?.id);
  const enrollmentOf = (courseId: string) => myEnrollments.find((e) => e.courseId === courseId);
  const enrolledCourses = courses.filter((c) => !!enrollmentOf(c.id));
  const canOpen = (courseId: string) => owns(courseId) || (user?.role === 'student' && !!enrollmentOf(courseId));

  function progressIn(courseId: string) {
    const course = getCourse(courseId);
    return course ? progressOf(course, enrollmentOf(courseId)) : 0;
  }

  function changeMine(courseId: string, change: (e: Enrollment) => Enrollment) {
    setEnrollments((all) => all.map((e) => (e.userId === user?.id && e.courseId === courseId ? change(e) : e)));
  }

  function enroll(courseId: string) {
    if (!user || user.role !== 'student' || enrollmentOf(courseId)) return;
    const created: Enrollment = { userId: user.id, courseId, enrolledAt: today(), doneIds: [], quizScores: {}, bookmarks: [], positions: {} };
    setEnrollments((all) => [...all, created]);
  }

  function toggleDone(courseId: string, itemId: string) {
    changeMine(courseId, (e) => ({
      ...e,
      doneIds: e.doneIds.includes(itemId) ? e.doneIds.filter((id) => id !== itemId) : [...e.doneIds, itemId],
    }));
  }

  // Keeps the best attempt.
  function saveQuizScore(courseId: string, quizId: string, score: number) {
    changeMine(courseId, (e) => ({ ...e, quizScores: { ...e.quizScores, [quizId]: Math.max(score, e.quizScores[quizId] ?? 0) } }));
  }

  function addBookmark(courseId: string, lectureId: string, seconds: number, note: string) {
    const bookmark = { id: newId('bm'), lectureId, seconds, note: note.trim() };
    changeMine(courseId, (e) => ({ ...e, bookmarks: [...e.bookmarks, bookmark].sort((a, b) => a.seconds - b.seconds) }));
  }

  function removeBookmark(courseId: string, bookmarkId: string) {
    changeMine(courseId, (e) => ({ ...e, bookmarks: e.bookmarks.filter((b) => b.id !== bookmarkId) }));
  }

  // Remembers where the student stopped the video. Watching to the end completes the lecture.
  function savePosition(courseId: string, lectureId: string, seconds: number) {
    const lecture = getCourse(courseId)?.lectures.find((l) => l.id === lectureId);
    if (!lecture) return;
    const finished = seconds >= lecture.durationMin * 60;
    changeMine(courseId, (e) => ({
      ...e,
      positions: { ...e.positions, [lectureId]: seconds },
      doneIds: finished && !e.doneIds.includes(lectureId) ? [...e.doneIds, lectureId] : e.doneIds,
    }));
  }

  function studentsIn(courseId: string): StudentRow[] {
    const course = getCourse(courseId);
    if (!course || !owns(courseId)) return [];
    return enrollments
      .filter((e) => e.courseId === courseId)
      .map((e) => ({ student: users.find((u) => u.id === e.userId), enrollment: e, progress: progressOf(course, e) }))
      .filter((row): row is StudentRow => row.student !== undefined)
      .sort((a, b) => b.progress - a.progress);
  }

  // Used when an instructor deletes their course.
  function removeEnrollmentsOf(courseId: string) {
    if (!owns(courseId)) return;
    setEnrollments((all) => all.filter((e) => e.courseId !== courseId));
  }

  return (
    <EnrollmentsContext.Provider
      value={{
        loading,
        error,
        reloadEnrollments,
        myEnrollments,
        enrolledCourses,
        enrollmentOf,
        canOpen,
        progressIn,
        enroll,
        toggleDone,
        saveQuizScore,
        addBookmark,
        removeBookmark,
        savePosition,
        studentsIn,
        removeEnrollmentsOf,
      }}>
      {children}
    </EnrollmentsContext.Provider>
  );
}

export function useEnrollments() {
  const value = useContext(EnrollmentsContext);
  if (!value) throw new Error('useEnrollments must be used inside EnrollmentsProvider');
  return value;
}
