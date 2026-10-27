import { isPassed, watchedPercent } from '@/models/progress';
import { useAuth } from '@/store/AuthContext';
import { useCourses } from '@/store/CoursesContext';
import { useEnrollments } from '@/store/EnrollmentsContext';
import { formatDate, plural } from '@/utils/format';

export function useCourseViewModel(courseId: string) {
  const { user, users, isInstructor } = useAuth();
  const courses = useCourses();
  const enrollments = useEnrollments();

  const course = courses.getCourse(courseId);
  const allowed = !!course && enrollments.canOpen(course.id);
  const enrollment = enrollments.enrollmentOf(courseId);
  const isDone = (itemId: string) => !!enrollment?.doneIds.includes(itemId);

  const lectures = (course?.lectures ?? []).map((lecture) => {
    const watched = enrollment?.positions?.[lecture.id];
    const watchedText = watched ? ` · watched ${watchedPercent(watched, lecture.durationMin)}%` : '';
    return {
      id: lecture.id,
      title: lecture.title,
      detail: `${lecture.durationMin} min · ${plural(lecture.materials.length, 'file')}${watchedText}`,
      done: isDone(lecture.id),
    };
  });

  const labs = (course?.labs ?? []).map((lab) => ({
    id: lab.id,
    title: lab.title,
    detail: `Due ${formatDate(lab.dueDate)}`,
    done: isDone(lab.id),
  }));

  const quizzes = (course?.quizzes ?? []).map((quiz) => {
    const best = enrollment?.quizScores[quiz.id];
    return {
      id: quiz.id,
      title: quiz.title,
      detail: `${plural(quiz.questions.length, 'question')} · pass mark ${quiz.passMark}% · due ${formatDate(quiz.dueDate)}`,
      attempted: best !== undefined,
      passed: isPassed(quiz, best),
      result: best === undefined ? 'Not attempted' : `Best score ${best}% · ${isPassed(quiz, best) ? 'Passed' : 'Not passed'}`,
    };
  });

  return {
    signedIn: !!user,
    loading: courses.loading || enrollments.loading,
    error: courses.error || enrollments.error,
    retry: () => {
      courses.reloadCourses();
      enrollments.reloadEnrollments();
    },
    allowed,
    course,
    instructorName: users.find((u) => u.id === course?.instructorId)?.name ?? '',
    isStudent: !isInstructor,
    isOwner: !!course && courses.owns(course.id),
    progress: enrollments.progressIn(courseId),
    lectures,
    labs,
    quizzes,
    toggleDone: (itemId: string) => enrollments.toggleDone(courseId, itemId),
  };
}
