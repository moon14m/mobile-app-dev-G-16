import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Announcement, Course, CourseInfo, Lab, Lecture, Quiz } from '@/models/types';
import { fetchCourses, saveCourses } from '@/services/api';
import { onSavedInAnotherTab } from '@/services/storage';
import { newId, today } from '@/utils/format';
import { useAuth } from './AuthContext';

export type CourseList = 'lectures' | 'labs' | 'quizzes' | 'announcements';

// Course content. Only the instructor who owns a course can change it.
type CoursesValue = {
  courses: Course[];
  loading: boolean;
  error: string;
  reloadCourses: () => void;
  getCourse: (id: string) => Course | undefined;
  owns: (courseId: string) => boolean;
  myCourses: Course[];
  addCourse: (info: CourseInfo) => string;
  updateCourse: (courseId: string, changes: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  saveLecture: (courseId: string, lecture: Lecture) => void;
  saveLab: (courseId: string, lab: Lab) => void;
  saveQuiz: (courseId: string, quiz: Quiz) => void;
  publishAnnouncement: (courseId: string, title: string, body: string) => void;
  removeItem: (courseId: string, list: CourseList, itemId: string) => void;
};

const CoursesContext = createContext<CoursesValue | null>(null);

// Replaces the item with the same id, or adds it at the end.
function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  return list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item];
}

export function CoursesProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  function reloadCourses() {
    setLoading(true);
    setError('');
    fetchCourses()
      .then((loaded) => {
        setCourses(loaded);
        setReady(true);
      })
      .catch(() => setError('Could not load courses. Check your connection and try again.'))
      .finally(() => setLoading(false));
  }

  useEffect(reloadCourses, []);
  useEffect(() => onSavedInAnotherTab<Course[]>('courses', setCourses), []);

  // Save after every change, once the data has loaded.
  useEffect(() => {
    if (ready) saveCourses(courses);
  }, [courses, ready]);

  const getCourse = (id: string) => courses.find((c) => c.id === id);
  const owns = (courseId: string) => !!user && user.role === 'instructor' && getCourse(courseId)?.instructorId === user.id;
  const myCourses = courses.filter((c) => c.instructorId === user?.id);

  function addCourse(info: CourseInfo) {
    if (!user || user.role !== 'instructor') return '';
    const id = newId('c');
    const course: Course = { ...info, id, instructorId: user.id, syllabus: [], lectures: [], labs: [], quizzes: [], announcements: [] };
    setCourses((all) => [...all, course]);
    return id;
  }

  function updateCourse(courseId: string, changes: Partial<Course>) {
    if (!owns(courseId)) return;
    setCourses((all) => all.map((c) => (c.id === courseId ? { ...c, ...changes, id: c.id, instructorId: c.instructorId } : c)));
  }

  function deleteCourse(courseId: string) {
    if (!owns(courseId)) return;
    setCourses((all) => all.filter((c) => c.id !== courseId));
  }

  function editCourse(courseId: string, change: (c: Course) => Course) {
    if (!owns(courseId)) return;
    setCourses((all) => all.map((c) => (c.id === courseId ? change(c) : c)));
  }

  const saveLecture = (courseId: string, lecture: Lecture) => editCourse(courseId, (c) => ({ ...c, lectures: upsert(c.lectures, lecture) }));
  const saveLab = (courseId: string, lab: Lab) => editCourse(courseId, (c) => ({ ...c, labs: upsert(c.labs, lab) }));
  const saveQuiz = (courseId: string, quiz: Quiz) => editCourse(courseId, (c) => ({ ...c, quizzes: upsert(c.quizzes, quiz) }));

  function publishAnnouncement(courseId: string, title: string, body: string) {
    const announcement: Announcement = { id: newId('a'), title: title.trim(), body: body.trim(), date: today() };
    editCourse(courseId, (c) => ({ ...c, announcements: [announcement, ...c.announcements] }));
  }

  function removeItem(courseId: string, list: CourseList, itemId: string) {
    editCourse(courseId, (c) => ({ ...c, [list]: (c[list] as { id: string }[]).filter((x) => x.id !== itemId) }));
  }

  return (
    <CoursesContext.Provider
      value={{
        courses,
        loading,
        error,
        reloadCourses,
        getCourse,
        owns,
        myCourses,
        addCourse,
        updateCourse,
        deleteCourse,
        saveLecture,
        saveLab,
        saveQuiz,
        publishAnnouncement,
        removeItem,
      }}>
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  const value = useContext(CoursesContext);
  if (!value) throw new Error('useCourses must be used inside CoursesProvider');
  return value;
}
