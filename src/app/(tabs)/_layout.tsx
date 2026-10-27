import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '@/store/AuthContext';
import { colors } from '@/theme/tokens';

// Each role sees its own tabs; href: null hides a tab.
export default function TabsLayout() {
  const { user, isInstructor } = useAuth();
  if (!user) return <Redirect href="/sign-in" />;

  const studentTab = isInstructor ? null : undefined;
  const instructorTab = isInstructor ? undefined : null;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
        tabBarIconStyle: { display: 'none' },
        tabBarLabelStyle: { fontSize: 13, fontWeight: '600' },
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.line },
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.ink,
        sceneStyle: { backgroundColor: colors.page },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Dashboard', href: studentTab }} />
      <Tabs.Screen name="catalog" options={{ title: 'Catalog' }} />
      <Tabs.Screen name="manage" options={{ title: 'Manage', href: instructorTab }} />
      <Tabs.Screen name="students" options={{ title: 'Students', href: instructorTab }} />
      <Tabs.Screen name="announcements" options={{ title: 'News' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
