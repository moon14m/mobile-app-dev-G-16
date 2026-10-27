export const today = () => new Date().toISOString().slice(0, 10);

export const newId = (prefix: string) => `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;

// "2026-11-02" -> "2 Nov 2026"
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

// 135 -> "02:15"
export const formatTime = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

// "02:15" -> 135, or -1 if the text is not mm:ss
export function parseTime(text: string): number {
  const match = /^(\d{1,3}):([0-5]\d)$/.exec(text.trim());
  return match ? Number(match[1]) * 60 + Number(match[2]) : -1;
}

// plural(1, 'file') -> "1 file", plural(3, 'file') -> "3 files"
export const plural = (count: number, word: string, many = `${word}s`) => `${count} ${count === 1 ? word : many}`;
