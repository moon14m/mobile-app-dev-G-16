import { useState } from 'react';
import { Question, Quiz } from '@/models/types';
import { newId } from '@/utils/format';
import { hasErrors } from '@/utils/validation';
import { validateQuestion, validateQuiz } from '../validation';

const emptyQuestion = (): Question => ({ id: newId('qq'), text: '', options: ['', '', '', ''], correctIndex: -1 });

// Form state and validation for creating or editing a quiz.
export function useQuizForm(initial: Quiz | undefined, onSave: (quiz: Quiz) => void) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    dueDate: initial?.dueDate ?? '',
    passMark: initial ? String(initial.passMark) : '60',
  });
  const [questions, setQuestions] = useState<Question[]>(initial?.questions ?? [emptyQuestion()]);
  const [errors, setErrors] = useState({ title: '', dueDate: '', passMark: '' });
  const [questionErrors, setQuestionErrors] = useState<string[]>([]);
  const [formError, setFormError] = useState('');

  const update = (field: keyof typeof form) => (value: string) => setForm({ ...form, [field]: value });

  function changeQuestion(index: number, change: Partial<Question>) {
    setQuestions(questions.map((q, i) => (i === index ? { ...q, ...change } : q)));
  }

  function changeOption(index: number, optionIndex: number, value: string) {
    const options = questions[index].options.map((o, i) => (i === optionIndex ? value : o));
    changeQuestion(index, { options });
  }

  const addQuestion = () => setQuestions([...questions, emptyQuestion()]);
  const removeQuestion = (index: number) => setQuestions(questions.filter((_, i) => i !== index));

  function save() {
    const fieldErrors = validateQuiz(form);
    const perQuestion = questions.map((q) => validateQuestion(q.text, q.options, q.correctIndex));
    setErrors(fieldErrors);
    setQuestionErrors(perQuestion);
    setFormError(questions.length === 0 ? 'Add at least one question.' : '');
    if (hasErrors(fieldErrors) || perQuestion.some(Boolean) || questions.length === 0) return;

    onSave({
      id: initial?.id ?? newId('q'),
      title: form.title.trim(),
      dueDate: form.dueDate.trim(),
      passMark: Number(form.passMark),
      questions: questions.map((q) => ({ ...q, text: q.text.trim(), options: q.options.map((o) => o.trim()) })),
    });
  }

  return { form, update, errors, questions, questionErrors, formError, changeQuestion, changeOption, addQuestion, removeQuestion, save };
}
