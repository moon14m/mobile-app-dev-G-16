import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { SectionTitle } from '@/components/ui/Heading';
import { EmptyState, ErrorView, LoadingView, NoAccess } from '@/components/ui/States';
import { CourseInfoForm } from '../components/CourseInfoForm';
import { CoursePicker } from '../components/CoursePicker';
import { AnnouncementForm, LabForm, LectureForm } from '../components/ItemForms';
import { ManageItemRow } from '../components/ManageItemRow';
import { QuizForm } from '../components/QuizForm';
import { SyllabusEditor } from '../components/SyllabusEditor';
import { SECTIONS, useManageCourseViewModel } from '../hooks/useManageCourseViewModel';

type Row = { id: string; title: string; detail: string };

export default function ManageCourseScreen() {
  const params = useLocalSearchParams<{ courseId?: string }>();
  const vm = useManageCourseViewModel(params.courseId);

  if (!vm.isInstructor) return <NoAccess message="Only instructors can manage courses." onBack={() => router.back()} />;
  if (vm.loading) return <LoadingView />;
  if (vm.error) return <ErrorView message={vm.error} onRetry={vm.retry} />;

  const course = vm.course;

  if (vm.adding || !course) {
    return (
      <ScrollView contentContainerClassName="gap-4 p-4" keyboardShouldPersistTaps="handled">
        <SectionTitle>New course</SectionTitle>
        {!course && !vm.adding && <Text className="text-sm text-muted">You do not teach any course yet. Add your first one.</Text>}
        <CourseInfoForm submitLabel="Create course" onSubmit={vm.createCourse} onCancel={course ? vm.cancelAdding : undefined} />
      </ScrollView>
    );
  }

  // Add button, then the list of items with Edit and Delete.
  function itemList(addLabel: string, emptyMessage: string, rows: Row[], onDelete: (id: string) => void, canEdit = true) {
    return (
      <>
        <AppButton label={addLabel} small onPress={() => vm.startEditing('new')} />
        {rows.length === 0 ? (
          <EmptyState message={emptyMessage} />
        ) : (
          <Card className="py-0">
            {rows.map((row) => (
              <ManageItemRow
                key={row.id}
                title={row.title}
                detail={row.detail}
                onEdit={canEdit ? () => vm.startEditing(row.id) : undefined}
                onDelete={() => onDelete(row.id)}
              />
            ))}
          </Card>
        )}
      </>
    );
  }

  const editing = vm.editing;

  return (
    <ScrollView contentContainerClassName="gap-4 p-4" keyboardShouldPersistTaps="handled">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm text-muted">Your courses</Text>
        <AppButton label="Add course" small onPress={vm.startAdding} />
      </View>
      <CoursePicker courses={vm.myCourses} selectedId={course.id} onSelect={vm.selectCourse} />

      <View>
        <Text className="text-xl font-bold text-ink">{course.title}</Text>
        <Text className="text-sm text-muted">{vm.summary}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
        {SECTIONS.map((s) => (
          <Chip key={s.key} label={s.label} selected={vm.section === s.key} onPress={() => vm.setSection(s.key)} />
        ))}
      </ScrollView>

      {vm.section === 'info' && (
        <>
          <CourseInfoForm key={course.id} initial={course} submitLabel="Save course info" onSubmit={vm.saveInfo} />
          <SyllabusEditor key={`s-${course.id}`} course={course} onSave={vm.saveSyllabus} />
          <View className="gap-2 border-t border-line pt-4">
            {vm.confirmDelete && <Text className="text-sm text-bad">This removes the course and all its enrollments. Tap again to confirm.</Text>}
            <AppButton label={vm.confirmDelete ? 'Yes, delete this course' : 'Delete course'} variant="danger" onPress={vm.pressDelete} />
          </View>
        </>
      )}

      {vm.section === 'lectures' &&
        (editing ? (
          <LectureForm key={editing} initial={vm.editingLecture} onCancel={vm.closeEditor} onSave={vm.saveLecture} />
        ) : (
          itemList('Add lecture', 'No lectures yet.', vm.lectureRows, (id) => vm.removeItem('lectures', id))
        ))}

      {vm.section === 'labs' &&
        (editing ? (
          <LabForm key={editing} initial={vm.editingLab} onCancel={vm.closeEditor} onSave={vm.saveLab} />
        ) : (
          itemList('Add lab', 'No labs yet.', vm.labRows, (id) => vm.removeItem('labs', id))
        ))}

      {vm.section === 'quizzes' &&
        (editing ? (
          <QuizForm key={editing} initial={vm.editingQuiz} onCancel={vm.closeEditor} onSave={vm.saveQuiz} />
        ) : (
          itemList('Add quiz', 'No quizzes yet.', vm.quizRows, (id) => vm.removeItem('quizzes', id))
        ))}

      {vm.section === 'announcements' &&
        (editing ? (
          <AnnouncementForm onCancel={vm.closeEditor} onPublish={vm.publishAnnouncement} />
        ) : (
          itemList('New announcement', 'No announcements yet.', vm.announcementRows, (id) => vm.removeItem('announcements', id), false)
        ))}
    </ScrollView>
  );
}
