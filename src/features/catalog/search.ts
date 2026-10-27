import { Course } from '@/models/types';

export const ALL_DEPARTMENTS = 'All';

export function departmentsOf(courses: Course[]): string[] {
  return [ALL_DEPARTMENTS, ...new Set(courses.map((c) => c.department))];
}

// Matches the title or the code, inside the chosen department.
export function searchCourses(courses: Course[], text: string, department: string): Course[] {
  const query = text.trim().toLowerCase();
  return courses.filter(
    (c) =>
      (department === ALL_DEPARTMENTS || c.department === department) &&
      (c.title.toLowerCase().includes(query) || c.code.toLowerCase().includes(query)),
  );
}
