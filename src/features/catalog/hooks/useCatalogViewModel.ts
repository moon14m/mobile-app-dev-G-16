import { useMemo, useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useCourses } from '@/store/CoursesContext';
import { useEnrollments } from '@/store/EnrollmentsContext';
import { ALL_DEPARTMENTS, departmentsOf, searchCourses } from '../search';

// What the user can do with a course in the list.
export type CatalogAction = 'open' | 'enroll' | 'none';

export function useCatalogViewModel() {
  const { users, isInstructor } = useAuth();
  const { courses, loading, error, reloadCourses, owns } = useCourses();
  const enrollments = useEnrollments();
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState(ALL_DEPARTMENTS);

  const departments = useMemo(() => departmentsOf(courses), [courses]);
  const found = useMemo(() => searchCourses(courses, search, department), [courses, search, department]);

  function actionFor(courseId: string): CatalogAction {
    if (isInstructor) return owns(courseId) ? 'open' : 'none';
    return enrollments.enrollmentOf(courseId) ? 'open' : 'enroll';
  }

  const results = found.map((course) => ({
    course,
    instructorName: users.find((u) => u.id === course.instructorId)?.name ?? 'Staff',
    action: actionFor(course.id),
  }));

  return {
    loading: loading || enrollments.loading,
    error: error || enrollments.error,
    retry: () => {
      reloadCourses();
      enrollments.reloadEnrollments();
    },
    search,
    setSearch,
    departments,
    department,
    setDepartment,
    results,
    enroll: enrollments.enroll,
  };
}
