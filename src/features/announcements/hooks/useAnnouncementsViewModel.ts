import { useState } from 'react';
import { announcementsOf } from '@/models/announcements';
import { useAuth } from '@/store/AuthContext';
import { useCourses } from '@/store/CoursesContext';
import { useEnrollments } from '@/store/EnrollmentsContext';
import { today } from '@/utils/format';
import { upcomingEvents } from '../schedule';

export type AnnouncementsTab = 'news' | 'events';

export function useAnnouncementsViewModel() {
  const { isInstructor } = useAuth();
  const courses = useCourses();
  const enrollments = useEnrollments();
  const [tab, setTab] = useState<AnnouncementsTab>('news');

  // Instructors see their own courses, students the courses they are enrolled in.
  const feedCourses = isInstructor ? courses.myCourses : enrollments.enrolledCourses;
  const news = announcementsOf(feedCourses);
  const events = upcomingEvents(feedCourses, today());

  const emptyMessage =
    feedCourses.length === 0
      ? isInstructor
        ? 'Add a course in Manage to publish announcements.'
        : 'Enroll in a course to see its announcements and deadlines.'
      : tab === 'news'
        ? 'No announcements yet.'
        : 'No upcoming labs or quizzes.';

  return {
    loading: courses.loading || enrollments.loading,
    error: courses.error || enrollments.error,
    retry: () => {
      courses.reloadCourses();
      enrollments.reloadEnrollments();
    },
    tab,
    setTab,
    news,
    events,
    emptyMessage,
  };
}
