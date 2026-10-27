import { announcementsOf } from '@/models/announcements';
import { progressSummary } from '@/models/progress';
import { useAuth } from '@/store/AuthContext';
import { useCourses } from '@/store/CoursesContext';
import { useEnrollments } from '@/store/EnrollmentsContext';

export function useDashboardViewModel() {
  const { user, isInstructor } = useAuth();
  const courses = useCourses();
  const enrollments = useEnrollments();

  const myCourses = enrollments.enrolledCourses.map((course) => ({
    id: course.id,
    code: course.code,
    title: course.title,
    progress: enrollments.progressIn(course.id),
  }));
  const summary = progressSummary(myCourses.map((c) => c.progress));

  return {
    isInstructor,
    loading: courses.loading || enrollments.loading,
    error: courses.error || enrollments.error,
    retry: () => {
      courses.reloadCourses();
      enrollments.reloadEnrollments();
    },
    firstName: user?.name.split(' ')[0] ?? '',
    stats: [
      { label: 'Enrolled', value: String(summary.enrolled) },
      { label: 'Completed', value: String(summary.completed) },
      { label: 'Average', value: `${summary.average}%` },
    ],
    myCourses,
    latestAnnouncements: announcementsOf(enrollments.enrolledCourses).slice(0, 3),
  };
}
