
import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import DashboardScreen from './screens 3/DashboardScreen';
import CreateProjectScreen from './screens 3/create-project';
import FinishingTasksScreen from './screens 3/finishing-tasks';

import CostEstimator from './screens/CostEstimator';
import MaterialComparison from './screens/MaterialComparison';
import ProgressTracker from './screens/ProgressTracker';

type Screen =
  | 'Projects'
  | 'Create'
  | 'Tasks'
  | 'Cost'
  | 'Compare'
  | 'Progress';

export default function App() {
  const [screen, setScreen] = useState<Screen>('Projects');
  const [taskProjectId, setTaskProjectId] = useState<string | undefined>(
    undefined
  );

  const openTasks = (projectId: string) => {
    setTaskProjectId(projectId);
    setScreen('Tasks');
  };

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        {screen === 'Projects' && (
          <DashboardScreen
            onCreateProject={() => setScreen('Create')}
            onOpenTasks={openTasks}
          />
        )}

        {screen === 'Create' && (
          <CreateProjectScreen
            onCreated={() => setScreen('Projects')}
            onCancel={() => setScreen('Projects')}
          />
        )}

        {screen === 'Tasks' && (
          <FinishingTasksScreen initialProjectId={taskProjectId} />
        )}

        {screen === 'Cost' && <CostEstimator />}

        {screen === 'Compare' && <MaterialComparison />}

        {screen === 'Progress' && <ProgressTracker />}
      </View>

      <View style={styles.nav}>
        {(
          [
            ['Projects', 'My Projects'],
            ['Create', 'Create Project'],
            ['Tasks', 'Finishing Tasks'],
            ['Cost', 'Cost Estimator'],
            ['Compare', 'Compare'],
            ['Progress', 'Progress'],
          ] as [Screen, string][]
        ).map(([value, label]) => (
          <TouchableOpacity
            key={value}
            style={styles.navItem}
            onPress={() => setScreen(value)}
          >
            <Text
              style={[
                styles.navText,
                screen === value && styles.navTextActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#F5F7F2',
  },
  content: {
    flex: 1,
  },
  nav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: '#DCE4DC',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  navItem: {
    flexGrow: 1,
    flexBasis: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#78847A',
    textAlign: 'center',
  },
  navTextActive: {
    color: '#286747',
  },
});
