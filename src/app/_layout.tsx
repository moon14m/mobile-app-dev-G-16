import '../../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/store/AuthContext';
import { CoursesProvider } from '@/store/CoursesContext';
import { EnrollmentsProvider } from '@/store/EnrollmentsContext';
import { ForumProvider } from '@/store/ForumContext';
import { colors } from '@/theme/tokens';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CoursesProvider>
        <EnrollmentsProvider>
          <ForumProvider>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: colors.card },
                headerTintColor: colors.ink,
                headerTitleStyle: { fontWeight: '600' },
                contentStyle: { backgroundColor: colors.page },
              }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="sign-in" options={{ headerShown: false }} />
              <Stack.Screen name="register" options={{ title: 'Create account' }} />
              <Stack.Screen name="course/[courseId]/index" options={{ title: 'Course' }} />
              <Stack.Screen name="course/[courseId]/lesson/[itemId]" options={{ title: 'Lesson' }} />
              <Stack.Screen name="course/[courseId]/quiz/[quizId]" options={{ title: 'Quiz' }} />
              <Stack.Screen name="course/[courseId]/forum" options={{ title: 'Forum' }} />
            </Stack>
          </ForumProvider>
        </EnrollmentsProvider>
      </CoursesProvider>
    </AuthProvider>
  );
}
