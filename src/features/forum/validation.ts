export function validatePost(text: string, rating: number, needsRating: boolean) {
  const body = text.trim();
  if (body.length === 0) return 'Write something before posting.';
  if (body.length < 5) return 'Your post is too short (at least 5 characters).';
  if (body.length > 500) return 'Keep your post under 500 characters.';
  if (needsRating && rating === 0) return 'Rate the course from 1 to 5 stars.';
  return '';
}
