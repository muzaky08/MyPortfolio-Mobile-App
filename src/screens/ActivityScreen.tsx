import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Divider, Icon, List, Text } from 'react-native-paper';
import ScreenLayout from '../components/ScreenLayout';
import { useAppData } from '../context/AppDataContext';
import { DAYS_OF_WEEK } from '../constants/days';
import { useThemeMode } from '../context/ThemeContext';
import { colors, getScreenColors } from '../theme';

function ActivityRow({ task, textColor }: { task: string; textColor: string }) {
  return (
    <View style={styles.activityRow}>
      <Icon source="circle-small" size={22} color={colors.primary} />
      <Text style={[styles.activityText, { color: textColor }]}>{task}</Text>
    </View>
  );
}

export default function ActivityScreen() {
  const { data } = useAppData();
  const { isDarkMode } = useThemeMode();
  const screenColors = getScreenColors(isDarkMode);
  const [expandedDay, setExpandedDay] = useState<string | undefined>(DAYS_OF_WEEK[0]);

  const activitiesByDay = useMemo(() => {
    const grouped: Record<string, typeof data.activities> = {};
    DAYS_OF_WEEK.forEach((day) => {
      grouped[day] = data.activities.filter((a) => a.day === day);
    });
    return grouped;
  }, [data.activities]);

  return (
    <ScreenLayout title="Aktivitas Harian">
      {DAYS_OF_WEEK.map((day, index) => {
        const dayActivities = activitiesByDay[day];
        const isExpanded = expandedDay === day;

        return (
          <Card
            key={day}
            style={[styles.dayCard, { backgroundColor: screenColors.surface }]}
            mode="elevated"
          >
            <List.Accordion
              title={`${day}${dayActivities.length > 0 ? `  ·  ${dayActivities.length} aktivitas` : ''}`}
              expanded={isExpanded}
              onPress={() => setExpandedDay(isExpanded ? undefined : day)}
              left={(props) => <List.Icon {...props} icon="calendar-clock" color={colors.primary} />}
              titleStyle={{ color: screenColors.text, fontWeight: '700', fontSize: 15 }}
              titleNumberOfLines={2}
              style={{ backgroundColor: screenColors.surface }}
            >
              {dayActivities.length === 0 ? (
                <Text style={[styles.emptyText, { color: screenColors.textSecondary }]}>
                  Belum ada aktivitas
                </Text>
              ) : (
                dayActivities.map((activity, actIndex) => (
                  <View key={activity.id}>
                    <ActivityRow task={activity.task} textColor={screenColors.text} />
                    {actIndex < dayActivities.length - 1 && (
                      <Divider
                        style={[styles.innerDivider, { backgroundColor: isDarkMode ? colors.borderDark : '#e8edf5' }]}
                      />
                    )}
                  </View>
                ))
              )}
            </List.Accordion>
            {index < DAYS_OF_WEEK.length - 1 && (
              <View style={[styles.daySeparator, { backgroundColor: isDarkMode ? colors.borderDark : '#dce6f5' }]} />
            )}
          </Card>
        );
      })}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  dayCard: {
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },
  daySeparator: {
    height: 2,
    marginHorizontal: 16,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingRight: 16,
    paddingLeft: 12,
  },
  activityText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    flexWrap: 'wrap',
  },
  emptyText: {
    fontStyle: 'italic',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  innerDivider: { marginLeft: 40, marginRight: 16 },
});
