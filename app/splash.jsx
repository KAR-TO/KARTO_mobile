import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts } from '../constants/theme';

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const loggedIn = await AsyncStorage.getItem('loggedIn');
                const timer = setTimeout(() => {
                    if (loggedIn === 'true') {
                        router.replace('/(tabs)/home');
                    } else {
                        router.replace('/(auth)/login');
                    }
                }, 2000);
                return () => clearTimeout(timer);
            } catch (error) {
                console.log('Auth check error:', error);
                const timer = setTimeout(() => {
                    router.replace('/(auth)/login');
                }, 2000);
                return () => clearTimeout(timer);
            }
        };

        checkAuthStatus();
    }, [router]);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                    <Text style={styles.logoText}>K</Text>
                </View>
            </View>
            <Text style={styles.title}>KARTO</Text>
            <Text style={styles.subtitle}>Mobil Ödəniş Platforması</Text>
            <View style={styles.loadingContainer}>
                <View style={styles.loadingDot} />
                <View style={styles.loadingDot} />
                <View style={styles.loadingDot} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 20,
    },
    logoContainer: {
        marginBottom: 30,
    },
    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },
    logoText: {
        fontSize: 48,
        fontFamily: Fonts.MPlusRegular,
        color: '#fff',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 36,
        color: Colors.primary,
        fontFamily: Fonts.MPlusRegular,
        marginBottom: 8,
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        fontFamily: Fonts.Poppins_Regular,
        marginBottom: 60,
        textAlign: 'center',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    loadingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        opacity: 0.6,
    },
});
