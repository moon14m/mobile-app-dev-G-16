import { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { hasErrors } from '@/utils/validation';
import { validateSignIn } from '../validation';

export function useSignInViewModel() {
  const { signIn, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');

  // Returns true when the user is signed in.
  function submit() {
    const fieldErrors = validateSignIn(email, password);
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) return false;

    const result = signIn(email, password);
    setFormError(result.ok ? '' : result.error);
    return result.ok;
  }

  return { loading, error, email, setEmail, password, setPassword, errors, formError, submit };
}
