import { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { hasErrors } from '@/utils/validation';
import { validateRegister } from '../validation';

export const DEPARTMENTS = ['Computer Science', 'Software Engineering', 'Artificial Intelligence'];

type Field = 'name' | 'email' | 'password' | 'studentId';

export function useRegisterViewModel() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', studentId: '' });
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [errors, setErrors] = useState({ name: '', email: '', password: '', studentId: '' });
  const [formError, setFormError] = useState('');

  const update = (field: Field) => (value: string) => setForm({ ...form, [field]: value });

  // Returns true when the account was created and the user is signed in.
  function submit() {
    const fieldErrors = validateRegister(form);
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) return false;

    const result = register({ ...form, department });
    setFormError(result.ok ? '' : result.error);
    return result.ok;
  }

  return { form, update, departments: DEPARTMENTS, department, setDepartment, errors, formError, submit };
}
