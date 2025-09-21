import { useRouter } from 'expo-router';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../../constants/theme';
import AntDesign from '@expo/vector-icons/AntDesign';
import  { useState, useMemo } from 'react';

export default function LoginScreen() {
    const [toggleSecureEntry, setToggleSecureEntry] = useState(true);
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState(''); 

//     const usernameError = useMemo(() => {
//     if (!touched.username) return '';
//     if (!username.trim()) return t('Username is required');
//     return '';
//   }, [username, t, touched.username]);

//   const passwordError = useMemo(() => {
//     if (!touched.password) return '';
//     if (!password.trim()) return t('Password is required');
//     if (!isStrongPassword(password)) return t('Password must be at least 6 characters');
//     return '';
//   }, [password, isStrongPassword, t, touched.password]);

//   const companyError = useMemo(() => {
//     if (!touched.company) return '';
//     if (!selectedCompany) return t('Please select a company');
//     return '';
//   }, [selectedCompany, t, touched.company]);

//   const isFormValid = useMemo(() => {
//     return !usernameError && !passwordError && !companyError;
//   }, [usernameError, passwordError, companyError]);



    const handleLogin = () => {
        router.replace('/(tabs)/home');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Xoş gəldiniz!</Text>
            </View>
            <View style={styles.context}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Tam adınız</Text>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="Burada yazın"
                            placeholderTextColor={Colors.placeholder}
                            keyboardType="default"
                            style={styles.input}
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Şifrə</Text>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="********"
                            placeholderTextColor={Colors.placeholder}
                            keyboardType="phone-pad"
                            style={styles.input}
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
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Elektron poçt</Text>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="***@gmail.com"
                            placeholderTextColor={Colors.placeholder}
                            keyboardType="email-address"
                            style={styles.input}
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Telefon nömrə</Text>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="+994 XX XXX XX XX"
                            placeholderTextColor={Colors.placeholder}
                            keyboardType="phone-pad"
                            style={styles.input}
                        />
                    </View>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
        backgroundColor: Colors.inputBackground,
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
});