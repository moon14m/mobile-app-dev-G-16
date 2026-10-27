import { ScrollView, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { Chip } from '@/components/ui/Chip';
import { CourseInfo } from '@/models/types';
import { DEPARTMENTS, useCourseInfoForm } from '../hooks/useCourseForms';

type Props = { initial?: CourseInfo; submitLabel: string; onSubmit: (info: CourseInfo) => void; onCancel?: () => void };

export function CourseInfoForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const { form, errors, saved, update, submit } = useCourseInfoForm(initial, onSubmit);

  return (
    <View className="gap-3">
      <AppInput label="Module code" value={form.code} onChangeText={update('code')} error={errors.code} autoCapitalize="characters" placeholder="ICS310" />
      <AppInput label="Title" value={form.title} onChangeText={update('title')} error={errors.title} />
      <AppInput label="Description" value={form.description} onChangeText={update('description')} error={errors.description} multiline />
      <View className="gap-2">
        <Text className="text-xs font-semibold text-muted">Department</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
          {DEPARTMENTS.map((d) => (
            <Chip key={d} label={d} selected={form.department === d} onPress={() => update('department')(d)} />
          ))}
        </ScrollView>
      </View>
      <AppInput label="Credits" value={form.credits} onChangeText={update('credits')} error={errors.credits} keyboardType="number-pad" />
      {saved && <Text className="text-sm text-good">Saved.</Text>}
      <AppButton label={submitLabel} onPress={submit} />
      {onCancel && <AppButton label="Cancel" variant="outline" onPress={onCancel} />}
    </View>
  );
}
