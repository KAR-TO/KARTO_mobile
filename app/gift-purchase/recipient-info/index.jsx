import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../../../constants/theme';

export default function RecipientInfoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const { brand, category, price, recipient } = params;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ad daxil edin';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon nömrəsi daxil edin';
    } else if (!/^\d{9,12}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Düzgün telefon nömrəsi daxil edin';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email daxil edin';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Düzgün email formatı daxil edin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleContinue = () => {
    if (validateForm()) {
      router.push({
        pathname: '/gift-purchase/gift-amount',
        params: { 
          brand, 
          category, 
          price,
          recipient,
          recipientInfo: JSON.stringify(formData)
        }
      });
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Qəbul edən məlumatları</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.brandInfo}>
          <Text style={styles.brandName}>{brand}</Text>
          <Text style={styles.brandCategory}>{category}</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Hədiyyəni kim alacaq?</Text>
          <Text style={styles.formSubtitle}>Qəbul edənin məlumatlarını daxil edin</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ad və soyad *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Ad və soyad daxil edin"
              placeholderTextColor={Colors.placeholder}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefon nömrəsi *</Text>
            <View style={styles.phoneInputContainer}>
              <Text style={styles.phonePrefix}>+994</Text>
              <TextInput
                style={[styles.phoneInput, errors.phone && styles.inputError]}
                placeholder="501234567"
                placeholderTextColor={Colors.placeholder}
                keyboardType="numeric"
                value={formData.phone}
                onChangeText={(value) => {
                  const digits = value.replace(/\D/g, '').slice(0, 9);
                  handleInputChange('phone', digits);
                }}
                maxLength={9}
              />
            </View>
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="example@gmail.com"
              placeholderTextColor={Colors.placeholder}
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Hədiyyə mesajı (istəyə bağlı)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Hədiyyə üçün xüsusi mesaj yazın..."
              placeholderTextColor={Colors.placeholder}
              multiline
              numberOfLines={4}
              value={formData.message}
              onChangeText={(value) => handleInputChange('message', value)}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            (!formData.name || !formData.phone || !formData.email) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!formData.name || !formData.phone || !formData.email}
        >
          <Text style={styles.continueButtonText}>Davam et</Text>
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="lock-closed" size={20} color={Colors.success} />
            <Text style={styles.infoText}>Məlumatlarınız təhlükəsizdir</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="mail" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>Hədiyyə kodu email ilə göndəriləcək</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  brandInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  brandName: {
    fontSize: 24,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  brandCategory: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 20,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  phonePrefix: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textPrimary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.error,
    marginTop: 4,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 30,
  },
  continueButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_SemiBold,
    color: '#fff',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});