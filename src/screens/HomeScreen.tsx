import React, {useMemo, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ThemeColors} from '../theme/colors';
import {useAppTheme} from '../theme/ThemeContext';
import {useNews} from '../hooks/useNews';
import {ArticleCard} from '../components/ArticleCard';
import {SkeletonList} from '../components/SkeletonCard';
import {CategoryChips} from '../components/CategoryChips';
import {SearchBar} from '../components/SearchBar';
import {NewsArticle} from '../services/guardianApi';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const {colors, isDark, toggleTheme} = useAppTheme();
  const {width, height} = useWindowDimensions();
  
  // A true tablet in landscape has a large width AND a sufficient height (>= 480).
  // A phone in landscape might have a large width but a tiny height (< 450).
  const columns = (width >= 800 && height >= 480) ? 3 : width >= 600 ? 2 : 1;

  const {
    articles,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    hasMore,
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
    loadMore,
    refresh,
    retry,
  } = useNews();

  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleArticlePress = useCallback(
    (article: NewsArticle) => {
      navigation.navigate('Article', {article});
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({item}: {item: NewsArticle}) => (
      <ArticleCard
        article={item}
        onPress={handleArticlePress}
        columns={columns}
      />
    ),
    [handleArticlePress, columns],
  );

  const keyExtractor = useCallback(
    (item: NewsArticle, index: number) => `${item.id}-${index}`,
    [],
  );

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [isLoadingMore, styles, colors]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={styles.empty}>
        <MaterialCommunityIcons name="mailbox-open-outline" size={48} color={colors.textSecondary} style={styles.emptyIcon} />
        <Text style={styles.emptyText}>No articles found</Text>
        <Text style={styles.emptySubtext}>
          Try a different search or category
        </Text>
      </View>
    );
  }, [isLoading, styles]);

  if (error && articles.length === 0) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.error} style={styles.errorIcon} />
        <Text style={styles.errorText}>Unable to load news</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={retry}
          activeOpacity={0.8}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons name="newspaper-variant" size={28} color={colors.text} style={{marginRight: 8}} />
            <Text
              style={styles.headerTitle}
              allowFontScaling
              maxFontSizeMultiplier={1.5}>
              NewsFlip
            </Text>
          </View>
          <Text
            style={styles.headerSubtitle}
            allowFontScaling
            maxFontSizeMultiplier={1.5}>
            Stay informed
          </Text>
        </View>
        <TouchableOpacity
          style={styles.themeToggle}
          onPress={toggleTheme}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Toggle dark mode">
          <MaterialCommunityIcons
            name={isDark ? "weather-sunny" : "weather-night"}
            size={24}
            color={isDark ? colors.text : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* Categories */}
      {!searchQuery && (
        <CategoryChips active={category} onChange={setCategory} />
      )}

      {/* Content */}
      {isLoading ? (
        <SkeletonList count={6} columns={columns} />
      ) : (
        <FlatList
          key={columns}
          data={articles}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={columns}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refresh}
              tintColor={colors.refreshControl}
              colors={[colors.refreshControl]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 4,
      backgroundColor: colors.headerBackground,
    },
    themeToggle: {
      padding: 8,
      backgroundColor: colors.surfaceVariant,
      borderRadius: 20,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    listContent: {
      paddingBottom: 20,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 16,
      gap: 8,
    },
    loadingMoreText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    empty: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 80,
    },
    emptyIcon: {
      marginBottom: 12,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    errorIcon: {
      marginBottom: 16,
    },
    errorText: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 6,
    },
    errorSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 24,
      textAlign: 'center',
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 12,
    },
    retryText: {
      color: '#FFF',
      fontSize: 15,
      fontWeight: '700',
    },
  });
}
