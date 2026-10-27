import { Quiz } from '@/models/types';

// answers[i] is the option the student picked for question i
export function scoreQuiz(quiz: Quiz, answers: number[]): number {
  if (quiz.questions.length === 0) return 0;
  const correct = quiz.questions.filter((q, i) => answers[i] === q.correctIndex).length;
  return Math.round((correct / quiz.questions.length) * 100);
}

export function missingAnswers(answers: number[], questionCount: number): string {
  const missing = questionCount - answers.filter((a) => a >= 0).length;
  return missing > 0 ? `Answer all questions first (${missing} left).` : '';
}
