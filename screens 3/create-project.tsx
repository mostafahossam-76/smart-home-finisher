import React, { useState } from 'react';
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
  saveProjects,
  Project,
} from '../projectStorage';

type Props = {
  onCreated?: (project: Project) => void;
  onCancel?: () => void;
};

export default function CreateProjectScreen({
  onCreated,
  onCancel,
}: Props) {
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [rooms, setRooms] = useState('');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);

  const createProject = async () => {
    const areaNumber = Number(area);
    const roomsNumber = Number(rooms);

    if (!name.trim() || !area.trim() || !rooms.trim()) {
      Alert.alert(
        'Missing information',
        'Enter the project name, apartment area, and number of rooms.'
      );
      return;
    }

    if (
      !Number.isFinite(areaNumber) ||
      areaNumber <= 0 ||
      !Number.isInteger(roomsNumber) ||
      roomsNumber <= 0
    ) {
      Alert.alert(
        'Invalid information',
        'Area must be positive and rooms must be a positive whole number.'
      );
      return;
    }

    setSaving(true);

    try {
      const current = await loadProjects();

      const project: Project = {
        id: `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        name: name.trim(),
        area: areaNumber,
        rooms: roomsNumber,
        location: location.trim(),
        budget: 0,
        spent: 0,
        createdAt: new Date().toISOString(),
      };

      await saveProjects([project, ...current]);

      setName('');
      setArea('');
      setRooms('');
      setLocation('');

      onCreated?.(project);
    } catch {
      Alert.alert(
        'Save failed',
        'The project could not be saved. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.eyebrow}>SMART HOME FINISHER</Text>
      <Text style={styles.heading}>Create Project</Text>
      <Text style={styles.subtitle}>
        Set up the apartment you want to finish.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Project name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. My New Apartment"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Apartment area (m²) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 120"
          keyboardType="decimal-pad"
          value={area}
          onChangeText={setArea}
        />

        <Text style={styles.label}>Number of rooms *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 3"
          keyboardType="number-pad"
          value={rooms}
          onChangeText={setRooms}
        />

        <Text style={styles.label}>Location (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. New Cairo"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.helper}>
          You can manage finishing tasks and progress after
          creating the project.
        </Text>

        <TouchableOpacity
          style={[styles.button, saving && styles.disabled]}
          onPress={createProject}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? 'Saving...' : 'Create Project'}
          </Text>
        </TouchableOpacity>

        {onCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
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
    marginTop: 7,
    marginBottom: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E1E8DF',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#263C30',
    marginTop: 15,
    marginBottom: 7,
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
  helper: {
    color: '#78847A',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 16,
  },
  button: {
    backgroundColor: '#286747',
    padding: 15,
    borderRadius: 11,
    alignItems: 'center',
    marginTop: 22,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  cancelButton: {
    padding: 13,
    alignItems: 'center',
    marginTop: 5,
  },
  cancelText: {
    color: '#69756D',
    fontWeight: '700',
  },
});