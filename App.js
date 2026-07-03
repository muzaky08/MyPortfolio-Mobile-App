import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EducationScreen from './src/screens/EducationScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import RecipeScreen from './src/screens/RecipeScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { AppDataProvider } from './src/context/AppDataContext';
import { ThemeProvider, useThemeMode } from './src/context/ThemeContext';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { isDarkMode } = useThemeMode();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDarkMode ? '#9ca3af' : '#6b7280',
        tabBarStyle: {
          backgroundColor: isDarkMode ? colors.surfaceDark : colors.white,
          borderTopColor: isDarkMode ? colors.borderDark : colors.border,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Profile') iconName = 'person-circle';
          if (route.name === 'Education') iconName = 'school';
          if (route.name === 'Activity') iconName = 'calendar';
          if (route.name === 'Recipe') iconName = 'restaurant';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      initialRouteName="Profile"
    >
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
      <Tab.Screen name="Education" component={EducationScreen} options={{ title: 'Pendidikan' }} />
      <Tab.Screen name="Activity" component={ActivityScreen} options={{ title: 'Aktivitas' }} />
      <Tab.Screen name="Recipe" component={RecipeScreen} options={{ title: 'Resep' }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isDarkMode, paperTheme } = useThemeMode();
  const navigationTheme = isDarkMode ? NavigationDarkTheme : NavigationDefaultTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <AppDataProvider>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: isDarkMode ? colors.surfaceDark : colors.primary },
              headerTintColor: colors.white,
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen
              name="RecipeDetail"
              component={RecipeDetailScreen}
              options={{ title: 'Detail Resep', headerBackTitle: 'Kembali' }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Settings (CRUD)', headerBackTitle: 'Kembali' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppDataProvider>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
