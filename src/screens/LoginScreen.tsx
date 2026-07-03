import React, { useMemo, useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Avatar, Button, Card, Icon, IconButton, Text, TextInput, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AUTH_CREDENTIALS, isLoginValid, isPasswordFormatValid, isUsernameFormatValid, PASSWORD_RULES } from '../constants/auth';
import { useThemeMode } from '../context/ThemeContext';
import type { RootStackParamList } from '../navigation';
import { colors, getScreenColors } from '../theme';

function RuleItem({
  label,
  passed,
  touched,
  defaultColor,
}: {
  label: string;
  passed: boolean;
  touched: boolean;
  defaultColor: string;
}) {
  const color = !touched ? defaultColor : passed ? colors.success : colors.error;
  const icon = !touched ? 'circle-outline' : passed ? 'check-circle' : 'close-circle';

  return (
    <View style={styles.ruleRow}>
      <Icon source={icon} size={16} color={color} />
      <Text style={[styles.ruleText, { color }]}>{label}</Text>
    </View>
  );
}

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Login'>>();
  const { isDarkMode, toggleDarkMode } = useThemeMode();
  const screenColors = getScreenColors(isDarkMode);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const usernameValid = useMemo(() => isUsernameFormatValid(username), [username]);
  const passwordRulesStatus = useMemo(
    () => PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(password) })),
    [password]
  );
  const passwordValid = useMemo(() => isPasswordFormatValid(password), [password]);

  const showUsernameFeedback = touched.username || submitAttempted;
  const showPasswordFeedback = touched.password || submitAttempted;

  const handleLogin = () => {
    setSubmitAttempted(true);
    setTouched({ username: true, password: true });

    if (!isLoginValid(username, password)) {
      Alert.alert(
        'Login Gagal',
        'Username atau password salah. Pastikan NIM dan sandi sesuai ketentuan keamanan.',
        [{ text: 'Coba Lagi' }]
      );
      return;
    }

    Alert.alert('Login Berhasil', `Selamat datang! NIM ${AUTH_CREDENTIALS.username} terverifikasi.`, [
      {
        text: 'Masuk',
        onPress: () => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] }),
      },
    ]);
  };

  return (
    <ImageBackground
      source={require('../../assets/BG_SplashScreen.png')}
      style={[styles.background, { backgroundColor: isDarkMode ? colors.backgroundDark : '#eceaf3' }]}
      imageStyle={[styles.backgroundImage, isDarkMode && { opacity: 0.15 }]}
      resizeMode="cover"
    >
      <View
        style={[
          styles.overlay,
          { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.55)' : 'rgba(0, 52, 102, 0.10)' },
        ]}
      />
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <SafeAreaView style={styles.flex}>
        <View style={styles.topBar}>
          <IconButton
            icon={isDarkMode ? 'weather-night' : 'weather-sunny'}
            iconColor={isDarkMode ? colors.white : colors.primary}
            size={26}
            onPress={toggleDarkMode}
            style={[styles.themeBtn, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.85)' }]}
          />
        </View>

        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Card
              style={[styles.card, { backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.96)' : 'rgba(255, 255, 255, 0.96)' }]}
              mode="elevated"
            >
              <Card.Content style={styles.cardContent}>
                <View style={[styles.logoRing, { backgroundColor: isDarkMode ? colors.borderDark : '#e8f0fe' }]}>
                  <Avatar.Image size={88} source={require('../../assets/MYP.png')} style={styles.logo} />
                </View>

                <Title style={[styles.title, { color: isDarkMode ? colors.white : colors.primary }]}>
                  MyPortfolio
                </Title>
                <Text style={[styles.subtitle, { color: screenColors.textSecondary }]}>
                  Masuk dengan NIM untuk melanjutkan
                </Text>

                <TextInput
                  mode="outlined"
                  label="Username (NIM)"
                  value={username}
                  onChangeText={setUsername}
                  onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
                  left={<TextInput.Icon icon="account-outline" />}
                  right={
                    showUsernameFeedback ? (
                      <TextInput.Icon
                        icon={usernameValid ? 'check-circle' : 'alert-circle'}
                        color={usernameValid ? colors.success : colors.error}
                      />
                    ) : undefined
                  }
                  style={[styles.input, { backgroundColor: isDarkMode ? colors.surfaceDark : colors.white }]}
                  outlineColor={showUsernameFeedback ? (usernameValid ? colors.success : colors.error) : colors.primary}
                  activeOutlineColor={showUsernameFeedback ? (usernameValid ? colors.success : colors.error) : colors.primary}
                  textColor={screenColors.text}
                  keyboardType="number-pad"
                />
                {showUsernameFeedback && (
                  <Text style={[styles.feedback, { color: usernameValid ? colors.success : colors.error }]}>
                    {usernameValid ? 'NIM valid' : `NIM harus ${AUTH_CREDENTIALS.username}`}
                  </Text>
                )}

                <TextInput
                  mode="outlined"
                  label="Password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                  left={<TextInput.Icon icon="lock-outline" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      onPress={() => setShowPassword((prev) => !prev)}
                    />
                  }
                  style={[styles.input, { backgroundColor: isDarkMode ? colors.surfaceDark : colors.white }]}
                  outlineColor={showPasswordFeedback ? (passwordValid ? colors.success : colors.error) : colors.primary}
                  activeOutlineColor={showPasswordFeedback ? (passwordValid ? colors.success : colors.error) : colors.primary}
                  textColor={screenColors.text}
                />

                <View
                  style={[
                    styles.rulesBox,
                    {
                      backgroundColor: isDarkMode ? colors.borderDark : '#f8fafc',
                      borderColor: isDarkMode ? colors.borderDark : '#e2e8f0',
                    },
                  ]}
                >
                  <Text style={[styles.rulesTitle, { color: screenColors.text }]}>Ketentuan Password:</Text>
                  {passwordRulesStatus.map((rule) => (
                    <RuleItem
                      key={rule.id}
                      label={rule.label}
                      passed={rule.passed}
                      touched={showPasswordFeedback}
                      defaultColor={screenColors.textSecondary}
                    />
                  ))}
                </View>

                <Button
                  mode="contained"
                  buttonColor={colors.primary}
                  onPress={handleLogin}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                >
                  LOGIN
                </Button>
              </Card.Content>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  background: { flex: 1 },
  backgroundImage: { resizeMode: 'repeat' },
  overlay: { ...StyleSheet.absoluteFillObject },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 4,
    zIndex: 10,
  },
  themeBtn: { margin: 0 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingVertical: 16,
  },
  card: { borderRadius: 20, elevation: 8 },
  cardContent: { paddingVertical: 8 },
  logoRing: {
    alignSelf: 'center',
    marginBottom: 16,
    padding: 4,
    borderRadius: 50,
  },
  logo: { backgroundColor: colors.white },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 26,
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 22,
    fontSize: 14,
  },
  input: { marginBottom: 6 },
  feedback: { fontSize: 12, marginBottom: 10, marginLeft: 4 },
  rulesBox: {
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    marginBottom: 16,
    borderWidth: 1,
  },
  rulesTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  ruleText: { fontSize: 12, flex: 1, flexWrap: 'wrap' },
  button: { borderRadius: 10 },
  buttonContent: { paddingVertical: 6 },
  buttonLabel: { fontSize: 15, fontWeight: 'bold', letterSpacing: 1 },
});
