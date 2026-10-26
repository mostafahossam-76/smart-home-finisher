
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  loadProjects,
  loadTasks,
  saveTasks,
  Project,
  FinishingTask,
} from './projectStorage';

type Props = {
  initialProjectId?: string;
};

const DEFAULT_TASKS = [
  'Measure rooms',
  'Choose floor tiles',
  'Paint walls',
  'Install lighting',
  'Install flooring',
  'Final inspection',
];

function formatDeadline(value: string): string {
  if (!/^\d{8}$/.test(value)) return value;

  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function isValidDate(value: string): boolean {
  if (!/^\d{8}$/.test(value)) return false;

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export default function FinishingTasksScreen({
  initialProjectId,
}: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasksByProject, setTasksByProject] =
    useState<Record<string, FinishingTask[]>>({});
  const [selectedProjectId, setSelectedProjectId] =
    useState(initialProjectId || '');
  const [taskTitle, setTaskTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [savedProjects, savedTasks] = await Promise.all([
        loadProjects(),
        loadTasks(),
      ]);

      setProjects(savedProjects);
      setTasksByProject(savedTasks);

      setSelectedProjectId(current => {
        const requested = initialProjectId || current;
        return savedProjects.some(p => p.id === requested)
          ? requested
          : savedProjects[0]?.id || '';
      });
    } catch {
      Alert.alert('Error', 'Could not load projects and tasks.');
    } finally {
      setLoading(false);
    }
  }, [initialProjectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const tasks = selectedProjectId
    ? tasksByProject[selectedProjectId] || []
    : [];

  const completedCount = tasks.filter(t => t.completed).length;

  const persist = async (
    updated: Record<string, FinishingTask[]>
  ) => {
    await saveTasks(updated);
    setTasksByProject(updated);
  };

  const addTask = async () => {
    if (!selectedProjectId) {
      Alert.alert('No project', 'Please create a project first.');
      return;
    }

    if (!taskTitle.trim()) {
      Alert.alert('Missing task name', 'Enter a task name.');
      return;
    }

    if (deadline && deadline.length !== 8) {
      Alert.alert(
        'Incomplete date',
        'Enter 8 digits in YYYYMMDD format, e.g. 20261215.'
      );
      return;
    }

    if (deadline && !isValidDate(deadline)) {
      Alert.alert(
        'Invalid date',
        'Enter a valid date, e.g. 20261215.'
      );
      return;
    }

    const task: FinishingTask = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      projectId: selectedProjectId,
      title: taskTitle.trim(),
      deadline: deadline ? formatDeadline(deadline) : '',
      completed: false,
    };

    try {
      await persist({
        ...tasksByProject,
        [selectedProjectId]: [task, ...tasks],
      });

      setTaskTitle('');
      setDeadline('');
    } catch {
      Alert.alert('Error', 'Could not save the task.');
    }
  };

  const toggleTask = async (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    );

    try {
      await persist({
        ...tasksByProject,
        [selectedProjectId]: updatedTasks,
      });
    } catch {
      Alert.alert('Error', 'Could not update the task.');
    }
  };

  const deleteTask = (taskId: string) => {
    Alert.alert('Delete task', 'Are you sure you want to delete it?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await persist({
              ...tasksByProject,
              [selectedProjectId]: tasks.filter(
                task => task.id !== taskId
              ),
            });
          } catch {
            Alert.alert('Error', 'Could not delete the task.');
          }
        },
      },
    ]);
  };

  const addSuggestedTasks = async () => {
    if (!selectedProjectId) {
      Alert.alert('No project', 'Please create a project first.');
      return;
    }

    const existing = new Set(
      tasks.map(task => task.title.toLowerCase())
    );

    const suggestions: FinishingTask[] = DEFAULT_TASKS
      .filter(title => !existing.has(title.toLowerCase()))
      .map(title => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${title.length}`,
        projectId: selectedProjectId,
        title,
        deadline: '',
        completed: false,
      }));

    if (suggestions.length === 0) {
      Alert.alert('Already added', 'All suggested tasks are present.');
      return;
    }

    try {
      await persist({
        ...tasksByProject,
        [selectedProjectId]: [...tasks, ...suggestions],
      });
    } catch {
      Alert.alert('Error', 'Could not add suggested tasks.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.eyebrow}>SMART HOME FINISHER</Text>
      <Text style={styles.heading}>Finishing Tasks</Text>
      <Text style={styles.subtitle}>
        Organize your finishing work and track your progress.
      </Text>

      {projects.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>No projects yet</Text>
          <Text style={styles.muted}>
            Create a project before adding finishing tasks.
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.label}>Choose project</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {projects.map(project => (
              <TouchableOpacity
                key={project.id}
                style={[
                  styles.projectChip,
                  selectedProjectId === project.id &&
                    styles.projectChipActive,
                ]}
                onPress={() => setSelectedProjectId(project.id)}
              >
                <Text
                  style={[
                    styles.projectChipText,
                    selectedProjectId === project.id &&
                      styles.projectChipTextActive,
                  ]}
                >
                  {project.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.progressCard}>
            <View style={styles.progressTop}>
              <Text style={styles.cardTitle}>Project progress</Text>
              <Text style={styles.progressPercent}>
                {tasks.length
                  ? Math.round((completedCount / tasks.length) * 100)
                  : 0}%
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      tasks.length
                        ? (completedCount / tasks.length) * 100
                        : 0
                    }%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.muted}>
              {completedCount} of {tasks.length} tasks completed
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Add a task</Text>

            <Text style={styles.label}>Task name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Paint the living room"
              value={taskTitle}
              onChangeText={setTaskTitle}
            />

            <Text style={styles.label}>Deadline (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYYMMDD (e.g. 20261215)"
              value={deadline}
              onChangeText={text =>
                setDeadline(text.replace(/[^0-9]/g, '').slice(0, 8))
              }
              keyboardType="number-pad"
              maxLength={8}
            />

            <Text style={styles.helper}>
              Numbers only: enter year, month, and day.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={addTask}
            >
              <Text style={styles.primaryButtonText}>+ Add Task</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={addSuggestedTasks}
            >
              <Text style={styles.secondaryButtonText}>
                Add Suggested Finishing Tasks
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>
            Task list ({tasks.length})
          </Text>

          {tasks.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.cardTitle}>No tasks yet</Text>
              <Text style={styles.muted}>
                Add your first task or use the suggested tasks button.
              </Text>
            </View>
          ) : (
            tasks.map(task => {
              const digits = task.deadline.replace(/-/g, '');
              const valid = isValidDate(digits);

              const overdue =
                valid &&
                !task.completed &&
                new Date(
                  Number(digits.slice(0, 4)),
                  Number(digits.slice(4, 6)) - 1,
                  Number(digits.slice(6, 8)),
                  23, 59, 59
                ) < new Date();

              return (
                <View
                  key={task.id}
                  style={[
                    styles.taskCard,
                    task.completed && styles.taskCompleted,
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.checkCircle,
                      task.completed && styles.checkCircleDone,
                    ]}
                    onPress={() => toggleTask(task.id)}
                  >
                    <Text style={styles.checkText}>
                      {task.completed ? '✓' : ''}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.taskInfo}>
                    <Text
                      style={[
                        styles.taskTitle,
                        task.completed && styles.taskTitleDone,
                      ]}
                    >
                      {task.title}
                    </Text>

                    <Text
                      style={[
                        styles.taskDeadline,
                        overdue && styles.overdue,
                      ]}
                    >
                      {task.deadline
                        ? `${overdue ? 'Overdue · ' : 'Deadline · '}${formatDeadline(digits)}`
                        : 'No deadline set'}
                    </Text>

                    <Text style={styles.statusText}>
                      {task.completed ? 'Completed' : 'Not completed'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteTask(task.id)}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7F2',
  },
  container: {
    padding: 20,
    paddingTop: 38,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7F2',
  },
  eyebrow: {
    color: '#286747',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
  heading: {
    color: '#233A2D',
    fontSize: 29,
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: {
    color: '#78847A',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
    marginBottom: 20,
  },
  label: {
    color: '#263C30',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 12,
  },
  projectChip: {
    backgroundColor: '#E7ECE5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  projectChipActive: {
    backgroundColor: '#286747',
  },
  projectChipText: {
    color: '#526256',
    fontWeight: '700',
    fontSize: 12,
  },
  projectChipTextActive: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 17,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1E8DF',
    marginTop: 18,
  },
  progressCard: {
    backgroundColor: '#E8F0E7',
    padding: 16,
    borderRadius: 15,
    marginTop: 18,
  },
  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: '#233A2D',
    fontSize: 17,
    fontWeight: '800',
  },
  progressPercent: {
    color: '#286747',
    fontSize: 21,
    fontWeight: '800',
  },
  progressTrack: {
    height: 9,
    backgroundColor: '#D2DFD1',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#286747',
    borderRadius: 8,
  },
  muted: {
    color: '#78847A',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 6,
  },
  helper: {
    color: '#78847A',
    fontSize: 11,
    marginTop: 7,
  },
  input: {
    backgroundColor: '#FAFBF9',
    borderWidth: 1,
    borderColor: '#DCE4DC',
    borderRadius: 11,
    padding: 13,
    fontSize: 15,
    color: '#263C30',
  },
  primaryButton: {
    backgroundColor: '#286747',
    padding: 14,
    borderRadius: 11,
    alignItems: 'center',
    marginTop: 17,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#286747',
    padding: 13,
    borderRadius: 11,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#286747',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionTitle: {
    color: '#233A2D',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 26,
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E1E8DF',
    marginBottom: 10,
  },
  taskCompleted: {
    backgroundColor: '#F0F6EF',
  },
  checkCircle: {
    width: 27,
    height: 27,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#9BA99D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  checkCircleDone: {
    backgroundColor: '#286747',
    borderColor: '#286747',
  },
  checkText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    color: '#263C30',
    fontSize: 14,
    fontWeight: '800',
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: '#7B897E',
  },
  taskDeadline: {
    color: '#78847A',
    fontSize: 11,
    marginTop: 4,
  },
  overdue: {
    color: '#B24747',
    fontWeight: '800',
  },
  statusText: {
    color: '#286747',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  deleteButton: {
    padding: 7,
    marginLeft: 5,
  },
  deleteText: {
    color: '#B24747',
    fontSize: 11,
    fontWeight: '700',
  },
});
