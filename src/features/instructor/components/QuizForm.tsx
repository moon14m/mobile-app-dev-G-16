import { Pressable, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Quiz } from '@/models/types';
import { useQuizForm } from '../hooks/useQuizForm';

type Props = { initial?: Quiz; onSave: (quiz: Quiz) => void; onCancel: () => void };

export function QuizForm({ initial, onSave, onCancel }: Props) {
  const quiz = useQuizForm(initial, onSave);
  const { form, errors } = quiz;

  return (
    <Card>
      <AppInput label="Quiz title" value={form.title} onChangeText={quiz.update('title')} error={errors.title} />
      <AppInput label="Due date (YYYY-MM-DD)" value={form.dueDate} onChangeText={quiz.update('dueDate')} error={errors.dueDate} placeholder="2026-11-20" />
      <AppInput label="Pass mark (%)" value={form.passMark} onChangeText={quiz.update('passMark')} error={errors.passMark} keyboardType="number-pad" />

      {quiz.questions.map((q, qi) => (
        <View key={q.id} className="gap-2 rounded-md border border-line p-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-ink">Question {qi + 1}</Text>
            <Pressable accessibilityRole="button" onPress={() => quiz.removeQuestion(qi)} hitSlop={8}>
              <Text className="text-xs text-bad">Remove</Text>
            </Pressable>
          </View>
          <AppInput label="Question" value={q.text} onChangeText={(text) => quiz.changeQuestion(qi, { text })} />
          {q.options.map((option, oi) => (
            <View key={oi} className="flex-row items-end gap-2">
              <View className="flex-1">
                <AppInput label={`Option ${oi + 1}`} value={option} onChangeText={(value) => quiz.changeOption(qi, oi, value)} />
              </View>
              <Chip label="Correct" selected={q.correctIndex === oi} onPress={() => quiz.changeQuestion(qi, { correctIndex: oi })} />
            </View>
          ))}
          {!!quiz.questionErrors[qi] && <Text className="text-xs text-bad">{quiz.questionErrors[qi]}</Text>}
        </View>
      ))}

      <AppButton label="Add question" variant="outline" small onPress={quiz.addQuestion} />
      {!!quiz.formError && <Text className="text-sm text-bad">{quiz.formError}</Text>}
      <View className="flex-row gap-2">
        <View className="flex-1">
          <AppButton label="Cancel" variant="outline" onPress={onCancel} />
        </View>
        <View className="flex-1">
          <AppButton label="Save quiz" onPress={quiz.save} />
        </View>
      </View>
    </Card>
  );
}
