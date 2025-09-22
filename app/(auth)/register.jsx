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



export default function RegisterScreen() {
    const [toggleSecureEntry, setToggleSecureEntry] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    // Phone input: country dial + phone number
    const countries = [
        { code: '+994', label: 'AZ' },
        { code: '+90', label: 'TR' },
        { code: '+995', label: 'GE' },
        { code: '+7', label: 'RU' },
        { code: '+1', label: 'US' },
    ];
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const isStrongPassword = useCallback((value) => value.trim().length >= 6, []);
    const [touched, setTouched] = useState({ username: false, password: false, email: false, phone: false });

    const usernameError = useMemo(() => {
        if (!touched.username) return '';
        if (!username.trim()) return 'Tam adınızı daxil edin';
        return '';
    }, [username, touched.username]);

    const passwordError = useMemo(() => {
        if (!touched.password) return '';
        if (!password.trim()) return 'Şifrə daxil edin';
        if (!isStrongPassword(password)) return 'Şifrə ən az 6 simvoldan ibarət olmalıdır';
        return '';
    }, [password, isStrongPassword, touched.password]);

    const emailError = useMemo(() => {
        if (!touched.email) return '';
        if (!email.trim()) return 'Email daxil edin';
        if (!/\S+@\S+\.\S+/.test(email)) return 'Düzgün email formatı daxil edin';
        return '';
    }, [email, touched.email]);

    const phoneError = useMemo(() => {
        if (!touched.phone) return '';
        const cc = selectedCountry.code;
        if (cc === '+994') {
            const validLine = /^\d{9}$/.test(phoneNumber);
            if (!validLine) return 'Telefon nömrəsi düzgün formatda deyil (9 rəqəm)';
            return '';
        }
        // Generic validation for non-AZ: require 7-12 digits
        const validGeneric = /^\d{7,12}$/.test(phoneNumber);
        if (!validGeneric) return 'Telefon nömrəsi düzgün formatda deyil';
        return '';
    }, [phoneNumber, selectedCountry.code, touched.phone]);

    const isFormValid = useMemo(() => {
        return !usernameError && !passwordError && !emailError && !phoneError;
    }, [usernameError, passwordError, emailError, phoneError]);

    const onBlurUserName = useCallback(() => setTouched((s) => ({ ...s, username: true })), []);
    const onBlurPassword = useCallback(() => setTouched((s) => ({ ...s, password: true })), []);
    const onBlurEmail = useCallback(() => setTouched((s) => ({ ...s, email: true })), []);
    const onBlurPhone = useCallback(() => setTouched((s) => ({ ...s, phone: true })), []);

    const handleRegister = async () => {
    setTouched({ username: true, password: true, email: true, phone: true });

    if (!isFormValid) {
        Alert.alert('Xəta', 'Zəhmət olmasa, formu düzgün doldurun.');
        return;
    }

    try {
        setIsSubmitting(true);

        const user = {
            username,
            password,
            email,
            phone: `${selectedCountry.code}${phoneNumber}`
        };

        await AsyncStorage.setItem("user", JSON.stringify(user));

        Alert.alert('Uğur', 'Hesab yaradıldı. Zəhmət olmasa daxil olun.', [
            { text: 'OK', onPress: () => router.replace('/(auth)/login') }
        ]);
    } catch (error) {
        Alert.alert('Xəta', error?.message || 'Qeydiyyat alınmadı.');
    } finally {
        setIsSubmitting(false);
    }
};


    const goToLogin = () => {
        router.replace('/(auth)/login');
    };

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
                        {/* Username */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Tam adınız</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Burada yazın"
                                    placeholderTextColor={Colors.placeholder}
                                    keyboardType="default"
                                    style={styles.input}
                                    onBlur={onBlurUserName}
                                    value={username}
                                    onChangeText={setUsername}
                                />
                            </View>
                            {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
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

                        {/* Email */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Elektron poçt</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="***@gmail.com"
                                    placeholderTextColor={Colors.placeholder}
                                    keyboardType="email-address"
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    onBlur={onBlurEmail}
                                />
                            </View>
                            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                        </View>

                        {/* Phone */}
                        <View style={styles.inputContainer}>
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
                        </View>
                    </View>

                    {/* Terms checkbox */}
                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
                        <Checkbox
                            value={acceptedTerms}
                            onValueChange={setAcceptedTerms}
                            color={acceptedTerms ? Colors.primary : undefined}
                        />
                        <Text style={{ marginLeft: 8, color: Colors.textSecondary, fontFamily: Fonts.Poppins_Regular }}>
                            Şərtləri və qaydaları qəbul edirəm
                        </Text>
                    </View> */}

                    {/* Buttons */}
                    <View style={{ marginTop: 24 }}>
                        <CustomButton
                            title="Qeydiyyatdan keç"
                            onPress={handleRegister}
                            loading={isSubmitting}
                            disabled={!isFormValid || isSubmitting}
                        />
                    </View>

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>
                            Artıq hesabım var
                        </Text>
                        <TouchableOpacity
                            onPress={goToLogin}
                            style={{ marginLeft: 6 }}
                        >
                            <Text
                                style={{ color: Colors.primary, fontFamily: Fonts.Poppins_SemiBold, fontSize: 17 }}>
                                Daxil ol
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
        // padding: 20,
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
        backgroundColor: "#ffffff",
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
        fontSize: 17,
    },
});
