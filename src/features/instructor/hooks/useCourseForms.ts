import { useState } from 'react';
import { Course, CourseInfo, Lab, Lecture } from '@/models/types';
import { newId } from '@/utils/format';
import { hasErrors, splitList } from '@/utils/validation';
import { validateAnnouncement, validateCourseInfo, validateLab, validateLecture, validateSyllabus } from '../validation';

// Form state and validation for the Manage screen forms. The form components only display these.

export const DEPARTMENTS = ['Computer Science', 'Software Engineering', 'Artificial Intelligence'];

export function useCourseInfoForm(initial: CourseInfo | undefined, onSubmit: (info: CourseInfo) => void) {
  const [form, setForm] = useState({
    code: initial?.code ?? '',
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    department: initial?.department ?? DEPARTMENTS[0],
    credits: initial ? String(initial.credits) : '3',
  });
  const [errors, setErrors] = useState({ code: '', title: '', description: '', department: '', credits: '' });
  const [saved, setSaved] = useState(false);

  const update = (field: keyof typeof form) => (value: string) => {
    setForm({ ...form, [field]: value });
    setSaved(false);
  };

  function submit() {
    const fieldErrors = validateCourseInfo(form);
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) return;
    onSubmit({ ...form, code: form.code.trim(), title: form.title.trim(), description: form.description.trim(), credits: Number(form.credits) });
    setSaved(true);
  }

  return { form, errors, saved, update, submit };
}

export function useSyllabusForm(course: Course, onSave: (lines: string[]) => void) {
  const [text, setText] = useState(course.syllabus.join('\n'));
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  function changeText(value: string) {
    setText(value);
    setSaved(false);
  }

  function save() {
    const message = validateSyllabus(text);
    setError(message);
    if (message) return;
    onSave(text.split('\n').map((l) => l.trim()).filter(Boolean));
    setSaved(true);
  }

  return { text, changeText, error, saved, save };
}

export function useLectureForm(initial: Lecture | undefined, onSave: (lecture: Lecture) => void) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    videoTitle: initial?.videoTitle ?? '',
    duration: initial ? String(initial.durationMin) : '',
    materials: initial?.materials.join(', ') ?? '',
  });
  const [errors, setErrors] = useState({ title: '', description: '', videoTitle: '', duration: '', materials: '' });
  const update = (field: keyof typeof form) => (value: string) => setForm({ ...form, [field]: value });

  function save() {
    const fieldErrors = validateLecture(form);
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) return;
    onSave({
      id: initial?.id ?? newId('l'),
      title: form.title.trim(),
      description: form.description.trim(),
      videoTitle: form.videoTitle.trim(),
      durationMin: Number(form.duration),
      materials: splitList(form.materials),
    });
  }

  return { form, errors, update, save };
}

export function useLabForm(initial: Lab | undefined, onSave: (lab: Lab) => void) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    dueDate: initial?.dueDate ?? '',
    materials: initial?.materials.join(', ') ?? '',
  });
  const [errors, setErrors] = useState({ title: '', description: '', dueDate: '', materials: '' });
  const update = (field: keyof typeof form) => (value: string) => setForm({ ...form, [field]: value });

  function save() {
    const fieldErrors = validateLab(form);
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) return;
    onSave({
      id: initial?.id ?? newId('b'),
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate.trim(),
      materials: splitList(form.materials),
    });
  }

  return { form, errors, update, save };
}

export function useAnnouncementForm(onPublish: (title: string, body: string) => void) {
  const [form, setForm] = useState({ title: '', body: '' });
  const [errors, setErrors] = useState({ title: '', body: '' });
  const update = (field: keyof typeof form) => (value: string) => setForm({ ...form, [field]: value });

  function publish() {
    const fieldErrors = validateAnnouncement(form);
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) return;
    onPublish(form.title, form.body);
  }

  return { form, errors, update, publish };
}
