import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts } from '../constants/theme';

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/(auth)/login');
        }, 3000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Karto</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontSize: 80,
        color: Colors.primary,
        fontFamily: Fonts.MPlusRegular,
    },
});
