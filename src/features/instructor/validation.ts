import { first, inRange, isDate, minLength, required } from '@/utils/validation';

export function validateCourseInfo(form: { code: string; title: string; description: string; department: string; credits: string }) {
  return {
    code: /^[A-Z]{3}\d{3}$/.test(form.code.trim()) ? '' : 'Code is 3 capital letters and 3 digits, e.g. ICS310.',
    title: first(required(form.title, 'Title'), minLength(form.title, 4, 'Title')),
    description: first(required(form.description, 'Description'), minLength(form.description, 10, 'Description')),
    department: required(form.department, 'Department'),
    credits: inRange(form.credits, 1, 6, 'Credits'),
  };
}

export function validateLecture(form: { title: string; description: string; videoTitle: string; duration: string; materials: string }) {
  return {
    title: first(required(form.title, 'Title'), minLength(form.title, 4, 'Title')),
    description: required(form.description, 'Description'),
    videoTitle: required(form.videoTitle, 'Video title'),
    duration: inRange(form.duration, 1, 240, 'Duration'),
    materials: '',
  };
}

export function validateLab(form: { title: string; description: string; dueDate: string; materials: string }) {
  return {
    title: first(required(form.title, 'Title'), minLength(form.title, 4, 'Title')),
    description: required(form.description, 'Description'),
    dueDate: isDate(form.dueDate),
    materials: '',
  };
}

export function validateAnnouncement(form: { title: string; body: string }) {
  return {
    title: first(required(form.title, 'Title'), minLength(form.title, 4, 'Title')),
    body: first(required(form.body, 'Message'), minLength(form.body, 10, 'Message')),
  };
}

export function validateQuiz(form: { title: string; dueDate: string; passMark: string }) {
  return {
    title: first(required(form.title, 'Title'), minLength(form.title, 4, 'Title')),
    dueDate: isDate(form.dueDate),
    passMark: inRange(form.passMark, 1, 100, 'Pass mark'),
  };
}

export function validateQuestion(text: string, options: string[], correctIndex: number) {
  if (!text.trim()) return 'Write the question.';
  if (options.some((o) => !o.trim())) return 'Fill in all four options.';
  if (correctIndex < 0) return 'Choose the correct answer.';
  return '';
}

export function validateSyllabus(text: string) {
  const lines = text.split('\n').filter((l) => l.trim());
  return lines.length === 0 ? 'Add at least one week to the syllabus.' : '';
}
