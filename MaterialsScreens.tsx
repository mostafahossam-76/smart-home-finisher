
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

type Material = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
};

type CartItem = {
  id: string;
  quantity: number;
};

const GREEN = '#286747';

const MATERIALS: Material[] = [
  {
    id: '1',
    name: 'Ceramic Floor Tiles',
    category: 'Tiles',
    price: 280,
    unit: 'm²',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600',
  },
  {
    id: '2',
    name: 'Interior Wall Paint',
    category: 'Paint',
    price: 650,
    unit: 'can',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600',
  },
  {
    id: '3',
    name: 'Porcelain Tiles',
    category: 'Tiles',
    price: 420,
    unit: 'm²',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600',
  },
  {
    id: '4',
    name: 'Wooden Flooring',
    category: 'Flooring',
    price: 550,
    unit: 'm²',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600',
  },
  {
    id: '5',
    name: 'Ceiling LED Light',
    category: 'Lighting',
    price: 350,
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
  },
];

const CATEGORIES = ['All', 'Tiles', 'Paint', 'Flooring', 'Lighting'];

type ScreenName = 'Catalog' | 'Selection' | 'Favorites';

export default function MaterialsScreens() {
  const [screen, setScreen] = useState<ScreenName>('Catalog');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredMaterials = useMemo(
    () =>
      MATERIALS.filter(
        material =>
          (category === 'All' || material.category === category) &&
          material.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [category, search],
  );

  const total = cart.reduce((sum, item) => {
    const material = MATERIALS.find(m => m.id === item.id);
    return sum + (material ? material.price * item.quantity : 0);
  }, 0);

  const addToCart = (materialId: string) => {
    setCart(current => {
      const existing = current.find(item => item.id === materialId);
      if (existing) {
        return current.map(item =>
          item.id === materialId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { id: materialId, quantity: 1 }];
    });
  };

  const changeQuantity = (id: string, amount: number) => {
    setCart(current =>
      current
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
        .filter(item => item.quantity > 0),
    );
  };

  const toggleFavorite = (id: string) => {
    setFavorites(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id],
    );
  };

  const displayedMaterials =
    screen === 'Favorites'
      ? MATERIALS.filter(item => favorites.includes(item.id))
      : filteredMaterials;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7F2" />

      <View style={styles.header}>
        <Text style={styles.brand}>HOME FINISHER</Text>
        <Text style={styles.title}>
          {screen === 'Catalog'
            ? 'Material Catalog'
            : screen === 'Selection'
              ? 'My Material List'
              : 'Saved Materials'}
        </Text>
        <Text style={styles.subtitle}>Everything for your dream home</Text>
      </View>

      <View style={styles.tabs}>
        {([
          ['Catalog', 'Catalog'],
          ['Selection', `My List (${cart.length})`],
          ['Favorites', `Saved (${favorites.length})`],
        ] as [ScreenName, string][]).map(([name, label]) => (
          <TouchableOpacity
            key={name}
            onPress={() => setScreen(name)}
            style={[styles.tab, screen === name && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                screen === name && styles.activeTabText,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {screen === 'Catalog' && (
        <View style={styles.searchArea}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search materials..."
            style={styles.search}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map(item => (
              <TouchableOpacity
                key={item}
                onPress={() => setCategory(item)}
                style={[
                  styles.chip,
                  category === item && styles.activeChip,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    category === item && styles.activeChipText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {screen === 'Selection' && (
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Estimated Total</Text>
          <Text style={styles.total}>EGP {total.toLocaleString()}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.list}>
        {screen === 'Selection' ? (
          cart.map(item => {
            const material = MATERIALS.find(m => m.id === item.id);
            if (!material) return null;

            return (
              <View key={item.id} style={styles.cartCard}>
                <Image source={{ uri: material.image }} style={styles.cartImage} />
                <View style={styles.cartInfo}>
                  <Text style={styles.name}>{material.name}</Text>
                  <Text style={styles.price}>
                    EGP {material.price} / {material.unit}
                  </Text>
                  <View style={styles.quantityRow}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => changeQuantity(item.id, -1)}
                    >
                      <Text style={styles.quantityText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => changeQuantity(item.id, 1)}
                    >
                      <Text style={styles.quantityText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        setCart(current => current.filter(x => x.id !== item.id))
                      }
                    >
                      <Text style={styles.remove}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          displayedMaterials.map(material => (
            <View key={material.id} style={styles.card}>
              <Image
                source={{ uri: material.image }}
                style={styles.image}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.heart}
                onPress={() => toggleFavorite(material.id)}
              >
                <Text style={styles.heartText}>
                  {favorites.includes(material.id) ? '♥' : '♡'}
                </Text>
              </TouchableOpacity>
              <View style={styles.cardBody}>
                <Text style={styles.category}>{material.category}</Text>
                <Text style={styles.name}>{material.name}</Text>
                <Text style={styles.price}>
                  EGP {material.price.toLocaleString()} / {material.unit}
                </Text>
                {screen === 'Catalog' && (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addToCart(material.id)}
                  >
                    <Text style={styles.addText}>+ Add to My List</Text>
                  </TouchableOpacity>
                )}
                {screen === 'Favorites' && (
                  <TouchableOpacity
                    style={styles.removeFavorite}
                    onPress={() => toggleFavorite(material.id)}
                  >
                    <Text style={styles.removeFavoriteText}>
                      Remove Favorite
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}

        {screen === 'Selection' && cart.length === 0 && (
          <Text style={styles.empty}>
            Your list is empty. Add materials from the Catalog.
          </Text>
        )}

        {screen === 'Favorites' && displayedMaterials.length === 0 && (
          <Text style={styles.empty}>
            No favorites yet. Tap a heart in the Catalog to save materials.
          </Text>
        )}

        {screen === 'Catalog' && filteredMaterials.length === 0 && (
          <Text style={styles.empty}>No materials found.</Text>
        )}

        <Text style={styles.note}>
          Sample prices for demonstration. Confirm prices with suppliers.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7F2' },
  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 16 },
  brand: { color: GREEN, fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#233A2D', fontSize: 27, fontWeight: '800', marginTop: 7 },
  subtitle: { color: '#78847A', fontSize: 13, marginTop: 5 },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 15,
    backgroundColor: '#E6ECE5',
    borderRadius: 12,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 9 },
  activeTab: { backgroundColor: GREEN },
  tabText: { color: '#56665A', fontSize: 11, fontWeight: '600' },
  activeTabText: { color: '#FFFFFF' },
  searchArea: { paddingTop: 13, paddingHorizontal: 15 },
  search: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCE5DC',
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#E5EBE4',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 7,
  },
  activeChip: { backgroundColor: GREEN },
  chipText: { color: '#56665A', fontSize: 12 },
  activeChipText: { color: '#FFFFFF' },
  list: { padding: 15, paddingBottom: 35 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5EAE2',
  },
  image: { width: '100%', height: 165, backgroundColor: '#E8ECE5' },
  heart: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartText: { color: '#D04D57', fontSize: 24 },
  cardBody: { padding: 15 },
  category: { color: GREEN, fontSize: 11, fontWeight: '800' },
  name: { color: '#263C30', fontSize: 16, fontWeight: '700', marginTop: 5 },
  price: { color: GREEN, fontWeight: '800', fontSize: 14, marginTop: 8 },
  addButton: {
    backgroundColor: GREEN,
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 13,
  },
  addText: { color: '#FFFFFF', fontWeight: '700' },
  totalCard: {
    marginHorizontal: 15,
    marginTop: 15,
    backgroundColor: GREEN,
    borderRadius: 15,
    padding: 19,
  },
  totalLabel: { color: '#DCEBE0', fontSize: 12 },
  total: { color: '#FFFFFF', fontSize: 28, fontWeight: '800', marginTop: 5 },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    padding: 10,
    marginBottom: 12,
  },
  cartImage: { width: 85, height: 100, borderRadius: 9 },
  cartInfo: { flex: 1, paddingLeft: 12, justifyContent: 'center' },
  quantityRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#E6EEE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: { color: GREEN, fontSize: 18, fontWeight: 'bold' },
  quantity: { color: '#263C30', marginHorizontal: 10, fontWeight: '700' },
  remove: { color: '#C04A4A', fontSize: 11, marginLeft: 12 },
  removeFavorite: {
    backgroundColor: '#FCEEEF',
    padding: 11,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 12,
  },
  removeFavoriteText: { color: '#B43E49', fontWeight: '700', fontSize: 12 },
  empty: { textAlign: 'center', color: '#78847A', padding: 25, lineHeight: 20 },
  note: { textAlign: 'center', color: '#899389', fontSize: 10, marginTop: 15 },
});
