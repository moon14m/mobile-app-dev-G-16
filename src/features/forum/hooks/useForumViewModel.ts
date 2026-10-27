import { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useCourses } from '@/store/CoursesContext';
import { useEnrollments } from '@/store/EnrollmentsContext';
import { useForum } from '@/store/ForumContext';
import { validatePost } from '../validation';

export function useForumViewModel(courseId: string) {
  const { user, isInstructor } = useAuth();
  const courses = useCourses();
  const enrollments = useEnrollments();
  const forum = useForum();
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [formError, setFormError] = useState('');

  const course = courses.getCourse(courseId);
  const posts = forum.postsFor(courseId).map((post) => ({ ...post, canDelete: post.authorId === user?.id }));

  function send() {
    const message = validatePost(text, rating, !isInstructor);
    setFormError(message);
    if (message) return;
    forum.addPost(courseId, text, rating);
    setText('');
    setRating(0);
  }

  return {
    signedIn: !!user,
    loading: forum.loading || courses.loading || enrollments.loading,
    error: forum.error,
    retry: forum.reloadPosts,
    allowed: !!course && enrollments.canOpen(course.id),
    course,
    isInstructor,
    posts,
    average: forum.averageRating(courseId),
    text,
    setText,
    rating,
    setRating,
    formError,
    send,
    deletePost: forum.deletePost,
  };
}
