import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Chip, Divider, Paragraph, Text, Title } from 'react-native-paper';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RecipeItem } from '../types/recipe';
import { useThemeMode } from '../context/ThemeContext';
import { colors, getScreenColors } from '../theme';

interface RecipeDetailRoute {
  params: {
    id: number;
  };
}

export default function RecipeDetailScreen({ route }: { route: RecipeDetailRoute }) {
  const { id } = route.params;
  const { isDarkMode } = useThemeMode();
  const screenColors = getScreenColors(isDarkMode);
  const [recipe, setRecipe] = useState<RecipeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chipBg = isDarkMode ? colors.borderDark : '#e8f0fe';
  const chipText = isDarkMode ? colors.textDark : colors.primary;
  const tagChipBg = isDarkMode ? '#2a2a2a' : '#f0f4ff';

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<RecipeItem>(`https://dummyjson.com/recipes/${String(id)}`);
        setRecipe(response.data);
      } catch (err) {
        console.log('Error fetch recipe detail:', err);
        setError('Tidak dapat memuat data resep.');
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: screenColors.background }]}>
        <ActivityIndicator animating size="large" color={colors.primary} />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={[styles.center, { backgroundColor: screenColors.background }]}>
        <Text style={{ color: screenColors.text, textAlign: 'center', paddingHorizontal: 24 }}>
          {error ?? 'Resep tidak ditemukan.'}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: screenColors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Card style={[styles.card, { backgroundColor: screenColors.surface }]} mode="elevated">
          <Card.Cover source={{ uri: recipe.image }} style={styles.cover} />
          <Card.Content style={styles.content}>
            <Title style={[styles.recipeName, { color: screenColors.text }]}>{recipe.name}</Title>

            <View style={styles.metaRow}>
              <Chip
                icon="map-marker"
                style={{ backgroundColor: chipBg }}
                textStyle={{ fontSize: 12, color: chipText }}
              >
                {recipe.cuisine}
              </Chip>
              <Chip
                icon="clock-outline"
                style={{ backgroundColor: chipBg }}
                textStyle={{ fontSize: 12, color: chipText }}
              >
                {recipe.cookTimeMinutes} menit
              </Chip>
              <Chip
                icon="star"
                style={{ backgroundColor: chipBg }}
                textStyle={{ fontSize: 12, color: chipText }}
              >
                {recipe.rating}
              </Chip>
            </View>

            {recipe.tags?.length > 0 && (
              <View style={styles.tagsRow}>
                {recipe.tags.map((tag) => (
                  <Chip
                    key={tag}
                    style={{ backgroundColor: tagChipBg, marginBottom: 4 }}
                    textStyle={{ color: screenColors.text, fontSize: 12 }}
                    compact
                  >
                    {tag}
                  </Chip>
                ))}
              </View>
            )}

            <Divider style={[styles.divider, { backgroundColor: screenColors.border }]} />

            <Title style={[styles.sectionTitle, { color: screenColors.text }]}>ingredients</Title>
            {recipe.ingredients.map((item, index) => (
              <Paragraph key={index} style={[styles.listItem, { color: screenColors.text }]}>
                {index + 1}. {item}
              </Paragraph>
            ))}

            <Divider style={[styles.divider, { backgroundColor: screenColors.border }]} />

            <Title style={[styles.sectionTitle, { color: screenColors.text }]}>Instructions</Title>
            {recipe.instructions.map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                </View>
                <Paragraph style={[styles.stepText, { color: screenColors.text }]}>{step}</Paragraph>
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 15, paddingBottom: 30 },
  card: { borderRadius: 16, overflow: 'hidden' },
  cover: { height: 320 },
  content: { paddingTop: 16 },
  recipeName: { fontWeight: 'bold', fontSize: 24, marginBottom: 12 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  divider: { marginVertical: 16 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 12 },
  listItem: { marginBottom: 6, lineHeight: 22 },
  stepRow: { flexDirection: 'row', marginBottom: 14, alignItems: 'flex-start' },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: { color: colors.white, fontWeight: 'bold', fontSize: 13 },
  stepText: { flex: 1, lineHeight: 22 },
});
