
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  View,
  Pressable,
  StyleSheet,
} from "react-native";

const materials = [
  { name: "Ceramic", price: 350 },
  { name: "Porcelain", price: 550 },
  { name: "Marble", price: 1200 },
];

export default function CostEstimator() {
  const [material, setMaterial] = useState("Ceramic");
  const [quantity, setQuantity] = useState("50");

  const selectedMaterial =
    materials.find((item) => item.name === material) ?? materials[0];

  const total =
    Math.max(0, Number(quantity) || 0) * selectedMaterial.price;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.eyebrow}>SMART HOME FINISHER</Text>
      <Text style={styles.heading}>Cost Estimator</Text>
      <Text style={styles.subtitle}>
        Choose your material and enter the area you need to cover.
      </Text>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>ESTIMATED TOTAL</Text>
        <Text style={styles.totalAmount}>
          {total.toLocaleString("en-US")} EGP
        </Text>
        <Text style={styles.totalDescription}>
          Based on {quantity || "0"} m² of {selectedMaterial.name}
        </Text>
      </View>

      <Text style={styles.label}>Choose Material</Text>
      <View style={styles.materialOptions}>
        {materials.map((item) => {
          const isSelected = material === item.name;

          return (
            <Pressable
              key={item.name}
              onPress={() => setMaterial(item.name)}
              style={[
                styles.materialButton,
                isSelected && styles.selectedMaterial,
              ]}
            >
              <Text
                style={[
                  styles.materialName,
                  isSelected && styles.selectedText,
                ]}
              >
                {item.name}
              </Text>
              <Text
                style={[
                  styles.materialPrice,
                  isSelected && styles.selectedText,
                ]}
              >
                {item.price.toLocaleString("en-US")} EGP/m²
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.priceCard}>
        <Text style={styles.priceLabel}>Fixed price per m²</Text>
        <Text style={styles.fixedPrice}>
          {selectedMaterial.price.toLocaleString("en-US")} EGP
        </Text>
        <Text style={styles.priceNote}>
          Price changes automatically when you select another material.
        </Text>
      </View>

      <Text style={styles.label}>Area Required (m²)</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={(value) =>
          setQuantity(value.replace(/[^0-9.]/g, ""))
        }
        keyboardType="decimal-pad"
        placeholder="Enter area in square meters"
        placeholderTextColor="#8A9188"
      />

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Cost Breakdown</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Material</Text>
          <Text style={styles.summaryValue}>
            {selectedMaterial.name}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Quantity</Text>
          <Text style={styles.summaryValue}>{quantity || "0"} m²</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Price per m²</Text>
          <Text style={styles.summaryValue}>
            {selectedMaterial.price.toLocaleString("en-US")} EGP
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.finalLabel}>Total Cost</Text>
          <Text style={styles.finalValue}>
            {total.toLocaleString("en-US")} EGP
          </Text>
        </View>
      </View>

      <Text style={styles.note}>
        Sample prices for demonstration. Actual supplier prices may vary.
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
    marginBottom: 22,
  },
  totalCard: {
    backgroundColor: "#203B2A",
    padding: 23,
    borderRadius: 22,
    marginBottom: 25,
  },
  totalLabel: {
    color: "#C5D5C4",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  totalAmount: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 10,
  },
  totalDescription: {
    color: "#D5E1D2",
    fontSize: 12,
    marginTop: 8,
  },
  label: {
    color: "#203B2A",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 11,
  },
  materialOptions: {
    gap: 10,
    marginBottom: 20,
  },
  materialButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E7DE",
    borderRadius: 15,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedMaterial: {
    backgroundColor: "#EAF1E7",
    borderColor: "#203B2A",
    borderWidth: 2,
  },
  materialName: {
    color: "#26352A",
    fontSize: 14,
    fontWeight: "700",
  },
  materialPrice: {
    color: "#737B73",
    fontSize: 12,
    fontWeight: "600",
  },
  selectedText: {
    color: "#203B2A",
  },
  priceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 17,
    marginBottom: 23,
    borderWidth: 1,
    borderColor: "#E9ECE5",
  },
  priceLabel: {
    color: "#737B73",
    fontSize: 12,
  },
  fixedPrice: {
    color: "#203B2A",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 6,
  },
  priceNote: {
    color: "#858B83",
    fontSize: 11,
    marginTop: 6,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE3D8",
    borderRadius: 13,
    paddingHorizontal: 15,
    paddingVertical: 14,
    color: "#203B2A",
    fontSize: 16,
    marginBottom: 23,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    padding: 19,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E9ECE5",
  },
  summaryTitle: {
    color: "#203B2A",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 17,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },
  summaryLabel: {
    color: "#737B73",
    fontSize: 13,
  },
  summaryValue: {
    color: "#26352A",
    fontSize: 13,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#E9ECE5",
    marginVertical: 5,
  },
  finalLabel: {
    color: "#203B2A",
    fontSize: 14,
    fontWeight: "800",
  },
  finalValue: {
    color: "#203B2A",
    fontSize: 17,
    fontWeight: "800",
  },
  note: {
    color: "#858B83",
    fontSize: 11,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 17,
  },
});
