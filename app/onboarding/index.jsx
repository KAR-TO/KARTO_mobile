import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useCallback } from 'react';
import BanknoteIcon from '../../assets/images/banknoteIcon3.png';
import DollarIcon from '../../assets/images/dollarIcon3.png';
import ThunderIcon from '../../assets/images/thunderIcon3.png';
import Onboarding from '../../components/Onboarding';

export default function OnboardingScreen() {
    const router = useRouter();
    const onSkip = useCallback(async () => {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        router.replace('/(auth)/login');
    }, [router]);
    const onDone = useCallback(async () => {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        router.replace('/(auth)/login');
    }, [router]);

    const pages = [
        {
            key: 'welcome',
            title: 'KARTO-ya xoş gəlmisiniz!',
            subtitle: 'İlk hədiyyə kartı satışı üzrə tətbiq - “Karto” - sizə sevdiyiniz brendlər arasında geniş seçim, yaxınlarınız və dostlarınıza isə unudulmaz xatirə bağışlayacaq.',
            image: DollarIcon,
            colors: ['#72ab8eff', '#79dd9aff'],
        },
        {
            key: 'secure',
            title: 'Ödəniş prossesi',
            subtitle: 'Həm Apple/Google Pay, həm də bank kartını məlumatlarını yığaraq kartı əldə edə bilərsiniz. Əgər kartı digər şəxsə alırsınızsa, o da “Karto”-dan qeydiyyatdan keçməlidir.',
            image: ThunderIcon,
            colors: ['#72ab8eff', '#79dd9aff'],

        },
        {
            key: 'fast',
            title: 'Kartdan istifadə',
            subtitle: 'Müəssisədə unikal QR code scan edərək, və hansı kartla (universal və ya fərdi müəssisə) ödəniş ediləciyin seçin. Qismən ödəniş də mövcüddur (bir hissə kartımızla, bir hissə nəğd və ya bank kartı ilə )',
            image: BanknoteIcon,
            colors: ['#72ab8eff', '#79dd9aff'],
        },
    ];

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <Onboarding pages={pages} onSkip={onSkip} onDone={onDone} />
        </>
    );
}

// no styles
