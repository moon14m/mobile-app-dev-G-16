import { Redirect, router, Stack, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { Card } from '@/components/ui/Card';
import { EmptyState, ErrorView, LoadingView, NoAccess } from '@/components/ui/States';
import { formatDateTime, plural } from '@/utils/format';
import { StarRating } from '../components/StarRating';
import { useForumViewModel } from '../hooks/useForumViewModel';

export default function ForumScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const vm = useForumViewModel(courseId);

  if (!vm.signedIn) return <Redirect href="/sign-in" />;
  if (vm.loading) return <LoadingView label="Loading the forum…" />;
  if (vm.error) return <ErrorView message={vm.error} onRetry={vm.retry} />;

  const course = vm.course;
  if (!course || !vm.allowed) {
    return <NoAccess message="The forum is open to students enrolled in this course and to its instructor." onBack={() => router.back()} />;
  }

  const form = (
    <Card>
      <Text className="font-semibold text-ink">{vm.isInstructor ? 'Post a reply to the class' : 'Your opinion of this course'}</Text>
      {!vm.isInstructor && (
        <View className="flex-row items-center gap-3">
          <Text className="text-xs text-muted">Rating</Text>
          <StarRating value={vm.rating} onChange={vm.setRating} />
        </View>
      )}
      <AppInput
        label="Message"
        value={vm.text}
        onChangeText={vm.setText}
        error={vm.formError}
        placeholder={vm.isInstructor ? 'Write to your students' : 'What did you think of the lectures, labs and quizzes?'}
        multiline
        maxLength={500}
      />
      <AppButton label="Post" onPress={vm.send} />
    </Card>
  );

  return (
    <FlatList
      data={vm.posts}
      keyExtractor={(p) => p.id}
      contentContainerClassName="gap-3 p-4"
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View className="gap-3 pb-1">
          <Stack.Screen options={{ title: `${course.code} forum` }} />
          <View className="gap-1">
            <Text className="text-2xl font-bold text-ink">{course.title}</Text>
            <Text className="text-sm text-muted">
              {plural(vm.posts.length, 'post')} · average rating {vm.average ?? '–'}
            </Text>
          </View>
          {form}
        </View>
      }
      ListEmptyComponent={<EmptyState message="No opinions yet. Be the first to share yours." />}
      renderItem={({ item }) => (
        <Card>
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="font-semibold text-ink">{item.authorName}</Text>
            {item.authorRole === 'instructor' && <Text className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">INSTRUCTOR</Text>}
            <Text className="text-xs text-muted">{formatDateTime(item.createdAt)}</Text>
          </View>
          {item.rating !== null && <StarRating value={item.rating} />}
          <Text className="text-sm leading-5 text-ink">{item.body}</Text>
          {item.canDelete && (
            <Pressable accessibilityRole="button" onPress={() => vm.deletePost(item.id)} className="self-start" hitSlop={8}>
              <Text className="text-xs text-bad">Delete</Text>
            </Pressable>
          )}
        </Card>
      )}
    />
  );
}
