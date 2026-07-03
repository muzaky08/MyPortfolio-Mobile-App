import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from './ScreenHeader';
import { useThemeMode } from '../context/ThemeContext';
import { getScreenColors } from '../theme';

type ScreenLayoutProps = {
  title?: string;
  children: React.ReactNode;
  scrollable?: boolean;
  contentStyle?: ViewStyle;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
};

export default function ScreenLayout({
  title,
  children,
  scrollable = true,
  contentStyle,
  headerLeft,
  headerRight,
}: ScreenLayoutProps) {
  const { isDarkMode } = useThemeMode();
  const screenColors = getScreenColors(isDarkMode);

  const content = <View style={[styles.content, contentStyle]}>{children}</View>;

  return (
    <View style={[styles.root, { backgroundColor: screenColors.background }]}>
      <ScreenHeader title={title} left={headerLeft} right={headerRight} />
      <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
        {scrollable ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
        ) : (
          <View style={styles.flex}>{content}</View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  content: { padding: 15 },
});
