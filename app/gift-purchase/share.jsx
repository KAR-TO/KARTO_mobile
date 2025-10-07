import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../../constants/theme';

export default function ShareGiftScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const deepLink = useMemo(() => {
    const token = params?.token || '';
    return `karto://claim?token=${token}`;
  }, [params?.token]);

  const copyLink = async () => {
    await Clipboard.setStringAsync(deepLink);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Hədiyyə linki hazırdır</Text>
        <Text style={styles.subtitle}>Bu linki alıcıya göndərin</Text>

        <View style={styles.linkBox}>
          <Text numberOfLines={2} style={styles.linkText}>{deepLink}</Text>
        </View>

        <TouchableOpacity style={styles.copyBtn} onPress={copyLink}>
          <Text style={styles.copyText}>Linki kopyala</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.replace('/(tabs)/profile')}>
          <Text style={styles.secondaryText}>Profilə keç</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    textAlign: 'center',
    color: Colors.textSecondary,
    fontFamily: Fonts.Poppins_Regular,
  },
  linkBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f7faf8',
  },
  linkText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontFamily: Fonts.Poppins_Regular,
  },
  copyBtn: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  copyText: {
    color: '#fff',
    fontFamily: Fonts.Poppins_SemiBold,
  },
  secondaryBtn: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryText: {
    color: Colors.textPrimary,
    fontFamily: Fonts.Poppins_Regular,
  },
});


