import React, { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Chip,
  Divider,
  Icon,
  IconButton,
  List,
  Menu,
  Modal,
  Paragraph,
  Portal,
  Switch,
  Text,
  Title,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import type { RootStackParamList } from '../navigation';
import { useAppData } from '../context/AppDataContext';
import { useThemeMode } from '../context/ThemeContext';
import { colors, getScreenColors } from '../theme';

type SocialKey = 'whatsapp' | 'instagram' | 'linkedin' | 'github';

const SOCIAL_ITEMS: { key: SocialKey; label: string; icon: string; color: string }[] = [
  { key: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', color: '#25D366' },
  { key: 'instagram', label: 'Instagram', icon: 'instagram', color: '#E4405F' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'linkedin', color: '#0A66C2' },
  { key: 'github', label: 'GitHub', icon: 'github', color: '#333333' },
];

const AVATAR_SIZE = 104;
const AVATAR_RING = AVATAR_SIZE + 8;

function InfoRow({
  icon,
  label,
  value,
  onPress,
  valueColor,
}: {
  icon: string;
  label: string;
  value: string;
  onPress?: () => void;
  valueColor?: string;
}) {
  const { isDarkMode } = useThemeMode();
  const screenColors = getScreenColors(isDarkMode);

  return (
    <Pressable onPress={onPress} disabled={!onPress} style={styles.infoRow}>
      <View style={[styles.infoIconWrap, { backgroundColor: isDarkMode ? colors.borderDark : '#eef4ff' }]}>
        <Icon source={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.infoTextWrap}>
        <Text style={[styles.infoLabel, { color: screenColors.textSecondary }]}>{label}</Text>
        <Text
          style={[styles.infoValue, { color: valueColor ?? screenColors.text }, onPress && styles.infoLink]}
          numberOfLines={2}
        >
          {value}
        </Text>
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data, setProfile, saveData } = useAppData();
  const { isDarkMode, toggleDarkMode } = useThemeMode();
  const [menuVisible, setMenuVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const profile = data.profile;
  const screenColors = getScreenColors(isDarkMode);

  const copyToClipboard = async (value: string, label: string) => {
    await Clipboard.setStringAsync(value);
    Alert.alert('Disalin', `${label} berhasil disalin ke clipboard.`);
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${profile.email}`).catch(() => {
      copyToClipboard(profile.email, 'Email');
    });
  };

  const handleLogout = () => {
    setMenuVisible(false);
    Alert.alert('Keluar Aplikasi', 'Apakah Anda yakin ingin logout?', [
      { text: 'Tidak', style: 'cancel' },
      {
        text: 'Ya',
        style: 'destructive',
        onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }),
      },
    ]);
  };

  const updateProfilePhoto = async (photoUri: string) => {
    const updatedProfile = { ...profile, photo: photoUri };
    setProfile(updatedProfile);
    await saveData({ ...data, profile: updatedProfile });
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Izin ditolak', 'Aplikasi membutuhkan izin untuk mengakses galeri.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets.length > 0) {
      await updateProfilePhoto(result.assets[0].uri);
      setPhotoModalVisible(false);
      Alert.alert('Berhasil', 'Foto profil berhasil diperbarui.');
    }
  };

  const removePhoto = async () => {
    await updateProfilePhoto('');
    setPhotoModalVisible(false);
    Alert.alert('Berhasil', 'Foto profil dihapus.');
  };

  return (
    <View style={[styles.root, { backgroundColor: screenColors.background }]}>
      <ScreenHeader
        left={
          <View style={styles.headerLeft}>
            <IconButton
              icon={isDarkMode ? 'weather-night' : 'weather-sunny'}
              iconColor={colors.white}
              size={22}
              style={styles.headerIcon}
              onPress={toggleDarkMode}
            />
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} color={colors.white} />
          </View>
        }
        right={
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="menu"
                iconColor={colors.white}
                size={24}
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Settings');
              }}
              title="Settings (CRUD)"
              leadingIcon="cog"
            />
            <Menu.Item
              onPress={handleLogout}
              title="Logout"
              leadingIcon="logout"
              titleStyle={{ color: colors.error }}
            />
          </Menu>
        }
      />

      <SafeAreaView style={styles.flex} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero profil */}
        <Card style={[styles.card, { backgroundColor: screenColors.surface }]} mode="elevated">
          <View style={[styles.heroBanner, { backgroundColor: colors.primary }]} />
          <View style={styles.heroBody}>
            <View style={[styles.avatarRing, { borderColor: colors.primary, backgroundColor: screenColors.surface }]}>
              <Avatar.Image
                size={AVATAR_SIZE}
                source={profile.photo ? { uri: profile.photo } : require('../../assets/MYP.png')}
                style={styles.avatar}
              />
              <IconButton
                icon="camera"
                size={18}
                iconColor={colors.white}
                style={styles.cameraBtn}
                onPress={() => setPhotoModalVisible(true)}
              />
            </View>
            <Title style={[styles.name, { color: screenColors.text }]}>{profile.name}</Title>
            <Chip icon="school" style={styles.statusChip} textStyle={styles.statusChipText} compact>
              Mahasiswa Aktif — UYM
            </Chip>
          </View>
        </Card>

        <Card style={[styles.card, { backgroundColor: screenColors.surface }]} mode="elevated">
          <Card.Title
            title="Data Pribadi"
            titleStyle={[styles.cardTitle, { color: screenColors.text }]}
            left={(props) => <List.Icon {...props} icon="account-details" color={colors.primary} />}
          />
          <Card.Content>
            <InfoRow icon="email-outline" label="Email" value={profile.email} onPress={handleEmailPress} valueColor={colors.primary} />
            <Divider style={styles.divider} />
            <InfoRow icon="map-marker-outline" label="Alamat" value={profile.address} />
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: screenColors.surface }]} mode="elevated">
          <Card.Title
            title="Tentang Saya"
            titleStyle={[styles.cardTitle, { color: screenColors.text }]}
            left={(props) => <List.Icon {...props} icon="text-account" color={colors.primary} />}
          />
          <Card.Content>
            <Paragraph style={[styles.aboutText, { color: screenColors.textSecondary }]}>
              {profile.about || 'Belum ada deskripsi. Edit melalui halaman Settings.'}
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: screenColors.surface }]} mode="elevated">
          <Card.Title
            title="Keahlian / Skills"
            titleStyle={[styles.cardTitle, { color: screenColors.text }]}
            left={(props) => <List.Icon {...props} icon="star-outline" color={colors.primary} />}
          />
          <Card.Content style={styles.chipContainer}>
            {data.skills.map((skill) => (
              <Chip
                key={skill}
                style={[styles.skillChip, { backgroundColor: isDarkMode ? colors.borderDark : '#eef4ff' }]}
                textStyle={{ color: screenColors.text, fontSize: 13 }}
              >
                {skill}
              </Chip>
            ))}
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: screenColors.surface }]} mode="elevated">
          <Card.Title
            title="Sosial Media"
            titleStyle={[styles.cardTitle, { color: screenColors.text }]}
            left={(props) => <List.Icon {...props} icon="share-variant" color={colors.primary} />}
          />
          <Card.Content>
            <Text style={[styles.socialHint, { color: screenColors.textSecondary }]}>
              Tekan untuk buka · Tekan lama untuk salin link
            </Text>
            <View style={styles.socialGrid}>
              {SOCIAL_ITEMS.map((item) => (
                <Pressable
                  key={item.key}
                  onLongPress={() => copyToClipboard(profile[item.key], item.label)}
                  onPress={() => Linking.openURL(profile[item.key]).catch(() => {})}
                  style={({ pressed }) => [
                    styles.socialButton,
                    {
                      backgroundColor: isDarkMode ? colors.borderDark : '#f8fafc',
                      borderColor: isDarkMode ? colors.border : '#e2e8f0',
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}
                >
                  <Icon source={item.icon} size={26} color={item.color} />
                  <Text variant="labelMedium" style={{ color: screenColors.text, marginTop: 6 }}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <Portal>
        <Modal
          visible={photoModalVisible}
          onDismiss={() => setPhotoModalVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: screenColors.surface }]}
        >
          <Title style={{ color: screenColors.text, marginBottom: 8 }}>Foto Profil</Title>
          <Paragraph style={{ color: screenColors.textSecondary, marginBottom: 16 }}>
            Pilih gambar dari galeri (PNG/JPG) atau hapus foto saat ini.
          </Paragraph>
          <Button mode="contained" buttonColor={colors.primary} onPress={pickImage} icon="image-plus" style={styles.modalBtn}>
            Ganti Foto
          </Button>
          <Button mode="outlined" onPress={removePhoto} icon="delete-outline" textColor={colors.error} style={styles.modalBtn}>
            Hapus Foto
          </Button>
          <Button onPress={() => setPhotoModalVisible(false)} style={styles.modalBtn}>
            Batal
          </Button>
        </Modal>
      </Portal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { margin: 0 },
  scrollContent: { padding: 15, paddingBottom: 28 },
  card: { marginBottom: 14, borderRadius: 16, overflow: 'hidden' },
  heroBanner: { height: 80, width: '100%' },
  heroBody: { alignItems: 'center', marginTop: -(AVATAR_RING / 2), paddingBottom: 20, paddingHorizontal: 16 },
  avatarRing: {
    width: AVATAR_RING,
    height: AVATAR_RING,
    borderRadius: AVATAR_RING / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatar: { backgroundColor: colors.white },
  cameraBtn: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    margin: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
  },
  name: { fontWeight: 'bold', fontSize: 22, textAlign: 'center', marginBottom: 4 },
  statusChip: { backgroundColor: '#e8f0fe' },
  statusChipText: { color: colors.primary, fontSize: 12 },
  cardTitle: { fontWeight: '700', fontSize: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextWrap: { flex: 1 },
  infoLabel: { fontSize: 11, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.4 },
  infoValue: { fontSize: 14, fontWeight: '500' },
  infoLink: { textDecorationLine: 'underline' },
  divider: { marginVertical: 2 },
  aboutText: { lineHeight: 22, fontSize: 14, textAlign: 'justify' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: { marginBottom: 2 },
  socialHint: { fontSize: 12, marginBottom: 12, fontStyle: 'italic' },
  socialGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  socialButton: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  modal: { margin: 24, padding: 20, borderRadius: 16 },
  modalBtn: { marginBottom: 8 },
});
