import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppData, defaultActivities, defaultEducation, defaultProfileData, defaultSkills, loadAppData, saveAppData } from '../storage';

type AppDataContextValue = {
  data: AppData;
  loading: boolean;
  setProfile: (profile: AppData['profile']) => void;
  setSkills: (skills: AppData['skills']) => void;
  setEducation: (education: AppData['education']) => void;
  setActivities: (activities: AppData['activities']) => void;
  saveData: (targetData?: AppData) => Promise<void>;
};

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

const defaultAppData: AppData = {
  profile: defaultProfileData,
  skills: defaultSkills,
  education: defaultEducation,
  activities: defaultActivities,
};

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(defaultAppData);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const savedData = await loadAppData();
        if (mounted) {
          setData(savedData);
        }
      } catch (error) {
        console.log('App data load error', error);
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    saveAppData(data).catch((error) => {
      console.log('Failed to persist app data:', error);
    });
  }, [data, initialized]);

  const value = useMemo(
    () => ({
      data,
      loading,
      setProfile: (profile: AppData['profile']) => setData((prev) => ({ ...prev, profile })),
      setSkills: (skills: AppData['skills']) => setData((prev) => ({ ...prev, skills })),
      setEducation: (education: AppData['education']) => setData((prev) => ({ ...prev, education })),
      setActivities: (activities: AppData['activities']) => setData((prev) => ({ ...prev, activities })),
      saveData: async (targetData?: AppData) => {
        await saveAppData(targetData ?? data);
      },
    }),
    [data, loading]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
