import { progressSummary } from '@/models/progress';
import { clearData } from '@/services/storage';
import { useAuth } from '@/store/AuthContext';
import { useCourses } from '@/store/CoursesContext';
import { useEnrollments } from '@/store/EnrollmentsContext';
import { useForum } from '@/store/ForumContext';

export function useProfileViewModel() {
  const { user, isInstructor, signOut, reloadUsers } = useAuth();
  const courses = useCourses();
  const enrollments = useEnrollments();
  const { reloadPosts } = useForum();

  const feedCourses = isInstructor ? courses.myCourses : enrollments.enrolledCourses;
  const summary = progressSummary(feedCourses.map((c) => enrollments.progressIn(c.id)));
  const bookmarkCount = enrollments.myEnrollments.reduce((sum, e) => sum + e.bookmarks.length, 0);
  const initials = (user?.name ?? '')
    .replace('Dr. ', '')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

  // Puts the sample courses, accounts and posts back, for testing and demos.
  async function resetDemoData() {
    await clearData();
    reloadUsers();
    courses.reloadCourses();
    enrollments.reloadEnrollments();
    reloadPosts();
    signOut();
  }

  return {
    user,
    isInstructor,
    loading: courses.loading || enrollments.loading,
    error: courses.error || enrollments.error,
    retry: () => {
      courses.reloadCourses();
      enrollments.reloadEnrollments();
    },
    initials,
    courseCount: feedCourses.length,
    completed: summary.completed,
    average: summary.average,
    bookmarkCount,
    signOut,
    resetDemoData,
  };
}
