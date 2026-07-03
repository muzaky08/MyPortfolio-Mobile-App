import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Paragraph, Text } from 'react-native-paper';
import ScreenLayout from '../components/ScreenLayout';
import { useAppData } from '../context/AppDataContext';
import { useThemeMode } from '../context/ThemeContext';
import { colors, getScreenColors } from '../theme';

export default function EducationScreen() {
  const { data } = useAppData();
  const { isDarkMode } = useThemeMode();
  const screenColors = getScreenColors(isDarkMode);
  const items = data.education;

  return (
    <ScreenLayout title="Riwayat Pendidikan">
      <View style={styles.timeline}>
        {/* Garis vertikal menyatu */}
        <View
          style={[
            styles.timelineLine,
            { backgroundColor: isDarkMode ? colors.borderDark : '#c7d7f5' },
          ]}
        />

        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          return (
            <View key={item.id} style={styles.timelineRow}>
              <View style={styles.markerCol}>
                <View
                  style={[
                    styles.markerOuter,
                    {
                      borderColor: colors.primary,
                      backgroundColor: screenColors.surface,
                    },
                  ]}
                >
                  <View style={[styles.markerInner, { backgroundColor: colors.primary }]} />
                </View>
              </View>

              <Card
                style={[
                  styles.card,
                  { backgroundColor: screenColors.surface },
                  isFirst && styles.cardFirst,
                  isLast && styles.cardLast,
                ]}
                mode="elevated"
              >
                <View style={[styles.levelBadge, { backgroundColor: isDarkMode ? colors.borderDark : '#eef4ff' }]}>
                  <Text style={[styles.levelText, { color: colors.primary }]}>{item.level}</Text>
                </View>
                <Text style={[styles.schoolName, { color: screenColors.text }]}>{item.schoolName}</Text>
                <Text style={[styles.years, { color: screenColors.textSecondary }]}>{item.years}</Text>
                <Paragraph style={[styles.location, { color: screenColors.textSecondary }]}>
                  📍 {item.location}
                </Paragraph>
              </Card>
            </View>
          );
        })}
      </View>
    </ScreenLayout>
  );
}

const MARKER_SIZE = 18;
const TIMELINE_LEFT = 11;

const styles = StyleSheet.create({
  timeline: {
    position: 'relative',
    paddingLeft: 4,
  },
  timelineLine: {
    position: 'absolute',
    left: TIMELINE_LEFT,
    top: MARKER_SIZE / 2 + 8,
    bottom: MARKER_SIZE / 2 + 8,
    width: 3,
    borderRadius: 2,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  markerCol: {
    width: 28,
    alignItems: 'center',
    paddingTop: 18,
    zIndex: 1,
  },
  markerOuter: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  card: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 14,
    padding: 14,
  },
  cardFirst: { marginTop: 0 },
  cardLast: { marginBottom: 4 },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  levelText: { fontSize: 12, fontWeight: '700' },
  schoolName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  years: { fontSize: 13, marginBottom: 6 },
  location: { fontSize: 13 },
});
