import React, {useMemo} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ThemeColors} from '../theme/colors';
import {useAppTheme} from '../theme/ThemeContext';
import {NewsArticle} from '../services/guardianApi';

interface ArticleCardProps {
  article: NewsArticle;
  onPress: (article: NewsArticle) => void;
  columns: number;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export const ArticleCard: React.FC<ArticleCardProps> = React.memo(
  ({article, onPress, columns}) => {
    const {colors} = useAppTheme();

    const styles = useMemo(
      () => createStyles(colors, columns),
      [colors, columns],
    );

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => onPress(article)}
        accessibilityRole="button"
        accessibilityLabel={`Read article: ${article.title}`}>
        {article.image ? (
          <Image
            source={{uri: article.image}}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <MaterialCommunityIcons name="image-off-outline" size={48} color={colors.textTertiary} />
          </View>
        )}
        <View style={styles.content}>
          <Text
            style={styles.title}
            numberOfLines={columns > 1 ? 2 : 3}
            allowFontScaling
            maxFontSizeMultiplier={1.5}>
            {article.title}
          </Text>
          {article.description.length > 0 && columns === 1 && (
            <Text
              style={styles.description}
              numberOfLines={2}
              allowFontScaling
              maxFontSizeMultiplier={1.5}>
              {article.description}
            </Text>
          )}
          <View style={styles.meta}>
            <View style={styles.sourceBadge}>
              <Text
                style={styles.sourceText}
                numberOfLines={1}
                allowFontScaling
                maxFontSizeMultiplier={1.5}>
                {article.source}
              </Text>
            </View>
            <Text
              style={styles.time}
              allowFontScaling
              maxFontSizeMultiplier={1.5}>
              {timeAgo(article.publishedAt)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

function createStyles(colors: ThemeColors, columns: number) {
  const isGrid = columns > 1;
  return StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      marginHorizontal: isGrid ? 6 : 16,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: isGrid ? 120 : 200,
      backgroundColor: colors.surfaceVariant,
    },
    placeholderImage: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      padding: isGrid ? 10 : 14,
    },
    title: {
      fontSize: isGrid ? 14 : 17,
      fontWeight: '700',
      color: colors.text,
      lineHeight: isGrid ? 19 : 23,
      letterSpacing: -0.2,
    },
    description: {
      fontSize: 13.5,
      color: colors.textSecondary,
      marginTop: 6,
      lineHeight: 19,
    },
    meta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: isGrid ? 8 : 10,
    },
    sourceBadge: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      maxWidth: '60%',
    },
    sourceText: {
      fontSize: 11.5,
      fontWeight: '600',
      color: colors.primary,
    },
    time: {
      fontSize: 11.5,
      color: colors.textTertiary,
    },
  });
}
