import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { ForumPost } from '@/models/types';
import { fetchPosts, savePosts } from '@/services/api';
import { onSavedInAnotherTab } from '@/services/storage';
import { newId } from '@/utils/format';
import { useAuth } from './AuthContext';
import { useEnrollments } from './EnrollmentsContext';

type ForumValue = {
  loading: boolean;
  error: string;
  postsFor: (courseId: string) => ForumPost[];
  averageRating: (courseId: string) => number | null;
  addPost: (courseId: string, body: string, rating: number) => void;
  deletePost: (postId: string) => void;
  reloadPosts: () => void;
};

const ForumContext = createContext<ForumValue | null>(null);

export function ForumProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const { canOpen } = useEnrollments();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  function reloadPosts() {
    setLoading(true);
    setError('');
    fetchPosts()
      .then((loaded) => {
        setPosts(loaded);
        setReady(true);
      })
      .catch(() => setError('Could not load the forum.'))
      .finally(() => setLoading(false));
  }

  useEffect(reloadPosts, []);
  useEffect(() => onSavedInAnotherTab<ForumPost[]>('posts', setPosts), []);

  useEffect(() => {
    if (ready) savePosts(posts);
  }, [posts, ready]);

  const postsFor = (courseId: string) =>
    posts.filter((p) => p.courseId === courseId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function averageRating(courseId: string) {
    const rated = postsFor(courseId).filter((p) => p.rating !== null);
    if (rated.length === 0) return null;
    return Math.round((rated.reduce((sum, p) => sum + (p.rating ?? 0), 0) / rated.length) * 10) / 10;
  }

  // Students post an opinion with a rating; the course instructor posts without one.
  function addPost(courseId: string, body: string, rating: number) {
    if (!user || !canOpen(courseId)) return;
    const post: ForumPost = {
      id: newId('p'),
      courseId,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      body: body.trim(),
      rating: user.role === 'student' ? rating : null,
      createdAt: new Date().toISOString(),
    };
    setPosts((all) => [post, ...all]);
  }

  function deletePost(postId: string) {
    setPosts((all) => all.filter((p) => !(p.id === postId && p.authorId === user?.id)));
  }

  return (
    <ForumContext.Provider value={{ loading, error, postsFor, averageRating, addPost, deletePost, reloadPosts }}>{children}</ForumContext.Provider>
  );
}

export function useForum() {
  const value = useContext(ForumContext);
  if (!value) throw new Error('useForum must be used inside ForumProvider');
  return value;
}
