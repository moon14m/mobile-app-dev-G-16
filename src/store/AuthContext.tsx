import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { User } from '@/models/types';
import { fetchUsers, saveUsers } from '@/services/api';
import { onSavedInAnotherTab } from '@/services/storage';
import { newId } from '@/utils/format';

type Result = { ok: true } | { ok: false; error: string };

type NewStudent = { name: string; email: string; password: string; studentId: string; department: string };

type AuthValue = {
  user: User | null;
  users: User[];
  isInstructor: boolean;
  loading: boolean;
  error: string;
  signIn: (email: string, password: string) => Result;
  register: (form: NewStudent) => Result;
  signOut: () => void;
  reloadUsers: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  function reloadUsers() {
    setLoading(true);
    fetchUsers()
      .then((loaded) => {
        setUsers(loaded);
        setReady(true);
      })
      .catch(() => setError('Could not load accounts. Restart the app and try again.'))
      .finally(() => setLoading(false));
  }

  useEffect(reloadUsers, []);
  useEffect(() => onSavedInAnotherTab<User[]>('users', setUsers), []);

  useEffect(() => {
    if (ready) saveUsers(users);
  }, [users, ready]);

  function signIn(email: string, password: string): Result {
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found || found.password !== password) return { ok: false, error: 'Email or password is incorrect.' };
    setUser(found);
    return { ok: true };
  }

  function register(form: NewStudent): Result {
    const email = form.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === email)) return { ok: false, error: 'An account with this email already exists.' };
    if (users.some((u) => u.studentId === form.studentId.trim())) return { ok: false, error: 'This student ID is already registered.' };

    const created: User = {
      id: newId('u'),
      name: form.name.trim(),
      email,
      password: form.password,
      role: 'student',
      department: form.department,
      studentId: form.studentId.trim(),
    };
    setUsers((all) => [...all, created]);
    setUser(created);
    return { ok: true };
  }

  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, users, isInstructor: user?.role === 'instructor', loading, error, signIn, register, signOut, reloadUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
