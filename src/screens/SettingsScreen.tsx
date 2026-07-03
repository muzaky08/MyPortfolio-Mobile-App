import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  IconButton,
  List,
  Menu,
  Subheading,
  TextInput,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppData } from '../context/AppDataContext';
import { DAYS_OF_WEEK } from '../constants/days';
import type { RootStackParamList } from '../navigation';
import type { ActivityItem, EducationItem, ProfileData } from '../storage';
import { useThemeMode } from '../context/ThemeContext';
import { colors, getScreenColors } from '../theme';

export default function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data, setProfile, setSkills, setEducation, setActivities, saveData } = useAppData();
  const { isDarkMode } = useThemeMode();
  const screenColors = getScreenColors(isDarkMode);

  const [profile, setLocalProfile] = useState<ProfileData>(data.profile);
  const [skills, setLocalSkills] = useState<string[]>(data.skills);
  const [newSkill, setNewSkill] = useState('');
  const [education, setLocalEducation] = useState<EducationItem[]>(data.education);
  const [newActivity, setNewActivity] = useState('');
  const [selectedDay, setSelectedDay] = useState<string>(DAYS_OF_WEEK[0]);
  const [dayMenuVisible, setDayMenuVisible] = useState(false);
  const [activities, setLocalActivities] = useState<ActivityItem[]>(data.activities);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalProfile(data.profile);
    setLocalSkills(data.skills);
    setLocalEducation(data.education);
    setLocalActivities(data.activities);
  }, [data]);

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    setLocalSkills((prev) => [...prev, trimmed]);
    setNewSkill('');
  };

  const removeSkill = (index: number) => {
    setLocalSkills((prev) => prev.filter((_, idx) => idx !== index));
  };

  const updateEducation = (index: number, field: keyof EducationItem, value: string) => {
    setLocalEducation((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const addActivity = () => {
    const trimmed = newActivity.trim();
    if (!trimmed) return;
    setLocalActivities((prev) => [
      ...prev,
      { id: String(Date.now()), day: selectedDay, task: trimmed },
    ]);
    setNewActivity('');
  };

  const removeActivity = (id: string) => {
    setLocalActivities((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { profile, skills, education, activities };
    setProfile(profile);
    setSkills(skills);
    setEducation(education);
    setActivities(activities);

    try {
      await saveData(payload);
      Alert.alert('Sukses', 'Semua perubahan berhasil disimpan.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Gagal', 'Tidak dapat menyimpan data. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const inputTheme = useMemo(
    () => ({
      colors: {
        onSurfaceVariant: screenColors.textSecondary,
      },
    }),
    [screenColors.textSecondary]
  );

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: screenColors.background }]}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <List.Section>
        <List.Subheader style={{ color: screenColors.text }}>Edit Biodata & Keahlian</List.Subheader>
        <Card style={[styles.sectionCard, { backgroundColor: screenColors.surface }]} mode="elevated">
          <Card.Content>
            <TextInput
              mode="outlined"
              label="Nama Lengkap"
              value={profile.name}
              onChangeText={(text) => setLocalProfile({ ...profile, name: text })}
              style={styles.input}
              theme={inputTheme}
            />
            <TextInput
              mode="outlined"
              label="Email"
              value={profile.email}
              onChangeText={(text) => setLocalProfile({ ...profile, email: text })}
              style={styles.input}
              keyboardType="email-address"
              theme={inputTheme}
            />
            <TextInput
              mode="outlined"
              label="Alamat"
              value={profile.address}
              onChangeText={(text) => setLocalProfile({ ...profile, address: text })}
              style={styles.input}
              multiline
              theme={inputTheme}
            />
            <TextInput
              mode="outlined"
              label="Tentang Saya"
              value={profile.about}
              onChangeText={(text) => setLocalProfile({ ...profile, about: text })}
              style={styles.input}
              multiline
              numberOfLines={4}
              theme={inputTheme}
            />
            <TextInput
              mode="outlined"
              label="URL Foto Profil"
              value={profile.photo}
              onChangeText={(text) => setLocalProfile({ ...profile, photo: text })}
              style={styles.input}
              placeholder="https://..."
              theme={inputTheme}
            />
            <TextInput
              mode="outlined"
              label="WhatsApp"
              value={profile.whatsapp}
              onChangeText={(text) => setLocalProfile({ ...profile, whatsapp: text })}
              style={styles.input}
              theme={inputTheme}
            />
            <TextInput
              mode="outlined"
              label="Instagram"
              value={profile.instagram}
              onChangeText={(text) => setLocalProfile({ ...profile, instagram: text })}
              style={styles.input}
              theme={inputTheme}
            />
            <TextInput
              mode="outlined"
              label="LinkedIn"
              value={profile.linkedin}
              onChangeText={(text) => setLocalProfile({ ...profile, linkedin: text })}
              style={styles.input}
              theme={inputTheme}
            />
            <TextInput
              mode="outlined"
              label="GitHub"
              value={profile.github}
              onChangeText={(text) => setLocalProfile({ ...profile, github: text })}
              style={styles.input}
              theme={inputTheme}
            />

            <View style={styles.row}>
              <TextInput
                mode="outlined"
                label="Tambah Skill Baru"
                value={newSkill}
                onChangeText={setNewSkill}
                style={styles.flexInput}
                theme={inputTheme}
              />
              <Button mode="contained" buttonColor={colors.primary} onPress={addSkill}>
                Add
              </Button>
            </View>
            <View style={styles.chipWrap}>
              {skills.map((skill, index) => (
                <Chip key={`${skill}-${index}`} onClose={() => removeSkill(index)} style={styles.chip}>
                  {skill}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      </List.Section>

      <List.Section>
        <List.Subheader style={{ color: screenColors.text }}>Edit Riwayat Pendidikan</List.Subheader>
        {education.map((item, index) => (
          <Card
            key={item.id}
            style={[styles.sectionCard, { backgroundColor: screenColors.surface }]}
            mode="elevated"
          >
            <Card.Content>
              <Subheading style={{ fontWeight: 'bold', color: screenColors.text, marginBottom: 8 }}>
                {item.level}
              </Subheading>
              <TextInput
                mode="outlined"
                label="Nama Sekolah/Kampus"
                value={item.schoolName}
                onChangeText={(text) => updateEducation(index, 'schoolName', text)}
                style={styles.input}
                theme={inputTheme}
              />
              <TextInput
                mode="outlined"
                label="Tahun Pendidikan"
                value={item.years}
                onChangeText={(text) => updateEducation(index, 'years', text)}
                style={styles.input}
                theme={inputTheme}
              />
              <TextInput
                mode="outlined"
                label="Lokasi"
                value={item.location}
                onChangeText={(text) => updateEducation(index, 'location', text)}
                theme={inputTheme}
              />
            </Card.Content>
          </Card>
        ))}
      </List.Section>

      <List.Section>
        <List.Subheader style={{ color: screenColors.text }}>Kelola Aktivitas Harian</List.Subheader>
        <Card style={[styles.sectionCard, { backgroundColor: screenColors.surface }]} mode="elevated">
          <Card.Content>
            <Menu
              visible={dayMenuVisible}
              onDismiss={() => setDayMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setDayMenuVisible(true)}
                  icon="calendar"
                  style={styles.dayButton}
                >
                  Hari: {selectedDay}
                </Button>
              }
            >
              {DAYS_OF_WEEK.map((day) => (
                <Menu.Item
                  key={day}
                  onPress={() => {
                    setSelectedDay(day);
                    setDayMenuVisible(false);
                  }}
                  title={day}
                />
              ))}
            </Menu>

            <View style={styles.row}>
              <TextInput
                mode="outlined"
                label="Input Aktivitas Baru..."
                value={newActivity}
                onChangeText={setNewActivity}
                style={styles.flexInput}
                theme={inputTheme}
              />
              <Button mode="contained" buttonColor={colors.primary} onPress={addActivity}>
                Add
              </Button>
            </View>

            {activities.map((item) => (
              <List.Item
                key={item.id}
                title={item.task}
                description={item.day}
                titleStyle={{ color: screenColors.text }}
                descriptionStyle={{ color: screenColors.textSecondary }}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="delete"
                    iconColor={colors.error}
                    onPress={() => removeActivity(item.id)}
                  />
                )}
              />
            ))}
          </Card.Content>
        </Card>
      </List.Section>

      <Button
        mode="contained"
        icon="content-save"
        buttonColor={colors.success}
        style={styles.saveButton}
        onPress={handleSave}
        loading={saving}
        disabled={saving}
      >
        SIMPAN SEMUA PERUBAHAN
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { padding: 15, paddingBottom: 30 },
  sectionCard: { marginBottom: 12, borderRadius: 12 },
  input: { marginBottom: 10 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 10 },
  flexInput: { flex: 1 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { margin: 2 },
  dayButton: { marginBottom: 12, alignSelf: 'flex-start' },
  saveButton: { marginVertical: 30, paddingVertical: 6 },
});
