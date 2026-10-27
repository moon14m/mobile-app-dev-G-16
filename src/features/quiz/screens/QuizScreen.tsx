import { Redirect, router, Stack, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Pressable, ScrollView, type ScrollViewInstance, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { ErrorView, LoadingView, NoAccess } from '@/components/ui/States';
import { plural } from '@/utils/format';
import { OptionState, useQuizViewModel } from '../hooks/useQuizViewModel';

const OPTION_STYLE: Record<OptionState, string> = {
  idle: 'border-line bg-white',
  picked: 'border-brand bg-brand-soft',
  correct: 'border-good bg-green-50',
  wrong: 'border-bad bg-red-50',
};

export default function QuizScreen() {
  const { courseId, quizId } = useLocalSearchParams<{ courseId: string; quizId: string }>();
  const vm = useQuizViewModel(courseId, quizId);
  const scrollRef = useRef<ScrollViewInstance>(null);

  if (!vm.signedIn) return <Redirect href="/sign-in" />;
  if (vm.loading) return <LoadingView />;
  if (vm.error) return <ErrorView message={vm.error} onRetry={vm.retry} />;

  const { course, quiz } = vm;
  if (!course || !quiz || !vm.allowed) {
    return <NoAccess message="Quizzes can only be taken by students enrolled in the course." onBack={() => router.back()} />;
  }

  function handleSubmit() {
    if (vm.submit()) scrollRef.current?.scrollTo({ y: 0, animated: true });
  }

  return (
    <ScrollView ref={scrollRef} contentContainerClassName="gap-4 p-4">
      <Stack.Screen options={{ title: quiz.title }} />

      <View className="gap-1">
        <Text className="text-xs font-semibold text-brand">{course.code}</Text>
        <Text className="text-2xl font-bold text-ink">{quiz.title}</Text>
        <Text className="text-sm text-muted">
          {plural(quiz.questions.length, 'question')} · pass mark {quiz.passMark}%{vm.best !== undefined ? ` · best so far ${vm.best}%` : ''}
        </Text>
      </View>

      {vm.submitted && (
        <Card className={vm.passed ? 'border-good' : 'border-bad'}>
          <Text className="text-sm text-muted">Your score</Text>
          <Text className={`text-3xl font-bold ${vm.passed ? 'text-good' : 'text-bad'}`}>{vm.score}%</Text>
          <Text className="text-sm text-ink">
            {vm.passed ? 'Passed. Your course progress has been updated.' : `Not passed. You need ${quiz.passMark}% to pass.`}
          </Text>
          <View className="flex-row gap-2">
            <View className="flex-1">
              <AppButton label="Retake quiz" variant="outline" onPress={vm.retake} />
            </View>
            <View className="flex-1">
              <AppButton label="Back to course" onPress={() => router.back()} />
            </View>
          </View>
        </Card>
      )}

      {quiz.questions.map((question, qi) => (
        <Card key={question.id}>
          <Text className="text-xs text-muted">Question {qi + 1}</Text>
          <Text className="font-semibold text-ink">{question.text}</Text>
          <View className="gap-2">
            {question.options.map((option, oi) => (
              <Pressable
                key={option}
                accessibilityRole="radio"
                accessibilityState={{ checked: vm.answers[qi] === oi }}
                onPress={() => vm.choose(qi, oi)}
                className={`rounded-md border px-3 py-2.5 ${OPTION_STYLE[vm.optionState(qi, oi)]}`}>
                <Text className="text-sm text-ink">{option}</Text>
              </Pressable>
            ))}
          </View>
        </Card>
      ))}

      {!vm.submitted && (
        <View className="gap-2">
          {!!vm.warning && <Text className="text-sm text-bad">{vm.warning}</Text>}
          <AppButton label="Submit answers" onPress={handleSubmit} />
        </View>
      )}
    </ScrollView>
  );
}
