import { useEffect, useState } from 'react';
import { CourseInfo, Lab, Lecture, Quiz } from '@/models/types';
import { useAuth } from '@/store/AuthContext';
import { CourseList, useCourses } from '@/store/CoursesContext';
import { useEnrollments } from '@/store/EnrollmentsContext';
import { formatDate, plural } from '@/utils/format';

export type Section = 'info' | 'lectures' | 'labs' | 'quizzes' | 'announcements';

export const SECTIONS: { key: Section; label: string }[] = [
  { key: 'info', label: 'Info & syllabus' },
  { key: 'lectures', label: 'Lectures' },
  { key: 'labs', label: 'Labs' },
  { key: 'quizzes', label: 'Quizzes' },
  { key: 'announcements', label: 'Announcements' },
];

// openCourseId comes from the Course page "Edit in Manage" button.
export function useManageCourseViewModel(openCourseId?: string) {
  const { isInstructor } = useAuth();
  const courses = useCourses();
  const { removeEnrollmentsOf } = useEnrollments();
  const { myCourses } = courses;
  const [courseId, setCourseId] = useState('');
  const [section, setSection] = useState<Section>('info');
  const [adding, setAdding] = useState(false);
  // "new" means the add form is open, an item id means that item is being edited.
  const [editing, setEditing] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Open the course passed from the Course page, otherwise keep a valid selection.
  useEffect(() => {
    if (openCourseId && myCourses.some((c) => c.id === openCourseId)) setCourseId(openCourseId);
  }, [openCourseId]);

  useEffect(() => {
    if (!myCourses.some((c) => c.id === courseId)) setCourseId(myCourses[0]?.id ?? '');
  }, [myCourses, courseId]);

  useEffect(() => {
    setEditing(null);
    setConfirmDelete(false);
  }, [courseId, section]);

  const course = myCourses.find((c) => c.id === courseId);
  const closeEditor = () => setEditing(null);

  function createCourse(info: CourseInfo) {
    setCourseId(courses.addCourse(info));
    setSection('info');
    setAdding(false);
  }

  // First tap asks for confirmation, second tap deletes the course and its enrollments.
  function pressDelete() {
    if (!course) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    removeEnrollmentsOf(course.id);
    courses.deleteCourse(course.id);
  }

  return {
    isInstructor,
    loading: courses.loading,
    error: courses.error,
    retry: courses.reloadCourses,
    myCourses,
    course,
    selectCourse: setCourseId,
    summary: course
      ? `${course.code} · ${plural(course.lectures.length, 'lecture')} · ${plural(course.labs.length, 'lab')} · ${plural(course.quizzes.length, 'quiz', 'quizzes')}`
      : '',
    section,
    setSection,
    adding,
    startAdding: () => setAdding(true),
    cancelAdding: () => setAdding(false),
    createCourse,
    editing,
    startEditing: (id: string) => setEditing(id),
    closeEditor,
    confirmDelete,
    pressDelete,

    lectureRows: (course?.lectures ?? []).map((l) => ({ id: l.id, title: l.title, detail: `${l.durationMin} min · ${plural(l.materials.length, 'file')}` })),
    labRows: (course?.labs ?? []).map((l) => ({ id: l.id, title: l.title, detail: `Due ${formatDate(l.dueDate)}` })),
    quizRows: (course?.quizzes ?? []).map((q) => ({ id: q.id, title: q.title, detail: `${plural(q.questions.length, 'question')} · due ${formatDate(q.dueDate)}` })),
    announcementRows: (course?.announcements ?? []).map((a) => ({ id: a.id, title: a.title, detail: formatDate(a.date) })),
    editingLecture: course?.lectures.find((l) => l.id === editing),
    editingLab: course?.labs.find((l) => l.id === editing),
    editingQuiz: course?.quizzes.find((q) => q.id === editing),

    saveInfo: (info: CourseInfo) => course && courses.updateCourse(course.id, info),
    saveSyllabus: (syllabus: string[]) => course && courses.updateCourse(course.id, { syllabus }),
    saveLecture: (lecture: Lecture) => {
      if (course) courses.saveLecture(course.id, lecture);
      closeEditor();
    },
    saveLab: (lab: Lab) => {
      if (course) courses.saveLab(course.id, lab);
      closeEditor();
    },
    saveQuiz: (quiz: Quiz) => {
      if (course) courses.saveQuiz(course.id, quiz);
      closeEditor();
    },
    publishAnnouncement: (title: string, body: string) => {
      if (course) courses.publishAnnouncement(course.id, title, body);
      closeEditor();
    },
    removeItem: (list: CourseList, itemId: string) => course && courses.removeItem(course.id, list, itemId),
  };
}
