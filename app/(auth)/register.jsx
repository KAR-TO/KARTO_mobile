import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export default function RegisterScreen() {
    const [toggleSecureEntry, setToggleSecureEntry] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const countries = [
        { code: '+994', label: 'AZ' },
        { code: '+90', label: 'TR' },
        { code: '+995', label: 'GE' },
        { code: '+7', label: 'RU' },
        { code: '+1', label: 'US' },
    ];
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);

    const isStrongPassword = useCallback((value) => value.trim().length >= 6, []);
    const [touched, setTouched] = useState({ 
        username: false, 
        password: false, 
        email: false, 
        phone: false 
    });

    const usernameError = useMemo(() => {
        if (!touched.username) return '';
        if (!username.trim()) return 'Tam adınızı daxil edin';
        if (username.trim().length < 2) return 'Ad ən az 2 simvoldan ibarət olmalıdır';
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
        const validGeneric = /^\d{7,12}$/.test(phoneNumber);
        if (!validGeneric) return 'Telefon nömrəsi düzgün formatda deyil';
        return '';
    }, [phoneNumber, selectedCountry.code, touched.phone]);

    const isFormValid = useMemo(() => {
        return !usernameError && !passwordError && !emailError && !phoneError && acceptedTerms;
    }, [usernameError, passwordError, emailError, phoneError, acceptedTerms]);

    const onBlurUserName = useCallback(() => setTouched((s) => ({ ...s, username: true })), []);
    const onBlurPassword = useCallback(() => setTouched((s) => ({ ...s, password: true })), []);
    const onBlurEmail = useCallback(() => setTouched((s) => ({ ...s, email: true })), []);
    const onBlurPhone = useCallback(() => setTouched((s) => ({ ...s, phone: true })), []);

    const handleRegister = async () => {
        setTouched({ username: true, password: true, email: true, phone: true });

        if (!isFormValid) {
            Alert.alert('Xəta', 'Zəhmət olmasa, formu düzgün doldurun və şərtləri qəbul edin.');
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
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                extraScrollHeight={20}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <View style={styles.logoCircle}>
                                <Text style={styles.logoText}>K</Text>
                            </View>
                        </View>
                        <Text style={styles.welcomeText}>Qeydiyyat</Text>
                        <Text style={styles.subtitleText}>Yeni hesab yaradın</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Tam adınız</Text>
                            <View style={[styles.inputWrapper, usernameError && styles.inputError]}>
                                <Ionicons 
                                    name="person-outline" 
                                    size={20} 
                                    color={usernameError ? Colors.error : Colors.textSecondary} 
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    placeholder="Ad və soyadınızı daxil edin"
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

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Elektron poçt</Text>
                            <View style={[styles.inputWrapper, emailError && styles.inputError]}>
                                <Ionicons 
                                    name="mail-outline" 
                                    size={20} 
                                    color={emailError ? Colors.error : Colors.textSecondary} 
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    placeholder="example@gmail.com"
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

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Telefon nömrə</Text>
                            <View style={[styles.inputWrapper, phoneError && styles.inputError]}>
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

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Şifrə</Text>
                            <View style={[styles.inputWrapper, passwordError && styles.inputError]}>
                                <Ionicons 
                                    name="lock-closed-outline" 
                                    size={20} 
                                    color={passwordError ? Colors.error : Colors.textSecondary} 
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    placeholder="Güclü şifrə yaradın"
                                    placeholderTextColor={Colors.placeholder}
                                    keyboardType="default"
                                    style={styles.input}
                                    secureTextEntry={toggleSecureEntry}
                                    onBlur={onBlurPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setToggleSecureEntry(!toggleSecureEntry)}
                                >
                                    <Ionicons
                                        name={toggleSecureEntry ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color={Colors.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>
                            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                        </View>

                        <View style={styles.termsContainer}>
                            <TouchableOpacity 
                                style={styles.checkboxContainer}
                                onPress={() => setAcceptedTerms(!acceptedTerms)}
                            >
                                <View style={[styles.checkbox, acceptedTerms && styles.checkboxActive]}>
                                    {acceptedTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
                                </View>
                                <Text style={styles.termsText}>
                                    <Text style={styles.termsTextNormal}>Şərtləri və qaydaları </Text>
                                    <Text style={styles.termsTextLink}>qəbul edirəm</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <CustomButton
                            title="Qeydiyyatdan keç"
                            onPress={handleRegister}
                            loading={isSubmitting}
                            disabled={!isFormValid || isSubmitting}
                        />
                    </View>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>
                            Artıq hesabınız var?
                        </Text>
                        <TouchableOpacity onPress={goToLogin}>
                            <Text style={styles.loginLink}>
                                Daxil ol
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.socialContainer}>
                        <Text style={styles.socialText}>və ya</Text>
                        <View style={styles.socialButtons}>
                            <TouchableOpacity style={styles.socialButton}>
                                <Ionicons name="logo-google" size={24} color="#DB4437" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <Ionicons name="logo-apple" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    logoContainer: {
        marginBottom: 15,
    },
    logoCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    logoText: {
        fontSize: 28,
        fontFamily: Fonts.MPlusRegular,
        color: '#fff',
        fontWeight: 'bold',
    },
    welcomeText: {
        fontSize: 22,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.primary,
        marginBottom: 6,
    },
    subtitleText: {
        fontSize: 14,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
    },
    formContainer: {
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 13,
        color: Colors.textPrimary,
        marginBottom: 6,
        fontFamily: Fonts.Poppins_SemiBold,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: 14,
        height: 48,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    inputError: {
        borderColor: Colors.error,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: Colors.textPrimary,
        fontFamily: Fonts.Poppins_Regular,
    },
    eyeIcon: {
        padding: 4,
    },
    errorText: {
        marginTop: 4,
        color: Colors.error,
        fontSize: 11,
        fontFamily: Fonts.Poppins_Regular,
    },
    termsContainer: {
        marginTop: 8,
        marginBottom: 15,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: Colors.border,
        marginRight: 10,
        marginTop: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    termsText: {
        flex: 1,
        fontSize: 13,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
        lineHeight: 18,
    },
    termsTextNormal: {
        color: Colors.textSecondary,
    },
    termsTextLink: {
        color: Colors.primary,
        fontFamily: Fonts.Poppins_SemiBold,
    },
    buttonContainer: {
        marginBottom: 20,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    loginText: {
        color: Colors.textSecondary,
        fontFamily: Fonts.Poppins_Regular,
        fontSize: 14,
    },
    loginLink: {
        color: Colors.primary,
        fontFamily: Fonts.Poppins_SemiBold,
        fontSize: 14,
        marginLeft: 6,
    },
    socialContainer: {
        alignItems: 'center',
        marginBottom: 25,
    },
    socialText: {
        fontSize: 13,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
        marginBottom: 15,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
    },
    socialButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});