import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeMode } from '../context/ThemeContext';
import { colors, getScreenColors } from '../theme';

const CONTENT_PADDING = 15;

type ScreenHeaderProps = {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

/**
 * Header bergaya native stack (sama seperti SettingsScreen dari React Navigation).
 * Judul rata kiri sejajar dengan padding konten (15px).
 */
export default function ScreenHeader({ title, left, right }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeMode();
  const screenColors = getScreenColors(isDarkMode);
  const hasCustomSlots = Boolean(left || right);

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: screenColors.appbar,
          paddingTop: insets.top,
        },
      ]}
    >
      {hasCustomSlots ? (
        <View style={styles.bar}>
          <View style={styles.slotLeft}>{left}</View>
          <View style={styles.spacer} />
          <View style={styles.slotRight}>{right}</View>
        </View>
      ) : (
        <View style={[styles.bar, styles.barTitleOnly]}>
          {title ? (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  bar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  barTitleOnly: {
    paddingHorizontal: CONTENT_PADDING,
    justifyContent: 'center',
  },
  slotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
  },
  slotRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 4,
  },
  spacer: { flex: 1 },
  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '100%',
  },
});
