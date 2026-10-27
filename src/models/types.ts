export type Role = 'student' | 'instructor';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string; // mock only, Phase 2 will not keep plain passwords
  role: Role;
  department: string;
  studentId?: string;
};

export type Lecture = {
  id: string;
  title: string;
  description: string;
  videoTitle: string;
  durationMin: number;
  materials: string[];
};

export type Lab = {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  materials: string[];
};

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
};

export type Quiz = {
  id: string;
  title: string;
  dueDate: string;
  passMark: number; // percent
  questions: Question[];
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  date: string;
};

export type Course = {
  id: string;
  code: string;
  title: string;
  description: string;
  department: string;
  credits: number;
  instructorId: string;
  syllabus: string[]; // one line per week
  lectures: Lecture[];
  labs: Lab[];
  quizzes: Quiz[];
  announcements: Announcement[];
};

// The fields an instructor fills in when creating or editing a course.
export type CourseInfo = Pick<Course, 'code' | 'title' | 'description' | 'department' | 'credits'>;

export type Bookmark = {
  id: string;
  lectureId: string;
  seconds: number;
  note: string;
};

export type Enrollment = {
  userId: string;
  courseId: string;
  enrolledAt: string;
  doneIds: string[]; // lectures and labs marked as done
  quizScores: Record<string, number>; // quiz id -> best score in percent
  bookmarks: Bookmark[];
  positions: Record<string, number>; // lecture id -> seconds watched
};

export type ForumPost = {
  id: string;
  courseId: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  body: string;
  rating: number | null; // 1-5 for a student opinion, null for staff posts
  createdAt: string; // ISO date and time
};

export type CourseEvent = {
  id: string;
  courseId: string;
  courseCode: string;
  kind: 'Lab' | 'Quiz';
  title: string;
  date: string;
};
