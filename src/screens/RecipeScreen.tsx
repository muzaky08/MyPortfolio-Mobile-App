import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Chip, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import ScreenLayout from '../components/ScreenLayout';
import type { RootStackParamList } from '../navigation';
import type { RecipeItem, RecipesResponse } from '../types/recipe';
import { useThemeMode } from '../context/ThemeContext';
import { colors, getScreenColors } from '../theme';

const SCREEN_PADDING = 15;
const CARD_GAP = 10;
const NUM_COLUMNS = 2;

function getCardWidth() {
  const screenWidth = Dimensions.get('window').width;
  const totalGap = CARD_GAP * (NUM_COLUMNS - 1) + SCREEN_PADDING * 2;
  return (screenWidth - totalGap) / NUM_COLUMNS;
}

export default function RecipeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDarkMode } = useThemeMode();
  const screenColors = getScreenColors(isDarkMode);
  const cardWidth = useMemo(() => getCardWidth(), []);

  const [recipes, setRecipes] = useState<RecipeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('Semua');

  const fetchAllRecipes = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);
      const response = await axios.get<RecipesResponse>('https://dummyjson.com/recipes');
      setRecipes(response.data.recipes);
    } catch (err) {
      console.log('Error fetch all recipes:', err);
      setError('Gagal memuat resep. Periksa koneksi internet Anda.');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchAllRecipes();
  }, [fetchAllRecipes]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllRecipes({ silent: true });
    setRefreshing(false);
  };

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    recipes.forEach((recipe) => {
      recipe.tags?.forEach((tag) => tagSet.add(tag));
    });
    return ['Semua', ...Array.from(tagSet).sort()];
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    if (selectedTag === 'Semua') return recipes;
    return recipes.filter((recipe) => recipe.tags?.includes(selectedTag));
  }, [recipes, selectedTag]);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text variant="bodySmall" style={{ color: screenColors.textSecondary, marginBottom: 10 }}>
       List Recipe
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsContainer}>
        {allTags.map((item) => (
          <Chip
            key={item}
            selected={selectedTag === item}
            onPress={() => setSelectedTag(item)}
            style={[styles.tagChip, selectedTag === item && { backgroundColor: colors.primary }]}
            textStyle={selectedTag === item ? { color: colors.white } : { color: screenColors.text }}
            compact
          >
            {item}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );

  if (loading && recipes.length === 0 && !error) {
    return (
      <ScreenLayout title="Recipe" scrollable={false}>
        <View style={styles.center}>
          <ActivityIndicator animating size="large" color={colors.primary} />
          <Text style={{ marginTop: 12, color: screenColors.textSecondary }}>Memuat resep...</Text>
        </View>
      </ScreenLayout>
    );
  }

  if (error && recipes.length === 0) {
    return (
      <ScreenLayout title="Recipe" scrollable={false}>
        <View style={styles.center}>
          <Text style={{ color: screenColors.textSecondary, textAlign: 'center', marginBottom: 16 }}>{error}</Text>
          <Chip icon="refresh" onPress={() => fetchAllRecipes()}>Coba Lagi</Chip>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Recipe" scrollable={false} contentStyle={styles.listWrap}>
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => String(item.id)}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        renderItem={({ item }) => (
          <Card
            style={[styles.card, { width: cardWidth, backgroundColor: screenColors.surface }]}
            mode="elevated"
            onPress={() => navigation.navigate('RecipeDetail', { id: item.id })}
          >
            <Card.Cover source={{ uri: item.image }} style={styles.cover} />
            <Card.Content style={styles.cardBody}>
              <Text
                variant="titleSmall"
                style={{ color: screenColors.text, fontWeight: 'bold' }}
                numberOfLines={2}
              >
                {item.name}
              </Text>
              <Text variant="labelSmall" style={{ color: screenColors.textSecondary, marginTop: 4 }} numberOfLines={1}>
                {item.cuisine}
              </Text>
              <Text variant="labelSmall" style={{ color: colors.primary, marginTop: 2 }}>
                {item.cookTimeMinutes} m · ⭐ {item.rating}
              </Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: screenColors.textSecondary }}>Tidak ada resep untuk tag ini.</Text>
          </View>
        }
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  listWrap: { flex: 1, padding: 0},
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, width: '100%' },
  listContent: { paddingHorizontal: SCREEN_PADDING, paddingBottom: 24 },
  header: { marginBottom: 10, paddingTop: 4 },
  tagsContainer: { gap: 5, paddingBottom: 10 },
  tagChip: { marginRight: 6 },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cover: { borderRadius: 0, height: 210 },
  cardBody: { paddingVertical: 5, paddingHorizontal:10 },
});
