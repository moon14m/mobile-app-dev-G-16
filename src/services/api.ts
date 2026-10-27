import { COURSES, ENROLLMENTS, POSTS, USERS } from '@/data/mockData';
import { Course, Enrollment, ForumPost, User } from '@/models/types';
import { readData, writeData } from './storage';

// Data is kept on the device with AsyncStorage. The mock data is only the starting point.
// The short delay keeps the loading states visible, like a real request.
function slow<T>(promise: Promise<T>, ms = 400): Promise<T> {
  return new Promise((resolve, reject) => setTimeout(() => promise.then(resolve, reject), ms));
}

export const fetchUsers = () => slow(readData<User[]>('users', USERS), 200);
export const fetchCourses = () => slow(readData<Course[]>('courses', COURSES));
export const fetchEnrollments = () => slow(readData<Enrollment[]>('enrollments', ENROLLMENTS));
export const fetchPosts = () => slow(readData<ForumPost[]>('posts', POSTS));

export const saveUsers = (users: User[]) => writeData('users', users);
export const saveCourses = (courses: Course[]) => writeData('courses', courses);
export const saveEnrollments = (enrollments: Enrollment[]) => writeData('enrollments', enrollments);
export const savePosts = (posts: ForumPost[]) => writeData('posts', posts);
