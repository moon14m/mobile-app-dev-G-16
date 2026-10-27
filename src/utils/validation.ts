// Each check returns an error message, or '' when the value is fine.

export const required = (value: string, label: string) => (value.trim() ? '' : `${label} is required.`);

export const minLength = (value: string, min: number, label: string) =>
  value.trim().length >= min ? '' : `${label} must be at least ${min} characters.`;

export const isEmail = (value: string) => (/^\S+@\S+\.\S+$/.test(value.trim()) ? '' : 'Enter a valid email address.');

export const isDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value.trim()) && !isNaN(Date.parse(value.trim())) ? '' : 'Use the format YYYY-MM-DD.';

export const inRange = (value: string, min: number, max: number, label: string) => {
  const n = Number(value);
  return value.trim() !== '' && Number.isInteger(n) && n >= min && n <= max ? '' : `${label} must be a whole number from ${min} to ${max}.`;
};

// The first error in the list, or '' if there is none.
export const first = (...errors: string[]) => errors.find((e) => e !== '') ?? '';

export const hasErrors = (errors: Record<string, string>) => Object.values(errors).some((e) => e !== '');

// "a.pdf, b.zip" -> ["a.pdf", "b.zip"]
export const splitList = (text: string) =>
  text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
