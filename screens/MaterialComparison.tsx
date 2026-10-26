
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
} from "react-native";

const materials = [
  { name: "Ceramic Tiles", price: 350, durability: 7, maintenance: "Easy" },
  { name: "Porcelain Tiles", price: 550, durability: 9, maintenance: "Easy" },
  { name: "Marble", price: 1200, durability: 9, maintenance: "High" },
];

export default function MaterialComparison() {
  const [first, setFirst] = useState(0);
  const [second, setSecond] = useState(1);

  const a = materials[first];
  const b = materials[second];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.brand}>HOME FINISHER</Text>
      <Text style={styles.title}>Material Comparison</Text>
      <Text style={styles.subtitle}>
        Compare materials before making your choice.
      </Text>

      {[0, 1].map((slot) => {
        const selected = slot === 0 ? first : second;
        const setSelected = slot === 0 ? setFirst : setSecond;

        return (
          <View key={slot} style={styles.card}>
            <Text style={styles.sectionTitle}>
              {slot === 0 ? "First material" : "Second material"}
            </Text>

            {materials.map((item, index) => (
              <Pressable
                key={item.name}
                onPress={() => setSelected(index)}
                style={[
                  styles.option,
                  selected === index && styles.selectedOption,
                ]}
              >
                <Text style={styles.materialName}>{item.name}</Text>
                <Text style={styles.muted}>
                  EGP {item.price.toLocaleString("en-EG")} per m²
                </Text>
              </Pressable>
            ))}
          </View>
        );
      })}

      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>Comparison results</Text>

        <View style={styles.resultRow}>
          <Text style={styles.lightText}>{a.name}</Text>
          <Text style={styles.resultPrice}>
            EGP {a.price.toLocaleString("en-EG")}
          </Text>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.lightText}>{b.name}</Text>
          <Text style={styles.resultPrice}>
            EGP {b.price.toLocaleString("en-EG")}
          </Text>
        </View>

        <View style={styles.separator} />

        <Text style={styles.lightText}>Price difference</Text>
        <Text style={styles.difference}>
          EGP {Math.abs(a.price - b.price).toLocaleString("en-EG")}
        </Text>

        <Text style={styles.lightText}>
          {a.price === b.price
            ? "Both materials have the same price."
            : `${a.price < b.price ? a.name : b.name} is cheaper.`}
        </Text>

        <Text style={styles.lightText}>
          Durability: {a.durability}/10 vs {b.durability}/10
        </Text>
        <Text style={styles.lightText}>
          Maintenance: {a.maintenance} vs {b.maintenance}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7F2" },
  content: { padding: 20, paddingBottom: 32 },
  brand: {
    color: "#66816B",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1.5,
    marginTop: 12,
  },
  title: {
    color: "#203B2A",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 10,
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
  },
  sectionTitle: {
    color: "#203B2A",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
  },
  option: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  selectedOption: {
    borderColor: "#66816B",
    backgroundColor: "#EAF1E7",
  },
  materialName: { color: "#203B2A", fontWeight: "600", fontSize: 15 },
  muted: { color: "#6B7280", fontSize: 13, marginTop: 5 },
  resultCard: { backgroundColor: "#203B2A", borderRadius: 22, padding: 20 },
  resultTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  lightText: { color: "#DCEBDD", fontSize: 14, marginTop: 8, flexShrink: 1 },
  resultPrice: { color: "#FFFFFF", fontWeight: "700", marginLeft: 8 },
  separator: { height: 1, backgroundColor: "#47634D", marginVertical: 12 },
  difference: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 8,
  },
});
