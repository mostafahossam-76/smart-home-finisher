
import React, { useCallback, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  loadProjects,
  loadTasks,
  saveProjects,
  saveTasks,
  Project,
  FinishingTask,
} from '../projectStorage';

type Props = {
  onCreateProject: () => void;
  onOpenTasks: (projectId: string) => void;
};

export default function DashboardScreen({
  onCreateProject,
  onOpenTasks,
}: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasksByProject, setTasksByProject] =
    useState<Record<string, FinishingTask[]>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [savedProjects, savedTasks] = await Promise.all([
        loadProjects(),
        loadTasks(),
      ]);

      setProjects(savedProjects);
      setTasksByProject(savedTasks);
    } catch {
      if (Platform.OS === 'web') {
        window.alert('Unable to load projects and progress.');
      } else {
        Alert.alert(
          'Could not load',
          'Unable to load projects and progress.'
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const removeProject = (project: Project) => {
    const deleteConfirmed = async () => {
      try {
        const updatedProjects = projects.filter(
          item => item.id !== project.id
        );

        const updatedTasks = { ...tasksByProject };
        delete updatedTasks[project.id];

        await Promise.all([
          saveProjects(updatedProjects),
          saveTasks(updatedTasks),
        ]);

        setProjects(updatedProjects);
        setTasksByProject(updatedTasks);
      } catch {
        if (Platform.OS === 'web') {
          window.alert(
            'The project could not be deleted. Please try again.'
          );
        } else {
          Alert.alert(
            'Delete failed',
            'The project could not be deleted.'
          );
        }
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        `Delete "${project.name}" and its finishing tasks?`
      );

      if (confirmed) {
        void deleteConfirmed();
      }

      return;
    }

    Alert.alert(
      'Delete project?',
      `Delete "${project.name}" and its finishing tasks?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void deleteConfirmed();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#286747" />
        <Text style={styles.muted}>Loading projects...</Text>
      </View>
    );
  }

  const completedTotal = projects.reduce(
    (sum, project) =>
      sum +
      (tasksByProject[project.id] || []).filter(
        task => task.completed
      ).length,
    0
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.eyebrow}>SMART HOME FINISHER</Text>
      <Text style={styles.heading}>My Projects</Text>
      <Text style={styles.subtitle}>
        Your apartments and their finishing progress in one place.
      </Text>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{projects.length}</Text>
          <Text style={styles.summaryLabel}>Projects</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{completedTotal}</Text>
          <Text style={styles.summaryLabel}>Tasks completed</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={onCreateProject}
      >
        <Text style={styles.primaryButtonText}>
          + Create New Project
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Your apartments</Text>

      {projects.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No projects yet</Text>
          <Text style={styles.muted}>
            Create your first project to start organizing its
            finishing tasks.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onCreateProject}
          >
            <Text style={styles.primaryButtonText}>
              Create Project
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        projects.map(project => {
          const tasks = tasksByProject[project.id] || [];
          const completed = tasks.filter(
            task => task.completed
          ).length;

          const progress = tasks.length
            ? Math.round((completed / tasks.length) * 100)
            : 0;

          return (
            <View key={project.id} style={styles.projectCard}>
              <View style={styles.projectTop}>
                <View style={styles.homeIcon}>
                  <Text style={styles.homeIconText}>⌂</Text>
                </View>

                <View style={styles.projectInfo}>
                  <Text style={styles.projectName}>
                    {project.name}
                  </Text>

                  <Text style={styles.muted}>
                    {project.area} m² · {project.rooms} rooms
                    {project.location ? ` · ${project.location}` : ''}
                  </Text>
                </View>
              </View>

              <View style={styles.progressHeading}>
                <Text style={styles.progressLabel}>
                  Finishing progress
                </Text>
                <Text style={styles.progressPercent}>
                  {progress}%
                </Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress}%` },
                  ]}
                />
              </View>

              <Text style={styles.muted}>
                {completed} of {tasks.length} tasks completed
              </Text>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => onOpenTasks(project.id)}
              >
                <Text style={styles.secondaryButtonText}>
                  Manage Finishing Tasks →
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeProject(project)}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${project.name}`}
              >
                <Text style={styles.deleteText}>
                  Delete project
                </Text>
              </TouchableOpacity>
            </View>
          );
        })
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7F2',
    gap: 10,
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
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#E8F0E7',
    borderRadius: 14,
    padding: 16,
  },
  summaryNumber: {
    color: '#286747',
    fontSize: 25,
    fontWeight: '800',
  },
  summaryLabel: {
    color: '#647267',
    fontSize: 12,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: '#286747',
    padding: 15,
    borderRadius: 11,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
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
  emptyTitle: {
    color: '#233A2D',
    fontSize: 17,
    fontWeight: '800',
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1E8DF',
    marginBottom: 14,
  },
  projectTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E8F0E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  homeIconText: {
    color: '#286747',
    fontSize: 28,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    color: '#233A2D',
    fontSize: 16,
    fontWeight: '800',
  },
  progressHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  progressLabel: {
    color: '#526256',
    fontSize: 12,
    fontWeight: '700',
  },
  progressPercent: {
    color: '#286747',
    fontSize: 14,
    fontWeight: '800',
  },
  progressTrack: {
    height: 9,
    backgroundColor: '#DCE5DA',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 9,
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
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#286747',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  secondaryButtonText: {
    color: '#286747',
    fontSize: 12,
    fontWeight: '800',
  },
  deleteButton: {
    alignSelf: 'center',
    padding: 9,
    marginTop: 4,
  },
  deleteText: {
    color: '#B24747',
    fontSize: 11,
    fontWeight: '700',
  },
});
