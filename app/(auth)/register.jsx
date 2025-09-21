import { useRouter } from 'expo-router';
import {
    Alert, StyleSheet, Text, TextInput,
    TouchableOpacity,
    View,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { Colors, Fonts } from '../../constants/theme';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState, useMemo, useCallback } from 'react';
import CustomButton from '../../components/CustomButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default function RegisterScreen() {
    const [toggleSecureEntry, setToggleSecureEntry] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

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
        if (!phone.trim()) return 'Telefon nömrəsini daxil edin';
        if (!/^\+994\d{9}$/.test(phone)) return 'Telefon nömrəsi düzgün formatda deyil';
        return '';
    }, [phone, touched.phone]);

    const isFormValid = useMemo(() => {
        return !usernameError && !passwordError && !emailError && !phoneError;
    }, [usernameError, passwordError, emailError, phoneError]);

    const onBlurUserName = useCallback(() => setTouched((s) => ({ ...s, username: true })), []);
    const onBlurPassword = useCallback(() => setTouched((s) => ({ ...s, password: true })), []);
    const onBlurEmail = useCallback(() => setTouched((s) => ({ ...s, email: true })), []);
    const onBlurPhone = useCallback(() => setTouched((s) => ({ ...s, phone: true })), []);

    const handleLogin = async () => {
        setTouched({ username: true, password: true, email: true, phone: true });

        if (!isFormValid) {
            Alert.alert('Xəta', 'Zəhmət olmasa, formu düzgün doldurun.');
            return;
        }

        try {
            setIsSubmitting(true);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            router.replace('/(tabs)/home');
        } catch (error) {
            Alert.alert('Xəta', 'Daxil olmaq alınmadı.');
        } finally {
            setIsSubmitting(false);
        }
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
                                <TextInput
                                    placeholder="+994 XX XXX XX XX"
                                    placeholderTextColor={Colors.placeholder}
                                    keyboardType="phone-pad"
                                    style={styles.input}
                                    value={phone}
                                    onChangeText={setPhone}
                                    onBlur={onBlurPhone}
                                />
                            </View>
                            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
                        </View>
                    </View>

                    {/* Buttons */}
                    <View style={{ marginTop: 40 }}>
                        <CustomButton
                            title="Qeydiyyatdan keç"
                            // onPress={handleLogin}
                            loading={isSubmitting}
                            disabled={!isFormValid || isSubmitting}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <CustomButton
                            title="Daxil olmaq"
                            // onPress={() => router.replace('/(tabs)/home')}
                            color={Colors.primary}
                            backgroundColor={Colors.inputBackground}
                        />
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
        paddingHorizontal: 12,
        backgroundColor: "#ffffff",
    },
    input: {
        flex: 1,
        height: 48,
        fontSize: 14,
        color: Colors.textPrimary,
        fontFamily: Fonts.Poppins_Regular,
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
});
