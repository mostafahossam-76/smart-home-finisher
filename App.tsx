
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

import CostEstimator from "./screens/CostEstimator";
import MaterialComparison from "./screens/MaterialComparison";
import ProgressTracker from "./screens/ProgressTracker";

type Page = "cost" | "compare" | "progress";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("cost");

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {activePage === "cost" ? (
          <CostEstimator />
        ) : activePage === "compare" ? (
          <MaterialComparison />
        ) : (
          <ProgressTracker />
        )}
      </View>

      <View style={styles.tabBar}>
        <Pressable
          onPress={() => setActivePage("cost")}
          style={[
            styles.tab,
            activePage === "cost" && styles.activeTab,
          ]}
        >
          <Text
            style={[
              styles.tabIcon,
              activePage === "cost" && styles.activeText,
            ]}
          >
            EGP
          </Text>

          <Text
            style={[
              styles.tabLabel,
              activePage === "cost" && styles.activeText,
            ]}
          >
            Cost Estimator
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActivePage("compare")}
          style={[
            styles.tab,
            activePage === "compare" && styles.activeTab,
          ]}
        >
          <Text
            style={[
              styles.tabIcon,
              activePage === "compare" && styles.activeText,
            ]}
          >
            ⇄
          </Text>

          <Text
            style={[
              styles.tabLabel,
              activePage === "compare" && styles.activeText,
            ]}
          >
            Compare
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActivePage("progress")}
          style={[
            styles.tab,
            activePage === "progress" && styles.activeTab,
          ]}
        >
          <Text
            style={[
              styles.tabIcon,
              activePage === "progress" && styles.activeText,
            ]}
          >
            %
          </Text>

          <Text
            style={[
              styles.tabLabel,
              activePage === "progress" && styles.activeText,
            ]}
          >
            Progress
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7F2",
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
    paddingBottom: 22,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 14,
  },
  activeTab: {
    backgroundColor: "#EAF1E7",
  },
  tabIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#737B73",
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#737B73",
    textAlign: "center",
  },
  activeText: {
    color: "#203B2A",
  },
});
