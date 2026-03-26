import React, {useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ThemeColors} from '../theme/colors';
import {useAppTheme} from '../theme/ThemeContext';

const CATEGORIES = [
  {key: 'general', label: 'General', icon: 'earth'},
  {key: 'technology', label: 'Tech', icon: 'laptop'},
  {key: 'sports', label: 'Sports', icon: 'soccer'},
  {key: 'business', label: 'Business', icon: 'briefcase-outline'},
  {key: 'health', label: 'Health', icon: 'hospital-box-outline'},
];

interface CategoryChipsProps {
  active: string;
  onChange: (category: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = React.memo(
  ({active, onChange}) => {
    const {colors} = useAppTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        style={styles.scroll}>
        {CATEGORIES.map(cat => {
          const isActive = cat.key === active;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onChange(cat.key)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityState={{selected: isActive}}
              accessibilityLabel={`Category: ${cat.label}`}>
              <MaterialCommunityIcons
                name={cat.icon}
                size={16}
                color={isActive ? colors.chipActiveText : colors.chipText}
                style={{marginRight: 6}}
              />
              <Text
                style={[styles.chipText, isActive && styles.chipTextActive]}
                allowFontScaling
                maxFontSizeMultiplier={1.5}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  },
);

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    scroll: {
      flexGrow: 0,
      flexShrink: 0,
      minHeight: 52,
    },
    container: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      gap: 8,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      minHeight: 36,
      borderRadius: 20,
      backgroundColor: colors.chipBackground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chipActive: {
      backgroundColor: colors.chipActiveBackground,
      borderColor: colors.primary,
    },
    chipText: {
      fontSize: 13.5,
      fontWeight: '600',
      color: colors.chipText,
    },
    chipTextActive: {
      color: colors.chipActiveText,
    },
  });
}
