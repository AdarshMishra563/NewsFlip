import React, {useMemo} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ThemeColors} from '../theme/colors';
import {useAppTheme} from '../theme/ThemeContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = React.memo(
  ({value, onChangeText}) => {
    const {colors} = useAppTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textTertiary} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Search news..."
            placeholderTextColor={colors.textTertiary}
            value={value}
            onChangeText={onChangeText}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Search news"
          />
          {value.length > 0 && (
            <TouchableOpacity
              onPress={() => onChangeText('')}
              style={styles.clearButton}
              accessibilityLabel="Clear search">
              <MaterialCommunityIcons name="close-circle" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  },
);

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 4,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.searchBackground,
      borderRadius: 14,
      paddingHorizontal: 14,
      height: 46,
    },
    icon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
      paddingVertical: 0,
    },
    clearButton: {
      padding: 6,
      marginLeft: 4,
    },
  });
}
