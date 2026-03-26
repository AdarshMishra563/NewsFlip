import {useState, useEffect, useCallback, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchGuardianNews,
  NewsArticle,
  FetchNewsResult,
} from '../services/guardianApi';

const CACHE_KEY = 'cachedNews';

interface UseNewsState {
  articles: NewsArticle[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
}

export function useNews() {
  const [state, setState] = useState<UseNewsState>({
    articles: [],
    isLoading: true,
    isRefreshing: false,
    isLoadingMore: false,
    error: null,
    hasMore: true,
  });

  const [category, setCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const pageRef = useRef(1);
  const totalPagesRef = useRef(1);

  // Debounce search query (400ms)
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Save to cache
  const saveToCache = useCallback(async (articles: NewsArticle[]) => {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(articles));
    } catch {}
  }, []);

  // Load from cache
  const loadFromCache = useCallback(async (): Promise<NewsArticle[]> => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}
    return [];
  }, []);

  // Fetch articles
  const fetchArticles = useCallback(
    async (page: number, isRefresh: boolean = false) => {
      try {
        const result: FetchNewsResult = await fetchGuardianNews({
          page,
          query: debouncedQuery || undefined,
          category: debouncedQuery ? undefined : category,
        });

        pageRef.current = result.page;
        totalPagesRef.current = result.totalPages;

        setState(prev => {
          const newArticles =
            page === 1 || isRefresh
              ? result.articles
              : [...prev.articles, ...result.articles];

          // Cache first page results
          if (page === 1) {
            saveToCache(newArticles);
          }

          return {
            articles: newArticles,
            isLoading: false,
            isRefreshing: false,
            isLoadingMore: false,
            error: null,
            hasMore: result.page < result.totalPages,
          };
        });
      } catch (err: any) {
        // Try loading from cache on error
        if (page === 1) {
          const cached = await loadFromCache();
          if (cached.length > 0) {
            setState({
              articles: cached,
              isLoading: false,
              isRefreshing: false,
              isLoadingMore: false,
              error: null,
              hasMore: false,
            });
            return;
          }
        }

        setState(prev => ({
          ...prev,
          isLoading: false,
          isRefreshing: false,
          isLoadingMore: false,
          error: err.message || 'Unable to load news',
        }));
      }
    },
    [category, debouncedQuery, saveToCache, loadFromCache],
  );

  // Initial load & when category/query changes
  useEffect(() => {
    pageRef.current = 1;
    setState(prev => ({
      ...prev,
      articles: [],
      isLoading: true,
      error: null,
      hasMore: true,
    }));
    fetchArticles(1);
  }, [fetchArticles]);

  // Load more (infinite scroll)
  const loadMore = useCallback(() => {
    if (state.isLoadingMore || !state.hasMore || state.isLoading) {
      return;
    }
    const nextPage = pageRef.current + 1;
    setState(prev => ({...prev, isLoadingMore: true}));
    fetchArticles(nextPage);
  }, [state.isLoadingMore, state.hasMore, state.isLoading, fetchArticles]);

  // Pull to refresh
  const refresh = useCallback(() => {
    pageRef.current = 1;
    setState(prev => ({...prev, isRefreshing: true, hasMore: true}));
    fetchArticles(1, true);
  }, [fetchArticles]);

  // Retry on error
  const retry = useCallback(() => {
    pageRef.current = 1;
    setState(prev => ({
      ...prev,
      articles: [],
      isLoading: true,
      error: null,
      hasMore: true,
    }));
    fetchArticles(1);
  }, [fetchArticles]);

  return {
    ...state,
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
    loadMore,
    refresh,
    retry,
  };
}
