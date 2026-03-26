import React, {useEffect, useRef, useMemo} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {ThemeColors} from '../theme/colors';
import {useAppTheme} from '../theme/ThemeContext';

interface SkeletonCardProps {
  columns: number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({columns}) => {
  const {colors} = useAppTheme();
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [animValue]);

  const opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const isGrid = columns > 1;
  const styles = useMemo(() => createStyles(colors, isGrid), [colors, isGrid]);

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.image, {opacity}]} />
      <View style={styles.content}>
        <Animated.View style={[styles.titleLine, {opacity}]} />
        <Animated.View style={[styles.titleLineShort, {opacity}]} />
        {!isGrid && <Animated.View style={[styles.descLine, {opacity}]} />}
        <View style={styles.metaRow}>
          <Animated.View style={[styles.badge, {opacity}]} />
          <Animated.View style={[styles.timeBadge, {opacity}]} />
        </View>
      </View>
    </View>
  );
};

function createStyles(colors: ThemeColors, isGrid: boolean) {
  return StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      marginHorizontal: isGrid ? 6 : 16,
      marginVertical: 8,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    image: {
      width: '100%',
      height: isGrid ? 120 : 200,
      backgroundColor: colors.skeleton,
    },
    content: {
      padding: isGrid ? 10 : 14,
    },
    titleLine: {
      height: 14,
      width: '90%',
      backgroundColor: colors.skeleton,
      borderRadius: 6,
      marginBottom: 8,
    },
    titleLineShort: {
      height: 14,
      width: '60%',
      backgroundColor: colors.skeleton,
      borderRadius: 6,
      marginBottom: 8,
    },
    descLine: {
      height: 12,
      width: '80%',
      backgroundColor: colors.skeleton,
      borderRadius: 6,
      marginBottom: 8,
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    badge: {
      height: 18,
      width: 60,
      backgroundColor: colors.skeleton,
      borderRadius: 6,
    },
    timeBadge: {
      height: 14,
      width: 40,
      backgroundColor: colors.skeleton,
      borderRadius: 6,
    },
  });
}

interface SkeletonListProps {
  count?: number;
  columns: number;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 6,
  columns,
}) => {
  const rows = Math.ceil(count / columns);
  return (
    <View style={listStyles.container}>
      {Array.from({length: rows}).map((_, rowIdx) => (
        <View key={rowIdx} style={listStyles.row}>
          {Array.from({length: columns}).map((__, colIdx) => (
            <SkeletonCard key={`${rowIdx}-${colIdx}`} columns={columns} />
          ))}
        </View>
      ))}
    </View>
  );
};

const listStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
  },
});
