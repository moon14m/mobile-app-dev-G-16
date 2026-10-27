import { parseTime } from '@/utils/format';
import { first, minLength, required } from '@/utils/validation';

export function validateBookmark(time: string, note: string, durationMin: number) {
  const seconds = parseTime(time);
  let timeError = seconds < 0 ? 'Use the format mm:ss, e.g. 04:30.' : '';
  if (!timeError && seconds > durationMin * 60) timeError = `The video is only ${durationMin} minutes long.`;
  return { time: timeError, note: first(required(note, 'Note'), minLength(note, 3, 'Note')) };
}
