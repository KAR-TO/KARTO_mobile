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
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../../components/CustomButton';
import { Colors, Fonts } from '../../constants/theme';

export default function LoginScreen() {
    const [toggleSecureEntry, setToggleSecureEntry] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [remember, setRemember] = useState(false);
    const router = useRouter();

    const [password, setPassword] = useState('');
    const [identifier, setIdentifier] = useState(''); // email və ya phone

    const isStrongPassword = useCallback((value) => value.trim().length >= 6, []);
    const [touched, setTouched] = useState({ password: false, identifier: false });

    const passwordError = useMemo(() => {
        if (!touched.password) return '';
        if (!password.trim()) return 'Şifrə daxil edin';
        if (!isStrongPassword(password)) return 'Şifrə ən az 6 simvoldan ibarət olmalıdır';
        return '';
    }, [password, isStrongPassword, touched.password]);

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

    const isFormValid = useMemo(() => {
        return !passwordError && !identifierError && !!identifier && !!password;
    }, [passwordError, identifierError, identifier, password]);

    const onBlurPassword = useCallback(() => setTouched((s) => ({ ...s, password: true })), []);
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
                router.replace("/(tabs)/home");
            } else {
                Alert.alert("Xəta", "Email/Telefon və ya şifrə yanlışdır.");
            }
        } catch (_error) {
            Alert.alert("Xəta", "Daxil olmaq alınmadı.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const goToRegister = () => router.replace('/(auth)/register');

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
                        <Text style={styles.welcomeText}>Xoş gəldiniz!</Text>
                        <Text style={styles.subtitleText}>Hesabınıza daxil olun</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email və ya Telefon</Text>
                            <View style={[styles.inputWrapper, identifierError && styles.inputError]}>
                                <Ionicons 
                                    name="person-outline" 
                                    size={20} 
                                    color={identifierError ? Colors.error : Colors.textSecondary} 
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    placeholder="Email və ya nömrə daxil edin"
                                    placeholderTextColor={Colors.placeholder}
                                    keyboardType="default"
                                    style={styles.input}
                                    value={identifier}
                                    onChangeText={setIdentifier}
                                    onBlur={onBlurIdentifier}
                                />
                            </View>
                            {identifierError ? <Text style={styles.errorText}>{identifierError}</Text> : null}
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
                                    placeholder="Şifrənizi daxil edin"
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

                        <View style={styles.optionsContainer}>
                            <TouchableOpacity 
                                style={styles.rememberContainer}
                                onPress={() => setRemember(!remember)}
                            >
                                <View style={[styles.checkbox, remember && styles.checkboxActive]}>
                                    {remember && <Ionicons name="checkmark" size={16} color="#fff" />}
                                </View>
                                <Text style={styles.rememberText}>Məni xatırla</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity>
                                <Text style={styles.forgotText}>Şifrəni unutdum?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
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
                        <TouchableOpacity onPress={goToRegister}>
                            <Text style={styles.registerLink}>
                                Qeydiyyatdan keç
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
        marginTop: 40,
        marginBottom: 25,
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
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: Colors.border,
        marginRight: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    rememberText: {
        fontSize: 13,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
    },
    forgotText: {
        fontSize: 13,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.primary,
    },
    buttonContainer: {
        marginBottom: 20,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    registerText: {
        color: Colors.textSecondary,
        fontFamily: Fonts.Poppins_Regular,
        fontSize: 14,
    },
    registerLink: {
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