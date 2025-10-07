import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts } from '../../constants/theme';

export default function ClaimGiftScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState('');

  const payload = useMemo(() => {
    try {
      const raw = String(params?.token || '');
      if (!raw) return null;
      const decoded = decodeURIComponent(raw);
      let json = decoded;
      try {
        json = global.atob ? global.atob(decoded) : decoded;
      } catch {}
      return JSON.parse(json);
    } catch {
      return null;
    }
  }, [params?.token]);

  useEffect(() => {
    const handle = async () => {
      try {
        if (!payload) {
          setError('Link etibarlı deyil');
          setProcessing(false);
          return;
        }

        const loggedIn = await AsyncStorage.getItem('loggedIn');
        if (loggedIn !== 'true') {
          router.replace({ pathname: '/(auth)/login', params: { redirect: `/gift-purchase/claim?token=${params?.token}` } });
          return;
        }

        await AsyncStorage.setItem('hasGifts', 'true');
        await AsyncStorage.setItem('lastGift', JSON.stringify(payload));
        router.replace('/(tabs)/profile');
      } catch {
        setError('Aktivləşmə zamanı xəta baş verdi');
      } finally {
        setProcessing(false);
      }
    };
    handle();
  }, [payload, params?.token, router]);

  if (processing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={Colors.primary} />
        <Text style={styles.info}>Hədiyyə aktivləşdirilir...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.error}>{error || 'Yönləndirilir...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  info: {
    marginTop: 10,
    color: Colors.textSecondary,
    fontFamily: Fonts.Poppins_Regular,
  },
  error: {
    color: Colors.error,
    fontFamily: Fonts.Poppins_SemiBold,
  },
});


