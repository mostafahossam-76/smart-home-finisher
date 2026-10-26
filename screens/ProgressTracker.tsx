
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
} from "react-native";

const initialTasks = [
  { id: 1, title: "Choose floor tiles", room: "Living Room", done: true },
  { id: 2, title: "Paint the walls", room: "Living Room", done: true },
  { id: 3, title: "Install lighting", room: "Living Room", done: false },
  { id: 4, title: "Choose kitchen cabinets", room: "Kitchen", done: true },
  { id: 5, title: "Install kitchen flooring", room: "Kitchen", done: false },
  { id: 6, title: "Choose bathroom tiles", room: "Bathroom", done: false },
];

export default function ProgressTracker() {
  const [tasks, setTasks] = useState(initialTasks);

  const completed = tasks.filter((task) => task.done).length;
  const overall = Math.round((completed / tasks.length) * 100);

  const getRoomProgress = (room: string) => {
    const roomTasks = tasks.filter((task) => task.room === room);
    const roomCompleted = roomTasks.filter((task) => task.done).length;

    return {
      total: roomTasks.length,
      completed: roomCompleted,
      percent: Math.round((roomCompleted / roomTasks.length) * 100),
    };
  };

  const rooms = ["Living Room", "Kitchen", "Bathroom"];

  const toggleTask = (id: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>YOUR HOME PROJECT</Text>
      <Text style={styles.heading}>Progress Tracker</Text>
      <Text style={styles.subtitle}>
        Every small step brings your home closer to finished.
      </Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>OVERALL COMPLETION</Text>
        <View style={styles.percentRow}>
          <Text style={styles.percent}>{overall}%</Text>
          <Text style={styles.heroEmoji}>⌂</Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${overall}%` }]}
          />
        </View>

        <Text style={styles.heroFooter}>
          {completed} of {tasks.length} tasks completed
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Room Progress</Text>
        <Text style={styles.sectionHint}>By area</Text>
      </View>

      {rooms.map((room) => {
        const progress = getRoomProgress(room);

        return (
          <View key={room} style={styles.roomCard}>
            <View style={styles.roomTop}>
              <View style={styles.roomIcon}>
                <Text style={styles.roomIconText}>
                  {room === "Living Room"
                    ? "L"
                    : room === "Kitchen"
                    ? "K"
                    : "B"}
                </Text>
              </View>

              <View style={styles.roomInfo}>
                <Text style={styles.roomName}>{room}</Text>
                <Text style={styles.roomDetail}>
                  {progress.completed} of {progress.total} tasks
                </Text>
              </View>

              <Text style={styles.roomPercent}>{progress.percent}%</Text>
            </View>

            <View style={styles.roomTrack}>
              <View
                style={[
                  styles.roomFill,
                  { width: `${progress.percent}%` },
                ]}
              />
            </View>
          </View>
        );
      })}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Finishing Checklist</Text>
        <Text style={styles.sectionHint}>Tap to update</Text>
      </View>

      {tasks.map((task) => (
        <Pressable
          key={task.id}
          onPress={() => toggleTask(task.id)}
          style={styles.taskCard}
        >
          <View
            style={[
              styles.checkbox,
              task.done && styles.checkboxDone,
            ]}
          >
            <Text style={styles.checkmark}>
              {task.done ? "✓" : ""}
            </Text>
          </View>

          <View style={styles.taskInfo}>
            <Text
              style={[
                styles.taskTitle,
                task.done && styles.taskTitleDone,
              ]}
            >
              {task.title}
            </Text>
            <Text style={styles.taskRoom}>{task.room}</Text>
          </View>

          <Text style={styles.taskArrow}>
            {task.done ? "✓" : "›"}
          </Text>
        </Pressable>
      ))}

      <Text style={styles.note}>
        Demo project data · Your changes update the progress on this screen.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7F2",
  },
  content: {
    padding: 22,
    paddingTop: 52,
    paddingBottom: 35,
  },
  eyebrow: {
    color: "#6B806D",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 8,
  },
  heading: {
    color: "#203B2A",
    fontSize: 29,
    fontWeight: "800",
  },
  subtitle: {
    color: "#737B73",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 23,
  },
  heroCard: {
    backgroundColor: "#203B2A",
    padding: 23,
    borderRadius: 23,
    marginBottom: 27,
  },
  heroLabel: {
    color: "#C5D5C4",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  percentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 9,
    marginBottom: 15,
  },
  percent: {
    color: "#FFFFFF",
    fontSize: 49,
    fontWeight: "800",
  },
  heroEmoji: {
    color: "#D5E5CF",
    fontSize: 42,
  },
  progressTrack: {
    height: 9,
    borderRadius: 8,
    backgroundColor: "#506451",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#C6DDBB",
    borderRadius: 8,
  },
  heroFooter: {
    color: "#D5E1D2",
    fontSize: 13,
    marginTop: 13,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
    marginTop: 2,
  },
  sectionTitle: {
    color: "#203B2A",
    fontSize: 19,
    fontWeight: "800",
  },
  sectionHint: {
    color: "#7A8279",
    fontSize: 11,
  },
  roomCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E9ECE5",
  },
  roomTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  roomIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#EAF1E7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  roomIconText: {
    color: "#203B2A",
    fontSize: 17,
    fontWeight: "800",
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    color: "#203B2A",
    fontSize: 14,
    fontWeight: "700",
  },
  roomDetail: {
    color: "#858B83",
    fontSize: 12,
    marginTop: 4,
  },
  roomPercent: {
    color: "#203B2A",
    fontSize: 16,
    fontWeight: "800",
  },
  roomTrack: {
    height: 6,
    backgroundColor: "#E9ECE5",
    borderRadius: 6,
    overflow: "hidden",
  },
  roomFill: {
    height: "100%",
    backgroundColor: "#6F936F",
    borderRadius: 6,
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9ECE5",
  },
  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#B9C4B5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxDone: {
    backgroundColor: "#203B2A",
    borderColor: "#203B2A",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    color: "#26352A",
    fontSize: 13,
    fontWeight: "700",
  },
  taskTitleDone: {
    color: "#8A9188",
    textDecorationLine: "line-through",
  },
  taskRoom: {
    color: "#858B83",
    fontSize: 11,
    marginTop: 5,
  },
  taskArrow: {
    color: "#6B806D",
    fontSize: 19,
    marginLeft: 8,
  },
  note: {
    color: "#8A9188",
    fontSize: 11,
    textAlign: "center",
    marginTop: 14,
  },
});
