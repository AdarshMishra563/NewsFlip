import React, {useMemo} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ThemeColors} from '../theme/colors';
import {useAppTheme} from '../theme/ThemeContext';
import {NewsArticle} from '../services/guardianApi';

interface ArticleScreenProps {
  route: {params: {article: NewsArticle}};
  navigation: any;
}

export const ArticleScreen: React.FC<any> = ({
  route,
  navigation,
}) => {
  const {article} = route.params as {article: NewsArticle};
  const {colors} = useAppTheme();
  const {width} = useWindowDimensions();
  const isWide = width >= 600;
  const styles = useMemo(
    () => createStyles(colors, isWide),
    [colors, isWide],
  );

  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  );

  const formattedTime = new Date(article.publishedAt).toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  );

  const openInBrowser = () => {
    Linking.openURL(article.url);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces
        contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        {article.image ? (
          <Image
            source={{uri: article.image}}
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <MaterialCommunityIcons name="image-off-outline" size={64} color={colors.textTertiary} />
          </View>
        )}

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Source Badge */}
          <View style={styles.sourceBadge}>
            <Text style={styles.sourceText}>{article.source}</Text>
          </View>

          {/* Title */}
          <Text
            style={styles.title}
            allowFontScaling
            maxFontSizeMultiplier={1.5}>
            {article.title}
          </Text>

          {/* Date & Time */}
          <View style={styles.dateRow}>
            {article.author ? (
              <View style={styles.iconRow}>
                <MaterialCommunityIcons name="pencil-outline" size={15} color={colors.textSecondary} />
                <Text style={styles.authorText}>{article.author}</Text>
              </View>
            ) : null}
            <View style={styles.iconRow}>
              <MaterialCommunityIcons name="calendar-blank" size={15} color={colors.textSecondary} />
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
            <View style={styles.iconRow}>
              <MaterialCommunityIcons name="clock-outline" size={15} color={colors.textSecondary} />
              <Text style={styles.timeText}>{formattedTime}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          {article.description ? (
            <Text
              style={styles.description}
              allowFontScaling
              maxFontSizeMultiplier={1.5}>
              {article.description}
            </Text>
          ) : (
            <Text style={styles.noDescription}>
              No additional details available. Tap below to read the full
              article.
            </Text>
          )}

          {/* Open in Browser Button */}
          <TouchableOpacity
            style={styles.openButton}
            onPress={openInBrowser}
            activeOpacity={0.85}
            accessibilityRole="link"
            accessibilityLabel="Read full article in browser">
          <View style={styles.iconRow}>
            <MaterialCommunityIcons name="web" size={20} color="#FFF" style={{marginRight: 8}} />
            <Text style={styles.openButtonText}>Read Full Article</Text>
          </View>
        </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Back button overlay */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Go back">
        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

function createStyles(colors: ThemeColors, isWide: boolean) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    heroImage: {
      width: '100%',
      height: isWide ? 350 : 260,
      backgroundColor: colors.surfaceVariant,
    },
    image: {
      width: '100%',
      height: isWide ? 350 : 260,
    },
    placeholderImage: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceVariant,
    },
    contentContainer: {
      padding: isWide ? 32 : 20,
      maxWidth: isWide ? 720 : undefined,
      alignSelf: isWide ? 'center' : undefined,
      width: isWide ? '100%' : undefined,
    },
    sourceBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 8,
      marginBottom: 14,
    },
    sourceText: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    title: {
      fontSize: isWide ? 28 : 24,
      fontWeight: '800',
      color: colors.text,
      lineHeight: isWide ? 36 : 32,
      letterSpacing: -0.3,
      marginBottom: 14,
    },
    dateRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 16,
      rowGap: 8,
    },
    iconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    authorText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    dateText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    timeText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginBottom: 18,
    },
    description: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 26,
      marginBottom: 28,
    },
    noDescription: {
      fontSize: 15,
      color: colors.textTertiary,
      fontStyle: 'italic',
      lineHeight: 24,
      marginBottom: 28,
    },
    openButton: {
      backgroundColor: colors.primary,
      paddingVertical: 15,
      borderRadius: 14,
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    openButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
    backButton: {
      position: 'absolute',
      top: 50,
      left: 16,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}
