
import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

import DashboardScreen from './screens 3/DashboardScreen';
import CreateProjectScreen from './screens 3/create-project';
import FinishingTasksScreen from './screens 3/finishing-tasks';

import CostEstimator from './screens/CostEstimator';
import MaterialComparison from './screens/MaterialComparison';
import ProgressTracker from './screens/ProgressTracker';
import MaterialsScreens from './screens/MaterialsScreens';

type Screen =
  | 'Projects'
  | 'Create'
  | 'Tasks'
  | 'Cost'
  | 'Compare'
  | 'Progress'
  | 'Materials'
  | 'My Material List'
  | 'Saved Materials';

const NAV_ITEMS: { label: Screen; title: string }[] = [
  { label: 'Projects', title: 'Projects' },
  { label: 'Create', title: 'Create Project' },
  { label: 'Tasks', title: 'Finishing Tasks' },
  { label: 'Cost', title: 'Cost Estimator' },
  { label: 'Compare', title: 'Material Comparison' },
  { label: 'Progress', title: 'Progress Tracker' },
  { label: 'Materials', title: 'Material Catalog' },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>('Projects');

  const renderScreen = () => {
    switch (screen) {
      case 'Projects':
        return (
          <DashboardScreen
            onCreateProject={() => setScreen('Create')}
            onOpenTasks={() => setScreen('Tasks')}
          />
        );

      case 'Create':
        return <CreateProjectScreen />;

      case 'Tasks':
        return <FinishingTasksScreen />;

      case 'Cost':
        return <CostEstimator />;

      case 'Compare':
        return <MaterialComparison />;

      case 'Progress':
        return <ProgressTracker />;

      case 'Materials':
      case 'My Material List':
      case 'Saved Materials':
        return <MaterialsScreens />;

      default:
        return (
          <DashboardScreen
            onCreateProject={() => setScreen('Create')}
            onOpenTasks={() => setScreen('Tasks')}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.brand}>HOME FINISHER</Text>
        <Text style={styles.headerTitle}>Smart Home Finishing</Text>
        <Text style={styles.headerSubtitle}>
          Plan your dream home, one step at a time.
        </Text>
      </View>

      <View style={styles.navigation}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navigationContent}
        >
          {NAV_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.navButton,
                screen === item.label && styles.activeNavButton,
              ]}
              onPress={() => setScreen(item.label)}
            >
              <Text
                style={[
                  styles.navText,
                  screen === item.label && styles.activeNavText,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>{renderScreen()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6F0',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
  },
  brand: {
    color: '#28674D',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 8,
  },
  headerTitle: {
    color: '#233B30',
    fontSize: 27,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#7C837D',
    fontSize: 14,
    marginTop: 5,
  },
  navigation: {
    marginBottom: 12,
  },
  navigationContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  navButton: {
    backgroundColor: '#E6EAE3',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
  activeNavButton: {
    backgroundColor: '#28674D',
  },
  navText: {
    color: '#526157',
    fontSize: 13,
    fontWeight: '600',
  },
  activeNavText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
});