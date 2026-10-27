import { useState } from 'react';
import { isPassed } from '@/models/progress';
import { useAuth } from '@/store/AuthContext';
import { useCourses } from '@/store/CoursesContext';
import { useEnrollments } from '@/store/EnrollmentsContext';
import { missingAnswers, scoreQuiz } from '../scoring';

export type OptionState = 'idle' | 'picked' | 'correct' | 'wrong';

export function useQuizViewModel(courseId: string, quizId: string) {
  const { user, isInstructor } = useAuth();
  const courses = useCourses();
  const enrollments = useEnrollments();
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [warning, setWarning] = useState('');

  const course = courses.getCourse(courseId);
  const quiz = course?.quizzes.find((q) => q.id === quizId);
  const submitted = score !== null;

  function choose(questionIndex: number, optionIndex: number) {
    if (submitted) return;
    const next = [...answers];
    next[questionIndex] = optionIndex;
    setAnswers(next);
    setWarning('');
  }

  // Returns true when the answers were marked.
  function submit() {
    if (!quiz) return false;
    const message = missingAnswers(answers, quiz.questions.length);
    setWarning(message);
    if (message) return false;
    const result = scoreQuiz(quiz, answers);
    enrollments.saveQuizScore(courseId, quiz.id, result);
    setScore(result);
    return true;
  }

  function retake() {
    setAnswers([]);
    setScore(null);
    setWarning('');
  }

  function optionState(questionIndex: number, optionIndex: number): OptionState {
    const picked = answers[questionIndex] === optionIndex;
    if (!submitted) return picked ? 'picked' : 'idle';
    if (optionIndex === quiz?.questions[questionIndex].correctIndex) return 'correct';
    return picked ? 'wrong' : 'idle';
  }

  return {
    signedIn: !!user,
    loading: courses.loading || enrollments.loading,
    error: courses.error || enrollments.error,
    retry: () => {
      courses.reloadCourses();
      enrollments.reloadEnrollments();
    },
    allowed: !!course && !!quiz && !isInstructor && enrollments.canOpen(course.id),
    course,
    quiz,
    best: enrollments.enrollmentOf(courseId)?.quizScores[quizId],
    answers,
    submitted,
    score,
    passed: !!quiz && score !== null && isPassed(quiz, score),
    warning,
    choose,
    submit,
    retake,
    optionState,
  };
}
