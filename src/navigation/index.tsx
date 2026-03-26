import React from 'react';
import {useAppTheme} from '../theme/ThemeContext';
import {NavigationContainer, DefaultTheme, DarkTheme as NavDarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '../screens/HomeScreen';
import {ArticleScreen} from '../screens/ArticleScreen';
import {LightTheme, DarkTheme} from '../theme/colors';

const Stack = createNativeStackNavigator();

const NavigationLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: LightTheme.background,
    card: LightTheme.headerBackground,
    text: LightTheme.text,
    primary: LightTheme.primary,
    border: LightTheme.border,
  },
};

const NavigationDarkTheme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    background: DarkTheme.background,
    card: DarkTheme.headerBackground,
    text: DarkTheme.text,
    primary: DarkTheme.primary,
    border: DarkTheme.border,
  },
};

export const AppNavigator: React.FC = () => {
  const {isDark} = useAppTheme();

  return (
    <NavigationContainer
      theme={isDark ? NavigationDarkTheme : NavigationLightTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Article"
          component={ArticleScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
