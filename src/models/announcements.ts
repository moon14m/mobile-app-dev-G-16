import { Announcement, Course } from './types';

export type CourseAnnouncement = Announcement & { courseId: string; courseCode: string };

// All announcements of the given courses, newest first.
export function announcementsOf(courses: Course[]): CourseAnnouncement[] {
  return courses
    .flatMap((c) => c.announcements.map((a) => ({ ...a, courseId: c.id, courseCode: c.code })))
    .sort((a, b) => b.date.localeCompare(a.date));
}
