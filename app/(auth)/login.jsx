import AntDesign from '@expo/vector-icons/AntDesign';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    Keyboard,
    StyleSheet, Text, TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CountryDropdown from '../../components/CountryDropdown';
import CustomButton from '../../components/CustomButton';
import { Colors, Fonts } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen() {
    const [toggleSecureEntry, setToggleSecureEntry] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [remember, setRemember] = useState(true);
    const router = useRouter();

    const [password, setPassword] = useState('');
    const countries = [
        { code: '+994', label: 'AZ' },
        { code: '+90', label: 'TR' },
        { code: '+995', label: 'GE' },
        { code: '+7', label: 'RU' },
        { code: '+1', label: 'US' },
    ];
    // const [selectedCountry, setSelectedCountry] = useState(countries[0]);

    // const [phoneNumber, setPhoneNumber] = useState('');

    const [identifier, setIdentifier] = useState(''); // email və ya phone


    const isStrongPassword = useCallback((value) => value.trim().length >= 6, []);
    // const [touched, setTouched] = useState({ password: false, phone: false });
    const [touched, setTouched] = useState({ password: false, identifier: false });


    const passwordError = useMemo(() => {
        if (!touched.password) return '';
        if (!password.trim()) return 'Şifrə daxil edin';
        if (!isStrongPassword(password)) return 'Şifrə ən az 6 simvoldan ibarət olmalıdır';
        return '';
    }, [password, isStrongPassword, touched.password]);

    // const phoneError = useMemo(() => {
    //     if (!touched.phone) return '';
    //     const cc = selectedCountry.code;
    //     if (cc === '+994') {
    //         const validLine = /^\d{9}$/.test(phoneNumber);
    //         if (!validLine) return 'Telefon nömrəsi düzgün formatda deyil (9 rəqəm)';
    //         return '';
    //     }
    //     const validGeneric = /^\d{7,12}$/.test(phoneNumber);
    //     if (!validGeneric) return 'Telefon nömrəsi düzgün formatda deyil';
    //     return '';
    // }, [phoneNumber, selectedCountry.code, touched.phone]);

    const identifierError = useMemo(() => {
        if (!touched.identifier) return '';

        const isEmail = identifier.includes('@');
        if (isEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(identifier)) return 'Email düzgün formatda deyil';
            return '';
        }

        const validPhone = /^\d{7,12}$/.test(identifier);
        if (!validPhone) return 'Telefon nömrəsi düzgün formatda deyil';
        return '';
    }, [identifier, touched.identifier]);



    // const isFormValid = useMemo(() => {
    //     const cc = selectedCountry.code;
    //     const okLine = cc === '+994' ? phoneNumber.length === 9 : phoneNumber.length >= 7;
    //     return !passwordError && !phoneError && okLine && !!password;
    // }, [passwordError, phoneError, phoneNumber, password, selectedCountry.code]);

    const isFormValid = useMemo(() => {
        return !passwordError && !identifierError && !!identifier && !!password;
    }, [passwordError, identifierError, identifier, password]);



    const onBlurPassword = useCallback(() => setTouched((s) => ({ ...s, password: true })), []);
    // const onBlurPhone = useCallback(() => setTouched((s) => ({ ...s, phone: true })), []);

    const onBlurIdentifier = useCallback(() => setTouched((s) => ({ ...s, identifier: true })), []);



    const handleLogin = async () => {
    setTouched({ password: true, identifier: true });

    if (!isFormValid) {
        Alert.alert("Xəta", "Zəhmət olmasa, formu düzgün doldurun.");
        return;
    }

    try {
        setIsSubmitting(true);

        const savedUser = await AsyncStorage.getItem("user");

        if (!savedUser) {
            Alert.alert("Xəta", "İstifadəçi tapılmadı. Qeydiyyatdan keçin.");
            return;
        }

        const user = JSON.parse(savedUser);

        // identifier ya email, ya phone ola bilər
        const matchesEmail = user.email === identifier;
        const matchesPhone = user.phone === identifier;

        if ((matchesEmail || matchesPhone) && user.password === password) {
            await AsyncStorage.setItem("loggedIn", "true"); 
            router.replace("/(tabs)/home/home");
        } else {
            Alert.alert("Xəta", "Email/Telefon və ya şifrə yanlışdır.");
        }
    } catch (error) {
        Alert.alert("Xəta", "Daxil olmaq alınmadı.");
    } finally {
        setIsSubmitting(false);
    }
};


    const goToRegister = () => router.replace('/(auth)/register');

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1, padding: 20 }}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                extraScrollHeight={20}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Xoş gəldiniz!</Text>
                    </View>

                    <View style={styles.context}>
                        {/* Phone */}
                        {/* <View style={styles.inputContainer}>
                            <Text style={styles.label}>Telefon nömrə</Text>
                            <View style={styles.inputWrapper}>
                                <CountryDropdown
                                    countries={countries}
                                    selectedCountry={selectedCountry}
                                    onSelect={setSelectedCountry}
                                />

                                <TextInput
                                    placeholder={selectedCountry.code === '+994' ? '501234567' : '7-12 rəqəm'}
                                    placeholderTextColor={Colors.placeholder}
                                    keyboardType="number-pad"
                                    style={[styles.input, { flex: 1 }]}
                                    value={phoneNumber}
                                    onChangeText={(text) => {
                                        const max = selectedCountry.code === '+994' ? 9 : 12;
                                        const digits = text.replace(/\D/g, '').slice(0, max);
                                        setPhoneNumber(digits);
                                    }}
                                    onBlur={onBlurPhone}
                                    maxLength={selectedCountry.code === '+994' ? 9 : 12}
                                />
                            </View>
                            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
                        </View> */}

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email və ya Telefon</Text>
                            <TextInput
                                placeholder="Email və ya telefon nömrə daxil edin"
                                placeholderTextColor={Colors.placeholder}
                                keyboardType="default"
                                style={[styles.input]}
                                value={identifier}
                                onChangeText={setIdentifier}
                                onBlur={onBlurIdentifier}
                            />
                            {identifierError ? <Text style={styles.errorText}>{identifierError}</Text> : null}
                        </View>

                        {/* Password */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Şifrə</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="********"
                                    placeholderTextColor={Colors.placeholder}
                                    keyboardType="default"
                                    style={styles.input}
                                    secureTextEntry={toggleSecureEntry}
                                    onBlur={onBlurPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity
                                    style={styles.iconWrapper}
                                    onPress={() => setToggleSecureEntry(!toggleSecureEntry)}
                                >
                                    <AntDesign
                                        name={toggleSecureEntry ? 'eye' : 'eye-invisible'}
                                        size={20}
                                        color={Colors.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                        </View>

                        {/* Remember me */}
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                            <Checkbox
                                value={remember}
                                onValueChange={setRemember}
                                color={remember ? Colors.primary : undefined}
                            />
                            <Text style={{ marginLeft: 8, color: Colors.textSecondary, fontFamily: Fonts.Poppins_Regular }}>
                                Məni xatırla
                            </Text>
                        </View> */}
                    </View>

                    {/* Buttons */}
                    <View style={{ marginTop: 24 }}>
                        <CustomButton
                            title="Daxil olmaq"
                            onPress={handleLogin}
                            loading={isSubmitting}
                            disabled={!isFormValid || isSubmitting}
                        />
                    </View>

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>
                            Hesabınız yoxdur?
                        </Text>
                        <TouchableOpacity
                            onPress={goToRegister}
                            style={{ marginLeft: 6 }}
                        >
                            <Text
                                style={{ color: Colors.primary, fontFamily: Fonts.Poppins_SemiBold, fontSize: 17 }}>
                                Qeydiyyatdan keç
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        marginTop: 70,
    },
    headerText: {
        fontSize: 21,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.primary,
    },
    context: {
        marginTop: 30,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 6,
        fontFamily: Fonts.Poppins_SemiBold,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        backgroundColor: '#ffffff',
    },
    phonePrefix: {
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textPrimary,
        marginRight: 6,
    },
    input: {
        flex: 1,
        height: 48,
        fontSize: 14,
        color: Colors.textPrimary,
        fontFamily: Fonts.Poppins_Regular,
        paddingHorizontal: 12,
    },
    iconWrapper: {
        padding: 6,
    },
    errorText: {
        marginTop: 4,
        color: 'red',
        fontSize: 12,
        fontFamily: Fonts.Poppins_Regular,
    },
    registerContainer: {
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerText: {
        color: Colors.textSecondary,
        fontFamily: Fonts.Poppins_Regular,
        fontSize: 15,
    },
});

