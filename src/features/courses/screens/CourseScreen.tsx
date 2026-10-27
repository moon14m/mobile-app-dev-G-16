import { Redirect, router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/Heading';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState, ErrorView, LoadingView, NoAccess } from '@/components/ui/States';
import { ItemRow } from '../components/ItemRow';
import { useCourseViewModel } from '../hooks/useCourseViewModel';

export default function CourseScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const vm = useCourseViewModel(courseId);

  if (!vm.signedIn) return <Redirect href="/sign-in" />;
  if (vm.loading) return <LoadingView />;
  if (vm.error) return <ErrorView message={vm.error} onRetry={vm.retry} />;

  const course = vm.course;
  if (!course || !vm.allowed) {
    return <NoAccess message="This course is only open to its enrolled students and its instructor." onBack={() => router.back()} />;
  }

  const openItem = (itemId: string) => router.push(`/course/${course.id}/lesson/${itemId}`);

  return (
    <ScrollView contentContainerClassName="gap-4 p-4">
      <Stack.Screen options={{ title: course.code }} />

      <View className="gap-1">
        <Text className="text-xs font-semibold text-brand">
          {course.code} · {course.department}
        </Text>
        <Text className="text-2xl font-bold text-ink">{course.title}</Text>
        <Text className="text-sm text-muted">{vm.instructorName}</Text>
      </View>

      {vm.isStudent ? (
        <Card>
          <View className="flex-row justify-between">
            <Text className="text-sm font-semibold text-ink">Your progress</Text>
            <Text className="text-sm font-bold text-ink">{vm.progress}%</Text>
          </View>
          <ProgressBar value={vm.progress} />
          <Text className="text-xs text-muted">Tick lectures and labs when you finish them. Passing a quiz also counts.</Text>
        </Card>
      ) : (
        vm.isOwner && (
          <Card className="bg-brand-soft">
            <Text className="text-sm text-ink">You are viewing your course as students see it.</Text>
            <AppButton label="Edit in Manage" small variant="outline" onPress={() => router.navigate({ pathname: '/manage', params: { courseId: course.id } })} />
          </Card>
        )
      )}

      <Text className="text-sm leading-5 text-ink">{course.description}</Text>

      <SectionTitle>Syllabus</SectionTitle>
      <Card>
        {course.syllabus.length === 0 ? (
          <Text className="text-sm text-muted">The syllabus has not been published yet.</Text>
        ) : (
          course.syllabus.map((line) => (
            <Text key={line} className="text-sm text-ink">
              {line}
            </Text>
          ))
        )}
      </Card>

      <SectionTitle>Lectures</SectionTitle>
      {vm.lectures.length === 0 ? (
        <EmptyState message="No lectures yet." />
      ) : (
        <Card className="py-0">
          {vm.lectures.map((item) => (
            <ItemRow
              key={item.id}
              title={item.title}
              detail={item.detail}
              done={item.done}
              canMark={vm.isStudent}
              onOpen={() => openItem(item.id)}
              onToggle={() => vm.toggleDone(item.id)}
            />
          ))}
        </Card>
      )}

      <SectionTitle>Labs</SectionTitle>
      {vm.labs.length === 0 ? (
        <EmptyState message="No labs yet." />
      ) : (
        <Card className="py-0">
          {vm.labs.map((item) => (
            <ItemRow
              key={item.id}
              title={item.title}
              detail={item.detail}
              done={item.done}
              canMark={vm.isStudent}
              onOpen={() => openItem(item.id)}
              onToggle={() => vm.toggleDone(item.id)}
            />
          ))}
        </Card>
      )}

      <SectionTitle>Quizzes</SectionTitle>
      {vm.quizzes.length === 0 ? (
        <EmptyState message="No quizzes yet." />
      ) : (
        vm.quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <Text className="font-semibold text-ink">{quiz.title}</Text>
            <Text className="text-xs text-muted">{quiz.detail}</Text>
            {vm.isStudent && (
              <View className="flex-row items-center justify-between">
                <Text className={`text-sm font-semibold ${!quiz.attempted ? 'text-muted' : quiz.passed ? 'text-good' : 'text-bad'}`}>{quiz.result}</Text>
                <AppButton label={quiz.attempted ? 'Retake' : 'Start quiz'} small onPress={() => router.push(`/course/${course.id}/quiz/${quiz.id}`)} />
              </View>
            )}
          </Card>
        ))
      )}

      <SectionTitle>Course forum</SectionTitle>
      <Card onPress={() => router.push(`/course/${course.id}/forum`)}>
        <Text className="font-semibold text-ink">Read and share opinions about this course</Text>
        <Text className="text-xs text-brand">Open the forum ›</Text>
      </Card>
    </ScrollView>
  );
}
