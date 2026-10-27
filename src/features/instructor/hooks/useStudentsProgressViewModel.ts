import { useEffect, useState } from 'react';
import { progressSummary } from '@/models/progress';
import { useAuth } from '@/store/AuthContext';
import { useCourses } from '@/store/CoursesContext';
import { useEnrollments } from '@/store/EnrollmentsContext';
import { formatDate, plural } from '@/utils/format';

export function useStudentsProgressViewModel() {
  const { isInstructor } = useAuth();
  const courses = useCourses();
  const enrollments = useEnrollments();
  const { myCourses } = courses;
  const [courseId, setCourseId] = useState('');

  // Keep a valid course selected when courses load or one is deleted.
  useEffect(() => {
    if (!myCourses.some((c) => c.id === courseId)) setCourseId(myCourses[0]?.id ?? '');
  }, [myCourses, courseId]);

  const rows = enrollments.studentsIn(courseId).map(({ student, enrollment, progress }) => ({
    id: student.id,
    name: student.name,
    contact: `ID ${student.studentId} · ${student.email}`,
    progress,
    activity: `${plural(enrollment.doneIds.length, 'item')} done · ${plural(Object.keys(enrollment.quizScores).length, 'quiz', 'quizzes')} attempted · enrolled ${formatDate(enrollment.enrolledAt)}`,
  }));

  return {
    isInstructor,
    loading: courses.loading || enrollments.loading,
    error: courses.error || enrollments.error,
    retry: () => {
      courses.reloadCourses();
      enrollments.reloadEnrollments();
    },
    myCourses,
    courseId,
    selectCourse: setCourseId,
    courseTitle: myCourses.find((c) => c.id === courseId)?.title ?? '',
    rows,
    average: progressSummary(rows.map((r) => r.progress)).average,
  };
}
