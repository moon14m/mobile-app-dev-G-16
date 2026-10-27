import { first, isEmail, minLength, required } from '@/utils/validation';

export function validateSignIn(email: string, password: string) {
  return { email: first(required(email, 'Email'), isEmail(email)), password: required(password, 'Password') };
}

export function validateRegister(form: { name: string; email: string; password: string; studentId: string }) {
  return {
    name: first(required(form.name, 'Full name'), minLength(form.name, 3, 'Full name')),
    email: first(required(form.email, 'Email'), isEmail(form.email)),
    password: first(required(form.password, 'Password'), minLength(form.password, 6, 'Password')),
    studentId: /^\d{6}$/.test(form.studentId.trim()) ? '' : 'Student ID is 6 digits.',
  };
}
