import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useCourses } from '@/store/CoursesContext';
import { useEnrollments } from '@/store/EnrollmentsContext';
import { formatTime, parseTime } from '@/utils/format';
import { hasErrors } from '@/utils/validation';
import { validateBookmark } from '../validation';

export function useLessonViewModel(courseId: string, itemId: string) {
  const { user, isInstructor } = useAuth();
  const courses = useCourses();
  const enrollments = useEnrollments();

  const course = courses.getCourse(courseId);
  const lecture = course?.lectures.find((l) => l.id === itemId);
  const lab = course?.labs.find((l) => l.id === itemId);
  const item = lecture ?? lab;
  const isStudent = !isInstructor;
  const duration = lecture ? lecture.durationMin * 60 : 0;
  const enrollment = enrollments.enrollmentOf(courseId);

  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({ time: '', note: '' });
  const [position, setPosition] = useState(() => (lecture ? (enrollment?.positions?.[lecture.id] ?? 0) : 0));
  const [playing, setPlaying] = useState(false);
  const positionRef = useRef(position);
  positionRef.current = position;

  function savePosition(seconds: number) {
    if (isStudent && lecture) enrollments.savePosition(courseId, lecture.id, seconds);
  }

  // While playing, move one second forward every second.
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setPosition((p) => Math.min(p + 1, duration)), 1000);
    return () => clearInterval(timer);
  }, [playing, duration]);

  useEffect(() => {
    if (playing && duration > 0 && position >= duration) {
      setPlaying(false);
      savePosition(duration);
    }
  }, [position]);

  // Remember where the student stopped when they leave the page.
  useEffect(() => {
    return () => savePosition(positionRef.current);
  }, []);

  function seek(seconds: number) {
    const next = Math.max(0, Math.min(seconds, duration));
    setPosition(next);
    savePosition(next);
  }

  function togglePlay() {
    if (playing) {
      setPlaying(false);
      savePosition(position);
      return;
    }
    if (position >= duration) setPosition(0);
    setPlaying(true);
  }

  function saveBookmark() {
    if (!lecture) return;
    const fieldErrors = validateBookmark(time, note, lecture.durationMin);
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) return;
    enrollments.addBookmark(courseId, lecture.id, parseTime(time), note);
    setTime('');
    setNote('');
  }

  return {
    signedIn: !!user,
    loading: courses.loading || enrollments.loading,
    error: courses.error || enrollments.error,
    retry: () => {
      courses.reloadCourses();
      enrollments.reloadEnrollments();
    },
    allowed: !!course && !!item && enrollments.canOpen(course.id),
    course,
    lecture,
    lab,
    item,
    isStudent,
    done: !!item && !!enrollment?.doneIds.includes(item.id),
    toggleDone: () => item && enrollments.toggleDone(courseId, item.id),
    player: { position, duration, playing, togglePlay, seek },
    bookmarks: enrollment?.bookmarks.filter((b) => b.lectureId === itemId) ?? [],
    removeBookmark: (bookmarkId: string) => enrollments.removeBookmark(courseId, bookmarkId),
    bookmarkForm: {
      time,
      setTime,
      note,
      setNote,
      errors,
      currentTime: formatTime(position),
      useCurrentTime: () => setTime(formatTime(position)),
      save: saveBookmark,
    },
  };
}
