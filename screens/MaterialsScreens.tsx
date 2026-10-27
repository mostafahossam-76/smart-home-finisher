import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";

type Material = {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
};

const MATERIALS: Material[] = [
  {
    id: 1,
    name: "Ceramic Floor Tiles",
    category: "Tiles",
    price: 280,
    unit: "m²",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
  },
  {
    id: 2,
    name: "Interior Wall Paint",
    category: "Paint",
    price: 650,
    unit: "can",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800",
  },
  {
    id: 3,
    name: "Wooden Flooring",
    category: "Flooring",
    price: 450,
    unit: "m²",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800",
  },
  {
    id: 4,
    name: "Modern Ceiling Light",
    category: "Lighting",
    price: 1200,
    unit: "piece",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
  },
  {
    id: 5,
    name: "Bathroom Wall Tiles",
    category: "Tiles",
    price: 320,
    unit: "m²",
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800",
  },
];

const CATEGORIES = ["All", "Tiles", "Paint", "Flooring", "Lighting"];

type Tab = "Catalog" | "My List" | "Saved";

export default function MaterialsScreens() {
  const [tab, setTab] = useState<Tab>("Catalog");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredMaterials = useMemo(
    () =>
      MATERIALS.filter((material) => {
        const matchesCategory =
          category === "All" || material.category === category;
        const matchesSearch = material.name
          .toLowerCase()
          .includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
      }),
    [category, search]
  );

  const selectedMaterials = MATERIALS.filter(
    (material) => (quantities[material.id] ?? 0) > 0
  );

  const savedMaterials = MATERIALS.filter((material) =>
    favorites.includes(material.id)
  );

  const total = selectedMaterials.reduce(
    (sum, material) =>
      sum + material.price * (quantities[material.id] ?? 0),
    0
  );

  const formatPrice = (price: number) =>
    `EGP ${price.toLocaleString("en-US")}`;

  const changeQuantity = (id: number, amount: number) => {
    setQuantities((previous) => {
      const next = (previous[id] ?? 0) + amount;
      const updated = { ...previous };

      if (next <= 0) {
        delete updated[id];
      } else {
        updated[id] = next;
      }

      return updated;
    });
  };

  const toggleFavorite = (id: number) => {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((favoriteId) => favoriteId !== id)
        : [...previous, id]
    );
  };

  const renderMaterial = (material: Material) => {
    const isFavorite = favorites.includes(material.id);
    const quantity = quantities[material.id] ?? 0;

    return (
      <View key={material.id} style={styles.card}>
        <Image
          source={{ uri: material.image }}
          style={styles.materialImage}
          resizeMode="cover"
        />

        <View style={styles.cardContent}>
          <View style={styles.cardHeading}>
            <View style={styles.materialDetails}>
              <Text style={styles.categoryLabel}>{material.category}</Text>
              <Text style={styles.materialName}>{material.name}</Text>
              <Text style={styles.price}>
                {formatPrice(material.price)} / {material.unit}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.heartButton}
              onPress={() => toggleFavorite(material.id)}
              accessibilityLabel={
                isFavorite ? "Remove from favorites" : "Save to favorites"
              }
            >
              <Text style={styles.heart}>{isFavorite ? "♥" : "♡"}</Text>
            </TouchableOpacity>
          </View>

          {tab === "Catalog" && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => changeQuantity(material.id, 1)}
            >
              <Text style={styles.primaryButtonText}>+ Add to My List</Text>
            </TouchableOpacity>
          )}

          {tab === "My List" && (
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => changeQuantity(material.id, -1)}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.quantity}>{quantity}</Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => changeQuantity(material.id, 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => changeQuantity(material.id, -quantity)}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}

          {tab === "Saved" && (
            <TouchableOpacity
              style={styles.removeFavoriteButton}
              onPress={() => toggleFavorite(material.id)}
            >
              <Text style={styles.removeFavoriteText}>Remove Favorite</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const displayedMaterials =
    tab === "Catalog"
      ? filteredMaterials
      : tab === "My List"
        ? selectedMaterials
        : savedMaterials;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.brand}>HOME FINISHER</Text>

        <Text style={styles.title}>
          {tab === "Catalog"
            ? "Material Catalog"
            : tab === "My List"
              ? "My Material List"
              : "Saved Materials"}
        </Text>

        <Text style={styles.subtitle}>Everything for your dream home</Text>

        <View style={styles.tabs}>
          {(["Catalog", "My List", "Saved"] as Tab[]).map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setTab(item)}
              style={[styles.tab, tab === item && styles.activeTab]}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === item && styles.activeTabText,
                ]}
              >
                {item === "My List"
                  ? `My List (${selectedMaterials.length})`
                  : item === "Saved"
                    ? `Saved (${savedMaterials.length})`
                    : "Catalog"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === "Catalog" && (
          <>
            <TextInput
              style={styles.searchInput}
              placeholder="Search materials..."
              placeholderTextColor="#999D98"
              value={search}
              onChangeText={setSearch}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryContainer}
            >
              {CATEGORIES.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setCategory(item)}
                  style={[
                    styles.categoryChip,
                    category === item && styles.activeCategoryChip,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === item && styles.activeCategoryText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {tab === "My List" && (
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Estimated Total</Text>
            <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
          </View>
        )}

        {displayedMaterials.length > 0 ? (
          displayedMaterials.map(renderMaterial)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              {tab === "Catalog"
                ? "No materials found"
                : tab === "My List"
                  ? "Your list is empty"
                  : "No favorites yet"}
            </Text>

            <Text style={styles.emptyText}>
              {tab === "Catalog"
                ? "Try another search or category."
                : tab === "My List"
                  ? "Add materials from the Catalog."
                  : "Tap a heart in the Catalog to save materials."}
            </Text>

            {tab !== "Catalog" && (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setTab("Catalog")}
              >
                <Text style={styles.primaryButtonText}>Browse Catalog</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={styles.disclaimer}>
          Sample prices for demonstration. Confirm prices with suppliers.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F6F0",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 22,
    paddingTop: 25,
    paddingBottom: 45,
  },
  brand: {
    color: "#28664C",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 12,
  },
  title: {
    color: "#203A2F",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 5,
  },
  subtitle: {
    color: "#818780",
    fontSize: 16,
    marginBottom: 25,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#E6EAE3",
    padding: 5,
    borderRadius: 16,
    marginBottom: 22,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#28664C",
  },
  tabText: {
    color: "#58625A",
    fontSize: 12,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DFE3DC",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    marginBottom: 16,
    color: "#203A2F",
  },
  categoryScroll: {
    marginBottom: 20,
    flexGrow: 0,
  },
  categoryContainer: {
    gap: 8,
    paddingRight: 5,
  },
  categoryChip: {
    backgroundColor: "#E6EAE3",
    borderRadius: 24,
    paddingHorizontal: 17,
    paddingVertical: 11,
  },
  activeCategoryChip: {
    backgroundColor: "#28664C",
  },
  categoryChipText: {
    color: "#59645B",
    fontSize: 13,
  },
  activeCategoryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  totalCard: {
    backgroundColor: "#28664C",
    padding: 24,
    borderRadius: 20,
    marginBottom: 25,
  },
  totalLabel: {
    color: "#DDE9DF",
    fontSize: 15,
    marginBottom: 8,
  },
  totalAmount: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E4E7E0",
    overflow: "hidden",
    marginBottom: 20,
  },
  materialImage: {
    width: "100%",
    height: 185,
    backgroundColor: "#E6EAE3",
  },
  cardContent: {
    padding: 17,
  },
  cardHeading: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  materialDetails: {
    flex: 1,
  },
  categoryLabel: {
    color: "#28664C",
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 6,
  },
  materialName: {
    color: "#253B30",
    fontWeight: "800",
    fontSize: 19,
    marginBottom: 8,
  },
  price: {
    color: "#28664C",
    fontWeight: "800",
    fontSize: 17,
  },
  heartButton: {
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: "#F5F6F0",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  heart: {
    color: "#C34E5D",
    fontSize: 27,
  },
  primaryButton: {
    backgroundColor: "#28664C",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 12,
    alignItems: "center",
    marginTop: 5,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  quantityButton: {
    width: 42,
    height: 42,
    backgroundColor: "#E6EDE4",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    color: "#28664C",
    fontWeight: "800",
    fontSize: 23,
  },
  quantity: {
    color: "#253B30",
    fontSize: 17,
    fontWeight: "800",
  },
  removeButton: {
    padding: 9,
  },
  removeText: {
    color: "#BD5360",
    fontSize: 14,
  },
  removeFavoriteButton: {
    backgroundColor: "#FCEDEF",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  removeFavoriteText: {
    color: "#AE4553",
    fontWeight: "800",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 55,
    paddingHorizontal: 10,
  },
  emptyTitle: {
    color: "#46564A",
    fontSize: 19,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  emptyText: {
    color: "#858B83",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 18,
  },
  disclaimer: {
    color: "#92978F",
    textAlign: "center",
    fontSize: 12,
    marginTop: 15,
    lineHeight: 19,
  },
});

