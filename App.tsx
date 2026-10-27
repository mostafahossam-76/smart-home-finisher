
import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
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
  | 'Materials'
  | 'Cost'
  | 'Compare'
  | 'Progress';

export default function App() {
  const [screen, setScreen] = useState<Screen>('Projects');
  const [taskProjectId, setTaskProjectId] = useState<string | undefined>(
    undefined
  );
  const [menuVisible, setMenuVisible] = useState(false);

  const openTasks = (projectId: string) => {
    setTaskProjectId(projectId);
    setScreen('Tasks');
  };

  const navigationItems: {
    value: Screen;
    label: string;
    icon: string;
  }[] = [
    { value: 'Projects', label: 'My Projects', icon: '🏠' },
    { value: 'Create', label: 'Create Project', icon: '➕' },
    { value: 'Tasks', label: 'Finishing Tasks', icon: '📋' },
    { value: 'Materials', label: 'Materials', icon: '🧱' },
    { value: 'Cost', label: 'Cost Estimator', icon: '💰' },
    { value: 'Compare', label: 'Material Comparison', icon: '⚖️' },
    { value: 'Progress', label: 'Progress Tracker', icon: '📊' },
  ];

  const selectScreen = (value: Screen) => {
    setScreen(value);
    setMenuVisible(false);
  };

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Open navigation menu"
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.appTitle}>Smart Home Finisher</Text>

        <View style={styles.topBarSpacer} />
      </View>

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

        {screen === 'Materials' && <MaterialsScreens />}

        {screen === 'Cost' && <CostEstimator />}

        {screen === 'Compare' && <MaterialComparison />}

        {screen === 'Progress' && <ProgressTracker />}
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.overlay}
            onPress={() => setMenuVisible(false)}
          />

          <View style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <View>
                <Text style={styles.drawerTitle}>Menu</Text>
                <Text style={styles.drawerSubtitle}>
                  Choose a feature
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setMenuVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Close menu"
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {navigationItems.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.menuItem,
                    screen === item.value && styles.menuItemActive,
                  ]}
                  onPress={() => selectScreen(item.value)}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: screen === item.value,
                  }}
                >
                  <Text style={styles.menuItemIcon}>{item.icon}</Text>

                  <Text
                    style={[
                      styles.menuItemText,
                      screen === item.value && styles.menuItemTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>

                  {screen === item.value && (
                    <Text style={styles.selectedMark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.drawerFooter}>
              Smart Home Finisher
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#F5F7F2',
  },

  topBar: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DCE4DC',
  },

  menuButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#E8F1E9',
  },

  menuIcon: {
    fontSize: 25,
    fontWeight: '700',
    color: '#286747',
  },

  appTitle: {
    flex: 1,
    marginLeft: 12,
    fontSize: 17,
    fontWeight: '700',
    color: '#244B35',
  },

  topBarSpacer: {
    width: 8,
  },

  content: {
    flex: 1,
  },

  modalContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },

  drawer: {
    width: 290,
    maxWidth: '85%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingHorizontal: 18,
    paddingBottom: 20,
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E5EAE4',
  },

  drawerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#244B35',
  },

  drawerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#78847A',
  },

  closeButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: '#F0F3EF',
  },

  closeButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#526356',
  },

  menuItem: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 7,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

  menuItemActive: {
    backgroundColor: '#E8F1E9',
  },

  menuItemIcon: {
    width: 34,
    fontSize: 21,
    textAlign: 'center',
    marginRight: 10,
  },

  menuItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#526356',
  },

  menuItemTextActive: {
    color: '#286747',
    fontWeight: '800',
  },

  selectedMark: {
    fontSize: 16,
    fontWeight: '800',
    color: '#286747',
  },

  drawerFooter: {
    marginTop: 14,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5EAE4',
    textAlign: 'center',
    fontSize: 12,
    color: '#89958A',
  },
});
